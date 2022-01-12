import { Injectable } from '@angular/core';
import { Http, Headers, RequestMethod, ResponseContentType, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EnvService } from '@services/env.service';

@Injectable()
export class RepositoryHttpService {

  constructor(private router: Router, private jwtHelper: JwtHelperService, private https: Http, private env: EnvService) { }

  public getData(route: string) {
    return this.https.get(this.createCompleteRoute(route, this.env.apiUrl),
      this.generateHeaders());
  }

  public getDatas(route: string) {
    return this.https.get(route);
  }

  public login(route: string, body) {
    return this.https.post(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateHeaders());
  }

  public create(route: string, body) {
    return this.https.post(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateHeaders());
  }

  public update(route: string, body) {
    return this.https.put(this.createCompleteRoute(route, this.env.apiUrl), body, this.generateHeaders());
  }

 


  public updateBlob(route: string, body) {
    let token = localStorage.getItem("userAuthToken");
    if (this.jwtHelper.isTokenExpired(token)) {
      this.router.navigateByUrl('/login');
    } else {
      return this.https.put(this.createCompleteRoute(route, this.env.apiUrl), body,
        {
          method: RequestMethod.Put,
          responseType: ResponseContentType.Blob,
          headers: new Headers(
            {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            })
        });
    }
  }

  public delete(route: string) {
    return this.https.delete(this.createCompleteRoute(route, this.env.apiUrl));
  }

  private createCompleteRoute(route: string, envAddress: string) {

    if (this.env.enableDebug) {
      console.log('--- Http Rep ---');
      console.log(`${envAddress}/${route}`);
    }
    return `${envAddress}/${route}`;
  }

  private generateHeaders() {
    let token = localStorage.getItem("userAuthToken");

    if (token == null)
      return {
        headers: new Headers(
          {
            //'Access-Control-Allow-Origin': 'https://localhost',
            'Content-Type': 'application/json',
          }
        )
        //'Content-Type': 'application/json; charset=utf-8;'
        //      , 'Accept': '*/*'
      }
    else {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigateByUrl('/login');
      } else {
        return {
          headers: new Headers(
            {
              //'Access-Control-Allow-Origin': 'https://localhost',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          )
        }
      }
    }
  }
}
