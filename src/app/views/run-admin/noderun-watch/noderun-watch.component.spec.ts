import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoderunWatchComponent } from './noderun-watch.component';

describe('NoderunWatchComponent', () => {
  let component: NoderunWatchComponent;
  let fixture: ComponentFixture<NoderunWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoderunWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoderunWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
