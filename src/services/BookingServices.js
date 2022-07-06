import db from "../models/index";

const crypto = require("crypto");
const https = require("https");
import moment from 'moment';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//parameters
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderInfo = "pay with MoMo";
var redirectUrl = "http://localhost:3001/";

// var ipnUrl = "https://57ce-2402-800-6371-a14a-ed0d-ccd6-cbe9-5ced.ngrok.io/api/handle-order";

var notifyUrl = "https://fe6f-14-161-20-253.ap.ngrok.io/api/handle-booking";
// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
var requestType = "captureWallet";
import emailService from '../services/emailService';


const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];



let createNewBookingTicket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let bookingId = '';

                await db.Booking.create({
                    customerId: data.cusId,
                    price: data.price,
                    voucherId: null,
                    status: -1,
                    nameCus: data.name,
                    email: data.email,
                    phoneNumber: data.phoneNumber
                }).then(function (x) {
                    if (x.id) {
                        bookingId = x.id;
                        // Insert 2 table //
                        let seets = data.seets;
                        let combos = data.combo;

                        let listSeets = [];
                        let listCombo = [];

                        seets.map(item => {
                            let obj = {};
                            obj.bookingId = x.id;
                            obj.showTimeId = data.showTimeId;
                            obj.seetId = item.seetId;
                            listSeets.push(obj);
                        })
                        db.Ticket.bulkCreate(listSeets);

                        if (combos.length > 0) {
                            combos.map(item => {
                                let obj = {};
                                obj.bookingId = x.id;
                                obj.comboId = item.comboId;
                                obj.amount = item.quanlity;
                                listCombo.push(obj);
                            })
                            db.Combo_Booking.bulkCreate(listCombo)
                        }

                        // send email booking //
                    }
                })

                console.log("bookingId: ", bookingId)

                if (bookingId !== '') {
                    let result = await getMomoPaymentLink({
                        amount: data.price,
                        orderId: bookingId
                    })

                    resolve({
                        errCode: 0,
                        errMessage: 'OK',
                        result: result
                    }); // return 
                }

            }

            resolve({
                errCode: 2,
                errMessage: 'Missing data'
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}


let getMomoPaymentLink = async (data) => {
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        data.amount +
        "&extraData=" +
        data.orderId +
        "&ipnUrl=" +
        notifyUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;
    //puts raw signature
    //console.log("--------------------RAW SIGNATURE----------------");
    console.log('rawSignature: ', rawSignature);
    //signature
    var signature = crypto
        .createHmac("sha256", secretkey)
        .update(rawSignature)
        .digest("hex");
    //console.log("--------------------SIGNATURE----------------");
    console.log('signature: ', signature);
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: data.amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: notifyUrl,
        extraData: data.orderId,
        requestType: requestType,
        signature: signature,
        lang: "en",
    });

    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    };



    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res.headers)}`);
            res.setEncoding("utf8");
            res.on("data", (body) => {
                console.log("Body: ");
                console.log(body);
                // console.log("payUrl: ");
                // console.log(JSON.parse(body).payUrl);
                // resolve(body)
                resolve(JSON.parse(body));
            });
            res.on("end", () => {
                console.log("No more data in response.");
                // var post_req = https.request(options2, function (res) {
                //   res.setEncoding('utf8');
                //   res.on('data', function (chunk) {
                //     console.log('Response: ' + chunk);
                //   });
                // });
                // // post the data
                // post_req.write(requestBody);
                // post_req.end();
            });
        });

        req.on("error", (e) => {
            // console.log(`problem with request: ${e.message}`);

        });
        // write data to request body
        console.log("Sending....");

        req.write(requestBody);
        req.end();
    });
};

// Update status booking //
let handleBookingPayment = async (req) => {
    console.log("Check booking: ", req.body);
    if (req.body.resultCode == 0) {
        // req.body.extraData = "285";
        const orderCurrent = await db.Booking.findOne({
            where: { id: +req.body.extraData },
        });

        // const orderCurrentData = orderCurrent.dataValues;
        // console.log("orderCurrentData dataValues: ", orderCurrentData);
        orderCurrent.status = 1;

        const result = await db.Booking.update(orderCurrent, {
            where: { id: +req.body.extraData },
            returning: true,
            plain: true,
        });

        // send mail //
        sendMailBooking(orderCurrent)


        return result;
    } else {
        await db.Combo_Booking.destroy({
            where: { bookingId: +req.body.extraData }
        })
        await db.Ticket.destroy({
            where: { bookingId: +req.body.extraData }
        })
        await db.Booking.destroy({
            where: { id: +req.body.extraData },
        })

        return false;
    }
    // return false;
};

let testSendMail = async (req) => {


    const orderCurrent = await db.Booking.findOne({
        where: { id: 13 },
    });

    console.log("Check orderCurrent: ", orderCurrent);

    sendMailBooking(orderCurrent)

    return false;
};


let testSignature = async (req) => {

    console.log('req.signature: ', req.body.signature);

    let params = decodeURI(req.body.signature)

    var signature = crypto
        .createHmac("sha256", secretkey)
        .update(params)
        .digest("hex");
    //console.log("--------------------SIGNATURE----------------");
    console.log('signature: ', signature);

    return signature;
};

let sendMailBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing params"
                })
            } else {

                let ticket = await db.Ticket.findAll({
                    where: { bookingId: +data.id },
                    include: [
                        { model: db.Seet, as: 'TicketSeet' },
                        {
                            model: db.Showtime, as: 'TicketShowtime', include: [{ model: db.Movie, as: 'ShowtimeMovie' },
                            { model: db.Room, as: 'RoomShowTime', include: { model: db.MovieTheater, as: 'MovieTheaterRoom' } }]
                        },
                    ],
                    raw: true,
                    nest: true


                })
                console.log(ticket);

                let obj = {}
                obj.nameMovie = ticket[0].TicketShowtime.ShowtimeMovie.name;
                // 05/06/2022 - 22:00 //
                let ngayChieu = moment(ticket[0].TicketShowtime.premiereDate).format("DD/MM/YYYY");
                let gioChieu = moment(ticket[0].TicketShowtime.startTime).format("HH:mm");
                obj.time = ngayChieu + ' - ' + gioChieu;
                obj.room = ticket[0].TicketShowtime.RoomShowTime.MovieTheaterRoom.tenRap + ' - ' + ticket[0].TicketShowtime.RoomShowTime.name;
                obj.paymentMethod = 'Ví Điện Tử Momo';
                obj.price = data.price;
                obj.name = data.nameCus;
                obj.reciverEmail = data.email;
                obj.bookingId = data.id




                let soGhe = ''
                ticket.map((item, index) => {
                    soGhe += alphabet[+item.TicketSeet.posOfColumn];
                    soGhe = soGhe + (+item.TicketSeet.posOfRow + 1) + ', '
                })
                soGhe = soGhe.replace(/,\s*$/, "");

                obj.seet = '1' + ' - (' + soGhe + ')';

                // send mail //
                await emailService.sendSimpleEmail(obj);

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let getTicketByBooking = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ticket = await db.Ticket.findAll({
                where: { bookingId: +query.bookingId },
                include: [
                    { model: db.Seet, as: 'TicketSeet' },
                    {
                        model: db.Showtime, as: 'TicketShowtime', include: [{ model: db.Movie, as: 'ShowtimeMovie' },
                        { model: db.Room, as: 'RoomShowTime', include: { model: db.MovieTheater, as: 'MovieTheaterRoom' } }]
                    },
                ],
                raw: true,
                nest: true


            })
            console.log(ticket);

            let obj = {}
            obj.nameMovie = ticket[0].TicketShowtime.ShowtimeMovie.name;
            // 05/06/2022 - 22:00 //
            let ngayChieu = moment(ticket[0].TicketShowtime.premiereDate).format("DD/MM/YYYY");
            let gioChieu = moment(ticket[0].TicketShowtime.startTime).format("HH:mm");
            obj.time = ngayChieu + ' - ' + gioChieu;
            obj.room = ticket[0].TicketShowtime.RoomShowTime.MovieTheaterRoom.tenRap + ' - ' + ticket[0].TicketShowtime.RoomShowTime.name;
            obj.paymentMethod = 'Ví Điện Tử Momo';
            obj.price = 1000;



            let soGhe = ''
            ticket.map((item, index) => {
                soGhe += alphabet[+item.TicketSeet.posOfColumn];
                soGhe = soGhe + (+item.TicketSeet.posOfRow + 1) + ', '
            })
            soGhe = soGhe.replace(/,\s*$/, "");

            obj.seet = '1' + ' - (' + soGhe + ')';


            resolve({
                errCode: 0,
                data: ticket
            })
        } catch (e) {
            reject(e);
        }
    })
}


let getBookingSeet = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('query.scheduleId: ', query.scheduleId);
            let ticket = await db.Ticket.findAll({
                where: { showTimeId: +query.scheduleId },
                include: [
                    { model: db.Seet, as: 'TicketSeet' },
                    {
                        model: db.Booking, as: 'BookingTicket', where: { status: 1 }
                    },
                ],
                raw: true,
                nest: true


            })
            console.log(ticket);


            resolve({
                errCode: 0,
                data: ticket
            })
        } catch (e) {
            reject(e);
        }
    })
}


let getAllBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {

                console.log(data);

                let dateFormat = moment(new Date(+data.date)).format('YYYY-MM-DD');

                console.log(dateFormat);


                let listBooking = await db.Booking.findAll({
                    where: {
                        [Op.and]: [
                            data.date &&
                            db.sequelize.where(
                                db.sequelize.cast(db.sequelize.col("Booking.createdAt"), "varchar"),
                                { [Op.iLike]: `%${dateFormat}%` }
                            ),
                            data.status &&
                            {
                                status: {
                                    [Op.or]: [(data.status) ? +data.status : null, null]
                                }
                            },
                        ]
                    },
                    include: [
                        {
                            model: db.Ticket, as: 'BookingTicket', include: [{
                                model: db.Showtime, as: 'TicketShowtime',
                                include: [{
                                    model: db.Room, as: 'RoomShowTime',
                                    include: [{
                                        model: db.MovieTheater, as: 'MovieTheaterRoom',
                                    }],
                                    where: {
                                        [Op.and]: [
                                            data.movieTheaterId &&
                                            {
                                                movieTheaterId: {
                                                    [Op.or]: [(data.movieTheaterId) ? +data.movieTheaterId : null, null]
                                                }
                                            },
                                        ]

                                    },
                                }]
                            }]
                        },

                    ],

                    order: [
                        ['id', 'DESC'],
                    ],
                    raw: true,
                    nest: true
                });


                if (listBooking && listBooking.length > 0) {
                    listBooking = listBooking.filter(item => item.BookingTicket.TicketShowtime.id !== null)
                }

                console.log('listBooking: ', listBooking)


                console.log(moment().utcOffset(0).startOf('day').subtract(1, "days").format());
                // console.log("listBooking: ", listBooking);

                // let test = 'SELECT "Showtime".*, "Movie".id AS "MovieID", "Movie"."name"  FROM "Showtime" JOIN "Movie" ON "Showtime"."movieId" = "Movie".id WHERE CAST("premiereDate" AS VARCHAR) LIKE :premiereDate';

                // if (data.roomId) {
                //     test += ' AND "Showtime"."roomId" = :roomId';
                // }
                // if (data.movieId) {
                //     test += ' AND "Showtime"."movieId" = :movieId';
                // }
                // let listBooking = await db.sequelize.query(
                //     test,
                //     {
                //         replacements: { premiereDate: `%${data.date}%`, roomId: data.roomId, movieId: data.movieId },
                //         type: QueryTypes.SELECT
                //     }
                // );
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listBooking
                }); // return 
            }

            resolve({
                errCode: 2,
                errMessage: 'Missing data'
            }); // return 

        } catch (e) {
            reject(e);
        }
    })
}



module.exports = {
    createNewBookingTicket,
    getMomoPaymentLink,
    handleBookingPayment,
    getTicketByBooking,
    testSendMail,
    testSignature,
    getBookingSeet,
    getAllBooking
}


