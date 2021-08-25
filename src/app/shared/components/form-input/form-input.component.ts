import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AppUtil } from 'src/app/common/app-util';

@Component({
  selector: 'app-form-input',
  template: ``,
})
export class FormInputComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  public isInputValidationFailed(inputControl: AbstractControl): boolean {
    if (!inputControl) {
      return false;
    }

    return inputControl.invalid && (inputControl.dirty || inputControl.touched);
  }

  public getInputBorderStyle(inputControl) {
    return this.isInputValidationFailed(inputControl) ? '2px solid red' : '';
  }

  public setInputBorderStyleInvalid(isInvalid) {
    return isInvalid === true ? '2px solid red' : '';
  }

  public checkPasswordsValidator: ValidatorFn = (
    group: FormGroup
  ): ValidationErrors | null => {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : { notSame: true };
  };

  public checkDate = (
    inputControl: AbstractControl
  ): ValidationErrors | null => {
    if (!inputControl) {
      return null;
    }
    let dateNow: Date = new Date();

    let dateFromForm = new Date(inputControl.value);

    if (dateFromForm.getTime() <= dateNow.getTime()) {
      return { dateNotValid: true };
    }

    return null;
  };

  public vallidateAddress = (
    inputControl: AbstractControl
  ): ValidationErrors | null => {
    if (!inputControl) {
      return null;
    }

    let addresRegx = new RegExp('d{1,5}sw.s(\bw*\bs){1,2}w*.');

    if (!inputControl.value.match(addresRegx)) {
      return { addressNotValid: true };
    }

    return null;
  };

  public validatePhoneNumber = (
    inputControl: AbstractControl
  ): ValidationErrors | null => {
    if (!inputControl) {
      return null;
    }

    if (inputControl.value === '') {
      return { empty: true };
    }

    let phoneRegx = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$');

    if (!inputControl.value.match(phoneRegx)) {
      return { phoneNotValid: true };
    }

    return null;
  };

  public validateName = (
    inputControl: AbstractControl
  ): ValidationErrors | null => {
    if (!inputControl) {
      return null;
    }

    let nameRegx = new RegExp("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$");

    if (!inputControl.value.match(nameRegx)) {
      return { nameNotValid: true };
    }

    return null;
  };

  public validateBirthDay = (
    inputControl: AbstractControl
  ): ValidationErrors | null => {
    if (!inputControl) {
      return null;
    }

    let dateNow: Date = new Date();
    let dateFromForm = new Date(inputControl.value);

    if (dateFromForm.getTime() > dateNow.getTime()) {
      return { birthDayNotValid: true };
    }

    if (AppUtil.calculateAge(dateFromForm) < 16) {
      // if the age is less than 16
      return { ageUnder: true };
    }
    return null;
  };

  public passwordsMatch(form: FormGroup): boolean {
    if (!form) {
      return false;
    }

    if (form.errors && form.errors['notSame']) {
      return false;
    }

    return true;
  }
}
