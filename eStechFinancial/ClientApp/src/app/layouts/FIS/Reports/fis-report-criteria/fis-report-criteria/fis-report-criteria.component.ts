import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';

import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, ReportViewerService, ReportParam, ReportService, Columns, LoginService, ReportsList, HeaderService, ChartOfAccountService, ReportMaster, DataService, cDate, NgbDateFRParserFormatter, SharedParams } from '../../../../../shared';

import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from 'selenium-webdriver';
declare var jsPDF: any;
declare var html2canvas: any;
declare var window: any;// Important

//import * as alasql from 'alasql';

@Component({
  selector: 'fis-report-criteria',
  templateUrl: './fis-report-criteria.component.html',
  styleUrls: ['./fis-report-criteria.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})
export class FISReportCriteriaComponent implements OnInit, OnChanges {

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

  coasLevels: any[];
  coaCodes: any[];
  bankAccounts: any[];
  vouchers: any[];
  finYrs: any[];
  voucherTypes: any[];
  ledgerStatuses: any[];
  voucherStatuses: any[];
  
  notetypes: any[] = [{"noteTypeId": "1"},{"noteTypeId": "2"}];
  date = new Date();
  //Selected CSET Values
  public LedgerStatus: any;
  public CoaLevelCode: any;
  public VoucherNo: any;
  public VoucherTypeCode: any;
  public VoucherStatus: any;
  public FinYr: any;
  public OfficeId: any;
  public accountCode: any;
  public CoaCode: any[];
  public BankAccount: any[];
  public NoteType: any;


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
  prvdisabled: any = false;
  filter = "ToDay";
  selectedReport: ReportsList;

  ddlofficeShow: boolean = true;
  from_DateShow: boolean = true;
  to_DateShow: boolean = true;
  noteTypeShow: boolean = false;
  ddlfinYearShow: boolean = false;
  ddlCoaLevelsShow: boolean = false;
  ddlVouchersShow: boolean = false;
  ddlVoucherTypesShow: boolean = false;
  ddlLedgerStatusShow: boolean = false;
  ddlVoucherStatusShow: boolean = false;
  hid;
  uid;
  AuthKey;
  ID;
  logedInUserID: any = 1;
  ishidden = false;
  cancelShow: any = 0;
  public cancel: any = 0;
  VSFinalShow: any = 0;
  public VSFinal: any = false;
  ddlAccountShow: boolean = false;
  ddlBankAccountShow: boolean = false;
  rMaster = new ReportMaster();
  accT_TYPE_CODE: any = 3;
  isLoadingRpt: any = false;
  showPS: string = '';
  showPW: string = 'none';
  showER: string = 'none';
  userOffice: any = 1;
  userPrivilegedOffice: any = '';
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  constructor(private dataserv: DataService, private coa: ChartOfAccountService, private route: ActivatedRoute, private rv: ReportViewerService, private service: ReportService, private LoginService: LoginService, private hservice: HeaderService, public router: Router) {

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
      this.NoteType="BS";

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
      this.rMaster.ReportSetting = sessionStorage.getItem('reportFormat');
      this.rMaster.BlankReport = "1";
      this.rMaster.WaterMarkText = '';
      this.rMaster.DspParam = this.dspparams;
      this.rMaster.ReportType = sessionStorage.getItem('reportType');
      this.dataserv.changereportType(sessionStorage.getItem('reportType'));
      // console.log(this.rMaster);
      this.report_ID = parseInt(sessionStorage.getItem('reportID'));

      //criteriaSets(cset: any) 


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

        //  console.log(this.offices);
      });

    this.service.getLevels()
      .subscribe(response => {
        this.coasLevels = this.getDropdownList(response.json(), 'leveL_CODE', 'accT_LEVEL');
        // console.log('levels:' + this.coasLevels.length);
        if (this.coasLevels != null) {
          this.CoaLevelCode = this.coasLevels[this.coasLevels.length - 1].id;
          this.getCoaLevels(this.CoaLevelCode);
        }
      });

    this.service.getVoucherTypes()
      .subscribe(res => {
        this.voucherTypes = this.getDropdownList(res.json(), 'voucher_Type_Code', 'voucher_TYPE');
      });
    this.service.getledgerStatus()
      .subscribe(response => {
        this.ledgerStatuses = this.getDropdownList(response.json(), 'id', 'text');
      });
    this.service.getvoucherStatuses()
      .subscribe(res => {
        this.voucherStatuses = this.getDropdownList(res.json(), 'id', 'text');
      });
    this.service.getVouchers()
      .subscribe(response => {
        this.vouchers = this.getDropdownList(response.json(), 'citY_CODE', 'name');
      });
    this.service.getFiscalYear()
      .subscribe(res => {
        this.finYrs = this.getDropdownList(res.json(), 'fiN_YR', 'fiN_YR');
        // console.log(this.finYrs);
        var FY = this.finYrs[0].id;

        this.service.getFiscalDates(FY)
          .subscribe(res => {
            var DatesFY = res.json();
            //   console.log(DatesFY);
            this.DateFrom.setDate(DatesFY[0].start);
            this.DateTo.setDate(DatesFY[0].end);

            this.DateFromFY.setDate(DatesFY[0].start);
            this.DateToFY.setDate(DatesFY[0].end);


          });

      });
  
    this.hservice.getUserPriviligedFiles(this.logedInUserID)
      .subscribe(response => {
        // console.log(response.json());
        //   this.isLoading = false;
        this.reports = this.chunkReports((response.json()), sessionStorage.getItem('hid'));
        this.selectedReport = new ReportsList();
        this.selectedReport.page_Code = this.rMaster.PageCode;
        this.selectedReport.page_Name = this.rMaster.PageName;
        this.selectedReport.spName = sessionStorage.getItem('reportSP');
        this.selectedReport.reportName = this.rMaster.ReportName;
        this.selectedReport.reportFormat = sessionStorage.getItem("reportFormat");
        this.selectedReport.reportType = sessionStorage.getItem('reportType');
        //this.reports = this.chunkReports((response.json()), 409);
        //this.changeReport(new ReportsList(this.rMaster.PageCode, this.rMaster.PageName, this.rMaster.ReportSP, this.rMaster.ReportName, sessionStorage.getItem("reportFormat"), null), "1");
        this.reportParams(this.selectedReport.page_Code);
        this.isLoading = false;
      });
  }
  getCoaLevels(levelCode: any) {
    this.service.getAccounts(levelCode)
      .subscribe(response => {
        let coaaccounts = response.json();//this.getDropdownList(response.json(), 'accounT_CODE', 'accounT_TITLE');
        //console.log(coaaccounts);
        if (this.rMaster.PageCode == 940113) {
          this.coaCodes = this.getDropdownList(coaaccounts.filter(o => o.accT_TYPE_CODE == 2), 'accounT_CODE', 'accounT_TITLE');
          //console.log(this.coaCodes);
        } else if (this.rMaster.PageCode == 940112) {
          this.coaCodes = this.getDropdownList(coaaccounts.filter(o => o.accT_TYPE_CODE == 3), 'accounT_CODE', 'accounT_TITLE');
        } else {
          this.coaCodes = this.getDropdownList(coaaccounts, 'accounT_CODE', 'accounT_TITLE');
        }

      });
  }
  getBankAccounts(accT_TYPE_CODE) {
    this.service.getBankAccounts(accT_TYPE_CODE)
      .subscribe(response => {
        this.bankAccounts = this.getDropdownList(response.json(), 'accounT_CODE', 'accounT_TITLE');
        // console.log(this.bankAccounts);
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

    this.setCriteriaView(this.report_ID);
    this.ishidden = true;
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      arr.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            itemName: obj[valuetxt] + ' : ' + obj[displaytxt]
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
    //this.changeReport(this.selectedReport, "0");
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
    //  console.log('Report Change ' +obj);
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
      this.rMaster.ReportName = "Reports\\FISReports\\" + this.selectedReport.reportName;
     
      this.rMaster.WaterMarkText = "";

      if (this.cancel)
        this.rMaster.WaterMarkText = 'Cancelled';

      if (this.VSFinal == false)
        this.rMaster.WaterMarkText = sessionStorage.getItem('FMSProvisionalWaterMark');
 
       

      if (this.selectedReport.reportType != null)
        this.rMaster.ReportType = this.selectedReport.reportType;
      this.rMaster.ReportSP = this.selectedReport.spName;


      this.rMaster.ReportSetting = sessionStorage.getItem('reportFormat');

      if (this.VSFinal == true)
        this.rMaster.isStamp = true;
      else
        this.rMaster.isStamp = false;

      this.rMaster.ReportParam = this.params;
      this.rMaster.DspParam = this.dspparams;





      if (sender.toString() == "0") {
        this.rMaster.ReportSetting = "1";
      }
      else if (sender.toString() == "1") {
        this.rMaster.ReportSetting = "1";
      }
      else if (sender.toString() == "2") {
        this.rMaster.ReportSetting = "2";
        this.rMaster.BlankReport = "0";
      }
      else if (sender.toString() == "3") {
        this.rMaster.ReportSetting = "3";
        this.rMaster.BlankReport = "0";
      }

      if (this.rMaster.BlankReport == "0") {
        console.log(this.rMaster);
        this.rv.setReportParams(new SharedParams("", this.rMaster)).then(
          (response) => {
            let url = "";
            if (response != null) {
              console.log(response);
              var mediaType;

              if (this.rMaster.ReportSetting == "1")
                mediaType = 'application/pdf';
              else if (this.rMaster.ReportSetting == "2")
                mediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
              else
                mediaType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

              var blob = new Blob([response._body], { type: mediaType });
              url = URL.createObjectURL(blob);
              $("#mydiv").html("<iframe id='myFrame'  src='" + url + "' width='100%'   scrolling='no' style='display: block;height: 100vh; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
              var timer = setTimeout(() => { this.showER = 'none'; this.showPS = ''; this.showPW = 'none'; this.isLoadingRpt = false; this.isLoading = false; }, 1000);
            }
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
            this.isLoadingRpt = false;
            this.showER = '';
            this.showPS = 'none';
            this.showPW = "none";
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
  changeName(obj: any, sender: any) {
    this.VSFinal = false;
    $("#mydiv").html("");
    this.isLoading = false;
    this.ishidden = true;
    if (obj != null) {
      this.selectedReport = obj;
      this.report_ID = obj.page_Code;
      this.reportName = obj.page_Name;

      this.params = [];
      this.setCriteriaView(this.report_ID);

    }
  }
  setCriteriaView(rid: number) {

    switch (rid) {
      case 940001:
        this.criteriaSets("CSFinancialCOA");
        this.VSFinalShow = false;
        this.VSFinal = true;
        break;
      case 940002:
      case 940003:
      case 940004:
      case 940005:
      case 940006:
        this.criteriaSets("CSFinancial");
        this.VSFinal = false;
        this.VSFinalShow = true;
        break;
      case 940007:
      case 940008:
      case 940009:
      case 940010:
      case 940011:
        this.criteriaSets("CSFinancialList");

        break;
      case 940015:

        this.criteriaSets("CSFinancialList");
        this.VSFinalShow = false;
        this.VSFinal = false;


        break;

      case 940012:
        this.criteriaSets("CSGL");
        break;
      case 940112:
        this.criteriaSets("CSGL");
        break;
      case 940113:
        this.criteriaSets("CSGL");
        break;
      case 940117:
        this.criteriaSets("notetoaccount");
        this.NoteType="BS";
        break;
      case 940016:
        this.criteriaSets("CSGL");        
        break;
      case 940114:
        this.criteriaSets("CSBankLedger");
        this.ddlBankAccountShow = false;
        break;
      case 940116:

        this.criteriaSets("CSBankLedger");
        this.ddlBankAccountShow = false;
        break;
    }
  }
  reportParams(rid: number) {

    switch (rid) {
      case 940001:
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : 1)));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All");

        break;
      case 940002:
      case 940003:
      case 940004:
      case 940005:
      case 940006:
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDate() != null ? this.DateTo.getDate() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Voucher_No", (this.VoucherNo != null ? this.VoucherNo : -1)));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All");
        break;
      case 940007:
      case 940008:
      case 940009:
      case 940010:
      case 940011:
      case 940015:
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All") + "      "
          + (this.cancel != false ? "Status : Cancelled" : "");


        break;

      case 940012:

        this.accT_TYPE_CODE = 1;//General Ledger
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@AccountCode", (this.CoaCode != null ? this.CoaCode[0].id : -1)));
        this.params.push(new ReportParam("@TypeCode", (this.accT_TYPE_CODE != null ? this.accT_TYPE_CODE : -1)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All") + "      "
          + (this.CoaCode != null ? "Account : " + this.CoaCode[0].itemName + "" : "");
        break;
      case 940112:
        this.accT_TYPE_CODE = 3;//Bank Ledger
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@AccountCode", (this.CoaCode != null ? this.CoaCode[0].id : -1)));
        this.params.push(new ReportParam("@TypeCode", (this.accT_TYPE_CODE != null ? this.accT_TYPE_CODE : -1)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All") + "      "
          + (this.CoaCode != null ? "Account : " + this.CoaCode[0].itemName + "" : "");
        break;
      case 940113:
        this.accT_TYPE_CODE = 2;//Cash Ledger
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@AccountCode", (this.CoaCode != null ? this.CoaCode[0].id : -1)));
        this.params.push(new ReportParam("@TypeCode", (this.accT_TYPE_CODE != null ? this.accT_TYPE_CODE : -1)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));
        // this.criteriaSets("CSGL");

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All") + "      "
          + (this.CoaCode != null ? "Account : " + this.CoaCode[0].itemName + "" : "");
        break;

      case 940016:
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@AccountCode", (this.CoaCode != null ? this.CoaCode[0].id : -1)));
        this.params.push(new ReportParam("@TypeCode", (this.accT_TYPE_CODE != null ? this.accT_TYPE_CODE : -1)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));


        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All") + "      ";
        break;
      case 940114:
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All");
        break;
      case 940116:
        this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
        this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
        this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@VSFinal", this.VSFinal));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All");
        break;
        case 940117:
          this.params.push(new ReportParam("@FromDate", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : null)));
          this.params.push(new ReportParam("@ToDate", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : null)));
          this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
          this.params.push(new ReportParam("@Cancel", this.cancel));
          this.params.push(new ReportParam("@VSFinal", this.VSFinal));
          this.params.push(new ReportParam("@NoteType", (this.NoteType)));
          this.params.push(new ReportParam("@NoteID", (1)));
  
          this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName.replace('0 :', '') : "All");
          break;
    }
  }

  export(opt) {
    if (opt == "pdf") {
      sessionStorage.setItem('reportFormat', "1");
      this.rMaster.ReportSetting = "1";
      this.changeReport(this.selectedReport, "1");

    } else if (opt == "excel") {
      this.rMaster.ReportSetting = "2";
      sessionStorage.setItem('reportFormat', "2");
      this.changeReport(this.selectedReport, "2");
    }
    else if (opt == "word") {
      this.rMaster.ReportSetting = "3";
      sessionStorage.setItem('reportFormat', "3");
      this.changeReport(this.selectedReport, "3");
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
  criteriaSets(cset: any) {
    
    this.cancelShow = 0;
    this.VSFinalShow = 0;
    this.ddlAccountShow = false;

    if (cset == "CSFinancialCOA") {
      this.ddlofficeShow = true;
      this.from_DateShow = true;
      this.to_DateShow = true;
      this.ddlfinYearShow = false;
      this.ddlCoaLevelsShow = false;
      this.ddlVouchersShow = false;
      this.ddlVoucherTypesShow = false;
      this.ddlLedgerStatusShow = false;
      this.ddlVoucherStatusShow = false;
      this.noteTypeShow = false;
    } else if (cset == "CSFinancial") {
      this.ddlofficeShow = true;
      this.ddlfinYearShow = false;
      this.ddlCoaLevelsShow = false;
      this.ddlVouchersShow = true;
      this.ddlVoucherTypesShow = false;
      this.ddlLedgerStatusShow = false;
      this.ddlVoucherStatusShow = false;
      this.noteTypeShow = false;
    } else if (cset == "CSFinancialList") {
      this.ddlofficeShow = true;
      this.from_DateShow = true;
      this.to_DateShow = true;
      this.ddlfinYearShow = false;
      this.ddlCoaLevelsShow = false;
      this.ddlVouchersShow = false;
      this.ddlVoucherTypesShow = false;
      this.ddlLedgerStatusShow = false;
      this.ddlVoucherStatusShow = false;
      this.cancelShow = 1;
      this.noteTypeShow = false;
    } else if (cset == "CSGL") {
      this.ddlofficeShow = true;
      this.from_DateShow = true;
      this.to_DateShow = true;
      this.ddlfinYearShow = false;
      this.ddlCoaLevelsShow = false;
      this.ddlVouchersShow = false;
      this.ddlVoucherTypesShow = false;
      this.ddlLedgerStatusShow = false;
      this.ddlVoucherStatusShow = false;
      this.ddlAccountShow = true;
      this.ddlBankAccountShow = false;
      this.noteTypeShow = false;
      this.getCoaLevels(4);
    }
    else if (cset == "CSBankLedger") {
      this.ddlofficeShow = true;
      this.from_DateShow = true;
      this.to_DateShow = true;
      this.ddlBankAccountShow = true;
      this.ddlAccountShow = false;
      this.ddlfinYearShow = false;
      this.ddlCoaLevelsShow = false;
      this.ddlVouchersShow = false;
      this.ddlVoucherTypesShow = false;
      this.ddlLedgerStatusShow = false;
      this.ddlVoucherStatusShow = false;
      this.noteTypeShow = false;

    }
    else if (cset == "notetoaccount")
    {
      this.ddlofficeShow = true;
      this.from_DateShow = true;
      this.to_DateShow = true;
      this.ddlBankAccountShow = false;
      this.ddlAccountShow = false;
      this.noteTypeShow = true;
      this.ddlfinYearShow = false;
      this.ddlCoaLevelsShow = false;
      this.ddlVouchersShow = false;
      this.ddlVoucherTypesShow = false;
      this.ddlLedgerStatusShow = false;
      this.ddlVoucherStatusShow = false;
      this.VSFinalShow = true;
      this.ddlBankAccountShow = false;
    }
    else if (cset == "CSFinancialTrail") {
      this.ddlofficeShow = true;
      this.from_DateShow = true;
      this.to_DateShow = true;
      this.ddlfinYearShow = true;
      this.ddlCoaLevelsShow = true;
      this.ddlVouchersShow = true;
      this.ddlVoucherTypesShow = true;
      this.ddlLedgerStatusShow = true;
      this.ddlVoucherStatusShow = true;
      this.getCoaLevels(4);
      this.noteTypeShow = false;
    }
    var timer = setTimeout(() => this.isLoading = false, 3000);

  }
  //changeGDN
  changeVSFinal(VSFinal) {
    if (VSFinal == false)
      this.VSFinal = 0;
    else {
      this.VSFinal = 1;
    }
  }

  updateVSFinal(cancel) {
    if (cancel == true)
      this.prvdisabled = 1;
    else {
      this.prvdisabled = 0;
    }
  }

  //changeFromDate
  changeFromDate(pO_Date) {

    if (this.DateToFY.getStandardDate() < this.DateTo.getStandardDate())
      this.DateTo.setDate(this.DateToFY.getDateFinal());

    if (this.DateFrom.getStandardDate() < this.DateFromFY.getStandardDate())
      this.DateFrom.setDate(this.DateFromFY.getDateFinal());

    if (this.DateTo.getStandardDate() < this.DateFrom.getStandardDate())
      this.DateTo.setDate(this.DateFrom.getDateFinal());
  }
}
