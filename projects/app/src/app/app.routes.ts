import { Routes } from '@angular/router';
import {
  OffboardingRoutes,
  offboardingRouting,
  offboardingRoutingV2,
} from '@tqpas/offboarding';

export const routes: Routes = [
  offboardingRouting,
  offboardingRoutingV2,
  { path: '**', redirectTo: OffboardingRoutes.Offboarding },
];
