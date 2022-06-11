import db from "../models/index";
import RoomService from '../services/RoomService';


let handleCreateNewRoom = async (req, res) => {
    let message = await RoomService.createNewRoom(req.body);
    return res.status(200).json(message);
}


let handleGetAllRoom = async (req, res) => {
    let room = await RoomService.getAllRoom();
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        room
    })

}

module.exports = {
    handleCreateNewRoom,
    handleGetAllRoom
}