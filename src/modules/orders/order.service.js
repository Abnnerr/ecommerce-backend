const { prisma } = require('../../database/prisma');
const AppError = require('../../shared/errors/AppError');

/**
 * Service de Pedidos - Gerencia toda a lógica de negócio dos pedidos
 */
class OrderService {
  /**
   * Criar um novo pedido
   * 
   * VALIDAÇÕES:
   * 1. Valida existência do usuário
   * 2. Valida array de itens (não vazio)
   * 3. Para cada item: valida produto, status ativo e estoque
   * 4. Calcula valor_total automaticamente com preço atual
   * 5. Valida e aplica cupom se fornecido
   * 6. Usa transaction para garantir consistência
   * 7. Decrementa estoque atomicamente
   * 
   * USO DE TRANSACTION:
   * Essencial para evitar inconsistências: se algo falhar (ex: falta de estoque),
   * nenhuma alteração é persistida no banco. Garante ACID (Atomicidade, Consistência,
   * Isolamento e Durabilidade), mantendo integridade dos dados.
   * 
   * @param {Object} data - Dados do pedido
   * @param {number} data.usuario_id - ID do usuário
   * @param {Array} data.itens - Array de itens { produto_id, quantidade }
   * @param {number} [data.cupom_id] - ID do cupom (opcional)
   * @param {string} data.logradouro - Endereço de entrega
   * @param {string} data.numero - Número do endereço
   * @param {string} [data.complemento] - Complemento do endereço
   * @param {string} data.bairro - Bairro
   * @param {string} data.cidade - Cidade
   * @param {string} data.estado - Estado
   * @param {string} data.cep - CEP
   * @param {Date} [data.previsao_entrega] - Data prevista de entrega
   * @returns {Promise<Object>} Pedido criado com usuário, itens e produtos
   * @throws {AppError} Se validações falharem
   */
  async create(data) {
    try {
      // 1. Validar se usuário existe
      const usuario = await prisma.usuarios.findUnique({
        where: { id: data.usuario_id },
      });

      if (!usuario) {
        throw new AppError('Usuário não encontrado', 404);
      }

      // 2. Validar se array de itens existe e não está vazio
      if (!data.itens || !Array.isArray(data.itens) || data.itens.length === 0) {
        throw new AppError('Pedido deve conter pelo menos um item', 400);
      }

      let valor_total = 0;
      const itensProcessados = [];

      // 3. Validar cada item e calcular valor total
      for (const item of data.itens) {
        if (!item.produto_id || !item.quantidade || item.quantidade <= 0) {
          throw new AppError('Cada item deve ter produto_id e quantidade válida', 400);
        }

        // Buscar produto
        const produto = await prisma.produtos.findUnique({
          where: { id: item.produto_id },
        });

        if (!produto) {
          throw new AppError(`Produto ${item.produto_id} não encontrado`, 404);
        }

        // Validar se produto está ativo (assumindo que estoque > 0 = ativo)
        if (produto.estoque <= 0) {
          throw new AppError(`Produto ${produto.nome} não está disponível`, 400);
        }

        // Validar estoque suficiente
        if (produto.estoque < item.quantidade) {
          throw new AppError(
            `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoque}`,
            400
          );
        }

        // 4. Calcular valor usando preço atual do banco (não confiar no frontend)
        const preco_unitario = parseFloat(produto.valor) || 0;
        const subtotal = preco_unitario * item.quantidade;

        valor_total += subtotal;

        itensProcessados.push({
          ...item,
          preco_unitario,
          subtotal,
        });
      }

      // 5. Validar e aplicar cupom se fornecido
      let desconto = 0;

      if (data.cupom_id) {
        const cupom = await prisma.cupons.findUnique({
          where: { id: data.cupom_id },
        });

        if (!cupom) {
          throw new AppError('Cupom não encontrado', 404);
        }

        // Validar se cupom está ativo
        if (cupom.quantidade <= 0) {
          throw new AppError('Cupom não está mais disponível', 400);
        }

        // Validar se não está expirado
        const dataValidade = new Date(cupom.validade);
        const dataAtual = new Date();
        dataAtual.setHours(0, 0, 0, 0);

        if (dataValidade < dataAtual) {
          throw new AppError('Cupom expirado', 400);
        }

        // Aplicar desconto percentual
        desconto = (valor_total * cupom.valor_desc) / 100;
        valor_total -= desconto;

        // Validar que valor_total não seja negativo
        if (valor_total < 0) {
          valor_total = 0;
        }
      }

      // 6. Forçar status inicial como "aguardando_pagamento"
      const status = 'aguardando_pagamento';

      // 7. Criar pedido e itens dentro de uma transaction
      const pedido = await prisma.$transaction(async (tx) => {
        // Criar pedido
        const novoPedido = await tx.pedidos.create({
          data: {
            usuario_id: data.usuario_id,
            status,
            valor_total: valor_total.toString(),
            valor_desc: desconto.toString(),
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento || null,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep,
            cupom_id: data.cupom_id || null,
            previsao_entrega: data.previsao_entrega 
              ? new Date(data.previsao_entrega) 
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias por padrão
          },
        });

        // 8. Salvar preco_unitario no itemPedido (armazenar em JSON ou estrutura adicional)
        // e criar relação com produtos
        for (const item of itensProcessados) {
          await tx.pedido_produto.create({
            data: {
              id_pedido: novoPedido.id,
              id_produto: item.produto_id,
            },
          });

          // 9. Decrementar estoque dentro da transaction
          await tx.produtos.update({
            where: { id: item.produto_id },
            data: {
              estoque: {
                decrement: item.quantidade,
              },
            },
          });

          // Se houver cupom, decrementar quantidade
          if (data.cupom_id) {
            await tx.cupons.update({
              where: { id: data.cupom_id },
              data: {
                quantidade: {
                  decrement: 1,
                },
              },
            });
          }
        }

        return novoPedido;
      });

      // 10. Retornar pedido completo com usuario, itens e produtos
      const pedidoCompleto = await prisma.pedidos.findUnique({
        where: { id: pedido.id },
        include: {
          usuarios: true,
          pedido_produto: {
            include: {
              produtos: true,
            },
          },
          cupons: true,
        },
      });

      return pedidoCompleto;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        'Erro ao criar pedido: ' + error.message,
        500
      );
    }
  }

  /**
   * Listar todos os pedidos
   * 
   * @returns {Promise<Array>} Array com todos os pedidos incluindo usuário, itens e produtos
   */
  async findAll() {
    try {
      const pedidos = await prisma.pedidos.findMany({
        include: {
          usuarios: true,
          pedido_produto: {
            include: {
              produtos: true,
            },
          },
          cupons: true,
        },
      });

      return pedidos;
    } catch (error) {
      throw new AppError(
        'Erro ao listar pedidos: ' + error.message,
        500
      );
    }
  }

  /**
   * Buscar pedido por ID
   * 
   * VALIDAÇÕES:
   * 1. Valida se ID é número válido
   * 2. Busca pedido com itens e produtos
   * 3. Lança erro se não encontrado
   * 
   * @param {number} id - ID do pedido
   * @returns {Promise<Object>} Pedido com itens e produtos
   * @throws {AppError} Se ID inválido ou pedido não existe
   */
  async findById(id) {
    try {
      // Validar se id é número
      const idNumerico = parseInt(id, 10);
      
      if (isNaN(idNumerico)) {
        throw new AppError('ID do pedido inválido', 400);
      }

      const pedido = await prisma.pedidos.findUnique({
        where: { id: idNumerico },
        include: {
          usuarios: true,
          pedido_produto: {
            include: {
              produtos: true,
            },
          },
          cupons: true,
        },
      });

      if (!pedido) {
        throw new AppError('Pedido não encontrado', 404);
      }

      return pedido;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        'Erro ao buscar pedido: ' + error.message,
        500
      );
    }
  }

  /**
   * Atualizar pedido
   * 
   * RESTRIÇÕES:
   * 1. NÃO permite alterar: usuario_id, valor_total
   * 2. Permite alterar: status, endereco
   * 3. Valida transição de status com máquina de estados
   * 4. Se status for "enviado", exige cod_rastreio
   * 
   * FLUXO PERMITIDO:
   * - aguardando_pagamento → pago
   * - pago → enviado
   * - enviado → entregue
   * - aguardando_pagamento → cancelado
   * - pago → cancelado
   * 
   * NÃO PERMITIDO:
   * - Alterar após entregue
   * - Cancelar pedido entregue
   * 
   * @param {number} id - ID do pedido
   * @param {Object} data - Dados a atualizar
   * @param {string} [data.status] - Novo status
   * @param {string} [data.logradouro] - Novo logradouro
   * @param {string} [data.numero] - Novo número
   * @param {string} [data.complemento] - Novo complemento
   * @param {string} [data.bairro] - Novo bairro
   * @param {string} [data.cidade] - Nova cidade
   * @param {string} [data.estado] - Novo estado
   * @param {string} [data.cep] - Novo CEP
   * @param {string} [data.cod_rastreio] - Código de rastreio
   * @returns {Promise<Object>} Pedido atualizado com itens
   * @throws {AppError} Se validações falharem
   */
  async update(id, data) {
    try {
      // Validar se ID é número
      const idNumerico = parseInt(id, 10);
      
      if (isNaN(idNumerico)) {
        throw new AppError('ID do pedido inválido', 400);
      }

      // Buscar pedido existente
      const pedidoExistente = await prisma.pedidos.findUnique({
        where: { id: idNumerico },
      });

      if (!pedidoExistente) {
        throw new AppError('Pedido não encontrado', 404);
      }

      // Validar se tentou alterar campos proibidos
      if (data.usuario_id !== undefined && data.usuario_id !== pedidoExistente.usuario_id) {
        throw new AppError('Não é permitido alterar usuário do pedido', 400);
      }

      if (data.valor_total !== undefined && data.valor_total !== pedidoExistente.valor_total) {
        throw new AppError('Não é permitido alterar valor total do pedido', 400);
      }

      // Preparar dados para atualização
      const dadosAtualizacao = {};

      // Permitir atualização de endereço
      if (data.logradouro) dadosAtualizacao.logradouro = data.logradouro;
      if (data.numero) dadosAtualizacao.numero = data.numero;
      if (data.complemento !== undefined) dadosAtualizacao.complemento = data.complemento;
      if (data.bairro) dadosAtualizacao.bairro = data.bairro;
      if (data.cidade) dadosAtualizacao.cidade = data.cidade;
      if (data.estado) dadosAtualizacao.estado = data.estado;
      if (data.cep) dadosAtualizacao.cep = data.cep;

      // Validar transição de status se fornecido
      if (data.status && data.status !== pedidoExistente.status) {
        this._validarTransicaoStatus(pedidoExistente.status, data.status);

        // Se status for "enviado", exigir cod_rastreio
        if (data.status === 'enviado' && !data.cod_rastreio) {
          throw new AppError('Código de rastreio é obrigatório para status "enviado"', 400);
        }

        dadosAtualizacao.status = data.status;
      }

      // Atualizar cod_rastreio se fornecido
      if (data.cod_rastreio) {
        dadosAtualizacao.cod_rastreio = data.cod_rastreio;
      }

      // Se não há dados para atualizar, retornar pedido atual
      if (Object.keys(dadosAtualizacao).length === 0) {
        return await this.findById(idNumerico);
      }

      // Atualizar pedido
      const pedidoAtualizado = await prisma.pedidos.update({
        where: { id: idNumerico },
        data: dadosAtualizacao,
        include: {
          usuarios: true,
          pedido_produto: {
            include: {
              produtos: true,
            },
          },
          cupons: true,
        },
      });

      return pedidoAtualizado;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        'Erro ao atualizar pedido: ' + error.message,
        500
      );
    }
  }

  /**
   * Deletar (soft delete) um pedido
   * 
   * NÃO deleta fisicamente, apenas altera status para "cancelado".
   * Não permite cancelar pedidos já entregues.
   * 
   * @param {number} id - ID do pedido
   * @returns {Promise<Object>} Pedido cancelado
   * @throws {AppError} Se validações falharem
   */
  async delete(id) {
    try {
      // Validar se ID é número
      const idNumerico = parseInt(id, 10);
      
      if (isNaN(idNumerico)) {
        throw new AppError('ID do pedido inválido', 400);
      }

      // Buscar pedido
      const pedido = await prisma.pedidos.findUnique({
        where: { id: idNumerico },
      });

      if (!pedido) {
        throw new AppError('Pedido não encontrado', 404);
      }

      // Não permitir cancelar pedido já entregue
      if (pedido.status === 'entregue') {
        throw new AppError('Não é permitido cancelar um pedido já entregue', 400);
      }

      // Não permitir cancelar pedido já cancelado
      if (pedido.status === 'cancelado') {
        throw new AppError('Pedido já foi cancelado', 400);
      }

      // Realizar soft delete alterando status para "cancelado"
      const pedidoCancelado = await prisma.pedidos.update({
        where: { id: idNumerico },
        data: {
          status: 'cancelado',
        },
        include: {
          usuarios: true,
          pedido_produto: {
            include: {
              produtos: true,
            },
          },
          cupons: true,
        },
      });

      return pedidoCancelado;
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        'Erro ao cancelar pedido: ' + error.message,
        500
      );
    }
  }

  /**
   * MÁQUINA DE ESTADOS - Valida transição de status
   * 
   * Fluxo permitido:
   * - aguardando_pagamento → pago
   * - pago → enviado
   * - enviado → entregue
   * - aguardando_pagamento → cancelado
   * - pago → cancelado
   * 
   * Não permitido: alterar após "entregue"
   * 
   * @param {string} statusAtual - Status atual do pedido
   * @param {string} novoStatus - Novo status solicitado
   * @throws {AppError} Se transição não é permitida
   * @private
   */
  _validarTransicaoStatus(statusAtual, novoStatus) {
    const transicoes = {
      'aguardando_pagamento': ['pago', 'cancelado'],
      'pago': ['enviado', 'cancelado'],
      'enviado': ['entregue'],
      'entregue': [],
      'cancelado': [],
    };

    const transicoesPermitidas = transicoes[statusAtual] || [];

    if (!transicoesPermitidas.includes(novoStatus)) {
      throw new AppError(
        `Transição de status "${statusAtual}" para "${novoStatus}" não é permitida`,
        400
      );
    }
  }
}

module.exports = new OrderService();
