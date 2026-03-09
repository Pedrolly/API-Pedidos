const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Carrega as variáveis do arquivo .env
dotenv.config();

const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARES
// =============================================

// Permite receber JSON no body das requisições
app.use(express.json());

// =============================================
// DOCUMENTAÇÃO — Swagger UI
// Acesse: http://localhost:3000/api-docs
// =============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API de Pedidos - Docs',
}));

// =============================================
// ROTAS
// =============================================

// Rota principal para verificar se a API está online
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API de Pedidos está funcionando!',
    documentacao: 'http://localhost:3000/api-docs',
    endpoints: {
      'POST   /order':               'Criar novo pedido',
      'GET    /order/:numeroPedido': 'Buscar pedido por número',
      'GET    /order/list':          'Listar todos os pedidos',
      'PUT    /order/:numeroPedido': 'Atualizar pedido',
      'DELETE /order/:numeroPedido': 'Deletar pedido',
    }
  });
});

// Rotas de pedidos
app.use('/order', orderRoutes);

// Rota para URLs não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// =============================================
// INICIA O SERVIDOR
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação em  http://localhost:${PORT}/api-docs`);
});
