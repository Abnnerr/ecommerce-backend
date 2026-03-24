const AppError = require("../../shared/errors/AppError");
const OrderRepository = require("./order.repository");

class OrderService {
  constructor() {
    this.repository = new OrderRepository();
  }

  agruparItens(pedidoProduto = []) {
    const mapa = new Map();

    for (const item of pedidoProduto) {
      const produto = item.produtos;
      if (!produto) continue;

      if (!mapa.has(produto.id)) {
        mapa.set(produto.id, {
          productId: produto.id,
          nome: produto.nome,
          valor_unitario: Number(produto.valor),
          quantidade: 0,
          subtotal: 0,
        });
      }

      const atual = mapa.get(produto.id);
      atual.quantidade += 1;
      atual.subtotal = atual.valor_unitario * atual.quantidade;
    }

    return Array.from(mapa.values());
  }

  normalizarPedido(order) {
    if (!order) return null;

    return {
      id: order.id,
      usuario_id: order.usuario_id,
      status: order.status,
      valor_total: Number(order.valor_total),
      valor_desc: Number(order.valor_desc),
      logradouro: order.logradouro,
      numero: order.numero,
      complemento: order.complemento,
      bairro: order.bairro,
      cidade: order.cidade,
      estado: order.estado,
      cep: order.cep,
      cod_rastreio: order.cod_rastreio,
      previsao_entrega: order.previsao_entrega,
      cupom_id: order.cupom_id,
      usuario: order.usuarios || null,
      cupom: order.cupons || null,
      items: this.agruparItens(order.pedido_produto || []),
    };
  }

  async calcularItens(items) {
    let totalBruto = 0;

    for (const item of items) {
      const product = await this.repository.getProductById(item.productId);

      if (!product) {
        throw new AppError(`Produto ${item.productId} não encontrado`, 404);
      }

      if (Number(product.estoque) < Number(item.quantity)) {
        throw new AppError(`Estoque insuficiente para ${product.nome}`, 400);
      }

      totalBruto += Number(product.valor) * Number(item.quantity);
    }

    return totalBruto;
  }

  async validarCupom(cupomId) {
    if (!cupomId) return null;

    const coupon = await this.repository.getCouponById(cupomId);

    if (!coupon) {
      throw new AppError("Cupom não encontrado", 404);
    }

    if (coupon.quantidade <= 0) {
      throw new AppError("Cupom esgotado", 400);
    }

    if (new Date(coupon.validade) < new Date()) {
      throw new AppError("Cupom expirado", 400);
    }

    return coupon;
  }

  async create(data, usuario) {
    if (!usuario || !usuario.id) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const items = data.items;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("Items são obrigatórios", 400);
    }

    const totalBruto = await this.calcularItens(items);

    const coupon = await this.validarCupom(data.cupom_id);
    const valorDesc = coupon ? Number(coupon.valor_desc) : 0;
    const valorFinal = totalBruto - valorDesc > 0 ? totalBruto - valorDesc : 0;

    const hoje = new Date();
    const previsaoEntrega = data.previsao_entrega
      ? new Date(data.previsao_entrega)
      : new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7);

    const orderData = {
      usuario_id: Number(usuario.id),
      status: data.status || "pendente",
      valor_total: String(valorFinal),
      valor_desc: String(valorDesc),
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento || null,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      cep: data.cep,
      cod_rastreio: data.cod_rastreio || null,
      previsao_entrega: previsaoEntrega,
      cupom_id: coupon ? Number(coupon.id) : null,
    };

    const order = await this.repository.create(orderData);
    await this.repository.createOrderItems(order.id, items);

    for (const item of items) {
      await this.repository.updateProductStock(item.productId, item.quantity, "decrement");
    }

    if (coupon) {
      await this.repository.decrementCouponQuantity(coupon.id);
    }

    const createdOrder = await this.repository.findById(order.id);
    return this.normalizarPedido(createdOrder);
  }

  async findAll(usuario) {
    if (!usuario || !usuario.id) {
      throw new AppError("Usuário não autenticado", 401);
    }

    const isAdmin = usuario.nivel === "admin";
    const orders = await this.repository.findAll(usuario.id, isAdmin);

    return orders.map((order) => this.normalizarPedido(order));
  }

  async findById(id, usuario) {
    if (!id || isNaN(id)) {
      throw new AppError("ID do pedido inválido", 400);
    }

    const order = await this.repository.findById(id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const isAdmin = usuario.nivel === "admin";
    const isOwner = Number(order.usuario_id) === Number(usuario.id);

    if (!isAdmin && !isOwner) {
      throw new AppError("Acesso negado a este pedido", 403);
    }

    return this.normalizarPedido(order);
  }

  async update(id, data, usuario) {
    if (!id || isNaN(id)) {
      throw new AppError("ID do pedido inválido", 400);
    }

    const existingOrder = await this.repository.findById(id);

    if (!existingOrder) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const isAdmin = usuario.nivel === "admin";
    const isOwner = Number(existingOrder.usuario_id) === Number(usuario.id);

    if (!isAdmin && !isOwner) {
      throw new AppError("Acesso negado a este pedido", 403);
    }

    const updateData = {};

    if (data.logradouro !== undefined) updateData.logradouro = data.logradouro;
    if (data.numero !== undefined) updateData.numero = data.numero;
    if (data.complemento !== undefined) updateData.complemento = data.complemento;
    if (data.bairro !== undefined) updateData.bairro = data.bairro;
    if (data.cidade !== undefined) updateData.cidade = data.cidade;
    if (data.estado !== undefined) updateData.estado = data.estado;
    if (data.cep !== undefined) updateData.cep = data.cep;
    if (data.cod_rastreio !== undefined) updateData.cod_rastreio = data.cod_rastreio;
    if (data.previsao_entrega !== undefined) updateData.previsao_entrega = new Date(data.previsao_entrega);

    if (data.status !== undefined) {
      if (!isAdmin) {
        throw new AppError("Apenas administradores podem alterar o status", 403);
      }
      updateData.status = data.status;
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError("Nenhum campo válido informado para atualização", 400);
    }

    await this.repository.update(id, updateData);

    const updatedOrder = await this.repository.findById(id);
    return this.normalizarPedido(updatedOrder);
  }

  async updateStatus(id, status, usuario) {
    if (usuario.nivel !== "admin") {
      throw new AppError("Apenas administradores podem alterar o status", 403);
    }

    if (!status || typeof status !== "string") {
      throw new AppError("Status é obrigatório", 400);
    }

    const existingOrder = await this.repository.findById(id);

    if (!existingOrder) {
      throw new AppError("Pedido não encontrado", 404);
    }

    await this.repository.updateStatus(id, status);

    const updatedOrder = await this.repository.findById(id);
    return this.normalizarPedido(updatedOrder);
  }

  async delete(id, usuario) {
    if (!id || isNaN(id)) {
      throw new AppError("ID do pedido inválido", 400);
    }

    const order = await this.repository.findById(id);

    if (!order) {
      throw new AppError("Pedido não encontrado", 404);
    }

    const isAdmin = usuario.nivel === "admin";
    const isOwner = Number(order.usuario_id) === Number(usuario.id);

    if (!isAdmin && !isOwner) {
      throw new AppError("Acesso negado a este pedido", 403);
    }

    const itensAgrupados = this.agruparItens(order.pedido_produto || []);

    for (const item of itensAgrupados) {
      await this.repository.updateProductStock(item.productId, item.quantidade, "increment");
    }

    if (order.cupom_id) {
      await this.repository.incrementCouponQuantity(order.cupom_id);
    }

    await this.repository.delete(id);

    return true;
  }
}

module.exports = OrderService;