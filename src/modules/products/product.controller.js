const ProductService = require("./product.service");

class ProductController {
  static async create(req, res) {
    try {
      const newProduct = await ProductService.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const products = await ProductService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ ...product ,error: "Produto não encontrado" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
  const { id } = req.params;

  try {
    const updatedProduct = await ProductService.updateProduct(id, req.body);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

static async delete(req, res) {
  const { id } = req.params;

  try {
    const result = await ProductService.deleteProduct(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

}

module.exports = ProductController;