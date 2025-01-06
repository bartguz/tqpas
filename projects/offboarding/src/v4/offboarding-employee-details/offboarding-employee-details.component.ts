import { AsyncPipe, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import '@material/web/button/text-button';
import '@material/web/divider/divider';
import '@material/web/icon/icon';
import { Store } from '@ngrx/store';
import { shareReplayOne } from '@tqpas/shared';
import { SkeletonComponent } from '@tqpas/ui';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Employee } from '../models/employee';
import { EmployeeStatus } from '../models/employee-status';
import { EmployeesState } from '../models/employees-state';
import { OffboardingFormModalComponentV3 } from '../offboarding-form-modal/offboarding-form-modal.component';
import {
  selectEmployeeListLoading,
  selectEmployees,
} from '../selectors/employee.selectors';

@Component({
  selector: 'lib-offboarding-employee-details-v3',
  imports: [AsyncPipe, SkeletonComponent, OffboardingFormModalComponentV3],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './offboarding-employee-details.component.html',
  styleUrl: './offboarding-employee-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingEmployeeDetailsComponentV4 {
  private readonly location: Location = inject(Location);

  private readonly store: Store<{ offboarding: EmployeesState }> =
    inject(Store);
  readonly employee$: Observable<Employee | undefined> = combineLatest([
    this.store.select(selectEmployees),
    inject(ActivatedRoute).paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')!)
    ),
  ]).pipe(
    map(([employees, id]: [Employee[], string]) =>
      employees.find((employee: Employee) => employee.id === id)
    ),
    shareReplayOne()
  );

  public readonly loading$: Observable<boolean> = this.store.select(
    selectEmployeeListLoading
  );

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
