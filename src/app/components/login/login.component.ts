import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  showSpinner: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.setCurrentUser();
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['login']);
    }
  }

  public login(user) {
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
