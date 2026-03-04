const AppError = require("../../shared/errors/AppError");
const UsersService = require("./users.service");

class UsersController {
  constructor() {
    this.service = new UsersService();
  }

  async create(req, res, next) {
    try {
      const user = await this.service.create(req.body);

      res.status(201).json({
        ...user,
        message: "Usuário criado com sucesso",
      });
    } catch (error) {
      next(error);
    }
  }

  async confirmEmail(req, res, next) {
    try {
      const { token } = req.query;
      if (!token) throw new AppError("Token não fornecido", 400);

      await this.service.confirmEmail(token);

      return res.status(200).json({ message: "E-mail confirmado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req, res, next) {
    try {
      const users = await this.service.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.service.findById(Number(id));

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      const updatedUser = await this.service.update(Number(id), req.body);

      res.status(200).json({
        message: "Usuário atualizado com sucesso",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.service.delete(Number(id));

      res.status(200).json("Usuário deletado com sucesso");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
