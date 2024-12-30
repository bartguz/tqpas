import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadEmployeesApiService } from './offboarding-employee-list/services/load-employees-api.service';
import { EmployeeListService } from './offboarding-employee-list/services/employee-list.service';
import { EmployeeStorageService } from './offboarding-employee-list/services/employee-storage.service';
import { LOAD_EMPLOYEES_PROVIDER } from './offboarding-employee-list/tokens/load-employees.token';
@Component({
  selector: 'lib-offboarding-scope-page',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  host: {
    style: 'display:contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EmployeeStorageService,
    EmployeeListService,
    { provide: LOAD_EMPLOYEES_PROVIDER, useClass: LoadEmployeesApiService },
  ],
})
export class OffboardingScopePageComponent {}
