'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Type_Of_Movie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            Type_Of_Movie.belongsTo(models.Movie, { foreignKey: 'movieId', targetKey: 'id', as: 'Movie' });
            Type_Of_Movie.belongsTo(models.TypeMovie, { foreignKey: 'typeId', targetKey: 'id', as: 'Type' });
        }
    };
    Type_Of_Movie.init({
        movieId: DataTypes.INTEGER,
        typeId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Type_Of_Movie',
        freezeTableName: true
    });
    return Type_Of_Movie;
};