const pool = require('../config/database');

// =============================================
// MODEL - responsável por falar com o banco
// =============================================

const OrderModel = {

  // Cria um novo pedido no banco
  async create(orderData) {
    const client = await pool.connect();

    try {
      // Inicia uma transação (garante que tudo salva junto ou nada salva)
      await client.query('BEGIN');

      // Insere o pedido principal na tabela Order
      await client.query(
        `INSERT INTO "Order" ("orderId", "value", "creationDate") VALUES ($1, $2, $3)`,
        [orderData.orderId, orderData.value, orderData.creationDate]
      );

      // Insere cada item do pedido na tabela Items
      for (const item of orderData.items) {
        await client.query(
          `INSERT INTO "Items" ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)`,
          [orderData.orderId, item.productId, item.quantity, item.price]
        );
      }

      // Confirma a transação
      await client.query('COMMIT');

      // Retorna o pedido completo criado
      return await OrderModel.findById(orderData.orderId, client);

    } catch (error) {
      // Se der erro, desfaz tudo
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Busca um pedido pelo ID (numeroPedido)
  async findById(orderId) {
    // Busca o pedido
    const orderResult = await pool.query(
      `SELECT * FROM "Order" WHERE "orderId" = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) return null;

    // Busca os itens do pedido
    const itemsResult = await pool.query(
      `SELECT * FROM "Items" WHERE "orderId" = $1`,
      [orderId]
    );

    // Monta o objeto completo
    const order = orderResult.rows[0];
    order.items = itemsResult.rows;
    return order;
  },

  // Lista todos os pedidos
  async findAll() {
    const ordersResult = await pool.query(`SELECT * FROM "Order" ORDER BY "creationDate" DESC`);
    const orders = ordersResult.rows;

    // Para cada pedido, busca seus itens
    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT * FROM "Items" WHERE "orderId" = $1`,
        [order.orderId]
      );
      order.items = itemsResult.rows;
    }

    return orders;
  },

  // Atualiza um pedido existente
  async update(orderId, orderData) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Atualiza o pedido principal
      await client.query(
        `UPDATE "Order" SET "value" = $1, "creationDate" = $2 WHERE "orderId" = $3`,
        [orderData.value, orderData.creationDate, orderId]
      );

      // Remove os itens antigos e insere os novos
      await client.query(`DELETE FROM "Items" WHERE "orderId" = $1`, [orderId]);

      for (const item of orderData.items) {
        await client.query(
          `INSERT INTO "Items" ("orderId", "productId", quantity, price) VALUES ($1, $2, $3, $4)`,
          [orderId, item.productId, item.quantity, item.price]
        );
      }

      await client.query('COMMIT');
      return await OrderModel.findById(orderId);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Deleta um pedido pelo ID
  async delete(orderId) {
    const result = await pool.query(
      `DELETE FROM "Order" WHERE "orderId" = $1 RETURNING *`,
      [orderId]
    );
    return result.rows.length > 0; // retorna true se deletou, false se não encontrou
  }
};

module.exports = OrderModel;
