module.exports = (sequelize, DataTypes) => {
    const BACRecord = sequelize.define('BACRecord', {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      consumptionOz: { type: DataTypes.FLOAT, allowNull: false },
      timeOfConsumption: { type: DataTypes.DATE, allowNull: false },
      measuredBAC: { type: DataTypes.FLOAT, allowNull: true },
      calculatedBAC: { type: DataTypes.FLOAT, allowNull: false },
      recordedAt: { type: DataTypes.DATE, allowNull: false }
    }, {});
    
    BACRecord.associate = function(models) {
      // Define association: each BACRecord belongs to a User.
      BACRecord.belongsTo(models.User, { foreignKey: 'userId' });
    };
    
    return BACRecord;
  };
  