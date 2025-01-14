// params using for weather
const currentParams = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'surface_pressure',
  'rain',
  'weather_code',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m'
];

const hourlyParams = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'rain',
  'weather_code',
  'snowfall',
  'cloud_cover',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  // 'showers',
  // 'snowfall'
]


const dailyParams = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'daylight_duration',
  'uv_index_max',
  'precipitation_sum',
  // 'showers_sum',
  // 'snowfall_sum',
  'rain_sum',
  'precipitation_hours',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_gusts_10m_max'
];

//params using for air quality


const currentAirParams = [
  'us_aqi',
  'pm2_5',
  'pm10',
  'carbon_dioxide',
  'uv_index',
  'carbon_monoxide',
  'sulphur_dioxide',
  'ozone'
];

const hourlyAirParams = [
  'pm2_5',
  'carbon_monoxide',
  'pm10',
  'uv_index',
  'us_aqi'
];

export { currentParams, dailyParams, hourlyParams, currentAirParams, hourlyAirParams };



