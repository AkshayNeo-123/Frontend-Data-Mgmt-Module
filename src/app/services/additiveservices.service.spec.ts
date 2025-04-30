import { TestBed } from '@angular/core/testing';

import { AdditiveservicesService } from './additiveservices.service';

describe('AdditiveservicesService', () => {
  let service: AdditiveservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdditiveservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
