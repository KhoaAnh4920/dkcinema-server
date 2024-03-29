import db from "../models/index";
import ScheduleService from '../services/ScheduleService';


let handleCreateNewScheduleMovie = async (req, res) => {
    let message = await ScheduleService.createNewScheduleMovie(req.body);
    return res.status(200).json(message);
}

let handleGetScheduleByDate = async (req, res) => {
    let message = '';
    message = await ScheduleService.getScheduleByDate(req.query);
    return res.status(200).json(message);
}

let handleDeleteSchedule = async (req, res) => {
    if (!req.params.scheduleId) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing id"
        })
    }
    let message = await ScheduleService.deleteSchedule(req.params.scheduleId);
    return res.status(200).json(message);
}


let handleGetScheduleById = async (req, res) => {
    let message = '';
    if (req.params && req.params.scheduleId)
        message = await ScheduleService.getScheduleById(req.params.scheduleId);
    return res.status(200).json(message);
}



module.exports = {
    handleCreateNewScheduleMovie,
    handleGetScheduleByDate,
    handleDeleteSchedule,
    handleGetScheduleById
}