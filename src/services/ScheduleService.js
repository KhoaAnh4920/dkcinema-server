import db from "../models/index";
import moment from 'moment';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');



let createNewScheduleMovie = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (data) {
                let newDatePremier = new Date(+data.premiereDate);
                let newDateStartTime = new Date(+data.startTime);

                let test = moment(newDatePremier).format("YYYY-MM-DD");
                let test2 = moment(newDateStartTime).format("HH:mm");
                console.log(test);
                console.log("test 2: ", test2);


                // let checkStartTimeData = moment(data.startTime).format("DD/MM/YYYY HH:mm:ss");
                // let checkEndTimeData = moment(data.endTime).format("DD/MM/YYYY HH:mm:ss");


                // var ms = moment(checkEndTimeData, "DD/MM/YYYY HH:mm:ss").diff(moment(checkStartTimeData, "DD/MM/YYYY HH:mm:ss"));
                // var d = moment.duration(ms);

                // console.log("Check d: ", d.hours());
                // console.log("Check d: ", d.minutes());


                // let checkData = await db.Showtime.findOne({
                //     where: { startTime: data.startTime, premiereDate: data.premiereDate }
                // })

                let checkData = await db.sequelize.query(
                    'SELECT * FROM "Showtime" WHERE CAST("startTime" AS VARCHAR) LIKE :startTime AND CAST("premiereDate" AS VARCHAR) LIKE :premiereDate',
                    {
                        replacements: { premiereDate: `%${test}%`, startTime: `${test2}` },
                        type: QueryTypes.SELECT
                    }
                );



                if (checkData.length > 0) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Schedule already exists !!'
                    }); // return 
                    return;
                }

                // Get list schedule for day //
                let getDay = moment(data.startTime).format("YYYY-MM-DD");
                console.log("Check getDay: ", getDay);

                console.log("Check payload: ", data);

                let listSchedule = await db.sequelize.query(
                    'SELECT * FROM "Showtime" WHERE "Showtime"."roomId" = :roomId AND CAST("premiereDate" AS VARCHAR) LIKE :premiereDate',
                    {
                        replacements: { premiereDate: `%${getDay}%`, roomId: data.roomId },
                        type: QueryTypes.SELECT
                    }
                );

                console.log("listSchedule: ", listSchedule);



                if (listSchedule && listSchedule.length > 0) {

                    let checkFlag = false;
                    await Promise.all(listSchedule.map((item, index) => {
                        let currentStartTime = moment(data.startTime).format("HH");
                        let checkStartTimeData = moment(item.startTime).format("HH");
                        let checkEndTimeData = moment(item.endTime).format("HH");
                        if (+currentStartTime > +checkStartTimeData && +currentStartTime < +checkEndTimeData) {
                            console.log("Co chay")
                            // resolve({
                            //     errCode: 1,
                            //     errMessage: 'Invalid data'
                            // });
                            checkFlag = true;
                            return;
                        }
                        if (currentStartTime < checkStartTimeData) {
                            console.log("Co chay");
                            checkFlag = true;
                            // resolve({
                            //     errCode: 1,
                            //     errMessage: 'Invalid data'
                            // });
                            return;
                        }
                    }))
                    if (checkFlag) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Invalid data'
                        });
                        return;
                    }



                    console.log("Ko break");


                    let lastSchedule = listSchedule[listSchedule.length - 1];

                    console.log("lastSchedule: ", lastSchedule);

                    var start = moment(data.startTime);
                    console.log("Check start: ", start);
                    var end = moment(lastSchedule.endTime); //2021-12-27T13:15:00.000Z => 20
                    console.log("Check end: ", end);
                    var duration = moment.duration(start.diff(end))

                    console.log("Check hours: ", duration.asHours());
                    console.log("Check asMinutes: ", duration.asMinutes());
                    if (Math.round(duration.asHours()) > 0 || (Math.round(duration.asHours()) === 0 && Math.round(duration.asMinutes()) > 15)) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Break time should not exceed 15 minutes'
                        });
                        return;
                    }
                    else {
                        db.Showtime.create({
                            movieId: data.movieId,
                            roomId: data.roomId,
                            premiereDate: data.premiereDate,
                            startTime: data.startTime,
                            endTime: data.endTime
                        })
                    }


                } else {
                    db.Showtime.create({
                        movieId: data.movieId,
                        roomId: data.roomId,
                        premiereDate: data.premiereDate,
                        startTime: data.startTime,
                        endTime: data.endTime
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                });
                return;
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


let getScheduleByDate = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {

                console.log(typeof (data.date));

                // var date_not_formatted = new Date(+data.date);

                // console.log(date_not_formatted);

                let dateFormat = moment(new Date(+data.date)).format('YYYY-MM-DD');

                console.log(dateFormat);

                let listSchedule = await db.Showtime.findAll({
                    where: {
                        // ["premiereDate::timestamp"]: {
                        //     [Op.iLike]: `%${data.date}%`
                        // },
                        [Op.and]: [
                            data.date &&
                            db.sequelize.where(
                                db.sequelize.cast(db.sequelize.col("Showtime.premiereDate"), "varchar"),
                                { [Op.iLike]: `%${dateFormat}%` }
                            ),
                            data.roomId &&
                            {
                                roomId: {
                                    [Op.or]: [(data.roomId) ? data.roomId : null, null]
                                }
                            },
                            data.movieId &&
                            {
                                movieId: {
                                    [Op.or]: [(data.movieId) ? data.movieId : null, null]
                                }
                            }
                        ]
                    },
                    include: [
                        { model: db.Movie, as: 'ShowtimeMovie' },
                        { model: db.Room, as: 'RoomShowTime' },
                    ],
                    order: [
                        ['id', 'DESC'],
                    ],
                    raw: true,
                    nest: true
                });




                // let test = 'SELECT "Showtime".*, "Movie".id AS "MovieID", "Movie"."name"  FROM "Showtime" JOIN "Movie" ON "Showtime"."movieId" = "Movie".id WHERE CAST("premiereDate" AS VARCHAR) LIKE :premiereDate';

                // if (data.roomId) {
                //     test += ' AND "Showtime"."roomId" = :roomId';
                // }
                // if (data.movieId) {
                //     test += ' AND "Showtime"."movieId" = :movieId';
                // }
                // let listSchedule = await db.sequelize.query(
                //     test,
                //     {
                //         replacements: { premiereDate: `%${data.date}%`, roomId: data.roomId, movieId: data.movieId },
                //         type: QueryTypes.SELECT
                //     }
                // );
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

let deleteSchedule = (id) => {
    return new Promise(async (resolve, reject) => {
        let schedule = await db.Showtime.findOne({
            where: { id: id }
        })
        if (!schedule) {
            resolve({
                errCode: 2,
                errMessage: 'Schedule not found'
            })
        }

        await db.Showtime.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete Schedule ok"
        })
    })
}



module.exports = {
    createNewScheduleMovie,
    getScheduleByDate,
    deleteSchedule
}


