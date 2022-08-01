import db from "../models/index";
require('dotenv').config();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';









let getListFeedback = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let checkNaN = isNaN(+data.key);
            let dateFormatStart = null;
            let dateFormatEnd = null;

            if (data.startTime) {
                dateFormatStart = moment(new Date(+data.startTime)).format('YYYY-MM-DD');
            }
            if (data.endTime) {
                dateFormatEnd = moment(new Date(+data.endTime)).format('YYYY-MM-DD');
            }


            let listFeed = [];
            if (Object.keys(data).length === 0) {
                listFeed = await db.Feedback.findAll({
                    include: [
                        {
                            model: db.Customer, as: 'CustomerFeedback',
                        },
                    ],

                    order: [
                        ['id', 'DESC'],
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: listFeed
                });
                return;
            }

            listFeed = await db.Feedback.findAll({
                where: {
                    [Op.or]: [
                        data.key && !checkNaN &&
                        {
                            id: data.key
                        },
                        data.key && checkNaN &&
                        {
                            fullName: {
                                [Sequelize.Op.iLike]: `%${data.key}%`
                            }
                        },
                        (dateFormatStart || dateFormatEnd) &&

                        db.sequelize.where(
                            db.sequelize.cast(db.sequelize.col("Feedback.createdAt"), "varchar"),
                            { [Op.gte]: `%${dateFormatStart}%` },
                            { [Op.lte]: `%${dateFormatEnd}%` }
                        ),



                    ]
                },
                include: [
                    {
                        model: db.Customer, as: 'CustomerFeedback',
                    },
                ],

                order: [
                    ['id', 'DESC'],
                ],
                raw: false,
                nest: true
            })

            //    console.log('listFeed: ', listFeed)

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: listFeed
            }); // return 


        } catch (e) {
            reject(e);
        }
    })
}




let getDetailFeedback = (feedbackId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let feedback = await db.Feedback.findOne({
                where: { id: feedbackId },

                include: [
                    {
                        model: db.Customer, as: 'CustomerFeedback',
                    },
                ],
                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: feedback
            });
        } catch (e) {
            reject(e);
        }
    })
}




module.exports = {
    getListFeedback,
    getDetailFeedback
}