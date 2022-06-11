'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING
      },
      cityCode: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      districtCode: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      wardCode: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isActive: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      public_id_image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      gender: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      birthday: {
        allowNull: true,
        type: Sequelize.DATE
      },
      userName: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.INTEGER
      },
      userToken: {
        allowNull: true,
        type: Sequelize.STRING
      },

      address: {
        allowNull: true,
        type: Sequelize.STRING
      },

      phone: {
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
    await queryInterface.dropTable('Users');
  }
};