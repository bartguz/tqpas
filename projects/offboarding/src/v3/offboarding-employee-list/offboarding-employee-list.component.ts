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
import { NgSpawnDirective, SkeletonComponent } from '@tqpas/ui';
import { Observable } from 'rxjs';
import { EmployeesStore } from '../services/employees-store';
import { EmployeeListItem } from './models/employe-list-item';

@Component({
  selector: 'lib-offboarding-employee-list-v3',
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
export class OffboardingEmployeeListComponentV3 {
  private readonly employeesStore: EmployeesStore = inject(EmployeesStore);
  readonly employeesListItems$: Observable<EmployeeListItem[]> =
    this.employeesStore.filteredEmployees$;
  readonly loading$ = this.employeesStore.loading$;

  onSearchChanged(value: string): void {
    this.employeesStore.setSearchFilter(value);
  }
}
