import { Route } from '@angular/router';
import { OffboardingRoutes } from './offboarding-routes';

export const offboardingRouting: Route = {
  path: OffboardingRoutes.Offboarding,
  loadComponent: () =>
    import('./offboarding-scope-page/offboarding-scope-page.component').then(
      (c) => c.OffboardingScopePageComponent
    ),
  children: [
    {
      path: OffboardingRoutes.Employees,
      loadComponent: () =>
        import(
          './offboarding-employee-list/offboarding-employee-list.component'
        ).then((c) => c.OffboardingEmployeeListComponent),
    },
    {
      path: `${OffboardingRoutes.Employee}/:id`,
      loadComponent: () =>
        import(
          './offboarding-employee-details/offboarding-employee-details.component'
        ).then((c) => c.OffboardingEmployeeDetailsComponent),
    },
    { path: '**', redirectTo: OffboardingRoutes.Employees },
  ],
};
