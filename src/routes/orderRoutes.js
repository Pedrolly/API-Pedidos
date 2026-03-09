const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// =============================================
// ROTAS da API de Pedidos
// =============================================

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Criar um novo pedido
 *     description: Cria um novo pedido no banco de dados. Os campos em português são mapeados para inglês automaticamente.
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido criado com sucesso!
 *                 data:
 *                   $ref: '#/components/schemas/PedidoResponse'
 *       400:
 *         description: Campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       409:
 *         description: Pedido com esse número já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.post('/', OrderController.create);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Listar todos os pedidos
 *     description: Retorna uma lista com todos os pedidos cadastrados no banco de dados.
 *     tags:
 *       - Pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/list', OrderController.getAll);

/**
 * @swagger
 * /order/{numeroPedido}:
 *   get:
 *     summary: Buscar pedido por número
 *     description: Retorna os dados de um pedido específico com base no número informado na URL.
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/PedidoResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *   put:
 *     summary: Atualizar pedido
 *     description: Atualiza os dados de um pedido existente.
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoInput'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido atualizado com sucesso!
 *                 data:
 *                   $ref: '#/components/schemas/PedidoResponse'
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 *   delete:
 *     summary: Deletar pedido
 *     description: Remove permanentemente um pedido e seus itens do banco de dados.
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: numeroPedido
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb-01
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido deletado com sucesso!
 *       404:
 *         description: Pedido não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Erro'
 */
router.get('/:numeroPedido', OrderController.getById);
router.put('/:numeroPedido', OrderController.update);
router.delete('/:numeroPedido', OrderController.remove);

module.exports = router;
