import { Component, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationHelperService } from 'src/app/shared/services/navigation-helper.service';
import { NotificationsDropdownComponent } from '../../notifications/notifications-dropdown.component';
import { AppUtil } from 'src/app/common/app-util';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css'],
})
export class AdminNavComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthenticationService,
   
  ) {}

  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    AppUtil.releaseSubscriptions(this.subscriptions);
  }
}
