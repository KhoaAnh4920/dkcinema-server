'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Food extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Food.belongsTo(models.TypeFood, { foreignKey: 'typeId', targetKey: 'id', as: 'TypeOfFood' });
            Food.belongsToMany(models.Combo, { as: 'FoodForCombo', through: models.Combo_Food, foreignKey: 'foodId' });
        }
    };
    Food.init({
        name: DataTypes.STRING,
        price: DataTypes.DOUBLE,
        typeId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Food',
        freezeTableName: true
    });
    return Food;
};