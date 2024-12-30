import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingEmployeeDetailsComponent } from './offboarding-employee-details.component';

describe('OffboardingEmployeeDetailsComponent', () => {
  let component: OffboardingEmployeeDetailsComponent;
  let fixture: ComponentFixture<OffboardingEmployeeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingEmployeeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffboardingEmployeeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
