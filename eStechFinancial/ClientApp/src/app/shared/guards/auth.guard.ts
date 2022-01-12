import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable(
  { providedIn: 'root' }
)
export class AuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {
  }

 
  canActivate() {
    var token = localStorage.getItem("userAuthToken");
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    //console.log('canActivate Called');
    if (token && !this.jwtHelper.isTokenExpired(token) && isLoggedIn) {
      //console.log(this.jwtHelper.decodeToken(token));
      return true;
    }
    else {
      this.router.navigate(['/newlogin']);
      return false;
    }
  }
}
