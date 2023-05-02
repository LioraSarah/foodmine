import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGES:any = {
  required: 'This field is required',
  email: 'Email is not in valid format',
  minlength: 'Entered value is too short',
  noMatch: 'Password confirmation does not match'
};

@Component({
  selector: 'input-validation',
  templateUrl: './input-validation.component.html',
  styleUrls: ['./input-validation.component.css']
})
export class InputValidationComponent implements OnInit,OnChanges {

  @Input() control!:AbstractControl;
  @Input() showErrors:boolean = true;
  errorMessages: string[] = [];

  ngOnInit(): void {
    this.control.statusChanges.subscribe(() => {
      this.checkValidation();
    });
    this.control.valueChanges.subscribe(() => {
      this.checkValidation();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidation();
  }

  checkValidation() {
    const errors = this.control.errors;

    if (!errors) {
      this.errorMessages = [];
      return;
    }

    const errorKeys = Object.keys(errors);
    this.errorMessages = errorKeys.map(key => VALIDATORS_MESSAGES[key]);
  }
}
