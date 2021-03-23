import { Observable, Subscription } from 'rxjs';
import { throwError } from 'rxjs';
import * as _ from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import { BadInputError } from '../exceptions';
import { NotFoundError } from '../exceptions/not-found-error';
import { AccessDeniedError } from '../exceptions/access-denied-error';
import { Consts } from './consts';

export class AppUtil {

    private static getHttpErrorMessage(errorResponse: HttpErrorResponse): string {
        if (!errorResponse) {
            return "";
        }
        if (errorResponse.error.message) {
            return errorResponse.error.message;
        }
        return errorResponse.error;
    }

    public static handleError(errorResponse: HttpErrorResponse): Observable<never> {
        const bodyContent: string = AppUtil.getHttpErrorMessage(errorResponse);

        if (errorResponse.status === 400) {
            return throwError(new BadInputError(bodyContent));
        }

        if (errorResponse.status === 404) {
            return throwError(new NotFoundError(bodyContent));
        }

        if (errorResponse.status === 403 || errorResponse.status === 401) {
            return throwError(new AccessDeniedError(bodyContent));
        }

        return throwError(new Error(bodyContent));
    }

    public static showError(err: Error): void {
        if (err instanceof AccessDeniedError) {
            setTimeout(() => alert('Access denied!'), 1);
            return;
        }

        if (err.message) {
            setTimeout(() => alert(`${err.message}`), 1);
            return;
        }

        setTimeout(() => alert('Something went wrong...'), 1);
    }

    public static appTokenGetter() {
        return localStorage.getItem(Consts.KEY_USER_TOKEN);
    }

    public static handleNullError(nullField: string) {
        alert(`${nullField} cannot be null`);
    }

    public static releaseSubscriptions(subscriptions: Subscription[]) {
        if (!subscriptions || subscriptions.length === 0) {
            return;
        }

        for (const sub of subscriptions) {
            sub.unsubscribe();
        }
    }

    public static getFullException(error: Error): string {
        if (!error) {
            return null;
        }
        return `${error.message}\nStack: ${error.stack}`;
    }

    public static hasValue(obj: any): boolean {
        if ((typeof (obj) !== 'undefined') && obj !== null) {
            return true;
        }
        return false;
    }
}
