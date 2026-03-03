const app = require("./app/app");
const { port } = require("./config/env");

function startServer() {
  app.listen(port, () => {
    console.log(`API rodando na porta http://localhost:${port}`);
    console.log(`API dinâmica Swagger rodando na porta http://localhost:${port}/api-docs`);
  });
}

module.exports = { startServer };