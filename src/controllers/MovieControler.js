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

let countTicketMovie = async (req, res) => {
    let dataMovie = await MovieServices.countTicket();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataMovie
    })

}

let countBookingTypeOfMovie = async (req, res) => {
    let dataMovie = await MovieServices.countBookingTypeOfMovie();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataMovie
    })

}

let handleGetMovieRevenue = async (req, res) => {
    let dataMovie = await MovieServices.getMovieRevenue(req.query);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataMovie
    })

}

let handleSalesTicketMovie = async (req, res) => {
    let dataMovie = await MovieServices.salesTicket();
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

let handleSearchMovie = async (req, res) => {
    let message = '';
    message = await MovieServices.getMovieByKeyword(req.query);
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


let handleVoteRatingMovie = async (req, res) => {
    let message = await MovieServices.voteNewsRatingMovie(req.body);
    return res.status(200).json(message);
}


let testGetCustomerTypeMovie = async (req, res) => {
    try {
        const result = await MovieServices.testGetCustomerTypeMovie(req);
        return res
            .status(200).json(result);
    } catch (e) {
        console.log(e)
        return res
            .status(400)
            .json({
                message: 'Fail'
            })
    }
};



module.exports = {
    handleCreateNewMovie,
    handleGetAllMovie,
    handleUpdateStatusMovie,
    handleGetMovieById,
    handleUpdateMovie,
    handleDeleteImageMovie,
    handleDeleteMovie,
    handleGetMovieByStatus,
    handleSearchMovie,
    handleVoteRatingMovie,
    countTicketMovie,
    handleSalesTicketMovie,
    testGetCustomerTypeMovie,
    handleGetMovieRevenue,
    countBookingTypeOfMovie
}