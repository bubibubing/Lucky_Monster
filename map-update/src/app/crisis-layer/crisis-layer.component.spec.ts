import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisisLayerComponent } from './crisis-layer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletModule, LeafletDirective } from '@asymmetrik/ngx-leaflet';
import { BrowserModule } from '@angular/platform-browser';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { DataService } from '../service/data.service';

describe('CrisisLayerComponent', () => {
  let component: CrisisLayerComponent;
  let fixture: ComponentFixture<CrisisLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[
        RouterTestingModule,
        LeafletModule.forRoot(),
        BrowserModule,
        MatCheckboxModule,
        MatCardModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [ 
        CrisisLayerComponent
      ],
      providers:[
        LeafletDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisisLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
