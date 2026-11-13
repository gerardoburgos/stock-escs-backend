const express = require('express');
const router = express.Router();
const { validateUser } = require('../middlewares/validator');
const { getUsers, getUserById, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');
const { verificarToken, verificarRolAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Juan Pérez"
 *         email:
 *           type: string
 *           example: "juan.perez@escueladecomercio.cl"
 *         password:
 *           type: string
 *           example: "ClaveSegura123!"
 *         rol:
 *           type: string
 *           example: "admin"
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtiene la lista completa de usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *   post:
 *     summary: Registra un nuevo usuario con contraseña hasheada en Argon2id
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos o email duplicado
 */
router.get('/', verificarToken, verificarRolAdmin, getUsers);
router.post('/', validateUser, createUser);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [Usuarios]
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
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
// ... (arriba sigue igual)

// --- RUTAS PÚBLICAS (No piden token) ---
router.post('/login', loginUser); 
// Si tienes la ruta de createUser (para registro), debe ir libre también:
// router.post('/', createUser); 

// --- RUTAS PROTEGIDAS (Requieren Token obligatorio) ---
router.get('/:id', verificarToken, getUserById); // Cualquier usuario logueado puede ver un perfil
router.put('/:id', verificarToken, validateUser, updateUser); // Cualquier usuario logueado puede editar

// --- RUTAS EXCLUSIVAS DE ADMINISTRADOR (Requieren Token + Rol Admin) ---
// (Si tienes router.get('/', getUsers) definida, protégela así):
// router.get('/', verificarToken, verificarRolAdmin, getUsers); 
router.delete('/:id', verificarToken, verificarRolAdmin, deleteUser); // Solo el admin puede borrar usuarios

module.exports = router;