import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Crises, CrisisDetails } from './data/mock-crisis';
import { Observable, of } from 'rxjs'; 
import { RawTemp } from '../data/raw-weather';
import { Temperature } from '../data/weather';
/**
 * This service supports the fetching of weather-related data and is injected when required in the constructor
 */
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  /**
   * @ignore
   */
  constructor(private http:HttpClient) { }
  /**
   * The API where the temperature across Singapore will be fetched
   */
  weatherApi = "https://api.data.gov.sg/v1/environment/air-temperature";

  /**
   * This function gets Raw Temperature data from API
   * @returns Raw temperature data
   */
  getTemperature():Observable<RawTemp>{
    return this.http.get<RawTemp>(this.weatherApi);
  }

  /**
   * This function takes the RawTemp object argument, processes the data such that each Temperature object contains the location of the station and also the temperature reading and then adds the Temperature objects into an array to be returned.
   * @param raw Raw weather data taken from the API
   */
  parseRawWeather(raw: RawTemp):Temperature[]{
    var temps:Temperature[] = [];
    raw.metadata.stations.forEach((station) =>{
      raw.items[0].readings.forEach((reading) =>{
        if(station.id === reading.station_id){
          temps.push({location:[station.location.latitude,station.location.longitude], value: reading.value});
        }
      })
    });
    // console.log(temps);
    return temps;
  }
}
