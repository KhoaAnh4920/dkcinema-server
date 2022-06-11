'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('MovieTheater', {


            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tenRap: {
                type: Sequelize.STRING
            },
            userId: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            soDienThoai: {
                allowNull: true,
                type: Sequelize.STRING
            },
            cityCode: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            districtCode: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            wardCode: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            address: {
                allowNull: true,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('MovieTheater');
    }
};