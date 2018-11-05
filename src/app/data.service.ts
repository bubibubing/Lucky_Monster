import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Crises, CrisisDetails } from './data/mock-crisis';
import { Crisis, CrisisType } from './data/crisis';
import { Observable, of } from 'rxjs'; 
import { CrisisDetail } from './data/crisis-detail';
import { RawTemp } from './data/raw-weather';
import { Temperature } from './data/weather';
import { RawShelter } from './data/raw-shelter';
import { Point } from './data/loc-query';
import { Shelter } from './data/shelter';
import { RawPsi } from './data/raw-psi';
import { Psi } from './data/psi';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  crisisTypeApi = "http://172.21.148.165:8000/api/crisis_type";
  crisisApi = "http://172.21.148.165:8000/api/crisis_reports";
  // crisisApi = "http://172.21.148.165/sample.json";
  weatherApi = "https://api.data.gov.sg/v1/environment/air-temperature";
  psiApi = "https://api.data.gov.sg/v1/environment/psi";
  shelterApi="https://data.gov.sg/api/action/datastore_search?resource_id=4ee17930-4780-403b-b6d4-b963c7bb1c09";
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

  // getCrisisDetail(id:number):Observable<CrisisDetail>{
  //   return of(CrisisDetails.find(crisis => crisis.id === id));
  // }

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

  getRawShelter():Observable<RawShelter>{
    return this.http.get<RawShelter>(this.shelterApi);
  }

  async parseRawShelter(raw:RawShelter):Promise<Shelter[]>{
    const shelters:Shelter[] = [];
    const records = raw.result.records.filter(r => r.address)
      .map(r => this.http.get<Point[]>(this.mapQueryApi+r.address).toPromise());
    const arrs = await Promise.all(records);
    arrs.forEach((points, i) => {
      const r = raw.result.records[i];
      const loc = points[0];
      if (loc) {
        shelters.push({
          name:r.name, 
          address:r.address, 
          description:r.description,
          location:[loc.lat,loc.lon]
        });
      }
    });
    return shelters;
  }

  getPsi():Observable<RawPsi>{
    return this.http.get<RawPsi>(this.psiApi);
  }

  parseRawPsi(raw:RawPsi):Psi[]{
    const psis:Psi[] = [];
    const reading = raw.items[0].readings.psi_twenty_four_hourly;
    raw.region_metadata.forEach(r =>{
      if(r.label_location.latitude != 0){
        psis.push({name:r.name,
          location:[r.label_location.latitude, r.label_location.longitude],
          value:reading[r.name]});
      };
    });
    // console.log(psis);
    return psis;
  }
}
