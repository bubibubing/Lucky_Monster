import { Component, OnInit, NgZone } from '@angular/core';
import { tileLayer, latLng, LatLng, Map, control } from 'leaflet'; 
import { Crisis } from '../data/crisis';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  /**
   * Selected crisis received from clicked marker on the map or clicked crisis report in crisis list 
   */
  selected:Crisis;
  /**
   * Array of crisis of checked crisis types received from the filter where user will filter the crisis displayed
   */
  checked:Crisis[];
  /**
   * The value indicates whether crisis report fetching is finished, deciding whether load spinner is displayed
   */
  checkReady:boolean;
  /**
   * Zoom level of the map. Default is 11
   */
  zoom:number = 11;
  /**
   * Coordinates of the centre of the map
   */
  center: LatLng;

  /**
   * @ignore
   */
  constructor(private _ngZone:NgZone) { }
  /**
   * @ignore
   */
  ngOnInit() {
  }
  /**
   * Default base map
   */
  streetMap =  tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; OpenStreetMap contributors',
    detectRetina: true,
    zoomOffset:-1,
    tileSize:512
  })
  /**
   * Default setting for displaying base map
   */
  options = {
    layers: [this.streetMap],
    zoom: 11,
    center: latLng([1.320, 103.815]),
    doubleClickZoom: false,
    zoomControl:false
    };
  /**
   * Event handler. Clear the selected crisis. Executed when map click event is triggered
   */
  mapClick(){
    this.selected = null;
  }
  /**
   * Event handler. Set the selected crisis and zoom in to it if requied. Executed when marker click event is triggered
   * @param selected Selected crisis
   */
  receiveMapSelect(selected:Crisis){
    this.selected = selected;
    if(this.zoom<15){
      this.zoom = 15;
      this.center = latLng(selected.location[0], selected.location[1]-0.007);
    }
  }
  /**
   * Event handler. Set the selected crisis and always zoom in to it. Executed when sidebar slide event is triggered
   * @param selected Selected crisis
   */
  receiveListSelect(selected:Crisis){
    this.selected = selected;
    this.zoom = 15;
    this.center = latLng(selected.location[0], selected.location[1]-0.007);
  }
  /**
   * Event handler. Set the array of checked crisis types which will be displayed in sidebar. Executed when checkbox check event is triggered
   * @param checked Array of checked crisis types
   */
  receiveCheck(checked:Crisis[]){
    // console.log(checked);
    this.checked = checked;
  }
  /**
   * Event handler. Set the checkReady property
   */
  onCheckReady(ready:boolean){
    this.checkReady = ready;
  }
  /**
   * @ignore
   */
  onMapReady(map:Map){
    control.zoom({position:'topright'}).addTo(map);
    console.log("113")
  }
}
