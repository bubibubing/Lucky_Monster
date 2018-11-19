import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Crises, CrisisDetails } from './data/mock-crisis';
import { Crisis, CrisisType } from '../data/crisis';
import { Observable, of } from 'rxjs'; 
import { Point } from '../data/loc-query';

/**
 * This service supports the fetching of crisis reports data and is injected when required in the constructor
 */
@Injectable({
  providedIn: 'root'
})
export class CrisisService {

  /**
   * The API where crisis type will be fetched
   */
  crisisTypeApi = "http://172.21.148.165:8000/api/crisis_type";
  /**
   * The API where crisis reports will be fetched
   */
  crisisApi = "http://172.21.148.165:8000/api/crisis_reports";
  // crisisApi = "http://172.21.148.165/sample.json";
  /**
   * The API where the address of the crisis report will be queried
   */
  mapQueryApi="http://nominatim.openstreetmap.org/search?format=json&limit=1&q=";
  /**
   * @ignore
   */
  constructor(private http:HttpClient) { }

  /**
   * Get crisis type from the call centre
   * @returns Array of crisis type with id and its name
   */
  getCrisisType():Observable<CrisisType[]>{
    return this.http.get<CrisisType[]>(this.crisisTypeApi);
  }
  /**
   * Get crisis reports from the call centre
   * @returns Array of crisis reports with id and details
   */
  getCrisis():Observable<Crisis[]>{
    return this.http.get<Crisis[]>(this.crisisApi);
  }

  /**
   * Async function to get crisis type and reports from respective APIs at the same time
   */
  async getCrisisAndType():Promise<[CrisisType[], Crisis[]]>{
    const arrs = await Promise.all([this.getCrisisType().toPromise(), this.getCrisis().toPromise()]);
    return arrs;
  }
  /**
   * This async function takes the array arguments, processes the data such that each Crisis corresponds to its respective CrisisType, finds the latitude and longitude for each Crisis location and then adds the Crisis objects into an array to be returned.
   * @param type Array of crisis types with id and names
   * @param crisis Array of raw crisis reports
   * @returns Array of parsed crisis reports
   */
  async parseCrisisAndType(type:CrisisType[], crisis:Crisis[]):Promise<Crisis[]>{
    crisis.forEach(c=>{
      type.forEach(t =>{
        if(c.crisis_type === t.id){
          c.type = t.crisis_type;
        }
      });
      c.datetime = new Date(c.create_date_time);
    });
    const promises = crisis.map(c =>
      this.http.get<Point[]>(this.mapQueryApi+c.street_name+" singapore").toPromise());
    const arrs = await Promise.all(promises);
    arrs.forEach((points, i)=>{
      const loc = points[0];
      const c = crisis[i];
      if(loc){
        c.location = [loc.lat, loc.lon];
      }
    });
    return crisis.filter(c => c.location);
  }

}
