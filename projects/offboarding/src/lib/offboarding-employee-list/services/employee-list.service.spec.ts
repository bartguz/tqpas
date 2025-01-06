import { fakeAsync, TestBed } from '@angular/core/testing';
import { NEVER, of, queueScheduler, skip, take, timeout } from 'rxjs';
import { OffboardingRoutes } from '../../offboarding-routes';
import {
  activeEmployee,
  offboarderEmployee,
} from '../../testing/employee.mock';
import { LOAD_EMPLOYEES_PROVIDER } from '../tokens/load-employees.token';
import { EmployeeListService } from './employee-list.service';
import { EmployeeStorageService } from './employee-storage.service';

describe('EmployeeListService', () => {
  let service: EmployeeListService;
  let storageService: EmployeeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeListService,
        EmployeeStorageService,
        {
          provide: LOAD_EMPLOYEES_PROVIDER,
          useValue: {
            loadEmployees$,
          },
        },
      ],
    });

    jasmine.clock().install();
    jasmine.clock().mockDate();

    loadEmployees$.and.returnValue(of(employees));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('constructor', () => {
    it('should load and set data', () => {
      storageService = TestBed.inject(EmployeeStorageService);
      let setEmployeesSpy = spyOn(storageService, 'setEmployees');

      service = TestBed.inject(EmployeeListService);

      expect(setEmployeesSpy).toHaveBeenCalledWith(employees);
      storageService.employees$
        .pipe(take(1))
        .subscribe((results) => expect(results).toEqual(employees));
      service.loading$
        .pipe(take(1))
        .subscribe((results) => expect(results).toEqual(false));
    });

    it('should set loading to true when waiting for response', () => {
      loadEmployees$.and.returnValue(NEVER);
      storageService = TestBed.inject(EmployeeStorageService);
      let setEmployeesSpy = spyOn(storageService, 'setEmployees');

      service = TestBed.inject(EmployeeListService);

      expect(setEmployeesSpy).toHaveBeenCalledTimes(0);
      storageService.employees$
        .pipe(
          timeout({
            first: 0,
            scheduler: queueScheduler, //ensure it is serial
            with: () => of('timeout') as any,
          })
        )
        .pipe(take(1))
        .subscribe((results) => expect(results).toEqual('timeout' as any));
      service.loading$
        .pipe(take(1))
        .subscribe((results) => expect(results).toEqual(true));
    });
  });

  it('filteredEmployees$ - should apply filter and format employees for display', () => {
    service = TestBed.inject(EmployeeListService);
    service.filteredEmployees$.pipe(take(1)).subscribe((results) => {
      expect(results).toEqual([
        {
          employee: employees[0],
          routeUrl: `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employees[0].id}`,
          equipmentsFormatted:
            employees[0].equipments
              .slice(0, 2)
              .map((x) => x.name)
              .join(', ') + ' +2 more',
        },
        {
          employee: employees[1],
          routeUrl: `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employees[1].id}`,
          equipmentsFormatted: employees[1].equipments[0].name,
        },
      ]);
    });
  });

  describe('setSearchFilter', () => {
    it('should set filter and cause match by name', fakeAsync(() => {
      service = TestBed.inject(EmployeeListService);
      service.setSearchFilter('bob');
      service.filteredEmployees$.pipe(skip(1), take(1)).subscribe((results) => {
        expect(results).toEqual([
          {
            employee: employees[0],
            routeUrl: `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employees[0].id}`,
            equipmentsFormatted:
              employees[0].equipments
                .slice(0, 2)
                .map((x) => x.name)
                .join(', ') + ' +2 more',
          },
        ]);
      });
    }));

    it('should trim whitespaces, set filter and cause match by name', fakeAsync(() => {
      service = TestBed.inject(EmployeeListService);
      service.setSearchFilter('   bob  ');
      service.filteredEmployees$.pipe(skip(1), take(1)).subscribe((results) => {
        expect(results).toEqual([
          {
            employee: employees[0],
            routeUrl: `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employees[0].id}`,
            equipmentsFormatted:
              employees[0].equipments
                .slice(0, 2)
                .map((x) => x.name)
                .join(', ') + ' +2 more',
          },
        ]);
      });
    }));

    it('should set filter and cause match by department', fakeAsync(() => {
      service = TestBed.inject(EmployeeListService);
      service.setSearchFilter('   human  ');
      service.filteredEmployees$.pipe(skip(1), take(1)).subscribe((results) => {
        expect(results).toEqual([
          {
            employee: employees[1],
            routeUrl: `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employees[1].id}`,
            equipmentsFormatted: employees[1].equipments[0].name,
          },
        ]);
      });
    }));
  });
});

const employees = [activeEmployee, offboarderEmployee];
const loadEmployees$ = jasmine.createSpy('loadEmployees$');
