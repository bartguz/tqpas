import { createAction, props } from '@ngrx/store';
import { Employee } from '../models/employee';
import { EmployeeOffboarding } from '../models/employee-offboarding';

export enum EmployeeActionType {
  LoadEmployees = '[Employee List] Load Employees',
  SetEmployeesFilter = '[Employee List] Set Employees Filter',
  LoadedEmployees = '[Employee List API] Loaded Employees',
  OffboardEmployee = '[Employee Offboarding Modal] Offboard Employee',
  OffboardedEmployee = '[Employee Offboarding API] Offboarded Employee',
  OffboardingEmployeeFailed = '[Employee Offboarding API] Offboarding Employee Failed',
}

//bg-info: I could use action group, but I'd rather have IDE reference counting for tracking

export const loadEmployeesAction = createAction(EmployeeActionType.LoadEmployees);
export const setEmployeesFilterAction = createAction(EmployeeActionType.SetEmployeesFilter,props<{searchText:string}>());

export const loadedEmployeesAction = createAction(
  EmployeeActionType.LoadedEmployees,
  props<{ employees: Employee[] }>()
);
export const offboardEmployeeAction = createAction(
  EmployeeActionType.OffboardEmployee,
  props<{ employeeId: string; offboarding: EmployeeOffboarding }>()
);
export const offboardedEmployeeAction = createAction(
  EmployeeActionType.LoadEmployees,
  props<{ employeeId: string }>()

);export const offboardingEmployeeFailedAction = createAction(
  EmployeeActionType.OffboardingEmployeeFailed,
  props<{ error: string }>()
);
