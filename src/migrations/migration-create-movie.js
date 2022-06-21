'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Movie', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            transName: {
                type: Sequelize.STRING
            },
            country: {
                allowNull: true,
                type: Sequelize.STRING
            },
            duration: {
                type: Sequelize.STRING
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT
            },
            brand: {
                allowNull: true,
                type: Sequelize.STRING
            },
            cast: {
                allowNull: true,
                type: Sequelize.STRING
            },
            status: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            releaseTime: {
                allowNull: true,
                type: Sequelize.DATE
            },
            language: {
                allowNull: true,
                type: Sequelize.STRING
            },
            url: {
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
        await queryInterface.dropTable('Movie');
    }
};