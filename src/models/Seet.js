'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Seet extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //

            Seet.belongsTo(models.TypeSeet, { foreignKey: 'typeId', targetKey: 'id', as: 'TypeOfSeet' })
            Seet.hasMany(models.Ticket, { foreignKey: 'seetId', as: 'TicketSeet' })
            Seet.belongsTo(models.Room, { foreignKey: 'roomId', targetKey: 'id', as: 'RoomSeet' })
        }
    };
    Seet.init({
        codeSeet: DataTypes.STRING,
        posOfColumn: DataTypes.STRING,
        posOfRow: DataTypes.STRING,
        roomId: DataTypes.INTEGER,
        typeId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Seet',
        freezeTableName: true
    });
    return Seet;
};