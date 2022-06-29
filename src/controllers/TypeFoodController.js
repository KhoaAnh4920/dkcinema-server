import db from "../models/index";
import TypeFoodService from '../services/TypeFoodService';


// let handleCreateNewTypeMovie = async (req, res) => {
//     let message = await TypeFoodService.createNewTypeMovie(req.body);
//     return res.status(200).json(message);
// }

// let handleEditTypeMovie = async (req, res) => {
//     let message = await TypeFoodService.updateTypeMovie(req.body);
//     return res.status(200).json(message);
// }


let handleGetTypeMovieById = async (req, res) => {
    let message = '';

    if (req.params && req.params.typeId)
        message = await TypeFoodService.getTypeMovieById(req.params.typeId);
    return res.status(200).json(message);
}


let handleGetAllTypeFood = async (req, res) => {
    let dataTypeFood = await TypeFoodService.getListTypeOfFood();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataTypeFood
    })

}


module.exports = {
    // handleCreateNewTypeMovie,
    // handleEditTypeMovie,
    // handleGetTypeMovieById,
    handleGetAllTypeFood
}