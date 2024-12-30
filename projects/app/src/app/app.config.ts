import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ENVIRONMENT } from '@tqpas/shared';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';

//bg-info: fetch httpclient backend may possibly be faster when dealing with jsons. unfortunately, doesnt support upload progress
export const appConfig: ApplicationConfig = {
  providers: [
    //bg-info: preload routes asap, so there is no lag when trying to navigate first time
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
