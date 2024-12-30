import { InjectionToken } from '@angular/core';

//bg-info: it may feel redundant to wrap env in DI, but it helps a lot for mocking during testing
export const ENVIRONMENT: InjectionToken<Environment> =
  new InjectionToken<Environment>('ENVIRONMENT');
export interface Environment {
  apiUrl: string;
}
