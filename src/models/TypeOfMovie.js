'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TypeOfMovie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            TypeOfMovie.belongsTo(models.Movie, { foreignKey: 'movieId', targetKey: 'id', as: 'Movie' });
            TypeOfMovie.belongsTo(models.TypeMovie, { foreignKey: 'typeId', targetKey: 'id', as: 'Type' });
        }
    };
    TypeOfMovie.init({
        movieId: DataTypes.INTEGER,
        typeId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'TypeOfMovie',
        freezeTableName: true
    });
    return TypeOfMovie;
};