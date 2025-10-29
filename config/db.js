import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// I re-enabled dotenv for local development
dotenv.config();

// This new setup uses the single DATABASE_URL from Aiven/Railway
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    // Aiven requires a secure SSL connection
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default sequelize;