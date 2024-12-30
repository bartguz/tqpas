import { Employee } from "../models/employee";
import { EmployeeStatus } from "../models/employee-status";

export const activeEmployee:Employee={
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
  ],
};

export const offboarderEmployee:Employee={
  id: 'bbb',
  name: 'Bob Snow',
  department: 'Engineering',
  status: EmployeeStatus.Offboarded,
  email: 'bob.snow@wp.pl',
  equipments: [
    {
      id: 'zzz',
      name: 'Macbook Air',
    },
  ],
};