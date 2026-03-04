const prisma = require("../../database/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../../shared/utils/mail.util");
const AppError = require("../../shared/errors/AppError");

class UsersService {
  async create(data) {
    const { senha, data_nasc, nivel } = data;
    console.log(data);

    if (!senha) throw new AppError("Senha é obrigatória", 400);

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuarios.create({
      data: { ...data, senha: hashedPassword, data_nasc: new Date(data_nasc) },
      omit: { senha: true },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    await transporter.sendMail({
      from: `"3D Tech" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Confirme seu cadastro",
      html: `
      <h2>Bem-vindo!</h2>
      <p>Clique no link para confirmar seu email:</p>
      <a href=${process.env.APP_URL}/api/users/confirm?token=${token}>Confirmar Email</a>
      <p>O link é válido por 24 horas.</p>`,
    });

    return user;
  }

  async confirmEmail(token) {
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new AppError("Token inválido ou expirado", 400);
    }

    const user = await this.findById(decoded.id);

    if (!user) throw new AppError("Usuário não encontrado", 404);

    if (user.emailVerificado) throw new AppError("Email já confirmado", 400);

    return await this.update(user.id, { emailVerificado: true });
  }

  async findAll() {
    return await prisma.usuarios.findMany({
      orderBy: { id: "desc" },
      omit: { senha: true },
      include: {
        pedidos: true,

      }
    });
  }

  async findById(id) {
    const user = await prisma.usuarios.findUnique({
      where: { id },
      omit: { senha: true },
    });

    if (!user) throw new AppError("Usuário não encontrado", 404);

    return user;
  }

  async update(id, data) {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return await prisma.usuarios.update({
      where: { id },
      data,
      omit: { senha: true },
    });
  }

  async delete(id) {
    await prisma.avaliacoes.deleteMany({
      where: { usuario_id: id }
    });

    await prisma.pedidos.deleteMany({
      where: { usuario_id: id }
    });

    return await prisma.usuarios.delete({
      where: { id: id }
    });
  }
}

module.exports = UsersService;
