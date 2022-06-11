'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TypeFood extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            TypeFood.hasMany(models.Food, { foreignKey: 'typeId', as: 'TypeOfFood' })
        }
    };
    TypeFood.init({
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'TypeFood',
        freezeTableName: true
    });
    return TypeFood;
};