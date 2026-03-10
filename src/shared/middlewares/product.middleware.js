const AppError = require("../../shared/errors/AppError");

function validarProduto(req, res, next) {
  try {
    const {
      nome,
      valor,
      descricao,
      desconto,
      estoque,
      categoria_id,
      tamanhos,
      cores,
      altura,
      largura,
      comprimento,
      peso
    } = req.body;

    // Nome
    if (!nome || typeof nome !== "string") {
      throw new AppError("Nome do produto é obrigatório e deve ser texto", 400);
    }

    if (nome.length < 3) {
      throw new AppError("Nome deve ter pelo menos 3 caracteres", 400);
    }

    // Valor
    if (valor === undefined || isNaN(valor)) {
      throw new AppError("Valor deve ser um número", 400);
    }

    // Desconto
    if (desconto !== undefined && isNaN(desconto)) {
      throw new AppError("Desconto deve ser um número", 400);
    }

    // Estoque
    if (estoque !== undefined && isNaN(estoque)) {
      throw new AppError("Estoque deve ser um número inteiro", 400);
    }

    // Categoria
    if (!categoria_id || isNaN(categoria_id)) {
      throw new AppError("categoria_id deve ser um número", 400);
    }

    // Tamanhos
    if (tamanhos && !Array.isArray(tamanhos)) {
      throw new AppError("Tamanhos deve ser um array", 400);
    }

    // Cores
    if (cores && !Array.isArray(cores)) {
      throw new AppError("Cores deve ser um array", 400);
    }

    // Dimensões
    if (altura && isNaN(altura)) {
      throw new AppError("Altura deve ser número", 400);
    }

    if (largura && isNaN(largura)) {
      throw new AppError("Largura deve ser número", 400);
    }

    if (comprimento && isNaN(comprimento)) {
      throw new AppError("Comprimento deve ser número", 400);
    }

    if (peso && isNaN(peso)) {
      throw new AppError("Peso deve ser número", 400);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validarProduto
};