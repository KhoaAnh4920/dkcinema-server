'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Voucher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Voucher.hasMany(models.Booking, { foreignKey: 'voucherId', as: 'VoucherBooking' })
        }
    };
    Voucher.init({
        code: DataTypes.STRING,
        discount: DataTypes.INTEGER,
        status: DataTypes.BOOLEAN,
        condition: DataTypes.INTEGER,
        maxUses: DataTypes.INTEGER,
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        timeStart: DataTypes.DATE,
        timeEnd: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Voucher',
        freezeTableName: true
    });
    return Voucher;
};