const { login, forgotPassword } = require("./auth.service");

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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const token = await forgotPassword(email);

    res.json({ token });
  } catch (error) {
    console.error("Erro ao solicitar recuperação de senha:", error.message);
    res.status(400).json({
      erro: error.message
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, novaSenha } = req.body;  

      if (!token || !novaSenha) { 
        return res.status(400).json({
          erro: "Token e nova senha são obrigatórios"
        }); 
      }
      const resultado = await ResetPassword(token, novaSenha);

      res.json(resultado);
  } catch (error) {
    console.error("Erro ao resetar senha:", error.message);
    res.status(400).json({
      erro: error.message
    });
  }
}