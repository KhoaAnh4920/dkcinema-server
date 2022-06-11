import db from "../models/index";
import MovieTheaterServices from '../services/MovieTheaterServices';


let handleGetAllMovieTheater = async (req, res) => {
    let movie = await MovieTheaterServices.getAllMovieTheater();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        movie
    })

}

let handleCreateNewMovieTheater = async (req, res) => {
    let message = await MovieTheaterServices.createNewMovieTheater(req.body);
    return res.status(200).json(message);
}

let handleGetMovieTheaterById = async (req, res) => {
    let message = '';
    if (req.params && req.params.movieTheaterId)
        message = await MovieTheaterServices.getMovieTheaterById(req.params.userId);
    return res.status(200).json(message);
}

let handleEditMovieTheater = async (req, res) => {
    let data = req.body;
    let message = await MovieTheaterServices.updateMovieTheater(data);
    return res.status(200).json(message)
}

let handleDeleteMovieTheater = async (req, res) => {

    if (!req.params.movieTheaterId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await MovieTheaterServices.deleteMovieTheater(req.params.movieTheaterId);
    return res.status(200).json(message);
}



module.exports = {
    handleGetAllMovieTheater,
    handleCreateNewMovieTheater,
    handleGetMovieTheaterById,
    handleEditMovieTheater,
    handleDeleteMovieTheater
}