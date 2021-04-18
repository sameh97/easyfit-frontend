import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.authService.isAuthenticated()) {
      //TODO: find a better way
      event.preventDefault();
      window.history.forward();
    }
  }
}
