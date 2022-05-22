import express from "express";
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

let router = express.Router();


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Employee API',
            version: '1.0.0'
        }
    },
    apis: ['src/route/web.js'],
}
let initWebRoutes = (app) => {

    const swaggerDocs = swaggerJsdoc(swaggerOptions);

    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

    /** 
 * @swagger 
 * /test: 
 *   get: 
 *     tags: ["Test API Swagger"]
 *     description: Get test API
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/test', (req, res) => {
        res.send([
            {
                id: 1, Name: 'Jk'
            },
            {
                id: 2, Name: 'Jay'
            }
        ])
    });

    /** 
 * @swagger 
 * /test: 
 *   post: 
 *     tags: ["Test API Swagger"]
 *     description: Create an Employee 
 *     parameters: 
 *     - name: EmployeeName 
 *       description: Create an new employee 
 *       in: formData 
 *       required: true 
 *       type: String 
 *     responses:  
 *       201: 
 *         description: Created 
 *   
 */
    router.post('/test-post', (req, res) => {
        res.status(201).send();
    });

    return app.use("/", router);
}

module.exports = initWebRoutes