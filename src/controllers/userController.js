const db = require('../config/db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken'); // <-- NUEVO: Importamos la librería de tokens

// GET /api/usuarios
const getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nombre, email, rol, created_at FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
    }
};

// GET /api/usuarios/:id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario', details: error.message });
    }
};

// POST /api/usuarios (Crear con Hash Argon2id)
const createUser = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Hashear la contraseña usando el algoritmo Argon2id
        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, passwordHash, rol || 'usuario']
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            userId: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El email ya se encuentra registrado' });
        }
        res.status(500).json({ error: 'Error al crear usuario', details: error.message });
    }
};

// POST /api/usuarios/login <-- NUEVO: Función para iniciar sesión y generar el JWT
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si el usuario existe en la base de datos
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            // Rúbrica: Respuestas personalizadas (401 No autorizado)
            return res.status(401).json({ error: 'Credenciales inválidas: Usuario no encontrado' });
        }

        const user = rows[0];

        // 2. Verificar que la contraseña coincida usando Argon2id
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas: Contraseña incorrecta' });
        }

        // 3. Generar el JWT (Pase VIP) con email y rol (Exigencia de la pauta)
        const payload = {
            id: user.id,
            email: user.email,
            rol: user.rol
        };

        // Usamos una clave secreta del .env o una por defecto
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secreto_desarrollo', {
            expiresIn: '2h' // El token dura 2 horas
        });

        // 4. Enviar el token al cliente (200 OK)
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token: token,
            user: {
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error interno al iniciar sesión', details: error.message });
    }
};

// PUT /api/usuarios/:id
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, rol } = req.body;

        let query = 'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?';
        let params = [nombre, email, rol || 'usuario', id];

        if (password) {
            const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
            query = 'UPDATE usuarios SET nombre = ?, email = ?, password = ?, rol = ? WHERE id = ?';
            params = [nombre, email, passwordHash, rol || 'usuario', id];
        }

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar usuario', details: error.message });
    }
};

// DELETE /api/usuarios/:id
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario', details: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    loginUser, // <-- NUEVO: Exportamos la función
    updateUser,
    deleteUser
};