const prisma = require("../../database/prisma");
const AppError = require("../../shared/errors/AppError");

async function validateStock(req, _res, next) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError("Items são obrigatórios", 400);
    }

    const ids = items.map((item) => item.productId);

    const produtos = await prisma.produtos.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true, estoque: true },
    });

    if (produtos.length !== ids.length) {
      throw new AppError("Produto não encontrado", 404);
    }

    for (const item of items) {
      const produto = produtos.find((p) => p.id === item.productId);

      if (!produto) {
        throw new AppError("Produto não encontrado", 404);
      }

      if (produto.estoque < BigInt(item.quantity)) {
        throw new AppError(`Estoque insuficiente para ${produto.nome}`, 400);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validateStock;