import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Crisis } from '../data/crisis';
import {MatCardModule} from '@angular/material/card';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crisis-list',
  templateUrl: './crisis-list.component.html',
  styleUrls: ['./crisis-list.component.css']
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
