const UsersService = require("./users.service");

class UsersController {
  constructor() {
    this.service = new UsersService();
  }

  async create(req, res, next) {
    try {
      const user = await this.service.create(req.body);

      res
        .status(201)
        .json({ data: user, message: "Usuário criado com sucesso" });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const user = await this.service.login(req.body);
      res.status(201).json({ ...user, message: 'Sucess Login' })
      
    } catch (error) {
      next(error)
    }

  }

  async confirmEmail(req, res) {
    try {
      const { token } = req.query;

      if (!token)
        return res.status(400).json({ message: "Token não fornecido" });

      await this.service.confirmEmail(token);

      return res.status(200).json({ message: "E-mail confirmado com sucesso" });
    } catch (error) {
      return res.status(400).json({
        message: "Token inválido ou expirado",
      });
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

      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });

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

      res.status(204).json("Usuário deletado com sucesso");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
