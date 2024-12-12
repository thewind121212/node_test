import exp from "constants";
import { geoFetcher } from "../helper/fetcher";
import { redisClient } from "../helper/redis";
import { LocationService as Location } from "../types/geo";

const fetchLocationService = async (locationName: string): Promise<Location | null> => {

    try {
        const response = await geoFetcher(locationName);

        if (!response || !response?.results || response?.results?.length === 0) {
            return null
        }

        const locationData = {
            locationId: response?.results[0].id as unknown as string,
            longitude: response?.results[0].longitude as number,
            latitude: response?.results[0].latitude as number,
            timezone: response?.results[0].timezone as string,
        }

        await redisClient.set(`location:${response?.results[0].id as unknown}`, JSON.stringify(locationData));
        return locationData

    }
    catch (error) {
        console.error('Error fetching data:', error);
        return null
    }
}

export { fetchLocationService }