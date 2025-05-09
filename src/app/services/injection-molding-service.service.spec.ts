import { TestBed } from '@angular/core/testing';

import { InjectionMoldingServiceService } from './injection-molding.service';

describe('InjectionMoldingServiceService', () => {
  let service: InjectionMoldingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjectionMoldingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
