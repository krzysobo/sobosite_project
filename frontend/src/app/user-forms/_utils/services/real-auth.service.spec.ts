import { TestBed } from '@angular/core/testing';

import { RealAuthService } from './real-auth.service';

describe('RealAuthService', () => {
  let service: RealAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
