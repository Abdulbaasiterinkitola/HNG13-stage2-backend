import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db.js';
import countryRouter from './routes/country.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', countryRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the Countries API');
});

// Start server
const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

start();