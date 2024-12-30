import { Routes } from '@angular/router';
import { OffboardingRoutes, offboardingRouting } from '@tqpas/offboarding';

export const routes: Routes = [
  offboardingRouting,
  { path: '**', redirectTo: OffboardingRoutes.Offboarding },
];
