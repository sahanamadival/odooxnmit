import { DataTypes, Model } from "sequelize";

class OrderItem extends Model {
  static initModel(sequelize) {
    OrderItem.init(
      {
        order_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        qty: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items",
        timestamps: false,
      }
    );
  }
}

export default OrderItem;