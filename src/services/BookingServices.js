import db from "../models/index";

const crypto = require("crypto");
const https = require("https");
import moment from 'moment';
const sequelize = require('sequelize');
const Op = sequelize.Op;
import QRCode from 'qrcode';
var cron = require('node-cron');


//parameters
var partnerCode = "MOMO";
var accessKey = "F8BBA842ECF85";
var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
var orderInfo = "pay with MoMo";
var redirectUrl = "http://localhost:3000/";

// var ipnUrl = "https://57ce-2402-800-6371-a14a-ed0d-ccd6-cbe9-5ced.ngrok.io/api/handle-order";

var notifyUrl = "https://4084-123-21-34-220.ap.ngrok.io/api/handle-booking";
// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
var requestType = "captureWallet";
import emailService from '../services/emailService';


const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];



let createNewBookingTicket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let bookingId = '';

                // Check seet //
                let seets = data.seets;

                let ticketData = await db.Ticket.findAll({
                    where: { showTimeId: data.showTimeId },

                    raw: true,
                    nest: true
                })


                await Promise.all(seets.map(async item => {
                    let check = ticketData.filter(data => data.seetId === item.seetId)

                    // console.log('Check: ', check);
                    // 
                    if (check && check.length > 0) {
                        var givenTime = moment(new Date(), "HH:mm:ss");
                        var minutesPassed = moment(check[0].createdAt, "HH:mm:ss").diff(givenTime, "minutes");


                        if (Math.abs(minutesPassed) > 15) {
                            // console.log("Xoa: ", check[0].bookingId);
                            await db.Ticket.destroy({
                                where: { bookingId: check[0].bookingId }
                            })
                            await db.Combo_Booking.destroy({
                                where: { bookingId: check[0].bookingId }
                            })
                            await db.Booking.destroy({
                                where: { id: check[0].bookingId }
                            })
                        } else {
                            resolve({
                                errCode: -1,
                                errMessage: 'Refused seet',
                            });
                            return;
                        }
                    }
                }))


                await db.Booking.create({
                    customerId: data.cusId,
                    price: data.price,
                    voucherId: null,
                    status: 0,
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

                        resolve({
                            errCode: 0,
                            errMessage: 'OK',
                            result: x.id
                        });
                        return

                    }
                })
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

    let voucher = null;
    if (data.nameCus && data.email && data.phoneNumber) {
        if (data.voucherCode) {
            voucher = await db.Voucher.findOne({
                where: { code: data.voucherCode },
                raw: false,
                nest: true
            })

            if (!voucher) {
                resolve({
                    errCode: 2,
                    errMessage: 'Voucher not found'
                });
                return
            }

        }


        let booking = await db.Booking.findOne({
            where: { id: data.orderId },

            raw: false,
        })


        booking.price = data.amount;
        booking.voucherId = (voucher && voucher.id) ? voucher.id : null;
        booking.nameCus = data.nameCus;
        booking.email = data.email;
        booking.phoneNumber = data.phoneNumber

        await booking.save();

    }


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
                try {
                    a = JSON.parse(body);
                    resolve(a);
                } catch (e) {
                    console.log(e);
                    var lastChar = body.substr(body.length - 1);
                    console.log('lastChar: ', lastChar)
                    if (lastChar !== '}')
                        body = body + '}'
                    resolve(body)
                }
                // resolve(JSON.parse(body));
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


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Update status booking //
let handleBookingPayment = async (req) => {
    // console.log("Check booking: ", req.body);
    if (req.body.resultCode == 0) {
        // req.body.extraData = "285";
        const orderCurrent = await db.Booking.findOne({
            where: { id: +req.body.extraData },
        });
        const orderCurrentAll = await db.Booking.findAll({
            where: { id: +req.body.extraData },
            include: [
                {
                    model: db.Ticket, as: 'BookingTicket', require: true, include: [{
                        model: db.Showtime, as: 'TicketShowtime', require: true,
                        include: [{ model: db.Movie, as: 'ShowtimeMovie', require: true, include: { model: db.TypeMovie, as: 'MovieOfType', require: true } }]
                    }]
                },
                { model: db.Customer, as: 'CustomerBooking' }
            ],

            raw: false,
            nest: true

        });

        orderCurrent.status = 1;

        //  console.log('orderCurrent: ', orderCurrent)

        if (orderCurrent.voucherId || req.body.voucherCode) {
            let voucher = null;
            if (req.body.voucherCode) {
                voucher = await db.Voucher.findOne({
                    where: { code: req.body.voucherCode },
                    raw: false
                })

                orderCurrent.voucherId = voucher.id;
            } else {
                voucher = await db.Voucher.findOne({
                    where: { id: orderCurrent.voucherId },
                    raw: false
                })
            }


            // console.log('voucher: ', voucher);

            if (voucher.maxUses !== -1) {
                voucher.maxUses = voucher.maxUses - 1;
                voucher.isdelete = true;
                await voucher.save()
            }




        }

        const result = await db.Booking.update(orderCurrent, {
            where: { id: +req.body.extraData },
            returning: true,
            plain: true,
        });


        let cusId = orderCurrent.customerId;



        // console.log('cusId in handleBookingPayment: ', cusId);
        let totalBooking = await db.Booking.findAll({
            where: { customerId: cusId, status: 1 },
            // attributes: [
            //     'customerId',
            //     [Sequelize.fn('SUM', Sequelize.cast(Sequelize.col('Booking.price'), "double")), 'total_Price'],
            // ],
            // group: ['customerId'],
            raw: true,
            nest: true
        })

        // console.log('totalBooking: ', totalBooking)

        let sum = 0;
        totalBooking.map((item, index) => {
            sum += item.price;
        })

        //  console.log('sum: ', sum);



        let customer = await db.Customer.findOne({
            where: { id: cusId },
            raw: false
        })

        // console.log('totalBooking: ', totalBooking)

        if (totalBooking && sum > 0) {
            if (sum > 1000000 && sum <= 2000000) {
                customer.rankId = 2;
                //  await customer.save();
            }
            if (sum > 2000000) {
                customer.rankId = 3;
                //    await customer.save();
            }
        }

        // Update hobby customer

        if (orderCurrentAll[0] && orderCurrentAll[0].BookingTicket[0] && orderCurrentAll[0].BookingTicket[0].TicketShowtime && orderCurrentAll[0].BookingTicket[0].TicketShowtime.ShowtimeMovie) {
            let dataType = orderCurrentAll[0].BookingTicket[0].TicketShowtime.ShowtimeMovie.MovieOfType;

            // console.log('dataType: ', dataType)

            await Promise.all(dataType.map(async item => {
                let checkIsExists = await db.TypeMovieCustomer.findOne({
                    where: {
                        typeId: item.id,
                        cusId: orderCurrentAll[0].customerId
                    },
                    raw: false
                })
                // console.log('checkIsExists: ', checkIsExists)
                if (checkIsExists) {
                    checkIsExists.amount += 1;
                    checkIsExists.save();
                } else {
                    db.TypeMovieCustomer.create({
                        typeId: item.id,
                        cusId: orderCurrentAll[0].customerId,
                        amount: 1
                    })
                }
            }))
        }

        // 



        if ((customer.numberOfTicket + orderCurrentAll[0].BookingTicket.length) >= 50) {
            // Send voucher free ticket //
            let voucherGif = 'DKFREE' + getRandomInt(10000);


            await db.Voucher.create({
                code: voucherGif,
                discount: 100000,
                status: 1,
                maxUses: 1,
                name: `Voucher gif free ticket ${customer.fullName}`,
                description: 'Voucher gif free ticket',
                timeStart: null,
                timeEnd: null,
                cusId: customer.id
            })


            customer.numberOfTicket = 0;


            let obj = {}
            obj.reciverEmail = orderCurrentAll[0].email;
            obj.voucherCode = voucherGif;

            await emailService.sendEmailVoucherFree(obj);

        } else {
            customer.numberOfTicket += orderCurrentAll[0].BookingTicket.length;
        }

        await customer.save();


        if (req.body.resultCode === 0 && req.body.type === 1) {
            orderCurrent.price = 0;
        }
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
        where: { id: 66 },
    });

    // console.log("Check orderCurrent: ", orderCurrent);

    sendMailBooking(orderCurrent)

    return false;
};

let testGetTypeMovieBooking = async (req) => {

    const orderCurrent = await db.Booking.findAll({
        where: { id: 88 },
        include: [
            {
                model: db.Ticket, as: 'BookingTicket', require: true, include: [{
                    model: db.Showtime, as: 'TicketShowtime', require: true,
                    include: [{ model: db.Movie, as: 'ShowtimeMovie', require: true, include: { model: db.TypeMovie, as: 'MovieOfType', require: true } }]
                }]
            },
        ],

        raw: false,
        nest: true

    });

    let dataType = orderCurrent[0].BookingTicket[0].TicketShowtime.ShowtimeMovie.MovieOfType;


    console.log('dataType: ', dataType)

    await Promise.all(dataType.map(async item => {
        let checkIsExists = await db.TypeMovieCustomer.findOne({
            where: {
                typeId: item.id,
                cusId: orderCurrent[0].customerId
            },
            raw: false
        })
        console.log('checkIsExists: ', checkIsExists)
        if (checkIsExists) {
            checkIsExists.amount += 1;
            checkIsExists.save();
        } else {
            db.TypeMovieCustomer.create({
                typeId: item.id,
                cusId: orderCurrent[0].customerId,
                amount: 1
            })
        }
    }))

    return orderCurrent;
};


let testSignature = async (req) => {

    // console.log('req.signature: ', req.body.signature);

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
            //console.log('Check data: ', data)
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


                let dataCombo = await db.Combo_Booking.findAll({
                    where: {
                        bookingId: +data.id
                    },
                    include: [
                        { model: db.Combo, as: 'Combo' },
                    ],
                    raw: true,
                    nest: true
                })
                let obj = {};

                if (dataCombo.length > 0) {
                    obj.combo = '';
                    dataCombo.map(item => {
                        obj.combo += item.Combo.name + ', '
                    })

                    obj.combo = obj.combo.replace(/,\s*$/, "");
                }


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


                // const imgQRCode = await QRCode.toDataURL(`${data.id}`);

                // obj.QRcode = imgQRCode;

                // console.log('obj: ', obj)




                let soGheDefault = '';
                let soGheVip = ''
                ticket.map((item, index) => {
                    if (item.TicketSeet.typeId === 1) {
                        soGheDefault += alphabet[+item.TicketSeet.posOfColumn];
                        soGheDefault = soGheDefault + (+item.TicketSeet.posOfRow + 1) + ', '
                    } else {
                        soGheVip += alphabet[+item.TicketSeet.posOfColumn];
                        soGheVip = soGheVip + (+item.TicketSeet.posOfRow + 1) + ', '
                    }

                })
                soGheDefault = soGheDefault.replace(/,\s*$/, "");
                soGheVip = soGheVip.replace(/,\s*$/, "");

                obj.seet = '';
                if (soGheDefault !== '') {
                    obj.seet += 'Ghế tiêu chuẩn(' + soGheDefault + ')' + ',';
                }
                if (soGheVip !== '') {
                    obj.seet += ' Ghế Vip(' + soGheVip + ')';
                }



                const imgQRCode = await QRCode.toDataURL(`${data.id}`);

                obj.QRcode = imgQRCode;

                console.log('Check obj: ', obj)
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
            let page = null;
            let PerPage = null;
            let skip = null;
            let total = await db.Ticket.count({ where: { bookingId: +query.bookingId } });
            if (query.page && query.PerPage) {
                page = +query.page;
                PerPage = +query.PerPage;
                skip = (page - 1) * PerPage;
            }
            let ticket = await db.Ticket.findAll({
                offset: (skip) ? skip : null,
                limit: (PerPage) ? PerPage : null,
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
            // console.log(ticket);

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
                data: ticket,
                totalData: total
            })
        } catch (e) {
            reject(e);
        }
    })
}


let getComboByBooking = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            let combo = await db.Combo_Booking.findAll({
                where: { bookingId: +query.bookingId },
                include: [
                    { model: db.Combo, as: 'Combo' },

                ],
                raw: true,
                nest: true

            })


            resolve({
                errCode: 0,
                data: combo
            })
        } catch (e) {
            reject(e);
        }
    })
}


let getBookingSeet = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            // console.log(ticket);


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
                let page = null;
                let PerPage = null;
                let skip = null;

                if (data.page && data.PerPage) {
                    page = +data.page;
                    PerPage = +data.PerPage;
                    skip = (page - 1) * PerPage;
                }

                let dateFormat = moment(new Date(+data.date)).format('YYYY-MM-DD');

                let listBooking = await db.Booking.findAll({
                    offset: (skip) ? skip : null,
                    limit: (PerPage) ? PerPage : null,
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
                            data.nameCus &&
                            {
                                nameCus: {
                                    [Sequelize.Op.iLike]: `%${data.nameCus}%`
                                }
                            },
                            data.id &&
                            {
                                id: +data.id
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
                                },
                                { model: db.Movie, as: 'ShowtimeMovie', }
                                ]
                            }]
                        },

                    ],

                    order: [
                        ['id', 'DESC'],
                    ],
                    raw: false,
                    nest: true
                });



                // console.log('listBooking: ', listBooking)
                //item.dataValues.BookingTicket.TicketShowtime.id !== null

                if (listBooking && listBooking.length > 0) {
                    listBooking = listBooking.filter(item => item.dataValues.BookingTicket[0].dataValues.TicketShowtime !== null)
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listBooking,
                    totalData: listBooking.length
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


let getBookingByCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let dateFormatStart = null;
                let dateFormatEnd = null;
                if (data.startTime) {
                    dateFormatStart = moment(new Date(+data.startTime)).format('YYYY-MM-DD');
                }
                if (data.endTime) {
                    dateFormatEnd = moment(new Date(+data.endTime)).format('YYYY-MM-DD');
                }

                let whereClause = {};
                if (dateFormatStart || dateFormatEnd) {
                    if (dateFormatStart && !dateFormatEnd) {
                        whereClause = { [Op.gte]: `%${dateFormatStart}%` }
                    } else if (!dateFormatStart && dateFormatEnd)
                        whereClause = { [Op.lte]: `%${dateFormatEnd}%` }
                    else
                        whereClause = { [Op.gte]: `%${dateFormatStart}%`, [Op.lte]: `%${dateFormatEnd}%` }
                }


                let listBooking = await db.Booking.findAll({

                    include: [
                        {
                            model: db.Ticket, as: 'BookingTicket',
                            include: [{
                                model: db.Showtime, as: 'TicketShowtime', require: true,
                                include: [{
                                    model: db.Room, as: 'RoomShowTime', require: true,
                                    include: [{
                                        model: db.MovieTheater, as: 'MovieTheaterRoom',
                                    }]
                                },
                                { model: db.Movie, as: 'ShowtimeMovie', require: true }
                                ]
                            }]
                        },

                    ],

                    where: {
                        [Op.and]: [

                            data.cusId &&
                            {
                                customerId: +data.cusId
                            },
                            (dateFormatStart || dateFormatEnd) &&

                            db.sequelize.where(
                                db.sequelize.cast(db.sequelize.col("Booking.createdAt"), "varchar"),
                                whereClause
                            ),
                            { status: 1 }
                        ]
                    },

                    order: [
                        ['id', 'DESC'],
                    ],
                    raw: false,
                    nest: true
                });

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listBooking,
                    totalData: listBooking.length
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




let getSeetBookingByCustomer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {

                let dataSeet = await db.Ticket.findAll({
                    where: { bookingId: +data.bookingId }
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: dataSeet,

                });
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



let getDetailBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataBooking = await db.Booking.findOne({
                where: { id: id },
                include: [
                    {
                        model: db.Ticket, as: 'BookingTicket', include: [{
                            model: db.Showtime, as: 'TicketShowtime',
                            include: [{
                                model: db.Room, as: 'RoomShowTime',
                                include: [{
                                    model: db.MovieTheater, as: 'MovieTheaterRoom',
                                }],
                            }, { model: db.Movie, as: 'ShowtimeMovie' }]
                        }, { model: db.Seet, as: 'TicketSeet' }]
                    },

                ],
                where: { id: id },

                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: dataBooking
            });
        } catch (e) {
            reject(e);
        }
    })
}


let deleteBooking = (id) => {
    return new Promise(async (resolve, reject) => {
        let dataBooking = await db.Booking.findOne({
            where: { id: id },
        });
        if (!dataBooking) {
            resolve({
                errCode: 2,
                errMessage: 'Booking không tồn tại'
            })
        }

        await db.Ticket.destroy({
            where: { bookingId: id }
        })
        await db.Combo_Booking.destroy({
            where: { bookingId: id }
        })


        await db.Booking.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete Booking ok"
        })
    })
}



let handleUpdateStatusComboBooking = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.bookingId) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing params'
                })
            } else {
                let dataComboBook = await db.Combo_Booking.findOne({
                    where: { bookingId: data.bookingId },
                    raw: false
                })

                if (dataComboBook) {
                    dataComboBook.status = true;
                    await dataComboBook.save();
                    resolve({
                        errCode: 0,
                        message: "Update Status combo Success"
                    });
                    return
                }


                resolve({
                    errCode: 0,
                    message: "OK"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}



let countSalesAllMovieTheater = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataSales = await db.Booking.findAll({
                attributes: [db.sequelize.fn('date_trunc', 'month', db.sequelize.col('createdAt')), [db.sequelize.fn('sum', db.sequelize.col('price')), 'PriceCount']],

                group: 'date_trunc',

                raw: true,
                nest: true
            });

            dataSales.sort((a, b) => a.date_trunc.getTime() - b.date_trunc.getTime());

            // console.log('dataSales: ', dataSales)

            resolve(dataSales.reverse());
        } catch (e) {
            reject(e);
        }
    })
}



var task = cron.schedule('59 * * * *', async () => {
    let dateToday = moment(new Date()).format('MM-DD');

    let bookingData = await db.Booking.findAll({
        where: {
            [Op.and]: [
                db.sequelize.where(
                    db.sequelize.cast(db.sequelize.col("Booking.createdAt"), "varchar"),
                    { [Op.iLike]: `%${dateToday}%` }
                ),
                { status: 0 },
            ]
        },
    })

    if (bookingData && bookingData.length > 0) {
        await Promise.all(bookingData.map(async item => {
            var givenTime = moment(new Date(), "HH:mm:ss");
            var minutesPassed = moment(item.createdAt, "HH:mm:ss").diff(givenTime, "minutes");

            if (Math.abs(minutesPassed) > 15) {
                //   console.log('Math.abs(minutesPassed): ', Math.abs(minutesPassed))
                await db.Ticket.destroy({
                    where: { bookingId: item.id }
                })
                await db.Combo_Booking.destroy({
                    where: { bookingId: item.id }
                })
                await db.Booking.destroy({
                    where: { id: item.id }
                })
            }
        }))
    }

    console.log('bookingData: ', bookingData)


});

task.start();


module.exports = {
    createNewBookingTicket,
    getMomoPaymentLink,
    handleBookingPayment,
    getTicketByBooking,
    testSendMail,
    testSignature,
    getBookingSeet,
    getAllBooking,
    getDetailBooking,
    getComboByBooking,
    getBookingByCustomer,
    deleteBooking,
    handleUpdateStatusComboBooking,
    countSalesAllMovieTheater,
    testGetTypeMovieBooking,
    getSeetBookingByCustomer
}


