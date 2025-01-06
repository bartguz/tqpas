import { Routes } from '@angular/router';
import {
  OffboardingRoutes,
  offboardingRouting,
  offboardingRoutingV2,
  offboardingRoutingV3,
  offboardingRoutingV4,
} from '@tqpas/offboarding';

export const routes: Routes = [
  offboardingRouting,
  offboardingRoutingV2,
  offboardingRoutingV3,
  offboardingRoutingV4,
  { path: '**', redirectTo: OffboardingRoutes.Offboarding },
];
