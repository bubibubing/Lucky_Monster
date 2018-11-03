import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Marker, marker, icon, Icon, layerGroup, Layer, LayerGroup, map, LatLng, Map, control, ControlOptions } from 'leaflet'; 
import { DataService } from '../data.service';
import { Crisis } from '../data/crisis';
import { CustomMarker } from './custom-marker';
import { Temperature } from '../data/weather';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  selected:Crisis;
  checked:Crisis[];
  zoom:number = 11;
  center: LatLng;

  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
  }

  streetMap =  tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
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
    // this._ngZone.run(()=>this.selected = null);
    this.selected = null;
  }

  receiveSelect(selected:Crisis){
    this.selected = selected;
    if(this.zoom<15){
      this.zoom = 15;
    }
    this.center = latLng(selected.location[0], selected.location[1]-0.007);
    // console.log(selected);
  }

  receiveCheck(checked:Crisis[]){
    // console.log(checked);
    this.checked = checked;
  }

  onMapReady(map:Map){
    control.zoom({position:'topright'}).addTo(map);
    console.log("113")
  }
}
