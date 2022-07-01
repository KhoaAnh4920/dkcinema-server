import express from "express";
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
import UserController from "../controllers/UserControler";
import MovieTheaterController from "../controllers/MovieTheaterController";
import RoomController from "../controllers/RoomController";
import TypeMovieController from "../controllers/TypeMovieController";
import MovieControler from "../controllers/MovieControler";
import ScheduleController from "../controllers/ScheduleController";
import FoodController from "../controllers/FoodController";
import ComboController from "../controllers/ComboController";
import TypeFoodController from "../controllers/TypeFoodController";
import BookingController from "../controllers/BookingController";



const authToken = require("../middleware/authenticateToken");



let router = express.Router();


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.1', // YOU NEED THIS
        info: {
            title: 'DKCinema API',
            version: '1.0.0',
            description: 'API DKCINEMA'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },

    apis: ['src/route/web.js'],
}
let initWebRoutes = (app) => {

    const swaggerDocs = swaggerJsdoc(swaggerOptions);

    router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))


    /**
* @swagger
*  /admin-login:
*    post:
*      tags:
*        - Auth
*      produces:
*        - application/json
*      consumes:
*        - application/json
*      summary: Login Admin.
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     email:          # <!--- form field name
*                        type: string
*                     password:          # <!--- form field name
*                        type: string
*      responses:
*        201:
*          description: Login OK!
*/
    router.post('/admin-login', UserController.handleLogin);


    /**
* @swagger
*  /aaa:
*    post:
*      tags:
*        - Auth
*      produces:
*        - application/json
*      consumes:
*        - application/json
*      summary: Login Admin.
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     email:          # <!--- form field name
*                        type: string
*                     password:          # <!--- form field name
*                        type: string
*      responses:
*        201:
*          description: Login OK!
*/
    router.post('/cms/admin-login', UserController.handleLoginAdmin);



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
 *     security:              # <--- ADD THIS
 *       - bearerAuth: []     # <--- ADD THIS
 *     tags: ["Users"]
 *     description: Get List User
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/get-list-users', authToken, UserController.handleGetAllUser);

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
 * /role/users/{roleId}: 
 *   get: 
 *     tags: ["Users"]
 *     summary: Get a user by role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Role id of the user to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/role/users/:roleId', UserController.handleGetUserByRoles);


    /** 
 * @swagger 
 * /movieTheater/users/{userId}: 
 *   get: 
 *     tags: ["Users"]
 *     summary: Get a movieTheater by userId
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Get a movieTheater by userId
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/movieTheater/users/:userId', UserController.handleGetMovieTheaterByUser);



    /**
* @swagger
*  /users:
*    post:
*      summary: Admin create user.
*      consumes:
*        - application/json
*      tags:
*        - Users
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                      email:
*                        type: string
*                      password:
*                        type: string
*                      fullName:
*                        type: string
*                      avatar:
*                        type: string
*                      gender:
*                        type: boolean
*                      birthday:
*                        type: integer
*                        example: 1640599036184
*                      roleId:
*                        type: integer
*                        example: 1
*                      cityCode:
*                        type: integer
*                        example: 294
*                      districtCode:
*                        type: integer
*                        example: 491
*                      wardCode:
*                        type: integer
*                        example: 10510
*                      address:
*                        type: string
*                      phone:
*                        type: string
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
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     id:
*                       type: integer
*                     fullName:
*                       type: string
*                     avatar:
*                       type: string
*                     gender:
*                       type: boolean
*                     birthday:
*                       type: integer
*                       example: 1640599036184
*                     roleId:
*                       type: integer
*                       example: 1
*                     cityCode:
*                       type: integer
*                       example: 294
*                     districtCode:
*                          type: integer
*                          example: 491
*                     wardCode:
*                       type: integer
*                       example: 10510
*                     address:
*                       type: string
*                     phone:
*                       type: string
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
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                       email:
*                         type: string
*                       password:
*                         type: string
*                       fullName:
*                         type: string
*                       gender:
*                         type: boolean
*                       birthday:
*                         type: integer
*                         example: 1640599036184
*                       cityCode:
*                         type: integer
*                         example: 294
*                       districtCode:
*                         type: integer
*                         example: 491
*                       wardCode:
*                         type: integer
*                         example: 10510
*                       address:
*                         type: string
*                       phone:
*                         type: string
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
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   tenRap:
*                     type: string
*                   soDienThoai:
*                     type: string
*                   cityCode:
*                     type: integer
*                     example: 294
*                   districtCode:
*                     type: integer
*                     example: 491
*                   wardCode:
*                     type: integer
*                     example: 10510
*                   address:
*                     type: string
*                   userId:
*                     type: integer
*                   listImage:
*                     type: array
*                     required: false
*                     items:
*                        type: object
*                        properties:
*                          image:
*                            example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
*                            type: string
*                          fileName:
*                            example: "file-name.png"
*                            type: string
*      responses:
*        201:
*          description: Create MovieTheater.
*/
    router.post('/movieTheater', MovieTheaterController.handleCreateNewMovieTheater);


    /**
* @swagger
*  /movieTheater:
*    put:
*      summary: Edit MovieTheater.
*      consumes:
*        - application/json
*      tags:
*        - MovieTheater
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                    id:
*                      type: integer
*                    tenRap:
*                      type: string
*                    soDienThoai:
*                      type: string
*                    cityCode:
*                      type: integer
*                      example: 294
*                    districtCode:
*                      type: integer
*                      example: 491
*                    wardCode:
*                      type: integer
*                      example: 10510
*                    address:
*                      type: string
*                    userId:
*                      type: integer
*                    listImage:
*                      type: array
*                      required: false
*                      items:
*                         type: object
*                         properties:
*                           image:
*                             example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
*                             type: string
*                           fileName:
*                             example: "file-name.png"
*                             type: string
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
 * /image-movie-theater/{id}: 
 *   delete: 
 *     tags: ["MovieTheater"]
 *     summary: Delete MovieTheater
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: ID image of the movie to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/image-movie-theater/:id', MovieTheaterController.handleDeleteImageMovieTheater);


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
    *      requestBody:
    *         content:
    *            application/json:
    *               schema:
    *                  type: object
    *                  properties:
    *                     numberOfColumn:
    *                         example: 10
    *                         type: integer
    *                     numberOfRow:
    *                         example: 10
    *                         type: integer
    *                     name:
    *                         example: Rap 01
    *                         type: string
    *                     movieTheaterId:
    *                         example: 1
    *                         type: array
    *                     seets:
    *                         type: array
    *                         required: false
    *                         items:
    *                          type: object
    *                          properties:
    *                            posOfColumn:
    *                              example: 0
    *                              type: integer
    *                            posOfRow:
    *                              type: array
    *                              required: false
    *                              items:
    *                                 type: object
    *                                 properties:
    *                                   pos:
    *                                      example: 0
    *                                      type: integer
    *                                   typeId:
    *                                      example: 1
    *                                      type: integer
    *      responses:
    *        201:
    *          description: Create room.
    */
    router.post('/room', RoomController.handleCreateNewRoom);


    /**
* @swagger
*  /room:
*    put:
*      summary: Update room.
*      consumes:
*        - application/json
*      tags:
*        - Room
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     id:
*                         example: 1
*                         type: integer
*                     numberOfColumn:
*                         example: 10
*                         type: integer
*                     numberOfRow:
*                         example: 10
*                         type: integer
*                     name:
*                         example: Rap 01
*                         type: string
*                     movieTheaterId:
*                         example: 1
*                         type: array
*                     seets:
*                         type: array
*                         required: false
*                         items:
*                          type: object
*                          properties:
*                            posOfColumn:
*                              example: 0
*                              type: integer
*                            posOfRow:
*                              type: array
*                              required: false
*                              items:
*                                 type: object
*                                 properties:
*                                   pos:
*                                      example: 0
*                                      type: integer
*                                   typeId:
*                                      example: 1
*                                      type: integer
*      responses:
*        201:
*          description: Create room.
*/
    router.put('/room', RoomController.handleUpdateRoom);



    /** 
* @swagger 
* /room: 
*   get: 
*     tags: ["Room"]
*     description: Get List Room
*     parameters:
*       - in: query
*         name: movieTheaterId
*         schema:
*         type: integer
*         required: false
*         description: Movie Theater of Room
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/room', RoomController.handleGetAllRoom);

    /** 
         * @swagger 
         * /room/{roomId}: 
         *   get: 
         *     tags: ["Room"]
         *     summary: Get a Room by ID
         *     parameters:
         *       - in: path
         *         name: roomId
         *         schema:
         *         type: integer
         *         required: true
         *         description: Numeric ID of the Room to get
         *     responses:  
         *       200: 
         *         description: Success  
         *   
         */
    router.get('/room/:roomId', RoomController.handleGetRoomById);

    /** 
 * @swagger 
 * /room/{roomId}: 
 *   delete: 
 *     tags: ["Room"]
 *     summary: Delete Room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the room to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/room/:roomId', RoomController.handleDeleteRoom);


    /** 
* @swagger 
* /type-of-movie: 
*   get: 
*     tags: ["Type of Movie"]
*     description: Get List Type of Movie
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/type-of-movie', TypeMovieController.handleGetAllTypeMovie);


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
*    put:
*      summary: Edit type of movie.
*      consumes:
*        - application/json
*      tags:
*        - Type of Movie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                    id:
*                      type: integer
*                    name:
*                      type: string
*      responses:
*        201:
*          description: OK!
*/
    router.put('/type-of-movie', TypeMovieController.handleEditTypeMovie);


    /**
* @swagger
*  /type-of-movie:
*    post:
*      summary: Create new type of movie.
*      consumes:
*        - application/json
*      tags:
*        - Type of Movie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     name:
*                       type: string
*      responses:
*        201:
*          description: OK!
*/
    router.post('/type-of-movie', TypeMovieController.handleCreateNewTypeMovie);


    /**
* @swagger
*  /movie:
*    post:
*      summary: Create Movie.
*      consumes:
*        - application/json
*      tags:
*        - Movie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     name:
*                       example: 'Doctor Strange'
*                       type: string
*                     transName:
*                       example: 'Bác sĩ lạ'
*                       type: string
*                     country:
*                       type: string
*                     language:
*                       type: string
*                     duration:
*                       example: 180
*                       type: integer
*                     description:
*                       type: string
*                     brand:
*                       type: string
*                     cast:
*                       type: string
*                     status:
*                       type: integer
*                     typeId:
*                       example: 1
*                       type: integer
*                     releaseTime:
*                       type: integer
*                       example: 1640599036184
*                     url:
*                       example: "https://www.youtube.com/watch?v=aWzlQ2N6qqg"
*                       type: string
*                     poster:
*                       type: array
*                       required: false
*                       items:
*                          type: object
*                          properties:
*                            image:
*                              example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
*                              type: string
*                            fileName:
*                              example: "file-name.png"
*                              type: string
*      responses:
*        201:
*          description: create OK!
*/
    router.post('/movie', MovieControler.handleCreateNewMovie);

    /** 
 * @swagger 
 * /image-movie/{id}: 
 *   delete: 
 *     tags: ["Movie"]
 *     summary: Delete Image movie
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Public ID image of the movie to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/image-movie/:id', MovieControler.handleDeleteImageMovie);




    /**
* @swagger
*  /movie:
*    put:
*      summary: Update Movie.
*      consumes:
*        - application/json
*      tags:
*        - Movie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     id:
*                       type: integer
*                     name:
*                       example: 'Doctor Strange'
*                       type: string
*                     transName:
*                       example: 'Bác sĩ lạ'
*                       type: string
*                     country:
*                       type: string
*                     language:
*                       type: string
*                     duration:
*                       example: 180
*                       type: integer
*                     description:
*                       type: string
*                     brand:
*                       type: string
*                     cast:
*                       type: string
*                     status:
*                       type: integer
*                     typeId:
*                       example: 1
*                       type: integer
*                     releaseTime:
*                       type: integer
*                       example: 1640599036184
*                     url:
*                       example: "https://www.youtube.com/watch?v=aWzlQ2N6qqg"
*                       type: string
*                     poster:
*                       type: array
*                       required: false
*                       items:
*                          type: object
*                          properties:
*                            image:
*                              example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
*                              type: string
*                            fileName:
*                              example: "file-name.png"
*                              type: string
*      responses:
*        201:
*          description: create OK!
*/

    router.put('/movie', MovieControler.handleUpdateMovie);



    /** 
* @swagger 
* /movie: 
*   get: 
*     tags: ["Movie"]
*     description: Get List Movie
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/movie', MovieControler.handleGetAllMovie);


    /** 
 * @swagger 
 * /movie/{movieId}: 
 *   get: 
 *     tags: ["Movie"]
 *     summary: Get a movie by ID
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the movie to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/movie/:movieId', MovieControler.handleGetMovieById);


    /** 
 * @swagger 
 * /status/movie: 
 *   get: 
 *     tags: ["Movie"]
 *     summary: Get a movie by status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *         type: integer
 *         required: true
 *         description: Status of the movie to get
 *       - in: query
 *         name: page
 *         schema:
 *         type: integer
 *         required: true
 *         description: Page of the movie to get
 *       - in: query
 *         name: PerPage
 *         schema:
 *         type: integer
 *         required: true
 *         description: PerPage of the movie to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/status/movie', MovieControler.handleGetMovieByStatus);



    /**
* @swagger
*  /status/movie:
*    put:
*      summary: Update status movie.
*      consumes:
*        - application/json
*      tags:
*        - Movie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                    id:
*                      type: integer
*                    status:
*                      type: integer
*      responses:
*        201:
*          description: OK!
*/
    router.put('/status/movie', MovieControler.handleUpdateStatusMovie);


    /**
* @swagger
*  /delete/movie:
*    put:
*      summary: Delete movie.
*      consumes:
*        - application/json
*      tags:
*        - Movie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                    id:
*                      type: integer
*                    isDelete:
*                      type: boolean
*      responses:
*        201:
*          description: OK!
*/
    router.put('/delete/movie', MovieControler.handleDeleteMovie);


    /**
* @swagger
*  /schedule-movie:
*    post:
*      summary: Create new schedule of movie.
*      consumes:
*        - application/json
*      tags:
*        - ScheduleMovie
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     movieId:
*                       type: integer
*                     roomId:
*                       type: integer
*                       example: 1
*                     premiereDate:
*                       type: integer
*                       example: 1640599036184
*                     startTime:
*                       type: integer
*                       example: 1640549137000
*                     endTime:
*                       type: integer
*                       example: 1672085137000
*      responses:
*        201:
*          description: OK!
*/
    router.post('/schedule-movie', ScheduleController.handleCreateNewScheduleMovie);


    /** 
* @swagger 
* /get-list-schedule: 
*   get: 
*     tags: ["ScheduleMovie"]
*     summary: Get a ScheduleMovie by date
*     parameters:
*       - in: query
*         name: date
*         schema:
*         type: string
*         required: false
*         description: Date of schedule
*       - in: query
*         name: roomId
*         schema:
*         type: integer
*         required: false
*         description: Room of schedule
*       - in: query
*         name: movieId
*         schema:
*         type: integer
*         required: false
*         description: Movie of schedule
*       - in: query
*         name: movieTheaterId
*         schema:
*         type: integer
*         required: false
*         description: Movie Theater of schedule
*       - in: query
*         name: type
*         schema:
*         type: integer
*         required: false
*         description: type to get list schedule
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-list-schedule', ScheduleController.handleGetScheduleByDate);


    /** 
 * @swagger 
 * /schedule/{scheduleId}: 
 *   delete: 
 *     tags: ["ScheduleMovie"]
 *     summary: Delete Schedule Movie
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the Schedule to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/schedule/:scheduleId', ScheduleController.handleDeleteSchedule);


    /**
* @swagger
*  /food:
*    post:
*      summary: Create new food.
*      consumes:
*        - application/json
*      tags:
*        - Food
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     name:
*                       type: string
*                     price:
*                       type: number
*                       format: double
*                       example: 20000
*                     typeId:
*                       type: integer
*                       example: 1
*      responses:
*        201:
*          description: OK!
*/
    router.post('/food', FoodController.handleCreateNewFood);

    /** 
    * @swagger 
    * /get-list-food: 
    *   get: 
    *     tags: ["Food"]
    *     description: Get List Food
    *     parameters:
    *       - in: query
    *         name: typeId
    *         schema:
    *         type: integer
    *         required: false
    *         description: type of food
    *     responses:  
    *       200: 
    *         description: Success  
    *   
    */
    router.get('/get-list-food', FoodController.handleGetAllFood);


    /** 
* @swagger 
* /food/{foodId}: 
*   get: 
*     tags: ["Food"]
*     summary: Get a food by ID
*     parameters:
*       - in: path
*         name: foodId
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the food to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/food/:foodId', FoodController.handleGetFoodById);


    /**
* @swagger
*  /food:
*    put:
*      summary: Update Food.
*      consumes:
*        - application/json
*      tags:
*        - Food
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                    id:
*                      type: integer
*                    name:
*                      example: 'Pepsi'
*                      type: string
*                    price:
*                      type: number
*                      format: double
*                      example: 20000
*                    typeId:
*                      type: integer
*                      example: 1
*      responses:
*        201:
*          description: create OK!
*/
    router.put('/food', FoodController.handleUpdateFood);


    /** 
 * @swagger 
 * /food/{id}: 
 *   delete: 
 *     tags: ["Food"]
 *     summary: Delete Food
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the food to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/food/:id', FoodController.handleDeleteFood);

    /** 
* @swagger 
* /type-of-food: 
*   get: 
*     tags: ["Type of food"]
*     description: Get List Type of Food
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/type-of-food', TypeFoodController.handleGetAllTypeFood);



    /**
    * @swagger
    *  /combo:
    *    post:
    *      summary: Create new combo.
    *      consumes:
    *        - application/json
    *      tags:
    *        - Combo
    *      requestBody:
    *         content:
    *            application/json:
    *               schema:
    *                  type: object
    *                  properties:
    *                     name:
    *                         example: Combo 01
    *                         type: string
    *                     price:
    *                         type: number
    *                         format: double
    *                         example: 20000
    *                     items:
    *                         type: array
    *                         required: false
    *                         items:
    *                          type: object
    *                          properties:
    *                            foodId:
    *                              example: 1
    *                              type: integer
    *                            amount:
    *                              example: 2
    *                              type: integer
    *                              required: true
    *      responses:
    *        201:
    *          description: Create combo.
    */
    router.post('/combo', ComboController.handleCreateNewCombo);


    /** 
    * @swagger 
    * /get-list-combo: 
    *   get: 
    *     tags: ["Combo"]
    *     description: Get List Combo
    *     responses:  
    *       200: 
    *         description: Success  
    *   
    */
    router.get('/get-list-combo', ComboController.handleGetAllCombo);


    /** 
* @swagger 
* /item-combo/{id}: 
*   get: 
*     tags: ["Combo"]
*     summary: Get a item combo by ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the combo to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/item-combo/:id', ComboController.handleGetItemCombo);

    /** 
* @swagger 
* /combo/{id}: 
*   get: 
*     tags: ["Combo"]
*     summary: Get a detail combo by ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the combo to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/combo/:id', ComboController.handleGetDetailCombo);


    /**
    * @swagger
    *  /combo:
    *    put:
    *      summary: Edit combo.
    *      consumes:
    *        - application/json
    *      tags:
    *        - Combo
    *      requestBody:
    *         content:
    *            application/json:
    *               schema:
    *                  type: object
    *                  properties:
    *                     id:
    *                         type: integer
    *                     name:
    *                         example: Combo 01
    *                         type: string
    *                     price:
    *                         type: number
    *                         format: double
    *                         example: 20000
    *                     items:
    *                         type: array
    *                         required: false
    *                         items:
    *                          type: object
    *                          properties:
    *                            foodId:
    *                              example: 1
    *                              type: integer
    *                            amount:
    *                              example: 2
    *                              type: integer
    *                              required: true
    *      responses:
    *        201:
    *          description: Update combo.
    */
    router.put('/combo', ComboController.handleEditCombo);

    /** 
 * @swagger 
 * /combo/{id}: 
 *   delete: 
 *     tags: ["Combo"]
 *     summary: Delete Combo
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the combo to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/combo/:id', ComboController.handleDeleteCombo);



    /**
    * @swagger
    *  /booking-ticket:
    *    post:
    *      summary: Booking ticket films.
    *      consumes:
    *        - application/json
    *      tags:
    *        - Booking Ticket
    *      requestBody:
    *         content:
    *            application/json:
    *               schema:
    *                  type: object
    *                  properties:
    *                     cusId:
    *                         example: 1
    *                         type: integer
    *                     movieId:
    *                         example: 1
    *                         type: integer
    *                     showTimeId:
    *                         example: 1
    *                         type: integer
    *                     paymentId:
    *                         example: 1
    *                         type: integer
    *                     voucherCode:
    *                         example: TESTVOUCHER
    *                         type: string
    *                     price:
    *                         example: 80000
    *                         type: integer
    *                     name:
    *                         example: Khoa Anh
    *                         type: string
    *                     email:
    *                         example: khoaanh4920@gmail.com
    *                         type: string
    *                     phoneNumber:
    *                         example: +84968617132
    *                         type: string
    *                     seets:
    *                         type: array
    *                         required: false
    *                         items:
    *                          type: object
    *                          properties:
    *                            seetId:
    *                              example: 1
    *                              type: integer
    *                     combo:
    *                         type: array
    *                         required: false
    *                         items:
    *                          type: object
    *                          properties:
    *                            comboId:
    *                              example: 1
    *                              type: integer
    *                            quanlity:
    *                              example: 1
    *                              type: integer
    *      responses:
    *        201:
    *          description: Create room.
    */
    router.post('/booking-ticket', BookingController.handleCreateBookingTicket);


    router.post('/api/handle-booking', BookingController.handleBookingPayment);


    /** 
 * @swagger 
 * /ticket/booking: 
 *   get: 
 *     tags: ["Booking Ticket"]
 *     summary: Get a movie by status
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Bookingid of ticket to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/ticket/booking', BookingController.handleGetTicketByBooking);

    router.post('/test-send-mail', BookingController.testSendMail);

    return app.use("/", router);
}

module.exports = initWebRoutes