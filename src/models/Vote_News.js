'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vote_News extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //
            Vote_News.belongsTo(models.News, { foreignKey: 'newsId', targetKey: 'id', as: 'News' });
            Vote_News.belongsTo(models.Customer, { foreignKey: 'cusId', targetKey: 'id', as: 'Customer' });
        }
    };
    Vote_News.init({
        rating: DataTypes.INTEGER,
        cusId: DataTypes.INTEGER,
        newsId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Vote_News',
        freezeTableName: true
    });
    return Vote_News;
};