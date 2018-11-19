import { Component, OnInit, NgZone, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { Crisis } from '../data/crisis';
import { Marker, LayerGroup, icon, Icon, marker, layerGroup, Layer, divIcon, Point } from 'leaflet';
import { CustomMarker } from '../map/custom-marker';
import { Temperature } from '../data/weather';
import { Shelter } from '../data/shelter';
import { Psi } from '../data/psi';
import { Util } from './icon-util';
import { CrisisService } from '../service/crisis.service';
import { WeatherService } from '../service/weather.service';
import { PsiService } from '../service/psi.service';
import { ShelterService } from '../service/shelter.service';

@Component({
  selector: 'app-crisis-layer',
  templateUrl: './crisis-layer.component.html',
  styleUrls: ['./crisis-layer.component.css']
})
export class CrisisLayerComponent implements OnInit {
  /**
   * Array of all crisis reports
   */
  crises:Crisis[] = [];
  /**
   * Array of Temperature objects
   */
  temps:Temperature[] = [];
  /**
   * Array of Shelter objects
   */
  shelters:Shelter[] =[];
  /**
   * Array of PSI objects
   */
  psis:Psi[] = [];
  /**
   * Array of crisis of checked crisis types in the checkboxes
   */
  checked:Crisis[] = [];
  /**
   * Selected crisis of the selected marker or from crisis-list component
   */
  @Input() selected:Crisis;
  /**
   * Coordinates of user location
   */
  userLocation:[number,number];


  fireMarkers:CustomMarker[] = [];
  explosionMarkers:CustomMarker[] = [];
  gasLeakMarkers:CustomMarker[] = [];
  diseaseMarkers:CustomMarker[] = [];
  otherMarkers:CustomMarker[] = [];
  tempMarkers:Marker[] = [];
  shelterMarkers: Marker[] = [];
  psiMarkers: Marker[] = [];
  /**
   * Empty layergroup which can be used to clear a layer of markers
   */
  empty = layerGroup();
  /**
   * Control the display of dropdown menu where user can check boxes of crisis types and other info 
   */
  show=false;
  
  crisisByType:Crisis[][] = [[],[],[],[],[]];
  markers = [{val:this.fireMarkers},{val:this.explosionMarkers},{val:this.gasLeakMarkers},{val:this.diseaseMarkers},{val:this.otherMarkers},
    {val:this.tempMarkers}, {val:this.shelterMarkers}, {val:this.psiMarkers}]
  /**
   * First section of checkbox names and their default value
   */
  checked_names1 = [['Fire',true],['Explosion', true], ['Gas Leak', true], ['Disease', true], ['Others', true]];
  /**
   * Second section of checkbox names and their default value
   */
  checked_names2 = [['Temperature',false], ['Shelter', false], ['PSI', false]];
  /**
   * All layers to be displayed on map. Its value can be changed to change the markers displayed
   */
  checked_layers = [{val:this.empty}, {val:this.empty}, {val:this.empty}, {val:this.empty}, {val:this.empty},
    {val:this.empty}, {val:this.empty}, {val:this.empty}, {val:this.empty}];
  /**
   * EventEmitter for marker click event, selecting the crisis marker
   */
  @Output() selectEvent:EventEmitter<Crisis> = new EventEmitter();
  /**
   * EventEmitter for checkbox click event, selecting displayed layer of markers
   */
  @Output() checkEvent:EventEmitter<Crisis[]> = new EventEmitter();
  /**
   * EventEmitter for crisis fetching finish event
   */
  @Output() checkReadyEvent: EventEmitter<boolean> = new EventEmitter();
  /**
   * EventEmitter for user location ready event
   */
  @Output() locationEvent: EventEmitter<[number,number]> = new EventEmitter();
  
  /**
   * @ignore
   */
  constructor(private crisisService:CrisisService,
    private weatherService:WeatherService,
    private psiService:PsiService,
    private shelterService:ShelterService,
    private _ngZone:NgZone) { }

  /**
   * Initialize the component after Angular first displays the data-bound properties and sets the component's input properties. Called once
   */
  ngOnInit() {
    this.getCrises();
    this.getTemps();
    // this.getShelters();
    this.getPsi();
    this.getUserLocation();
  }
  /**
   * This function makes use of the getCrisisAndType() function, parses the variables returned into the parseCrisisAndType(type, crisis) function and adds each of the Crisis object into an array of Crisis objects named “crises” . Afterwards, the initCrisisLayers() function is called.
   */
  async getCrises(){
    const arrs = await this.crisisService.getCrisisAndType();
    const c_ = await this.crisisService.parseCrisisAndType(arrs[0],arrs[1]);
    c_.forEach(c => this.crises.push(c));
    this.initCrisisLayers();
    this.checkReadyEvent.emit(true);
  }
  /**
   * This function makes use of the getTemperature() function, parses the variable returned into the parseRawWeather(raw) function and adds each of the Weather object into an array of Weather objects named “temps” . Afterwards, the initTempLayer() function is called.
   */
  getTemps():void{
    this.weatherService.getTemperature().subscribe(raw => {
      this.weatherService.parseRawWeather(raw).forEach(t => this.temps.push(t));
      this.initTempLayer();
    });
  }
  /**
   * This function makes use of the getRawShelter() function, parses the variable returned into the parseRawShelter(raw) function and adds each of the Shelter object into an array of Shelter objects named “shelters” . Afterwards, the initShelterLayer() function is called.
   */
  async getShelters(){
    this.shelterService.getRawShelter().subscribe(async (raw) => {
      const shelters = await this.shelterService.parseRawShelter(raw);
      shelters.forEach(s => this.shelters.push(s));
      this.initShelterLayer();
    })
  }
  /**
   * This function makes use of the getPsi() function, parses the variable returned into the parseRawPsi(raw) function and adds each of the Psi object into an array of Psi objects named “psis” . Afterwards, initPsiLayer() function is called.
   */
  getPsi():void{
    this.psiService.getPsi().subscribe(raw =>{
      // console.log(raw);
      this.psiService.parseRawPsi(raw).forEach(p => this.psis.push(p));
      this.initPsiLayer();
    });
  }
  /**
   * This function grabs the user’s current location and the position is parsed into the initUserLocation(position) function to carry out the function.
   */
  getUserLocation():void{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {this.initUserLocation(position)});
    }
  }
  /**
   * For each Crisis object in the crisis array, this function creates a marker with the icon for the crisis type of the crisis and place it onto the map based on the location of the crisis and bind a popup to the crisis with the description of the crisis. Each of the markers are then pushed into an array of custom markers named after their crisis type, for example "fireMarkers".
   */
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
        case "Explosion":
          this.explosionMarkers.push(marker.setIcon(Util.bombIcon));
          this.crisisByType[1].push(crisis);
          break;
        case "Gas Leak":
          this.gasLeakMarkers.push(marker.setIcon(Util.gasLeakIcon));
          this.crisisByType[2].push(crisis);
          break;
        case "Disease":
          this.diseaseMarkers.push(marker.setIcon(Util.diseaseIcon));
          this.crisisByType[3].push(crisis);
          break;
        default:
          this.otherMarkers.push(marker.setIcon(Util.icon));
          this.crisisByType[4].push(crisis);
      };
    });

    this.checked_layers[0].val = layerGroup(this.fireMarkers);
    this.checked_layers[1].val = layerGroup(this.explosionMarkers);
    this.checked_layers[2].val = layerGroup(this.gasLeakMarkers);
    this.checked_layers[3].val = layerGroup(this.diseaseMarkers);
    this.checked_layers[4].val = layerGroup(this.otherMarkers);

    this.checked = this.crises;
    this.checked.sort((a, b)=> a.type>b.type?1:-1);
    this.checkEvent.emit(this.checked);
  }
  /**
   * For each Temperature object in the temp array, this function creates a marker with the reading of the temperature as text in replace of an icon and place it onto the map based on the location of the temperature. Each of the markers are then pushed into an array of markers named "tempMarkers".
   */
  initTempLayer(){
    this.temps.forEach(temp =>{
      this.tempMarkers.push(marker(temp.location, {icon:divIcon({html:temp.value.toString()+" °C", className:"temperature", iconSize:new Point(50,20)})}))
    });
  }
  /**
   * For each Shelter object in the shelter array, this function creates a marker with the shelter icon and place it onto the map based on the location of the shelter and bind a popup to the shelter with the shelter name, description and a link directing to the shelter. Each of the markers are then pushed into an array of markers named "shelterMarkers".
   */
  initShelterLayer(){
    this.shelters.forEach(shelter =>{
      const m:Marker = marker(shelter.location, {icon:Util.shelterIcon});
      const display = shelter.name + ":"+shelter.description; 
      const link = 'https://www.google.com/maps/dir/?api=1&destination='+shelter.location[0] + ',' +shelter.location[1];
      m.bindPopup('<div class="shelter-text">'+display+'</div><a href=' + link +' target="_blank">Direction</a>');
      this.shelterMarkers.push(m);
    });
  }
  /**
   * For each Psi object in the psi array, this function creates a marker with the reading of the psi as text in replace of an icon and place it onto the map based on the location of the psi. Each of the markers are then pushed into an array of markers named "psiMarkers".
   */
  initPsiLayer(){
    this.psis.forEach(psi =>{
      this.psiMarkers.push(marker(psi.location, {icon:divIcon({html:psi.value.toString(), className:"psi", iconSize:new Point(30,30)})}));
    });
  }
  /**
   * This function takes the position argument, creates a marker with the user icon and places it onto the map based on the position’s location and binds a popup with the text “Your Current Location”.
   * @param position The user’s current location
   */
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
  /**
   * Event handler. When a marker is clicked on, this function finds the corresponding crisis report, and then emits it as the selected crisis to its parent
   * @param marker Selected marker
   */
  onClickMarker(marker:CustomMarker){
    this._ngZone.run(()=>{
        const c = this.crises.find(
        (c)=>c.id===marker.id
        );
        this.selectEvent.emit(c);
      });
    // marker.openPopup();
  }
  /**
   * Event handler. Triggered when first section of checkbox is clicked. Depending on the checkbox selected, which corresponds to a type of crisis, this function displays only the crisis with the selected crisis type on the map and crisis list.
   * @param index Index of checkbox which is clicked
   */
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
  /**
   * Event handler. Triggered when second section of checkbox is clicked. Depending on the checkbox selected, which corresponds to the other 3 types of data (temperature, shelter, psi), this function displays only the selected type of data on the map.
   * @param index Index of checkbox which is clicked
   */
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

  /**
   * Enforce the display of dropdown menu
   */
  forceFocus() {
    setTimeout(()=>this.show = true, 1);
  }
}
