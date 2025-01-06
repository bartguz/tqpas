import { Routes } from '@angular/router';
import {
  OffboardingRoutes,
  offboardingRouting,
  offboardingRoutingV2,
  offboardingRoutingV3,
} from '@tqpas/offboarding';

export const routes: Routes = [
  offboardingRouting,
  offboardingRoutingV2,
  offboardingRoutingV3,
  { path: '**', redirectTo: OffboardingRoutes.Offboarding },
];
