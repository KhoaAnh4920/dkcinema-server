'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class TypeMovie extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            TypeMovie.belongsToMany(models.Movie, { as: 'TypeInMovie', through: models.TypeOfMovie, foreignKey: 'typeId' });
        }
    };
    TypeMovie.init({
        name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'TypeMovie',
        freezeTableName: true
    });
    return TypeMovie;
};