import { Route } from '@angular/router';
import { OffboardingRoutes } from './offboarding-routes';

export const offboardingRoutingV2: Route = {
  path: OffboardingRoutes.Offboarding+'-v2',
  loadComponent: () =>
    import('./offboarding-scope-page.component').then(
      (c) => c.OffboardingScopePageComponentV2
    ),
  children: [
    {
      path: OffboardingRoutes.Employees,
      loadComponent: () =>
        import(
          './offboarding-employee-list/offboarding-employee-list.component'
        ).then((c) => c.OffboardingEmployeeListComponentV2),
    },
    {
      path: `${OffboardingRoutes.Employee}/:id`,
      loadComponent: () =>
        import(
          './offboarding-employee-details/offboarding-employee-details.component'
        ).then((c) => c.OffboardingEmployeeDetailsComponentV2),
    },
    { path: '**', redirectTo: OffboardingRoutes.Employees },
  ],
};
