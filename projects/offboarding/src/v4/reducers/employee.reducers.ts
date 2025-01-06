import { createReducer, on } from '@ngrx/store';
import { EmployeesState } from '../models/employees-state';
import {
  loadedEmployeesAction,
  loadEmployeesAction,
  offboardedEmployeeAction,
  offboardEmployeeAction,
  setEmployeesFilterAction,
} from '../actions/employee.actions';
import { Employee } from '../models/employee';
import { EmployeeStatus } from '../models/employee-status';

export const initialState: EmployeesState = {
  employees: [],
  employeeListLoading: false,
  offboardingPending: false,
  offboardingError:'',
  searchText: '',
};

export const employeesReducer = createReducer(
  initialState,
  on(loadEmployeesAction, (state: EmployeesState) => ({
    ...state,
    loading: true,
  })),
  on(setEmployeesFilterAction, (state: EmployeesState, { searchText }) => ({
    ...state,
    searchText: searchText.trim(),
  })),
  on(
    loadedEmployeesAction,
    (state: EmployeesState, { employees }: { employees: Employee[] }) => ({
      ...state,
      employees,
      loading: false,
    })
  ),
  on(offboardEmployeeAction, (state) => ({
    ...state,
    offboardingPending: true,
  })),
  on(offboardedEmployeeAction, (state, { employeeId }) => {
    const employeeIndex: number = state.employees.findIndex(
      (e: Employee) => e.id === employeeId
    );
    if (employeeIndex < 0) return state;
    let employee = state.employees[employeeIndex];
    employee = { ...employee, status: EmployeeStatus.Offboarded };
    const employees = [...state.employees];
    employees[employeeIndex] = employee;
    return { ...state, employees };
  })
);
