'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TypeMovieCustomer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            TypeMovieCustomer.belongsTo(models.TypeMovie, { foreignKey: 'typeId', targetKey: 'id', as: 'TypeMovie' });
            TypeMovieCustomer.belongsTo(models.Customer, { foreignKey: 'cusId', targetKey: 'id', as: 'Customer' });
        }
    };
    TypeMovieCustomer.init({
        typeId: DataTypes.INTEGER,
        cusId: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'TypeMovieCustomer',
        freezeTableName: true
    });
    return TypeMovieCustomer;
};