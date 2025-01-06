import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { shareReplayOne } from '@tqpas/shared';
import { combineLatest, map, Observable } from 'rxjs';
import { Employee } from '../../models/employee';
import { EmployeesStore } from '../../services/employees-store';

@Injectable()
export class EmployeeDetailsService {
  private readonly employeesStore: EmployeesStore = inject(
    EmployeesStore
  );
  // bg-info: separate component store with effect could be used together with Observable paramMap. However, this approach follows v2, without pulling single employees separately.
  readonly employee$: Observable<Employee | undefined> = combineLatest([
    this.employeesStore.employees$,
    inject(ActivatedRoute).paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')!)
    ),
  ]).pipe(
    map(
      ([employees, id]: [Employee[], string]) =>
        employees.find((employee: Employee) => employee.id === id),
    ),
    shareReplayOne()
  );

  public readonly loading$: Observable<boolean> =
    this.employeesStore.loading$;
}
