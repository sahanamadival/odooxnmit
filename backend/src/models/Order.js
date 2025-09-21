import { DataTypes, Model } from "sequelize";

class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        customer_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        status: {
          type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'DELIVERED', 'CANCELLED'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
        total_amount: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  }
}

export default Order;