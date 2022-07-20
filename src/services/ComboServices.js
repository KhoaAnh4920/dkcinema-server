import db from "../models/index";
var cloudinary = require('cloudinary').v2;
require('dotenv').config();



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
                    public_id: `image/Combo/${fName}`,
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


let createNewCombo = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Check dataCombo: ", data);
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

                let result = {};
                if (data.image && data.fileName) {
                    // upload cloud //
                    result = await uploadCloud(data.image, data.fileName);
                } else {
                    resolve({
                        errCode: -1,
                        errMessage: 'Missing image'
                    }); // return 
                }

                await db.Combo.create({
                    name: data.name,
                    price: data.price,
                    image: (result && result.secure_url) ? result.secure_url : '',
                    public_id_image: (result && result.public_id) ? result.public_id : '',
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
                    let result = '';
                    // Có truyền image //
                    if (data.image && data.fileName) {
                        if (dataCombo.image && dataCombo.public_id_image) // có lưu trong db //
                        {
                            // Xóa hình cũ //
                            await cloudinary.uploader.destroy(dataCombo.public_id_image, { invalidate: true, resource_type: "raw" },
                                function (err, result) { console.log(result) });

                        }
                        // upload cloud //
                        result = await uploadCloud(data.image, data.fileName);
                    }


                    dataCombo.name = data.name;
                    dataCombo.price = data.price;

                    if (data.image && data.fileName) {
                        dataCombo.image = result.secure_url;
                        dataCombo.public_id_image = result.public_id;
                    }

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
    deleteCombo,

}