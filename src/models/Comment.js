'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

            // define association here//
            // Một rạp có nhiều phòng chiếu //
            Comment.belongsTo(models.Customer, { foreignKey: 'cusId', targetKey: 'id', as: 'CustomerComment' });
            Comment.belongsTo(models.News, { foreignKey: 'newsId', targetKey: 'id', as: 'CommentNews' });
        }
    };
    Comment.init({
        comment: DataTypes.STRING,
        rating: DataTypes.INTEGER,
        commentCount: DataTypes.INTEGER,
        cusId: DataTypes.INTEGER,
        newsId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Comment',
        freezeTableName: true
    });
    return Comment;
};