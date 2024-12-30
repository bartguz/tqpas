import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingFormModalComponent } from './offboarding-form-modal.component';

describe('OffboardingFormModalComponent', () => {
  let component: OffboardingFormModalComponent;
  let fixture: ComponentFixture<OffboardingFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffboardingFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
