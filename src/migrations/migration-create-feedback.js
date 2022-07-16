'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Feedback', {


            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },


            email: {
                type: Sequelize.STRING
            },
            fullName: {
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.TEXT
            },
            cusId: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('Feedback');
    }
};