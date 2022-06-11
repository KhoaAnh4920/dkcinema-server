'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here//

      // 1 role có nhiều user //
      Roles.hasMany(models.Users, { foreignKey: 'roleId', as: 'UserRoles' })


    }
  };
  Roles.init({
    rolesName: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Roles',
    freezeTableName: true
  });
  return Roles;
};