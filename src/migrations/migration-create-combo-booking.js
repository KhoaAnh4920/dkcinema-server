'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Combo_Booking', {

        //     bookingId: DataTypes.INTEGER,
        // comboId: DataTypes.INTEGER,
        // amount: DataTypes.INTEGER,


            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            bookingId: {
                type: Sequelize.INTEGER
            },
            comboId: {
                type: Sequelize.INTEGER
            },
            amount: {
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
        await queryInterface.dropTable('Combo_Booking');
    }
};