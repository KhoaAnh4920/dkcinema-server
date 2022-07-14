import db from "../models/index";
require('dotenv').config();
var cloudinary = require('cloudinary').v2;
const Sequelize = require('sequelize');
import moment from 'moment';
const Op = Sequelize.Op;
var cron = require('node-cron');
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




let createNewVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = {};
            if (data.code) {
                // check if exists voucher//
                let voucher = await db.Voucher.findOne({
                    where: {
                        [Op.or]: [
                            {
                                code: {
                                    [Op.or]: [(data.code) ? data.code : null, null]
                                }
                            },
                        ]
                    },
                    raw: false,
                    nest: true
                });

                if (voucher) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Voucher already exists'
                    });
                    return
                }


                await db.Voucher.create({
                    code: data.code,
                    name: data.name,
                    discount: data.discount,
                    status: true,
                    condition: data.condition || null,
                    maxUses: data.maxUses || -1,
                    description: data.description || null,
                    timeStart: data.timeStart ? data.timeStart : null,
                    timeEnd: data.timeEnd ? data.timeEnd : null
                })
            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing code voucher'
                });
                return
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


let updateVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let result = {};
            if (data.id) {
                // check if exists voucher//
                let voucher = await db.Voucher.findOne({
                    where: {
                        [Op.or]: [
                            {
                                id: {
                                    [Op.or]: [(data.id) ? data.id : null, null]
                                }
                            },
                        ]
                    },
                    raw: false,
                    nest: true
                });

                if (voucher) {

                    voucher.name = data.name;
                    voucher.description = data.description;
                    voucher.discount = data.discount;
                    voucher.condition = data.condition;
                    voucher.maxUses = data.maxUses;
                    voucher.timeStart = (data.timeStart) ? data.timeStart : voucher.timeStart;
                    voucher.timeEnd = (data.timeEnd) ? data.timeEnd : voucher.timeEnd;

                    await voucher.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    });
                    return;

                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Voucher not found'
                    });
                    return;
                }

            } else {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing id voucher'
                });
                return;
            }




        } catch (e) {
            reject(e);
        }
    })
}


let getListVoucher = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {

                console.log(data);


                let dateFormat = moment(new Date(+data.timeStart)).format('YYYY-MM-DD');


                let listSchedule = await db.Voucher.findAll({
                    where: {
                        // ["premiereDate::timestamp"]: {
                        //     [Op.iLike]: `%${data.date}%`
                        // },
                        [Op.and]: [
                            data.date &&
                            db.sequelize.where(
                                db.sequelize.cast(db.sequelize.col("Voucher.timeStart"), "varchar"),
                                { [Op.iLike]: `%${dateFormat}%` }
                            ),
                            data.code &&
                            {
                                code: {
                                    [Op.or]: [(data.code) ? data.code : null, null]
                                }
                            },
                            data.name &&
                            {
                                name: {
                                    [Sequelize.Op.iLike]: `%${data.name}%`
                                }
                            },
                            data.status && {
                                status: {
                                    [Op.or]: [(data.status) ? data.status : null, null]
                                }
                            }
                        ]
                    },

                    order: [
                        ['id', 'DESC'],
                    ],
                    raw: true,
                    nest: true
                });

                console.log(data.type);

                console.log(moment().utcOffset(0).startOf('day').subtract(1, "days").format());
                // console.log("listSchedule: ", listSchedule);


                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listSchedule
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



let getVoucherById = (key) => {
    return new Promise(async (resolve, reject) => {
        try {

            let voucher = {};
            if (typeof (key) === 'number') {
                voucher = await db.Voucher.findOne({
                    where: {
                        [Op.or]: [
                            {
                                id: {
                                    [Op.or]: [(key) ? key : null, null]
                                }
                            },
                        ]
                    },


                    raw: false,
                    nest: true
                });
            } else {
                voucher = await db.Voucher.findOne({
                    where: {
                        [Op.or]: [
                            {
                                code: {
                                    [Op.or]: [(key) ? key : null, null]
                                }
                            }
                        ]
                    },


                    raw: false,
                    nest: true
                });
            }



            // console.log(schedule);

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: voucher
            });

        } catch (e) {
            reject(e);
        }
    })
}


let getVoucheryCustomer = (key) => {
    return new Promise(async (resolve, reject) => {
        try {

            let voucher = await db.Voucher.findOne({
                where: { code: key, status: true },
                raw: false,
                nest: true
            });

            if (voucher.maxUses === 0) {
                resolve({
                    errCode: -1,
                    errMessage: 'Expired voucher',
                });
            }

            // console.log(schedule);

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: voucher
            });

        } catch (e) {
            reject(e);
        }
    })
}




let updateStatusVoucher = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let voucher = await db.Voucher.findOne({
                    where: { id: data.id },
                    raw: false
                })

                let status = '';
                (+data.status === 1 || data.status === true) ? status = true : status = false


                voucher.status = status;
                await voucher.save();

                resolve({
                    errCode: 0,
                    message: "Update Status voucher Success"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}



let deleteVoucher = (id) => {
    return new Promise(async (resolve, reject) => {
        let voucher = await db.Voucher.findOne({
            where: { id: id }
        })
        if (!voucher) {
            resolve({
                errCode: 2,
                errMessage: 'Voucher not found'
            })
        }


        await db.Voucher.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete voucher ok"
        })
    })
}



// *	6	*	*	*
// */10 

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


var task = cron.schedule('* 6 * * *', async () => {
    console.log('running in 6h am');
    let dateToday = moment(new Date()).format('MM-DD');

    console.log('dateToday: ', dateToday)
    let data = await db.Users.findAll(
        {
            where: {
                [Op.and]: [
                    db.sequelize.where(
                        db.sequelize.cast(db.sequelize.col("Users.birthday"), "varchar"),
                        { [Op.iLike]: `%${dateToday}%` }
                    ),
                    { isActive: true },
                    { roleId: 4 }

                ]
            },
            raw: true,
            nest: true
        }

    )
    console.log('data: ', data);

    if (data && data.length > 0) {
        let mailist = [];
        await Promise.all(data.map(async (item, index) => {
            // get rank user //
            let customer = await db.Customer.findOne({
                where: { externalId: item.externalid },
                raw: true
            })

            let discount = 0;

            if (customer && customer.rankId) {
                if (customer.rankId === 1) {
                    discount = 10
                }
                if (customer.rankId === 2) {
                    discount = 25
                }
                if (customer.rankId === 3) {
                    discount = 50
                }
            }

            let voucherGif = 'DKBIRTHDAY' + getRandomInt(10000);
            await db.Voucher.create({
                code: voucherGif,
                discount: discount,
                status: 1,
                maxUses: 1,
                name: `Voucher gif birhday ${item.fullName}`,
                description: 'Hapby dob',
                timeStart: null,
                timeEnd: null,
            })

            // send mail 

            let obj = {};
            obj.mail = item.email;
            obj.data = { 'voucherCode': voucherGif, 'discountVoucher': discount }
            mailist.push(obj);
        }))

        console.log('maillist: ', mailist);

        emailService.sendEmailVoucherGif(mailist);
    }

});

task.start();



module.exports = {
    createNewVoucher,
    getListVoucher,
    getVoucherById,
    updateVoucher,
    updateStatusVoucher,
    deleteVoucher,
    getVoucheryCustomer
}

