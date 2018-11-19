import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; 
import { RawPsi } from '../data/raw-psi';
import { Psi } from '../data/psi';
/**
 * This service supports the fetching of PSI readings and is injected when required in the constructor
 */
@Injectable({
  providedIn: 'root'
})
export class PsiService {
  /**
   * The API where PSI readings will be fetched
   */
  psiApi = "https://api.data.gov.sg/v1/environment/psi";

  /**
   * @ignore
   */
  constructor(private http:HttpClient) { }
  /**
   * Get PSI readings from API
   * @returns Array of raw PSI readings
   */
  getPsi():Observable<RawPsi>{
    return this.http.get<RawPsi>(this.psiApi);
  }

  /**
   * This function takes the RawShelter object argument, processes the data such that each Psi object contains the location and reading of the psi and then adds the Psi objects into an array to be returned.
   * @param raw raw PSI readings that are previously fetched 
   */
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
