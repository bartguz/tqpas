import { Employee } from '../models/employee';
import { EmployeeStatus } from '../models/employee-status';

export const activeEmployee: Employee = {
  id: 'aaa',
  name: 'Bob Snow',
  department: 'Engineering',
  status: EmployeeStatus.Active,
  email: 'bob.snow@wp.pl',
  equipments: [
    {
      id: 'xxx',
      name: 'Macbook Air',
    },
    {
      id: 'yyy',
      name: 'Macbook Water',
    },
    {
      id: 'zzz',
      name: 'Macbook Fire',
    },
    {
      id: 'xyz',
      name: 'Macbook Earth',
    },
  ],
};

export const offboarderEmployee: Employee = {
  id: 'bbb',
  name: 'Rob Lava',
  department: 'Human Resources',
  status: EmployeeStatus.Offboarded,
  email: 'rob.lava@wp.pl',
  equipments: [
    {
      id: 'zzz',
      name: 'Macbook Air',
    },
  ],
};
