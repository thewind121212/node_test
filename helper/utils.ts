import { WeatherData } from "../types/weather";
import { Worker, workerData} from 'worker_threads';

export const replace = (dataOrigin: any, newData: any) => {
    for (const [key, value] of Object.entries(dataOrigin.current)) {
        if (!dataOrigin.current[key] || (newData.current[key] !== dataOrigin.current[key])) {
            dataOrigin.current[key] = newData.current[key];
        }
    }
    if (dataOrigin.hourly) {
        for (const [key, value] of Object.entries(dataOrigin.hourly)) {
            for (let i = 0; i < (value as any[]).length; i++) {
                if (!dataOrigin.hourly[key][i] || (dataOrigin.hourly[key][i] !== newData.hourly[key][i])) {
                    dataOrigin.hourly[key][i] = newData.hourly[key][i];
                }
            }
        }

    }

    if (dataOrigin.daily) {

        for (const [key, value] of Object.entries(dataOrigin.daily)) {
            for (let i = 0; i < (value as any[]).length; i++) {
                if (!dataOrigin.daily[key][i] || (dataOrigin.daily[key][i] !== newData.daily[key][i])) {
                    dataOrigin.daily[key][i] = newData.daily[key][i];
                }
            }
        }
    }


}

export const checkTime = (oldTimestamp : number, greaterThanMinute: number) : boolean => {
  const currentTimestamp = Date.now(); 
  const timeDifference = currentTimestamp - oldTimestamp; 

  if (timeDifference >= greaterThanMinute * 60 * 1000) {
    return true;
  } else {
    return false;
  }
};