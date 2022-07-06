import db from "../models/index";
import UserService from '../Services/UserService'


let handleLogin = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(200).json({
            errorCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await UserService.handleUserLogin(email, password);

    return res.status(200).json({
        errorCode: userData.errorCode,
        message: userData.errMessage,
        data: (userData.user) ? userData.user : {}
    })
}

let handleLoginAdmin = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    console.log(req.body);

    if (!email || !password) {
        return res.status(200).json({
            errorCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await UserService.handleAdminLogin(email, password);

    console.log(userData);

    return res.status(200).json({
        errorCode: userData.errorCode,
        message: userData.errMessage,
        data: (userData.user) ? userData.user : {}
    })
}

let handleSignUpNewUser = async (req, res) => {
    let message = await UserService.signUpNewUser(req.body);
    return res.status(200).json(message);
}

let handleGetAllUser = async (req, res) => {
    let user = await UserService.getAllUser();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        user
    })

}

let handleCreateNewUser = async (req, res) => {
    let message = await UserService.createNewUser(req.body);
    return res.status(200).json(message);
}

let handleGetUserById = async (req, res) => {
    let message = '';

    if (req.params && req.params.userId)
        message = await UserService.getUserById(req.params.userId);
    return res.status(200).json(message);
}

let handleGetUserByRoles = async (req, res) => {
    let message = '';

    if (req.params && req.params.roleId)
        message = await UserService.getUserByRole(req.params.roleId);
    return res.status(200).json(message);
}

// let handleGetMovieTheaterByUser = async (req, res) => {
//     let message = '';

//     if (req.params && req.params.userId)
//         message = await UserService.getMovieTheaterByUser(req.params.userId);
//     return res.status(200).json(message);
// }

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await UserService.updateUser(data);
    return res.status(200).json(message)
}

let handleDeleteUser = async (req, res) => {
    if (!req.params.userId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await UserService.deleteUser(req.params.userId);
    return res.status(200).json(message);
}

let getAllRoles = async (req, res) => {
    try {
        let data = await UserService.getAllRoles();
        return res.status(200).json(data);
    } catch (e) {
        console.log('Get all roles error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}





module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleGetUserById,
    handleEditUser,
    handleDeleteUser,
    getAllRoles,
    handleSignUpNewUser,
    handleGetUserByRoles,
    // handleGetMovieTheaterByUser,
    handleLoginAdmin
}