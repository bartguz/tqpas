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
import { Employee } from '../../models/employee';
import { EmployeeStatus } from '../../models/employee-status';
import { EmployeeDetailsStorageService } from '../../offboarding-employee-details/service/employee-details-storage.service';
import { EmployeeStorageService } from '../../offboarding-employee-list/services/employee-storage.service';
import {
  CREATE_EMPLOYEE_OFFBOARDING_PROVIDER,
  CreateEmployeeOffboardingProvider,
} from '../tokens/create-employee-offboarding.token';
import { EmployeeOffboarding } from '../models/employee-offboarding';
import { OffboardEmployeeProvider } from '../tokens/offboard-employee.token';

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
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorSubject.next(
            errorResponse.status === 409 ? errorResponse.error.errorMessage : 'Unknown error'
          );
          if (errorResponse.status === 409) return throwError(() => errorResponse.message);
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
