# API de Pedidos — Desafio Jitterbit

API REST em Node.js + PostgreSQL para gerenciamento de pedidos.

> **Nota sobre segurança:** O arquivo `.env` com as credenciais do banco de dados **não está incluído neste repositório** por boas práticas de segurança. Isso é intencional — credenciais nunca devem ser expostas publicamente. Siga o **passo 3** abaixo para configurá-lo localmente.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando

---

## Como rodar o projeto

### 1. Instalar as dependências
```bash
npm install
```

### 2. Configurar o banco de dados
Crie um banco de dados no PostgreSQL:
```sql
CREATE DATABASE pedidos_db;
```

Execute o script de criação das tabelas (pelo pgAdmin ou psql):
```sql
CREATE TABLE IF NOT EXISTS "Order" (
  "orderId"      VARCHAR(100) PRIMARY KEY,
  "value"        NUMERIC(10, 2) NOT NULL,
  "creationDate" TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "Items" (
  id          SERIAL PRIMARY KEY,
  "orderId"   VARCHAR(100) NOT NULL REFERENCES "Order"("orderId") ON DELETE CASCADE,
  "productId" INTEGER NOT NULL,
  quantity    INTEGER NOT NULL,
  price       NUMERIC(10, 2) NOT NULL
);
```

### 3. Configurar as variáveis de ambiente

> **Por que o `.env` não está no repositório?**
> O arquivo `.env` contém senha do banco de dados e outras credenciais sensíveis. Por boas práticas de segurança, ele nunca deve ser versionado no GitHub. O arquivo `.env.example` serve como modelo mostrando quais variáveis são necessárias.

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env   # Linux/Mac
copy .env.example .env # Windows
```

Edite o `.env` com suas credenciais do PostgreSQL:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui
DB_NAME=pedidos_db
```

### 4. Iniciar a API
```bash
# Modo normal
npm start

# Modo desenvolvimento (reinicia automaticamente)
npm run dev
```

Após iniciar, você verá:
```
Servidor rodando em http://localhost:3000
Documentacao em http://localhost:3000/api-docs
Conectado ao PostgreSQL com sucesso!
```

---

## Documentacao Swagger

A API possui documentacao interativa gerada automaticamente pelo Swagger.

Acesse após iniciar o servidor:
```
http://localhost:3000/api-docs
```

Pelo Swagger voce pode visualizar e testar todos os endpoints diretamente no navegador, sem precisar de ferramentas externas como Postman.

---

## Endpoints

| Metodo | URL | Descricao |
|--------|-----|-----------|
| POST | `/order` | Criar novo pedido |
| GET | `/order/:numeroPedido` | Buscar pedido por numero |
| GET | `/order/list` | Listar todos os pedidos |
| PUT | `/order/:numeroPedido` | Atualizar pedido |
| DELETE | `/order/:numeroPedido` | Deletar pedido |

---

## Exemplos de uso

### Criar pedido (POST /order)
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }'
```

### Buscar pedido (GET /order/:numeroPedido)
```bash
curl http://localhost:3000/order/v10089015vdb-01
```

### Listar todos (GET /order/list)
```bash
curl http://localhost:3000/order/list
```

### Atualizar pedido (PUT /order/:numeroPedido)
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Content-Type: application/json" \
  -d '{
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 1500
      }
    ]
  }'
```

### Deletar pedido (DELETE /order/:numeroPedido)
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01
```

---

## Estrutura do banco de dados

### Tabela Order
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| orderId | VARCHAR | Numero unico do pedido (PK) |
| value | NUMERIC | Valor total |
| creationDate | TIMESTAMP | Data de criacao |

### Tabela Items
| Coluna | Tipo | Descricao |
|--------|------|-----------|
| id | SERIAL | ID interno (PK) |
| orderId | VARCHAR | Referencia ao pedido (FK) |
| productId | INTEGER | ID do produto |
| quantity | INTEGER | Quantidade |
| price | NUMERIC | Preco unitario |

---

## Estrutura do projeto

```
api-pedidos/
├── src/
│   ├── config/
│   │   ├── database.js         # Conexao com PostgreSQL
│   │   ├── swagger.js          # Configuracao da documentacao
│   │   └── migration.sql       # Script para criar as tabelas
│   ├── controllers/
│   │   └── orderController.js  # Logica de cada endpoint
│   ├── models/
│   │   └── orderModel.js       # Queries do banco de dados
│   ├── routes/
│   │   └── orderRoutes.js      # Definicao das rotas
│   └── index.js                # Arquivo principal
├── .env.example                # Modelo de variaveis de ambiente
├── .gitignore                  # Arquivos ignorados pelo Git
├── package.json
└── README.md
```
