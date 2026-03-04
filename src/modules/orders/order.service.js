const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class OrderService {
  static async create(userId, data) {
    const { items, endereco, cupomId } = data;

    let total = 0;
    for (const item of items) {
      const produto = await prisma.produtos.findUnique({
        where: { id: parseInt(item.produtoId) }
      });
      
      if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);
      
      const preco = parseFloat(produto.valor);
      total += preco * item.quantidade;
    }

    const pedido = await prisma.pedidos.create({
      data: {
        usuario_id: parseInt(userId),
        status: "pendente",
        valor_total: total.toFixed(2),
        valor_desc: "0",
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento || "",
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        previsao_entrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        cupom_id: cupomId ? parseInt(cupomId) : null
      }
    });

    for (const item of items) {
      await prisma.pedido_produto.create({
        data: {
          id_produto: parseInt(item.produtoId),
          id_pedido: pedido.id
        }
      });
    }

    return serialize(pedido);
  }

  static async findAll(userId, isAdmin = false) {
    const where = isAdmin ? {} : { usuario_id: parseInt(userId) };

    const pedidos = await prisma.pedidos.findMany({
      where,
      include: {
        usuarios: {
          select: { id: true, nome: true, email: true }
        },
        pedido_produto: {
          include: {
            produtos: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });

    return serialize(pedidos);
  }

  static async findById(id, userId, isAdmin = false) {
    const pedido = await prisma.pedidos.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuarios: {
          select: { id: true, nome: true, email: true }
        },
        pedido_produto: {
          include: {
            produtos: true
          }
        }
      }
    });

    if (!pedido) throw new Error("Pedido não encontrado");
    
    if (!isAdmin && pedido.usuario_id !== parseInt(userId)) {
      throw new Error("Acesso negado");
    }

    return serialize(pedido);
  }

  static async updateStatus(id, status, isAdmin = false) {
    if (!isAdmin) throw new Error("Apenas administradores");

    const pedido = await prisma.pedidos.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    return serialize(pedido);
  }

  static async delete(id, isAdmin = false) {
    if (!isAdmin) throw new Error("Apenas administradores");

    await prisma.pedido_produto.deleteMany({
      where: { id_pedido: parseInt(id) }
    });

    await prisma.pedidos.delete({
      where: { id: parseInt(id) }
    });

    return { mensagem: "Pedido deletado com sucesso" };
  }
}

module.exports = OrderService;