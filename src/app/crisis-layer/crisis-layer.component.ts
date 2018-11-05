import { Component, OnInit, NgZone, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Crisis } from '../data/crisis';
import { Marker, LayerGroup, icon, Icon, marker, layerGroup, Layer, divIcon, Point } from 'leaflet';
import { DataService } from '../data.service';
import { CustomMarker } from '../map/custom-marker';
import { Temperature } from '../data/weather';
import { Shelter } from '../data/shelter';
import { Psi } from '../data/psi';
import { Util } from './icon-util';

@Component({
  selector: 'app-crisis-layer',
  templateUrl: './crisis-layer.component.html',
  styleUrls: ['./crisis-layer.component.css']
})
export class CrisisLayerComponent implements OnInit, OnChanges {

  crises:Crisis[] = [];
  temps:Temperature[] = [];
  shelters:Shelter[] =[];
  psis:Psi[] = [];
  checked:Crisis[] = [];
  @Input() selected:Crisis;
  userLocation:[number,number];

  fireMarkers:CustomMarker[] = [];
  gasLeakMarkers:CustomMarker[] = [];
  diseaseMarkers:CustomMarker[] = [];
  otherMarkers:CustomMarker[] = [];
  tempMarkers:Marker[] = [];
  shelterMarkers: Marker[] = [];
  psiMarkers: Marker[] = [];

  empty = layerGroup();

  show=false;
  
  crisisByType:Crisis[][] = [[],[],[],[]];
  markers = [{val:this.fireMarkers},{val:this.gasLeakMarkers},{val:this.diseaseMarkers},{val:this.otherMarkers},
    {val:this.tempMarkers}, {val:this.shelterMarkers}, {val:this.psiMarkers}]

  checked_names1 = [['Fire',true], ['Gas Leak', true], ['Disease', true], ['Others', true]];
  checked_names2 = [['Temperature',false], ['Shelter', false], ['PSI', false]];
  checked_layers = [{val:this.empty}, {val:this.empty}, {val:this.empty}, {val:this.empty}, 
    {val:this.empty}, {val:this.empty}, {val:this.empty}, {val:this.empty}];

  @Output() selectEvent:EventEmitter<Crisis> = new EventEmitter();
  @Output() checkEvent:EventEmitter<Crisis[]> = new EventEmitter();
  @Output() checkReadyEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() locationEvent: EventEmitter<[number,number]> = new EventEmitter();
  
  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
    this.getCrises();
    this.getTemps();
    // this.getShelters();
    this.getPsi();
    this.getUserLocation();
  }
  
  ngOnChanges(){
  }
  
  async getCrises(){
    const arrs = await this.dataService.getCrisisAndType();
    const c_ = await this.dataService.parseCrisisAndType(arrs[0],arrs[1]);
    c_.forEach(c => this.crises.push(c));
    this.initCrisisLayers();
    this.checkReadyEvent.emit(true);
  }

  getTemps(){
    this.dataService.getTemperature().subscribe(raw => {
      this.dataService.parseRawWeather(raw).forEach(t => this.temps.push(t));
      this.initTempLayer();
    });
  }

  getShelters(){
    this.dataService.getRawShelter().subscribe(async (raw) => {
      const shelters = await this.dataService.parseRawShelter(raw);
      shelters.forEach(s => this.shelters.push(s));
      this.initShelterLayer();
    })
  }

  getPsi(){
    this.dataService.getPsi().subscribe(raw =>{
      // console.log(raw);
      this.dataService.parseRawPsi(raw).forEach(p => this.psis.push(p));
      this.initPsiLayer();
    });
  }

  getUserLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {this.initUserLocation(position)});
    }
  }

  initCrisisLayers():void{
    this.crises.forEach( crisis => {
      var marker:CustomMarker = new CustomMarker(crisis.location, crisis.id).bindPopup(crisis.description);
      marker.on("click", ()=>{this.onClickMarker(marker)});
      // marker.on("mouseover", ()=>marker.openPopup());
      // marker.on("mouseout", ()=>marker.closePopup());
      switch(crisis.type){
        case "Fire":
          this.fireMarkers.push(marker.setIcon(Util.fireIcon));
          this.crisisByType[0].push(crisis);
          break;
        case "Gas Leak":
          this.gasLeakMarkers.push(marker.setIcon(Util.gasLeakIcon));
          this.crisisByType[1].push(crisis);
          break;
        case "Disease":
          this.diseaseMarkers.push(marker.setIcon(Util.diseaseIcon));
          this.crisisByType[2].push(crisis);
          break;
        default:
          this.otherMarkers.push(marker.setIcon(Util.icon));
          this.crisisByType[3].push(crisis);
      };
    });

    this.checked_layers[0].val = layerGroup(this.fireMarkers);
    this.checked_layers[1].val = layerGroup(this.gasLeakMarkers);
    this.checked_layers[2].val = layerGroup(this.diseaseMarkers);
    this.checked_layers[3].val = layerGroup(this.otherMarkers);

    this.checked = this.crises;
    this.checked.sort((a, b)=> a.type>b.type?1:-1);
    this.checkEvent.emit(this.checked);
  }
  
  initTempLayer(){
    this.temps.forEach(temp =>{
      this.tempMarkers.push(marker(temp.location, {icon:divIcon({html:temp.value.toString()+" °C", className:"temperature", iconSize:new Point(50,20)})}))
    });
  }

  initShelterLayer(){
    this.shelters.forEach(shelter =>{
      const m:Marker = marker(shelter.location, {icon:Util.shelterIcon});
      const display = shelter.name + ":"+shelter.description; 
      const link = 'https://www.google.com/maps/dir/?api=1&destination='+shelter.location[0] + ',' +shelter.location[1];
      m.bindPopup('<div class="shelter-text">'+display+'</div><a href=' + link +' target="_blank">Direction</a>');
      this.shelterMarkers.push(m);
    });
  }

  initPsiLayer(){
    this.psis.forEach(psi =>{
      this.psiMarkers.push(marker(psi.location, {icon:divIcon({html:psi.value.toString(), className:"psi", iconSize:new Point(30,30)})}));
    });
  }

  initUserLocation(position:Position){
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const m:Marker = marker([lat, lon], {icon:Util.userIcon}).bindPopup("Your Current Location");
    m.on('mouseover', ()=> m.openPopup());
    m.on('mouseout', ()=>m.closePopup());
    this.checked_layers[this.checked_layers.length-1].val = layerGroup([m]);
    this.userLocation = [lat, lon];
    this.locationEvent.emit([lat,lon]);
  }

  onClickMarker(marker:CustomMarker){
    this._ngZone.run(()=>{
        const c = this.crises.find(
        (c)=>c.id===marker.id
        );
        this.selectEvent.emit(c);
      });
    // marker.openPopup();
  }

  onClickCheckbox1(index:number){
    if(this.checked_names1[index][1]===true){
      this.checked_names1[index][1]=false;
      this.checked_layers[index].val = this.empty;
    }
    else{
      this.checked_names1[index][1]=true;
      this.checked_layers[index].val = layerGroup(this.markers[index].val);
    }
    this.checked.length = 0;
    this.checked_names1.forEach((item, i)=>{
      if(item[1]){
        this.crisisByType[i].forEach(c => this.checked.push(c));
      }
    })
    this.checked.sort((a, b)=> a.type>b.type?1:-1);
    this.checkEvent.emit(this.checked);
  }

  onClickCheckbox2(index:number){
    if(this.checked_names2[index][1]===true){
      this.checked_names2[index][1]=false;
      this.checked_layers[index+this.checked_names1.length].val = this.empty;
    }
    else{
      this.checked_names2[index][1]=true;
      this.checked_layers[index+this.checked_names1.length].val = layerGroup(this.markers[index+this.checked_names1.length].val);
    }
  }

  forceFocus() {
    setTimeout(()=>this.show = true, 1);
  }
}
