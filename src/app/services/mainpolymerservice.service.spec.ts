import { TestBed } from '@angular/core/testing';

import { MainpolymerserviceService } from './mainpolymerservice.service';

describe('MainpolymerserviceService', () => {
  let service: MainpolymerserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainpolymerserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
