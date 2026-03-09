# 🛒 API de Pedidos — Desafio Jitterbit

API REST em Node.js + PostgreSQL para gerenciamento de pedidos.

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [PostgreSQL](https://www.postgresql.org/) instalado e rodando

---

## 🚀 Como rodar o projeto

### 1. Instalar as dependências
```bash
npm install
```

### 2. Configurar o banco de dados
Crie um banco de dados no PostgreSQL:
```sql
CREATE DATABASE pedidos_db;
```

Execute o script de criação das tabelas:
```bash
psql -U postgres -d pedidos_db -f src/config/migration.sql
```

### 3. Configurar as variáveis de ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
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

---

## 📡 Endpoints

| Método | URL | Descrição |
|--------|-----|-----------|
| POST | `/order` | Criar novo pedido |
| GET | `/order/:numeroPedido` | Buscar pedido por número |
| GET | `/order/list` | Listar todos os pedidos |
| PUT | `/order/:numeroPedido` | Atualizar pedido |
| DELETE | `/order/:numeroPedido` | Deletar pedido |

---

## 📝 Exemplos de uso

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

## 🗄️ Estrutura do banco de dados

### Tabela Order
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| orderId | VARCHAR | Número único do pedido (PK) |
| value | NUMERIC | Valor total |
| creationDate | TIMESTAMP | Data de criação |

### Tabela Items
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | SERIAL | ID interno (PK) |
| orderId | VARCHAR | Referência ao pedido (FK) |
| productId | INTEGER | ID do produto |
| quantity | INTEGER | Quantidade |
| price | NUMERIC | Preço unitário |

---

## 📁 Estrutura do projeto

```
api-pedidos/
├── src/
│   ├── config/
│   │   ├── database.js      # Conexão com PostgreSQL
│   │   └── migration.sql    # Script para criar as tabelas
│   ├── controllers/
│   │   └── orderController.js  # Lógica de cada endpoint
│   ├── models/
│   │   └── orderModel.js    # Queries do banco de dados
│   ├── routes/
│   │   └── orderRoutes.js   # Definição das rotas
│   └── index.js             # Arquivo principal
├── .env.example             # Modelo de variáveis de ambiente
├── package.json
└── README.md
```
