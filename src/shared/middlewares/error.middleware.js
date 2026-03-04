const { Prisma } = require("@prisma/client");
const AppError = require("../errors/AppError");

function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let status = 500;
  let message = "Erro interno do servidor";

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        status = 404;
        message = "Registro não encontrado";
        break;

      case "P2002": {
        const field = err.meta?.target?.[0];
        status = 409;

        if (field) message = `${field} já cadastrado`;
        else message = "Violação de campo único";
        break;
      }

      case "P2003":
        status = 400;
        message = "Referência inválida";
        break;

      default:
        status = 400;
        message = "Erro de validação no banco";
    }
  }

  if (err?.type === "entity.parse.failed") {
    status = 400;
    message = "JSON inválido";
  }

  return res.status(status).json({
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}

module.exports = errorMiddleware;