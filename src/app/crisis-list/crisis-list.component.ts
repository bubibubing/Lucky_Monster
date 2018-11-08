import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Crisis } from '../data/crisis';
import {MatCardModule} from '@angular/material/card';
import { Observable } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * This component displays the sidebar which will contain a list of crisis and their summary. If there is selected crisis, its details will be displayed on top of it 
 */
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

  /**
   * Array of crisis which will be displayed in the sidebar
   */
  @Input() checked:Crisis[];
  /**
   * Selected crisis whose details will be displayed on top of the sidebar
   */
  @Input() selected:Crisis;
  /**
   * EventEmitter for click event
   */
  @Output() clicked: EventEmitter<Crisis> = new EventEmitter();

  /**
   * @ignore
   */
  constructor() { }
  /**
   * @ignore
   */
  ngOnInit() {
  }

  /**
   * Emit the selected crisis to the map 
   * @param crisis Selected crisis
   */
  onClick(crisis:Crisis){
    this.clicked.emit(crisis);
  }

}
