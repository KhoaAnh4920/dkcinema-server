import db from "../models/index";
import FoodServices from '../services/FoodServices';


let handleCreateNewFood = async (req, res) => {
    //  console.log("Check req: ", req.body);
    let message = await FoodServices.createNewFood(req.body);
    return res.status(200).json(message);
}


let handleGetAllFood = async (req, res) => {
    let dataFood = await FoodServices.getListFood(req.query);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        dataFood
    })
}

let handleGetFoodById = async (req, res) => {
    let message = '';

    if (req.params && req.params.foodId)
        message = await FoodServices.getFoodById(req.params.foodId);
    return res.status(200).json(message);
}

let handleUpdateFood = async (req, res) => {
    let message = await FoodServices.updateFood(req.body);
    return res.status(200).json(message);
}


let handleDeleteFood = async (req, res) => {
    if (!req.params.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await FoodServices.deleteFood(req.params.id);
    return res.status(200).json(message);
}





module.exports = {
    handleCreateNewFood,
    handleGetAllFood,
    handleGetFoodById,
    handleUpdateFood,
    handleDeleteFood
}