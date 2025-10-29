import axios from 'axios';
import { Op } from 'sequelize';
import Country from '../models/country.js';
import AppStatus from '../models/appStatus.js';
import { generateSummaryImage } from '../services/img.js';
import path from 'path';
import fs from 'fs';

const COUNTRIES_API = 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
const RATES_API = 'https://open.er-api.com/v6/latest/USD';

// POST /countries/refresh
export const refreshCountries = async (req, res) => {
  try {
    const [countriesRes, ratesRes] = await Promise.all([axios.get(COUNTRIES_API), axios.get(RATES_API)]);
    const rates = ratesRes.data.rates;

    for (const countryData of countriesRes.data) {
      if (!countryData.name || !countryData.population) continue;

      const currencyCode = countryData.currencies?.[0]?.code || null;
      const exchangeRate = rates[currencyCode] || null;
      let estimatedGdp = null;

      if (exchangeRate) {
        const multiplier = Math.random() * (2000 - 1000) + 1000;
        estimatedGdp = (countryData.population * multiplier) / exchangeRate;
      }

      const countryPayload = {
        name: countryData.name,
        capital: countryData.capital,
        region: countryData.region,
        population: countryData.population,
        currency_code: currencyCode,
        exchange_rate: exchangeRate,
        estimated_gdp: estimatedGdp,
        flag_url: countryData.flag,
      };

      await Country.upsert(countryPayload);
    }

    await AppStatus.upsert({ key: 'last_refreshed_at', value: new Date().toISOString() });
    
    // Run image generation without waiting to keep the endpoint fast
    generateSummaryImage();

    res.status(200).json({ message: 'Data refreshed successfully' });

  } catch (error) {
    if (error.isAxiosError) {
      console.error('Refresh failed due to external API error:', error.message);
      return res.status(503).json({ error: 'External data source unavailable' });
    }
    console.error('Refresh failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /countries
export const getAllCountries = async (req, res) => {
  try {
    const { region, currency, sort } = req.query;
    const options = { where: {}, order: [] };

    if (region) options.where.region = { [Op.like]: region };
    if (currency) options.where.currency_code = { [Op.like]: currency };
    if (sort === 'gdp_desc') options.order.push(['estimated_gdp', 'DESC']);

    const countries = await Country.findAll(options);
    res.json(countries);
  } catch (error) {
    console.error('Error fetching all countries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /countries/:name
export const getCountryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const country = await Country.findOne({ where: { name: { [Op.like]: name } } });

    if (country) {
      res.json(country);
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    console.error(`Error fetching country by name (${req.params.name}):`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /status
export const getStatus = async (req, res) => {
  try {
    const total_countries = await Country.count();
    const lastRefresh = await AppStatus.findByPk('last_refreshed_at');
    res.json({
      total_countries,
      last_refreshed_at: lastRefresh?.value || null,
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /countries/image
export const getSummaryImage = (req, res) => {
  try {
    const imagePath = path.resolve('cache', 'summary.svg');
    if (fs.existsSync(imagePath)) {
      res.header('Content-Type', 'image/svg+xml');
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Summary image not found.' });
    }
  } catch (error) {
    console.error('Error serving summary image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /countries/:name
export const deleteCountry = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await Country.destroy({ where: { name: { [Op.like]: name } } });
    
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Country not found' });
    }
  } catch (error) {
    console.error(`Error deleting country (${req.params.name}):`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
};