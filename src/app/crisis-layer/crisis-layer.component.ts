import { Component, OnInit, NgZone, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Crisis } from '../data/crisis';
import { Marker, LayerGroup, icon, Icon, marker, layerGroup, Layer, divIcon } from 'leaflet';
import { DataService } from '../data.service';
import { CustomMarker } from '../map/custom-marker';
import { Temperature } from '../data/weather';
import { Shelter } from '../data/shelter';
import { Psi } from '../data/psi';

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
  selected:Crisis;

  fireMarkers:CustomMarker[] = [];
  gasLeakMarkers:CustomMarker[] = [];
  diseaseMarkers:CustomMarker[] = [];
  otherMarkers:CustomMarker[] = [];
  tempMarkers:Marker[] = [];
  shelterMarkers: Marker[] = [];
  psiMarkers: Marker[] = [];

  empty = layerGroup();
  fireLayer:LayerGroup = this.empty;
  gasLeakLayer:LayerGroup = this.empty;
  diseaseLayer:LayerGroup = this.empty;
  otherLayer:LayerGroup = this.empty;
  tempLayer:LayerGroup;
  shelterLayer: LayerGroup;
  psiLayer: LayerGroup;
  show=false;
  
  crisisByType:Crisis[][] = [[],[],[],[]];
  markers = [{val:this.fireMarkers},{val:this.gasLeakMarkers},{val:this.diseaseMarkers},{val:this.otherMarkers},
    {val:this.tempMarkers}, {val:this.shelterMarkers}, {val:this.psiMarkers}]
  // layers:LayerGroup[] = [this.fireLayer, this.gasLeakLayer, this.diseaseLayer, this.otherLayer, 
  //   this.tempLayer, this.shelterLayer, this.psiLayer];

  checked_names1 = [['Fire',true], ['Gas Leak', true], ['Disease', true], ['Others', true]];
  checked_names2 = [['Temperature',false], ['Shelter', false], ['PSI', false]];
  checked_layers = [{val:this.fireLayer}, {val:this.gasLeakLayer}, {val:this.diseaseLayer}, {val:this.otherLayer}, 
    {val:this.empty}, {val:this.empty}, {val:this.empty}];

  icon:Icon = icon({
    iconSize: [ 25, 41 ],
    iconAnchor: [ 13, 41 ],
    iconUrl: 'leaflet/marker-icon.png',
    shadowUrl: 'leaflet/marker-shadow.png'
  })

  @Output() selectEvent:EventEmitter<Crisis> = new EventEmitter();
  @Output() checkEvent:EventEmitter<Crisis[]> = new EventEmitter();
  
  constructor(private dataService:DataService, private _ngZone:NgZone) { }

  ngOnInit() {
    this.getCrises();
    this.getTemps();
    // this.getShelters();
    this.getPsi();
  }
  
  ngOnChanges(){
  }
  
  async getCrises(){
    // this.dataService.getCrises().subscribe(crises => {
    //   crises.forEach(c => {
    //     this.checked.push(c);
    //     this.crises.push(c);
    //   });
    //   this.checkEvent.emit(this.checked);
    //   this.initCrisisLayers();
      // console.log("checked crisis init");
      // console.log(this.checked);
    // });
    const arrs = await this.dataService.getCrisisAndType();
    const c_ = await this.dataService.parseCrisisAndType(arrs[0],arrs[1]);
    c_.forEach(c => this.crises.push(c));
    console.log(this.crises);
    this.initCrisisLayers();
  }

  getTemps(){
    this.dataService.getTemperature().subscribe(raw => {
      this.dataService.parseRawWeather(raw).forEach(t => this.temps.push(t));
      // console.log(this.temps);
      this.initTempLayer();
    });
  }

  getShelters(){
    this.dataService.getRawShelter().subscribe(async (raw) => {
      const shelters = await this.dataService.parseRawShelter(raw);
      shelters.forEach(s => this.shelters.push(s));
      // console.log(this.shelters);
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

  initCrisisLayers():void{
    // this.emptyAll();
    this.crises.forEach( crisis => {
      var marker:CustomMarker = new CustomMarker(crisis.location, crisis.id).bindPopup(crisis.description);
      marker.on("click", ()=>{this.onClickMarker(marker)});
      switch(crisis.type){
        case "Fire":
          this.fireMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[0].push(crisis);
          break;
        case "Gas Leak":
          this.gasLeakMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[1].push(crisis);
          break;
        case "Disease":
          this.diseaseMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[2].push(crisis);
          break;
        default:
          this.otherMarkers.push(marker.setIcon(this.icon));
          this.crisisByType[3].push(crisis);
      };
    });

    this.fireLayer = layerGroup(this.fireMarkers);
    this.gasLeakLayer = layerGroup(this.gasLeakMarkers);
    this.diseaseLayer = layerGroup(this.diseaseMarkers);
    this.otherLayer = layerGroup(this.otherMarkers);
    console.log(this);
    this.checked_layers = [{val:this.fireLayer}, {val:this.gasLeakLayer}, {val:this.diseaseLayer}, {val:this.otherLayer}, 
      {val:this.empty}, {val:this.empty}, {val:this.empty}];
    this.checkEvent.emit(this.crises);
  }
  
  initTempLayer(){
    this.temps.forEach(temp =>{
      this.tempMarkers.push(marker(temp.location, {icon:divIcon({html:temp.value.toString()+" °C"})}))
    });
    this.tempLayer = layerGroup(this.tempMarkers);
  }

  initShelterLayer(){
    this.shelters.forEach(shelter =>{
      this.shelterMarkers.push(marker(shelter.location, {icon:this.icon}).bindPopup(shelter.name + ":" + shelter.description));
    });
    this.shelterLayer = layerGroup(this.shelterMarkers);
  }

  initPsiLayer(){
    this.psis.forEach(psi =>{
      this.psiMarkers.push(marker(psi.location, {icon:divIcon({html:psi.value.toString()})}));
    });
    // console.log(this.psis);
    this.psiLayer = layerGroup(this.psiMarkers);
  }

  onClickMarker(marker:CustomMarker){
    this._ngZone.run(()=>{
        this.selected = this.crises.find(
        (c)=>c.id===marker.id
        );
        this.selectEvent.emit(this.selected);
        // console.log(this.selected);
      });
  }

  onClickCheckbox1(index:number){
    if(this.checked_names1[index][1]===true){
      this.checked_names1[index][1]=false;
      this.checked_layers[index].val = this.empty;
    }
    else{
      this.checked_names1[index][1]=true;
      this.checked_layers[index].val = layerGroup(this.markers[index].val);
      // console.log(this.markers[index].val);
    }
    this.checked = [];
    this.checked_names1.forEach((item, i)=>{
      if(item[1]){
        this.checked = this.checked.concat(this.crisisByType[i]);
      }
    });
    this.checkEvent.emit(this.checked);
  }

  onClickCheckbox2(index:number){
    if(this.checked_names2[index][1]===true){
      this.checked_names2[index][1]=false;
      this.checked_layers[index+this.checked_names1.length].val = this.empty;
      // console.log(this.checked_layers[index+this.checked_names1.length]);
    }
    else{
      this.checked_names2[index][1]=true;
      this.checked_layers[index+this.checked_names1.length].val = layerGroup(this.markers[index+this.checked_names1.length].val);
      // console.log(this.checked_layers[index+this.checked_names1.length].val);
      // console.log(this.markers[index].val);
    }
  }

  forceFocus() {
    setTimeout(()=>this.show = true, 1);
  }
}
