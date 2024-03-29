import db from "../models/index";
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';



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
                    public_id: `image/MovieTheater/${fName}`,
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

let getAllMovieTheater = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let movieTheater = await db.MovieTheater.findAll({
                where: {
                    isdelete: false
                },
                include: [
                    { model: db.ImageMovieTheater, as: 'MovieTheaterImage' },
                ],
                raw: false,
                nest: true
            });

            resolve(movieTheater);
        } catch (e) {
            reject(e);
        }
    })
}



let createNewMovieTheater = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            const resMovieTheater = await db.MovieTheater.create({
                tenRap: data.tenRap,
                soDienThoai: data.soDienThoai,
                address: data.address,
                cityCode: data.cityCode,
                districtCode: data.districtCode,
                wardCode: data.wardCode,
            })

            if (resMovieTheater && resMovieTheater.dataValues) {
                let dataImage = data.listImage;

                let result = [];
                let resUpload = {};


                await Promise.all(dataImage.map(async item => {
                    let obj = {};
                    obj.movieTheaterId = resMovieTheater.dataValues.id;
                    obj.status = 1;
                    resUpload = await uploadCloud(item.image, item.fileName);
                    obj.url = resUpload.secure_url;
                    obj.public_id = resUpload.public_id;
                    result.push(obj);
                }))

                await db.ImageMovieTheater.bulkCreate(result);

            }

            resolve({
                errCode: 0,
                errMessage: 'OK'
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}

let updateMovieTheater = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let movieTheater = await db.MovieTheater.findOne({
                    where: { id: data.id },
                    raw: false,
                    nest: true
                })

                if (movieTheater) {

                    // Có truyền image //
                    if (data.listImage && data.listImage.length > 0) {
                        // upload cloud //

                        let dataImage = data.listImage;

                        let resUpload = {};

                        await Promise.all(dataImage.map(async item => {
                            if (item.image && item.fileName) {
                                let obj = {};
                                obj.movieTheaterId = +data.id;
                                obj.status = 1;
                                resUpload = await uploadCloud(item.image, item.fileName);

                                obj.url = resUpload.secure_url;
                                obj.public_id = resUpload.public_id;

                                await db.ImageMovieTheater.create(obj);
                            }
                        }))
                    }
                    movieTheater.tenRap = data.tenRap;
                    movieTheater.soDienThoai = data.soDienThoai;
                    movieTheater.address = data.address;
                    // movieTheater.userId = data.userId;
                    movieTheater.cityCode = data.cityCode;
                    movieTheater.districtCode = data.districtCode;
                    movieTheater.wardCode = data.wardCode;

                    await movieTheater.save();

                    resolve({
                        errCode: 0,
                        message: "Update MovieTheater Success"
                    });
                } else {
                    resolve({
                        errCode: -1,
                        message: "MovieTheater not found"
                    });
                }

            }


        } catch (e) {
            reject(e);
        }
    })
}

let getMovieTheaterById = (movieTheaterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let movieTheater = await db.MovieTheater.findOne({
                where: { id: movieTheaterId, isdelete: false },

                include: [

                    { model: db.ImageMovieTheater, as: 'MovieTheaterImage' },
                ],
                raw: false,
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: movieTheater
            });
        } catch (e) {
            reject(e);
        }
    })
}



let countTurnoverByMovieTheater = (movieTheaterId, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dateFormat = moment(new Date()).format('YYYY-MM-DD');

            let data2 = await db.MovieTheater.findAll({
                attributes:
                    ['id', 'MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.createdAt', db.sequelize.fn('SUM', db.sequelize.col('MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.price'))],

                where: {
                    [Op.and]: [
                        movieTheaterId &&
                        { id: { [Op.or]: [(movieTheaterId) ? +movieTheaterId : null, null] } },
                        { isdelete: false }
                    ]
                },
                include: [
                    {
                        model: db.Room, as: 'MovieTheaterRoom', required: true, include: [
                            {
                                model: db.Showtime, as: 'RoomShowTime', required: true, include: [
                                    {
                                        model: db.Ticket, as: 'TicketShowtime', required: true, include: {
                                            model: db.Booking, as: 'BookingTicket', required: true, where: {
                                                [Op.or]: [
                                                    !type &&
                                                    {
                                                        createdAt: {
                                                            [Op.gte]: Sequelize.literal("NOW() - (INTERVAL '6 MONTHS')"),
                                                        }
                                                    },
                                                    type &&
                                                    {
                                                        createdAt: db.sequelize.where(
                                                            db.sequelize.cast(db.sequelize.col("MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.createdAt"), "varchar"),
                                                            { [Op.iLike]: `%${dateFormat}%` }
                                                        ),
                                                    }
                                                ]

                                            }
                                        }
                                    }
                                ]
                            },
                        ],

                    },
                ],

                group: ['MovieTheater.id', 'MovieTheaterRoom.id',
                    'MovieTheaterRoom->RoomShowTime.id', 'MovieTheaterRoom->RoomShowTime->TicketShowtime.id',
                    'MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.id',

                ],

                raw: true,
                nest: true
            })

            data2 = Object.values(data2.reduce((acc, cur) => Object.assign(acc, { [cur.createdAt]: cur }), {}))

            let index = 0;
            const result = data2.reduce((r, { createdAt, sum }) => {
                let dateObj = new Date(createdAt);
                let monthyear = dateObj.toLocaleString("en-us", { month: "long", year: 'numeric' });
                if (!r[monthyear]) r[monthyear] = { monthyear, price: sum, id: index++ }
                else { r[monthyear].price += sum };
                return r;
            }, {})



            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: result
            });
        } catch (e) {
            reject(e);
        }
    })
}



let countTicketByMovieTheater = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dateFormat = null;

            if (!data.time)
                dateFormat = moment(new Date()).format('YYYY-MM-DD');
            else dateFormat = moment(new Date(+data.time)).format('YYYY-MM-DD');

            let data2 = await db.MovieTheater.findAll({

                where: {
                    [Op.and]: [
                        +data.movieTheaterId &&
                        { id: { [Op.or]: [(data.movieTheaterId) ? +data.movieTheaterId : null, null] } },
                        { isdelete: false }
                    ]

                },
                include: [
                    {
                        model: db.Room, as: 'MovieTheaterRoom', required: true, include: [
                            {
                                model: db.Showtime, as: 'RoomShowTime', required: true, include: [
                                    {
                                        model: db.Ticket, as: 'TicketShowtime', required: true, where: {
                                            [Op.and]: [
                                                dateFormat &&
                                                db.sequelize.where(
                                                    db.sequelize.cast(db.sequelize.col("MovieTheaterRoom->RoomShowTime->TicketShowtime.createdAt"), "varchar"),
                                                    { [Op.iLike]: `%${dateFormat}%` }
                                                ),
                                            ]
                                        }
                                    }]
                            },
                        ],

                    },

                ],

                raw: false,
                nest: true
            })


            let result = [];

            data2.map(item => {
                let obj = {};
                obj.id = item.id;
                obj.nameTheater = item.tenRap;
                obj.countTicket = item.MovieTheaterRoom[0].RoomShowTime[0].TicketShowtime.length;
                result.push(obj);
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: result
            });
        } catch (e) {
            reject(e);
        }
    })
}



let eachTheaterRevenue = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dateFormat = null;

            if (+data.type === 2)
                dateFormat = moment(new Date()).format('YYYY-MM-DD');
            else dateFormat = moment(new Date()).format('YYYY-MM');

            let data2 = await db.MovieTheater.findAll({
                attributes:
                    ['id', 'tenRap', 'MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.createdAt', db.sequelize.fn('SUM', db.sequelize.col('MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.price'))],

                where: {
                    [Op.and]: [
                        +data.movieTheaterId &&
                        { id: { [Op.or]: [(data.movieTheaterId) ? +data.movieTheaterId : null, null] } },
                        { isdelete: false }
                    ]

                },
                include: [
                    {
                        model: db.Room, as: 'MovieTheaterRoom', required: true, include: [
                            {
                                model: db.Showtime, as: 'RoomShowTime', required: true, include: [
                                    {
                                        model: db.Ticket, as: 'TicketShowtime', required: true, include: [
                                            {
                                                model: db.Booking, as: 'BookingTicket', where: {
                                                    [Op.or]: [
                                                        +data.type === 2 &&
                                                        {
                                                            createdAt: {
                                                                [Op.gte]: Sequelize.literal("NOW() - (INTERVAL '6 MONTHS')"),
                                                            }
                                                        },
                                                        +data.type === 1 &&
                                                        {
                                                            createdAt: {
                                                                [Op.gte]: moment().subtract(7, 'days').toDate()
                                                            }
                                                        }
                                                    ]

                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],

                    },

                ],

                group: ['MovieTheater.id', 'MovieTheaterRoom.id',
                    'MovieTheaterRoom->RoomShowTime.id', 'MovieTheaterRoom->RoomShowTime->TicketShowtime.id',
                    'MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.id'
                ],

                raw: true,
                nest: true
            })

            var helper = {};
            let finalRes = null;

            if (+data.type === 2) {

                // var uniqueArray = removeDuplicates(data2, "createdAt");

                // console.log('uniqueArray: ', uniqueArray)
                data2 = Object.values(data2.reduce((acc, cur) => Object.assign(acc, { [cur.createdAt]: cur }), {}))

                var result = data2.reduce(function (r, o) {
                    var key = moment(o.createdAt).format('MM-YYYY') + '-' + o.id;

                    if (!helper[key]) {
                        helper[key] = Object.assign({}, o); // create a copy of o
                        r.push(helper[key]);
                    } else {
                        helper[key].sum += o.sum;

                    }

                    return r;
                }, []);



                result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());


                finalRes = result.map((item) => {
                    item.createdAt = moment(item.createdAt).format('MM-YYYY')

                    return item;
                })
            } else {
                data2 = Object.values(data2.reduce((acc, cur) => Object.assign(acc, { [cur.createdAt]: cur }), {}))
                var result = data2.reduce(function (r, o) {
                    var key = moment(o.createdAt).format('DD-MM-YYYY') + '-' + o.id;

                    if (!helper[key]) {
                        helper[key] = Object.assign({}, o); // create a copy of o
                        r.push(helper[key]);
                    } else {
                        helper[key].sum += o.sum;

                    }

                    return r;
                }, []);


                result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                finalRes = result.map((item) => {
                    item.createdAt = moment(item.createdAt).format('DD-MM-YYYY')

                    return item;
                })
            }



            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: result
            });
        } catch (e) {
            reject(e);
        }
    })
}



let countRoomByMovieTheater = (movieTheaterId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let dataRoom = await db.Room.findAll({
                where: { movieTheaterId: movieTheaterId }
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: dataRoom.length
            });
        } catch (e) {
            reject(e);
        }
    })
}


let deleteMovieTheater = (id) => {
    return new Promise(async (resolve, reject) => {
        let movieTheater = await db.MovieTheater.findOne({
            where: { id: id },
            raw: false,
        });
        if (!movieTheater) {
            resolve({
                errCode: 2,
                errMessage: 'Rạp phim ko ton tai'
            })
        }


        // await db.MovieTheater.destroy({
        //     where: { id: id }
        // });

        movieTheater.isdelete = true;
        await movieTheater.save();

        resolve({
            errCode: 0,
            errMessage: "Delete MovieTheater ok"
        })
    })
}


let checkMerchantMovieTheater = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {

                let dataMerchant = [];
                if (data.movieTheaterId && data.roleId) {
                    dataMerchant = await db.MovieTheater.findOne({

                        include: [
                            {
                                model: db.Users, as: 'UserMovieTheater', required: true, where: {
                                    movietheaterid: +data.movieTheaterId,
                                    roleId: +data.roleId

                                }

                            },
                        ],

                        raw: false,
                        nest: true
                    });

                    if (!dataMerchant) {
                        let result = await db.MovieTheater.findOne({

                            where: {
                                isdelete: false,
                                id: data.movieTheaterId
                            },

                            raw: false,
                            nest: true
                        });

                        resolve({
                            errCode: 0,
                            errMessage: 'OK',
                            data: result
                        });
                        return
                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'OK',
                        data: null
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



let deleteImageMovieTheater = (id) => {

    return new Promise(async (resolve, reject) => {
        let imageMovieTheater = await db.ImageMovieTheater.findOne({
            where: { id: id }
        })
        if (!imageMovieTheater) {
            resolve({
                errCode: 2,
                errMessage: 'imageMovieTheater ko ton tai'
            })
        }

        if (imageMovieTheater.url && imageMovieTheater.public_id) {
            // Xóa hình cũ //
            await cloudinary.uploader.destroy(imageMovieTheater.public_id, { invalidate: true, resource_type: "raw" },
                function (err, result) { console.log(result) });
        }

        await db.ImageMovieTheater.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete image ok"
        })
    })
}


module.exports = {
    getAllMovieTheater,
    createNewMovieTheater,
    updateMovieTheater,
    getMovieTheaterById,
    deleteMovieTheater,
    deleteImageMovieTheater,
    checkMerchantMovieTheater,
    countTurnoverByMovieTheater,
    countRoomByMovieTheater,
    countTicketByMovieTheater,
    eachTheaterRevenue
}