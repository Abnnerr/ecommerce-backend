const DashBoardService = require("./dashboard.service");

class DashBoardController {
    static async findAll(req, res) {
        try {
            const resultado = await DashBoardService.findAll();
            res.status(201).json(resultado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao obter os dados do dashboard" });
        }   
    }
}

module.exports = DashBoardController;