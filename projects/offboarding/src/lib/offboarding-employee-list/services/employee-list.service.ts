import { inject, Injectable } from '@angular/core';
import { shareReplayOne } from '@tqpas/shared';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  Observable,
  startWith,
  tap,
} from 'rxjs';
import { Employee } from '../../models/employee';
import { Equipment } from '../../models/equipment';
import { OffboardingRoutes } from '../../offboarding-routes';
import { EmployeeListItem } from '../models/employe-list-item';
import {
  LOAD_EMPLOYEES_PROVIDER,
  LoadEmployeesProvider,
} from '../tokens/load-employees.token';
import { EmployeeStorageService } from './employee-storage.service';

@Injectable()
export class EmployeeListService {
  private readonly loadEmployeesProvider: LoadEmployeesProvider = inject(
    LOAD_EMPLOYEES_PROVIDER
  );
  private readonly employeeStorageService: EmployeeStorageService = inject(
    EmployeeStorageService
  );

  private readonly loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public readonly loading$: Observable<boolean> =
    this.loadingSubject.asObservable();

  private readonly searchSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');

  public readonly filteredEmployees$: Observable<EmployeeListItem[]> =
    combineLatest([
      this.employeeStorageService.employees$,
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(this.searchSubject.value)
      ),
    ]).pipe(
      map(([employees, searchText]) => {
        const regexp: RegExp = new RegExp(searchText, 'gim');
        return employees.filter(
          (employee: Employee) =>
            regexp.test(employee.name) || regexp.test(employee.department)
        );
      }),
      map((employees: Employee[]) =>
        employees.map((employee: Employee) => ({
          employee,
          routeUrl: this.createDetailsLink(employee),
          equipmentsFormatted: this.formatEquipments(employee),
        }))
      ),
      shareReplayOne()
    );

  constructor() {
    this.loadEmployees();
  }

  setSearchFilter(searchText: string): void {
    this.searchSubject.next(searchText.trim() ?? '');
  }

  private loadEmployees(): void {
    this.loadingSubject.next(true);
    this.loadEmployeesProvider
      .loadEmployees$()
      .pipe(
        tap((employees: Employee[]) =>
          this.employeeStorageService.setEmployees(employees)
        ),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  private createDetailsLink(employee: Employee): string {
    return `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employee.id}`;
  }

  private formatEquipments(employee: Employee, limit: number = 2): string {
    let deviceNames: string = (employee.equipments?.slice(0, limit) ?? [])
      .map((equipment: Equipment) => equipment.name)
      .join(', ');
    if (employee.equipments?.length > limit)
      deviceNames =
        deviceNames + ` +${employee.equipments.length - limit} more`;
    return deviceNames;
  }
}
