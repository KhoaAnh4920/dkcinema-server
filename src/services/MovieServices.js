import db from "../models/index";
import bcrypt from 'bcryptjs';
require('dotenv').config();
var salt = bcrypt.genSaltSync(10);
var cloudinary = require('cloudinary').v2;
var jwt = require('jsonwebtoken');

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
                        console.log("Check resUpload: ", resUpload);
                        obj.url = resUpload.secure_url;
                        obj.public_id = resUpload.public_id;
                        obj.typeImage = item.typeImage;
                        result.push(obj);
                    }))

                    await db.ImageMovie.bulkCreate(result);

                    // Add type of movie //

                    await Promise.all(dataType.map(async item => {
                        await db.TypeOfMovie.create({
                            movieId: resMovie.dataValues.id,
                            typeId: +item
                        })
                    }))
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

                        await Promise.all(dataPoster.map(async item => {
                            if (item.image && item.fileName) {
                                let obj = {};
                                obj.movieId = +data.id;
                                obj.status = 1;
                                resUpload = await uploadCloud(item.image, item.fileName);

                                obj.url = resUpload.secure_url;
                                obj.public_id = resUpload.public_id;

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
                        console.log("Check item: ", item);
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
                    message: "Delete movie Success"
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
    console.log("Check query: ", query);
    const page = (query.page) ? +query.page : 1;
    const PerPage = (query.PerPage) ? +query.PerPage : 6;
    const skip = (page - 1) * PerPage;
    console.log("Check page: ", page);
    console.log("Check PerPage: ", PerPage);
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

            console.log(movie);

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

        console.log("Check imageMovie: ", imageMovie);

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



module.exports = {
    createNewMovie,
    getListMovie,
    updateStatusMovie,
    getMovieById,
    updateMovie,
    deleteImageMovie,
    deleteMovie,
    getMovieByStatus
}