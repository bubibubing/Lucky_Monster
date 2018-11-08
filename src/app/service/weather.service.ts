import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Crises, CrisisDetails } from './data/mock-crisis';
import { Observable, of } from 'rxjs'; 
import { RawTemp } from '../data/raw-weather';
import { Temperature } from '../data/weather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http:HttpClient) { }

  weatherApi = "https://api.data.gov.sg/v1/environment/air-temperature";


  getTemperature():Observable<RawTemp>{
    return this.http.get<RawTemp>(this.weatherApi);
  }

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
