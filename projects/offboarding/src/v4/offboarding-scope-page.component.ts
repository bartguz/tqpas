import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadEmployeesAction } from './actions/employee.actions';
@Component({
  selector: 'lib-offboarding-scope-page-v3',
  imports: [RouterOutlet],
  template: '<router-outlet/>',
  host: {
    style: 'display:contents',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingScopePageComponentV4 {
  constructor() {
    inject(Store).dispatch(loadEmployeesAction());
  }
}
