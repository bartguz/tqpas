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
import { Employee } from '../models/employee';
import { Equipment } from '../models/equipment';
import { OffboardingRoutes } from '../offboarding-routes';
import { EmployeeListService } from '../services/employee-list.service';

@Component({
  selector: 'lib-offboarding-employee-list',
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
export class OffboardingEmployeeListComponent {
  private readonly employeeListService: EmployeeListService =
    inject(EmployeeListService);
  readonly employees$: Observable<Employee[]> =
    this.employeeListService.filteredEmployees$;
  readonly loading$ = this.employeeListService.loading$;

  onSearchChanged(value: string): void {
    this.employeeListService.setSearchFilter(value);
  }

  createDetailsLink(employee: Employee): string {
    return `/${OffboardingRoutes.Offboarding}/${OffboardingRoutes.Employee}/${employee.id}`;
  }

  formatEquipments(employee: Employee, limit: number = 2): string {
    let deviceNames: string = (employee.equipments?.slice(0, limit) ?? [])
      .map((equipment: Equipment) => equipment.name)
      .join(', ');
    if (employee.equipments?.length > limit)
      deviceNames =
        deviceNames + ` +${employee.equipments.length - limit} more`;
    return deviceNames;
  }
}
