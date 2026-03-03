const ProductService = require("./product.service");

class ProductController {
  static async create(req, res) {
    try {
      const resultado = await ProductService.create(req.body);
      
      if (!resultado.sucesso) {
        return res.status(400).json({ erro: resultado.erro });
      }
      
      res.status(201).json(resultado.dados);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const resultado = await ProductService.findAll();
      
      if (!resultado.sucesso) {
        return res.status(400).json({ erro: resultado.erro });
      }
      
      res.status(200).json(resultado.dados);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ProductService.findById(id);

      if (!resultado.sucesso) {
        return res.status(404).json({ erro: resultado.erro });
      }

      res.status(200).json(resultado.dados);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ProductService.update(id, req.body);

      if (!resultado.sucesso) {
        return res.status(404).json({ erro: resultado.erro });
      }

      res.status(200).json(resultado.dados);
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ProductService.delete(id);

      if (!resultado.sucesso) {
        return res.status(404).json({ erro: resultado.erro });
      }

      res.status(200).json({ mensagem: resultado.mensagem });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  static async atualizarTamanhos(req, res) {
    try {
      const { id } = req.params;
      const { tamanhos } = req.body;

      if (!Array.isArray(tamanhos)) {
        return res.status(400).json({ 
          erro: "O campo 'tamanhos' deve ser um array" 
        });
      }

      const resultado = await ProductService.atualizarTamanhos(id, tamanhos);

      if (!resultado.sucesso) {
        return res.status(400).json({ erro: resultado.erro });
      }

      res.status(200).json(resultado.dados);
    } catch (error) {
      res.status(500).json({ erro: error.message });
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