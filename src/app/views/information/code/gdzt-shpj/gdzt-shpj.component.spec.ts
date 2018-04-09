import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdztShpjComponent } from './gdzt-shpj.component';

describe('GdztShpjComponent', () => {
  let component: GdztShpjComponent;
  let fixture: ComponentFixture<GdztShpjComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdztShpjComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdztShpjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
