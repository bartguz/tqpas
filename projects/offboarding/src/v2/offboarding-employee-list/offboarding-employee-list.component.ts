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
import { EmployeeListItem } from './models/employe-list-item';
import { EmployeeListService } from './services/employee-list.service';

@Component({
  selector: 'lib-offboarding-employee-list-v2',
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
export class OffboardingEmployeeListComponentV2 {
  private readonly employeeListService: EmployeeListService =
    inject(EmployeeListService);
  readonly employeesListItems$: Observable<EmployeeListItem[]> =
    this.employeeListService.filteredEmployees$;
  readonly loading$ = this.employeeListService.loading$;

  onSearchChanged(value: string): void {
    this.employeeListService.setSearchFilter(value);
  }


}
