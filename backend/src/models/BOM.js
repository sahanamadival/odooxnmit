import { DataTypes, Model } from "sequelize";

class BOM extends Model {
  static initModel(sequelize) {
    BOM.init(
      {
        productName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        component: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "BOM",
        tableName: "boms",
        timestamps: true,
      }
    );
  }
}

export default BOM;
