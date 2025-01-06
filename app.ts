import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { LocationService as Location } from "./types/geo";
import { fetchLocationService } from './services/locations.services';
import { weatherService } from './services/weather.services';
import { airQualityService } from './services/airQuality.services';
import moment from 'moment-timezone';
import { Worker, isMainThread, parentPort } from 'worker_threads';
import { redisClient } from './helper/redis';
import { revalidateRedis } from './helper/revalidateRedis';
import { geoFetcher } from './helper/fetcher';


function createWorker(workerId: string, taskName: string) {
    return new Worker(__filename, { workerData: { task: taskName, id: workerId }, name: `Worker ${workerId}` });
}


export let IS_REDIS_HEALTHY = false;


export const setRedisStatus = (status: boolean) => {
    IS_REDIS_HEALTHY = status;
}

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());



app.post('/geo_search', async (req, res) => {
    const { geoQuery } = req.body;

    if (geoQuery === undefined || geoQuery === null || !geoQuery) {
        res.status(400).send({
            message: 'Invalid request',
            data: null
        });
        return
    }

    const data = await geoFetcher(geoQuery);

    if (data) {
        res.status(200).send({
            message: 'Data fetched successfully',
            data
        });
        return
    }



})


app.get('/weather', async (req, res) => {
    const { locationName, manualTimezone, quickRetriveId, latitudeRequest ,longitudeRequest, locationIdRequest, timeZoneRequest } = req.query;
    const isQuickRetriveIdValid = quickRetriveId && await redisClient.get(`location:${quickRetriveId as string}`);

    let longitude =  longitudeRequest
    let latitude = latitudeRequest
    let locationId = locationIdRequest
    let timezone = timeZoneRequest


  if (!isQuickRetriveIdValid && quickRetriveId)  {
        res.status(404).send({
            message: 'Invalid Request Please Provide The Valid QuickRetriveId or try to fetch with out it',
            current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
            data: null
        });
    return
  }

  if (!longitude || !latitude || !locationId) {
        res.status(404).send({
            message: 'Invalid Request',
            current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
            data: null
        });
        return
  }



    const weatherData = await weatherService(
        true,
        locationId,
        {
            long: longitude,
            lat: latitude,
            tz: manualTimezone ? manualTimezone as string : timezone
        }
    );
    if (weatherData) {
        res.status(200).send({
            current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
            message: 'Data fetched successfully',
            data: weatherData
        });
        return
    }

    res.status(500).send({
        message: 'Error fetching data',
        current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
        data: null
    });
});



app.get('/air-quality', async (req, res) => {
    const { locationName, manualTimezone, quickRetriveId, latitudeRequest ,longitudeRequest, locationIdRequest, timeZoneRequest } = req.query;
    const isQuickRetriveIdValid = quickRetriveId && await redisClient.get(`location:${quickRetriveId as string}`);

    let longitude =  longitudeRequest
    let latitude = latitudeRequest
    let locationId = locationIdRequest
    let timezone = timeZoneRequest


  if (!isQuickRetriveIdValid && quickRetriveId)  {
        res.status(404).send({
            message: 'Invalid Request Please Provide The Valid QuickRetriveId or try to fetch with out it',
            current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
            data: null
        });
    return
  }

  if (!longitude || !latitude || !locationId) {
        res.status(404).send({
            message: 'Invalid Request',
            current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
            data: null
        });
        return
  }
    const airQualityData = await airQualityService(true,
        locationId,
        {
            long: longitude,
            lat: latitude,
            tz: manualTimezone ? manualTimezone as string : timezone
        });
    if (airQualityData) {
        res.status(200).send({
            current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
            message: 'Data fetched successfully',
            data: airQualityData
        });
        return
    }

    res.status(500).send({
        message: 'Error fetching data',
        current: moment().tz('Asia/Bangkok').format('HH:mm:ss'),
        data: null
    });
});




if (isMainThread) {
    (async () => {
        app.listen(4100, async () => {
            console.log('Server is running on port 4100');

            const worker = createWorker('1', 'redisRevalidation');
            worker.on('message', (msg) => {
                console.log('Revalidate Workder: ', msg);
            });
        })

    })();

}
else {
    if (parentPort) {
        revalidateRedis(parentPort);
    }
}

