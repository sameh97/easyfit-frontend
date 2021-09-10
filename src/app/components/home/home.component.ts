import { Component, HostListener } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private authService: AuthenticationService) {}

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
