import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@tqpas/shared';
import { catchError, Observable, of } from 'rxjs';
import { Employee } from '../models/employee';
import { LoadSingleEmployeeProvider } from '../tokens/load-single-employee.token';

@Injectable()
export class LoadSingleEmployeeApiService
  implements LoadSingleEmployeeProvider
{
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly env: Environment = inject(ENVIRONMENT);

  loadSingleEmployee$(id: string): Observable<Employee | undefined> {
    return this.httpClient
      .get<Employee>(`${this.env.apiUrl}/employees/${id}`)
      .pipe(catchError(() => of(undefined)));
  }
}
