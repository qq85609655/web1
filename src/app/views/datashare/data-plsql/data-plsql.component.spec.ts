import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPlsqlComponent } from './data-plsql.component';

describe('DataPlsqlComponent', () => {
  let component: DataPlsqlComponent;
  let fixture: ComponentFixture<DataPlsqlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPlsqlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPlsqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
