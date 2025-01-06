import { TestBed } from '@angular/core/testing';

import { NEVER, of, throwError } from 'rxjs';
import { EmployeeOffboarding } from '../../models/employee-offboarding';
import { EmployeeStatus } from '../../models/employee-status';
import { EmployeesStore } from '../../services/employees-store';
import { activeEmployee } from '../../testing/employee.mock';
import { CREATE_EMPLOYEE_OFFBOARDING_PROVIDER } from '../tokens/create-employee-offboarding.token';
import { OffboardEmployeeService } from './offboard-employee.service';

describe('OffboardEmployeeService', () => {
  let service: OffboardEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OffboardEmployeeService,
        {
          provide: EmployeesStore,
          useValue: {
            updateEmployeeStatus,
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
    updateEmployeeStatus.calls.reset();
    createEmployeeOffboarding$.and.returnValue(of(void 0));
    service = TestBed.inject(OffboardEmployeeService);
  });

  it('should post offboarding and update storages on success', () => {
    service.offboardEployee$(activeEmployee.id, offboarding).subscribe(() => {
      expect(updateEmployeeStatus).toHaveBeenCalledWith({
        employeeId: activeEmployee.id,
        status: EmployeeStatus.Offboarded,
      });
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
        expect(updateEmployeeStatus).toHaveBeenCalledTimes(0);
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
        expect(updateEmployeeStatus).toHaveBeenCalledTimes(0);
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
    expect(updateEmployeeStatus).toHaveBeenCalledTimes(0);
    service.processing$.subscribe((result) => expect(result).toEqual(true));
    service.error$.subscribe((result) => expect(result).toEqual(''));
  });
});

const updateEmployeeStatus = jasmine.createSpy('updateEmployeeStatus');
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
