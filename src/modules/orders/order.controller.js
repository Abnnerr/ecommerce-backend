const OrderService = require("./order.service");

class OrderController {
  static async create(req, res) {
    try {
      const userId = req.usuarioId;
      const pedido = await OrderService.create(userId, req.body);
      res.status(201).json(pedido);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async findAll(req, res) {
    try {
      const isAdmin = req.usuario?.nivel === 'admin';
      const pedidos = await OrderService.findAll(req.usuarioId, isAdmin);
      res.json(pedidos);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  static async findById(req, res) {
    try {
      const isAdmin = req.usuario?.nivel === 'admin';
      const pedido = await OrderService.findById(
        req.params.id, 
        req.usuarioId, 
        isAdmin
      );
      res.json(pedido);
    } catch (error) {
      res.status(error.message === "Acesso negado" ? 403 : 404)
        .json({ erro: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const isAdmin = req.usuario?.nivel === 'admin';
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ erro: "Status é obrigatório" });
      }

      const pedido = await OrderService.updateStatus(
        req.params.id, 
        status, 
        isAdmin
      );
      res.json(pedido);
    } catch (error) {
      res.status(403).json({ erro: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const isAdmin = req.usuario?.nivel === 'admin';
      const resultado = await OrderService.delete(req.params.id, isAdmin);
      res.json(resultado);
    } catch (error) {
      res.status(403).json({ erro: error.message });
    }
  }
}

module.exports = OrderController;