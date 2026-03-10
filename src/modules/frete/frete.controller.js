const FreteService = require("./frete.service");

class FreteController {
    static async calcularFrete(req, res) {
        try {
            const resultado = await FreteService.calcularFrete(req.body);
            res.status(201).json(resultado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao calcular o frete" });
        }

    }
}

module.exports = FreteController;