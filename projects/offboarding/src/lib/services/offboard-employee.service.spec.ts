import { TestBed } from '@angular/core/testing';

import { OffboardEmployeeService } from './offboard-employee.service';

describe('OffboardEmployeeService', () => {
  let service: OffboardEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffboardEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
