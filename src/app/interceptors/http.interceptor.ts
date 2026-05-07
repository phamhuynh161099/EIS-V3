import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
// import { MessageService } from 'primeng/api';

import { environment } from '../../constants/environment';
import { Name_Token, Path_before_login } from '../../constants/constants.auth';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    let newHeaders = req.headers;
    // const messageService = inject(MessageService);
    const router = inject(Router);
    // // CORS headers
    newHeaders = newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders = newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders = newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    let currentLocation = window.location.pathname;
    let url =  environment.apiBaseUrl + req.url;
    

    return next(
        req.clone({
            url: url,
            headers: newHeaders
        })
    ).pipe(
        catchError((error) => {
            if (error.status === 401) {  
                //  alert(`Your account or password is incorrect.`);
                router.navigate(['auth/login']);
            }
            if (error.status === 200 &&  !error.ok ) {     
                alert(`Please log in again user expired.`);
                localStorage.removeItem(Name_Token);
            }
            router.navigate(['auth/login']);
            // alert(`No similar functionality was found in any existing system !`);
            localStorage.setItem(Path_before_login, currentLocation);
            
            return throwError(() => new Error('Intercepted Error: ' + error.message));
        })
    );
};
