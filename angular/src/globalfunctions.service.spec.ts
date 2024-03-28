import { TestBed } from '@angular/core/testing';

import { GlobalfunctionsService } from './globalfunctions.service';

describe('GlobalfunctionsService', () => {
  let service: GlobalfunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalfunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
