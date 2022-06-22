import db from "../models/index";
import MovieServices from '../services/MovieServices';


let handleCreateNewMovie = async (req, res) => {
    let message = await MovieServices.createNewMovie(req.body);
    return res.status(200).json(message);
}

let handleUpdateMovie = async (req, res) => {
    let message = await MovieServices.updateMovie(req.body);
    return res.status(200).json(message);
}


let handleGetAllMovie = async (req, res) => {
    let dataMovie = await MovieServices.getListMovie();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataMovie
    })

}


let handleUpdateStatusMovie = async (req, res) => {
    let data = req.body;
    let message = await MovieServices.updateStatusMovie(data);
    return res.status(200).json(message)
}

let handleDeleteMovie = async (req, res) => {
    console.log(req.body);
    let data = req.body;
    let message = await MovieServices.deleteMovie(data);
    return res.status(200).json(message)
}


let handleGetMovieById = async (req, res) => {
    let message = '';
    if (req.params && req.params.movieId)
        message = await MovieServices.getMovieById(req.params.movieId);
    return res.status(200).json(message);
}

let handleGetMovieByStatus = async (req, res) => {
    let message = '';
    if (req.query && req.query.status)
        message = await MovieServices.getMovieByStatus(req.query);
    return res.status(200).json(message);
}

let handleDeleteImageMovie = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await MovieServices.deleteImageMovie(req.params.id);
    return res.status(200).json(message);
}


module.exports = {
    handleCreateNewMovie,
    handleGetAllMovie,
    handleUpdateStatusMovie,
    handleGetMovieById,
    handleUpdateMovie,
    handleDeleteImageMovie,
    handleDeleteMovie,
    handleGetMovieByStatus
}