import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class UtilityService {

  constructor() { }

  static MatchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const confirmPassword = control.get('confirmpassword').value;
    if (password !== confirmPassword) {
      control.get('confirmpassword').setErrors({ ConfirmPassword: true });
    }
    else {
      return false;
    }
  }

  buildQuery(data) {
    if (typeof (data) === 'string') { return data; }
    const query = [];
    for (const key in data) {
      if (data.hasOwnProperty(key) && encodeURIComponent(data[key])) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
      }
    }
    return query.join('&');
  }
}
