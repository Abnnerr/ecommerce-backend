# E-commerce Backend (Node.js + Express + PostgreSQL/Neon + Prisma)

Backend do projeto de E-commerce usando **Node.js + Express**, banco **PostgreSQL no Neon** e **Prisma** (ORM).  
Arquitetura **modular por feature** com padrão: **service → controller → routes**.

---

## ✅ O que já existe no projeto (base pronta)
- Entrypoint: `src/index.js` → chama `src/server.js`
- Servidor: `src/server.js` → `app.listen(...)`
- App Express: `src/app/app.js` → middlewares + rotas + error handler
- Rotas agregadas: `src/app/routes.js`
- Banco: Neon (Postgres) + Prisma (`prisma/schema.prisma`)
- Variáveis de ambiente: **`src/.env`** (e **`src/.env.example`**)

**Exemplo de módulo já criado:**  
`src/modules/coupons/`
- `coupon.routes.js`
- `coupon.controller.js`
- `coupon.service.js`

> Cada pessoa deverá criar/seguir esse mesmo padrão para o seu módulo (CRUD com MOCK primeiro).

---

## ✅ Stack
- **Node.js 18+**
- **Express**
- **PostgreSQL (Neon)**
- **Prisma ORM**
- **JWT + bcrypt** (autenticação)
- **Swagger/OpenAPI 3.0** (documentação completa) ✨
- (Fase 3) **Jest + Supertest** (testes)

---

## ✅ Pré-requisitos
- Node.js 18+ (ou 20+)
- Git
- Conta Neon (para o dono do repositório gerar o banco e a connection string)
- Postman/Insomnia (opcional) para testar endpoints

---

# 🚫 REGRA CRÍTICA: NÃO TRABALHAR NA MAIN
Este repositório é o **repositório central** (upstream).  
Ninguém deve commitar diretamente na branch `main` do repo do dono.

✅ Fluxo correto:
1) **Fork** do repositório
2) Criar branch no seu fork
3) Implementar e commitar no seu fork
4) Abrir **Pull Request** (PR) para o repo´sitório inicial
5) O líder revisa e faz **MERGE**

---

## ✅ Como começar (Time – Fork & Branch)

### 1) Fazer FORK (obrigatório)
No GitHub do repo do líder:
- Clique em **Fork** (canto superior direito)
- Isso cria: `SEU_USUARIO/ecommerce-backend`

### 2) Clonar o SEU fork
```bash
git clone https://github.com/SEU_USUARIO/ecommerce-backend.git
cd ecommerce-backend
```

### 3) Adicionar o remoto do líder (upstream)
```bash
git remote add upstream https://github.com/DONO_DO_REPO/ecommerce-backend.git
git remote -v
```

### 4) Criar sua branch (sempre)
✅ Nunca desenvolver na `main`.
```bash
git checkout -b feature/NOME_DA_TAREFA
```

Exemplos:
- `feature/products-mock-create-read`
- `feature/users-mock-create-read`
- `feature/orders-mock-create-read`
- `feature/reviews-mock-create-read`
- `feature/coupons-mock-create-read`

---

## ✅ Rodar o projeto localmente

### 1) Instalar dependências
```bash
npm i
```

### 2) Criar o arquivo `src/.env`
O projeto carrega variáveis de ambiente de **`src/.env`**.

```bash
cp src/.env.example src/.env
```

Abra `src/.env` e preencha:
- `PORT`
- `DATABASE_URL` (quando for integrar com Neon)
- `JWT_SECRET` (quando ativar auth)

### 3) Rodar em dev
```bash
npm run dev
```

Health check:
- `GET http://localhost:3000/api/health`

### 4) Acessar documentação Swagger
```
http://localhost:3000/api-docs
```

**Swagger UI** permite:
- Visualizar todos os endpoints
- Testar requisições diretamente
- Ver schemas e validações
- Autenticar com JWT Bearer Token

---

## ✅ Scripts
- Dev:
```bash
npm run dev
```

- Produção local:
```bash
npm start
```

- Prisma (quando usando banco):
```bash
npm run prisma:generate
npm run prisma:migrate
```

---

# ✅ Banco de Dados (Neon) + Prisma

## 👑 Responsabilidade do líder do repositório
O dono cria o projeto no Neon e define a connection string oficial.

### 1) Criado  no Neon (resumo)
A string costuma ser assim:
```
postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

### 2) Encontrado `.env`
No `src/.env`:
```env
DATABASE_URL="postgresql://....?sslmode=require"
```

## ✅ Prisma: como usar
### Gerar client
```bash
npm run prisma:generate
```

### Rodar migrations (quando o schema estiver definido)
```bash
npm run prisma:migrate
```

> Nesta primeira etapa (até segunda), o time pode trabalhar com **MOCK** sem precisar rodar migration.  
> A integração real com DB começa na terça.

---

# ✅ Como criar seu módulo (padrão do projeto)
Você deve **copiar o padrão do módulo `coupons`**.

Exemplo (módulo `products`):
Crie a pasta:
```
src/modules/products/
```

Crie os arquivos:
- `product.routes.js`
- `product.controller.js`
- `product.service.js`

### Padrão de responsabilidade
- **routes**: define endpoints (GET/POST/PUT/DELETE)
- **controller**: recebe req/res e chama o service
- **service**: regra de negócio (e mock/DB)

### IMPORTANTE: registrar a rota no agregador
No `src/app/routes.js`, adicionar:
```js
router.use("/products", productRoutes);
```

### IMPORTANTE: documentar no Swagger
Crie também:
- `product.swagger.yaml`

Siga o padrão dos módulos existentes. Ver: `docs/SWAGGER_QUICK_GUIDE.md`

---

# ✅ Regras do Sprint (até segunda)
### Entrega mínima (obrigatória)
Cada dev deve entregar **CREATE + READ com MOCK**, seguindo:
**service → controller → routes**

✅ Mock = lista/array em memória (sem DB) + respostas JSON consistentes.

### O que NÃO fazer até segunda
- Não depender do código de outros módulos
- Não travar implementação esperando “pedido depende de produto”
- Não implementar integrações profundas entre módulos

> Na terça, o líder fará merge e iniciaremos a fase DB (Prisma/Neon) + validações/middlewares.

---

# ✅ Como entregar (PR para o líder)
### 1) Commit
```bash
git add .
git commit -m "feat: create/read mock p/ products"
```

### 2) Push para seu fork
```bash
git push origin feature/NOME_DA_TAREFA
```

### 3) Abrir Pull Request
No GitHub do seu fork:
- **Compare & pull request**
- Base repo: `DONO_DO_REPO/ecommerce-backend`
- Base branch: `main`
- Head repo: `SEU_USUARIO/ecommerce-backend`
- Compare branch: `feature/NOME_DA_TAREFA`

✅ O líder revisa e faz merge.

---

## ✅ Como atualizar seu fork com mudanças do líder (upstream)
Depois que o líder fizer merge:
```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## ✅ Convenção de commits (sugestão)
- `feat:` nova funcionalidade
- `fix:` correção
- `chore:` manutenção
- `docs:` documentação
- `test:` testes

---

## ✅ Rotas atuais
- `GET /api/health` → status da API
- `GET /api-docs` → documentação Swagger interativa

### Módulos Documentados
- **Products** - CRUD completo com relacionamentos
- **Coupons** - CRUD com autenticação JWT
- **Orders** - Criação com validação de estoque
- **Users** - Gerenciamento e confirmação de email
- **Categories** - Gerenciamento de categorias
- **Reviews** - Sistema de avaliações

📚 **Documentação completa:** `docs/SWAGGER_ARCHITECTURE.md`

---

## ✅ Dúvidas comuns
### “Preciso do Neon para trabalhar com MOCK?”
Não. Até segunda você entrega **CREATE + READ com MOCK** sem banco.

### “Quando vamos integrar o Prisma/Neon?”
Na terça, após o merge inicial, iremos:
- definir schema Prisma completo
- rodar migrations
- trocar mocks por DB

---
