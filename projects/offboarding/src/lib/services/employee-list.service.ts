import { inject, Injectable } from '@angular/core';
import { shareReplayOne } from '@tqpas/shared';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  finalize,
  map,
  Observable,
  startWith,
  tap,
} from 'rxjs';
import { Employee } from '../models/employee';
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

  public readonly filteredEmployees$: Observable<Employee[]> = combineLatest([
    this.employeeStorageService.employees$,
    this.searchSubject.pipe(
      debounceTime(300),
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
    shareReplayOne()
  );

  constructor() {
    this.loadEmployees();
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

  setSearchFilter(searchText: string): void {
    this.searchSubject.next(searchText ?? '');
  }
}
