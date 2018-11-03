import { Icon, icon, divIcon } from "leaflet";

export class Util{
    static icon:Icon = icon({
        iconSize: [ 30, 30 ],
        popupAnchor:[0, -22],
        iconUrl: 'assets/placeholder.jpg',
      });
    
     static fireIcon:Icon = icon({
        iconSize:[30, 30],
        popupAnchor:[0, -22],
        iconUrl:'assets/fire.png',
      });
    
     static gasLeakIcon:Icon = icon({
        iconSize:[30,30],
        // iconAnchor: [13,41],
        popupAnchor:[0, -22],
        iconUrl:'assets/gas-mask.png',
      });
    
    static  diseaseIcon:Icon = icon({
        iconSize:[30,30],
        popupAnchor:[0, -22],
        iconUrl:'assets/virus.png',
      });
    
     static shelterIcon:Icon = icon({
        iconSize:[30,30],
        popupAnchor:[0, -22],
        iconUrl:'assets/tent.png',
      });
}