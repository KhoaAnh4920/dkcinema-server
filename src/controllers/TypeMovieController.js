import db from "../models/index";
import TypeMovieService from '../services/TypeMovieService';


let handleCreateNewTypeMovie = async (req, res) => {
    let message = await TypeMovieService.createNewTypeMovie(req.body);
    return res.status(200).json(message);
}

let handleEditTypeMovie = async (req, res) => {
    let message = await TypeMovieService.updateTypeMovie(req.body);
    return res.status(200).json(message);
}


let handleGetTypeMovieById = async (req, res) => {
    let message = '';

    if (req.params && req.params.typeId)
        message = await TypeMovieService.getTypeMovieById(req.params.typeId);
    return res.status(200).json(message);
}


let handleGetAllTypeMovie = async (req, res) => {
    let dataTypeMovie = await TypeMovieService.getListTypeOfMovie();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataTypeMovie
    })

}


module.exports = {
    handleCreateNewTypeMovie,
    handleEditTypeMovie,
    handleGetTypeMovieById,
    handleGetAllTypeMovie
}