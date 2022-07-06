import db from "../models/index";

let createNewRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('data: ', data);
            if (data) {
                let existsName = await db.Room.findOne({
                    where: {
                        name: data.name,
                        movieTheaterId: data.movieTheaterId
                    }
                })
                if (existsName) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Name room is exists'
                    }); // return
                }



                await db.Room.create({
                    name: data.name,
                    numberOfColumn: data.numberOfColumn,
                    numberOfRow: data.numberOfRow,
                    movieTheaterId: data.movieTheaterId
                }).then(function (x) {
                    if (x.id) {
                        // insert seet in room //
                        let dataSeet = data.seets;

                        if (dataSeet) {
                            dataSeet.map(item => {
                                item.posOfRow.map(y => {
                                    let radCode = 'Seet ' + Math.round(Math.random() * 400);
                                    db.Seet.create({
                                        codeSeet: radCode,
                                        posOfColumn: item.posOfColumn,
                                        posOfRow: y.pos,
                                        roomId: x.id,
                                        typeId: y.typeId
                                    })
                                })
                            })
                        }
                    }
                });
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




let updateRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let room = await db.Room.findOne({
                    where: { id: data.id },
                    raw: false
                })

                if (data.listSeetChangeType && data.listSeetChangeType.length > 0) {
                    await Promise.all(data.listSeetChangeType.map(async (item, index) => {

                        let res = await db.Seet.update({
                            // your new row data here
                            typeId: item.posOfRow.typeId
                        },
                            { where: { roomId: data.id, posOfColumn: item.posOfColumn, posOfRow: item.posOfRow.pos } }
                        );
                    }))

                }

                if (room) {
                    let existsName = await db.Room.findAll({
                        where: {
                            name: data.name
                        }
                    })

                    let checkName = existsName.some(item => item.id !== data.id);

                    if (checkName) {
                        resolve({
                            errCode: -1,
                            errMessage: 'Name room is exists'
                        });
                        return;
                    }

                    room.name = data.name;
                    room.numberOfColumn = data.numberOfColumn;
                    room.numberOfRow = data.numberOfRow;
                    room.movieTheaterId = data.movieTheaterId;


                    await room.save().then(function (x) {
                        console.log("Check x: ", x);
                        let dataSeet = data.seets;

                        console.log("Check dataSeet: ", dataSeet);

                        if (dataSeet && dataSeet.length > 0) {
                            dataSeet.map(item => {
                                item.posOfRow.map(y => {
                                    let radCode = 'Seet ' + Math.round(Math.random() * 400);
                                    db.Seet.create({
                                        codeSeet: radCode,
                                        posOfColumn: item.posOfColumn,
                                        posOfRow: y.pos,
                                        roomId: data.id,
                                        typeId: y.typeId
                                    })
                                })
                            })
                        }

                    });

                    if (data.listSeetChangeType && data.listSeetChangeType.length > 0) {
                        await Promise.all(data.listSeetChangeType.map(async (item, index) => {
                            console.log("Check item: ", item);
                            let res = await db.Seet.update({
                                // your new row data here
                                typeId: item.posOfRow.typeId
                            },
                                { where: { roomId: data.id, posOfColumn: item.posOfColumn, posOfRow: item.posOfRow.pos } }
                            );

                            console.log(res);
                        }))


                    }

                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    }); // return 


                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Room not found'
                    }); // return 
                }


            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params'
                }); // return 
            }

        } catch (e) {
            reject(e);
        }
    })
}


let getAllRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let room = await db.Room.findAll({
                include: [
                    { model: db.MovieTheater, as: 'MovieTheaterRoom' },
                    { model: db.Seet, as: 'RoomSeet' }
                ],
                where: {
                    movieTheaterId: data.movieTheaterId || 1
                },
                order: [
                    ['id', 'DESC'],
                ],
                raw: false,
                nest: true
            });

            resolve(room);
        } catch (e) {
            reject(e);
        }
    })
}


let getRoomById = (roomId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let roomData = await db.Room.findOne({
                include: [
                    { model: db.MovieTheater, as: 'MovieTheaterRoom' },
                    { model: db.Seet, as: 'RoomSeet' }
                ],
                where: { id: roomId },

                raw: false,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: roomData
            });
        } catch (e) {
            reject(e);
        }
    })
}


let deleteRoom = (id) => {
    return new Promise(async (resolve, reject) => {
        let room = await db.Room.findOne({
            where: { id: id }
        })
        if (!room) {
            resolve({
                errCode: 2,
                errMessage: 'Room not found'
            })
        }

        // Check lich chieu //

        ///////////

        await db.Seet.destroy({
            where: { roomId: id }
        })

        await db.Room.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete room ok"
        })
    })
}





module.exports = {
    createNewRoom,
    getAllRoom,
    getRoomById,
    deleteRoom,
    updateRoom
}