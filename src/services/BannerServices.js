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
                    public_id: `image/Banner/${fName}`,
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




let createNewBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = {};
            if (data.image && data.fileName) {
                // upload cloud //
                result = await uploadCloud(data.image, data.fileName);
            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing image'
                }); // return 
            }

            await db.Banner.create({
                name: data.name,
                description: data.description,
                status: 1,
                url: (result && result.secure_url) ? result.secure_url : '',
                public_id_image: (result && result.public_id) ? result.public_id : '',
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

let getListBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log('data: ', data);
            let status = '';

            (+data.status === 1 || data.status === true) ? status = true : status = false

            let listBanner = await db.Banner.findAll({
                where: {
                    [Op.and]: [
                        data.status &&
                        {
                            status: {
                                [Op.or]: [(data.status) ? status : null, null]
                            }
                        },

                    ]
                },
                order: [
                    ['id', 'DESC'],
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: listBanner
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}


let getDetailBanner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataBanner = await db.Banner.findOne({

                where: { id: id },

                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: dataBanner
            });
        } catch (e) {
            reject(e);
        }
    })
}

let updateStatusBanner = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let banner = await db.Banner.findOne({
                    where: { id: data.id },
                    raw: false
                })

                let status = '';
                (+data.status === 1 || data.status === true) ? status = true : status = false


                banner.status = status;
                await banner.save();

                resolve({
                    errCode: 0,
                    message: "Update Status banner Success"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}



let updateBanner = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email //
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let banner = await db.Banner.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (banner) {
                    let result = {};

                    // Có truyền image //
                    if (data.image && data.fileName) {
                        if (banner.url && banner.public_id_image) // có lưu trong db //
                        {
                            // Xóa hình cũ //
                            await cloudinary.uploader.destroy(banner.public_id_image, { invalidate: true, resource_type: "raw" },
                                function (err, result) { console.log(result) });

                        }
                        // upload cloud //
                        result = await uploadCloud(data.image, data.fileName);


                    }

                    banner.name = data.name;
                    banner.description = data.description;


                    if (data.image && data.fileName) {
                        banner.url = result.secure_url;
                        banner.public_id_image = result.public_id;
                    }

                    await banner.save();

                    resolve({
                        errCode: 0,
                        message: "Update Banner Success"
                    });

                } else {
                    resolve({
                        errorCode: 1,
                        errMessage: "Banner not found"
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                }); // return 
            }

        } catch (e) {
            reject(e);
        }
    })
}

let deleteBanner = (id) => {
    return new Promise(async (resolve, reject) => {
        let banner = await db.Banner.findOne({
            where: { id: id }
        })
        if (!banner) {
            resolve({
                errCode: 2,
                errMessage: 'Banner not found'
            })
        }

        if (banner.image && banner.public_id_image) {
            // Xóa hình cũ //
            await cloudinary.uploader.destroy(banner.public_id_image, { invalidate: true, resource_type: "raw" },
                function (err, result) { console.log(result) });
        }

        await db.Banner.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete banner ok"
        })
    })
}







module.exports = {
    createNewBanner,
    getListBanner,
    getDetailBanner,
    updateStatusBanner,
    updateBanner,
    deleteBanner
}