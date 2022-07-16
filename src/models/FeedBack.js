'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Feedback extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //

            Feedback.belongsTo(models.Customer, { foreignKey: 'cusId', targetKey: 'id', as: 'CustomerFeedback' });
        }
    };
    Feedback.init({
        email: DataTypes.STRING,
        fullName: DataTypes.STRING,
        phone: DataTypes.STRING,
        content: DataTypes.TEXT,
        cusId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Feedback',
        freezeTableName: true
    });
    return Feedback;
};

