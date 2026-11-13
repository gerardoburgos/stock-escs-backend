const jwt = require('jsonwebtoken');

// Middleware 1: Verificar que el usuario traiga un Token válido
const verificarToken = (req, res, next) => {
    // 1. Obtener la cabecera de autorización (El estándar es "Bearer <token>")
    const authHeader = req.headers['authorization'];
    
    // Si no hay cabecera o no empieza con "Bearer ", le negamos el acceso (401)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado o formato inválido' });
    }

    // 2. Extraer solo el token (quitando la palabra "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificar si el token es válido usando nuestra clave secreta
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'super_secreto_desarrollo');
        
        // 4. Guardar los datos del usuario (email, rol, id) en req.user para usarlos más adelante
        req.user = payload;
        
        // 5. Permitirle el paso a la ruta
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Acceso denegado: Token inválido o expirado' });
    }
};

// Middleware 2: Verificar si el usuario tiene rol de 'admin'
const verificarRolAdmin = (req, res, next) => {
    // Verificamos si el usuario en sesión tiene el rol de administrador
    if (req.user && req.user.rol === 'admin') {
        next(); // Le damos el paso
    } else {
        // Si es 'usuario' normal, le bloqueamos el acceso (403 Prohibido)
        return res.status(403).json({ error: 'Acceso denegado: No cuentas con permisos de administrador' });
    }
};

module.exports = {
    verificarToken,
    verificarRolAdmin
};