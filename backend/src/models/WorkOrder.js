import { DataTypes, Model } from "sequelize";

class WorkOrder extends Model {
  static initModel(sequelize) {
    WorkOrder.init(
      {
        workNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "open",
        },

        // --- Fields for AI service ---
        duration: {
          type: DataTypes.INTEGER, // planned time in minutes
          allowNull: false,
        },
        actualTime: {
          type: DataTypes.INTEGER, // actual time taken
          allowNull: true,
        },
        workerExperience: {
          type: DataTypes.INTEGER, // 1 = Low, 2 = Medium, 3 = High
          defaultValue: 2,
        },
        machineEfficiency: {
          type: DataTypes.FLOAT, // 0.0 - 1.0
          defaultValue: 0.8,
        },
        delayRisk: {
          type: DataTypes.STRING, // Low / Medium / High
          defaultValue: "Unknown",
        },
      },
      {
        sequelize,
        modelName: "WorkOrder",
        tableName: "work_orders",
        timestamps: true,
      }
    );
  }
}

export default WorkOrder;
