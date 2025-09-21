import { DataTypes, Model } from "sequelize";

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
        },
        sku: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true,
        },
        stock: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        cost_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        selling_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      }
    );
  }
}

export default Product;