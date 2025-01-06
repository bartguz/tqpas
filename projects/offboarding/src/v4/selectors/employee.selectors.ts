import { createSelector } from '@ngrx/store';
import { EmployeesState } from '../models/employees-state';
import { Employee } from '../models/employee';
import { OffboardingRoutes } from '../offboarding-routes';
import { Equipment } from '../models/equipment';

export const selectEmployees = ({offboarding}:{offboarding:EmployeesState}) => offboarding.employees;
export const selectSearchText = ({offboarding}:{offboarding:EmployeesState}) => offboarding.searchText;
export const selectOffboardingError = ({offboarding}:{offboarding:EmployeesState}) => offboarding.offboardingError;
export const selectEmployeeListLoading = ({offboarding}:{offboarding:EmployeesState}) => offboarding.employeeListLoading;
export const selectOffboardingPending = ({offboarding}:{offboarding:EmployeesState}) => offboarding.offboardingPending;


export const filteredEmployeesSelector = createSelector(
  selectEmployees,
  selectSearchText,
  (employees, searchText) => {
    const regexp: RegExp = new RegExp(searchText, 'gim');
    return employees
      .filter(
        (employee: Employee) =>
          regexp.test(employee.name) || regexp.test(employee.department)
      )
      .map((employee: Employee) => ({
        employee,
        routeUrl: createDetailsLink(employee),
        equipmentsFormatted: formatEquipments(employee),
      }));
  }
);

function createDetailsLink(employee: Employee): string {
  return `/${OffboardingRoutes.Offboarding}-v4/${OffboardingRoutes.Employee}/${employee.id}`;
}

function formatEquipments(employee: Employee, limit: number = 2): string {
  let deviceNames: string = (employee.equipments?.slice(0, limit) ?? [])
    .map((equipment: Equipment) => equipment.name)
    .join(', ');
  if (employee.equipments?.length > limit)
    deviceNames = `${deviceNames} +${employee.equipments.length - limit} more`;
  return deviceNames;
}
