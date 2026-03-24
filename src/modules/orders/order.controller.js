const OrderService = require("./order.service");

class OrderController {
  constructor() {
    this.service = new OrderService();
  }

  async create(req, res, next) {
    try {
      const order = await this.service.create(req.body, req.usuario);

      return res.status(201).json({
        tipo: "success",
        mensagem: "Pedido criado com sucesso",
        dados: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await this.service.findAll(req.usuario);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Pedidos encontrados",
        dados: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await this.service.findById(id, req.usuario);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Pedido encontrado",
        dados: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const order = await this.service.update(id, req.body, req.usuario);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Pedido atualizado com sucesso",
        dados: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await this.service.updateStatus(id, status, req.usuario);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Status do pedido atualizado com sucesso",
        dados: order,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(id, req.usuario);

      return res.status(200).json({
        tipo: "success",
        mensagem: "Pedido deletado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;