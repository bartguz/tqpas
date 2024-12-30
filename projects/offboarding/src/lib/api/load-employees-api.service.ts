import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@tqpas/shared';
import { catchError, Observable, of } from 'rxjs';
import { Employee } from '../models/employee';
import { LoadEmployeesProvider } from '../tokens/load-employees.token';

@Injectable()
export class LoadEmployeesApiService implements LoadEmployeesProvider {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly env: Environment = inject(ENVIRONMENT);
  loadEmployees$(): Observable<Employee[]> {
    return this.httpClient
      .get<Employee[]>(`${this.env.apiUrl}/employees`)
      .pipe(catchError(() => of([])));
  }
}
