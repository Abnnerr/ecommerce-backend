const AppError = require("../errors/AppError");

const mockProducts = [
  { id: 1, name: "Produto A", stock: 10 },
  { id: 2, name: "Produto B", stock: 5 },
  { id: 3, name: "Produto C", stock: 20 },
];

function validateStock(req, res, next) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      const error = new AppError(
        "Items são obrigatórios para validar estoque",
        400,
      );
      error.status = 400;
      return next(error);
    }

    const seenProducts = new Set();

    for (const item of items) {
      const { productId, quantity } = item;

      if (typeof productId !== "number" || typeof quantity !== "number") {
        const error = new AppError(
          "productId e quantity devem ser números",
          400,
        );
        return next(error);
      }

      if (quantity <= 0) {
        const error = new AppError("quantity deve ser maior que zero", 400);
        return next(error);
      }

      if (seenProducts.has(productId)) {
        const error = new AppError("Produto duplicado no pedido", 400);
        return next(error);
      }

      seenProducts.add(productId);

      const product = mockProducts.find((p) => p.id === productId);

      if (!product) {
        const error = new AppError(
          `Produto com id ${productId} não encontrado`,
          404,
        );

        return next(error);
      }

      if (product.stock < quantity) {
        const error = new AppError(
          `Estoque insuficiente para ${product.name}`,
          400,
        );
        return next(error);
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = validateStock;
