import { TestBed } from '@angular/core/testing';

import { ActivatedRoute, Router } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { activeEmployee } from '../../testing/employee.mock';
import { LOAD_SINGLE_EMPLOYEE_PROVIDER } from '../tokens/load-single-employee.token';
import { EmployeeDetailsStorageService } from './employee-details-storage.service';
import { EmployeeDetailsService } from './employee-details.service';

describe('EmployeeDetailsService', () => {
  let service: EmployeeDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeDetailsService,
        {
          provide: EmployeeDetailsStorageService,
          useValue: {
            employee$: of(activeEmployee),
            setEmployee,
          },
        },
        {
          provide: Router,
          useValue: {
            getCurrentNavigation,
          },
        },
        {
          provide: LOAD_SINGLE_EMPLOYEE_PROVIDER,
          useValue: {
            loadSingleEmployee$,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: getParam,
              },
            },
          },
        },
      ],
    });

    loadSingleEmployee$.calls.reset();
    setEmployee.calls.reset();
    getCurrentNavigation.calls.reset();
    getParam.calls.reset();
    loadSingleEmployee$.and.returnValue(of(activeEmployee));
  });

  it('should initialize with navigation extras', () => {
    getCurrentNavigation.and.returnValue({
      extras: { state: { employee: activeEmployee } },
    });
    service = TestBed.inject(EmployeeDetailsService);

    expect(setEmployee).toHaveBeenCalledWith(activeEmployee);
    expect(loadSingleEmployee$).toHaveBeenCalledTimes(0);
    service.loading$.subscribe((loading) => {
      expect(loading).toEqual(false);
    });
  });

  it('should initialize with API using id', () => {
    getCurrentNavigation.and.returnValue(undefined);
    getParam.and.returnValue(activeEmployee.id);

    service = TestBed.inject(EmployeeDetailsService);

    expect(setEmployee).toHaveBeenCalledWith(activeEmployee);
    expect(getCurrentNavigation).toHaveBeenCalledTimes(1);
    expect(loadSingleEmployee$).toHaveBeenCalledWith(activeEmployee.id);
    service.loading$.subscribe((loading) => {
      expect(loading).toEqual(false);
    });
  });

  it('shouldbe loading = true while waiting for response', () => {
    getCurrentNavigation.and.returnValue(undefined);
    getParam.and.returnValue(activeEmployee.id);
    loadSingleEmployee$.and.returnValue(NEVER);
    

    service = TestBed.inject(EmployeeDetailsService);

    expect(setEmployee).toHaveBeenCalledTimes(0);
    expect(getCurrentNavigation).toHaveBeenCalledTimes(1);
    expect(loadSingleEmployee$).toHaveBeenCalledWith(activeEmployee.id);
    service.loading$.subscribe((loading) => {
      expect(loading).toEqual(true);
    });
  });
});

const setEmployee = jasmine.createSpy('setEmployee');
const getCurrentNavigation = jasmine.createSpy('getCurrentNavigation');
const getParam = jasmine.createSpy('get');
const loadSingleEmployee$ = jasmine
  .createSpy('loadSingleEmployee$')
  
