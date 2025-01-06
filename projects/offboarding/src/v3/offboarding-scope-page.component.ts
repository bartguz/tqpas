import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadEmployeesApiService } from './offboarding-employee-list/api/load-employees-api.service';
import { LOAD_EMPLOYEES_PROVIDER } from './offboarding-employee-list/tokens/load-employees.token';
import { EmployeesStore } from './services/employees-store';
@Component({
  selector: 'lib-offboarding-scope-page-v3',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  host: {
    style: 'display:contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EmployeesStore,
    { provide: LOAD_EMPLOYEES_PROVIDER, useClass: LoadEmployeesApiService },
  ],
})
export class OffboardingScopePageComponentV3 {
  constructor() {
    inject(EmployeesStore);
  }
}
