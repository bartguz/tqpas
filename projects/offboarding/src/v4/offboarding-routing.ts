import { Route } from '@angular/router';
import { EffectsFeatureModule, EffectsModule, provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import * as employeeEffects from './effects/employee.effects';
import { LoadEmployeesApiService } from './offboarding-employee-list/api/load-employees-api.service';
import { LOAD_EMPLOYEES_PROVIDER } from './offboarding-employee-list/tokens/load-employees.token';
import { CreateEmployeeOffboardingApiService } from './offboarding-form-modal/api/create-employee-offboarding-api.service';
import { CREATE_EMPLOYEE_OFFBOARDING_PROVIDER } from './offboarding-form-modal/tokens/create-employee-offboarding.token';
import { OffboardingRoutes } from './offboarding-routes';
import { employeesReducer } from './reducers/employee.reducers';

export const offboardingRoutingV4: Route = {
  path: `${OffboardingRoutes.Offboarding}-v4`,
  providers: [
    { provide: LOAD_EMPLOYEES_PROVIDER, useClass: LoadEmployeesApiService },
    {
      provide: CREATE_EMPLOYEE_OFFBOARDING_PROVIDER,
      useClass: CreateEmployeeOffboardingApiService,
    },
    provideState({ name: 'offboarding', reducer: employeesReducer }),
    provideEffects([employeeEffects]),

  ],
  loadComponent: () =>
    import('./offboarding-scope-page.component').then(
      (c) => c.OffboardingScopePageComponentV4
    ),
  children: [
    {
      path: OffboardingRoutes.Employees,
      loadComponent: () =>
        import(
          './offboarding-employee-list/offboarding-employee-list.component'
        ).then((c) => c.OffboardingEmployeeListComponentV4),
    },
    {
      path: `${OffboardingRoutes.Employee}/:id`,
      loadComponent: () =>
        import(
          './offboarding-employee-details/offboarding-employee-details.component'
        ).then((c) => c.OffboardingEmployeeDetailsComponentV4),
    },
    { path: '**', redirectTo: OffboardingRoutes.Employees },
  ],
};
