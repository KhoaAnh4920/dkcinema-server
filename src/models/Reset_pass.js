'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Reset_pass extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    };
    Reset_pass.init({
        m_email: DataTypes.STRING,
        m_numcheck: DataTypes.INTEGER,
        m_token: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Reset_pass',
        freezeTableName: true
    });
    return Reset_pass;
};

