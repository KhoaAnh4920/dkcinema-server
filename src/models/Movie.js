'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Movie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//

            Movie.hasMany(models.Showtime, { foreignKey: 'movieId', as: 'ShowtimeMovie' })
            Movie.hasMany(models.ImageMovie, { foreignKey: 'movieId', as: 'ImageOfMovie' })
            Movie.belongsToMany(models.TypeMovie, { as: 'MovieOfType', through: models.TypeOfMovie, foreignKey: 'movieId' });
            Movie.belongsToMany(models.Customer, { as: 'MovieForCustomerVote', through: models.Vote_Movie, foreignKey: 'cusId' });
        }
    };
    Movie.init({
        name: DataTypes.STRING,
        transName: DataTypes.STRING,
        country: DataTypes.STRING,
        duration: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        brand: DataTypes.STRING,
        cast: DataTypes.STRING,
        status: DataTypes.INTEGER,
        releaseTime: DataTypes.DATE,
        language: DataTypes.STRING,
        rating: DataTypes.FLOAT,
        director: DataTypes.STRING,
        url: DataTypes.STRING,
        isDelete: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Movie',
        freezeTableName: true
    });
    return Movie;
};