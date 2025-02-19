'use strict';
const {
    Model,
    DataTypes
} = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model { }

    User.init(
        {
            id: {
                type: DataTypes.STRING(100),
                primaryKey: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User',
            timestamps: true,
        }
    );

    return User;
};
