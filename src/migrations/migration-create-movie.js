'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Movie', {

        //     name: DataTypes.STRING,
        // country: DataTypes.STRING,
        // duration: DataTypes.INTEGER,
        // description: DataTypes.STRING,
        // brand: DataTypes.STRING,
        // cast: DataTypes.STRING,
        // status: DataTypes.BOOLEAN,
        // releaseTime: DataTypes.DATE,
        // language: DataTypes.STRING,
        // url: DataTypes.STRING,
        // typeId: DataTypes.INTEGER,
        // poster: DataTypes.STRING

            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
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
                type: Sequelize.STRING
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
                type: Sequelize.BOOLEAN
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
            typeId: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            poster: {
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