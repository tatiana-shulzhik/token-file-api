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
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING(100),
            },
            password: {
                type: DataTypes.STRING(100),
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
