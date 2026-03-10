const orderService = require("./order.service.js");

// Exporta handlers como funções puras para evitar problemas de contexto
module.exports = {
     create: async (req, res) => {
        const order = await orderService.create(req.body);
        return res.status(201).json(order);
    },

    findAll: async (req, res) => {
        const orders = await orderService.findAll();
        return res.json(orders);
    },

    findById: async (req, res) => {
        const order = await orderService.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json(order);
    },

    update: async (req, res) => {
        const order = await orderService.update(req.params.id, req.body);
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json(order);
    },

    delete: async (req, res) => {
        const deleted = await orderService.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Order not found" });
        return res.status(204).send();
    },
};