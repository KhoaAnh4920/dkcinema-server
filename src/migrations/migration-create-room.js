'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Room', {

        // numberOfColumn: DataTypes.INTEGER,
        // numberOfRow: DataTypes.INTEGER,
        // movieTheaterId: DataTypes.INTEGER,

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numberOfColumn: {
        type: Sequelize.INTEGER
      },
      numberOfRow: {
        type: Sequelize.INTEGER
      },
      movieTheaterId: {
        type: Sequelize.INTEGER
      },
      name: {
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
    await queryInterface.dropTable('Room');
  }
};