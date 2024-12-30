import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Employee } from '../../models/employee';

@Injectable()
export class EmployeeDetailsStorageService {
  private readonly employeeSubject: ReplaySubject<Employee> =
    new ReplaySubject<Employee>(1);
  public readonly employee$: Observable<Employee> =
    this.employeeSubject.asObservable();

  setEmployee(employee: Employee): void {
    this.employeeSubject.next(employee);
  }
}
