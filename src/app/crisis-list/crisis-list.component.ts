import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Crisis } from '../data/crisis';
import {MatCardModule} from '@angular/material/card';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-crisis-list',
  templateUrl: './crisis-list.component.html',
  styleUrls: ['./crisis-list.component.css'],
  animations:[
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(50%)', opacity: 0}),
        animate('0.2s ease', style({transform: 'translateY(0%)', opacity:1}))
      ]),
      transition(':leave', [
        animate('0.2s ease', style({transform: 'translateY(50%)', opacity:0}))
      ])
    ])
  ]
})
export class CrisisListComponent implements OnInit {

  @Input() checked:Crisis[];
  @Input() selected:Crisis;
  @Output() clicked: EventEmitter<Crisis> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClick(crisis:Crisis){
    this.clicked.emit(crisis);
  }

}
