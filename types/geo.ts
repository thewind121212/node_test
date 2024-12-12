interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    elevation: number;
    feature_code: string;
    country_code: string;
    admin1_id: number;
    timezone: string;
    population: number;
    country_id: number;
    country: string;
    admin1: string;
  }
  
  interface GeoResponse {
    results?: Location[];
    generationtime_ms: number;
  }


interface LocationService {
    locationId: string,
    latitude: number,
    longitude: number,
    timezone: string
}

  export { Location, GeoResponse, LocationService };