import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Employee } from '../../models/employee';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class EmployeeStorageService {
  private readonly employeesSubject: ReplaySubject<Employee[]> =
    new ReplaySubject<Employee[]>(1);
  public readonly employees$: Observable<Employee[]> =
    this.employeesSubject.pipe(takeUntilDestroyed(inject(DestroyRef)));

  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }
}
