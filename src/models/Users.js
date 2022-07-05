'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //
            Users.belongsTo(models.Roles, { foreignKey: 'roleId', targetKey: 'id', as: 'UserRoles' })
            Users.hasMany(models.News, { foreignKey: 'userId', as: 'UserNews' })
            Users.hasOne(models.MovieTheater, { foreignKey: 'userId', as: 'UserMovieTheater' });
        }
    };
    Users.init({
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        fullName: DataTypes.STRING,
        avatar: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        public_id_image: DataTypes.STRING,
        gender: DataTypes.BOOLEAN,
        birthday: DataTypes.DATE,
        userName: DataTypes.STRING,
        cityCode: DataTypes.INTEGER,
        districtCode: DataTypes.INTEGER,
        wardCode: DataTypes.INTEGER,
        address: DataTypes.STRING,
        roleId: DataTypes.INTEGER,
        phone: DataTypes.STRING,
        userToken: DataTypes.STRING,
        externalid: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Users',
        freezeTableName: true
    });
    return Users;
};

