import db from "../models/index";


let getAllMovieTheater = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let movieTheater = await db.MovieTheater.findAll({
                include: [
                    { model: db.Users, as: 'UserMovieTheater' },
                ],
                raw: true,
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
            // if (data.avatar && data.fileName) {
            //     // upload cloud //
            //     result = await uploadCloud(data.avatar, data.fileName);
            // } else {
            //     avatar = 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png';
            // }

            await db.MovieTheater.create({
                tenRap: data.tenRap,
                soDienThoai: data.soDienThoai,
                address: data.address,
                cityCode: data.cityCode,
                districtCode: data.districtCode,
                wardCode: data.wardCode,
                userId: data.userId,
            })

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
            // if (data.avatar && data.fileName) {
            //     // upload cloud //
            //     result = await uploadCloud(data.avatar, data.fileName);
            // } else {
            //     avatar = 'https://res.cloudinary.com/cdmedia/image/upload/v1646921892/image/avatar/Unknown_b4jgka.png';
            // }

            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let movieTheater = await db.MovieTheater.findOne({
                    where: { id: data.id },
                    raw: false
                })

                if(movieTheater){
                    movieTheater.tenRap = data.tenRap;
                    movieTheater.soDienThoai = data.soDienThoai;
                    movieTheater.address = data.address;
                    movieTheater.userId = data.userId;
                    movieTheater.cityCode = data.cityCode;
                    movieTheater.districtCode = data.districtCode;
                    movieTheater.wardCode = data.wardCode;

                    // if (data.avatar && data.fileName) {
                    //     user.avatar = result.secure_url;
                    //     user.public_id_image = result.public_id;
                    // }

                    await movieTheater.save();

                    resolve({
                        errCode: 0,
                        message: "Update MovieTheater Success"
                    });
                }else{

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
                where: { id: movieTheaterId },

                include: [
                    { model: db.Users, as: 'UserMovieTheater' },
                ],
                raw: true,
                nest: true
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

let deleteMovieTheater = (id) => {
    return new Promise(async (resolve, reject) => {
        let movieTheater = await db.MovieTheater.findOne({
            where: { id: id },
        });
        if (!movieTheater) {
            resolve({
                errCode: 2,
                errMessage: 'Rạp phim ko ton tai'
            })
        }

        // if (user.avatar && user.public_id_image) {
        //     // Xóa hình cũ //
        //     await cloudinary.uploader.destroy(user.public_id_image, { invalidate: true, resource_type: "raw" },
        //         function (err, result) { console.log(result) });
        // }

        await db.MovieTheater.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete MovieTheater ok"
        })
    })
}

module.exports = {
    getAllMovieTheater,
    createNewMovieTheater,
    updateMovieTheater,
    getMovieTheaterById,
    deleteMovieTheater
}