import { Component, Input, OnInit } from '@angular/core';
import { CardService, LoginService } from '../../../../shared';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    styles: [`
            :host >>> .alert-custom2 {height:50px;padding: 2px 25px 0px 5px;}
            :host >>> .alert-custom2:hover {border: solid 1px #0094ff;}
            :host >>> .list-group-item {position: relative;display: block;padding: 0px 2px 0px 0px;margin-bottom:5px;background-color: #fff;}
  `]
})
export class NotificationComponent implements OnInit {
  public alerts: Array<any> = [];
  logedInUserID: any;
  page: any;
  pageIcon: any;
  header: any;
    favourites: any[];
    userId:any;
  cardType: any = 2;


  mPageID: any = 0;
  mFavName: any = 'Favourite';
  mSortOrder: any = 1;
  constructor(public _DomSanitizer: DomSanitizer, private service: CardService, private loginService: LoginService, public router: Router) {
    
        this.userId = sessionStorage.getItem('user_ID');
        this.service.getCards(this.userId, this.cardType)
        .subscribe(res =>{
          this.favourites = res.json();
        });
    }
    ngOnInit() { }

    changePages(f) { 

      sessionStorage.setItem('header', f.header_ID);
      sessionStorage.setItem('reportSP',f.spName);
      sessionStorage.setItem('page_Name',f.pageName);
      sessionStorage.setItem('reportName', f.reportName);
      sessionStorage.setItem('reportType', f.reportType);
      sessionStorage.setItem('reportFormat',f.reportFormat);
      sessionStorage.setItem('rptName', f.page_Name);
      sessionStorage.setItem('reportID', f.page_code);
      sessionStorage.setItem('reportID', f.pageID);
      sessionStorage.setItem('pageType', '3');
      console.log("Notification click----",f);
      
      if (f.page_Type_ID == 1) {
        this.router.navigate([f.pageURL]);
      }
      else if (f.page_Type_ID == 2) { 
        if (f.reportFormat == "2") {
          this.router.navigate([f.pageURL]);
        }
        else {
          this.router.navigate([f.url]);
        }
      }

     
      
    

    }



    public closeAlert(alert: any) {
      const index: number = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
  }
  setFavourites(mID) {
    this.mPageID = mID;
    this.loginService.setFavourites(this.userId, this.mPageID, this.mFavName, this.mSortOrder)
      .subscribe(response => {
      });
    this.service.getCards(this.userId, this.cardType)
      .subscribe(res => {
        this.favourites = res.json();
        //console.log(this.cards);
      });
  }
}
