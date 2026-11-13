const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { validateInventory } = require('../middlewares/validator');
const { verificarToken, verificarRolAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventario:
 *       type: object
 *       required:
 *         - codigo_sku
 *         - nombre_producto
 *         - cantidad
 *         - precio
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         codigo_sku:
 *           type: string
 *           example: "PROD-100"
 *         nombre_producto:
 *           type: string
 *           example: "Laptop HP ProBook"
 *         descripcion:
 *           type: string
 *           example: "Equipo corporativo Intel i7 16GB RAM"
 *         cantidad:
 *           type: integer
 *           example: 10
 *         precio:
 *           type: number
 *           example: 650000.00
 */

/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Obtiene todos los artículos del inventario
 *     tags: [Inventario]
 *     responses:
 *       200:
 *         description: Lista de ítems obtenida con éxito
 *   post:
 *     summary: Crea un nuevo producto en el inventario
 *     tags: [Inventario]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       201:
 *         description: Producto creado con éxito
 */
router.get('/', verificarToken, inventoryController.getInventory);
router.post('/', verificarToken, verificarRolAdmin, validateInventory, inventoryController.createInventoryItem);

/**
 * @swagger
 * /inventario/{id}:
 *   get:
 *     summary: Obtiene un artículo de inventario por ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *   put:
 *     summary: Actualiza un producto del inventario por ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventario'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *   delete:
 *     summary: Elimina un ítem del inventario por ID
 *     tags: [Inventario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.get('/:id', verificarToken, inventoryController.getInventoryById);
router.put('/:id', verificarToken, verificarRolAdmin, validateInventory, inventoryController.updateInventoryItem);
router.delete('/:id', verificarToken, verificarRolAdmin, inventoryController.deleteInventoryItem);

module.exports = router;