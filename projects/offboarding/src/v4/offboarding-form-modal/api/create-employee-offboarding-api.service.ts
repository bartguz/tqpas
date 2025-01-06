import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@tqpas/shared';
import { Observable } from 'rxjs';
import { EmployeeOffboarding } from '../../models/employee-offboarding';
import { CreateEmployeeOffboardingProvider } from '../tokens/create-employee-offboarding.token';

@Injectable()
export class CreateEmployeeOffboardingApiService
  implements CreateEmployeeOffboardingProvider
{
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly env: Environment = inject(ENVIRONMENT);
  createEmployeeOffboarding$(
    employeeId: string,
    offboarding: EmployeeOffboarding
  ): Observable<void> {
    return this.httpClient.post<void>(
      `${this.env.apiUrl}/users/${employeeId}/offboard`,
      offboarding
    );
  }
}
