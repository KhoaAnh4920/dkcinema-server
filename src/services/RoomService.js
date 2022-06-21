import db from "../models/index";

let createNewRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("Check data: ", data);

            if (data) {
                let existsName = await db.Room.findOne({
                    where: {
                        name: data.name
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
                    movieTheaterId: 1
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
                                        typeId: 1
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


let getAllRoom = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let room = await db.Room.findAll({
                include: [
                    { model: db.MovieTheater, as: 'MovieTheaterRoom' },
                    { model: db.Seet, as: 'RoomSeet' }
                ],
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
    deleteRoom
}