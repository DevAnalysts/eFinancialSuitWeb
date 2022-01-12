import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderService, LoginService } from '../../shared';

@Component({
  selector: 'dash-setting',
  templateUrl: './dashsetting.component.html',
  styleUrls: ['./dashsetting.component.scss'],
  //styles: [`
  //  :host >>> .nav.nav-pills.flex-column{  display: -webkit-inline-box;margin-right:0px;width:25.3%;}
  //  :host >>> .HT2 .tab-content {border: 2px solid #ffc107;box-shadow: -2px 5px 10px 1px rgba(0,0,0,.176);
  //             width:74.5%;float: right;height:650px;overflow-y: auto;overflow-x: auto}
  //  :host >>> .dropdown-toggle::after {display: none;} 
  //  `],
  animations: [routerTransition()]
})
export class DashSettingComponent implements OnInit, AfterViewInit {
  reportserver: string ='http://localhost:6315';
  pushRightClass: string = 'push-right';
  //  my declerations
  //added: any = 1;
  logedInUserID: any = 1;
  header_Id: any = 0;
  header_Name: any = "";
  page_URL: any = "";
  sort_Order: any = 0;
  img_URL: any = "";
  page_URL_New: any = "";
  sub_Header_ID: any = 0;
  sub_Header_Name: any = "";
  moduleColor: any;
  page_Code: any = 0;
  page_Name: any = "";
  showinMenue: any;
  isList: any;
  isSubList: any;
  fileName: any;

  DefaultModule = 6;
  DefaultModuleName = "Supply Chain Management";
  DefaultIMG_URL = "";
  DefaultHeadTab = 6;
  DefaultHeadTabName = "Supply Chain Management";
  DefaultHeadTabIMG_URL = "";

  DefaultModuleArray: any[] = [];
  Headers: any[] = [];
  SubHeaders: any[] = [];
  userPriviligedFiles: any[] = [];
  changepwd: any[] = [];
  reportURL: any;
  detail: any;
  header: any = 0;
  subHeader: any = 0;
  pageID: any = 0;
  pageURL: any = "0";
  criteriaSet: any = 0;
  reportName: any = 0;
  pageType: any = 0;
  URL: any;
  formURL: any;
  AuthKey: any = "0";
  toggle: boolean = true;
  rtoggle: boolean = true;
  displayName: any;
 isLoading: any = false;
  reportCriteria: any;
  closeResult: string;
  employeeName: any;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;
  values = '';
  userID = 0;
  password: any;
  //end of my declarations
  //Add Row In DashFav Table//
  mPageID: any = 0;
  mFavName: any = 'Favourite';
  mSortOrder: any = 1;
  userFavourites: any[] = [];

  public Checked: boolean = true;
  public UnChecked: boolean = false;
  public selectHomepage: any;
  public setHomepage: any;
  
  constructor( public router: Router, private service: HeaderService, private loginService: LoginService, private modalService: NgbModal, public _DomSanitizer: DomSanitizer) {
    sessionStorage.setItem('reportserver', this.reportserver);
    //this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
    //this.translate.setDefaultLang('en');
    //const browserLang = this.translate.getBrowserLang();
    //this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');
    this.logedInUserID = this.loginService.getSession('user_ID');
    this.password = this.loginService.getSession('password_Value');
    this.employeeName = this.loginService.getSession('employeeName');
    this.selectHomepage = this.loginService.getSession('homepage');
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onLoggedout() {

    localStorage.removeItem('isLoggedin');
    this.router.navigate(['/login']);
  }

  onReports() {
    ;
    this.router.navigate(['/reports']);
  }

  changeLang(language: string) {
    //this.translate.use(language);
  }

  ngAfterViewInit() {
    this.displayName = sessionStorage.getItem("login");
    // alert(this.displayName);
  }

  toggleMenu(dis) {
  }

  loadDefaultModule(ModuleId, ModuleName, IMG_URL, Index) {
    $('div.active').removeClass('active');
    var head = "#HEAD-" + Index

    $(head).addClass('active');

    this.DefaultModule = ModuleId;
    this.DefaultModuleName = ModuleName;
    this.DefaultIMG_URL = IMG_URL;
  }

  loadDefaultHeadTab(ModuleId, ModuleName, IMG_URL) {
    this.DefaultHeadTab = ModuleId;
    this.DefaultHeadTabName = ModuleName;
    this.DefaultHeadTabIMG_URL = IMG_URL;
  }

  ngOnInit() {

    //getHeaders
    this.service.getHeaders(this.logedInUserID)
      .subscribe(response => {
        this.Headers = (response.json());
        // console.log(response.json());
      });
    //getSubHeaders
    this.service.getSubHeaders(this.logedInUserID)
      .subscribe(response => {
        this.SubHeaders = (response.json());
        // console.log(response.json());
      });
    //getUserPriviligedFiles
    this.service.getUserPriviligedFiles(this.logedInUserID)
      .subscribe(response => {
        this.userPriviligedFiles = (response.json());
        //console.log(response.json());
      });
    //getUserFavouritesFiles
    this.loginService.getFavourites(this.logedInUserID)
      .subscribe(response => {
        this.userFavourites = (response.json());
        console.log(response.json());
      });



  }

  chunk(arr, condition) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].header_ID == condition) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  chunkSubHead(arr, condition) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].sub_Header_ID == condition) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  getPageDetail(page_ID) {
    // this.onReports();
    //this.isLoading =true;
    // this.router.navigate(['/login']);
    this.service.getPageDetail(page_ID)
      .subscribe(response => {
        this.detail = (response.json());
        sessionStorage.setItem('page_ID', this.detail[0].page_ID);
        //sessionStorage.setItem('pageName', this.detail[0].page_Name);
        //sessionStorage.setItem('pageURL', this.detail[0].page_URL);
        //sessionStorage.setItem('header', this.detail[0].tree_Node_Code);
        //sessionStorage.setItem('subHeader', this.detail[0].sub_Tree_Node_Code);
        //sessionStorage.setItem('criteriaSet', this.detail[0].criteriaSet);
        //sessionStorage.setItem('reportName', this.detail[0].reportName);
        this.header = this.detail[0].tree_Node_Code;
        this.subHeader = this.detail[0].sub_Tree_Node_Code;
        this.pageID = this.detail[0].page_ID;
        this.page_Name = this.detail[0].page_Name;
        this.criteriaSet = this.detail[0].criteriaSet;
        this.reportName = this.detail[0].reportName;
        this.pageURL = this.detail[0].ngPage_URL;
        this.pageType = this.detail[0].page_Type_ID;
        sessionStorage.setItem('pageType', this.detail[0].page_Type_ID);
        this.formURL = this.detail[0].url;
        sessionStorage.setItem('pageURL', this.detail[0].ngPage_URL);
        this.reportURL = this.loginService.getSession('URL');
        this.AuthKey = this.loginService.getSession('AuthKey');
        //sessionStorage.setItem('isTaxable', "0");
        //sessionStorage.setItem('taxRate', "2");

        if (this.header == 1) {
          if (this.pageType == 2) {
            this.pageType = 2;
            sessionStorage.setItem('pageType', '2');
          }
          this.reportCriteria = "SecurityReports/ReportCriteria.aspx?";
          this.reportURL = this.loginService.getSession('URL') + '' + this.reportCriteria;
        }
        else if (this.header == 2) {
          if (this.pageType == 2) {
            this.pageType = 2;
            sessionStorage.setItem('pageType', '2');
          }
          this.reportCriteria = "HumanResourceReports/Pages/ReportCriteria.aspx?";
          this.reportURL = this.loginService.getSession('URL') + '' + this.reportCriteria;
        }
        else if (this.header == 3) {
          if (this.pageType == 2) {
            this.pageType = 2;
            sessionStorage.setItem('pageType', '2');
          }
          this.reportCriteria = "HumanResourceReports/Pages/ReportCriteria.aspx?";
          this.reportURL = this.loginService.getSession('URL') + '' + this.reportCriteria;
        }
        else if (this.header == 4) {
          {
            if (this.pageType == 2)
              this.pageType = 2;
            sessionStorage.setItem('pageType', '2');
          }
          this.reportCriteria = "GeneralLedgerReports/ReportCriteria.aspx?";
          this.reportURL = this.loginService.getSession('URL') + '' + this.reportCriteria;
        }
        else if (this.header == 5) {
          if (this.pageType == 2) {
            this.pageType = 2;
            sessionStorage.setItem('pageType', '2');
          }
          this.reportCriteria = "FixedAssetReports/ReportCriteria.aspx?";
          this.reportURL = this.loginService.getSession('URL') + '' + this.reportCriteria;
        }
        if (this.header == 6) {
          if (this.pageType == 2) {
            this.pageType = 3;
            sessionStorage.setItem('pageType', '3');
          }
          this.reportCriteria = "SupplyChainReports/Pages/ReportCriteria.aspx?";
          this.reportURL = this.loginService.getSession('URL') + '' + this.reportCriteria;
        }

        if (this.pageType == 1) {
          if (this.pageURL == "supply-chain-reports") {
            this.URL = "" + this.formURL + "hid=" + this.header + "&shid=" + this.subHeader + "&PageId=" + this.pageID + "&CSet=" + this.criteriaSet + "&NameForReport=" + this.reportName + "&AuthKey=" + this.AuthKey + "";
            sessionStorage.setItem('rptURL', this.URL);
            this.router.navigateByUrl('/redirect');

          }
          else {
            this.URL = "" + this.formURL + "hid=" + this.header + "&shid=" + this.subHeader + "&PageId=" + this.pageID + "&CSet=" + this.criteriaSet + "&NameForReport=" + this.reportName + "&AuthKey=" + this.AuthKey + "";
            sessionStorage.setItem('rptURL', this.URL);
            this.router.navigateByUrl(this.pageURL);
          }
        }
        else if (this.pageType == 2) {//mvc Reports Criteria          
          this.URL = "" + this.reportURL + "hid=" + this.header + "&shid=" + this.subHeader + "&PageId=" + this.pageID + "&CSet=" + this.criteriaSet + "&NameForReport=" + this.reportName + "&AuthKey=" + this.AuthKey + "";
          sessionStorage.setItem('rptURL', this.URL);
          this.router.navigate(['/redirect']);
        }
        else if (this.pageType == 3) {//ng Reports Criteria        
          this.URL = "" + this.reportURL + "hid=" + this.header + "&shid=" + this.subHeader + "&PageId=" + this.pageID + "&CSet=" + this.criteriaSet + "&NameForReport=" + this.reportName + "&AuthKey=" + this.AuthKey + "";
          this.router.navigate(['/reports'], { queryParams: { pageId: this.pageID, cset: this.criteriaSet, name: this.page_Name, authKey: this.AuthKey } });
        }
        //   this.isLoading = false;
      });
  }

  onReportsToggle(e) {
    this.rtoggle = e.target.checked;
    if (this.rtoggle==true) {
     
      sessionStorage.setItem('ReportView', 'true');
    } else {
      sessionStorage.setItem('ReportView', 'false');
    }
   
  }

  onToggle() {
    if (this.toggle) {
      this.router.navigate(['/charts']);
    } else {
      this.router.navigate(['/dashboard']);
    }
    this.toggle = !this.toggle;
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //this.isLoading = false;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // this.isLoading = false;
    });

  }
  //getDismissReason
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // end of modal

  onOldPassword(event: any) {
    this.oldPassword = event.target.value;

  }

  onNewPassword(event: any) {
    this.newPassword = event.target.value;

  }

  onConfirmPassword(event: any) {
    this.confirmPassword = event.target.value;

  }

  changePassword() {
    if (this.newPassword != this.confirmPassword) {
      alert("confirm password does not match.");
    }
    else {
      this.loginService.changePassword(this.logedInUserID, this.newPassword, this.password)
        .subscribe(response => {
        });
    }
  }

  setFavourites(mID) {
    this.mPageID = mID;
    this.loginService.setFavourites(this.logedInUserID, this.mPageID, this.mFavName, this.mSortOrder)
      .subscribe(response => {
      });
  }

  setFavouritesCheckBox(favList, condition) {

    var status = 0;
    if (favList.length>0) { 
    for (var i = 0; i < favList.length; i++) {
      if (favList[i].pageID == condition) {
        status = 1;
      }
   
      }
    }
    if (status == 1) {
      return true;
    }
    else {
      return false;
    }
    
  }

  setDashView(event: Event): void {
    const value: string = (<HTMLSelectElement>event.srcElement).value;
    if (value == '1') { this.setHomepage = 'Favourites'; sessionStorage.setItem('homepage', 'Favourites'); }
    else if (value == '2') { this.setHomepage = 'Charts'; sessionStorage.setItem('homepage', 'Charts'); }

    this.loginService.setHomepage(this.logedInUserID, this.setHomepage)
      .subscribe(response => {
      });    
    //console.log(this.setHomepage);
  }

}
