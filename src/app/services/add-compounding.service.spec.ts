import { TestBed } from '@angular/core/testing';

import { AddCompoundingService } from './add-compounding.service';

describe('AddCompoundingService', () => {
  let service: AddCompoundingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddCompoundingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
