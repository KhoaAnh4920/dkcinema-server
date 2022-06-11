import express from "express";
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
import UserController from "../controllers/UserControler";
import MovieTheaterController from "../controllers/MovieTheaterController";
import RoomController from "../controllers/RoomController";
import TypeMovieController from "../controllers/TypeMovieController";



let router = express.Router();


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Dkcinema API',
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
 * /test-movie: 
 *   get: 
 *     tags: ["Test API Swagger"]
 *     description: Get test API
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/test-movie', MovieTheaterController.handleGetAllMovieTheater);



    /**
* @swagger
*  /admin-login:
*    post:
*      summary: Login Admin.
*      consumes:
*        - application/json
*      tags:
*        - Auth
*      parameters:
*        - in: body
*          name: Admin
*          description: Login for Admin.
*          schema:
*            type: object
*            required:
*              - email
*              - password
*            properties:
*              email:
*                type: string
*              password:
*                type: string
*      responses:
*        201:
*          description: Login OK!
*/
    router.post('/admin-login', UserController.handleLogin);


    /** 
 * @swagger 
 * /get-roles: 
 *   get: 
 *     tags: ["Users"]
 *     description: Get test API
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/get-roles', UserController.getAllRoles);

    /** 
 * @swagger 
 * /get-list-users: 
 *   get: 
 *     tags: ["Users"]
 *     description: Get List User
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/get-list-users', UserController.handleGetAllUser);

    /** 
 * @swagger 
 * /users/{userId}: 
 *   get: 
 *     tags: ["Users"]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/users/:userId', UserController.handleGetUserById);



    /**
* @swagger
*  /users:
*    post:
*      summary: Admin create user.
*      consumes:
*        - application/json
*      tags:
*        - Users
*      parameters:
*        - in: body
*          name: Admin
*          description: Create user.
*          schema:
*            type: object
*            required:
*              - email
*              - password
*              - fullName
*              - avatar
*              - gender
*              - birthday
*              - roleId
*              - cityCode
*              - districtCode
*              - wardCode
*              - address
*              - phone
*            properties:
*              email:
*                type: string
*              password:
*                type: string
*              fullName:
*                type: string
*              avatar:
*                type: string
*              gender:
*                type: boolean
*              birthday:
*                type: integer
*                example: 1640599036184
*              roleId:
*                type: integer
*                example: 1
*              cityCode:
*                type: integer
*                example: 294
*              districtCode:
*                type: integer
*                example: 491
*              wardCode:
*                type: integer
*                example: 10510
*              address:
*                type: string
*              phone:
*                type: string
*      responses:
*        201:
*          description: Admin create User!
*/
    router.post('/users', UserController.handleCreateNewUser);


    /**
* @swagger
*  /users:
*    put:
*      summary: Admin edit user.
*      consumes:
*        - application/json
*      tags:
*        - Users
*      parameters:
*        - in: body
*          name: Admin
*          description: Edit user.
*          schema:
*            type: object
*            required:
*              - id
*              - fullName
*              - avatar
*              - gender
*              - birthday
*              - roleId
*              - cityCode
*              - districtCode
*              - wardCode
*              - address
*              - phone
*            properties:
*              id:
*                type: integer
*              fullName:
*                type: string
*              avatar:
*                type: string
*              gender:
*                type: boolean
*              birthday:
*                type: integer
*                example: 1640599036184
*              roleId:
*                type: integer
*                example: 1
*              cityCode:
*                type: integer
*                example: 294
*              districtCode:
*                type: integer
*                example: 491
*              wardCode:
*                type: integer
*                example: 10510
*              address:
*                type: string
*              phone:
*                type: string
*      responses:
*        201:
*          description: Admin update User!
*/
    router.put('/users', UserController.handleEditUser);


    /** 
 * @swagger 
 * /users/{userId}: 
 *   delete: 
 *     tags: ["Users"]
 *     summary: Delete User
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the user to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/users/:userId', UserController.handleDeleteUser);


    /**
* @swagger
*  /signUp-customer:
*    post:
*      summary: Sign in Customer.
*      consumes:
*        - application/json
*      tags:
*        - Customer
*      parameters:
*        - in: body
*          name: Customer
*          description: Sign in Customer.
*          schema:
*            type: object
*            required:
*              - email
*              - password
*              - fullName
*              - gender
*              - birthday
*              - cityCode
*              - districtCode
*              - wardCode
*              - address
*              - phone
*            properties:
*              email:
*                type: string
*              password:
*                type: string
*              fullName:
*                type: string
*              gender:
*                type: boolean
*              birthday:
*                type: integer
*                example: 1640599036184
*              cityCode:
*                type: integer
*                example: 294
*              districtCode:
*                type: integer
*                example: 491
*              wardCode:
*                type: integer
*                example: 10510
*              address:
*                type: string
*              phone:
*                type: string
*      responses:
*        201:
*          description: Admin create User!
*/
    router.post('/signUp-customer', UserController.handleSignUpNewUser);



    /**
* @swagger
*  /movieTheater:
*    post:
*      summary: Create MovieTheater.
*      consumes:
*        - application/json
*      tags:
*        - MovieTheater
*      parameters:
*        - in: body
*          name: Admin
*          description: Create MovieTheater.
*          schema:
*            type: object
*            required:
*              - tenRap
*              - soDienThoai
*              - cityCode
*              - districtCode
*              - wardCode
*              - address
*              - userId
*            properties:
*              tenRap:
*                type: string
*              soDienThoai:
*                type: string
*              cityCode:
*                type: integer
*                example: 294
*              districtCode:
*                type: integer
*                example: 491
*              wardCode:
*                type: integer
*                example: 10510
*              address:
*                type: string
*              userId:
*                type: integer
*      responses:
*        201:
*          description: Create MovieTheater.
*/
    router.put('/movieTheater', MovieTheaterController.handleCreateNewMovieTheater);


    /**
* @swagger
*  /movieTheater:
*    put:
*      summary: Edit MovieTheater.
*      consumes:
*        - application/json
*      tags:
*        - MovieTheater
*      parameters:
*        - in: body
*          name: Admin
*          description: Edit MovieTheater.
*          schema:
*            type: object
*            required:
*              - id
*              - tenRap
*              - soDienThoai
*              - cityCode
*              - districtCode
*              - wardCode
*              - address
*              - userId
*            properties:
*              id:
*                type: integer
*              tenRap:
*                type: string
*              soDienThoai:
*                type: string
*              cityCode:
*                type: integer
*                example: 294
*              districtCode:
*                type: integer
*                example: 491
*              wardCode:
*                type: integer
*                example: 10510
*              address:
*                type: string
*              userId:
*                type: integer
*      responses:
*        201:
*          description: Edit MovieTheater.
*/
    router.put('/movieTheater', MovieTheaterController.handleEditMovieTheater);

    /** 
     * @swagger 
     * /movieTheater/{movieTheaterId}: 
     *   get: 
     *     tags: ["MovieTheater"]
     *     summary: Get a MovieTheater by ID
     *     parameters:
     *       - in: path
     *         name: movieTheaterId
     *         schema:
     *         type: integer
     *         required: true
     *         description: Numeric ID of the MovieTheater to get
     *     responses:  
     *       200: 
     *         description: Success  
     *   
     */
    router.get('/movieTheater/:movieTheaterId', MovieTheaterController.handleGetMovieTheaterById);


    /** 
* @swagger 
* /movieTheater/{movieTheaterId}: 
*   delete: 
*     tags: ["MovieTheater"]
*     summary: Delete MovieTheater
*     parameters:
*       - in: path
*         name: movieTheaterId
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the MovieTheater to delete
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.delete('/movieTheater/:movieTheaterId', MovieTheaterController.handleDeleteMovieTheater);


    /** 
    * @swagger 
    * /get-list-movieTheater: 
    *   get: 
    *     tags: ["MovieTheater"]
    *     description: Get List MovieTheater
    *     responses:  
    *       200: 
    *         description: Success  
    *   
    */
    router.get('/get-list-movieTheater', MovieTheaterController.handleGetAllMovieTheater);


    /**
    * @swagger
    *  /room:
    *    post:
    *      summary: Create room.
    *      consumes:
    *        - application/json
    *      tags:
    *        - Room
    *      parameters:
    *        - in: body
    *          name: Admin
    *          description: Create room.
    *          schema:
    *            type: object
    *            required: true
    *            properties:
    *              numberOfColumn:
    *                example: 10
    *                type: integer
    *              numberOfRow:
    *                example: 10
    *                type: integer
    *              name:
    *                example: Rap 01
    *                type: string
    *              movieTheaterId:
    *                example: 1
    *                type: array
    *              seets:
    *                type: array
    *                required: false
    *                items:
    *                   type: object
    *                   properties:
    *                     posOfColumn:
    *                       example: 0
    *                       type: integer
    *                     posOfRow:
    *                       type: array
    *                       required: false
    *                       items:
    *                          type: object
    *                          properties:
    *                            pos:
    *                               example: 0
    *                               type: integer
    *                            typeId:
    *                               example: 1
    *                               type: integer
    *      responses:
    *        201:
    *          description: Create room.
    */
    router.post('/room', RoomController.handleCreateNewRoom);



    /** 
   * @swagger 
   * /room: 
   *   get: 
   *     tags: ["Room"]
   *     description: Get List Room
   *     responses:  
   *       200: 
   *         description: Success  
   *   
   */
    router.get('/room', RoomController.handleGetAllRoom);


    /** 
         * @swagger 
         * /type-of-movie/{typeId}: 
         *   get: 
         *     tags: ["Type of Movie"]
         *     summary: Get a Type of Movie by ID
         *     parameters:
         *       - in: path
         *         name: typeId
         *         schema:
         *         type: integer
         *         required: true
         *         description: Numeric ID of the Type Movie to get
         *     responses:  
         *       200: 
         *         description: Success  
         *   
         */
    router.get('/type-of-movie/:typeId', TypeMovieController.handleGetTypeMovieById);


    /**
* @swagger
*  /type-of-movie:
*    post:
*      summary: Create type of movie.
*      consumes:
*        - application/json
*      tags:
*        - Type of Movie
*      parameters:
*        - in: body
*          name: Admin
*          description: Create type of movie.
*          schema:
*            type: object
*            required: true
*            properties:
*              name:
*                type: string
*      responses:
*        201:
*          description: create OK!
*/
    router.post('/type-of-movie', TypeMovieController.handleCreateNewTypeMovie);

    /**
    * @swagger
    *  /type-of-movie:
    *    put:
    *      summary: Edit type of movie.
    *      consumes:
    *        - application/json
    *      tags:
    *        - Type of Movie
    *      parameters:
    *        - in: body
    *          name: Admin
    *          description: Edit type of movie.
    *          schema:
    *            type: object
    *            required: true
    *            properties:
    *              id:
    *                type: integer
    *              name:
    *                type: string
    *      responses:
    *        201:
    *          description: OK!
    */
    router.put('/type-of-movie', TypeMovieController.handleEditTypeMovie);

    return app.use("/", router);
}

module.exports = initWebRoutes