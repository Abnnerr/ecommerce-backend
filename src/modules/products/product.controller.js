const AppError = require("../../shared/errors/AppError");
const ProductService = require("./product.service");

// Converter BigInt para Number no JSON
const serializeProduct = (product) => {
  if (!product) return null;
  return {
    ...product,
    desconto: product.desconto ? Number(product.desconto) : 0,
    estoque: product.estoque ? Number(product.estoque) : 0,
    avaliacoes: product.avaliacoes?.map(av => ({
      ...av,
      nota: Number(av.nota)
    }))
  };
};

class ProductController {
  static async create(req, res, next) {
    try {
      const resultado = await ProductService.create(req.body);
      return res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const resultado = await ProductService.findAll();
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await ProductService.findById(id);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await ProductService.update(id, req.body);
      return res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ProductService.delete(id);

      res.status(200).json({ mensagem: "Produto deletado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarTamanhos(req, res, next) {
    try {
      const { id } = req.params;
      const { tamanhos } = req.body;

      if (!Array.isArray(tamanhos)) {
        throw new AppError("O campo 'tamanhos' deve ser um array", 400);
      }

      const updated = await ProductService.atualizarTamanhos(id, tamanhos);

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async atualizarCores(req, res) {
  try {
    const { id } = req.params;
    const { cores } = req.body;

    if (!Array.isArray(cores)) {
      return res.status(400).json({ 
        erro: "O campo 'cores' deve ser um array" 
      });
    }

    const resultado = await ProductService.atualizarCores(id, cores);

    if (!resultado.sucesso) {
      return res.status(400).json({ erro: resultado.erro });
    }

    res.status(200).json(resultado.dados);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

}

module.exports = ProductController;
