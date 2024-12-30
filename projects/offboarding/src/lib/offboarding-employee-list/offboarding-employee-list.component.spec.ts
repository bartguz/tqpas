import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingEmployeeListComponent } from './offboarding-employee-list.component';

describe('OffboardingEmployeeListComponent', () => {
  let component: OffboardingEmployeeListComponent;
  let fixture: ComponentFixture<OffboardingEmployeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffboardingEmployeeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffboardingEmployeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
