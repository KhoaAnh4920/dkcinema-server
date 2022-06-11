import db from "../models/index";

let createNewRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("Check data: ", data);

            if (data) {
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
                raw: false,
                nest: true
            });

            resolve(room);
        } catch (e) {
            reject(e);
        }
    })
}





module.exports = {
    createNewRoom,
    getAllRoom
}