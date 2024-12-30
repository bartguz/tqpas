import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Employee } from '../../models/employee';

@Injectable()
export class EmployeeStorageService {
  private readonly loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public readonly loading$: Observable<boolean> =
    this.loadingSubject.asObservable();

  private readonly employeesSubject: ReplaySubject<Employee[]> =
    new ReplaySubject<Employee[]>(1);
  public readonly employees$: Observable<Employee[]> =
    this.employeesSubject.asObservable();

  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}
