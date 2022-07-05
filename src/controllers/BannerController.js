import db from "../models/index";
import BannerServices from '../services/BannerServices';


let handleCreateNewBanner = async (req, res) => {
    let message = await BannerServices.createNewBanner(req.body);
    return res.status(200).json(message);
}

let handleGetBanner = async (req, res) => {
    let message = '';
    message = await BannerServices.getListBanner(req.query);
    return res.status(200).json(message);
}

let handleGetDetailBanner = async (req, res) => {
    let message = '';

    if (req.params && req.params.id)
        message = await BannerServices.getDetailBanner(req.params.id);
    return res.status(200).json(message);
}


let handleUpdateStatusBanner = async (req, res) => {
    let data = req.body;
    let message = await BannerServices.updateStatusBanner(data);
    return res.status(200).json(message)
}

let handleEditBanner = async (req, res) => {
    let data = req.body;
    let message = await BannerServices.updateBanner(data);
    return res.status(200).json(message)
}


let handleDeleteBanner = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await BannerServices.deleteBanner(req.params.id);
    return res.status(200).json(message);
}




module.exports = {
    handleCreateNewBanner,
    handleGetBanner,
    handleGetDetailBanner,
    handleUpdateStatusBanner,
    handleEditBanner,
    handleDeleteBanner
}