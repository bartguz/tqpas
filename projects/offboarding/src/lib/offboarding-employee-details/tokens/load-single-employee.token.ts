import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';

export const LOAD_SINGLE_EMPLOYEE_PROVIDER: InjectionToken<LoadSingleEmployeeProvider> =
  new InjectionToken<LoadSingleEmployeeProvider>(
    'LOAD_SINGLE_EMPLOYEE_PROVIDER'
  );
export interface LoadSingleEmployeeProvider {
  loadSingleEmployee$(id: string): Observable<Employee | undefined>;
}
