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
import BannerController from "../controllers/BannerController";
import NewsController from "../controllers/NewsController";
import VoucherController from "../controllers/VoucherController";
import FeedbackController from "../controllers/FeedbackController";
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();



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
 * /get-list-staff: 
 *   get: 
 *     tags: ["Users"]
 *     summary: Get a user by ID
 *     parameters:
 *       - in: query
 *         name: movieTheaterId
 *         schema:
 *         type: integer
 *         required: false
 *         description: Movie Theater ID
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/get-list-staff', UserController.handleGetAllStaff);

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
 * /customer/{externalId}: 
 *   get: 
 *     tags: ["Users"]
 *     summary: Get a customer by external ID
 *     parameters:
 *       - in: path
 *         name: externalId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/customer/:externalId', UserController.handleGetUserByExternalId);


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


    //     /** 
    //  * @swagger 
    //  * /movieTheater/users/{userId}: 
    //  *   get: 
    //  *     tags: ["Users"]
    //  *     summary: Get a movieTheater by userId
    //  *     parameters:
    //  *       - in: path
    //  *         name: userId
    //  *         schema:
    //  *         type: integer
    //  *         required: true
    //  *         description: Get a movieTheater by userId
    //  *     responses:  
    //  *       200: 
    //  *         description: Success  
    //  *   
    //  */
    //     router.get('/movieTheater/users/:userId', UserController.handleGetMovieTheaterByUser);



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
*  /verify/users:
*    post:
*      summary: Verify email
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
*                      userId:
*                        type: integer
*                      userToken:
*                        type: string
*      responses:
*        201:
*          description: Admin create User!
*/
    router.post('/verify/users', UserController.handleVerifyEmail);

    /**
* @swagger
*  /send-mail-reset-pass:
*    post:
*      summary: Verify email
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
*                      mail:
*                        type: string
*      responses:
*        201:
*          description: Admin create User!
*/
    router.post('/send-mail-reset-pass', UserController.handleSendMailResetPass);


    /**
* @swagger
*  /required-reset-pass:
*    post:
*      summary: required reset pass for user
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
*                      token:
*                        type: string
*      responses:
*        201:
*          description: required Reset new pass!
*/
    router.post('/required-reset-pass', UserController.handleRequiredResetPass);


    /**
* @swagger
*  /reset-new-password:
*    post:
*      summary: Check email reset pass
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
*      responses:
*        201:
*          description: Admin create User!
*/
    router.post('/reset-new-password', UserController.handleResetNewPass);






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
*  /feedback-customer:
*    post:
*      summary: Feedback Customer.
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
*                       cusId:
*                         type: integer
*                       fullName:
*                         type: string
*                       phoneNumber:
*                         type: string
*                       content:
*                         type: string
*      responses:
*        201:
*          description: Feedback by customer!
*/
    router.post('/feedback-customer', UserController.handleFeedbackCustomer);


    /**
* @swagger
*  /customer-new-password:
*    post:
*      summary: Customer change pass
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
*                      email:
*                        type: string
*                      currentPassword:
*                        type: string
*                      newPassword:
*                        type: string
*      responses:
*        201:
*          description: Customer change pass
*/
    router.post('/customer-new-password', UserController.handleCustomerNewPass);


    /** 
* @swagger 
* /get-list-feedback: 
*   get: 
*     tags: ["Feedback"]
*     description: Get list feedback
*     parameters:
*       - in: query
*         name: key
*         schema:
*         type: string
*         required: false
*         description: id feedback or name customer
*       - in: query
*         name: startTime
*         type: integer
*         example: 1640549137000
*       - in: query
*         name: endTime
*         type: integer
*         example: 1640549137000
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-list-feedback', FeedbackController.handleGetListFeedback);


    /** 
 * @swagger 
 * /feedback/{feedbackId}: 
 *   get: 
 *     tags: ["Feedback"]
 *     summary: Get detail feedback
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         schema:
 *         type: integer
 *         required: true
 *         description: feedbackId of the feedback to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/feedback/:feedbackId', FeedbackController.handleGetDetailFeedback);


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
* /check-merchant-movieTheater: 
*   get: 
*     tags: ["MovieTheater"]
*     description: Check movie theater has merchant
*     parameters:
*       - in: query
*         name: movieTheaterId
*         schema:
*         type: integer
*         required: false
*         description: Movie Theater ID
*       - in: query
*         name: roleId
*         schema:
*         type: integer
*         required: false
*         description: RoleId user
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/check-merchant-movieTheater', MovieTheaterController.handleCheckMerchant);


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
*  /movie/vote:
*    post:
*      summary: Vote Films.
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
*                   rating:
*                     type: integer
*                   cusId:
*                     example: 1
*                     type: integer
*                   movieId:
*                     example: 1
*                     type: integer
*      responses:
*        201:
*          description: Rating news.
*/
    router.post('/movie/vote', MovieControler.handleVoteRatingMovie);

    /** 
* @swagger 
* /search-movie: 
*   get: 
*     tags: ["Movie"]
*     summary: Search Movie by keyword
*     parameters:
*       - in: query
*         name: kw
*         schema:
*         type: string
*         required: false
*         description: keyword
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/search-movie', MovieControler.handleSearchMovie);



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
*   get: 
*     tags: ["ScheduleMovie"]
*     summary: Get a Schedule  by ID
*     parameters:
*       - in: path
*         name: scheduleId
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the Schedule to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/schedule/:scheduleId', ScheduleController.handleGetScheduleById);


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
    *                     image:
    *                         example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
    *                         type: string
    *                     fileName:
    *                         example: "file-name.png"
    *                         type: string
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
    *                     image:
    *                         example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
    *                         type: string
    *                     fileName:
    *                         example: "file-name.png"
    *                         type: string
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
* /get-list-booking: 
*   get: 
*     tags: ["Booking Ticket"]
*     summary: Get list booking
*     parameters:
*       - in: query
*         name: date
*         schema:
*         type: string
*         required: false
*         description: Date of booking
*       - in: query
*         name: id
*         schema:
*         type: integer
*         required: false
*         description: id of booking
*       - in: query
*         name: movieTheaterId
*         schema:
*         type: integer
*         required: false
*         description: Movie Theater of booking
*       - in: query
*         name: status
*         schema:
*         type: integer
*         required: false
*         description: status to get list booking
*       - in: query
*         name: nameCus
*         schema:
*         type: string
*         required: false
*         description: nameCus to get list booking
*       - in: query
*         name: page
*         schema:
*         type: integer
*         required: false
*         description: Page of the booking to get
*       - in: query
*         name: PerPage
*         schema:
*         type: integer
*         required: false
*         description: PerPage of the booking to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-list-booking', BookingController.handleGetAllBooking);


    /** 
* @swagger 
* /get-booking-customer: 
*   get: 
*     tags: ["Booking Ticket"]
*     summary: Get list booking
*     parameters:
*       - in: query
*         name: startTime
*         type: integer
*         example: 1640549137000
*       - in: query
*         name: endTime
*         type: integer
*         example: 1640549137000
*       - in: query
*         name: cusId
*         schema:
*         type: integer
*         required: true
*         description: cusId of booking
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-booking-customer', BookingController.handleGetBookingByCustomer);

    /** 
* @swagger 
* /booking/{id}: 
*   get: 
*     tags: ["Booking Ticket"]
*     summary: Get a detail booking by ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the booking to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/booking/:id', BookingController.handleGetDetailBooking);


    /** 
 * @swagger 
 * /ticket/booking: 
 *   get: 
 *     tags: ["Booking Ticket"]
 *     summary: Get a ticket booking
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Bookingid of ticket to get
 *       - in: query
 *         name: page
 *         schema:
 *         type: integer
 *         required: false
 *         description: Page of the ticket to get
 *       - in: query
 *         name: PerPage
 *         schema:
 *         type: integer
 *         required: false
 *         description: PerPage of the ticket to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/ticket/booking', BookingController.handleGetTicketByBooking);



    /** 
 * @swagger 
 * /combo-booking: 
 *   get: 
 *     tags: ["Booking Ticket"]
 *     summary: Get combo in booking
 *     parameters:
 *       - in: query
 *         name: bookingId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Bookingid of combo to get
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/combo-booking', BookingController.handleGetComboByBooking);


    /** 
 * @swagger 
 * /booking-seet: 
 *   get: 
 *     tags: ["Booking Ticket"]
 *     summary: Get a movie by status
 *     parameters:
 *       - in: query
 *         name: scheduleId
 *         schema:
 *         type: integer
 *         required: true
 *         description: Get seet was booking in schedule
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/booking-seet', BookingController.handleGetBookingSeet);



    /**
* @swagger
*  /banner:
*    post:
*      summary: Create new banner.
*      consumes:
*        - application/json
*      tags:
*        - Banner
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   name:
*                     type: string
*                   description:
*                     type: string
*                   url:
*                     example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
*                     type: string
*                   fileName:
*                     example: "file-name.png"
*                     type: string
*      responses:
*        201:
*          description: Create Banner.
*/
    router.post('/banner', BannerController.handleCreateNewBanner);

    /** 
* @swagger 
* /get-list-banner: 
*   get: 
*     tags: ["Banner"]
*     summary: Get list Banner
*     parameters:
*       - in: query
*         name: status
*         schema:
*         type: integer
*         required: false
*         description: status banner
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-list-banner', BannerController.handleGetBanner);


    /** 
* @swagger 
* /banner/{id}: 
*   get: 
*     tags: ["Banner"]
*     summary: Get a detail Banner by ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the Banner to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/banner/:id', BannerController.handleGetDetailBanner);


    /**
* @swagger
*  /status/banner:
*    put:
*      summary: Update status banner.
*      consumes:
*        - application/json
*      tags:
*        - Banner
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
    router.put('/status/banner', BannerController.handleUpdateStatusBanner);


    /**
* @swagger
*  /banner:
*    put:
*      summary: Admin edit banner.
*      consumes:
*        - application/json
*      tags:
*        - Banner
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     id:
*                       type: integer
*                     name:
*                       type: string
*                     description:
*                       type: string
*                     url:
*                       type: string
*                     fileName:
*                       type: string
*      responses:
*        201:
*          description: Admin update Banner!
*/
    router.put('/banner', BannerController.handleEditBanner);


    /** 
 * @swagger 
 * /banner/{id}: 
 *   delete: 
 *     tags: ["Banner"]
 *     summary: Delete Banner
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the banner to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/banner/:id', BannerController.handleDeleteBanner);



    /**
* @swagger
*  /news:
*    post:
*      summary: Create new post.
*      consumes:
*        - application/json
*      tags:
*        - News
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   noiDung:
*                     type: string
*                   tomTat:
*                     type: string
*                   userId:
*                     type: integer
*                   type:
*                     example: 1
*                     type: integer
*                   thumbnail:
*                     example: "https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png"
*                     type: string
*                   fileName:
*                     example: "file-name.png"
*                     type: string
*      responses:
*        201:
*          description: Create Banner.
*/
    router.post('/news', NewsController.handleCreateNews);



    /** 
* @swagger 
* /get-list-news: 
*   get: 
*     tags: ["News"]
*     summary: Get list News
*     parameters:
*       - in: query
*         name: status
*         schema:
*         type: integer
*         required: false
*         description: status post
*       - in: query
*         name: type
*         schema:
*         type: integer
*         required: false
*         description: type post
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-list-news', NewsController.handleGetNews);


    /** 
* @swagger 
* /news/{id}: 
*   get: 
*     tags: ["News"]
*     summary: Get a detail News by ID
*     parameters:
*       - in: path
*         name: id
*         schema:
*         type: integer
*         required: true
*         description: Numeric ID of the News to get
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/news/:id', NewsController.handleGetDetailNews);


    /**
* @swagger
*  /status/news:
*    put:
*      summary: Update status news.
*      consumes:
*        - application/json
*      tags:
*        - News
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
    router.put('/status/news', NewsController.handleUpdateStatusNews);




    /**
* @swagger
*  /news:
*    put:
*      summary: Admin edit post.
*      consumes:
*        - application/json
*      tags:
*        - News
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                     id:
*                       type: integer
*                     noiDung:
*                       type: string
*                     tomTat:
*                       type: string
*                     type:
*                       example: 1
*                       type: integer
*                     thumbnail:
*                       type: string
*                     fileName:
*                       type: string
*      responses:
*        201:
*          description: Admin update Banner!
*/
    router.put('/news', NewsController.handleEditNews);



    /** 
 * @swagger 
 * /news/{id}: 
 *   delete: 
 *     tags: ["News"]
 *     summary: Delete News
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the news to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/news/:id', NewsController.handleDeleteNews);



    /**
* @swagger
*  /news/comment:
*    post:
*      summary: Comment in post.
*      consumes:
*        - application/json
*      tags:
*        - News
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   comment:
*                     type: string
*                   rating:
*                     type: integer
*                   cusId:
*                     example: 1
*                     type: integer
*                   newsId:
*                     example: 1
*                     type: integer
*      responses:
*        201:
*          description: Post comment.
*/
    router.post('/news/comment', NewsController.handlePostComment);



    /** 
* @swagger 
* /detail/comment: 
*   get: 
*     tags: ["News"]
*     summary: Get a detail News by ID
*     parameters:
*       - in: query
*         name: newsId
*         schema:
*         type: integer
*         required: false
*         description: Id post
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/detail/comment', NewsController.handleGetDetailComment);


    /** 
 * @swagger 
 * /comment/{id}: 
 *   delete: 
 *     tags: ["News"]
 *     summary: Delete Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the comment to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/comment/:id', NewsController.handleDeleteComment);

    /**
* @swagger
*  /news/vote:
*    post:
*      summary: Comment in post.
*      consumes:
*        - application/json
*      tags:
*        - News
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   rating:
*                     type: integer
*                   cusId:
*                     example: 1
*                     type: integer
*                   newsId:
*                     example: 1
*                     type: integer
*      responses:
*        201:
*          description: Rating news.
*/
    router.post('/news/vote', NewsController.handleVoteRating);




    /**
* @swagger
*  /voucher:
*    post:
*      summary: Create new voucher.
*      consumes:
*        - application/json
*      tags:
*        - Voucher
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   code:
*                     type: string
*                   name:
*                     type: string
*                   description:
*                     type: string
*                   discount:
*                     type: integer
*                   condition:
*                     type: integer
*                   maxUses:
*                     type: integer
*                   status:
*                     example: true
*                     type: boolean
*                   timeStart:
*                     type: integer
*                   timeEnd:
*                     type: integer
*      responses:
*        201:
*          description: Create Banner.
*/
    router.post('/voucher', VoucherController.handleCreateVoucher);



    /** 
* @swagger 
* /get-list-voucher: 
*   get: 
*     tags: ["Voucher"]
*     summary: Get a Voucher by date
*     parameters:
*       - in: query
*         name: date
*         schema:
*         type: string
*         required: false
*         description: Time start voucher
*       - in: query
*         name: code
*         schema:
*         type: integer
*         required: false
*         description: Voucher code
*       - in: query
*         name: name
*         schema:
*         type: integer
*         required: false
*         description: Voucher name
*       - in: query
*         name: status
*         schema:
*         type: integer
*         required: false
*         description: Status voucher
*     responses:  
*       200: 
*         description: Success  
*   
*/
    router.get('/get-list-voucher', VoucherController.handleGetListVoucher);


    /** 
 * @swagger 
 * /voucher/{id}: 
 *   get: 
 *     tags: ["Voucher"]
 *     summary: Get Voucher
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the vocuher
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/voucher/:id', VoucherController.handleGetDetailVoucherByIdOrCode);


    /** 
 * @swagger 
 * /code/voucher/{code}: 
 *   get: 
 *     tags: ["Voucher"]
 *     summary: Get Voucher
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *         type: string
 *         required: true
 *         description: Code of the vocuher
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/code/voucher/:code', VoucherController.handleGetDetailVoucherByIdOrCode);



    /** 
 * @swagger 
 * /apply-voucher/{code}: 
 *   get: 
 *     tags: ["Voucher"]
 *     summary: Get Voucher
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *         type: string
 *         required: true
 *         description: Code of the vocuher
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/apply-voucher/:code', VoucherController.handleCusApplyVoucher);



    /**
* @swagger
*  /voucher:
*    put:
*      summary: Update voucher.
*      consumes:
*        - application/json
*      tags:
*        - Voucher
*      requestBody:
*         content:
*            application/json:
*               schema:
*                  type: object
*                  properties:
*                   id:
*                     type: integer
*                   name:
*                     type: string
*                   description:
*                     type: string
*                   discount:
*                     type: integer
*                   condition:
*                     type: integer
*                   maxUses:
*                     type: integer
*                   timeStart:
*                     type: integer
*                   timeEnd:
*                     type: integer
*      responses:
*        201:
*          description: Create Banner.
*/
    router.put('/voucher', VoucherController.handleUpdateVoucher);




    /**
* @swagger
*  /status/voucher:
*    put:
*      summary: Update status voucher.
*      consumes:
*        - application/json
*      tags:
*        - Voucher
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
    router.put('/status/voucher', VoucherController.handleUpdateStatusVoucher);




    /** 
 * @swagger 
 * /voucher/{id}: 
 *   delete: 
 *     tags: ["Voucher"]
 *     summary: Delete Voucher
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
 *         required: true
 *         description: Numeric ID of the voucher to delete
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.delete('/voucher/:id', VoucherController.handleDeleteVoucher);



    /** 
 * @swagger 
 * /count-ticket-of-movie: 
 *   get: 
 *     tags: ["Dashboard"]
 *     summary: Count ticket of movie
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/count-ticket-of-movie', MovieControler.countTicketMovie);

    /** 
 * @swagger 
 * /count-turnover-of-movieTheater: 
 *   get: 
 *     tags: ["Dashboard"]
 *     summary: Count turnover of movie
 *     parameters:
 *       - in: query
 *         name: movieTheaterId
 *         schema:
 *         type: integer
 *         required: false
 *         description: Movie Theater ID
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
    router.get('/count-turnover-of-movieTheater', MovieTheaterController.handleCountTurnoverByMovieTheater);


    router.post('/get-momo-payment-link', BookingController.handleGetMomoPaymentLink);

    router.post('/test-send-mail', BookingController.testSendMail);

    router.post('/test-signature', BookingController.testSignature);

    router.post('/upload_files', multipartMiddleware, BookingController.testUpload);


    return app.use("/", router);
}

module.exports = initWebRoutes