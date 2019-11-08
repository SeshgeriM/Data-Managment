import { Component, OnInit } from '@angular/core';
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {User} from "../model/user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User;
  editForm: FormGroup;
  formError: any = false;
  constructor(private formBuilder: FormBuilder,private router: Router, private userService: UserService) { }

  ngOnInit() {
    let userId = this.userService.getId();
    if(!userId) {
      alert("Invalid action.")
      this.router.navigate(['list-user']);
      return;
    }
    this.editForm = this.formBuilder.group({
      id: [],
      email: ['',[Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required]],
      phone: ['', [Validators.pattern('^[0-9]*$'), Validators.required]],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      password: [''],
      conPassword: ['']
    });
    this.userService.getUserById(+userId)
      .subscribe( data => {
        console.log('---', data);
        this.editForm.controls.id.patchValue(userId);
        this.editForm.controls.email.patchValue(data.email);
        this.editForm.controls.firstName.patchValue(data.firstName);
        this.editForm.controls.lastName.patchValue(data.lastName);
        this.editForm.controls.password.patchValue(data.password);
        this.editForm.controls.conPassword.patchValue(data.conPassword);
        this.editForm.controls.middleName.patchValue(data.middleName);
        this.editForm.controls.phone.patchValue(data.phone);
      });
  }

  onSubmit() {
    if (this.editForm.valid) {
    this.userService.updateUser(this.editForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['list-user']);
        },
        error => {
          alert(error);
        });
    } else {
      this.formError = true;
    }
  }

}
