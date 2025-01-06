import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import '@material/web/divider/divider';
import '@material/web/icon/icon';
import '@material/web/tabs/primary-tab';
import '@material/web/textfield/outlined-text-field';
import { Store } from '@ngrx/store';
import { NgSpawnDirective, SkeletonComponent } from '@tqpas/ui';
import { Observable } from 'rxjs';
import { setEmployeesFilterAction } from '../actions/employee.actions';
import { EmployeesState } from '../models/employees-state';
import {
  filteredEmployeesSelector,
  selectEmployeeListLoading,
} from '../selectors/employee.selectors';
import { EmployeeListItem } from './models/employe-list-item';

@Component({
  selector: 'lib-offboarding-employee-list-v4',
  imports: [
    RouterLink,
    AsyncPipe,
    TitleCasePipe,
    SkeletonComponent,
    NgSpawnDirective,
  ],
  templateUrl: './offboarding-employee-list.component.html',
  styleUrl: './offboarding-employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OffboardingEmployeeListComponentV4 {
  private readonly store: Store<{ offboarding: EmployeesState }> =
    inject(Store);
  readonly employeesListItems$: Observable<EmployeeListItem[]> =
    this.store.select(filteredEmployeesSelector);
  readonly loading$ = this.store.select(selectEmployeeListLoading);

  onSearchChanged(value: string): void {
    this.store.dispatch(setEmployeesFilterAction({ searchText: value }));
  }
}
