'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//

            Booking.hasMany(models.Ticket, { foreignKey: 'bookingId', as: 'BookingTicket' })
            Booking.belongsTo(models.Voucher, { foreignKey: 'voucherId', targetKey: 'id', as: 'VoucherBooking' })
            Booking.belongsTo(models.Customer, { foreignKey: 'customerId', targetKey: 'id', as: 'CustomerBooking' })
            Booking.belongsToMany(models.Combo, { as: 'BookingForCombo', through: models.Combo_Booking, foreignKey: 'bookingId' });
        }
    };
    Booking.init({
        price: DataTypes.DOUBLE,
        customerId: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        voucherId: DataTypes.INTEGER,
        nameCus: DataTypes.STRING,
        email: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Booking',
        freezeTableName: true
    });
    return Booking;
};