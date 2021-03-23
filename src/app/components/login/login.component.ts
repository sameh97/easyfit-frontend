import { Component, OnInit } from '@angular/core';
import { AppUtil } from 'src/app/common/app-util';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  public login(user) {
    this.authService.login(user)
      .subscribe(res => {
      console.log(res);
    }, (err: Error) => {
      AppUtil.showError(err);
    });
  }

}
