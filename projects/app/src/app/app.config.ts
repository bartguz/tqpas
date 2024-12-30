import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ENVIRONMENT } from '@tqpas/shared';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';

//bg-info: fetch httpclient backend may possibly be faster when dealing with jsons. unfortunately, doesnt support upload progress
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
