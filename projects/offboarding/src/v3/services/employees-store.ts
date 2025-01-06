import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, Subscription, finalize, tap } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeStatus } from '../models/employee-status';
import { EmployeesState } from '../models/employees-state';
import { Equipment } from '../models/equipment';
import { EmployeeListItem } from '../offboarding-employee-list/models/employe-list-item';
import {
  LOAD_EMPLOYEES_PROVIDER,
  LoadEmployeesProvider,
} from '../offboarding-employee-list/tokens/load-employees.token';
import { OffboardingRoutes } from '../offboarding-routes';

type Updater<T> = (observableOrValue: T | Observable<T>) => Subscription;

type Effect<T> = (observableOrValue?: T | Observable<T>) => Subscription;

@Injectable()
export class EmployeesStore extends ComponentStore<EmployeesState> {
  private readonly loadEmployeesProvider: LoadEmployeesProvider = inject(
    LOAD_EMPLOYEES_PROVIDER
  );

  constructor() {
    super({
      employees: [],
      loading: false,
      searchText: '',
    });
    this.loadEmployees();
  }

  readonly employees$: Observable<Employee[]> = this.select(
    ({ employees }: EmployeesState) => employees
  );

  readonly filteredEmployees$: Observable<EmployeeListItem[]> = this.select(
    ({ employees, searchText }: EmployeesState) => {
      const regexp: RegExp = new RegExp(searchText, 'gim');
      return employees
        .filter(
          (employee: Employee) =>
            regexp.test(employee.name) || regexp.test(employee.department)
        )
        .map((employee: Employee) => ({
          employee,
          routeUrl: this.createDetailsLink(employee),
          equipmentsFormatted: this.formatEquipments(employee),
        }));
    }
  );

  readonly loading$: Observable<boolean> = this.select(
    ({ loading: loading }: EmployeesState) => loading
  );

  readonly setLoading: Updater<boolean> = this.updater(
    (state: EmployeesState, loading: boolean) => ({
      ...state,
      loading: loading,
    })
  );

  readonly setSearchFilter: Updater<string> = this.updater(
    (state: EmployeesState, searchText: string) => ({
      ...state,
      searchText: searchText.trim(),
    })
  );

  readonly setEmployees: Updater<Employee[]> = this.updater(
    (state: EmployeesState, employees: Employee[]) => ({
      ...state,
      employees,
    })
  );

  readonly updateEmployeeStatus: Updater<{
    employeeId: string;
    status: EmployeeStatus;
  }> = this.updater(
    (
      state: EmployeesState,
      { employeeId, status }: { employeeId: string; status: EmployeeStatus }
    ) => {
      const employeeIndex: number = state.employees.findIndex(
        (e: Employee) => e.id === employeeId
      );
      if (employeeIndex < 0) return state;
      let employee = state.employees[employeeIndex];
      employee = { ...employee, status };
      state.employees[employeeIndex] = employee;
      return { ...state, employees: [...state.employees] };
    }
  );

  readonly loadEmployees: Effect<void> = this.effect(() => {
    this.setLoading(true);
    return this.loadEmployeesProvider.loadEmployees$().pipe(
      tap((employees: Employee[]) => this.setEmployees(employees)),
      finalize(() => this.setLoading(false))
    );
  });

  private createDetailsLink(employee: Employee): string {
    return `/${OffboardingRoutes.Offboarding}-v3/${OffboardingRoutes.Employee}/${employee.id}`;
  }

  private formatEquipments(employee: Employee, limit: number = 2): string {
    let deviceNames: string = (employee.equipments?.slice(0, limit) ?? [])
      .map((equipment: Equipment) => equipment.name)
      .join(', ');
    if (employee.equipments?.length > limit)
      deviceNames = `${deviceNames} +${
        employee.equipments.length - limit
      } more`;
    return deviceNames;
  }
}
