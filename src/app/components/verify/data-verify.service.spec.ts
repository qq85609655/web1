import { TestBed, inject } from '@angular/core/testing';

import { DataVerifyService } from './data-valid.service';

describe('DataVerifyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataVerifyService]
    });
  });

  it('should be created', inject([DataVerifyService], (service: DataVerifyService) => {
    expect(service).toBeTruthy();
  }));
});
