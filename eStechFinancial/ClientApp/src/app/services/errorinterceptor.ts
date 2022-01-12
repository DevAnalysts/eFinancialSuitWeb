import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       
        return next.handle(req).do(event => { }, err => {
            if (err instanceof HttpErrorResponse && err.status == 401) {
                this.router.navigateByUrl('/login');
            } else if (err instanceof HttpErrorResponse && err.status == 403) {
                this.router.navigate(['/login']);
            }
            
        });
    }
}