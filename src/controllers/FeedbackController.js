import db from "../models/index";
import FeedbackServices from '../services/FeedbackServices';


let handleGetListFeedback = async (req, res) => {
    let message = '';
    message = await FeedbackServices.getListFeedback(req.query);
    return res.status(200).json(message);
}


let handleGetDetailFeedback = async (req, res) => {
    let message = '';

    if (req.params && req.params.feedbackId)
        message = await FeedbackServices.getDetailFeedback(req.params.feedbackId);
    return res.status(200).json(message);
}

module.exports = {
    handleGetListFeedback,
    handleGetDetailFeedback
}