import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shareReplayOne } from '@tqpas/shared';
import { BehaviorSubject, filter, finalize, Observable, tap } from 'rxjs';
import { Employee } from '../models/employee';
import { LOAD_SINGLE_EMPLOYEE_PROVIDER } from '../tokens/load-single-employee.token';
import { EmployeeDetailsStorageService } from './employee-details-storage.service';

@Injectable()
export class EmployeeDetailsService {
  private readonly employeeDetailsStorageService: EmployeeDetailsStorageService =
    inject(EmployeeDetailsStorageService);
  readonly employee$: Observable<Employee> =
    this.employeeDetailsStorageService.employee$;
  private readonly loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public readonly loading$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor() {
    //bg-info these will work reliably because service is page-scoped.
    const employee: Employee =
      inject(Router).getCurrentNavigation()?.extras?.state?.['employee'];
    if (employee) {
      this.employeeDetailsStorageService.setEmployee(employee);
      return;
    }
    const id: string = inject(ActivatedRoute).snapshot.paramMap.get('id')!;

    this.loadingSubject.next(true);
    inject(LOAD_SINGLE_EMPLOYEE_PROVIDER)
      .loadSingleEmployee$(id)
      .pipe(
        filter(Boolean),
        tap((employee: Employee) =>
          this.employeeDetailsStorageService.setEmployee(employee)
        ),
        finalize(() => this.loadingSubject.next(false)),
        shareReplayOne()
      )
      .subscribe();
  }
}
