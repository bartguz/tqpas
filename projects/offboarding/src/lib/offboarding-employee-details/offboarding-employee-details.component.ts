import { AsyncPipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import '@material/web/button/text-button';
import '@material/web/divider/divider';
import '@material/web/icon/icon';
import { shareReplayOne } from '@tqpas/shared';
import { SkeletonComponent } from '@tqpas/ui';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { LoadSingleEmployeeApiService } from './api/load-single-employee-api.service';
import { Employee } from '../models/employee';
import { EmployeeStatus } from '../models/employee-status';
import { OffboardingFormModalComponent } from '../offboarding-form-modal/offboarding-form-modal.component';
import { EmployeeDetailsService } from './service/employee-details.service';
import { LOAD_SINGLE_EMPLOYEE_PROVIDER } from './tokens/load-single-employee.token';
import { EmployeeDetailsStorageService } from './service/employee-details-storage.service';

@Component({
  selector: 'lib-offboarding-employee-details',
  imports: [AsyncPipe, SkeletonComponent, OffboardingFormModalComponent],
  providers: [
    EmployeeDetailsService,
    EmployeeDetailsStorageService,
    {
      provide: LOAD_SINGLE_EMPLOYEE_PROVIDER,
      useClass: LoadSingleEmployeeApiService,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './offboarding-employee-details.component.html',
  styleUrl: './offboarding-employee-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingEmployeeDetailsComponent {
  private readonly employeeDetailsService: EmployeeDetailsService = inject(
    EmployeeDetailsService
  );
  private readonly location: Location = inject(Location);

  employee$: Observable<Employee | undefined> =
    this.employeeDetailsService.employee$;
  loading$: Observable<boolean> = this.employeeDetailsService.loading$;

  isOffboardable$: Observable<boolean> = combineLatest([
    this.loading$,
    this.employee$,
  ]).pipe(
    map(([loading, employee]: [boolean, Employee | undefined]) => {
      if (loading) return false;
      if (!employee) return false;
      if (employee.status === EmployeeStatus.Offboarded) return false;
      return true;
    }),
    startWith(false),
    shareReplayOne()
  );

  offboardButtonText$: Observable<string> = combineLatest([
    this.loading$,
    this.employee$,
  ]).pipe(
    map(([loading, employee]: [boolean, Employee | undefined]) => {
      if (loading) return '';
      if (!employee) return '';
      if (employee.status === EmployeeStatus.Offboarded)
        return 'Already offboarded';
      return 'Offboard';
    }),
    shareReplayOne()
  );

  goBack(): void {
    this.location.back();
  }
}
