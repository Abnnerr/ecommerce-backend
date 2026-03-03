const prisma = require("../../database/prisma");

class ReviewService {
  static async create(data) {
    return await prisma.avaliacoes.create({
      data: {
        nota: BigInt(data.nota),
        descricao: data.descricao,
        usuario_id: parseInt(data.usuario_id),
        produto_id: parseInt(data.produto_id)
      },
      include: { usuarios: true, produtos: true }
    });
  }

  static async findAll() {
    return await prisma.avaliacoes.findMany({
      include: { usuarios: true, produtos: true }
    });
  }

  static async findById(id) {
    return await prisma.avaliacoes.findUnique({
      where: { id: parseInt(id) },
      include: { usuarios: true, produtos: true }
    });
  }

  static async findByProduct(productId) {
    return await prisma.avaliacoes.findMany({
      where: { produto_id: parseInt(productId) },
      include: { usuarios: true }
    });
  }

  static async update(id, data) {
    return await prisma.avaliacoes.update({
      where: { id: parseInt(id) },
      data: {
        nota: data.nota ? BigInt(data.nota) : undefined,
        descricao: data.descricao
      }
    });
  }

  static async delete(id) {
    return await prisma.avaliacoes.delete({ where: { id: parseInt(id) } });
  }
}

module.exports = ReviewService;
