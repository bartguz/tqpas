import { Employee } from '../../models/employee';
export interface EmployeeListItem {
  employee: Employee;
  routeUrl: string;
  equipmentsFormatted: string;
}
