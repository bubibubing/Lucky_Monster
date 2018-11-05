import { Icon, icon, divIcon } from "leaflet";

export class Util{
    static icon:Icon = icon({
        iconSize: [ 20, 20 ],
        popupAnchor:[0, -15],
        iconUrl: 'assets/placeholder.jpg',
      });
    
     static fireIcon:Icon = icon({
        iconSize:[20, 20],
        popupAnchor:[0, -15],
        iconUrl:'assets/fire.png',
      });
    
     static gasLeakIcon:Icon = icon({
        iconSize:[20,20],
        // iconAnchor: [13,41],
        popupAnchor:[0, -15],
        iconUrl:'assets/poison.png',
      });
    
    static  diseaseIcon:Icon = icon({
        iconSize:[20,20],
        popupAnchor:[0, -15],
        iconUrl:'assets/bio.png',
      });
    
     static shelterIcon:Icon = icon({
        iconSize:[20,20],
        popupAnchor:[0, -15],
        iconUrl:'assets/tent.png',
      });

      static userIcon:Icon = icon({
        iconSize:[20,20],
        popupAnchor:[0, -15],
        iconUrl:'assets/circle.png'
      })
}