const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST Stock ESCS',
            version: '1.0.0',
            description: 'API REST para la gestión de usuarios e inventario con seguridad y validaciones.'
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Servidor Local'
            }
        ]
    },
    apis: ['./src/routes/*.js'] // Ruta donde Swagger buscará los comentarios JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;