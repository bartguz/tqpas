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
import { map, merge, Observable, switchMap, tap } from 'rxjs';
import { CREATE_EMPLOYEE_OFFBOARDING_PROVIDER } from './tokens/create-employee-offboarding.token';
import { CreateEmployeeOffboardingApiService } from './api/create-employee-offboarding-api.service';
import { OffboardEmployeeService } from './services/offboard-employee.service';
import {
  OFFBOARD_EMPLOYEE_PROVIDER,
  OffboardEmployeeProvider,
} from './tokens/offboard-employee.token';

@Component({
  selector: 'lib-offboarding-form-modal-v2',
  imports: [ReactiveFormsModule, TitleCasePipe, AsyncPipe],
  templateUrl: './offboarding-form-modal.component.html',
  styleUrl: './offboarding-form-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: OFFBOARD_EMPLOYEE_PROVIDER,
      useClass: OffboardEmployeeService,
    },
    {
      provide: CREATE_EMPLOYEE_OFFBOARDING_PROVIDER,
      useClass: CreateEmployeeOffboardingApiService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffboardingFormModalComponentV2 {
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<MdDialog>;
  private readonly offboardEmployeeProvider: OffboardEmployeeProvider = inject(
    OFFBOARD_EMPLOYEE_PROVIDER
  );

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

  readonly error$: Observable<string> = this.offboardEmployeeProvider.error$;
  readonly processing$: Observable<boolean> =
    this.offboardEmployeeProvider.processing$;

  open(): void {
    this.offboardingForm.statusChanges;
    this.dialog.nativeElement.show();
  }

  offboardEmployee(): void {
    this.offboardEmployeeProvider
      .offboardEployee$(this.employeeId()!, this.offboardingForm.value)
      .pipe(
        switchMap(() => this.dialog.nativeElement.close()),
        tap(() => this.offboardingForm.reset())
      )
      .subscribe();
  }

  private createHasErrorPipe$(controlName: string): Observable<boolean> {
    const control: AbstractControl<unknown> =
      this.offboardingForm.get(controlName)!;
    return merge(control.statusChanges, control.valueChanges).pipe(
      map(() => (control.touched || control.dirty) && control.invalid)
    );
  }
}
