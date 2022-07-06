'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MovieTheater extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

            MovieTheater.hasMany(models.Room, { foreignKey: 'movieTheaterId', as: 'MovieTheaterRoom' })
            MovieTheater.hasMany(models.ImageMovieTheater, { foreignKey: 'movieTheaterId', as: 'MovieTheaterImage' })
            // MovieTheater.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id', as: 'UserMovieTheater' });
            MovieTheater.hasMany(models.Users, { foreignKey: 'movietheaterid', as: 'UserMovieTheater' })
        }
    };
    MovieTheater.init({
        tenRap: DataTypes.STRING,
        soDienThoai: DataTypes.STRING,
        cityCode: DataTypes.INTEGER,
        districtCode: DataTypes.INTEGER,
        wardCode: DataTypes.INTEGER,
        address: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'MovieTheater',
        freezeTableName: true
    });
    return MovieTheater;
};


