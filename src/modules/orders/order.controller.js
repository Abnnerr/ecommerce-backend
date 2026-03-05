const orderService = require("./order.service.js");

// Exporta handlers como funções puras para evitar problemas de contexto
module.exports = {
    create: (req, res) => {
        const order = orderService.create(req.body);
        return res.status(201).json(order);
    },

    findAll: (req, res) => {
        const orders = orderService.findAll();
        return res.json(orders);
    },

    findById: (req, res) => {
        const order = orderService.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json(order);
    },

    update: (req, res) => {
        const order = orderService.update(req.params.id, req.body);
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json(order);
    },

    delete: (req, res) => {
        const deleted = orderService.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Order not found" });
        return res.status(204).send();
    },
};