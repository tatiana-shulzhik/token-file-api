'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UserFile extends Model { }

  UserFile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'UserFile',
    primaryKey: false,
    autoIncrement: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'fileId'],
      },
    ],
  });

  UserFile.associate = function (models) {
    UserFile.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    UserFile.belongsTo(models.File, {
      foreignKey: 'fileId',
      onDelete: 'CASCADE',
    });
  };

  return UserFile;
};
