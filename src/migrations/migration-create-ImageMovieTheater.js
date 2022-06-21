'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('ImageMovieTheater', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            movieTheaterId: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.BOOLEAN
            },
            url: {
                type: Sequelize.STRING
            },
            public_id: {
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
        await queryInterface.dropTable('ImageMovieTheater');
    }
};