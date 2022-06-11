'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TypeSeet extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //

            TypeSeet.hasMany(models.Seet, { foreignKey: 'roomId', as: 'TypeOfSeet' })
        }
    };
    TypeSeet.init({
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'TypeSeet',
        freezeTableName: true
    });
    return TypeSeet;
};