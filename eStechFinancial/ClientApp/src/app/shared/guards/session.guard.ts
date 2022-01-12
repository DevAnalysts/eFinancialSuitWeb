import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable(
  { providedIn: 'root' }
)
export class SessionGuard implements CanActivate {
  constructor(private router: Router) { }
 
  canActivate() {
   
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    //alert("session:" + " " + isLoggedIn);
    if (!localStorage.getItem('isLoggedIn'))
      return true;

    this.router.navigate(['/dashboard']);
    return false;
  }
}
