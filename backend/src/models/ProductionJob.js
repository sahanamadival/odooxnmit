import { DataTypes, Model } from "sequelize";

class ProductionJob extends Model {
  static initModel(sequelize) {
    ProductionJob.init(
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
        status: {
          type: DataTypes.ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
        started_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        finished_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "ProductionJob",
        tableName: "production_jobs",
        timestamps: false,
      }
    );
  }
}

export default ProductionJob;