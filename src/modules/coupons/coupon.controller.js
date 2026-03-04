const AppError = require("../../shared/errors/AppError");
const CouponService = require("./coupon.service");

class CouponController {
  static async create(req, res, next) {
    try {
      const { nome, quantidade, validade, valor_desc } = req.body;

      if (!nome || !quantidade || !validade || !valor_desc) {
        throw new AppError("Todos os campos são obrigatórios", 400);
      }

      const resultado = await CouponService.create(req.body);

      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req, res, next) {
    try {
      const resultado = await CouponService.findAll();

      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.findById(id);

      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.update(id, req.body);

      res.json(resultado);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.delete(id);

      res.json({ mensagem: resultado.mensagem });
    } catch (error) {
      next(error);
    }
  }

  static async validar(req, res, next) {
    try {
      const { id } = req.params;
      const resultado = await CouponService.validarCupom(id);

      res.json({
        cupom: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CouponController;
