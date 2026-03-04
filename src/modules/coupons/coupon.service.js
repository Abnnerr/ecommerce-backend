const prisma = require("../../database/prisma");
const AppError = require("../../shared/errors/AppError");
const serialize = require("../../shared/utils/serialize");

class CouponService {
  static async create(data) {
    const { nome, quantidade, validade, valor_desc } = data;

    const coupon = await prisma.cupons.create({
      data: {
        nome,
        quantidade: parseInt(quantidade),
        validade: new Date(validade),
        valor_desc: parseInt(valor_desc),
      },
    });

    return serialize(coupon);
  }

  static async findAll() {
    const coupons = await prisma.cupons.findMany({
      orderBy: { validade: "asc" },
    });

    return serialize(coupons);
  }

  static async findById(id) {
    const coupon = await prisma.cupons.findUnique({
      where: { id: parseInt(id) },
      include: { pedidos: true },
    });

    if (!coupon) {
      throw new AppError("Cupom não encontrado", 404);
    }

    return serialize(coupon);
  }

  static async update(id, data) {
    const { nome, quantidade, validade, valor_desc } = data;

    const existe = await prisma.cupons.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existe) {
      throw new AppError("Cupom não encontrado", 404);
    }

    const coupon = await prisma.cupons.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        quantidade: parseInt(quantidade),
        validade: new Date(validade),
        valor_desc: parseInt(valor_desc),
      },
    });

    return serialize(coupon);
  }

  static async delete(id) {
    const existe = await prisma.cupons.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existe) {
      throw new AppError("Cupom não encontrado", 404);
    }

    await prisma.cupons.delete({
      where: { id: parseInt(id) },
    });

    return {
      mensagem: "Cupom deletado com sucesso",
    };
  }

  static async validarCupom(id) {
    const cupom = await prisma.cupons.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cupom) {
      throw new AppError("Cupom não encontrado", 404);
    }

    if (cupom.quantidade <= 0) {
      throw new AppError("Cupom esgotado", 409);
    }

    if (new Date(cupom.validade) < new Date()) {
      throw new AppError("Cupom expirado", 409);
    }

    return serialize(cupom);
  }
}

module.exports = CouponService;
