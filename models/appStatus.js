import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const AppStatus = sequelize.define('AppStatus', {
  key: { type: DataTypes.STRING, primaryKey: true },
  value: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

export default AppStatus;