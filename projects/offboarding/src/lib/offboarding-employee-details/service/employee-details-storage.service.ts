import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Employee } from '../../models/employee';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class EmployeeDetailsStorageService {
  private readonly employeeSubject: ReplaySubject<Employee> =
    new ReplaySubject<Employee>(1);
  public readonly employee$: Observable<Employee> = this.employeeSubject.pipe(
    takeUntilDestroyed(inject(DestroyRef))
  );

  setEmployee(employee: Employee): void {
    this.employeeSubject.next(employee);
  }
}
