import { TestBed } from '@angular/core/testing';

import { NEVER, of, throwError } from 'rxjs';
import { EmployeeStatus } from '../../models/employee-status';
import { EmployeeStorageService } from '../../offboarding-employee-list/services/employee-storage.service';
import { activeEmployee } from '../../testing/employee.mock';
import { EmployeeOffboarding } from '../models/employee-offboarding';
import { CREATE_EMPLOYEE_OFFBOARDING_PROVIDER } from '../tokens/create-employee-offboarding.token';
import { OffboardEmployeeService } from './offboard-employee.service';

describe('OffboardEmployeeServiceV2', () => {
  let service: OffboardEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OffboardEmployeeService,
        {
          provide: EmployeeStorageService,
          useValue: {
            employees$: of([activeEmployee]),
            setEmployees,
          },
        },
        {
          provide: CREATE_EMPLOYEE_OFFBOARDING_PROVIDER,
          useValue: {
            createEmployeeOffboarding$,
          },
        },
      ],
    });
    setEmployees.calls.reset();
    createEmployeeOffboarding$.and.returnValue(of(void 0));
    service = TestBed.inject(OffboardEmployeeService);
  });

  it('should post offboarding and update storages on success', () => {
    const updatedEmployee = {
      ...activeEmployee,
      status: EmployeeStatus.Offboarded,
    };

    service.offboardEployee$(activeEmployee.id, offboarding).subscribe(() => {
      expect(setEmployees).toHaveBeenCalledWith([updatedEmployee]);
    });
    service.processing$.subscribe((result) => expect(result).toEqual(false));
    service.error$.subscribe((result) => expect(result).toEqual(''));
  });

  it('should set error to received one on 409 error', () => {
    const errorMessage: string = 'ojojoj';
    createEmployeeOffboarding$.and.returnValue(
      throwError(() => {
        return { error: { errorMessage }, status: 409 };
      })
    );

    service.offboardEployee$(activeEmployee.id, offboarding).subscribe({
      error: () => {
        expect(setEmployees).toHaveBeenCalledTimes(0);
      },
    });
    service.processing$.subscribe((result) => expect(result).toEqual(false));
    service.error$.subscribe((result) => expect(result).toEqual(errorMessage));
  });

  it('should set unknown error when error but niot 409', () => {
    createEmployeeOffboarding$.and.returnValue(
      throwError(() => {
        return { status: 404 };
      })
    );

    service.offboardEployee$(activeEmployee.id, offboarding).subscribe({
      error: () => {
        expect(setEmployees).toHaveBeenCalledTimes(0);
      },
    });
    service.processing$.subscribe((result) => expect(result).toEqual(false));
    service.error$.subscribe((result) =>
      expect(result).toEqual('Unknown error')
    );
  });

  it('should set unknown error when error but niot 409', () => {
    createEmployeeOffboarding$.and.returnValue(NEVER);

    service.offboardEployee$(activeEmployee.id, offboarding).subscribe();
    expect(setEmployees).toHaveBeenCalledTimes(0);
    service.processing$.subscribe((result) => expect(result).toEqual(true));
    service.error$.subscribe((result) =>
      expect(result).toEqual('')
    );
  });
});

const setEmployees = jasmine.createSpy('setEmployees');
const createEmployeeOffboarding$ = jasmine.createSpy(
  'createEmployeeOffboarding$'
);

const offboarding: EmployeeOffboarding = {
  receiver: 'aaaa',
  email: 'bbb@bbb.bbb',
  city: 'ccc',
  country: 'ddd',
  phone: '123',
  postalCode: '0303',
  streetLine1: 'zzzz',
  notes: 'ooo',
};
