'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('News', {


            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            tomTat: {
                type: Sequelize.TEXT
            },
            noiDung: {
                type: Sequelize.TEXT
            },
            userId: {
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.INTEGER
            },
            thumbnail: {
                type: Sequelize.STRING
            },
            public_id_url: {
                type: Sequelize.STRING
            },
            rating: {
                type: Sequelize.FLOAT
            },
            status: {
                type: Sequelize.BOOLEAN
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
        await queryInterface.dropTable('News');
    }
};