const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../database/prisma");
const transporter = require("../../shared/utils/mail.util");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';

async function login(email, senha) {
  try {
    console.log('📧 Email buscado:', email);

    const user = await prisma.usuarios.findUnique({
      where: { email },
      include: {
        pedidos: true,
      },
    });

    console.log('👤 Usuário encontrado:', user ? 'Sim' : 'Não');
    console.log(user);

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
      { id: user.id, email: user.email, nivel: user.nivel },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    const { senha: _, ...usuarioSemSenha } = user;
    const { nivel, ...usuarioSemNivel } = usuarioSemSenha;
    console.log(usuarioSemNivel);

    return {
      usuario: usuarioSemNivel,
      token
    };
  } catch (error) {
    console.error('❌ Erro detalhado:', error);
    throw error;
  }
}

async function forgotPassword(email) {
  try {
    const user = await prisma.usuarios.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Email não encontrado");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    console.log(token, ":forgot password");
    await transporter.sendMail({
      from: `"E-commerce" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Recuperação de Senha',
      html: `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
      
      <div style="
        max-width:600px;
        margin:auto;
        background:white;
        padding:30px;
        border-radius:10px;
        text-align:center;
        box-shadow:0 4px 10px rgba(0,0,0,0.1);
      ">
        
        <h2 style="color:#333;">Recuperação de senha</h2>

        <p style="color:#555; font-size:16px;">
          Recebemos uma solicitação para redefinir sua senha.
        </p>

        <p style="color:#555;">
          Clique no botão abaixo para criar uma nova senha.
        </p>

        <a href="https://projeto-ecommerce-lovat.vercel.app/reset-password?token=${token}"
          style="
            display:inline-block;
            margin-top:20px;
            padding:12px 24px;
            background:#4CAF50;
            color:white;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          ">
          Redefinir senha
        </a>

        <p style="margin-top:30px; color:#999; font-size:12px;">
          Se você não solicitou isso, ignore este email.
        </p>

      </div>

    </div>
  `,
    });
    return token;
  } catch (error) {
    throw error;
  }
}

async function ResetPassword(token, novaSenha) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const user = await prisma.usuarios.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    await prisma.usuarios.update({
      where: { id: userId },
      data: { senha: hashedPassword }
    });

    return { message: "Senha atualizada com sucesso" };
  } catch (error) {
    throw new Error("Token inválido ou expirado");
  }
}

module.exports = { login, forgotPassword, ResetPassword };