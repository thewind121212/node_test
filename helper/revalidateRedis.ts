import { weatherService } from '../services/weather.services';
import { airQualityService } from '../services/airQuality.services';
import { checkTime } from './utils';
import moment from 'moment';
import { getAllKeyValueMatchPatternRedis, redisClient } from './redis';


const TIME_REVALIDATE = 60 * 1000;


const revalidateWeatherData = async (isInit: boolean = false) => {
    let revalidateCount = 0;
    const locationData = await getAllKeyValueMatchPatternRedis('location:*')
    const promiseStack: any[] = [];

    const fn = async (location: {
        key: string;
        value: {
            locationId: string;
            longitude: number;
            latitude: number;
            timezone: string;
        };
    }) => {
        const dataWeatherUnit = await redisClient.get(`weather:${location.value.locationId}`);
        const dataAirUnit = await redisClient.get(`air-quality:${location.value.locationId}`);
        // DEBUG ONLY
        if (isInit) {
            await weatherService(false, location.value.locationId.toString(), {
                long: location.value.longitude,
                lat: location.value.latitude,
                tz: location.value.timezone
            })

            await airQualityService(false, location.value.locationId.toString(), {
                long: location.value.longitude,
                lat: location.value.latitude,
                tz: location.value.timezone
            })
        }
        // DEBUG ONLY
        if (dataWeatherUnit) {
            const dataWeather = JSON.parse(dataWeatherUnit);
            if (checkTime(Number(dataWeather.timestamp), 55)) {
                revalidateCount++;
                await weatherService(false, location.value.locationId.toString(), {
                    long: location.value.longitude,
                    lat: location.value.latitude,
                    tz: location.value.timezone
                })
            }
        }
        if (dataAirUnit) {
            const dataAir = JSON.parse(dataAirUnit);
            if (checkTime(Number(dataAir.timestamp), 25)) {
                revalidateCount++;
                await airQualityService(false, location.value.locationId.toString(), {
                    long: location.value.longitude,
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
        if (count > 0) {
            parentPort.postMessage(`Trigged revalidate weather data at ${moment().tz('Asia/Bangkok').format('HH:mm:ss')} with ${count} data revalidated`);
        }
    }, TIME_REVALIDATE);

}