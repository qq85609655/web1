import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSendLogComponent } from './email-send-log.component';

describe('EmailSendLogComponent', () => {
  let component: EmailSendLogComponent;
  let fixture: ComponentFixture<EmailSendLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailSendLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSendLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
