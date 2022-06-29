import db from "../models/index";



let getListTypeOfFood = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataFood = await db.TypeFood.findAll({
                raw: false,
            });
            resolve(dataFood);
        } catch (e) {
            reject(e);
        }
    })
}




module.exports = {
    getListTypeOfFood
}