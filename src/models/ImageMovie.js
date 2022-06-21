'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ImageMovie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            ImageMovie.belongsTo(models.Movie, { foreignKey: 'movieId', targetKey: 'id', as: 'ImageOfMovie' });
        }
    };
    ImageMovie.init({
        movieId: DataTypes.INTEGER,
        status: DataTypes.BOOLEAN,
        url: DataTypes.STRING,
        public_id: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'ImageMovie',
        freezeTableName: true
    });
    return ImageMovie;
};