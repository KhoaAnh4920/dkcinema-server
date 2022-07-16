import db from "../models/index";
import ComboServices from '../services/ComboServices';


let handleCreateNewCombo = async (req, res) => {
    let message = await ComboServices.createNewCombo(req.body);
    return res.status(200).json(message);
}

let handleGetAllCombo = async (req, res) => {
    let dataCombo = await ComboServices.getListCombo();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataCombo
    })
}


let handleGetItemCombo = async (req, res) => {
    let message = '';

    if (req.params && req.params.id)
        message = await ComboServices.getItemOfCombo(req.params.id);
    return res.status(200).json(message);
}

let handleGetDetailCombo = async (req, res) => {
    let message = '';

    if (req.params && req.params.id)
        message = await ComboServices.getDetailCombo(req.params.id);
    return res.status(200).json(message);
}


let handleEditCombo = async (req, res) => {
    let message = await ComboServices.updateCombo(req.body);
    return res.status(200).json(message);
}

let handleDeleteCombo = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await ComboServices.deleteCombo(req.params.id);
    return res.status(200).json(message);
}




module.exports = {
    handleCreateNewCombo,
    handleGetAllCombo,
    handleGetItemCombo,
    handleGetDetailCombo,
    handleEditCombo,
    handleDeleteCombo
}