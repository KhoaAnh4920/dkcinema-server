import db from "../models/index";

let createNewCombo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data) {
                let checkData = await db.Combo.findOne({
                    where: { name: data.name }
                })

                if (checkData) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Combo already exists !!'
                    });
                    return
                }
                await db.Combo.create({
                    name: data.name,
                    price: data.price,
                }).then(function (x) {
                    if (x.id) {
                        let foodItems = data.items;
                        if (foodItems && foodItems.length > 0) {
                            let result = [];
                            foodItems.map(item => {
                                let obj = {};
                                obj.comboId = x.id;
                                obj.foodId = item.foodId;
                                obj.amount = item.amount;
                                result.push(obj);
                            })
                            db.Combo_Food.bulkCreate(result);
                        }
                    }
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




let getListCombo = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataFood = await db.Combo.findAll({
                include: [
                    { model: db.Food, as: 'ComboInFood' },
                ],
                raw: false,
            });
            resolve(dataFood);
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailCombo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataFood = await db.Combo.findAll({
                include: [
                    { model: db.Food, as: 'ComboInFood' },
                ],
                where: { id: id },

                raw: false,
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


let getItemOfCombo = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataFood = await db.Combo_Food.findAll({
                include: [
                    { model: db.Food, as: 'Food' },
                ],
                where: { comboId: id },

                raw: false,
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

let updateCombo = (data) => {
    return new Promise(async (resolve, reject) => {
        console.log("Check data: ", data);
        try {
            if (!data.id) {
                resolve({
                    errorCode: 2,
                    errMessage: 'Missing id'
                })
            } else {
                let dataCombo = await db.Combo.findOne({
                    include: [
                        { model: db.Food, as: 'ComboInFood' },
                    ],
                    where: { id: data.id },
                    raw: false,
                });
                if (dataCombo) {

                    dataCombo.name = data.name;
                    dataCombo.price = data.price;

                    await dataCombo.save();

                    let foodItems = data.items;
                    if (foodItems && foodItems.length > 0) {


                        await Promise.all(foodItems.map(async item => {
                            console.log(item);
                            if (item.amount === 0) {
                                console.log('Run delete: ', +item.foodId, +data.id)
                                await db.Combo_Food.destroy({
                                    where: { foodId: +item.foodId, comboId: +data.id }
                                })
                            } else {
                                let food = await db.Combo_Food.findOne({ where: { foodId: +item.foodId, comboId: +data.id }, raw: false })
                                console.log(food);
                                if (food) {
                                    food.amount = item.amount;
                                    food.save();
                                } else {
                                    console.log("Create");
                                    let obj = {};
                                    obj.comboId = +data.id;
                                    obj.foodId = item.foodId;
                                    obj.amount = item.amount;
                                    await db.Combo_Food.create(obj);
                                }
                            }
                        }))
                    }

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




let deleteCombo = (id) => {
    return new Promise(async (resolve, reject) => {
        let combo = await db.Combo.findOne({
            where: { id: id }
        })
        if (!combo) {
            resolve({
                errCode: 2,
                errMessage: 'Combo not found'
            })
        }

        await db.Combo_Food.destroy({
            where: { comboId: id }
        })
        await db.Combo.destroy({
            where: { id: id }
        });
        resolve({
            errCode: 0,
            errMessage: "Delete combo success"
        })
    })
}



module.exports = {
    createNewCombo,
    getItemOfCombo,
    getListCombo,
    getDetailCombo,
    updateCombo,
    deleteCombo
}