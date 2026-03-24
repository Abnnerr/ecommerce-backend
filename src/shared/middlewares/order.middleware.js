const AppError = require("../../shared/errors/AppError");

function validarTextoObrigatorio(valor, campo) {
  if (valor === undefined || valor === null || String(valor).trim() === "") {
    throw new AppError(`${campo} é obrigatório`, 400);
  }

  if (typeof valor !== "string") {
    throw new AppError(`${campo} deve ser texto`, 400);
  }
}

function validarTextoOpcional(valor, campo) {
  if (valor === undefined || valor === null) return;

  if (typeof valor !== "string") {
    throw new AppError(`${campo} deve ser texto`, 400);
  }
}

function validarDadosPedido(req, _res, next) {
  try {
    const {
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      cep,
      cod_rastreio,
      previsao_entrega,
      cupom_id,
      couponId,
      status,
    } = req.body;

    validarTextoObrigatorio(logradouro, "logradouro");
    validarTextoObrigatorio(numero, "numero");
    validarTextoObrigatorio(bairro, "bairro");
    validarTextoObrigatorio(cidade, "cidade");
    validarTextoObrigatorio(estado, "estado");

    validarTextoOpcional(complemento, "complemento");
    validarTextoOpcional(cod_rastreio, "cod_rastreio");

    const cupomIdNormalizado = cupom_id ?? couponId;

    if (
      cupomIdNormalizado !== undefined &&
      cupomIdNormalizado !== null &&
      cupomIdNormalizado !== ""
    ) {
      if (isNaN(cupomIdNormalizado) || Number(cupomIdNormalizado) <= 0) {
        throw new AppError("cupom_id inválido", 400);
      }

      req.body.cupom_id = Number(cupomIdNormalizado);
    }

    if (status !== undefined && typeof status !== "string") {
      throw new AppError("status deve ser texto", 400);
    }

    if (previsao_entrega !== undefined && isNaN(new Date(previsao_entrega).getTime())) {
      throw new AppError("previsao_entrega inválida", 400);
    }

    if (cep !== undefined && cep !== null) {
      const cepNormalizado = String(cep).replace(/\D/g, "");
      if (!/^\d{8}$/.test(cepNormalizado)) {
        throw new AppError("O campo cep deve conter exatamente 8 números", 400);
      }
      req.body.cep = cepNormalizado;
    }

    next();
  } catch (error) {
    next(error);
  }
}

function validarAtualizacaoPedido(req, _res, next) {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Nenhum dado informado para atualização", 400);
    }

    const camposPermitidos = [
      "status",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cidade",
      "estado",
      "cep",
      "cod_rastreio",
      "previsao_entrega",
    ];

    const camposRecebidos = Object.keys(body);
    const campoInvalido = camposRecebidos.find(
      (campo) => !camposPermitidos.includes(campo)
    );

    if (campoInvalido) {
      throw new AppError(`Campo não permitido na atualização: ${campoInvalido}`, 400);
    }

    if (body.status !== undefined && typeof body.status !== "string") {
      throw new AppError("status deve ser texto", 400);
    }

    if (body.logradouro !== undefined) validarTextoObrigatorio(body.logradouro, "logradouro");
    if (body.numero !== undefined) validarTextoObrigatorio(body.numero, "numero");
    if (body.bairro !== undefined) validarTextoObrigatorio(body.bairro, "bairro");
    if (body.cidade !== undefined) validarTextoObrigatorio(body.cidade, "cidade");
    if (body.estado !== undefined) validarTextoObrigatorio(body.estado, "estado");

    validarTextoOpcional(body.complemento, "complemento");
    validarTextoOpcional(body.cod_rastreio, "cod_rastreio");

    if (body.cep !== undefined) {
      const cepNormalizado = String(body.cep).replace(/\D/g, "");
      if (!/^\d{8}$/.test(cepNormalizado)) {
        throw new AppError("O campo cep deve conter exatamente 8 números", 400);
      }
      req.body.cep = cepNormalizado;
    }

    if (body.previsao_entrega !== undefined) {
      const data = new Date(body.previsao_entrega);
      if (isNaN(data.getTime())) {
        throw new AppError("O campo previsao_entrega deve ser uma data válida", 400);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validarDadosPedido,
  validarAtualizacaoPedido,
};