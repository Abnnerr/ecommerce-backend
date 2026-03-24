const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class OrderRepository {
  async create(data) {
    const order = await prisma.pedidos.create({ data });
    return serialize(order);
  }

  async createOrderItems(orderId, items) {
    const data = [];

    for (const item of items) {
      for (let i = 0; i < Number(item.quantity); i++) {
        data.push({
          id_pedido: Number(orderId),
          id_produto: Number(item.productId),
        });
      }
    }

    if (data.length > 0) {
      await prisma.pedido_produto.createMany({ data });
    }

    const orderItems = await prisma.pedido_produto.findMany({
      where: { id_pedido: Number(orderId) },
    });

    return serialize(orderItems);
  }

  async findAll(userId, isAdmin = false) {
    const where = isAdmin ? {} : { usuario_id: Number(userId) };

    const orders = await prisma.pedidos.findMany({
      where,
      include: {
        usuarios: {
          select: { id: true, nome: true, email: true }
        },
        cupons: {
          select: { id: true, nome: true, valor_desc: true }
        },
        pedido_produto: {
          include: {
            produtos: true
          }
        }
      },
      orderBy: { id: "desc" }
    });

    return serialize(orders);
  }

  async findById(id) {
    const order = await prisma.pedidos.findUnique({
      where: { id: Number(id) },
      include: {
        usuarios: {
          select: { id: true, nome: true, email: true }
        },
        cupons: {
          select: { id: true, nome: true, valor_desc: true }
        },
        pedido_produto: {
          include: {
            produtos: true
          }
        }
      }
    });

    return serialize(order);
  }

  async update(id, data) {
    const order = await prisma.pedidos.update({
      where: { id: Number(id) },
      data
    });

    return serialize(order);
  }

  async updateStatus(id, status) {
    const order = await prisma.pedidos.update({
      where: { id: Number(id) },
      data: { status }
    });

    return serialize(order);
  }

  async deleteOrderItems(orderId) {
    await prisma.pedido_produto.deleteMany({
      where: { id_pedido: Number(orderId) }
    });
  }

  async delete(id) {
    await this.deleteOrderItems(id);

    await prisma.pedidos.delete({
      where: { id: Number(id) }
    });

    return true;
  }

  async getProductById(id) {
    const product = await prisma.produtos.findUnique({
      where: { id: Number(id) },
      select: { id: true, nome: true, valor: true, estoque: true }
    });

    return serialize(product);
  }

  async updateProductStock(productId, quantity, operation = "decrement") {
    const data =
      operation === "decrement"
        ? { estoque: { decrement: BigInt(quantity) } }
        : { estoque: { increment: BigInt(quantity) } };

    const product = await prisma.produtos.update({
      where: { id: Number(productId) },
      data
    });

    return serialize(product);
  }

  async getCouponById(id) {
    const coupon = await prisma.cupons.findUnique({
      where: { id: Number(id) }
    });

    return serialize(coupon);
  }

  async decrementCouponQuantity(id) {
    const coupon = await prisma.cupons.update({
      where: { id: Number(id) },
      data: { quantidade: { decrement: 1 } }
    });

    return serialize(coupon);
  }

  async incrementCouponQuantity(id) {
    const coupon = await prisma.cupons.update({
      where: { id: Number(id) },
      data: { quantidade: { increment: 1 } }
    });

    return serialize(coupon);
  }
}

module.exports = OrderRepository;