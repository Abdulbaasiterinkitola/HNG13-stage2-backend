import fs from 'fs';
import path from 'path';
import Country from '../models/country.js';
import AppStatus from '../models/appStatus.js';

export const generateSummaryImage = async () => {
  try {
    const totalCountries = await Country.count();
    const top5 = await Country.findAll({ order: [['estimated_gdp', 'DESC']], limit: 5 });
    const status = await AppStatus.findByPk('last_refreshed_at');
    const lastRefreshed = status ? new Date(status.value).toLocaleString() : 'N/A';

    let top5Html = '';
    top5.forEach((c, i) => {
      const gdp = c.estimated_gdp ? `$${(c.estimated_gdp / 1e9).toFixed(2)}B` : 'N/A';
      top5Html += `<div style="font-size: 18px; margin: 10px 0;">${i + 1}. ${c.name} - ${gdp}</div>`;
    });

    // This creates an SVG image using an HTML-like structure
    const svgContent = `
      <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f4f8" />
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
            <h1 style="color: #1e3a8a; font-size: 36px;">Country Data Summary</h1>
            <p style="font-size: 20px;">Total Countries in DB: <strong>${totalCountries}</strong></p>
            <p style="font-size: 20px;">Last Refresh: <strong>${lastRefreshed}</strong></p>
            <h2 style="color: #1e3a8a; margin-top: 30px; font-size: 24px;">Top 5 Countries by Estimated GDP</h2>
            <div style="text-align: left; display: inline-block; margin-top: 10px;">
              ${top5Html}
            </div>
          </div>
        </foreignObject>
      </svg>
    `;

    const cacheDir = path.resolve('cache');
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
    // Save the file with an .svg extension
    fs.writeFileSync(path.join(cacheDir, 'summary.svg'), svgContent);
    console.log('Summary SVG image generated.');
  } catch (error)
  {
    console.error('Failed to generate SVG image:', error);
  }
};