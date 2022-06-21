'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageMovieTheater extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            ImageMovieTheater.belongsTo(models.MovieTheater, { foreignKey: 'movieTheaterId', targetKey: 'id', as: 'MovieTheaterImage' });
        }
    };
    ImageMovieTheater.init({
        url: DataTypes.STRING,
        movieTheaterId: DataTypes.INTEGER,
        public_id: DataTypes.STRING,
        status: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'ImageMovieTheater',
        freezeTableName: true
    });
    return ImageMovieTheater;
};