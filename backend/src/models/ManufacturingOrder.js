import { DataTypes, Model } from "sequelize";

class ManufacturingOrder extends Model {
  static initModel(sequelize) {
    ManufacturingOrder.init(
      {
        orderNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        product: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        modelName: "ManufacturingOrder",
        tableName: "manufacturing_orders",
        timestamps: true,
      }
    );
  }
}

export default ManufacturingOrder;
