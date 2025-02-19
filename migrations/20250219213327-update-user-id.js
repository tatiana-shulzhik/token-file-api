'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'email');

    await queryInterface.removeConstraint('UserFiles', 'UserFiles_userId_fkey').catch(() => { });
    await queryInterface.removeConstraint('Sessions', 'Sessions_userId_fkey').catch(() => { });

    await queryInterface.removeColumn('UserFiles', 'userId');
    await queryInterface.removeColumn('Sessions', 'userId');

    await queryInterface.removeColumn('Users', 'id');
    await queryInterface.addColumn('Users', 'id', {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    });

    await queryInterface.addColumn('UserFiles', 'userId', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Sessions', 'userId', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserFiles', 'UserFiles_userId_fkey').catch(() => { });
    await queryInterface.removeConstraint('Sessions', 'Sessions_userId_fkey').catch(() => { });

    await queryInterface.removeColumn('UserFiles', 'userId');
    await queryInterface.removeColumn('Sessions', 'userId');

    await queryInterface.removeColumn('Users', 'id');
    await queryInterface.addColumn('Users', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });

    await queryInterface.addColumn('UserFiles', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    await queryInterface.addColumn('Sessions', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    });
  }
};
