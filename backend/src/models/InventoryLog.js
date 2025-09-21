import { DataTypes, Model } from "sequelize";

class InventoryLog extends Model {
  static initModel(sequelize) {
    InventoryLog.init(
      {
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        change_qty: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        reason: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "InventoryLog",
        tableName: "inventory_logs",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
      }
    );
  }
}

export default InventoryLog;