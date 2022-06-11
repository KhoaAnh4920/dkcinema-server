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
            Movie.belongsToMany(models.TypeMovie, { as: 'MovieOfType', through: models.Type_Of_Movie, foreignKey: 'movieId' });
        }
    };
    Movie.init({
        name: DataTypes.STRING,
        country: DataTypes.STRING,
        duration: DataTypes.INTEGER,
        description: DataTypes.STRING,
        brand: DataTypes.STRING,
        cast: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        releaseTime: DataTypes.DATE,
        language: DataTypes.STRING,
        url: DataTypes.STRING,
        poster: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Movie',
        freezeTableName: true
    });
    return Movie;
};