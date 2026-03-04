const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class CategoryService {
  static async create(data) {
    const categoria = await prisma.categoria.create({ data });
    return serialize(categoria);
  }

  static async findAll() {
    const categorias = await prisma.categoria.findMany({ 
      include: { produtos: true } 
    });
    return serialize(categorias);
  }

  static async findById(id) {
    const categoria = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: { produtos: true }
    });
    return serialize(categoria);
  }

  static async update(id, data) {
    const categoria = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data
    });
    return serialize(categoria);
  }

  static async delete(id) {
    return await prisma.categoria.delete({ 
      where: { id: parseInt(id) } 
    });
  }
}

module.exports = CategoryService;