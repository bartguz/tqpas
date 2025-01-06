import { Route } from '@angular/router';
import { OffboardingRoutes } from './offboarding-routes';

export const offboardingRoutingV3: Route = {
  path: `${OffboardingRoutes.Offboarding}-v3`,
  loadComponent: () =>
    import('./offboarding-scope-page.component').then(
      (c) => c.OffboardingScopePageComponentV3
    ),
  children: [
    {
      path: OffboardingRoutes.Employees,
      loadComponent: () =>
        import(
          './offboarding-employee-list/offboarding-employee-list.component'
        ).then((c) => c.OffboardingEmployeeListComponentV3),
    },
    {
      path: `${OffboardingRoutes.Employee}/:id`,
      loadComponent: () =>
        import(
          './offboarding-employee-details/offboarding-employee-details.component'
        ).then((c) => c.OffboardingEmployeeDetailsComponentV3),
    },
    { path: '**', redirectTo: OffboardingRoutes.Employees },
  ],
};
