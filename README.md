# API de Usuários (Express + JWT + Swagger)

Esta API permite o registro, login, consulta e edição de usuários, com autenticação JWT e documentação Swagger.

## Instalação

1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:

```bash
npm install
```

## Executando a API

```bash
node server.js
```

A API estará disponível em `http://localhost:3000`.

## Endpoints

- `POST /api/register` — Registra um novo usuário
- `POST /api/login` — Realiza login e retorna um token JWT
- `GET /api/users` — Lista todos os usuários (requer token JWT)
- `PUT /api/users/:login` — Edita o próprio usuário (requer token JWT)
- `GET /api-docs` — Documentação Swagger

## Regras e Validações

- Usuário e senha são obrigatórios para cadastro.
- Não permite usuários duplicados (login único).
- E-mail deve ser válido.
- Apenas o próprio usuário pode editar seus dados.
- O login exige usuário e senha válidos.

## Autenticação

Inclua o token JWT retornado no login no header:

```
Authorization: Bearer <token>
```

## Documentação Swagger

Acesse `/api-docs` para visualizar e testar os endpoints.
