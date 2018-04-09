import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubsetComponent } from './data-subset.component';

describe('DataSubsetComponent', () => {
  let component: DataSubsetComponent;
  let fixture: ComponentFixture<DataSubsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
