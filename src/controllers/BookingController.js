import db from "../models/index";
import BookingServices from '../services/BookingServices';
const jsonFormat = require("../services/jsonFormat");

let handleCreateBookingTicket = async (req, res) => {
    console.log("Check req: ", req.body);
    let message = await BookingServices.createNewBookingTicket(req.body);
    console.log("Check message: ", message);
    if (message.result)
        return res.status(200).json(jsonFormat.dataSuccess("Get Link successfully", message.result));
    return res.status(200).json(message);
}


let handleBookingPayment = async (req, res) => {
    try {
        const result = await BookingServices.handleBookingPayment(req);
        return res
            .status(200)
            .json(jsonFormat.dataSuccess("Handle payment and send mail successfully", result));
    } catch (e) {
        return res
            .status(400)
            .json(
                jsonFormat.dataError(
                    e.message
                        ? e.message
                        : "Somethings gone wrong, please try again or contact Admin if the issue persists."
                )
            );
    }
};


let testSendMail = async (req, res) => {
    try {
        const result = await BookingServices.testSendMail(req);
        return res
            .status(200).json(result);
    } catch (e) {
        return res
            .status(400)
            .json(
                jsonFormat.dataError(
                    e.message
                        ? e.message
                        : "Send mail fail."
                )
            );
    }
};


let handleGetTicketByBooking = async (req, res) => {
    let message = '';
    if (req.query && req.query.bookingId)
        message = await BookingServices.getTicketByBooking(req.query);
    return res.status(200).json(message);
}



module.exports = {
    handleCreateBookingTicket,
    handleBookingPayment,
    handleGetTicketByBooking,
    testSendMail
}
