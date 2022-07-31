import db from "../models/index";
import bcrypt from 'bcryptjs';
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';
import emailService from '../services/emailService';



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
                    public_id: `image/Films/${fName}`,
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


let createNewMovie = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (data) {
                const resMovie = await db.Movie.create({
                    name: data.name,
                    transName: data.transName || '',
                    country: data.country,
                    duration: data.duration,
                    description: data.description,
                    brand: data.brand,
                    director: data.director,
                    cast: data.cast,
                    status: data.status,
                    releaseTime: data.releaseTime,
                    language: data.language,
                    url: data.url,
                    isDelete: false
                });

                if (resMovie && resMovie.dataValues) {
                    let dataPoster = data.poster;
                    let dataType = data.typeMovie
                    let result = [];
                    let resUpload = {};



                    await Promise.all(dataPoster.map(async item => {
                        let obj = {};
                        obj.movieId = resMovie.dataValues.id;
                        obj.status = 1;
                        resUpload = await uploadCloud(item.image, item.fileName);

                        obj.url = resUpload.secure_url;
                        obj.public_id = resUpload.public_id;
                        obj.typeImage = item.typeImage;
                        result.push(obj);
                    }))

                    await db.ImageMovie.bulkCreate(result);

                    // Add type of movie //

                    let str = '';
                    await Promise.all(dataType.map(async item => {
                        await db.TypeOfMovie.create({
                            movieId: resMovie.dataValues.id,
                            typeId: +item
                        })

                        let type = await db.TypeMovie.findOne({
                            where: { id: +item },

                            raw: false
                        })

                        // console.log('type: ', type);

                        str += type.name + ' •'

                    }))

                    str = str.substring(0, str.length - 1);

                    console.log('str: ', str);



                    let dataSend = data;

                    dataSend.poster = result.filter(item => item.typeImage === 1)
                    dataSend.typeMovie = str


                    await sendMailCustomerTypeMovie(dataType, dataSend);
                }
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

let sendMailCustomerTypeMovie = async (dataType, dataMovie) => {

    // let dataType = [11, 12];
    //movieId: 28,
    let result = [];
    await Promise.all(dataType.map(async item => {
        // Get top customer //
        let dataCus = await db.TypeMovieCustomer.findAll({
            where: {
                typeId: +item
            },
            include: [
                {
                    model: db.Customer, as: 'Customer'
                },
            ],
            limit: 2,
            order: [['amount', 'DESC']],

            raw: true,
            nest: true
        })

        console.log('dataCus: ', dataCus)
        dataCus.map(item => {
            if (item.Customer.email)
                result.push(item.Customer.email)
        })

    }))

    if (result.length > 0) {
        // Send mail //
        emailService.sendEmailTypeMovie(result, dataMovie);

        return result;
    }
    return;


};


let updateMovie = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            }
            else {
                let movie = await db.Movie.findOne({
                    where: { id: +data.id },
                    include: [
                        { model: db.ImageMovie, as: 'ImageOfMovie' },
                        { model: db.TypeMovie, as: 'MovieOfType' },
                    ],
                    raw: false,
                    nest: true
                })
                if (movie) {

                    let dataType = data.typeMovie;

                    console.log(dataType);

                    // Có truyền image //
                    if (data.poster && data.poster.length > 0) {
                        // upload cloud //

                        let dataPoster = data.poster;

                        let resUpload = {};

                        console.log('dataPoster: ', dataPoster)

                        await Promise.all(dataPoster.map(async item => {
                            if (item.image && item.fileName) {
                                let obj = {};
                                obj.movieId = +data.id;
                                obj.status = 1;
                                resUpload = await uploadCloud(item.image, item.fileName);

                                obj.url = resUpload.secure_url;
                                obj.public_id = resUpload.public_id;
                                obj.typeImage = item.typeImage;

                                await db.ImageMovie.create(obj);
                            }
                        }))
                    }

                    movie.name = data.name;
                    movie.transName = data.transName;
                    movie.country = data.country;
                    movie.duration = data.duration;
                    movie.description = data.description;
                    movie.brand = data.brand;
                    movie.director = data.director;
                    movie.cast = data.cast;
                    movie.status = data.status;
                    movie.releaseTime = data.releaseTime;
                    movie.language = data.language;
                    movie.url = data.url;


                    await movie.save();

                    // Add type of movie //


                    // Delete type movie old //
                    await db.TypeOfMovie.destroy({
                        where: { movieId: +data.id }
                    });

                    console.log("OK");
                    await Promise.all(dataType.map(async item => {
                        // console.log("Check item: ", item);
                        await db.TypeOfMovie.create({
                            movieId: +data.id,
                            typeId: +item.id
                        })
                    }))

                    resolve({
                        errCode: 0,
                        errMessage: "Update movie Success"
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}



let getListMovie = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataMovie = await db.Movie.findAll({
                include: [
                    { model: db.ImageMovie, as: 'ImageOfMovie' },
                ],
                where: { isDelete: false },
                order: [
                    ['id', 'DESC'],
                ],
                raw: false,
                nest: true
            });
            resolve(dataMovie);
        } catch (e) {
            reject(e);
        }
    })
}


let countTicket = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataTicket = await db.Ticket.findAll({
                attributes: ['TicketShowtime->ShowtimeMovie.id', [Sequelize.fn('COUNT', Sequelize.col('Ticket.id')), 'TicketCount']],

                include: [

                    {
                        model: db.Showtime, as: 'TicketShowtime', required: true, include: [{ model: db.Movie, as: 'ShowtimeMovie', required: true, where: { status: 1 } }]
                    },
                ],
                group: ['TicketShowtime->ShowtimeMovie.id', 'TicketShowtime.id'],

                raw: true,
                nest: true
            });

            // console.log('dataTicket: ', dataTicket)


            if (dataTicket) {
                let result = []
                let res = dataTicket.map((item, index) => {
                    let obj = {};
                    obj.id = index;
                    obj.nameMovie = item.TicketShowtime.ShowtimeMovie.name;
                    obj.ScheduleId = item.TicketShowtime.id
                    obj.movieId = item.TicketShowtime.ShowtimeMovie.id;
                    obj.count = +item.TicketCount
                    result.push(obj);
                })

                // console.log('result: ', result);

                var result2 = [];
                result.reduce(function (res, value) {
                    // console.log('res: ', res);
                    // console.log('value: ', value);

                    if (!res[value.movieId]) {
                        res[value.movieId] = { id: value.movieId, count: 0, nameMovie: value.nameMovie };
                        result2.push(res[value.movieId])
                    }
                    res[value.movieId].count += value.count;
                    return res;
                }, {});

                // console.log(result2)

                resolve(result2);

            } else {
                resolve([]);
            }


        } catch (e) {
            reject(e);
        }
    })
}


let countBookingTypeOfMovie = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataTicket = await db.TypeMovieCustomer.findAll({
                attributes: ['TypeMovieCustomer.id', [Sequelize.fn('sum', Sequelize.col('TypeMovieCustomer.amount')), 'BookingCount']],

                include: [
                    {
                        model: db.TypeMovie, as: 'TypeMovie', required: true
                    },
                ],
                group: ['TypeMovieCustomer.id', 'TypeMovie.id'],

                raw: true,
                nest: true
            });

            if (dataTicket) {
                let result = []
                let res = dataTicket.map((item, index) => {
                    let obj = {};
                    obj.id = index;
                    obj.nameType = item.TypeMovie.name;
                    obj.typeId = item.TypeMovie.id;
                    obj.count = +item.BookingCount
                    result.push(obj);
                })

                var result2 = [];
                result.reduce(function (res, value) {


                    if (!res[value.typeId]) {
                        res[value.typeId] = { id: value.typeId, count: 0, nameType: value.nameType };
                        result2.push(res[value.typeId])
                    }
                    res[value.typeId].count += value.count;
                    return res;
                }, {});


                resolve(result2);

            } else {
                resolve([]);
            }


        } catch (e) {
            reject(e);
        }
    })
}



let getMovieRevenue = (data) => {
    return new Promise(async (resolve, reject) => {

        let dateFormat = null;
        if (data.type)
            dateFormat = moment(new Date()).format('YYYY-MM-DD');

        try {
            let dataTicket = await db.Ticket.findAll({
                attributes: ['TicketShowtime->ShowtimeMovie.id', [Sequelize.fn('sum', Sequelize.col('BookingTicket.price')), 'SalesCount']],

                include: [

                    {
                        model: db.Showtime, as: 'TicketShowtime', required: true, include: [
                            { model: db.Movie, as: 'ShowtimeMovie', required: true, where: { status: 1 } },
                        ]
                    },
                    {
                        model: db.Booking, as: 'BookingTicket', where: {
                            [Op.and]: [
                                dateFormat &&
                                db.sequelize.where(
                                    db.sequelize.cast(db.sequelize.col("BookingTicket.createdAt"), "varchar"),
                                    { [Op.iLike]: `%${dateFormat}%` }
                                ),
                            ]
                        }
                    }
                ],
                group: ['TicketShowtime->ShowtimeMovie.id', 'TicketShowtime.id', 'BookingTicket.id'],


                raw: true,
                nest: true
            });

            // console.log('dataTicket: ', dataTicket)


            if (dataTicket) {
                let result = []
                let res = dataTicket.map((item, index) => {
                    let obj = {};
                    obj.id = index;
                    obj.nameMovie = item.TicketShowtime.ShowtimeMovie.name;
                    obj.ScheduleId = item.TicketShowtime.id
                    obj.movieId = item.TicketShowtime.ShowtimeMovie.id;
                    obj.sum = +item.SalesCount
                    result.push(obj);
                })

                console.log('result: ', result);

                var result2 = [];
                result.reduce(function (res, value) {
                    // console.log('res: ', res);
                    // console.log('value: ', value);

                    if (!res[value.movieId]) {
                        res[value.movieId] = { id: value.movieId, sum: 0, nameMovie: value.nameMovie };
                        result2.push(res[value.movieId])
                    }
                    res[value.movieId].sum += value.sum;
                    return res;
                }, {});

                // console.log(result2)

                resolve(result2);

            } else {
                resolve([]);
            }


        } catch (e) {
            reject(e);
        }
    })
}


let salesTicket = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dateFormat = moment(new Date()).format('YYYY-MM-DD');
            let dataTicket = await db.Ticket.findAll({

                include: [

                    {
                        model: db.Showtime, as: 'TicketShowtime', required: true, include: [{ model: db.Movie, as: 'ShowtimeMovie', required: true, where: { status: 1 } }]
                    },
                ],

                where: {
                    [Op.and]: [
                        dateFormat &&
                        db.sequelize.where(
                            db.sequelize.cast(db.sequelize.col("Ticket.createdAt"), "varchar"),
                            { [Op.iLike]: `%${dateFormat}%` }
                        ),
                    ]
                },

                raw: true,
                nest: true
            });

            console.log('dataTicket: ', dataTicket)


            if (dataTicket) {
                // let result = []
                // let res = dataTicket.map((item, index) => {
                //     let obj = {};
                //     obj.id = index;
                //     obj.nameMovie = item.TicketShowtime.ShowtimeMovie.name;
                //     obj.ScheduleId = item.TicketShowtime.id
                //     obj.movieId = item.TicketShowtime.ShowtimeMovie.id;
                //     obj.count = +item.TicketCount
                //     result.push(obj);
                // })

                // // console.log('result: ', result);

                // var result2 = [];
                // result.reduce(function (res, value) {
                //     // console.log('res: ', res);
                //     // console.log('value: ', value);

                //     if (!res[value.movieId]) {
                //         res[value.movieId] = { id: value.movieId, count: 0, nameMovie: value.nameMovie };
                //         result2.push(res[value.movieId])
                //     }
                //     res[value.movieId].count += value.count;
                //     return res;
                // }, {});

                // console.log(result2)

                resolve(dataTicket);

            } else {
                resolve([]);
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getMovieByKeyword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let listMovie = [];

                if (data.kw) {
                    let kw = `%${data.kw}%`
                    listMovie = await db.Movie.findAll({
                        where: {
                            [Op.or]: [
                                {
                                    name: {
                                        [Sequelize.Op.iLike]: kw
                                    }
                                },
                                {
                                    transName: {
                                        [Sequelize.Op.iLike]: data.kw
                                    }
                                },
                                {
                                    description: {
                                        [Sequelize.Op.iLike]: data.kw
                                    }
                                },


                            ]
                        },
                        include: [
                            { model: db.ImageMovie, as: 'ImageOfMovie' },
                            { model: db.TypeMovie, as: 'MovieOfType' },
                        ],
                        limit: 10,
                        order: [
                            ['id', 'DESC'],
                        ],
                        raw: false,
                        nest: true
                    });
                } else {
                    listMovie = await db.Movie.findAll({

                        include: [
                            { model: db.ImageMovie, as: 'ImageOfMovie' },
                            { model: db.TypeMovie, as: 'MovieOfType' },
                        ],
                        order: [
                            ['id', 'DESC'],
                        ],
                        limit: 10,
                        raw: false,
                        nest: true
                    });
                }

                // console.log('listMovie: ', listMovie)

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listMovie
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

let voteNewsRatingMovie = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (data.rating) {

                let check = await db.Vote_Movie.findOne({
                    where: { cusId: data.cusId, movieId: data.movieId }
                })
                console.log(check);
                if (!check) {
                    await db.Vote_Movie.create({
                        rating: +data.rating,
                        cusId: data.cusId,
                        movieId: data.movieId,
                    });
                    // update rating news //
                    let voteFive = await db.Vote_Movie.count({ where: { rating: 5, movieId: data.movieId } });
                    let voteFour = await db.Vote_Movie.count({ where: { rating: 4, movieId: data.movieId } });
                    let voteThree = await db.Vote_Movie.count({ where: { rating: 3, movieId: data.movieId } });
                    let voteTwo = await db.Vote_Movie.count({ where: { rating: 2, movieId: data.movieId } });
                    let voteOne = await db.Vote_Movie.count({ where: { rating: 1, movieId: data.movieId } });

                    // console.log('voteFive: ', voteFive);
                    // console.log('voteFour: ', voteFour);
                    // console.log('voteThree: ', voteThree);
                    // console.log('voteTwo: ', voteTwo);
                    // console.log('voteOne: ', voteOne);

                    // (5*252 + 4*124 + 3*40 + 2*29 + 1*33) / (252+124+40+29+33) = 4.11 and change

                    let calRating = (5 * voteFive + 4 * voteFour + 3 * voteThree + 2 * voteTwo + 1 * voteOne) / (voteFive + voteFour + voteThree + voteTwo + voteOne);

                    console.log('calRating: ', calRating);

                    let movieData = await db.Movie.findOne({
                        where: { id: data.movieId },
                        raw: false
                    })

                    if (movieData) {
                        movieData.rating = calRating;
                        movieData.save();
                    }
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'You has already vote'
                    }); // return 
                    return;
                }


                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                }); // return 
                return;

            } else {

                resolve({
                    errCode: -1,
                    errMessage: 'Missing rating'
                }); // return 
            }


        } catch (e) {
            reject(e);
        }
    })
}

let updateStatusMovie = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let movie = await db.Movie.findOne({
                    where: { id: data.id },
                    raw: false
                })

                movie.status = (data.status) ? 1 : 0;
                await movie.save();

                resolve({
                    errCode: 0,
                    message: "Update Status movie Success"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}


let deleteMovie = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let movie = await db.Movie.findOne({
                    where: { id: data.id },
                    raw: false,
                    nest: true
                })

                movie.isDelete = true;
                await movie.save();

                resolve({
                    errCode: 0,
                    errMessage: "Delete movie Success"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getMovieById = (movieId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(movieId);
            let movie = await db.Movie.findOne({
                where: { id: movieId, isDelete: false },
                include: [
                    { model: db.ImageMovie, as: 'ImageOfMovie' },
                    { model: db.TypeMovie, as: 'MovieOfType' },
                ],
                raw: false,
            });

            console.log(movie);

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: movie
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getMovieByStatus = (query) => {
    const page = (query.page) ? +query.page : 1;
    const PerPage = (query.PerPage) ? +query.PerPage : 6;
    const skip = (page - 1) * PerPage;
    // console.log("Check page: ", page);
    // console.log("Check PerPage: ", PerPage);
    return new Promise(async (resolve, reject) => {
        try {
            let total = await db.Movie.count({ where: { status: +query.status, isDelete: false } });
            let movie = await db.Movie.findAll({
                offset: skip,
                limit: PerPage,
                where: { status: +query.status, isDelete: false },
                include: [
                    { model: db.ImageMovie, as: 'ImageOfMovie' },
                    { model: db.TypeMovie, as: 'MovieOfType' },
                ],
                order: [
                    ['id', 'DESC'],
                ],
                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: movie,
                totalData: total
            });
        } catch (e) {
            reject(e);
        }
    })
}


let deleteImageMovie = (id) => {

    console.log("Check publicImageId: ", id);

    return new Promise(async (resolve, reject) => {
        let imageMovie = await db.ImageMovie.findOne({
            where: { id: id }
        })
        if (!imageMovie) {
            resolve({
                errCode: 2,
                errMessage: 'Image Movie not found'
            })
        }


        if (imageMovie.url && imageMovie.public_id) {
            // Xóa hình cũ //
            await cloudinary.uploader.destroy(imageMovie.public_id, { invalidate: true, resource_type: "raw" },
                function (err, result) { console.log(result) });
        }

        await db.ImageMovie.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete image ok"
        })
    })
}





let testGetCustomerTypeMovie = async (req) => {

    let dataType = [11, 12];
    //movieId: 28,
    let result = [];
    await Promise.all(dataType.map(async item => {
        // Get top customer //
        let dataCus = await db.TypeMovieCustomer.findAll({
            where: {
                typeId: item
            },
            include: [
                {
                    model: db.Customer, as: 'Customer'
                },
            ],
            limit: 2,
            order: [['amount', 'DESC']],

            raw: true,
            nest: true
        })

        console.log('dataCus: ', dataCus)
        dataCus.map(item => {
            if (item.Customer.email)
                result.push(item.Customer.email)
        })

    }))

    // Send mail //
    emailService.sendEmailTypeMovie(result, 'Hmm');

    return result;
};



module.exports = {
    createNewMovie,
    getListMovie,
    updateStatusMovie,
    getMovieById,
    updateMovie,
    deleteImageMovie,
    deleteMovie,
    getMovieByStatus,
    getMovieByKeyword,
    voteNewsRatingMovie,
    countTicket,
    salesTicket,
    testGetCustomerTypeMovie,
    getMovieRevenue,
    countBookingTypeOfMovie
}