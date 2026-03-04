const ReviewService = require("./review.service");
const serialize = require("../../shared/utils/serialize");

class ReviewController {
  static async create(req, res) {
    try {
      const review = await ReviewService.create(req.body);
      res.status(201).json(serialize(review));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const reviews = await ReviewService.findAll();
      res.json(serialize(reviews));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const review = await ReviewService.findById(req.params.id);
      if (!review) return res.status(404).json({ error: "Avaliação não encontrada" });
      res.json(serialize(review));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const review = await ReviewService.update(req.params.id, req.body);
      res.json(serialize(review));
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await ReviewService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ReviewController;
