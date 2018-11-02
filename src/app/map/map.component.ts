import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, Marker, marker, icon, Icon, layerGroup, Layer, LayerGroup, map, LatLng } from 'leaflet'; 
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
  zoom:number;
  center: LatLng;

  icon:Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })

  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
    // this.initMap();
  }

  // initMap():void{
  //   this.options.layers = [this.streetMap];
  // }

  streetMap =  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    detectRetina: true
  })

  // layersControl = {overlays: {}};

  options = {
    layers: [this.streetMap],
    zoom: 11,
    center: latLng([1.2904753, 103.8520359]),
    doubleClickZoom: false
  };

  mapClick(){
    // this._ngZone.run(()=>this.selected = null);
    this.selected = null;
  }

  receiveSelect(selected:Crisis){
    this.selected = selected;
    this.zoom = 14;
    this.center = latLng(selected.location);
    // console.log(selected);
  }

  receiveCheck(checked:Crisis[]){
    // console.log(checked);
    this.checked = checked;
  }
}
