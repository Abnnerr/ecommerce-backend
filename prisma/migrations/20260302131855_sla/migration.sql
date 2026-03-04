-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" SERIAL NOT NULL,
    "nota" BIGINT NOT NULL,
    "descricao" VARCHAR(255),
    "usuario_id" INTEGER NOT NULL,
    "produto_id" INTEGER NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "url_banner" VARCHAR(255) NOT NULL,
    "validade" DATE NOT NULL,
    "link" VARCHAR(255),

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupons" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "validade" DATE NOT NULL,
    "valor_desc" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_produto" (
    "id" SERIAL NOT NULL,
    "id_produto" INTEGER NOT NULL,
    "id_pedido" INTEGER NOT NULL,

    CONSTRAINT "pedido_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "valor_total" VARCHAR(255) NOT NULL,
    "valor_desc" VARCHAR(255) NOT NULL DEFAULT '0',
    "logradouro" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(255) NOT NULL,
    "complemento" VARCHAR(255),
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "estado" VARCHAR(255) NOT NULL,
    "cep" VARCHAR(255) NOT NULL,
    "cod_rastreio" VARCHAR(100),
    "previsao_entrega" DATE NOT NULL,
    "cupom_id" INTEGER DEFAULT 0,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produto_imagens" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "produto_id" INTEGER NOT NULL,

    CONSTRAINT "produto_imagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "produtos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "valor" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "desconto" BIGINT DEFAULT 0,
    "estoque" BIGINT NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "tamanhos" VARCHAR(255) NOT NULL,
    "cores" VARCHAR(255) NOT NULL,
    "altura" VARCHAR(255) NOT NULL,
    "largura" VARCHAR(255) NOT NULL,
    "comprimento" VARCHAR(255) NOT NULL,
    "peso" VARCHAR(255) NOT NULL,

    CONSTRAINT "produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tamanhos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "tamanhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "genero" VARCHAR(15) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "telefone" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "nivel" VARCHAR(10) NOT NULL DEFAULT 'cliente',
    "data_nasc" DATE NOT NULL,
    "emailVerificado" BOOLEAN DEFAULT false,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_fk3" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_fk4" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_produto" ADD CONSTRAINT "pedido_produto_fk1" FOREIGN KEY ("id_produto") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedido_produto" ADD CONSTRAINT "pedido_produto_fk2" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_fk1" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_fk14" FOREIGN KEY ("cupom_id") REFERENCES "cupons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produto_imagens" ADD CONSTRAINT "produto_imagens_fk2" FOREIGN KEY ("produto_id") REFERENCES "produtos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "produtos" ADD CONSTRAINT "produtos_fk6" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
