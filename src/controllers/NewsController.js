import db from "../models/index";
import NewsServices from '../services/NewsServices';


let handleCreateNews = async (req, res) => {
    let message = await NewsServices.createNewPost(req.body);
    return res.status(200).json(message);
}

let handlePostComment = async (req, res) => {
    let message = await NewsServices.postComment(req.body);
    return res.status(200).json(message);
}


let handleVoteRating = async (req, res) => {
    let message = await NewsServices.voteNewsRating(req.body);
    return res.status(200).json(message);
}


let handleGetNews = async (req, res) => {
    let message = '';
    message = await NewsServices.getListNews(req.query);
    return res.status(200).json(message);
}



let handleGetDetailNews = async (req, res) => {
    let message = '';

    if (req.params && req.params.id)
        message = await NewsServices.getDetailNews(req.params.id);
    return res.status(200).json(message);
}


let handleUpdateStatusNews = async (req, res) => {
    let data = req.body;
    let message = await NewsServices.updateStatusNews(data);
    return res.status(200).json(message)
}


let handleEditNews = async (req, res) => {
    let data = req.body;
    let message = await NewsServices.updateNews(data);
    return res.status(200).json(message)
}


let handleDeleteNews = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await NewsServices.deleteNews(req.params.id);
    return res.status(200).json(message);
}




module.exports = {
    handleCreateNews,
    handleGetNews,
    handleGetDetailNews,
    handleUpdateStatusNews,
    handleEditNews,
    handleDeleteNews,
    handlePostComment,
    handleVoteRating
}