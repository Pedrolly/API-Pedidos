const OrderModel = require('../models/orderModel');

// =============================================
// CONTROLLER - responsável pela lógica da API
// =============================================

const OrderController = {

  // POST /order - Criar novo pedido
  async create(req, res) {
    try {
      const body = req.body;

      // Validação dos campos obrigatórios
      if (!body.numeroPedido || !body.valorTotal || !body.dataCriacao || !body.items) {
        return res.status(400).json({
          error: 'Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items'
        });
      }

      if (!Array.isArray(body.items) || body.items.length === 0) {
        return res.status(400).json({ error: 'items deve ser um array com pelo menos 1 item' });
      }

      // Faz o MAPPING dos campos: português → inglês (como exigido no desafio)
      const orderData = {
        orderId: body.numeroPedido,           // numeroPedido → orderId
        value: body.valorTotal,               // valorTotal   → value
        creationDate: body.dataCriacao,       // dataCriacao  → creationDate
        items: body.items.map(item => ({
          productId: item.idItem,             // idItem          → productId
          quantity: item.quantidadeItem,      // quantidadeItem  → quantity
          price: item.valorItem               // valorItem       → price
        }))
      };

      const newOrder = await OrderModel.create(orderData);

      return res.status(201).json({
        message: 'Pedido criado com sucesso!',
        data: newOrder
      });

    } catch (error) {
      // Erro de chave duplicada (pedido já existe)
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Já existe um pedido com este número.' });
      }
      console.error('Erro ao criar pedido:', error.message);
      return res.status(500).json({ error: 'Erro interno ao criar pedido.' });
    }
  },

  // GET /order/:numeroPedido - Buscar pedido por ID
  async getById(req, res) {
    try {
      const { numeroPedido } = req.params;

      const order = await OrderModel.findById(numeroPedido);

      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      return res.status(200).json({ data: order });

    } catch (error) {
      console.error('Erro ao buscar pedido:', error.message);
      return res.status(500).json({ error: 'Erro interno ao buscar pedido.' });
    }
  },

  // GET /order/list - Listar todos os pedidos
  async getAll(req, res) {
    try {
      const orders = await OrderModel.findAll();

      return res.status(200).json({
        total: orders.length,
        data: orders
      });

    } catch (error) {
      console.error('Erro ao listar pedidos:', error.message);
      return res.status(500).json({ error: 'Erro interno ao listar pedidos.' });
    }
  },

  // PUT /order/:numeroPedido - Atualizar pedido
  async update(req, res) {
    try {
      const { numeroPedido } = req.params;
      const body = req.body;

      // Verifica se o pedido existe
      const existing = await OrderModel.findById(numeroPedido);
      if (!existing) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      // Mapping dos campos
      const orderData = {
        value: body.valorTotal || existing.value,
        creationDate: body.dataCriacao || existing.creationDate,
        items: body.items ? body.items.map(item => ({
          productId: item.idItem,
          quantity: item.quantidadeItem,
          price: item.valorItem
        })) : existing.items
      };

      const updatedOrder = await OrderModel.update(numeroPedido, orderData);

      return res.status(200).json({
        message: 'Pedido atualizado com sucesso!',
        data: updatedOrder
      });

    } catch (error) {
      console.error('Erro ao atualizar pedido:', error.message);
      return res.status(500).json({ error: 'Erro interno ao atualizar pedido.' });
    }
  },

  // DELETE /order/:numeroPedido - Deletar pedido
  async remove(req, res) {
    try {
      const { numeroPedido } = req.params;

      const deleted = await OrderModel.delete(numeroPedido);

      if (!deleted) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      return res.status(200).json({ message: 'Pedido deletado com sucesso!' });

    } catch (error) {
      console.error('Erro ao deletar pedido:', error.message);
      return res.status(500).json({ error: 'Erro interno ao deletar pedido.' });
    }
  }
};

module.exports = OrderController;
