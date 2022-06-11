import db from "../models/index";

let createNewTypeMovie = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let checkData = await db.TypeMovie.findOne({
                    where: { name: data.name }
                })

                if (checkData) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Type Movie already exists !!'
                    }); // return 
                }
                await db.TypeMovie.create({
                    name: data.name,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
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


let getTypeMovieById = (typeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("TypeId: ", typeId);
            let typeMovie = await db.TypeMovie.findOne({
                where: { id: typeId },

                raw: true,
                nest: true
            });

            console.log("type: ", typeMovie);



            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: typeMovie
            });
        } catch (e) {
            reject(e);
        }
    })
}


let updateTypeMovie = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log("Check data: ", data);
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let typeMovie = await db.TypeMovie.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (typeMovie) {

                    typeMovie.name = data.name;

                    await typeMovie.save();

                    resolve({
                        errCode: 0,
                        message: "Update type movie Success"
                    });

                } else {
                    resolve({
                        errorCode: 1,
                        errMessage: "Type movie not found"
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



module.exports = {
    createNewTypeMovie,
    getTypeMovieById,
    updateTypeMovie
}