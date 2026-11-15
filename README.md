# API de autenticação 

API REST de cadastro e login contruída com Node.js, Express, SQLite, bcrypt e JWT.

## Tecnologias 

-Node.js; Express; better-sqlite3; bcryptjs; jsonwebtoken.

## Como rodar 

1. Clone o repositório
2. Instale as dependências: "npm install"
3. Inicie "npm run dev"

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Estrutura do projeto


src/
├── db.js                 # conexão SQLite e criação da tabela users
├── server.js             # configuração do Express e montagem das rotas
├── middleware/
│   └── auth.js           # valida o token JWT (requireAuth)
└── routes/
    ├── auth.js           # POST /auth/register e POST /auth/login
    └── users.js          # GET /users/me (rota protegida)


## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| JWT_SECRET | Chave usada para assinar os tokens JWT. Use uma string longa e aleatória |
| PORT | Porta do servidor (padrão: 3000) |

Use o arquivo .env.example como modelo.

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

### POST /auth/login

Autentica um usuário e devolve um token JWT válido por 1 hora.

*Corpo da requisição (JSON)*

| Campo | Tipo | Regras |
|---|---|---|
| `email` | string | obrigatório (não diferencia maiúsculas de minúsculas) |
| `password` | string | obrigatório |

*Exemplo*

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@email.com","password":"senha12345"}'
```

*Resposta de sucesso: `200 OK`*

```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Maria",
    "email": "maria@email.com"
  }
}
```

*Respostas de erro*

| Status | Quando acontece | Mensagem |
|---|---|---|
| `400` | E-mail ou senha ausentes (ou não são texto) | `E-mail e senha são obrigatórios.` |
| `401` | E-mail inexistente ou senha incorreta | `Credenciais inválidas.` |

A mensagem do `401` é a mesma nos dois casos de propósito, para não revelar quais e-mails estão cadastrados.

### GET /users/me

Retorna os dados do usuário autenticado. Rota protegida: exige o token JWT obtido no login.

*Cabeçalho obrigatório*

| Cabeçalho | Valor |
|---|---|
| Authorization | Bearer <token> |

*Exemplo*

bash
curl http://localhost:3000/users/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"


*Resposta de sucesso: 200 OK*

json
{
  "id": 1,
  "name": "Maria",
  "email": "maria@email.com",
  "created_at": "2026-11-15 12:00:00"
}


*Respostas de erro*

| Status | Quando acontece | Mensagem |
|---|---|---|
| 401 | Cabeçalho ausente ou fora do formato Bearer <token> | Token não informado. |
| 401 | Token adulterado, inválido ou expirado | Token inválido ou expirado. |
| 404 | Token válido, mas o usuário não existe mais | Usuário não encontrado. |

## Decisões de segurança

- *Senhas:* armazenadas apenas como hash bcrypt (com salt). A senha e o hash nunca são devolvidos pela API.
- *Login:* a mesma mensagem (Credenciais inválidas.) é devolvida para e-mail inexistente e senha incorreta, para não revelar quais e-mails estão cadastrados.
- *Token JWT:* assinado com JWT_SECRET, validade de 1 hora, verificado com algoritmo fixo (HS256). O payload guarda apenas o id do usuário.
- *SQL:* todas as consultas usam parâmetros (?), o que previne SQL injection.
- *Segredos:* o .env e o banco local ficam fora do Git (.gitignore).
- *Erros:* respostas de erro não expõem detalhes internos nem stack traces.

## Status
Versão 1.0 concluída: cadastro, login com JWT e rota protegida.

## Próximos passos

- Rate limiting no login, helmet e cors
- Validação com zod
- Testes automatizados
- Refresh token