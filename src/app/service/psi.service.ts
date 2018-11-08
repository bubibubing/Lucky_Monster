import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs'; 
import { RawPsi } from '../data/raw-psi';
import { Psi } from '../data/psi';
@Injectable({
  providedIn: 'root'
})
export class PsiService {
  psiApi = "https://api.data.gov.sg/v1/environment/psi";

  constructor(private http:HttpClient) { }
  
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
