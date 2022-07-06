import db from "../models/index";
import RoomService from '../services/RoomService';


let handleCreateNewRoom = async (req, res) => {
    let message = await RoomService.createNewRoom(req.body);
    return res.status(200).json(message);
}

let handleUpdateRoom = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await RoomService.updateRoom(req.body);
    return res.status(200).json(message);
}


let handleGetAllRoom = async (req, res) => {
    console.log(req.query);
    let room = await RoomService.getAllRoom(req.query);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        room
    })

}

let handleGetRoomById = async (req, res) => {
    let message = '';

    if (!req.params.roomId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    if (req.params && req.params.roomId)
        message = await RoomService.getRoomById(req.params.roomId);
    return res.status(200).json(message);
}


let handleDeleteRoom = async (req, res) => {


    if (!req.params.roomId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await RoomService.deleteRoom(req.params.roomId);
    return res.status(200).json(message);
}

module.exports = {
    handleCreateNewRoom,
    handleGetAllRoom,
    handleGetRoomById,
    handleDeleteRoom,
    handleUpdateRoom
}