// backend/models/Friendship.js
module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('Friendship', {
      requesterId: { type: DataTypes.INTEGER, allowNull: false },
      friendId: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM('pending', 'accepted', 'declined'), defaultValue: 'pending' }
    });
    return Friendship;
  };
  