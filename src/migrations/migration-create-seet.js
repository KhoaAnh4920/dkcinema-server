'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Seet', {

        // codeSeet: DataTypes.STRING,
        // posOfColumn: DataTypes.STRING,
        // posOfRow: DataTypes.STRING,
        // roomId: DataTypes.INTEGER,
        // typeId: DataTypes.INTEGER

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codeSeet: {
        type: Sequelize.STRING
      },
      posOfColumn: {
        type: Sequelize.STRING
      },
      posOfRow: {
        type: Sequelize.STRING
      },
      roomId: {
        type: Sequelize.INTEGER
      },
      typeId: {
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
    await queryInterface.dropTable('Seet');
  }
};