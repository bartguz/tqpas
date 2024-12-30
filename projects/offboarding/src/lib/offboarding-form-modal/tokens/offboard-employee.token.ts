import { InjectionToken } from '@angular/core';
import { EmployeeOffboarding } from '../models/employee-offboarding';
import { Observable } from 'rxjs';

export const OFFBOARD_EMPLOYEE_PROVIDER: InjectionToken<OffboardEmployeeProvider> =
  new InjectionToken<OffboardEmployeeProvider>('OFFBOARD_EMPLOYEE_PROVIDER');
export interface OffboardEmployeeProvider {
  offboardEployee$(
    employeeId: string,
    offboarding: EmployeeOffboarding
  ): Observable<void>;
  error$: Observable<string>;
  processing$: Observable<boolean>;
}
