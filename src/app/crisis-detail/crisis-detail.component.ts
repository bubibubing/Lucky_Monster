import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CustomMarker } from '../map/custom-marker';
import { DataService } from '../data.service';
import { CrisisDetail } from '../data/crisis-detail';
import { Crisis } from '../data/crisis';

@Component({
  selector: 'app-crisis-detail',
  templateUrl: './crisis-detail.component.html',
  styleUrls: ['./crisis-detail.component.css']
})
export class CrisisDetailComponent implements OnInit, OnChanges {

  @Input() crisis:Crisis;

  constructor(private dataService:DataService) { }

  ngOnInit() {
  }

  ngOnChanges(){
  }
}
