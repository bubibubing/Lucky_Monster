import { Component, OnInit, Input, OnChanges, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { CustomMarker } from '../map/custom-marker';
import { DataService } from '../data.service';
import { CrisisDetail } from '../data/crisis-detail';
import { Crisis } from '../data/crisis';
import { trigger, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-crisis-detail',
  templateUrl: './crisis-detail.component.html',
  styleUrls: ['./crisis-detail.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-20%)', opacity: 0}),
        animate('0.15s ease', style({transform: 'translateY(0%)', opacity:1}))
      ]),
      transition(':leave', [
        animate('0.15s ease', style({transform: 'translateY(-20%)', opacity:0}))
      ])
    ])
  ]
})
export class CrisisDetailComponent implements OnInit, OnChanges {

  @Input() crisis:Crisis;

  constructor(private dataService:DataService, private ref:ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(){
    this.ref.nativeElement.scrollIntoView();
  }
}
