const prisma = require("../../database/prisma");
const AppError = require("../../shared/errors/AppError");
const serialize = require("../../shared/utils/serialize");

class ProductService {
  static async create(data) {
    const product = await prisma.produtos.create({
      data: {
        nome: data.nome,
        valor: data.valor,
        descricao: data.descricao,
        desconto: data.desconto || 0,
        estoque: parseInt(data.estoque),
        categoria_id: parseInt(data.categoria_id),
        tamanhos: data.tamanhos || "[]",
        cores: data.cores || "[]",
        altura: data.altura,
        largura: data.largura,
        comprimento: data.comprimento,
        peso: data.peso,
      },
    });

    return serialize(product);
  }

  static async findAll() {
    const products = await prisma.produtos.findMany({
      include: {
        categoria: true,
        produto_imagens: true,
        avaliacoes: true,
      },
      orderBy: { id: "desc" },
    });

    return serialize(products);
  }

  static async findById(id) {
    console.log(id)
    const product = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
      include: {
        categoria: true,
        produto_imagens: true,
        avaliacoes: true,
      },
    });

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    return serialize(product);
  }

  static async update(id, data) {
    const existe = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existe) {
      throw new AppError("Produto não encontrado", 404);
    }

    const product = await prisma.produtos.update({
      where: { id: parseInt(id) },
      data: {
        nome: data.nome,
        valor: data.valor,
        descricao: data.descricao,
        desconto: data.desconto,
        estoque: data.estoque ? parseInt(data.estoque) : undefined,
        categoria_id: data.categoria_id
          ? parseInt(data.categoria_id)
          : undefined,
        tamanhos: data.tamanhos,
        cores: data.cores,
        altura: data.altura,
        largura: data.largura,
        comprimento: data.comprimento,
        peso: data.peso,
      },
    });

    return serialize(product);
  }

  static async delete(id) {
    const existe = await prisma.produtos.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existe) {
      throw new AppError("Produto não encontrado", 404);
    }

    return await prisma.produtos.delete({
      where: { id: parseInt(id) },
    });
  }

  static async atualizarTamanhos(produtoId, tamanhosIds) {
    const idFormatado = parseInt(produtoId);

    if (isNaN(idFormatado)) {
      throw new AppError("ID do produto inválido", 400);
    }

    if (!Array.isArray(tamanhosIds) || tamanhosIds.length === 0) {
      throw new AppError("Envie um array válido de IDs de tamanhos", 400);
    }

    const produto = await prisma.produtos.findUnique({
      where: { id: idFormatado },
    });

    if (!produto) {
      throw new AppError("Produto não encontrado", 404);
    }

    const tamanhosExistentes = await prisma.tamanhos.findMany({
      where: {
        id: { in: tamanhosIds.map((id) => parseInt(id)) },
      },
    });

    if (tamanhosExistentes.length !== tamanhosIds.length) {
      const idsEncontrados = tamanhosExistentes.map((t) => t.id);
      const tamanhosFaltando = tamanhosIds.filter(
        (id) => !idsEncontrados.includes(parseInt(id)),
      );

      throw new AppError(
        `Tamanhos não existem: ${tamanhosFaltando.join(", ")}`,
        400,
      );
    }

    const produtoAtualizado = await prisma.produtos.update({
      where: { id: idFormatado },
      data: {
        tamanhos: JSON.stringify(tamanhosIds),
      },
    });

    return serialize(produtoAtualizado);
  }
}

module.exports = ProductService;
