import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeOffboarding } from '../models/employee-offboarding';
import { EmployeeStatus } from '../models/employee-status';
import {
  CREATE_EMPLOYEE_OFFBOARDING_PROVIDER,
  CreateEmployeeOffboardingProvider,
} from '../tokens/create-employee-offboarding.token';
import { OffboardEmployeeProvider } from '../tokens/offboard-employee.token';
import { EmployeeDetailsStorageService } from './employee-details-storage.service';
import { EmployeeStorageService } from './employee-storage.service';

@Injectable()
export class OffboardEmployeeService implements OffboardEmployeeProvider {
  private readonly employeeStorageService: EmployeeStorageService = inject(
    EmployeeStorageService
  );
  private readonly employeeDetailsStorageService: EmployeeDetailsStorageService =
    inject(EmployeeDetailsStorageService);

  private readonly createEmployeeOffboardingProvider: CreateEmployeeOffboardingProvider =
    inject(CREATE_EMPLOYEE_OFFBOARDING_PROVIDER);

  private readonly errorSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  public readonly error$: Observable<string> = this.errorSubject.asObservable();

  private readonly processingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public readonly processing$: Observable<boolean> =
    this.processingSubject.asObservable();

  offboardEployee$(
    employeeId: string,
    offboarding: EmployeeOffboarding
  ): Observable<void> {
    this.processingSubject.next(true);
    this.errorSubject.next('');
    return this.createEmployeeOffboardingProvider
      .createEmployeeOffboarding$(employeeId, offboarding)
      .pipe(
        switchMap(() => this.employeeStorageService.employees$),
        take(1),
        tap((employees: Employee[]) =>
          this.updateEmployeeList(employees, employeeId)
        ),
        switchMap(() => this.employeeDetailsStorageService.employee$),
        take(1),
        tap((employee: Employee) => this.updateEmployeeDetails(employee)),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          this.errorSubject.next(
            error.status === 409 ? error.error.errorMessage : 'unknown error'
          );
          if (error.status === 409) return throwError(() => error.message);
          return throwError(() => void 0);
        }),
        map(() => void 0),
        finalize(() => this.processingSubject.next(false))
      );
  }

  private updateEmployeeList(employees: Employee[], employeeId: string): void {
    const index: number = employees.findIndex(
      (e: Employee) => e.id === employeeId
    );
    if (index === -1) return;
    const duplicate: Employee = { ...employees[index] };
    duplicate.status = EmployeeStatus.Offboarded;
    employees[index] = duplicate;
    this.employeeStorageService.setEmployees(employees);
  }

  private updateEmployeeDetails(employee: Employee): void {
    const duplicate: Employee = { ...employee };
    duplicate.status = EmployeeStatus.Offboarded;
    this.employeeDetailsStorageService.setEmployee(duplicate);
  }
}
