import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeOffboarding } from '../models/employee-offboarding';

export const CREATE_EMPLOYEE_OFFBOARDING_PROVIDER: InjectionToken<CreateEmployeeOffboardingProvider> =
  new InjectionToken<CreateEmployeeOffboardingProvider>(
    'CREATE_EMPLOYEE_OFFBOARDING_PROVIDER'
  );
export interface CreateEmployeeOffboardingProvider {
  createEmployeeOffboarding$(
    employeeId: string,
    offboarding: EmployeeOffboarding
  ): Observable<void>;
}
