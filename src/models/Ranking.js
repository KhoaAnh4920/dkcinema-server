'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ranking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Ranking.hasMany(models.Customer, { foreignKey: 'customerId', as: 'RankingCustomer' })
        }
    };
    Ranking.init({
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Ranking',
        freezeTableName: true
    });
    return Ranking;
};