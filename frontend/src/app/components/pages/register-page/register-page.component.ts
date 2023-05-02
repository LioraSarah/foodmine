import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/passwords_match_validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit{
  registerForm!: FormGroup;
  isSubmitted = false;
  returnUrl = '';

  constructor (
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(8)]]
    }, {
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
  }

  get controls () {
    return this.registerForm.controls;
  }

  submit () {
    this.isSubmitted = true;
    if (this.registerForm.invalid) {
      console.log("invalid");
      return};

    const formValues = this.registerForm.value;
    const user: IUserRegister = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      address: formValues.address
    };

    this.userService.register(user).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }

}
