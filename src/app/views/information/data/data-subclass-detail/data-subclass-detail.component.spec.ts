import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubclassDetailComponent } from './data-subclass-detail.component';

describe('DataSubclassDetailComponent', () => {
  let component: DataSubclassDetailComponent;
  let fixture: ComponentFixture<DataSubclassDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSubclassDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubclassDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
