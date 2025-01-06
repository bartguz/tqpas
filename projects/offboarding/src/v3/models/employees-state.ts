import { Employee } from './employee';

export interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  searchText: string;
}
