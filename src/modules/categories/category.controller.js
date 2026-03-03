const CategoryService = require("./category.service");

class CategoryController {
  static async create(req, res) {
    try {
      const category = await CategoryService.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const categories = await CategoryService.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const category = await CategoryService.findById(req.params.id);
      if (!category) return res.status(404).json({ error: "Categoria não encontrada" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const category = await CategoryService.update(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await CategoryService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;
