import * as countryController from '../controllers/country.js';
import express from 'express';

const countryRouter = express.Router();

// API Routes
countryRouter.post('/countries/refresh', countryController.refreshCountries);
countryRouter.get('/countries', countryController.getAllCountries);
countryRouter.get('/countries/image', countryController.getSummaryImage);
countryRouter.get('/status', countryController.getStatus);
countryRouter.get('/countries/:name', countryController.getCountryByName);
countryRouter.delete('/countries/:name', countryController.deleteCountry);

export default countryRouter;