'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Reset_pass', {

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            m_email: {
                type: Sequelize.STRING
            },
            m_numcheck: {
                default: 0,
                type: Sequelize.INTEGER
            },
            m_token: {
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
        await queryInterface.dropTable('Reset_pass');
    }
};