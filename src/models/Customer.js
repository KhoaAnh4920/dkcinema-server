'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //
            Customer.belongsTo(models.Ranking, { foreignKey: 'rankId', targetKey: 'id', as: 'RankingCustomer' });
            Customer.hasMany(models.Booking, { foreignKey: 'customerId', as: 'CustomerBooking' })
            Customer.hasMany(models.Comment, { foreignKey: 'cusId', as: 'CustomerComment' })
            Customer.belongsToMany(models.News, { as: 'CustomerInNewsVote', through: models.Vote_News, foreignKey: 'newsId' });
        }
    };
    Customer.init({
        email: DataTypes.STRING,
        phone: DataTypes.DOUBLE,
        fullName: DataTypes.STRING,
        point: DataTypes.INTEGER,
        rankId: DataTypes.INTEGER,
        externalId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Customer',
        freezeTableName: true
    });
    return Customer;
};