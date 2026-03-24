const AppError = require("../../shared/errors/AppError");

function validarPrevisaoEntrega(req, _res, next) {
  try {
    const { previsao_entrega } = req.body;

    if (
      previsao_entrega === undefined ||
      previsao_entrega === null ||
      previsao_entrega === ""
    ) {
      return next();
    }

    const data = new Date(previsao_entrega);

    if (isNaN(data.getTime())) {
      throw new AppError("O campo previsao_entrega deve ser uma data válida", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarPrevisaoEntrega;