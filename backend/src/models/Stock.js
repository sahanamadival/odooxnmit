import { DataTypes, Model } from "sequelize";

class Stock extends Model {
  static initModel(sequelize) {
    Stock.init(
      {
        itemName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        location: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Stock",
        tableName: "stocks",
        timestamps: true,
      }
    );
  }
}

export default Stock;
