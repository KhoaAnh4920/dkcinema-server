'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Banner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //

        }
    };
    Banner.init({
        url: DataTypes.STRING,
        public_id_image: DataTypes.STRING,
        name: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Banner',
        freezeTableName: true
    });
    return Banner;
};