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
        message = await MovieTheaterServices.getMovieTheaterById(req.params.movieTheaterId);
    return res.status(200).json(message);
}

let handleCountTurnoverByMovieTheater = async (req, res) => {
    let message = '';
    if (req.query && req.query.movieTheaterId)
        message = await MovieTheaterServices.countTurnoverByMovieTheater(req.query.movieTheaterId);
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

let handleDeleteImageMovieTheater = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await MovieTheaterServices.deleteImageMovieTheater(req.params.id);
    return res.status(200).json(message);
}


let handleCheckMerchant = async (req, res) => {
    let message = '';
    console.log(req.query);
    message = await MovieTheaterServices.checkMerchantMovieTheater(req.query);

    return res.status(200).json(message);
}



module.exports = {
    handleGetAllMovieTheater,
    handleCreateNewMovieTheater,
    handleGetMovieTheaterById,
    handleEditMovieTheater,
    handleDeleteMovieTheater,
    handleDeleteImageMovieTheater,
    handleCheckMerchant,
    handleCountTurnoverByMovieTheater
}