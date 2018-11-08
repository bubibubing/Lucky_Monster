import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, LatLng, Map, control } from 'leaflet'; 
import { Crisis } from '../data/crisis';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  selected:Crisis;
  checked:Crisis[];
  checkReady:boolean;
  zoom:number = 11;
  center: LatLng;

  constructor(private _ngZone:NgZone) { }

  ngOnInit() {
  }

  streetMap =  tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; OpenStreetMap contributors',
    detectRetina: true,
    zoomOffset:-1,
    tileSize:512
  })

  options = {
    layers: [this.streetMap],
    zoom: 11,
    center: latLng([1.320, 103.815]),
    doubleClickZoom: false,
    zoomControl:false
    };

  mapClick(){
    this.selected = null;
  }

  receiveMapSelect(selected:Crisis){
    this.selected = selected;
    if(this.zoom<15){
      this.zoom = 15;
      this.center = latLng(selected.location[0], selected.location[1]-0.007);
    }
    // console.log(selected);
  }

  receiveListSelect(selected:Crisis){
    this.selected = selected;
    this.zoom = 15;
    this.center = latLng(selected.location[0], selected.location[1]-0.007);
  }

  receiveCheck(checked:Crisis[]){
    // console.log(checked);
    this.checked = checked;
  }

  onCheckReady(ready:boolean){
    this.checkReady = ready;
  }

  onMapReady(map:Map){
    control.zoom({position:'topright'}).addTo(map);
    console.log("113")
  }
}
