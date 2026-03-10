const { default: axios } = require("axios");

class FreteService {

    static async calcularFrete(data) {

        try {

            const { cep, products } = data;

            const response = await axios.post(
                "https://sandbox.melhorenvio.com.br/api/v2/me/shipment/calculate",
                {
                    from: {
                        postal_code: "60760000" // CEP da sua loja
                    },
                    to: {
                        postal_code: cep
                    },
                    products: products
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "User-Agent": "Aplicação (contato@suaempresa.com)"
                    }
                }
            );

            return response.data;

        } catch (error) {

            console.log(error.response?.data || error.message);

            return res.status(500).json({
                erro: "Erro ao calcular frete"
            });

        }

    }

}



module.exports = FreteService;