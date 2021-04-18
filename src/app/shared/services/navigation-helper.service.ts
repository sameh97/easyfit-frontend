import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class NavigationHelperService {
  constructor(public dialog: MatDialog) {}

  public openYesNoDialogNoCallback(
    message: string,
    customWidthPX?: number
  ): Observable<any> {
    let width = '350px';

    if (customWidthPX) {
      width = `${customWidthPX}px`;
    }

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: width,
      data: message,
    });

    return dialogRef.afterClosed();
  }
}
