import { UTCIResult } from '../types';

/**
 * Calculates UTCI (Universal Thermal Climate Index).
 * This is a polynomial approximation suitable for frontend use.
 * 
 * Note: Full UTCI requires Mean Radiant Temperature (Tmrt). 
 * We approximate Tmrt based on cloud cover and solar exposure for this demo.
 */
export const calculateUTCI = (temp: number, windSpeed: number, humidity: number, cloudCover: number, isDay: boolean): UTCIResult => {
  // 1. Estimate Tmrt (Mean Radiant Temperature)
  // If sunny day, Tmrt > Temp. If cloudy/night, Tmrt ~= Temp.
  let tmrtOffset = 0;
  if (isDay) {
    const sunFactor = (100 - cloudCover) / 100;
    tmrtOffset = sunFactor * 8; // Approx +8 degrees effective heat in full sun
  }
  const tmrt = temp + tmrtOffset;

  // 2. Simplified UTCI Approximation (Regression model for quick calculation)
  // This is a simplified proxy. The real UTCI is a 6th order polynomial spanning pages.
  // We use a heat index / wind chill hybrid adjusted for radiation as a proxy for the UI.
  
  // Base effect of wind (Wind Chill -ish)
  const windEffect = -2 * Math.pow(windSpeed, 0.5); 
  
  // Base effect of humidity (Heat Index -ish) - usually only matters above 20C
  const humidityEffect = temp > 20 ? (humidity / 100) * 2 : 0;

  // Radiant effect
  const radiantEffect = (tmrt - temp) * 0.5;

  let utciValue = temp + windEffect + humidityEffect + radiantEffect;
  
  // Clamp to realistic bounds for Belfast
  utciValue = parseFloat(utciValue.toFixed(1));

  let stressCategory = '';
  let color = '';
  let description = '';

  if (utciValue > 38) {
    stressCategory = 'Extreme Heat Stress';
    color = 'text-red-700';
    description = 'Avoid outdoor exertion. Seek shade.';
  } else if (utciValue > 32) {
    stressCategory = 'Strong Heat Stress';
    color = 'text-orange-600';
    description = 'Walk slowly, carry water.';
  } else if (utciValue > 26) {
    stressCategory = 'Moderate Heat Stress';
    color = 'text-orange-500';
    description = 'Warm. Comfortable for strolling.';
  } else if (utciValue > 9) {
    stressCategory = 'No Thermal Stress';
    color = 'text-emerald-600';
    description = 'Ideal walking conditions. Enjoy!';
  } else if (utciValue > 0) {
    stressCategory = 'Slight Cold Stress';
    color = 'text-cyan-600';
    description = 'Cool. Wear a light jacket.';
  } else if (utciValue > -13) {
    stressCategory = 'Moderate Cold Stress';
    color = 'text-blue-600';
    description = 'Chilly. Coat and scarf recommended.';
  } else {
    stressCategory = 'Strong Cold Stress';
    color = 'text-indigo-700';
    description = 'Freezing. Limit exposure.';
  }

  return {
    value: utciValue,
    stressCategory,
    description,
    color
  };
};