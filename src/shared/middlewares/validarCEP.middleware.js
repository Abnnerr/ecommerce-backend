const AppError = require("../../shared/errors/AppError");

function validarCEP(req, _res, next) {
  try {
    const { cep } = req.body;

    if (cep === undefined || cep === null || String(cep).trim() === "") {
      throw new AppError("O campo cep é obrigatório", 400);
    }

    const cepNormalizado = String(cep).replace(/\D/g, "");

    if (!/^\d{8}$/.test(cepNormalizado)) {
      throw new AppError("O campo cep deve conter exatamente 8 números", 400);
    }

    req.body.cep = cepNormalizado;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = validarCEP;