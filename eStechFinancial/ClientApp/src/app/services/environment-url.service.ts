import { Injectable } from '@angular/core';
import { EnvService } from '@services/env.service';

@Injectable()
export class EnvironmentUrlService {

    public apiUrl: string;
      
    constructor(private env: EnvService) {
        this.apiUrl = env.apiUrl;
  }
    //constructor() {
    //    this.apiUrl = environment.urlAddress;
    //    console.log(this.apiUrl);     
    //}

}
