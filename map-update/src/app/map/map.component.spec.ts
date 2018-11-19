import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BrowserModule } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CrisisLayerComponent } from '../crisis-layer/crisis-layer.component';
import { CrisisListComponent } from '../crisis-list/crisis-list.component';
import { CrisisDetailComponent } from '../crisis-detail/crisis-detail.component';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        LeafletModule.forRoot(),
        BrowserModule,
        MatCheckboxModule,
        MatCardModule,
        MatButtonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [ 
        MapComponent,
        CrisisLayerComponent,
        CrisisListComponent,
        CrisisDetailComponent
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
