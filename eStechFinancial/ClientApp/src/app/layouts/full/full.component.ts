import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HeaderService, LoginService, EmailAlertService } from '../../shared';


@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']

})
export class FullComponent implements OnInit {
  color = 'defaultdark';
  showSettings = false;
  showMinisidebar = false;
  showDarktheme = false;
  public innerWidth: any;
  public config: PerfectScrollbarConfigInterface = {};
  active = "#fdfdfd";
  logedInUserID: any = this.loginService.getSession('user_ID');
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
  DefaultIMG_URL = "/assets/img/ModuleIconsNew/SupplyChainManagement.png";
  DefaultHeadTab = 6;
  DefaultHeadTabName = "";
  DefaultHeadTabIMG_URL = "/assets/img/ModuleIconsNew/SupplyChainManagement.png";
  DefaultModuleArray: any[] = [];
  Headers: any[] = [];
  SubHeaders: any[] = [];
  userPriviligedFiles: any[] = [];
  changepwd: any[] = [];
  reportURL: any;
  detail: any[] = [];
  header: any = 0;
  subHeader: any = 0;
  pageID: any = 0;
  pageURL: any = "0";
  criteriaSet: any = 0;
  reportName: any = 0;
  pageType: any = 3;
  URL: any;
  formURL: any;
  AuthKey: any = "0";
  toggle: boolean = true;
  displayName: any;
  isLoading: any = false;
  reportCriteria: any;
  closeResult: string;
  isCollapsed: any = false;
  public userimage: any = '/assets/images/user-thumbnail.png';
  public employeeName: any = '';
  public designation: any = '';

  constructor(private jwtHelper: JwtHelperService, public router: Router, private service: HeaderService, private loginService: LoginService, private emailService: EmailAlertService) {
    if (this.loginService.getSession('userimage') != null)
      this.userimage = this.loginService.getSession('userimage');
    this.employeeName = this.loginService.getSession('employeeName');
  }

  ngOnInit() {
    let token = localStorage.getItem("userAuthToken");
 
    if (token == null)
      this.router.navigateByUrl('/login');
    else {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigateByUrl('/login');
      }else{
        if (this.router.url === '/') {
          this.router.navigate(['/dashboard/dashboard1']);
        }
        this.handleLayout();
        this.headers();
      }
    } 
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.handleLayout();
  }

  toggleSidebar() { 
    this.showMinisidebar = !this.showMinisidebar;
  }

  handleLayout() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1170) {
      this.showMinisidebar = true;
    } else {
      this.showMinisidebar = false;
    }
  }

  headers() {
    //getHeaders
    this.service.getHeaders(this.logedInUserID)
      .subscribe(response => {
        //console.log(response);
        if (response != null) {
          this.Headers = (response.json());
          //getSubHeaders
          this.service.getSubHeaders(this.logedInUserID)
            .subscribe(response => {

              if (response != null) {
                this.SubHeaders = (response.json());

                //getUserPriviligedFiles
                this.service.getUserPriviligedFiles(this.logedInUserID)
                  .subscribe(response => {

                    if (response != null) {


                      this.userPriviligedFiles = (response.json());
                      //console.log(this.userPriviligedFiles);


                      var PageRegistry = [];
                      PageRegistry = this.userPriviligedFiles;
                      localStorage.setItem("PageRegistry", JSON.stringify(PageRegistry));
                      this.loadDefaultModule(this.Headers[0].header_ID, this.Headers[0].header_Name, this.Headers[0].img_URL, 0)

                    }
                  });
              }

            });
        }
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
      if (arr[i].sub_Header_ID == condition && arr[i].showinMenue == 1) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  getPageDetail(page_ID) {
    //this.detail = [];
    this.isCollapsed = false;

    this.service.getPageDetail(page_ID)
      .subscribe(response => {
        this.detail = (response.json());

        this.header = this.detail[0].tree_Node_Code;
        this.subHeader = this.detail[0].sub_Tree_Node_Code;
        this.pageID = this.detail[0].page_ID;
        this.page_Name = this.detail[0].page_Name;
        this.criteriaSet = this.detail[0].criteriaSet;
        this.reportName = this.detail[0].reportName;
        this.pageType = this.detail[0].page_Type_ID;

        sessionStorage.setItem('reportFormat', this.detail[0].reportFormat);
        sessionStorage.setItem('header', this.detail[0].tree_Node_Code);
        sessionStorage.setItem('reportSP', this.detail[0].spName);
        sessionStorage.setItem('page_Name', this.detail[0].page_Name);
        sessionStorage.setItem('reportName', this.detail[0].reportName);
        sessionStorage.setItem('reportType', this.detail[0].reportType);
        sessionStorage.setItem('pageType', this.detail[0].page_Type_ID);
        sessionStorage.setItem('subHeader', this.subHeader);
        //console.log(this.detail[0]);

        if (this.pageType == 1) {
          this.pageURL = this.detail[0].ngPage_URL;
        }
        else if (this.pageType == 2) {

          sessionStorage.setItem('rptName', this.page_Name);
          sessionStorage.setItem('reportID', this.pageID);
          sessionStorage.setItem('hid', this.header);
          if (this.detail[0].reportFormat == "2") {
            this.pageURL = this.detail[0].ngPage_URL;

          }
          else {
            this.pageURL = this.detail[0].url;

          }
        }

        this.AuthKey = this.loginService.getSession('AuthKey');
        if (this.router.url == '/hrmreport-viewer' || this.router.url == '/prmreports-viewer') {
          sessionStorage.setItem('pageURL', this.pageURL);
          this.router.navigate(['/redirect']);
        } else {
          sessionStorage.setItem('pageURL', this.pageURL);
          this.router.navigate(['/redirect']);
        }
      });
  }

  loadDefaultModule(ModuleId, ModuleName, IMG_URL, Index) {

    $('div.active').removeClass('active');
    var head = "#HEAD-" + Index
    //alert(head)
    $(head).addClass('active');

    sessionStorage.setItem('hid', ModuleId);
    this.DefaultModule = ModuleId;
    this.DefaultModuleName = ModuleName;
    this.DefaultIMG_URL = IMG_URL;

    this.DefaultHeadTab = ModuleId;
    this.DefaultHeadTabName = ModuleName;
    this.DefaultHeadTabIMG_URL = IMG_URL;
  }

  loadDefaultHeadTab(ModuleId, ModuleName, IMG_URL) {
    sessionStorage.setItem('hid', ModuleId);
    this.DefaultHeadTab = ModuleId;
    this.DefaultHeadTabName = ModuleName;
    this.DefaultHeadTabIMG_URL = IMG_URL;
  }

  clickHome() {
    this.router.navigate(['/dashboard']);

  }

}



