const prisma = require("../../database/prisma");
const serialize = require("../../shared/utils/serialize");

class ProductService {
  
  static async create(data) {
    try {
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

      return {
        sucesso: true,
        dados: serialize(product)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao criar produto: " + error.message
      };
    }
  }

  static async findAll() {
    try {
      const products = await prisma.produtos.findMany({
        include: {
          categoria: true,
          produto_imagens: true,
          avaliacoes: true,
        },
        orderBy: { id: 'desc' }
      });

      return {
        sucesso: true,
        dados: serialize(products)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao listar produtos: " + error.message
      };
    }
  }

  static async findById(id) {
    try {
      const product = await prisma.produtos.findUnique({
        where: { id: parseInt(id) },
        include: {
          categoria: true,
          produto_imagens: true,
          avaliacoes: true,
        },
      });

      if (!product) {
        return {
          sucesso: false,
          erro: "Produto não encontrado"
        };
      }

      return {
        sucesso: true,
        dados: serialize(product)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao buscar produto: " + error.message
      };
    }
  }

  static async update(id, data) {
    try {
      const existe = await prisma.produtos.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existe) {
        return {
          sucesso: false,
          erro: "Produto não encontrado"
        };
      }

      const product = await prisma.produtos.update({
        where: { id: parseInt(id) },
        data: {
          nome: data.nome,
          valor: data.valor,
          descricao: data.descricao,
          desconto: data.desconto,
          estoque: data.estoque ? parseInt(data.estoque) : undefined,
          categoria_id: data.categoria_id ? parseInt(data.categoria_id) : undefined,
          tamanhos: data.tamanhos,
          cores: data.cores,
          altura: data.altura,
          largura: data.largura,
          comprimento: data.comprimento,
          peso: data.peso,
        },
      });

      return {
        sucesso: true,
        dados: serialize(product)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao atualizar produto: " + error.message
      };
    }
  }

  static async delete(id) {
    try {
      const existe = await prisma.produtos.findUnique({
        where: { id: parseInt(id) }
      });

      if (!existe) {
        return {
          sucesso: false,
          erro: "Produto não encontrado"
        };
      }

      await prisma.produtos.delete({
        where: { id: parseInt(id) }
      });

      return {
        sucesso: true,
        mensagem: "Produto deletado com sucesso"
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao deletar produto: " + error.message
      };
    }
  }

  static async atualizarTamanhos(produtoId, tamanhosIds) {
    try {
      const idFormatado = parseInt(produtoId);

      if (isNaN(idFormatado)) {
        return {
          sucesso: false,
          erro: "ID do produto inválido"
        };
      }

      if (!Array.isArray(tamanhosIds) || tamanhosIds.length === 0) {
        return {
          sucesso: false,
          erro: "Envie um array válido de IDs de tamanhos"
        };
      }

      const produto = await prisma.produtos.findUnique({
        where: { id: idFormatado },
      });

      if (!produto) {
        return {
          sucesso: false,
          erro: "Produto não encontrado"
        };
      }

      const tamanhosExistentes = await prisma.tamanhos.findMany({
        where: {
          id: { in: tamanhosIds.map(id => parseInt(id)) },
        },
      });

      if (tamanhosExistentes.length !== tamanhosIds.length) {
        const idsEncontrados = tamanhosExistentes.map(t => t.id);
        const tamanhosFaltando = tamanhosIds.filter(
          id => !idsEncontrados.includes(parseInt(id))
        );
        
        return {
          sucesso: false,
          erro: `Tamanhos não existem: ${tamanhosFaltando.join(", ")}`
        };
      }

      const produtoAtualizado = await prisma.produtos.update({
        where: { id: idFormatado },
        data: {
          tamanhos: JSON.stringify(tamanhosIds),
        },
      });

      return {
        sucesso: true,
        dados: serialize(produtoAtualizado)
      };
    } catch (error) {
      return {
        sucesso: false,
        erro: "Erro ao atualizar tamanhos: " + error.message
      };
    }
  }

  static async atualizarCores(produtoId, coresIds) {
  try {
    const idFormatado = parseInt(produtoId);

    if (isNaN(idFormatado)) {
      return {
        sucesso: false,
        erro: "ID do produto inválido"
      };
    }

    if (!Array.isArray(coresIds) || coresIds.length === 0) {
      return {
        sucesso: false,
        erro: "Envie um array válido de IDs de cores"
      };
    }

    const produto = await prisma.produtos.findUnique({
      where: { id: idFormatado },
    });

    if (!produto) {
      return {
        sucesso: false,
        erro: "Produto não encontrado"
      };
    }

    const coresExistentes = await prisma.cores.findMany({
      where: {
        id: { in: coresIds.map(id => parseInt(id)) },
      },
    });

    if (coresExistentes.length !== coresIds.length) {
      const idsEncontrados = coresExistentes.map(c => c.id);
      const coresFaltando = coresIds.filter(
        id => !idsEncontrados.includes(parseInt(id))
      );
      
      return {
        sucesso: false,
        erro: `Cores não existem: ${coresFaltando.join(", ")}`
      };
    }

    const produtoAtualizado = await prisma.produtos.update({
      where: { id: idFormatado },
      data: {
        cores: JSON.stringify(coresIds),
      },
    });

    return {
      sucesso: true,
      dados: serialize(produtoAtualizado)
    };
  } catch (error) {
    return {
      sucesso: false,
      erro: "Erro ao atualizar cores: " + error.message
    };
  }
}

}

module.exports = ProductService;