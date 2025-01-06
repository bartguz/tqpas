import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { EmployeeOffboarding } from '../../models/employee-offboarding';
import { EmployeeStatus } from '../../models/employee-status';
import { EmployeesStore } from '../../services/employees-store';
import {
  CREATE_EMPLOYEE_OFFBOARDING_PROVIDER,
  CreateEmployeeOffboardingProvider,
} from '../tokens/create-employee-offboarding.token';
import { OffboardEmployeeProvider } from '../tokens/offboard-employee.token';

@Injectable()
export class OffboardEmployeeService implements OffboardEmployeeProvider {
  private readonly createEmployeeOffboardingProvider: CreateEmployeeOffboardingProvider =
    inject(CREATE_EMPLOYEE_OFFBOARDING_PROVIDER);

  private readonly employeesStore: EmployeesStore = inject(EmployeesStore);

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
        tap(() =>
          this.employeesStore.updateEmployeeStatus({
            employeeId,
            status: EmployeeStatus.Offboarded,
          })
        ),
        catchError((errorResponse: HttpErrorResponse) => {
          this.errorSubject.next(
            errorResponse.status === 409
              ? errorResponse.error.errorMessage
              : 'Unknown error'
          );
          if (errorResponse.status === 409)
            return throwError(() => errorResponse.message);
          return throwError(() => void 0);
        }),
        map(() => void 0),
        finalize(() => this.processingSubject.next(false))
      );
  }
}
