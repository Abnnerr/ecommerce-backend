const { melhorEnvio } = require("../../config/env");
const AppError = require("../../shared/errors/AppError");

class FreteController {
  async calcular(req, res, next) {
    try {
      if (!melhorEnvio.token) {
        throw new AppError("Token do Melhor Envio não configurado", 500);
      }

      const response = await fetch(
        "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${melhorEnvio.token}`,
            "Accept": "application/json",
            "User-Agent": "Ecommerce Backend"
          },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          tipo: "error",
          mensagem: "Erro ao calcular frete",
          detalhes: data,
        });
      }

      return res.status(200).json({
        tipo: "success",
        mensagem: "Frete calculado com sucesso",
        dados: data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FreteController();