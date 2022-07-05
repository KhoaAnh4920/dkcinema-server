'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Vote_News', {

            // comment: DataTypes.STRING,
            // rating: DataTypes.INTEGER,
            // commentCount: DataTypes.INTEGER,
            // cusId: DataTypes.INTEGER,
            // newsId: DataTypes.INTEGER,


            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            rating: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            cusId: {
                allowNull: true,
                type: Sequelize.INTEGER
            },
            newsId: {
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
        await queryInterface.dropTable('Vote_News');
    }
};