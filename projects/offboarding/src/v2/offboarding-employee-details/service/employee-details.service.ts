import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { shareReplayOne } from '@tqpas/shared';
import { combineLatest, map, Observable } from 'rxjs';
import { Employee } from '../../models/employee';
import { EmployeeStorageService } from '../../offboarding-employee-list/services/employee-storage.service';

@Injectable()
export class EmployeeDetailsService {
  private readonly employeeStorageService: EmployeeStorageService = inject(
    EmployeeStorageService
  );
  readonly employee$: Observable<Employee | undefined> = combineLatest([
    this.employeeStorageService.employees$,
    inject(ActivatedRoute).paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')!)
    ),
  ]).pipe(
    map(
      ([employees, id]: [Employee[], string]) =>
        employees.find((employee: Employee) => employee.id === id),
      shareReplayOne()
    )
  );

  public readonly loading$: Observable<boolean> =
    this.employeeStorageService.loading$;

  constructor() {
    const id: string = inject(ActivatedRoute).snapshot.paramMap.get('id')!;
  }
}
