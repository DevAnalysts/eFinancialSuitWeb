import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';

import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, ReportViewerService, ReportParam, ReportService, Columns, LoginService, ReportsList, HeaderService, ChartOfAccountService, ReportMaster, DataService, cDate, NgbDateFRParserFormatter, SharedParams, AssetManageService } from '../../../../../shared';

import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
import { FAMReportService } from '../../../../../shared/services/fam-report-service/fam-report.service';
declare var jsPDF: any;
declare var html2canvas: any;
declare var window: any;// Important

//import * as alasql from 'alasql';

@Component({
  selector: 'fam-report-criteria',
  host: { '(window:keydown)': 'hotkeys($event)' },
  templateUrl: './fam-report-criteria.component.html',
  styleUrls: ['./fam-report-criteria.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})
export class FAMReportCriteriaComponent implements OnInit, OnChanges {

  data: any = 'abc';
  tab1: any = 'show';
  tab2: any = 'hide';

  rptname: any = "";

  settings = {
    enableCheckAll: 'false',
    limitSelection: '10',
    enableSearchFilter: true,
    classes: "custom-class",
  };
  settings1 = {
    singleSelection: 'true',
    enableSearchFilter: true,
    classes: "custom-class",
  };

  //Drop downs variables
  reports: any[];

  offices: any[];

  categories: any[];
  subcategories: any[];
  assetstatuses: any[];
  assetitems: any[];

  date = new Date();

  //Selected CSET Values
  public OfficeId: any;

  public CategoryID: any;
  public ItemID: any;
  public SubCategoryID: any;
  public StatusID: any; 
  public finYrs: any;

  public InceptionDate = new cDate();
  public DateFrom = new cDate();
  public DateTo = new cDate();



  public DateFromFY = new cDate();
  public DateToFY = new cDate();



  companyName = 'ABC Corporation';
  report_ID = 0;
  reportName = '';
  reportPeriod = '';
  rows: any[];
  columns: Columns[];
  public params = new Array<ReportParam>();
  public dspparams: any;
  isLoading: any = true;

  isCollapsed: any = false;
  filter = "ToDay";
  selectedReport: ReportsList;

  ddlofficeShow: boolean = true;
  from_DateShow: boolean = true;
  to_DateShow: boolean = true;

  ddlAssetCategoryShow: boolean = true;
  ddlAssetSubCategoryShow: boolean = true;
  ddlAssetStatusShow: boolean = true;
  ddlAssetItemsShow: boolean = true;
  includeSubOfficeShow: boolean = false; 
  hid;
  uid;
  AuthKey;
  ID;
  logedInUserID: any = 1;
  ishidden = false;
  cancelShow: any = 0;
  public includeSubOffice: any = 0;

  rMaster = new ReportMaster(); 
  isLoadingRpt:any = false;
  showPS: string = '';
  showPW: string = 'none';
  showER: string = 'none';
  userOffice: any = 1;
  userPrivilegedOffice: any = '';
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  constructor(private dataserv: DataService, private route: ActivatedRoute, private rv: FAMReportService, private service: ReportService, private LoginService: LoginService, private hservice: HeaderService, public router: Router) {

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');

    this.rMaster = new ReportMaster();
    sessionStorage.setItem('ReportView', '1')
    let iDate = new Date(sessionStorage.getItem('InceptionDate'));
    this.InceptionDate.setDate(iDate);
    if (sessionStorage.getItem('ShowInceptionDate').toString() == "1") {
      this.filter = 'Custom';
      this.ApplyFilter('Custom');
    }


    this.ishidden = true;
    if (sessionStorage.getItem('page_Name') != null) {
      this.rMaster.ModuleCode = sessionStorage.getItem('header');
      this.rMaster.CompanyName = sessionStorage.getItem('CompanyName');
      this.rMaster.UserName = sessionStorage.getItem('employeeName');
      this.rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');
      this.rMaster.PageName = sessionStorage.getItem('page_Name');
      this.rMaster.ReportName = sessionStorage.getItem('reportName');
      this.rMaster.PageCode = parseInt(sessionStorage.getItem('reportID'));
      this.rMaster.ReportSP = sessionStorage.getItem('reportSP');
      this.rMaster.ReportSetting = sessionStorage.getItem('ReportView');
      this.rMaster.BlankReport = "1";
      this.rMaster.DspParam = this.dspparams;
      this.rMaster.ReportType = sessionStorage.getItem('reportType');
      this.dataserv.changereportType(sessionStorage.getItem('reportType'));
      // console.log(this.rMaster);
      this.report_ID = parseInt(sessionStorage.getItem('reportID'));
      this.hid = sessionStorage.getItem('header');
      this.reportName = sessionStorage.getItem('page_Name');
      this.ID = this.LoginService.getSession('ID');
      this.AuthKey = this.LoginService.getSession('AuthKey');
      this.logedInUserID = this.LoginService.getSession('user_ID');
    }

    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = this.getDropdownList(response.json(), 'officE_CODE', 'officE_NAME');
        //Office
        if (this.offices.length > 0) {
          for (let i = 0; i < this.offices.length; i++)
            if (this.offices[i].id == this.userCurrentOffice) {
              this.OfficeId = [{ id: this.offices[i].id, itemName: this.offices[i].itemName }];
              break;
            }
        }

        console.log(this.offices);
      });

    this.service.getAssetItemsList()
      .subscribe(res => {
        this.assetitems = this.getDropdownList(res.json(), 'itemid', 'itemname');

      });

    this.service.getAssetCategory()
      .subscribe(res => {
        this.categories = this.getDropdownList(res.json(), 'categorycode', 'categoryname');
        this.LoadSubCategories(this.categories[0].id);
      });
    this.service.getAssetStatus()
      .subscribe(res => {
        this.assetstatuses = this.getDropdownList(res.json(), 'statuscode', 'statusname');
        
      });
   

    //this.service.getFiscalYear()
    //  .subscribe(res => {
    //    this.finYrs = this.getDropdownList(res.json(), 'fiN_YR', 'fiN_YR');
    //    // console.log(this.finYrs);
    //    var FY = this.finYrs[0].id;

    //    this.service.getFiscalDates(FY)
    //      .subscribe(res => {
    //        var DatesFY = res.json();
           
    //        this.DateFrom.setDate(DatesFY[0].start);
    //        this.DateTo.setDate(DatesFY[0].end);

    //        this.DateFromFY.setDate(DatesFY[0].start);
    //        this.DateToFY.setDate(DatesFY[0].end);


    //      });

    //  });

  }
  onCategorySelect(item: any) {
    console.log(item);
    this.subcategories = [];
    this.LoadSubCategories(this.CategoryID[0].id);
    console.log(this.CategoryID);
  }
  OnCategoryDeSelect(item: any) {
    console.log(item);
    this.subcategories = [];

    console.log(this.CategoryID);
  }
  LoadSubCategories(catid:any) {
    this.service.getAssetSubCategory(catid)
      .subscribe(res => {
        this.categories = this.getDropdownList(res.json(), 'categorycode', 'categoryname');
      });
  }
 
  chunkReports(arr, condition) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].header_ID == condition && arr[i].page_Type_Code == 2) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }

  ngOnChanges(changeRecord: SimpleChanges) {

    //console.log(changeRecord);
  }
  ngOnInit() {
    this.ishidden = true;
    this.hservice.getUserPriviligedFiles(this.logedInUserID)
      .subscribe(response => {
        // console.log(response.json());
        //   this.isLoading = false;
        this.reports = this.chunkReports((response.json()), sessionStorage.getItem('hid'));
        //this.reports = this.chunkReports((response.json()), 409);
        this.changeReport(new ReportsList(this.rMaster.PageCode, this.rMaster.PageName, this.rMaster.ReportSP, this.rMaster.ReportName, sessionStorage.getItem("reportFormat"), null), "1");
      });
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      arr.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            itemName: obj[displaytxt]
          });

        });
    }
    return ar;
  }
  ApplyFilter(fltr: any) {
    this.filter = fltr;
    let flag = true;
    switch (fltr) {
      case "Today":
        this.DateFrom.setDate(this.date);
        this.DateTo.setDate(this.date);
        break;
      case "This Week":
        this.DateFrom.setMondayOfCurrentWeek(this.date);
        this.DateTo.setSundayOfCurrentWeek(this.date);
        break;
      case "This Month":
        this.DateFrom.setFirstDayOfCurrentMonth(this.date);
        this.DateTo.setLastDayOfCurrentMonth(this.date);
        break;
      case "This Quarter":
        this.DateFrom.setDate(this.DateFrom.getCurrentPreviousQuarter("current").StartDate);
        this.DateTo.setDate(this.DateFrom.getCurrentPreviousQuarter("current").EndDate);
        break;
      case "This Year":
        this.DateFrom.setFirstDayOfCurrentYear(this.date);
        this.DateTo.setLastDayOfCurrentYear(this.date);
        break;
      case "Yesterday":
        this.DateFrom.setDayDate(this.date, -1);
        this.DateTo.setDayDate(this.date, -1);
        break;
      case "Previous Week":
        this.DateFrom.setMondayOfPreviousWeek(this.date);
        this.DateTo.setSundayOfPreviousWeek(this.date);
        break;
      case "Previous Month":
        this.DateFrom.setFirstDayOfPreviousMonth(this.date);
        this.DateTo.setLastDayOfPreviousMonth(this.date);
        break;
      case "Previous Quarter":
        this.DateFrom.setDate(this.DateFrom.getCurrentPreviousQuarter("previous").StartDate);
        this.DateTo.setDate(this.DateTo.getCurrentPreviousQuarter("previous").EndDate);
        break;
      case "Previous Year":
        this.DateFrom.setPrevoiusYearStart(this.date);
        this.DateTo.setPrevoiusYearEnd(this.date);
        break;
      case "Custom":
        this.DateFrom.setDate(sessionStorage.getItem('InceptionDate'));
        this.isCollapsed = true;
        flag = false;
        break;

    }
    this.changeReport(this.selectedReport, "0");
  }
  getCurrentPreviousQuarter(value) {
    var today = new Date(),
      quarter = Math.floor((today.getMonth() / 3)),
      startDate,
      endDate;

    switch (value) {
      case "previous":
        startDate = new Date(today.getFullYear(), quarter * 3 - 3, 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
        break;
      default:
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
        break;
    }

    return {
      StartDate: startDate,
      EndDate: endDate
    };
  }
  getMondayOfCurrentWeek(d) {
    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day);
  }
  getSundayOfCurrentWeek(d) {
    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
  }
  getMondayOfPreviousWeek(d) {

    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), (d.getDate() - 7) + (day == 0 ? -7 : 1) - day);
  }
  getSundayOfPreviousWeek(d) {

    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth(), (d.getDate() - 1) + (day == 0 ? -7 : 1) - day);
  }

  getFirstDayOfPreviousMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() - 1, 1);
  }
  getLastDayOfPreviousMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 0);
  }
  getFirstDayOfCurrentMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }
  getLastDayOfCurrentMonth(d) {
    var day = d.getDay();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }
  getFirstDayOfCurrentYear(d) {
    return new Date(d.getFullYear(), 1, 1);
  }
  getLastDayOfCurrentYear(d) {
    return new Date(d.getFullYear() + 1, 12, 0);
  }

  changeReport(obj: any, sender: any) {
    this.isLoading = true;
    $("#mydiv").html("");
    this.ishidden = true;
    if (obj != null) {
      this.selectedReport = obj;
      this.report_ID = obj.page_Code;
      this.reportName = obj.page_Name;

      this.rows = [];
      this.columns = [];

      if (this.DateFrom.getDateFinal().length > 0 && this.DateTo.getDateFinal().length > 0) {
        if (this.DateFrom.getStandardDate() < this.DateTo.getStandardDate() || this.DateFrom.getDateReport().toString() < this.DateTo.getDateReport()) {
          this.reportPeriod = this.DateFrom.getDateReport().toString() + ' - ' + this.DateTo.getDateReport();
        }
        else if (this.DateFrom.getDateFinal() == this.DateTo.getDateFinal()) {
          this.reportPeriod = 'As of ' + this.DateFrom.getDateReport();
        }
      }
      else if (this.DateFrom.getDateFinal().length > 0 && this.DateTo.getDateFinal().length == 0)
        this.reportPeriod = 'As of ' + this.DateFrom.getDateReport();
      else if (this.DateFrom.getDateFinal().length == 0 && this.DateTo.getDateFinal().length > 0)
        this.reportPeriod = 'As of ' + this.DateTo.getDateReport();
     


      this.params = [];
      this.reportParams(this.report_ID);

      this.report_ID = this.selectedReport.page_Code;
      this.reportName = this.selectedReport.page_Name;
      this.params = [];
      this.reportParams(this.report_ID);


      this.rMaster.ModuleCode = sessionStorage.getItem('header');
      this.rMaster.CompanyName = sessionStorage.getItem('CompanyName');
      this.rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');

      this.rMaster.BlankReport = "0";
      this.rMaster.DateParam = this.reportPeriod;
      this.rMaster.PageCode = this.selectedReport.page_Code;
      this.rMaster.PageName = this.selectedReport.page_Name;
      this.rMaster.ReportName = "Reports\\FAMReports\\" + this.selectedReport.reportName;

      if (this.selectedReport.reportType != null)
        this.rMaster.ReportType = this.selectedReport.reportType;
      this.rMaster.ReportSP = this.selectedReport.spName;


      this.rMaster.ReportSetting = sessionStorage.getItem('ReportView');

      //if (this.includeSubOffice == true)
      //  this.rMaster.isStamp = true;
      //else
      //  this.rMaster.isStamp = false;

      this.rMaster.ReportParam = this.params;
      this.rMaster.DspParam = this.dspparams;

      if (this.rMaster.BlankReport == "0") {
        this.rv.setReportParams(new SharedParams("", this.rMaster)).then(
          (response) => {
            let url = "";
            if (response != null) {
              //console.log(response);
              var mediaType = 'application/pdf';
              var blob = new Blob([response._body], { type: mediaType });
              url = URL.createObjectURL(blob);
              $("#mydiv").html("<iframe id='myFrame'  src='" + url + "' width='100%'   scrolling='no' style='display: block;height: 100vh; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
              var timer = setTimeout(() => {this.showER = 'none'; this.showPS = ''; this.showPW = 'none'; this.isLoading = false }, 5000);
            }
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
            this.isLoadingRpt = false;
            this.showPW = 'none';
            this.showPS = 'none';
            this.showER = '';
          })
      }
      else {
        this.isCollapsed = true;

      }
    }
  }


  showPWText() {
    this.isLoadingRpt = true;
    this.showPS = 'none';
    this.showPW = '';
    this.showER = 'none';

  }

  Onchange(arg) {
    //  console.log(arg);
  }
  reportParams(rid: number) {

    switch (rid) { 
   
      case  970004:
      case  970005:
      case  970007:
      case  970011:
      case  970012: 
      case  970013:
        this.params.push(new ReportParam("@AssetID", (this.ItemID != null ? this.ItemID[0].id : null)));
        this.params.push(new ReportParam("@SUBCATEGORY", (this.SubCategoryID != null ? this.SubCategoryID[0].id : -1)));
        this.params.push(new ReportParam("@OFFICE_CODE", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@CostCenter_CODE", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@CATEGORY", (this.CategoryID != null ? this.CategoryID[0].id : -1)));
        this.params.push(new ReportParam("@DATE_FROM", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@DATE_TO", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));        
        this.params.push(new ReportParam("@Status", (this.StatusID != null ? this.StatusID[0].id : -1)));
       
       // this.criteriaSets("CSAsset");

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "      "
          + (this.CategoryID != null ? "Category : " + this.CategoryID[0].itemName + "" : "") + "      "
          + (this.SubCategoryID != null ? "Sub Category : " + this.SubCategoryID[0].itemName + "" : "") + "      "
          + (this.StatusID != null ? "Status : " + this.StatusID[0].itemName + "" : "") ;
        break;

        
      
    }
  }

  export(opt) {
    if (opt == "pdf") {
      sessionStorage.setItem('reportFormat', "1");
      this.rMaster.ReportSetting = "1";
      this.changeReport(this.selectedReport, "2");

    } else if (opt == "excel") {
      this.rMaster.ReportSetting = "2";
      sessionStorage.setItem('reportFormat', "2");
      this.changeReport(this.selectedReport, "2");
    }
    else if (opt == "word") {
      this.rMaster.ReportSetting = "3";
      sessionStorage.setItem('reportFormat', "3");
      this.changeReport(this.selectedReport, "2");
    }
  }

  onprint(id: any) {

    window.print()
  }
  toggleTab(vis: any) {

    if (vis == 'show') {
      $("#tab1").css("display", "none");
      $("#tab2").css("display", "block");
      $("#btn2").css("background", "lightgray");
      $("#btn1").css("background", "transparent");


    }
    else {
      $("#tab1").css("display", "block");
      $("#tab2").css("display", "none");
      $("#btn1").css("background", "lightgray");
      $("#btn2").css("background", "transparent");
    }
  }
  //Criteria Sets
  criteriaSets(cset: any) { 
    this.ddlofficeShow = true;
    this.from_DateShow = true;
    this.to_DateShow = true;
    this.ddlAssetCategoryShow = true;
    this.ddlAssetSubCategoryShow = true;
    this.ddlAssetStatusShow = true;
    this.includeSubOfficeShow = true;
    this.ddlAssetItemsShow = true;
    var timer = setTimeout(() => this.isLoading = false, 3000);
  }

  //changeIncludeShowSubOffice
  changeIncludeSubOffice(includesubOffice) {
    if (includesubOffice == false)
      this.includeSubOffice = 0;
    else {
      this.includeSubOffice = 1;
    }
  }

  //changeFromDate
  changeFromDate(pO_Date) {

    //if (this.DateToFY.getStandardDate() < this.DateTo.getStandardDate())
   //   this.DateTo.setDate(this.DateToFY.getDateFinal());

    //if (this.DateFrom.getStandardDate() < this.DateFromFY.getStandardDate())
   //   this.DateFrom.setDate(this.DateFromFY.getDateFinal());

    //if (this.DateTo.getStandardDate() < this.DateFrom.getStandardDate())
    //  this.DateTo.setDate(this.DateFrom.getDateFinal());
  }
}
