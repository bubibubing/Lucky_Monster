import { Injectable } from '@angular/core';
import { RawShelter } from '../data/raw-shelter';
import { Point } from '../data/loc-query';
import { Shelter } from '../data/shelter';
import { Observable, of } from 'rxjs'; 
import { HttpClient } from '@angular/common/http';

/**
 * This service supports the fetching of bomb shelters in Singapore and is injected when required in a constructor
 */
@Injectable({
  providedIn: 'root'
})
export class ShelterService {

  /**
   * The API where bomb shelters information will be fetched
   */
  shelterApi="https://data.gov.sg/api/action/datastore_search?resource_id=4ee17930-4780-403b-b6d4-b963c7bb1c09";
  /**
   * The API where the address of bomb shelters will be queried
   */
  mapQueryApi="http://nominatim.openstreetmap.org/search?format=json&limit=1&q=";
  /**
   * @ignore
   */
  constructor(private http:HttpClient) { }
  
  /**
   * Get shelter information from API
   * @returns Array of raw shelter information
   */
  getRawShelter():Observable<RawShelter>{
    return this.http.get<RawShelter>(this.shelterApi);
  }

  /**
   * This async function takes the RawShelter object argument, processes the data to find the latitude and longitude for each Shelter location and then adds the Shelter objects (containing all the other Shelter information as well such as name and description) into an array to be returned.
   * @param raw Array of the raw shelter data taken from the API
   * @returns Array of Shelter objects
   */
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
