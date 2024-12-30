import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Employee } from '../models/employee';

@Injectable()
export class EmployeeStorageService {
  private readonly employeesSubject: ReplaySubject<Employee[]> =
    new ReplaySubject<Employee[]>(1);
  public readonly employees$: Observable<Employee[]> =
    this.employeesSubject.asObservable();

  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }
}
