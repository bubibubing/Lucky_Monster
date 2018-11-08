import { Injectable } from '@angular/core';
import { RawShelter } from '../data/raw-shelter';
import { Point } from '../data/loc-query';
import { Shelter } from '../data/shelter';
import { Observable, of } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  shelterApi="https://data.gov.sg/api/action/datastore_search?resource_id=4ee17930-4780-403b-b6d4-b963c7bb1c09";
  mapQueryApi="http://nominatim.openstreetmap.org/search?format=json&limit=1&q=";
  constructor(private http:HttpClient) { }
  
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
}
