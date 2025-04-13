module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      profilePhotoUrl: { type: DataTypes.STRING },
      height: { type: DataTypes.FLOAT, allowNull: false },
      weight: { type: DataTypes.FLOAT, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },
      gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
      metabolism: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.017 }
    }, {});
    User.associate = function(models) {
      User.hasMany(models.BACRecord, { foreignKey: 'userId' });
      User.hasMany(models.ToleranceEstimation, { foreignKey: 'userId' });
    };
    return User;
  };
  