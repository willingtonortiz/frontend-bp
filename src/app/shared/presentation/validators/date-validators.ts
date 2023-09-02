import { formatDate } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateFromDDMMYYYY(date: string) {
  const [day, month, year] = date.split('/');
  return new Date(+year, +month - 1, +day);
}

export function dateToDDMMYYYY(date: Date) {
  return formatDate(date, 'dd/MM/yyyy', 'en-US');
}

function minDateValidator(minDate: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null) return null;

    const currentDate = dateFromDDMMYYYY(control.value);
    const minDateStr = dateFromDDMMYYYY(dateToDDMMYYYY(minDate));
    if (minDateStr <= currentDate) return null;

    return { minDate: true };
  };
}

function dateFormatValidator(
  control: AbstractControl,
): ValidationErrors | null {
  if (control.value === null) return null;

  const pattern = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!pattern.test(control.value)) return { dateFormat: true };

  const [day, month, year] = control.value.split('/');
  if (+day < 1 || +day > 31) return { dateFormat: true };
  if (+month < 1 || +month > 12) return { dateFormat: true };
  if (+year < 1900) return { dateFormat: true };

  return null;
}

export const DateValidators = {
  minDateValidator,
  dateFormatValidator,
};
