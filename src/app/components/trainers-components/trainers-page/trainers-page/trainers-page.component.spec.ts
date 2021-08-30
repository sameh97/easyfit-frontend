import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainersPageComponent } from './trainers-page.component';

describe('TrainersPageComponent', () => {
  let component: TrainersPageComponent;
  let fixture: ComponentFixture<TrainersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
