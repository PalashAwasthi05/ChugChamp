module.exports = (sequelize, DataTypes) => {
    const ToleranceEstimation = sequelize.define('ToleranceEstimation', {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      currentBAC: { type: DataTypes.FLOAT, allowNull: false },
      estimationJSON: { type: DataTypes.JSON },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {});
    
    ToleranceEstimation.associate = function(models) {
      // Each tolerance estimation is linked to a user.
      ToleranceEstimation.belongsTo(models.User, { foreignKey: 'userId' });
    };
    
    return ToleranceEstimation;
  };
  