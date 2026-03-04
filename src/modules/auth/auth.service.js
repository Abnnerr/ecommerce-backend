const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../database/prisma");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

async function login(email, senha) {
  try {
    console.log('📧 Email buscado:', email);
    
    const user = await prisma.usuarios.findUnique({
      where: { email },
    });

    console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');
    
    if (!user) {
      throw new Error("Email não encontrado");
    }

    console.log('Senha fornecida:', senha ? 'Presente' : 'Ausente');
    console.log('Senha no banco:', user.senha ? 'Presente' : 'Ausente');
    
    if (!senha || !user.senha) {
      throw new Error("Dados de autenticação incompletos");
    }

    const passwordIsValid = await bcrypt.compare(senha, user.senha);
    
    if (!passwordIsValid) {
      throw new Error("Senha incorreta");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const { senha: _, ...usuarioSemSenha } = user;

    return {
      usuario: usuarioSemSenha,
      token
    };
  } catch (error) {
    console.error('❌ Erro detalhado:', error);
    throw error;
  }
}

module.exports = { login };