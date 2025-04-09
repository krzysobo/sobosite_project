import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms'


export const PasswordsMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
    const password_1_ctl = control.get("password_1")
    const password_2_ctl = control.get("password_2")

    const passwords_dont_match = ((password_1_ctl) && (password_2_ctl) && 
        (password_1_ctl.value != undefined) && (password_2_ctl.value != undefined)  && 
        (password_1_ctl.value != null) && (password_2_ctl.value != null)  && 
        (password_1_ctl.value != "") && (password_2_ctl.value != "")  && 
        (password_1_ctl.value !== password_2_ctl.value));

  return (passwords_dont_match)? {
    passwords_dont_match: true
  }: null;
}
