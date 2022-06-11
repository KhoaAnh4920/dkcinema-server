'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Combo extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Combo.belongsToMany(models.Booking, { as: 'ComboInBooking', through: models.Combo_Booking, foreignKey: 'comboId' });
            Combo.belongsToMany(models.Food, { as: 'ComboInFood', through: models.Combo_Food, foreignKey: 'comboId' });
        }
    };
    Combo.init({
        name: DataTypes.STRING,
        price: DataTypes.DOUBLE,
        image: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Combo',
        freezeTableName: true
    });
    return Combo;
};