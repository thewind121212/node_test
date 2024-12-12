import axios from 'axios';
import { GeoResponse } from "../types/geo";
import { WeatherData } from '../types/weather';
import { dailyParams, currentParams, hourlyParams, currentAirParams, hourlyAirParams } from '../config';
import { AirQualityData } from '../types/air';





const weatherFetcher = async (url: string, latitude: number, longitude: number, timezone: string): Promise<WeatherData | null> => {

  const params = {
    latitude,
    longitude,
    current: currentParams.join(','),
    daily: dailyParams.join(','),
    timezone,
    hourly: hourlyParams.join(','),
  };

  try {
    const response = await axios.get(url + '/v1/forecast', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};


const geoFetcher = async (city: string): Promise<GeoResponse | null> => {
  const url = 'https://geocoding-api.open-meteo.com/v1/search';

  const params = {
    name: city,
    count: 10,
    language: 'en',
    format: 'json',
  };


  try {
    const response = await axios.get(url, { params });
    return response.data
  } catch (error) {
    return null
  }

}



const airQualityFetcher = async (url: string, latitude: number, longitude: number, timezone: string): Promise<AirQualityData | null> => {

  const params = {
    latitude,
    longitude,
    current: currentAirParams.join(','),
    timezone,
    hourly: hourlyAirParams.join(','),
  };

  try {
    const response = await axios.get(url + '/v1/air-quality', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null
  }
};



export { weatherFetcher, geoFetcher, airQualityFetcher };