import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../shared';
import { PermissionUtility } from '../../../shared/common/PermissionUtility';

@Component({
  selector: 'redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  URL;
  pageType;
  hid;
  params;
  constructor(private router: Router, private service: LoginService) {
    this.URL = sessionStorage.getItem('pageURL');   
   

    this.router.navigate([this.URL]);


    //console.log(this.URL);
  }

  ngOnInit() {
  }

}
