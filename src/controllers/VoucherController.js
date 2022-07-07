import db from "../models/index";
import VoucherServices from '../services/VoucherServices';


let handleCreateVoucher = async (req, res) => {
    let message = await VoucherServices.createNewVoucher(req.body);
    return res.status(200).json(message);
}





module.exports = {
    handleCreateVoucher,
}