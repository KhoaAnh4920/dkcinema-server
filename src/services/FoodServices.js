import db from "../models/index";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;



let createNewFood = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let checkData = await db.Food.findOne({
                    where: { name: data.name }
                })

                if (checkData) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Food already exists !!'
                    });
                    return
                }
                await db.Food.create({
                    name: data.name,
                    price: data.price,
                    typeId: data.typeId
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


let getFoodById = (foodId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataFood = await db.Food.findOne({
                where: { id: foodId },

                raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: dataFood
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getListFood = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataFood = await db.Food.findAll({
                where: {
                    [Op.and]: [
                        data && data.typeId &&
                        {
                            typeId: data.typeId
                        },
                    ],
                },
                [Op.and]: [
                    data && data.typeId &&
                    {
                        typeId: data.typeId
                    },
                ],
                include: [
                    { model: db.TypeFood, as: 'TypeOfFood' },
                ],
                raw: false,
            });
            resolve(dataFood);
        } catch (e) {
            reject(e);
        }
    })
}


let updateFood = (data) => {
    return new Promise(async (resolve, reject) => {
        // console.log("Check data: ", data);
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let dataFood = await db.Food.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (dataFood) {

                    dataFood.name = data.name;
                    dataFood.price = data.price;
                    dataFood.typeId = data.typeId;

                    await dataFood.save();

                    resolve({
                        errCode: 0,
                        message: "Update food Success"
                    });

                } else {
                    resolve({
                        errorCode: 1,
                        errMessage: "Food not found"
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


let deleteFood = (id) => {
    return new Promise(async (resolve, reject) => {
        let dataFood = await db.Food.findOne({
            where: { id: id }
        })
        if (!dataFood) {
            resolve({
                errCode: 2,
                errMessage: 'Food ko ton tai'
            })
            return;
        }

        // Check if food exists in table Combo //
        let existsFood = await db.Combo_Food.findOne({ where: { foodId: id } })

        if (existsFood) {
            resolve({
                errCode: -1,
                errMessage: "Food already exists in Combo"
            })
        } else {
            await db.Food.destroy({
                where: { id: id }
            });
        }


        resolve({
            errCode: 0,
            errMessage: "Delete food ok"
        })
    })
}



module.exports = {
    createNewFood,
    getFoodById,
    updateFood,
    getListFood,
    deleteFood
}