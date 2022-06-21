'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class News extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một người dùng thuộc 1 role //
            News.belongsTo(models.Users, { foreignKey: 'userId', targetKey: 'id', as: 'UserNews' })
            News.hasMany(models.Comment, { foreignKey: 'newsId', as: 'CommentNews' })
        }
    };
    News.init({
        tomTat: DataTypes.TEXT,
        noiDung: DataTypes.TEXT,
        userId: DataTypes.INTEGER,
        thumbnail: DataTypes.STRING,
        public_id_url: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'News',
        freezeTableName: true
    });
    return News;
};