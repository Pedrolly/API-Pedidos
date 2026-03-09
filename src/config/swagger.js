const swaggerJsdoc = require('swagger-jsdoc');

// Configuração do Swagger — define as informações gerais da API
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '📦 API de Pedidos',
      version: '1.0.0',
      description: `
API REST para gerenciamento de pedidos desenvolvida em Node.js com PostgreSQL.

## Funcionalidades
- ✅ Criar pedidos
- ✅ Buscar pedido por número
- ✅ Listar todos os pedidos
- ✅ Atualizar pedidos
- ✅ Deletar pedidos

## Observações
- Os campos recebidos em português são convertidos (mapeados) para inglês antes de salvar no banco.
- Exemplo: \`numeroPedido\` → \`orderId\`, \`valorTotal\` → \`value\`
      `,
      contact: {
        name: 'Desafio Jitterbit',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desenvolvimento',
      },
    ],
    // Componentes reutilizáveis (schemas)
    components: {
      schemas: {
        // Schema do body de entrada (em português, como a API recebe)
        PedidoInput: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            numeroPedido: {
              type: 'string',
              example: 'v10089015vdb-01',
              description: 'Número único do pedido',
            },
            valorTotal: {
              type: 'number',
              example: 10000,
              description: 'Valor total do pedido',
            },
            dataCriacao: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-19T12:24:11.5299601+00:00',
              description: 'Data de criação do pedido',
            },
            items: {
              type: 'array',
              description: 'Lista de itens do pedido',
              items: {
                type: 'object',
                required: ['idItem', 'quantidadeItem', 'valorItem'],
                properties: {
                  idItem: {
                    type: 'string',
                    example: '2434',
                    description: 'ID do produto',
                  },
                  quantidadeItem: {
                    type: 'integer',
                    example: 1,
                    description: 'Quantidade do item',
                  },
                  valorItem: {
                    type: 'number',
                    example: 1000,
                    description: 'Valor unitário do item',
                  },
                },
              },
            },
          },
        },
        // Schema da resposta (em inglês, como fica salvo no banco)
        PedidoResponse: {
          type: 'object',
          properties: {
            orderId: { type: 'string', example: 'v10089015vdb-01' },
            value: { type: 'number', example: 10000 },
            creationDate: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  orderId: { type: 'string', example: 'v10089015vdb-01' },
                  productId: { type: 'integer', example: 2434 },
                  quantity: { type: 'integer', example: 1 },
                  price: { type: 'number', example: 1000 },
                },
              },
            },
          },
        },
        // Schema de erro
        Erro: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro aqui' },
          },
        },
      },
    },
  },
  // Onde o swagger vai procurar os comentários das rotas
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
