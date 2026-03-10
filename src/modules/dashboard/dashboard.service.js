const prisma = require("../../database/prisma");

class DashBoardService {
    static async findAll() {
        console.log('ENTROU');

        const totalUsuarios = await prisma.usuarios.count();
        const totalProdutos = await prisma.produtos.count();
        const totalPedidos = await prisma.pedidos.count();
        const totalCategorias = await prisma.categoria.count();
        const totalCupons = await prisma.cupons.count();
        const totalAvaliacoes = await prisma.avaliacoes.count();
        const pedidosRecentes = await prisma.pedidos.findMany({
            take: 5,
            orderBy: {
                id: "desc"
            },
            include: {
                usuarios: {
                    select: {
                        nome: true
                    }
                }
            }
        });
        const dados = {
            totalUsuarios,
            totalProdutos,
            totalPedidos,
            totalAvaliacoes,
            totalCategorias,
            totalCupons,
            pedidosRecentes
        }
        console.log(dados);

        return {
            totalUsuarios,
            totalProdutos,
            totalPedidos,
            totalAvaliacoes,
            totalCategorias,
            totalCupons,
            pedidosRecentes
        }
    }
}


module.exports = DashBoardService;