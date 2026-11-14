# API de autenticação 

API REST de cadastro e login contruída com Node.js, Express, SQLite, bcrypt e JWT.

## Tecnologias 

-Node.js; Express; better-sqlite3; bcryptjs; jsonwebtoken.

## Como rodar 

1. Clone o repositório
2. Instale as dependências: "npm install"
3. Inicie "npm run dev"

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Endpoints

O arquivo [`requests.http`](requests.http) reúne exemplos prontos de requisição para testar a API no VS Code com a extensão REST Client.

### POST /auth/register

Cadastra um novo usuário. A senha é armazenada como hash (bcrypt), nunca em texto puro.

*Corpo da requisição (JSON)*

| Campo | Tipo | Regras |
|---|---|---|
| name | string | obrigatório |
| email | string | obrigatório, formato de e-mail válido, único (não diferencia maiúsculas de minúsculas) |
| password | string | obrigatório, mínimo de 8 caracteres |

*Exemplo*

bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Maria","email":"maria@email.com","password":"senha12345"}'


*Resposta de sucesso: 201 Created*

json
{
  "id": 1,
  "name": "Maria",
  "email": "maria@email.com"
}


*Respostas de erro*

| Status | Quando acontece | Mensagem |
|---|---|---|
| 400 | Nome, e-mail ou senha ausentes (ou não são texto) | Nome, e-mail e senha são obrigatórios. |
| 400 | E-mail em formato inválido | E-mail inválido. |
| 400 | Senha com menos de 8 caracteres | A senha deve ter pelo menos 8 caracteres. |
| 409 | E-mail já cadastrado | E-mail já cadastrado. |

Os erros seguem o formato { "error": "mensagem" }.

## Status

Em desenvolvimento.