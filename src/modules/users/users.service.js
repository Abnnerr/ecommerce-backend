const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendMail } = require("../../shared/utils/mail.util");
const AppError = require("../../shared/errors/AppError");
const UserRepository = require("./user.repository");
// const transporter = require("../../shared/utils/mail.util");

class UsersService {
  constructor() {
    this.repository = new UserRepository();
  }

  async create(data) {
    const { senha, email, data_nasc } = data;

    if (!senha) {
      throw new AppError("Senha é obrigatória", 400);
    }

    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email já cadastrado", 400);
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await this.repository.create({
      ...data,
      senha: hashedPassword,
      data_nasc: new Date(data_nasc)
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nome: user.nome,
        nivel: user.nivel,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    let emailEnviado = false;

    try {
      await sendMail({
        from: `"3D Tech" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Confirme seu cadastro",
        html: `
          <h2>Bem-vindo!</h2>
          <p>Clique no link para confirmar seu email:</p>
          <a href="${process.env.APP_URL}/api/users/confirm?token=${token}">
            Confirmar Email
          </a>
          <p>O link é válido por 24 horas.</p>
        `,
      });

      console.log(`Email de confirmação enviado para ${user.email}`);
      emailEnviado = true;
    } catch (error) {
      console.error(`Usuário ${user.id} criado, mas email não enviado:`, error.message);
      emailEnviado = false;
    }

    return { ...user, emailEnviado };
  }

  async confirmEmail(token) {
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError("Token expirado", 400);
      }
      throw new AppError("Token inválido", 400);
    }

    const user = await this.repository.findById(decoded.id, true);

    if (!user) throw new AppError("Usuário não encontrado", 404);
    if (user.emailVerificado) throw new AppError("Email já confirmado", 400);

    await this.repository.updateEmailVerification(user.id, true);

    return { confirmed: true, email: user.email };
  }

  async findAll() {
    const users = await this.repository.findAll();
    return users;
  }

  async findById(id) {
    // const user = await prisma.usuarios.findUnique({
    //   where: { id },
    //   omit: { senha: true },
    // });
    const user = await this.repository.findById(Number(id));
    if (!user) throw new AppError("Usuário não encontrado", 404);

    return user;
  }

  async update(id, data) {

    const existingUser = await this.repository.findById(Number(id));
    if (!existingUser) {
      throw new AppError("Usuário não encontrado", 404);
    }
    
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    if(data.email && data.email !== existingUser.email) {
      const userWithEmail = await this.repository.findByEmail(data.email);
      if (userWithEmail) {
        throw new AppError("Email já cadastrado", 400);
      }
    }

    // return await prisma.usuarios.update({
    //   where: { id },
    //   data,
    //   omit: { senha: true },
    // });
    const updatedUser = await this.repository.update(Number(id), data);
    return updatedUser;
  }

  async delete(id) {
    // return await prisma.usuarios.delete({ where: { id } });
    const user = await this.repository.findById(Number(id));

    if(!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    await this.repository.delete(Number(id));
    return { deleted: true };
  }
}

module.exports = UsersService;
