const { login } = require("./auth.service");

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ 
        erro: "Email e senha são obrigatórios" 
      });
    }

    const resultado = await login(email, senha);
    
    res.json(resultado);
    
  } catch (error) {
    console.error("Erro no login:", error.message);
    
    res.status(401).json({ 
      erro: error.message 
    });
  }
};