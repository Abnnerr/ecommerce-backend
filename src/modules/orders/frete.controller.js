class FreteController {
  static async calcular(req, res) {
    try {
      const response = await fetch("https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.MELHOR_ENVIO_TOKEN}` // ← TOKEN NO .ENV
        },
        body: JSON.stringify(req.body)
      });

      const fretes = await response.json();
      
      if (!response.ok) {
        return res.status(response.status).json(fretes);
      }

      res.json(fretes);
    } catch (error) {
      console.error("Erro no cálculo de frete:", error);
      res.status(500).json({ 
        erro: "Erro ao calcular frete",
        detalhes: error.message 
      });
    }
  }
}

module.exports = FreteController;