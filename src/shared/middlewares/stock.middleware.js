const prisma = require("../../database/prisma");
const AppError = require("../errors/AppError");
 

const mockProducts = [
  { id: 1, name: "Produto A", stock: 10 },
  { id: 2, name: "Produto B", stock: 5 },
  { id: 3, name: "Produto C", stock: 20 },
];

async function validateStock(req, res, next) {
  try {
    const { itens } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      return next(new AppError("Itens são obrigatórios para validar estoque", 400));
    }

    const seenProducts = new Set();

    for (const item of itens) {
      const { produto_id, quantidade } = item;

      if (typeof produto_id !== "number" || typeof quantidade !== "number") {
        return next(new AppError("produto_id e quantidade devem ser números", 400));
      }

      if (quantidade <= 0) {
        return next(new AppError("quantidade deve ser maior que zero", 400));
      }

      if (seenProducts.has(produto_id)) {
        return next(new AppError("Produto duplicado no pedido", 400));
      }

      seenProducts.add(produto_id);

      // Buscar produto no banco
      const product = await prisma.produtos.findUnique({
        where: { id: produto_id },
      });

      if (!product) {
        return next(new AppError(`Produto com id ${produto_id} não encontrado`, 404));
      }

      if (product.estoque < quantidade) {
        return next(
          new AppError(
            `Estoque insuficiente para ${product.nome}. Disponível: ${product.estoque}`,
            400
          )
        );
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateStock;
