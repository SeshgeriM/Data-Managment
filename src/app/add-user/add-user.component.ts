import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from "@angular/forms";
import { UserService } from "../service/user.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  emailError: boolean = false;
  lastNameError: boolean = false;
  isValid: any;
  passworderror: any = false;
  formError: any = false;
  firstNameError: any = false;
  phoneError: boolean = false;
  passwordError: boolean = false;
  conPasswordError: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) { }

  addForm: FormGroup;


  ngOnInit() {
    this.addForm = this.formBuilder.group({
      id: [],
      email: ['',[Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required]],
      phone: ['', [Validators.pattern('^[0-9]*$'), Validators.required]],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      password: [''],
      conPassword: ['']
    }, {
      validator: [this.customFormValidation()]
    });
  }

  onSubmit() {
    if (this.addForm.valid) {
      this.addForm.controls.id.setValue(Math.floor((Math.random() * 100) + 1));
      this.userService.createUser(this.addForm.value)
        .subscribe(() => {
          this.router.navigate(['list-user']);
        });
    } else {
      this.formError = true;
    }
  }
  customFormValidation(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      const pass = group.controls.password.value;
      const conpass = group.controls.conPassword.value;
      if (pass !== conpass) {
        group.controls.password.setErrors({ 'unequal': true });
        group.controls.conPassword.setErrors({ 'unequal': true });
      } else {
        const pass = group.controls['password'];
        const passerror = pass.errors;
        const err = 'unequal';
        if (passerror) {
          delete passerror[err];
          if (!Object.keys(passerror).length) {
            pass.setErrors(null);
          } else {
            pass.setErrors(passerror);
          }
        }
        const conpass = group.controls['conPassword'];
        const conpasserror = conpass.errors;
        if (conpasserror) {
          delete conpasserror[err];
          if (!Object.keys(conpasserror).length) {
            conpass.setErrors(null);
          } else {
            conpass.setErrors(conpasserror);
          }
        }
      }
      return null;
    };
  }
}
