import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import '@material/web/button/filled-button';
import '@material/web/button/text-button';
import '@material/web/dialog/dialog';
import { MdDialog } from '@material/web/dialog/dialog';
import '@material/web/progress/linear-progress';
import '@material/web/textfield/outlined-text-field';
import { Store } from '@ngrx/store';
import {
  distinctUntilChanged,
  first,
  map,
  merge,
  Observable,
  skip,
  tap,
} from 'rxjs';
import { offboardEmployeeAction } from '../actions/employee.actions';
import { Employee } from '../models/employee';
import { EmployeeStatus } from '../models/employee-status';
import { EmployeesState } from '../models/employees-state';
import {
  selectEmployees,
  selectOffboardingError,
  selectOffboardingPending,
} from '../selectors/employee.selectors';

@Component({
  selector: 'lib-offboarding-form-modal-v3',
  imports: [ReactiveFormsModule, TitleCasePipe, AsyncPipe],
  templateUrl: './offboarding-form-modal.component.html',
  styleUrl: './offboarding-form-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingFormModalComponentV3 {
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<MdDialog>;
  private readonly store: Store<{ offboarding: EmployeesState }> =
    inject(Store);

  readonly employeeId = input<string>();
  readonly offboardingForm: FormGroup = new FormGroup({
    receiver: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/\d+/),
    ]),
    streetLine1: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/\d+/),
    ]),
    country: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
  });

  readonly controlDefinitions: {
    controlName: string;
    hasError$: Observable<boolean>;
  }[] = Object.keys(this.offboardingForm.controls).map(
    (controlName: string) => ({
      controlName,
      hasError$: this.createHasErrorPipe$(controlName),
    })
  );

  readonly error$: Observable<string> = this.store.select(
    selectOffboardingError
  );
  readonly processing$: Observable<boolean> = this.store.select(
    selectOffboardingPending
  );

  open(): void {
    this.offboardingForm.statusChanges;
    this.dialog.nativeElement.show();
  }

  offboardEmployee(): void {
    this.store
      .select(selectEmployees)
      .pipe(
        map(
          (employees: Employee[]) =>
            employees.find((e: Employee) => e.id === this.employeeId())!.status
        ),
        distinctUntilChanged(),
        skip(1),
        first((status: EmployeeStatus) => status === EmployeeStatus.Offboarded),
        tap(() => this.dialog.nativeElement.close())
      )
      .subscribe();
    this.store.dispatch(
      offboardEmployeeAction({
        employeeId: this.employeeId()!,
        offboarding: this.offboardingForm.value,
      })
    );
  }

  private createHasErrorPipe$(controlName: string): Observable<boolean> {
    const control: AbstractControl<unknown> =
      this.offboardingForm.get(controlName)!;
    return merge(control.statusChanges, control.valueChanges).pipe(
      map(() => (control.touched || control.dirty) && control.invalid)
    );
  }
}
