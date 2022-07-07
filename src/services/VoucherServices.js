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




let createNewPVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = {};
            if (data.code) {
                // check if exists voucher//


                await db.Voucher.create({
                    code: data.code,
                    name: data.name,
                    discount: data.discount,
                    status: (data.status) ? true : false,
                    condition: data.condition,
                    maxUses: data.maxUses,
                    description: data.description,
                    timeStart: data.timeStart,
                    timeEnd: data.timeEnd
                })
            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing code voucher'
                }); // return 
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





module.exports = {
    createNewPVoucher,
}