import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisisLayerComponent } from './crisis-layer.component';

describe('CrisisLayerComponent', () => {
  let component: CrisisLayerComponent;
  let fixture: ComponentFixture<CrisisLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrisisLayerComponent ]
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
