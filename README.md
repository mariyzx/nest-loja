# Loja - API REST com NestJS

Esta é uma API REST desenvolvida com NestJS para gerenciar uma loja virtual, permitindo o gerenciamento de produtos e usuários.

## 🛠️ Tecnologias Utilizadas

- **NestJS** (v11.0.1) - Framework Node.js para construção de aplicações escaláveis
- **TypeORM** (v0.3.27) - ORM para TypeScript e JavaScript
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados
- **class-validator** e **class-transformer** - Validação de dados
- **Jest** - Framework de testes

## 🚀 Funcionalidades

- Gerenciamento de usuários (CRUD)
- Gerenciamento de produtos (CRUD)
- Gerenciamento de pedidos (CRUD)
- Suporte a imagens de produtos
- Especificações de produtos
- Validação de dados
- Validação de email único para usuários
- Controle de estoque automático
- Sistema de status de pedidos

## 📋 Pré-requisitos

- Node.js
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/mariyzx/nest-loja.git
cd nest-loja
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_ADMIN_EMAIL=seu_email
```

4. Inicie o banco de dados com Docker:
```bash
docker-compose up -d
```

5. Execute a aplicação:
```bash
# desenvolvimento
npm run start:dev

## 🧪 Testes

Para executar os testes:

```bash
# testes unitários
npm run test

# testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# cobertura de testes
npm run test:cov

# testes e2e
npm run test:e2e
```

### Estrutura de Testes

Os testes unitários estão organizados na pasta `test/` com a seguinte estrutura:
- `test/users/` - Testes para o módulo de usuários
  - `user.controller.spec.ts` - Testes do UserController
  - `user.service.spec.ts` - Testes do UserService
- `test/products/` - Testes para o módulo de produtos
  - `product.controller.spec.ts` - Testes do ProductsController
  - `product.service.spec.ts` - Testes do ProductService

## 🧪 Testes

Para executar os testes:

```bash
# testes unitários
npm run test

# testes e2e
npm run test:e2e

# cobertura de testes
npm run test:cov
```

## 📁 Estrutura do Projeto

- `src/`
  - `config/` - Configurações do projeto
  - `products/` - Módulo de produtos com entidades, controller, service e DTOs
  - `users/` - Módulo de usuários com entidades, controller, service e DTOs
- `test/` - Testes e2e

## 🔌 Endpoints

### Usuários
- `POST /users` - Criar usuário
- `GET /users` - Listar usuários
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário

### Produtos
- `POST /products` - Criar produto
- `GET /products` - Listar produtos
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto

### Pedidos
- `POST /order?userId={userId}` - Criar pedido (requer ID do usuário como query parameter)
- `GET /order` - Listar pedidos
- `PUT /order/:id` - Atualizar status do pedido
- `DELETE /order/:id` - Deletar pedido

## 🗄️ Banco de Dados

O projeto utiliza PostgreSQL como banco de dados, configurado via Docker Compose. O PGAdmin está incluído para gerenciamento do banco de dados e pode ser acessado em `http://localhost:8081`.
