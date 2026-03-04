const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient({
//   omit: {
//     usuarios: {
//       senha: true,
//     },
//   },
// });

const prisma = new PrismaClient();

module.exports = prisma;
