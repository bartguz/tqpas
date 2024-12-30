import { EmployeeStatus } from './employee-status';
import { Equipment } from './equipment';

export interface Employee {
  id: string;
  name: string;
  department: string; // bg-info: good place for enum or union type
  status: EmployeeStatus;
  email: string;
  equipments: Equipment[];
}
