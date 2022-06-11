'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Combo_Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Combo_Booking.belongsTo(models.Booking, { foreignKey: 'bookingId', targetKey: 'id', as: 'Booking' });
            Combo_Booking.belongsTo(models.Combo, { foreignKey: 'comboId', targetKey: 'id', as: 'Combo' });
        }
    };
    Combo_Booking.init({
        bookingId: DataTypes.INTEGER,
        comboId: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Combo_Booking',
        freezeTableName: true
    });
    return Combo_Booking;
};