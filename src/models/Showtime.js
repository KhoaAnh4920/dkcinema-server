'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Showtime extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //

            Showtime.belongsTo(models.Movie, { foreignKey: 'movieId', targetKey: 'id', as: 'ShowtimeMovie' })
            Showtime.belongsTo(models.Room, { foreignKey: 'roomId', targetKey: 'id', as: 'RoomShowTime' })
            Showtime.hasMany(models.Ticket, { foreignKey: 'showTimeId', as: 'TicketShowtime' })
        }
    };
    Showtime.init({
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        premiereDate: DataTypes.DATE,
        movieId: DataTypes.INTEGER,
        roomId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Showtime',
        freezeTableName: true
    });
    return Showtime;
};