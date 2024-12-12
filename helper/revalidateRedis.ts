import { weatherService } from '../services/weather.services';
import { airQualityService } from '../services/airQuality.services';
import { checkTime } from './utils';
import moment from 'moment';
import { getAllKeyValueMatchPatternRedis, redisClient } from './redis';


const TIME_REVALIDATE = 60 * 5 * 1000;


const revalidateWeatherData = async (isInit: boolean = false) => {
    let revalidateCount = 0;
    const locationData = await getAllKeyValueMatchPatternRedis('location:*')
    const promiseStack: any[] = [];

    const fn = async (location: {
        key: string;
        value: {
            locationId: string;
            longtidue: number;
            latitude: number;
            timezone: string;
        };
    }) => {
        const dataWeatherUnit = await redisClient.get(`weather:${location.value.locationId}`);
        const dataAirUnit = await redisClient.get(`air-quality:${location.value.locationId}`);
        // DEBUG ONLY
        if (isInit) {
            await weatherService(false, location.value.locationId.toString(), {
                long: location.value.longtidue,
                lat: location.value.latitude,
                tz: location.value.timezone
            })

            await airQualityService(false, location.value.locationId.toString(), {
                long: location.value.longtidue,
                lat: location.value.latitude,
                tz: location.value.timezone
            })
        }
        // DEBUG ONLY
        if (dataWeatherUnit) {
            const dataWeather = JSON.parse(dataWeatherUnit);
            if (checkTime(Number(dataWeather.timestamp), 50)) {
                revalidateCount++;
                await weatherService(false, location.value.locationId.toString(), {
                    long: location.value.longtidue,
                    lat: location.value.latitude,
                    tz: location.value.timezone
                })
            }
        }
        if (dataAirUnit) {
            const dataAir = JSON.parse(dataAirUnit);
            if (checkTime(Number(dataAir.timestamp), 50)) {
                revalidateCount++;
                await airQualityService(false, location.value.locationId.toString(), {
                    long: location.value.longtidue,
                    lat: location.value.latitude,
                    tz: location.value.timezone
                })
            }
        }

    }

    locationData.map(async location => {
        promiseStack.push(fn(location))
    })

    await Promise.all(promiseStack);
    return revalidateCount;
}


export const revalidateRedis = async (parentPort: any) => {
    console.log(`${moment().tz('Asia/Bangkok').format('HH:mm:ss')} Worker revalidate redis is running`);
    setInterval(async () => {
        const count = await revalidateWeatherData();
        parentPort.postMessage(`Trigged revalidate weather data at ${moment().tz('Asia/Bangkok').format('HH:mm:ss')} with ${count} data revalidated`);
    }, TIME_REVALIDATE);

}