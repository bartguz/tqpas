import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee';

export const LOAD_EMPLOYEES_PROVIDER: InjectionToken<LoadEmployeesProvider> =
  new InjectionToken<LoadEmployeesProvider>('LOAD_EMPLOYEES_PROVIDER');
  
export interface LoadEmployeesProvider {
  loadEmployees$(): Observable<Employee[]>;
}
