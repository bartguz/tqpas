import { AsyncPipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../models/employee';
import { activeEmployee, offboarderEmployee } from '../testing/employee.mock';
import { OffboardingEmployeeDetailsComponentV3 } from './offboarding-employee-details.component';
import { EmployeeDetailsService } from './service/employee-details.service';
import { SkeletonComponent } from '@tqpas/ui';

@Component({ selector: 'lib-offboarding-form-modal-v3' })
class OffboardingFormModalComponentMock {
  open = open;
}

describe('OffboardingEmployeeDetailsComponentV3', () => {
  let component: OffboardingEmployeeDetailsComponentV3;
  let fixture: ComponentFixture<OffboardingEmployeeDetailsComponentV3>;
  let employeeSubject = new BehaviorSubject<Employee>(activeEmployee);
  let loadingSubject = new BehaviorSubject<boolean>(false);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OffboardingEmployeeDetailsComponentV3],
    })
      .overrideComponent(OffboardingEmployeeDetailsComponentV3, {
        set: {
          imports: [
            AsyncPipe,
            SkeletonComponent,
            OffboardingFormModalComponentMock,
          ],
          providers: [
            {
              provide: EmployeeDetailsService,
              useValue: {
                employee$: employeeSubject,
                loading$: loadingSubject,
              },
            },
            { provide: Location, useValue: { back } },
          ],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(OffboardingEmployeeDetailsComponentV3);
    component = fixture.componentInstance;
  });

  it('loading - should display skeletons', () => {
    loadingSubject.next(true);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('lib-skeleton').length
    ).toEqual(6);
  });

  it('back button - it should go back on click', () => {
    fixture.detectChanges();

    fixture.nativeElement
      .querySelector(
        '[data-selector="offboarding-employee-details__back-button"]'
      )
      .click();
    expect(back).toHaveBeenCalledTimes(1);
  });

  describe('offboard button', () => {

    it('should be disabled when loaded and status Offboarded', () => {
      loadingSubject.next(false);
      employeeSubject.next(offboarderEmployee);
      fixture.detectChanges();
      const button: HTMLElement = fixture.nativeElement.querySelector(
        '[data-selector="offboarding-employee-details__offboard-button"]'
      );

      expect(button.textContent?.trim()).toEqual('Already offboarded');
    });

    it('should be active when loaded and status not Offboarded', () => {
      loadingSubject.next(false);
      employeeSubject.next(activeEmployee);
      fixture.detectChanges();
      const button: HTMLElement = fixture.nativeElement.querySelector(
        '[data-selector="offboarding-employee-details__offboard-button"]'
      );

      expect(button.textContent?.trim()).toEqual('Offboard');
    });

    it('should open modal when active and clicked', () => {
      loadingSubject.next(false);
      employeeSubject.next(activeEmployee);
      fixture.detectChanges();
      fixture.nativeElement
        .querySelector(
          '[data-selector="offboarding-employee-details__offboard-button"]'
        )
        .click();

      expect(open).toHaveBeenCalledTimes(1);
    });
  });
});

const back = jasmine.createSpy('back');
const open = jasmine.createSpy('open');
