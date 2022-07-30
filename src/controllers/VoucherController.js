import db from "../models/index";
import VoucherServices from '../services/VoucherServices';


let handleCreateVoucher = async (req, res) => {
    let message = await VoucherServices.createNewVoucher(req.body);
    return res.status(200).json(message);
}

let handleGetListVoucher = async (req, res) => {
    let message = '';
    message = await VoucherServices.getListVoucher(req.query);
    return res.status(200).json(message);
}

let handleGetListVoucherByCustomer = async (req, res) => {
    let message = '';
    message = await VoucherServices.getListVoucherByCustomer(req.query);
    return res.status(200).json(message);
}


let handleGetDetailVoucherByIdOrCode = async (req, res) => {

    let message = '';
    if (req.params && (+req.params.id || req.params.code))
        message = await VoucherServices.getVoucherById(+req.params.id || req.params.code);
    return res.status(200).json(message);
}


let handleCusApplyVoucher = async (req, res) => {

    let message = '';
    if (req.params && req.params.code)
        message = await VoucherServices.getVoucheryCustomer(req.params.code);
    return res.status(200).json(message);
}


let handleUpdateVoucher = async (req, res) => {
    let message = '';
    if (req.body && req.body.id)
        message = await VoucherServices.updateVoucher(req.body);
    else {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    return res.status(200).json(message);
}



let handleUpdateStatusVoucher = async (req, res) => {
    let data = req.body;
    let message = await VoucherServices.updateStatusVoucher(data);
    return res.status(200).json(message)
}



let handleDeleteVoucher = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await VoucherServices.deleteVoucher(req.params.id);
    return res.status(200).json(message);
}



module.exports = {
    handleCreateVoucher,
    handleGetListVoucher,
    handleGetDetailVoucherByIdOrCode,
    handleUpdateVoucher,
    handleUpdateStatusVoucher,
    handleDeleteVoucher,
    handleCusApplyVoucher,
    handleGetListVoucherByCustomer
}