const AppError = require("../../shared/errors/AppError");

function validarPedido(req, _res, next) {
  try {
    const rawItems = req.body.items ?? req.body.itens;

    if (rawItems === undefined || rawItems === null) {
      throw new AppError("O campo items é obrigatório", 400);
    }

    if (!Array.isArray(rawItems)) {
      throw new AppError("O campo items deve ser um array", 400);
    }

    if (rawItems.length === 0) {
      throw new AppError("O pedido deve conter pelo menos 1 item", 400);
    }

    const ids = new Set();

    const itemsNormalizados = rawItems.map((item, index) => {
      const productId = item.productId ?? item.produto_id;
      const quantity = item.quantity ?? item.quantidade;

      if (productId === undefined || productId === null) {
        throw new AppError(`Item ${index + 1}: o campo productId é obrigatório`, 400);
      }

      if (quantity === undefined || quantity === null) {
        throw new AppError(`Item ${index + 1}: o campo quantity é obrigatório`, 400);
      }

      if (isNaN(productId) || Number(productId) <= 0) {
        throw new AppError(`Item ${index + 1}: o campo productId deve ser um número válido`, 400);
      }

      if (isNaN(quantity) || Number(quantity) <= 0) {
        throw new AppError(`Item ${index + 1}: o campo quantity deve ser um número maior que zero`, 400);
      }

      const normalizedProductId = Number(productId);

      if (ids.has(normalizedProductId)) {
        throw new AppError(`Item ${index + 1}: produto duplicado no pedido`, 400);
      }

      ids.add(normalizedProductId);

      return {
        productId: normalizedProductId,
        quantity: Number(quantity),
      };
    });

    req.body.items = itemsNormalizados;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarPedido;