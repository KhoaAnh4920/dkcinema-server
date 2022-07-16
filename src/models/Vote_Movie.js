'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Vote_Movie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //
            Vote_Movie.belongsTo(models.Movie, { foreignKey: 'movieId', targetKey: 'id', as: 'Movie' });
            Vote_Movie.belongsTo(models.Customer, { foreignKey: 'cusId', targetKey: 'id', as: 'Customer' });
        }
    };
    Vote_Movie.init({
        rating: DataTypes.INTEGER,
        cusId: DataTypes.INTEGER,
        movieId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Vote_Movie',
        freezeTableName: true
    });
    return Vote_Movie;
};