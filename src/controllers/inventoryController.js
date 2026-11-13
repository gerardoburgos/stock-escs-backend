const db = require('../config/db');

// GET /api/inventario
const getInventory = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM inventario');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inventario', details: error.message });
    }
};

// GET /api/inventario/:id
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM inventario WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto', details: error.message });
    }
};

// POST /api/inventario
const createInventoryItem = async (req, res) => {
    try {
        const { codigo_sku, nombre_producto, descripcion, cantidad, precio } = req.body;

        const [result] = await db.query(
            'INSERT INTO inventario (codigo_sku, nombre_producto, descripcion, cantidad, precio) VALUES (?, ?, ?, ?, ?)',
            [codigo_sku, nombre_producto, descripcion || '', cantidad, precio]
        );

        res.status(201).json({
            message: 'Producto agregado al inventario exitosamente',
            itemId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El código SKU ya existe' });
        }
        res.status(500).json({ error: 'Error al registrar producto', details: error.message });
    }
};

// PUT /api/inventario/:id
const updateInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo_sku, nombre_producto, descripcion, cantidad, precio } = req.body;

        const [result] = await db.query(
            'UPDATE inventario SET codigo_sku = ?, nombre_producto = ?, descripcion = ?, cantidad = ?, precio = ? WHERE id = ?',
            [codigo_sku, nombre_producto, descripcion || '', cantidad, precio, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto de inventario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto', details: error.message });
    }
};

// DELETE /api/inventario/:id
const deleteInventoryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM inventario WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado del inventario correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto', details: error.message });
    }
};

module.exports = {
    getInventory,
    getInventoryById,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem
};