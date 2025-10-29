import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Country = sequelize.define('Country', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  capital: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  population: { type: DataTypes.BIGINT, allowNull: false },
  currency_code: { type: DataTypes.STRING },
  exchange_rate: { type: DataTypes.FLOAT },
  estimated_gdp: { type: DataTypes.DOUBLE },
  flag_url: { type: DataTypes.STRING },
}, {
  timestamps: true,
  updatedAt: 'last_refreshed_at',
  createdAt: false,
});

export default Country;