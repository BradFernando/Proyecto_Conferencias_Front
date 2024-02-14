import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginFailed = false;
  formSubmitted = false; // Asegúrate de que esta línea está presente

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.reset();
  }

    onSubmit(event: Event): void {
    event.preventDefault(); // Prevents the page from refreshing

    this.formSubmitted = true;

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe(user => {
      if (user) {
        this.router.navigate(['/dashboard']);
      } else {
        this.loginFailed = true;
      }
    });
  }
}
