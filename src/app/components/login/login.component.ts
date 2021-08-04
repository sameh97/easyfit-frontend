import { Component, Inject, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  showSpinner: boolean = false;
  hide: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]], // TODO : change to 8 in production
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.setCurrentUser();
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
  }

  handleEnterKeyPress(event) {
    if (this.loginForm.valid) {
      return true;
    }
    const tagName = event.target.tagName.toLowerCase();
    if (tagName !== 'textarea') {
      return false;
    }
  }

  public login() {
    let user: User = this.loginForm.value as User;

    this.authService.login(user).subscribe(
      (res) => {
        console.log(res);
        this.authService.persistTokenFromResponse(res);
        this.router.navigateByUrl('/home');
      },
      (err: Error) => {
        console.log(JSON.stringify(err));
        AppUtil.showError(err);
      }
    );
  }
}
