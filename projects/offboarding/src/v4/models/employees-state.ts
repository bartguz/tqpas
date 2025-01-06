import { Employee } from './employee';

export interface EmployeesState {
  employees: Employee[];
  employeeListLoading: boolean;
  offboardingPending: boolean;
  offboardingError: string;
  searchText: string;
}
