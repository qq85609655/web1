import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigManagerComponent } from './config-manager.component';

describe('ConfigManagerComponent', () => {
  let component: ConfigManagerComponent;
  let fixture: ComponentFixture<ConfigManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
