'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Combo_Food extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Combo_Food.belongsTo(models.Food, { foreignKey: 'foodId', targetKey: 'id', as: 'Food' });
            Combo_Food.belongsTo(models.Combo, { foreignKey: 'comboId', targetKey: 'id', as: 'Combo' });
        }
    };
    Combo_Food.init({
        comboId: DataTypes.INTEGER,
        foodId: DataTypes.INTEGER,
        amount: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Combo_Food',
        freezeTableName: true
    });
    return Combo_Food;
};