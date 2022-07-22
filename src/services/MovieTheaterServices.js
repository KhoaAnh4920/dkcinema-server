import db from "../models/index";
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;




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
                    // { model: db.Users, as: 'UserMovieTheater' },
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
                // userId: data.userId,
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
                    // { model: db.Users, as: 'UserMovieTheater' },
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



let countTurnoverByMovieTheater = (movieTheaterId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let data2 = await db.MovieTheater.findAll({
                attributes:
                    ['id', 'MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.createdAt', db.sequelize.fn('SUM', db.sequelize.col('MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.price'))],

                where: {
                    id: movieTheaterId,
                    isdelete: false

                },
                include: [
                    {
                        model: db.Room, as: 'MovieTheaterRoom', required: true, include: [
                            {
                                model: db.Showtime, as: 'RoomShowTime', required: true, include: [
                                    {
                                        model: db.Ticket, as: 'TicketShowtime', required: true, include: {
                                            model: db.Booking, as: 'BookingTicket', required: true, where: {
                                                createdAt: {
                                                    [Op.gte]: Sequelize.literal("NOW() - (INTERVAL '6 MONTHS')"),
                                                }
                                            }
                                        }
                                    }]
                            },
                        ],

                    },


                ],

                group: ['MovieTheater.id', 'MovieTheaterRoom.id',
                    'MovieTheaterRoom->RoomShowTime.id', 'MovieTheaterRoom->RoomShowTime->TicketShowtime.id',
                    'MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.id',
                    // 'MONTH(MovieTheaterRoom->RoomShowTime->TicketShowtime->BookingTicket.createdAt)'
                ],

                raw: true,
                nest: true
            })




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
                data: Object.values(result).reverse()
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

                        console.log('result: ', result)

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


                    // dataMerchant = await db.Users.findOne({
                    //     where: {
                    //         [Op.and]: [
                    //             data.movieTheaterId &&
                    //             {
                    //                 movietheaterid: +data.movieTheaterId
                    //             },
                    //             data.roleId &&
                    //             {
                    //                 roleId: +data.roleId
                    //             },
                    //         ]
                    //     },

                    //     raw: false,
                    //     nest: true
                    // });
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

    console.log("Check publicImageId: ", id);

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

        console.log("Check imageMovieTheater: ", imageMovieTheater);

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
    countTurnoverByMovieTheater
}