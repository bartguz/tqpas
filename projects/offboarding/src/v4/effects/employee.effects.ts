import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import {
  loadedEmployeesAction,
  loadEmployeesAction,
  offboardedEmployeeAction,
  offboardEmployeeAction,
  offboardingEmployeeFailedAction,
} from '../actions/employee.actions';
import { Employee } from '../models/employee';
import { LOAD_EMPLOYEES_PROVIDER } from '../offboarding-employee-list/tokens/load-employees.token';
import { CREATE_EMPLOYEE_OFFBOARDING_PROVIDER } from '../offboarding-form-modal/tokens/create-employee-offboarding.token';

export const loadEmployeesEffect = createEffect(
  (
    actions$ = inject(Actions),
    loadEmployeesProvider = inject(LOAD_EMPLOYEES_PROVIDER)
  ) => {
    return actions$.pipe(
      ofType(loadEmployeesAction),
      switchMap(() =>
        loadEmployeesProvider
          .loadEmployees$()
          .pipe(
            map((employees: Employee[]) => loadedEmployeesAction({ employees }))
          )
      )
    );
  },
  { functional: true }
);

export const offboardEmployeeEffect = createEffect(
  (
    actions$ = inject(Actions),
    createEmployeeOffboardingProvider = inject(
      CREATE_EMPLOYEE_OFFBOARDING_PROVIDER
    )
  ) => {
    return actions$.pipe(
      ofType(offboardEmployeeAction),
      switchMap(({ employeeId, offboarding }) =>
        createEmployeeOffboardingProvider
          .createEmployeeOffboarding$(employeeId, offboarding)
          .pipe(
            map(() => offboardedEmployeeAction({ employeeId })),
            catchError((errorResponse: HttpErrorResponse) => {
              return of(
                offboardingEmployeeFailedAction({
                  error:
                    errorResponse.status === 409
                      ? errorResponse.error.errorMessage
                      : 'Unknown error',
                })
              );
            })
          )
      )
    );
  },
  { functional: true }
);
