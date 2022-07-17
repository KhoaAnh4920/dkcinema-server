import db from "../models/index";
import BookingServices from '../services/BookingServices';
const jsonFormat = require("../services/jsonFormat");
var cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

let uploadCloud = (image, fName) => {
    return new Promise(async (resolve, reject) => {
        try {
            await cloudinary.uploader.upload(
                image,
                {
                    resource_type: "raw",
                    public_id: `image/News/${fName}`,
                },
                // Send cloudinary response or catch error
                (err, result) => {
                    if (err) console.log(err);
                    if (result) {
                        resolve(result)
                    }

                }
            );
        } catch (e) {
            reject(e);
        }
    })

}



let handleCreateBookingTicket = async (req, res) => {
    let message = await BookingServices.createNewBookingTicket(req.body);
    res.status(200).json(message)
}


let handleGetMomoPaymentLink = async (req, res) => {
    let message = await BookingServices.getMomoPaymentLink(req.body);
    console.log("Check message: ", message);
    if (message.result)
        return res.status(200).json(jsonFormat.dataSuccess("Get Link successfully", message.result));
    if (message)
        return res.status(200).json({
            statusCode: 200,
            data: message
        });
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

let testSignature = async (req, res) => {
    try {
        const result = await BookingServices.testSignature(req);
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


let testUpload = async (req, res) => {
    console.log("OK: ", req.files);

    let result = await uploadCloud(req.files.upload.path, req.files.upload.name);

    console.log('result: ', result);

    return res.status(200).json({
        uploaded: true,
        url: result.secure_url
    });

};


let handleGetTicketByBooking = async (req, res) => {
    let message = '';
    if (req.query && req.query.bookingId)
        message = await BookingServices.getTicketByBooking(req.query);
    return res.status(200).json(message);
}

let handleGetComboByBooking = async (req, res) => {
    let message = '';

    if (req.query && req.query.bookingId)
        message = await BookingServices.getComboByBooking(req.query);
    return res.status(200).json(message);
}

let handleGetBookingSeet = async (req, res) => {
    let message = '';
    if (req.query && req.query.scheduleId)
        message = await BookingServices.getBookingSeet(req.query);
    return res.status(200).json(message);
}


let handleGetAllBooking = async (req, res) => {
    let message = await BookingServices.getAllBooking(req.query);;
    return res.status(200).json(message);
}

let handleGetBookingByCustomer = async (req, res) => {
    let message = await BookingServices.getBookingByCustomer(req.query);;
    return res.status(200).json(message);
}


let handleGetDetailBooking = async (req, res) => {
    let message = '';

    if (req.params && req.params.id)
        message = await BookingServices.getDetailBooking(req.params.id);
    return res.status(200).json(message);
}


module.exports = {
    handleCreateBookingTicket,
    handleBookingPayment,
    handleGetTicketByBooking,
    handleGetBookingSeet,
    testSendMail,
    testSignature,
    testUpload,
    handleGetAllBooking,
    handleGetDetailBooking,
    handleGetComboByBooking,
    handleGetMomoPaymentLink,
    handleGetBookingByCustomer
}
