enum Unit {
    Iso8601 = "iso8601",
    Seconds = "seconds",
    USAQI = "USAQI",
    MicrogramPerCubicMeter = "μg/m³",
}

interface CurrentUnits {
    time: Unit;
    interval: Unit;
    us_aqi: Unit;
    pm2_5: Unit;
    carbon_monoxide: Unit;
}

interface CurrentData {
    time: string;
    interval: number;
    us_aqi: number;
    uv_index: number;
    pm2_5: number;
    carbon_monoxide: number;
}

interface HourlyUnits {
    time: Unit;
    pm2_5: Unit;
    carbon_monoxide: Unit;
    us_aqi: Unit;
}

interface HourlyData {
    time: string[];
    pm2_5: (number)[];
    carbon_monoxide: (number)[];
    us_aqi: (number)[];
}

interface AirQualityData {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: CurrentUnits;
    current: CurrentData;
    hourly_units: HourlyUnits;
    hourly: HourlyData;
    daily_units: any;
    daily: any;
    locaitonId: string;
    timestamp: number;
}

export { AirQualityData, CurrentData, HourlyData, CurrentUnits, HourlyUnits, Unit }
