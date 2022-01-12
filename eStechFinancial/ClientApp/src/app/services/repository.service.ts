import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { EnvService } from '@services/env.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable()
export class RepositoryService {

  constructor(private router: Router , private httpClient: HttpClient, private env: EnvService,private jwtHelper: JwtHelperService) { }

  public getData(route: string) {

    return this.httpClient.get(this.createCompleteRoute(route, this.env.apiUrl),
      this.generateHeaders());
  }

  public login(route: string, body) {

    return this.httpClient.post(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateHeaders());
  }

  public create(route: string, body) { 
    return this.httpClient.post(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateHeaders());
  }

  public createImage(route: string, body) {
  
    return this.httpClient.post(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateImageHeaders());
  }

  public update(route: string, body) {
    return this.httpClient.put(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateHeaders());
  }

  public delete(route: string) {
    return this.httpClient.delete(this.createCompleteRoute(route, this.env.apiUrl));
  }

  private createCompleteRoute(route: string, envAddress: string) {    
    console.log(`${envAddress}/${route}`);
    return `${envAddress}/${route}`;
  }

  private generateHeaders() {
    let token = localStorage.getItem("userAuthToken");
    
    if (token == null){
      return {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    }
    else{
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigateByUrl('/login');
      } else {
        return {
          headers: new HttpHeaders(
            {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          )
        }
      }
      
    }
  }

  private generateImageHeaders() {
    let token = localStorage.getItem("userAuthToken");

    if (token == null)
      return {     
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    else
    {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigateByUrl('/login');
      } else {
      return {
        headers: new HttpHeaders({ 
          'Authorization': 'Bearer ' + token
        }
        )
      }
    }
    }
  }
}
