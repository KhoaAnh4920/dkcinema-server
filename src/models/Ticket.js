'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //

            Ticket.belongsTo(models.Seet, { foreignKey: 'seetId', targetKey: 'id', as: 'TicketSeet' })
            Ticket.belongsTo(models.Showtime, { foreignKey: 'showTimeId', targetKey: 'id', as: 'TicketShowtime' })
            Ticket.belongsTo(models.Booking, { foreignKey: 'bookingId', targetKey: 'id', as: 'BookingTicket' })

        }
    };
    Ticket.init({
        bookingId: DataTypes.INTEGER,
        showTimeId: DataTypes.INTEGER,
        seetId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Ticket',
        freezeTableName: true
    });
    return Ticket;
};