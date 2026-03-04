const prisma = require("../../database/prisma");

class CategoryService {
  static async create(data) {
    return await prisma.categoria.create({ data });
  }

  static async findAll() {
    return await prisma.categoria.findMany({ include: { produtos: true } });
  }

  static async findById(id) {
    return await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: { produtos: true }
    });
  }

  static async update(id, data) {
    return await prisma.categoria.update({
      where: { id: parseInt(id) },
      data
    });
  }

  static async delete(id) {
    return await prisma.categoria.delete({ where: { id: parseInt(id) } });
  }
}

module.exports = CategoryService;
