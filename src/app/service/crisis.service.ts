import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Crises, CrisisDetails } from './data/mock-crisis';
import { Crisis, CrisisType } from '../data/crisis';
import { Observable, of } from 'rxjs'; 
import { Point } from '../data/loc-query';

@Injectable({
  providedIn: 'root'
})
export class CrisisService {

  
  crisisTypeApi = "http://172.21.148.165:8000/api/crisis_type";
  crisisApi = "http://172.21.148.165:8000/api/crisis_reports";
  // crisisApi = "http://172.21.148.165/sample.json";
  mapQueryApi="http://nominatim.openstreetmap.org/search?format=json&limit=1&q=";
  constructor(private http:HttpClient) { }

  // getMockCrises():Observable<Crisis[]>{
  //   return of(Crises);
  // }

  getCrisisType():Observable<CrisisType[]>{
    return this.http.get<CrisisType[]>(this.crisisTypeApi);
  }
  getCrisis():Observable<Crisis[]>{
    return this.http.get<Crisis[]>(this.crisisApi);
  }

  async getCrisisAndType():Promise<[CrisisType[], Crisis[]]>{
    const arrs = await Promise.all([this.getCrisisType().toPromise(), this.getCrisis().toPromise()]);
    await new Promise(resolve => setTimeout(resolve, 500));
    return arrs;
  }

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
