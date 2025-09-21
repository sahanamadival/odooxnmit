// src/models/User.js
import { DataTypes, Model } from "sequelize";

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM("User", "Manager", "Supervisor", "Admin"),
          allowNull: false,
          defaultValue: "User",
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
      }
    );
  }
}

export default User;
