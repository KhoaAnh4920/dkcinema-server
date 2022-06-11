'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //

            Room.belongsTo(models.MovieTheater, { foreignKey: 'movieTheaterId', targetKey: 'id', as: 'MovieTheaterRoom' })
            Room.hasMany(models.Showtime, { foreignKey: 'roomId', as: 'RoomShowTime' })
            Room.hasMany(models.Seet, { foreignKey: 'roomId', as: 'RoomSeet' })

        }
    };
    Room.init({
        numberOfColumn: DataTypes.INTEGER,
        numberOfRow: DataTypes.INTEGER,
        movieTheaterId: DataTypes.INTEGER,
        name: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Room',
        freezeTableName: true
    });
    return Room;
};