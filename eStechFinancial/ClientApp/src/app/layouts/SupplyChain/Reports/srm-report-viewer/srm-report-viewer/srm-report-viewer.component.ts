import * as $ from 'jquery';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SCMReportViewerService, ReportParam, ReportService, Columns, LoginService, ReportsList, HeaderService, DataService, ReportMaster, SearchFilterService, cDate, NgbDateFRParserFormatter, SharedParams } from '../../../../../shared';
import { ActivatedRoute, Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { compileNgModule } from '@angular/compiler';
declare var window: any;

@Component({
  selector: 'srm-report-viewer',
  templateUrl: './srm-report-viewer.component.html',
  styleUrls: ['./srm-report-viewer.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SRMReportViewerComponent implements OnInit, OnChanges {

  currentValue: any = 0;
  detailPageId: any = 809000;
  summaryPageId: any = 809019;
  flagradio: any = this.detailPageId;
  selectedGroupId: any;
  subreports: ReportsList[];
  subreportShow: boolean = false;
  public Rlabels: any = ["", ""];



  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  rMaster = new ReportMaster();
  ishidden: any = true;
  data: any = 'abc';
  tab1: any = 'show';
  tab2: any = 'hide';
  rptname: any = '';

  settings = {
    enableCheckAll: 'false',
    limitSelection: '10',
    enableSearchFilter: true,
    // classes: "custom-class",
  };
  settings1 = {
    enableCheckAll: 'false',
    singleSelection: 'true',
    enableSearchFilter: true,
    classes: "custom-class",
  };
  temparr = [];
  //Drop downs variables
  officess: any[];
  officers: any[];
  officerIds: any = "";
  officerNames: any = "";
  offices: Array<Select2OptionData> = [];
  warehouses: Array<Select2OptionData> = [];
  public officeID: any = 1;
  public officeName: any;


  public warehouseID: any = 0;
  public warehouseName: any = "";

  //warehouses: any[];
  categories: any[];
  subcategories: any[];
  items: any[];
  regions: any[];
  areas: any[];
  areaIds: any = "";
  areaNames: any = "";
  areaId: any = "";
  areaName: any = "";
  provinces: any[];
vehicle_ID: any =0;
vehicle_NO : any = '';
  districts: any[];
  cities: any[];
  suppliercities: any[];
  subjects: any[];
  suppliers: any[];
  customers: any[];
  vehicles: any[];
  personCategories: any[];
  public selectedTexts: any[] = [];
  date = new Date();
  public OfficeId: any[];
  public WarehouseId: any[];
  public CategoryId: any[];
  public SubCategoryId: any[];
  public ItemId: any[];
  public SaleOrderID: any;
  public PurchaseOrderID: any;
  public InvoiceID: any;
  public SubjectId: any[];
  public SupplierId: any[];
  public CustomerId: any[];
  public RegionId: any[];
  public AreaId: any[];
  public UserId: any[];
  public DistrictId: any[];
  public TehsilId: any[];
  public SupplierCityId: any[];
  public VehicleId: any[];
  public ProvinceId: any[];
  savemoreFlag: any = false;
  btnmode: any = 0;
  public PersonCategoryId: any[];
  public SortBy: any = 1;
  public InceptionDate = new cDate();
  public DateFrom = new cDate();
  public DateTo = new cDate();
  public exchange: any = 0;
  public cancel: any = 0;
  public quantity: any = 1;
  public order: any = 0;
  message: any = "";
  reports: ReportsList[];
  companyName = 'ABC Corporation';
  reportName = '';
  reportPeriod = '';
  rows: any[];
  columns: Columns[];
  public params = new Array<ReportParam>();
  public dspparams: any;
  isLoading: any = true;
  isLoadingRpt: any = false;
  colspan = "";
  report_ID = 0;
  filter = "Today";
  selectedReport: ReportsList;
  customerShow: boolean = false;
  quantityShow: boolean = false;
  orderShow: boolean = false;
  subjectShow: boolean = false;
  publisherShow: boolean = false;
  supplierShow: boolean = false;
  saleOrderShow: boolean = false;
  purchaseOrderShow: boolean = false;
  invoiceShow: boolean = false;
  supplierCategoryShow: boolean = false;
  provinceShow: boolean = false;
  templateshow: boolean = false;
  districtShow: boolean = false;
  cityShow: boolean = false;
  regionShow: boolean = false;
  areaShow: boolean = false;
  officerShow: boolean = false;
  itemShow: boolean = false;
  itemCategoryShow: boolean = false;
  subCategoryShow: boolean = false;
  toDateShow: boolean = true;
  dateFromShow: boolean = true;
  dateToShow: boolean = true;
  officeShow: boolean = true;
  warehouseShow: boolean = false;
  vehicleShow: boolean = false;
  exportToPDF: boolean = true;
  exportToExcel: boolean = false;
  iframeShow: boolean = true;
  criteriaShow: boolean = false;
  isCollapsed: boolean = false;
  sortByShow:boolean = false;
  hid;
  ID;
  AuthKey;
  logedInUserID: any = 1;
  reportType: any = 3;
  exchangeShow: any = 0;
  cancelShow: any = 0;
  //Party Ledger
  sum1: number = 0;
  orders: any[] = [];
  ord: any[] = [];
  sum: number = 0;
  Total_Purchase: number = 0;
  item: number = 0;
  F_date: any;
  TO_Date: any;
  Balance_Amount: number = 0;
  purchase_amount: number = 0;
  Total_paid: number = 0;
  Party_Name: string = '';
  Party_ID: any;
  Invoice_ID: any;
  Total_Receive: number = 0;
  Description: string = '';
  Inovice_Amount: number = 0;
  Return: number = 0;
  Total_Sale: number = 0;
  showPS: string = '';
  showPW: string = 'none';
  showER: string = 'none';
  companies: any[] = [];
  public CompnayId: any[];
  companycode: any = 0;
  companyname: any = '';
  companyshow: any = '';
  userOffice: any = 1;
  userPrivilegedOffice: any = '';
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  hideSelect2 = false;

  allreports: any[] = [];

  constructor(private dataserv: DataService, private route: ActivatedRoute, private rv: SCMReportViewerService, private service: ReportService, private lservice: LoginService, private hservice: HeaderService, public router: Router, private searchfilter: SearchFilterService, private LoginService: LoginService) {

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
      this.rMaster.CompanyAddress = sessionStorage.getItem('CompanyAddress');
      this.rMaster.CompanyNote = sessionStorage.getItem('CompanyNote');
      this.rMaster.UserName = sessionStorage.getItem('employeeName');
      this.rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');
      this.rMaster.PageName = sessionStorage.getItem('page_Name');
      this.rMaster.BlankReport = "1";
      this.rMaster.ReportType = sessionStorage.getItem('reportType');
      this.rMaster.ReportName = sessionStorage.getItem('reportName');
      this.rMaster.PageCode = parseInt(sessionStorage.getItem('reportID'));
      this.rMaster.ReportSP = sessionStorage.getItem('reportSP');
      this.rMaster.ReportSetting = sessionStorage.getItem('ReportView');
      this.rMaster.DspParam = this.dspparams;
      this.dataserv.changereportType(sessionStorage.getItem('reportType'));
      this.report_ID = parseInt(sessionStorage.getItem('reportID'));
      this.hid = sessionStorage.getItem('header');
      this.reportName = sessionStorage.getItem('page_Name');
      this.ID = this.lservice.getSession('ID');
      this.AuthKey = this.lservice.getSession('AuthKey');
      this.logedInUserID = this.lservice.getSession('user_ID');
    }

    this.enableProvinceLabel();
    this.enableCustomerDropDown();
    this.enableSupplierDropDown();
    this.enableItemDropDown();

    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.officess = this.getDropdownList(response.json(), 'officE_CODE', 'officE_NAME');
      });

    this.service.getOfficers(this.userPrivilegedOffice)
      .subscribe(response => {
        this.officers = this.getDropdownList(response.json(), 'order_Envoy', 'emp_Name');
      });

    this.service.getSupplierCategory()
      .subscribe(response => {
        this.personCategories = this.getDropdownList(response.json(), 'supplierCategoryId', 'supplierCategoryName');
      });

    this.service.getProvinces()
      .subscribe(res => {
        this.provinces = this.getDropdownList(res.json(), 'provinceCode', 'provinceName');
      });

    this.service.getRegions()
      .subscribe(res => {
        this.regions = this.getDropdownList(res.json(), 'regionid', 'regionName');
      });

    this.service.getSubject()
      .subscribe(response => {
        this.subjects = this.getDropdownList(response.json(), 'subjectId', 'subjectName');
      });

    this.service.getCity()
      .subscribe(response => {
        this.cities = this.getDropdownList(response.json(), 'citY_CODE', 'name');
      });

    this.service.getRegions()
      .subscribe(res => {
        this.regions = this.getDropdownList(res.json(), 'regionid', 'regionName');
        // this.loadAreas(this.regions[0]);
      });

    this.service.getArea(-1)
      .subscribe(res => {
        this.areas = this.getDropdownList(res.json(), 'areaID', 'areaName');
      });

    this.service.getDistricts()
      .subscribe(res => {
        this.districts = this.getDropdownList(res.json(), 'districT_CODE', 'districT_NAME');
      });

    this.service.getItemCategory()
      .subscribe(res => {
        this.categories = this.getDropdownList(res.json(), 'category_Code', 'category_Name');
      });

      this.service.getVehicle()
      .subscribe(res => {
        this.vehicles = this.getDropdownLists(res.json(), 'vehicle_ID', 'vehicle_NO');
        console.log(this.vehicles);
      });

    this.service.getItemSubCategory()
      .subscribe(res => {
        this.subcategories = this.getDropdownList(res.json(), 'subCategory_Code', 'subCategory_Name');
      });

    this.service.getCompany()
      .subscribe(res => {
        this.companies = this.getDropdownList(res.json(), 'companycode', 'companyname');
      });
  }
  //ngOnInit()
  ngOnInit() {
    this.ishidden = true;
    this.hservice.getUserPriviligedFiles(this.logedInUserID)
      .subscribe(response => {
        this.allreports = this.chunkReports((response.json()), sessionStorage.getItem('hid'));

        this.reports = this.allreports.filter(f => f.sub_Header_ID == sessionStorage.getItem('subHeader'));//

        //  this.changeReport(new ReportsList(this.rMaster.PageCode, this.rMaster.PageName, this.rMaster.ReportSP, this.rMaster.ReportName, sessionStorage.getItem("reportFormat"), null), "1");
        this.isLoading = false;
        this.selectedReport = new ReportsList();
        this.selectedReport.page_Code = this.rMaster.PageCode;
        this.selectedReport.page_Name = this.rMaster.PageName;
        this.selectedReport.spName = sessionStorage.getItem('reportSP');
        this.selectedReport.reportName = this.rMaster.ReportName;
        this.selectedReport.reportFormat = sessionStorage.getItem("reportFormat");
        this.selectedReport.reportType = sessionStorage.getItem('reportType');
        this.setCriteriaView(this.report_ID);
      });

    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = this.getDropdownLists(response.json(), "officE_CODE", "officE_NAME");

        for (let i = 0; i < this.offices.length; i++)
          if (this.offices[i].id == this.userCurrentOffice) {
            this.officeID = this.offices[i].id;
            this.officeName = this.offices[i].text;

            this.OfficeId = [{ 'id': this.officeID, 'itemName': this.officeName }];
          }
          else {
            this.officeID = this.offices[0].id;
            this.officeName = this.offices[0].text;
            this.OfficeId = [{ 'id': this.officeID, 'itemName': this.officeName }];
          }
      });

    this.service.GetWarehouse(this.officeID)
      .subscribe(response => {
        this.warehouses = this.getDropdownLists(response.json(), 'warehouseID', 'warehoueName');

        this.warehouseID = this.warehouses[0].id;
        this.warehouseName = this.warehouses[0].text;
      });

  }
  //loadAreas
  loadAreas(region: any) {

    if (region != null) {
      this.service.getArea(this.DistrictId[0].id)
        .subscribe(res => {
          this.areas = this.getDropdownList(res.json(), 'areaID', 'areaName');
        });
    } else {
      this.areas = null;
    }
  }
  //onChange
  public onChange(o): void {
    this.service.getOfficers(this.OfficeId[0].id)
      .subscribe(response => {
        this.officers = this.getDropdownList(response.json(), 'order_Envoy', 'emp_Name');
      });
  }
  //OnAreaDeSelect
  OnAreaDeSelect(subject: any) {
    this.temparr = [];
    //  console.log('cleared', this.temparr)
  }
  //OnOfficersDeSelect
  OnOfficersDeSelect(subject: any) {
    this.temparr = [];
    //  console.log('cleared', this.temparr)
  }
  //unloadAreas
  unloadAreas(region: any) {

    this.areas = []
    this.TehsilId = [];
  }
  //loadCities
  loadCities(province: any) {
    // console.log(province);
    if (province != null) {
      this.service.GetProvinceCity(this.ProvinceId[0].id)
        .subscribe(res => {
          this.suppliercities = this.getDropdownList(res.json(), 'citY_CODE', 'namE');
        });
    } else {
      this.areas = null;
    }
  }
  //loadRegions
  loadRegions(ProvinceId: any) {
    //console.log(ProvinceId);
    if (ProvinceId != null) {
      this.service.loadRegions(this.ProvinceId[0].id)
        .subscribe(res => {
          this.regions = this.getDropdownList(res.json(), 'regionid', 'regionName');
        });
    } else {
      this.regions = null;
    }
  }
  //changeOffice
  changeOffice(e) {
    for (let i = 0; i < this.offices.length; i++)
      if (this.offices[i].id == e) {
        this.officeID = this.offices[i].id;
        this.officeName = this.offices[i].text;
      }

    this.officeID = e;
    this.service.GetWarehouse(this.officeID)
      .subscribe(response => {
        this.warehouses = this.getDropdownLists(response.json(), 'warehouseID', 'warehoueName');
        this.warehouseID = this.warehouses[0].id;
        this.warehouseName = this.warehouses[0].text;
      });
  }
  //changeWarehouse
  changeWarehouse(e) {
    for (let i = 0; i < this.warehouses.length; i++)
      if (this.warehouses[i].id == e) {
        this.warehouseID = this.warehouses[i].id;
        this.warehouseName = this.warehouses[i].text;
      }
  }
  changeVehicle(e) {
    
        this.vehicle_ID = e;
        this.vehicle_NO = this.vehicles.filter(f=>f.id == e)[0].text;
      
  }
  //unloadCities
  unloadCities(province: any) {

    this.provinces = []
    this.cities = [];
  }
  //chunkReports
  chunkReports(arr, condition) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].header_ID == condition && arr[i].page_Type_Code == 2) {
        newArr.push(arr[i]);
      }
    }
    return newArr;
  }
  //ngOnChanges
  ngOnChanges(changeRecord: SimpleChanges) {

    // console.log(changeRecord);
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
  //getDropdownLists
  getDropdownLists(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];

    if (sessionStorage.getItem("EnableEmptyRow") == '1' && this.btnmode == true && this.savemoreFlag == false) {
      ar.push({
        id: '0',
        text: ''
      });
    }

    if (arr != null) {
      arr.forEach(
        function (obj) {
          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    return ar;
  }
  //ApplyFilter
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
    //if (flag == true)
    //  this.changeReport(this.selectedReport, "0");
  }
  //count
  count(r: any[], key: any) {

    if (key == 'PO_NO' || key == 'PO_DATE' || key == 'Supplier_Name') {
      return r['NoofRows'];
    } else {
      return 1;
    }

  }


  //changeReport
  changeReport(obj: any, sender: any) {
    this.isLoading = true;
    $("#mydiv").html("");

    this.ishidden = true;
    // if (obj != null) {
    //  this.selectedReport = obj;

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


    if (this.AreaId != null) {
      this.areaIds = "";
      this.areaNames = "";
      for (let i = 0; i < this.AreaId.length; i++) {
        this.areaId = this.AreaId[i].id;
        this.areaName = this.AreaId[i].itemName;
        if (i == 0) {
          this.areaIds += this.areaId;
          this.areaNames += this.areaName;
        }
        else {
          this.areaIds += ',' + this.areaId;
          this.areaNames += ',' + this.areaName;
        }
      }
    }

    this.params = [];
    this.reportParams(this.report_ID);

    if (this.selectedReport.reportFormat == "2") {


      this.rMaster.ModuleCode = sessionStorage.getItem('header');
      this.rMaster.CompanyName = sessionStorage.getItem('CompanyName');
      this.rMaster.CompanyAddress = sessionStorage.getItem('CompanyAddress');
      this.rMaster.CompanyNote = sessionStorage.getItem('CompanyNote');
      this.rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');


      this.rMaster.DateParam = this.reportPeriod;
      this.rMaster.PageCode = this.selectedReport.page_Code;
      this.rMaster.PageName = this.selectedReport.page_Name;
      this.rMaster.ReportName = "Reports\\SCMReports\\" + this.selectedReport.reportName;


      if (this.rMaster.PageCode == 809064)
        if (this.CompnayId != null) {
          if (this.CompnayId[0].id == 1)
            this.rMaster.ReportName = "Reports\\SCMReports\\" + this.selectedReport.reportName;
          else if (this.CompnayId[0].id == 2)
            this.rMaster.ReportName = "Reports\\SCMReports\\ListofBooksFahrist1.repx";
          else if (this.CompnayId[0].id == 3)
            this.rMaster.ReportName = "Reports\\SCMReports\\ListofBooksFahrist2.repx";
          else if (this.CompnayId[0].id == 4)
            this.rMaster.ReportName = "Reports\\SCMReports\\ListofBooksFahrist3.repx";
        }
        else {
          this.rMaster.ReportName = "Reports\\SCMReports\\" + this.selectedReport.reportName;
        }

      if (this.CompnayId != null) {
        if (this.CompnayId[0].id == 1)
          this.rMaster.CompanyName = "DAR UL SHAOUR";
        else if (this.CompnayId[0].id == 2)
          this.rMaster.CompanyName = "Makki Darul Kutub";
        else if (this.CompnayId[0].id == 3)
          this.rMaster.CompanyName = "Tayyab Shamshad Printers";
        else if (this.CompnayId[0].id == 4)
          this.rMaster.CompanyName = "Book Zone";
      }
      else
        this.rMaster.CompanyName = sessionStorage.getItem('CompanyName');


      if (this.selectedReport.reportType != null)
        this.rMaster.ReportType = this.selectedReport.reportType;

      if (sessionStorage.getItem('AllowBlankReport').toString() == "1") {
        this.rMaster.BlankReport = sender;
      } else {
        this.rMaster.BlankReport = "0";
      }

      this.rMaster.ReportSP = this.selectedReport.spName;
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
              var timer = setTimeout(() => {this.showER = 'none'; this.showPS = ''; this.showPW = 'none'; this.isLoadingRpt = false; this.isLoading = false; }, 1000);
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
    // }
  }
  //export
  export(opt) {
    if (opt == "pdf") {
      this.rMaster.ReportSetting = "1";
      this.changeReport(this.selectedReport, "0");

    } else if (opt == "excel") {
      this.rMaster.ReportSetting = "2";
      this.changeReport(this.selectedReport, "2");
    }
    else if (opt == "word") {
      this.rMaster.ReportSetting = "3";
      this.changeReport(this.selectedReport, "3");
    }
  }
  //handleChange
  handleChange(id: any, e) {
    var isChecked = e.target.checked;
    this.rv.togglecolumns(this.logedInUserID, id, isChecked).subscribe(response => {
      // this.changeReport(new ReportsList(this.report_ID, this.reportName, null, null, sessionStorage.getItem("reportFormat")));
    });
  }
  //Onchange
  Onchange(arg) {
    // console.log(arg);
  }


  changeName(obj: any, sender: any) {

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

  //setCriteriaView
  setCriteriaView(rid: number) {
    switch (rid) {
      case 809060:
      case 809061:
      case 809110:
      case 809005:
      case 809022:
      case 809050:
        this.criteriaSets("CSSupplier");

        break;
      case 809036:

        this.criteriaSets("CSDay");

        break;

      case 809067:
      case 809091:
      case 809098:
        if (rid == 809091)
          this.criteriaSets("CSExchangeLedger");
        else
          this.criteriaSets("CSSupplierLedger");
        break;

      case 809102:
      case 809104:
      case 809106:
        this.criteriaSets("CSPurchasePending");
        break;

      case 809134:
        this.criteriaSets("CSGoodsReceivedNoteDetails");
        break;

      case 809011:
      case 809012:
      case 809013:
      case 809017:
      case 809032:

        this.criteriaSets("CSPurchase");

        break;


      case 809009:

        this.criteriaSets("CSPurchase");
        break;


      case 60010:
        this.criteriaSets("CSPurchase");
        this.cancelShow = false;
        this.exchangeShow = false;
        break;

      case 809078:
        this.criteriaSets("CSISupplierAging");
        break;
      case 809014:
        this.criteriaSets("CSPurchase");
        this.exchangeShow = false;
        break;

        case 809137:
        case 809138:
        this.criteriaSets("CSRecoveryDetailOfficerWise");
        this.dateFromShow = true;
        this.dateToShow = true;
        this.officerShow = true;
        this.areaShow = true;
        this.vehicleShow = true;
        break;

        case 809136:
        this.criteriaSets("CSDispatchNoteOfficerWise");
        this.dateFromShow = true;
        this.dateToShow = true;
        this.officerShow = true;
        this.areaShow = true;
        this.vehicleShow = true;
        break;

      ////-------------------------------------------------------------------------------------------------////
      ////-------------------------------------------------------------------------------------------------////




    }
    switch (rid) {

      case 809005:
      case 809006:
      case 809008:
      case 809012:
      case 809013:
      case 809092:
      case 809103:
      case 9110012:
        this.detailPageId = rid;
        this.showSUbReport(this.detailPageId);
    }
  }


  showSUbReport(rid) {
    this.subreportShow = false;
    console.clear();

    if (this.selectedReport.page_Code == rid) {
      this.flagradio = rid;

      var res = this.allreports.filter(x => x.parentId == rid);
      if (res.length > 0) {
        this.subreportShow = true;
        this.subreports = res;
        this.summaryPageId = res[0].page_Code;
        this.selectedGroupId = res[0].page_Code;
        var rlbl = this.allreports.filter(x => x.page_Code == rid);
        var s = rlbl[0].rLabels.split(",");


        this.Rlabels = [s[0], s[1]];
      }

    }
  }
  changeSubName(pageCode: any) {
    $("#mydiv").html("");
    this.isLoading = false;
    this.ishidden = true;
    this.params = [];

    var arr = this.subreports.filter(f => f.page_Code == pageCode)
    if (arr.length === 0) {
      arr = this.allreports.filter(x => x.page_Code == pageCode);
    }
    if (arr.length > 0) {
      this.setSelectedReport(arr);
    }


  }

  setSelectedReport(ar: any[]) {
    this.selectedReport = new ReportsList();
    this.selectedReport.page_Code = ar[0].page_Code;
    this.selectedReport.page_Name = ar[0].page_Name;
    this.selectedReport.spName = ar[0].spName;
    this.selectedReport.reportName = ar[0].reportName;
    this.selectedReport.reportFormat = ar[0].reportFormat;
    this.selectedReport.reportType = ar[0].reportType;
  }
  //reportParams
  reportParams(rid: number) {
    switch (rid) {
      case 809060:
      case 809061:
      case 809110:
      case 809005:
      case 809022:
      case 809050:
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@City_CODE", (this.TehsilId != null ? this.TehsilId[0].id : "-1")));
        this.params.push(new ReportParam("@REGION_CODE", (this.RegionId != null ? this.RegionId[0].id : "-1")));
        this.params.push(new ReportParam("@PROVINCE_CODE", (this.ProvinceId != null ? this.ProvinceId[0].id : "-1")));
        this.params.push(new ReportParam("@AREA_CODE", (this.AreaId != null ? this.areaIds : "-1")));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "     "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "     " : "")
          + (this.TehsilId != null ? "City : " + this.TehsilId[0].itemName + "     " : "")
          + (this.RegionId != null ? "Region : " + this.RegionId[0].itemName + "     " : "")
          + (this.ProvinceId != null ? "Provice : " + this.ProvinceId[0].itemName + "     " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "")
          + (this.AreaId != null ? "Area : " + this.areaNames + "     " : "");

        break;
      case 809036:
        this.params.push(new ReportParam("@Date", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@UserID ", (this.UserId != null ? this.UserId[0].id : "-1")));
        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All")
        + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");
        this.params.push(new ReportParam("@CategoryCode", (this.CategoryId != null ? this.CategoryId[0].id : "-1")));
        this.reportPeriod = 'As of ' + this.DateTo.getDateReport();

        break;

      case 809067:
      case 809091:
        case 809098:
        this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@CustomerID", "-1"));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");

        break;

      case 809102:
      case 809104:
      case 809106:
        this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
        + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "All          ")
        + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");

      break;

      case 809011:
      case 809012:
      case 809013:
      case 809017:
      case 809032:
        this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Exchange", this.exchange));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");
        break;


      case 809009:
        this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Exchange", this.exchange));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");
        break;


      case 60010:
        this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");
        break;

      case 809078:
        this.params.push(new ReportParam("@date", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@supplierid", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));

        this.reportPeriod = 'As of ' + this.DateTo.getDateReport();
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));

        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");

        break;
      case 809014:
        this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@Cancel", this.cancel));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));


        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
          + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "")
          + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");
        break;
        case 809134:
          this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
        this.params.push(new ReportParam("@SupplierID", (this.SupplierId != null ? this.SupplierId[0].id : "-1")));
        this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
        this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
        this.params.push(new ReportParam("@SortBy", (this.SortBy != null ? this.SortBy: "-1")));
        this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
        + (this.SupplierId != null ? "Supplier : " + this.SupplierId[0].itemName + "          " : "All          ")
        + (this.PersonCategoryId != null ? "Supplier Category : " + this.PersonCategoryId[0].itemName + "          " : "");
        break;
        case 809136:
          this.params.push(new ReportParam("@AREA_CODE", (this.AreaId != null ? this.areaIds : "-1")));
          this.params.push(new ReportParam("@UserID ", (this.UserId != null ? this.UserId[0].id : "-1")));
          this.params.push(new ReportParam("@Vehicle_ID", (this.vehicle_ID != 0 ? this.vehicle_ID : "-1")));
          // this.params.push(new ReportParam("@CustomerID", (this.CustomerId != null ? this.CustomerId[0].id : "-1")));
          this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
          this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
          this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
          this.params.push(new ReportParam("@CustomerID", (this.CustomerId != null ? this.CustomerId[0].id : "-1")));
          this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
          this.params.push(new ReportParam("@City_CODE", (this.TehsilId != null ? this.TehsilId[0].id : "-1")));
          this.params.push(new ReportParam("@REGION_CODE", (this.RegionId != null ? this.RegionId[0].id : "-1")));
          this.params.push(new ReportParam("@PROVINCE_CODE", (this.ProvinceId != null ? this.ProvinceId[0].id : "-1")));
          
          // this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All");
          // + (this.CustomerId != null ? "Customer : " + this.CustomerId[0].itemName + "          " : "")
  
          break;

        case 809137:
        case 809138:
          this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
          this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
          this.params.push(new ReportParam("@Office_Code", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
          this.params.push(new ReportParam("@CustomerID", (this.CustomerId != null ? this.CustomerId[0].id : "-1")));
          this.params.push(new ReportParam("@CategoryCode", (this.PersonCategoryId != null ? this.PersonCategoryId[0].id : "-1")));
          this.params.push(new ReportParam("@City_CODE", (this.TehsilId != null ? this.TehsilId[0].id : "-1")));
          this.params.push(new ReportParam("@REGION_CODE", (this.RegionId != null ? this.RegionId[0].id : "-1")));
          this.params.push(new ReportParam("@PROVINCE_CODE", (this.ProvinceId != null ? this.ProvinceId[0].id : "-1")));
          this.params.push(new ReportParam("@AREA_CODE", (this.AreaId != null ? this.areaIds : "-1")));
          this.params.push(new ReportParam("@UserID ", (this.UserId != null ? this.UserId[0].id : "-1")));
          this.params.push(new ReportParam("@Vehicle_ID", (this.vehicle_ID != 0 ? this.vehicle_ID : "-1")));
          this.params.push(new ReportParam("@Cancel", this.cancel));
  
  
  
          this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
            + (this.CustomerId != null ? "Customer : " + this.CustomerId[0].itemName + "          " : "")
            + (this.PersonCategoryId != null ? "Customer Category : " + this.PersonCategoryId[0].itemName + "          " : "")
            + (this.TehsilId != null ? "City : " + this.TehsilId[0].itemName + "          " : "")
            + (this.RegionId != null ? "Region : " + this.RegionId[0].itemName + "          " : "")
            + (this.ProvinceId != null ? "Provice : " + this.ProvinceId[0].itemName + "          " : "")
            + (this.AreaId != null ? "Area : " + this.areaNames + "          " : "")
            + (this.vehicle_ID != 0 ? "Vehicle : " + this.vehicle_NO + "          " : "")
            + (this.UserId != null ? "Officer : " + this.UserId[0].itemName + "          " : "");
        break;

      ////-------------------------------------------------------------------------------------------------////
      ////-------------------------------------------------------------------------------------------------////




    }

  }
  //onprint
  onprint(id: any) {

    window.print()
  }

  //toggleTab
  toggleTab(vis: any) {

    if (vis == 'show') {
      $("#tab1").css("display", "none");
      $("#tab2").css("display", "block");
      $("#btn2").css("background", "#ffc103");
      $("#btn1").css("background", "transparent");
      $("#btn1:after").css("background", "transparent");

    }
    else {
      $("#tab1").css("display", "block");
      $("#tab2").css("display", "none");
      $("#btn1").css("background", "#ffc103");
      $("#btn1:after").css("background", "#ffc103");
      $("#btn2").css("background", "transparent");
    }
  }
  //criteriaSets
  criteriaSets(cset: any) {
    
    this.dateFromShow = true;
    this.dateToShow = true;
    this.officeShow = true;
    this.supplierShow = false;
    this.customerShow = false;
    this.supplierCategoryShow = false;
    this.itemCategoryShow = false;
    this.subCategoryShow = false;
    this.itemShow = false;
    this.provinceShow = false;
    this.districtShow = false;
    this.regionShow = false;
    this.cityShow = false;
    this.areaShow = false;
    this.exchangeShow = 0;
    this.cancelShow = 0;
    this.quantityShow = false;
    this.orderShow = false;
    this.subjectShow = false;
    this.publisherShow = false;
    this.sortByShow = false;
    this.vehicleShow = false;

    if (cset == "CSPurchase") {
      this.supplierShow = true;
      this.supplierCategoryShow = true;
      this.exchangeShow = this.lservice.getSession('ShowExchangeOnReports');
      this.cancelShow = 1;
    }
    else if (cset == "CSSupplier") {
      this.dateFromShow = true;
      this.dateToShow = true;
      this.supplierShow = true;
      this.regionShow = true;
      this.provinceShow = true;
      this.cityShow = true;
      this.areaShow = true;
      this.officerShow = true;
      this.supplierCategoryShow = true;

    }
    else if (cset == "CSSupplierLedger" || cset == "CSExchangeLedger") {
      this.supplierShow = true;
      this.supplierCategoryShow = true;
    }

    else if (cset == "CSISupplierAging") {
      this.dateFromShow = false;
      this.supplierShow = true;
      this.supplierCategoryShow = true;
    }

    else if (cset == "CSPurchasePending") {
      this.dateFromShow = true;
      this.dateToShow = true;
      this.supplierCategoryShow = true;
      this.supplierShow = true;
      
    }
    else if(cset == "CSGoodsReceivedNoteDetails")
    {
      this.supplierCategoryShow = false;
      this.supplierShow = true;
      this.sortByShow = true;
      this.subreportShow = false;
      this.officerShow = false;
    }
    else if (cset == "CSRecoveryDetailOfficerWise") {
      // this.itemShow = true;
      this.dateFromShow = true;
      this.dateToShow = true;
      this.customerShow = true;
      //this.customerCategoryShow = true;
      this.regionShow = true;
      this.provinceShow = true;
      this.cityShow = true;
      this.areaShow = true;
      this.officerShow = true;
    }
    else if (cset == "CSDispatchNoteOfficerWise") {
      // this.itemShow = true;
      this.dateFromShow = true;
      this.dateToShow = true;
      this.customerShow = true;
      //this.customerCategoryShow = true;
      this.regionShow = true;
      this.provinceShow = true;
      this.cityShow = true;
      this.areaShow = true;
      this.officerShow = true;
    }

    if (this.lservice.getSession('EnableAreaonSO') != '1') {
      this.areaShow = false
    }
    if (this.lservice.getSession('AllowProvince') != '1') {
      this.provinceShow = false
    }
    if (this.lservice.getSession('AllowRegion') != '1') {
      this.regionShow = false
    }

    var timer = setTimeout(() => this.isLoading = false, 3000);

  }
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  sessionEnableTextboxCustomer = 0;
  textboxCustomerID: any = 0;
  textboxCustomerName: any = '';
  textboxCustomerSearch: any = '';
  searchGridCustomer: any[] = [];
  searchGridCustomerTemp: any[] = [];
  sessionEnableTextboxSupplier = 0;
  textboxSupplierID: any = 0;
  textboxSupplierName: any = '';
  textboxSupplierSearch: any = '';
  searchGridSupplier: any[] = [];
  searchGridSupplierTemp: any[] = [];
  sessionEnableTextboxItem = 0;
  textboxItemID: any = 0;
  textboxItemName: any = '';
  textboxItemSearch: any = '';
  searchGridItem: any[] = [];
  searchGridItemTemp: any[] = [];
  provinceLabel: any = '';
  enableprovinceLabel: any = 0;

  enableCustomerDropDown() {
    //alert(this.lservice.getSession('EnableCustomerSearchDropDown'));
    if (this.lservice.getSession('EnableCustomerSearchDropDown') != '1') {
      $("#DropDownCustomerSearch").hide();
      this.sessionEnableTextboxCustomer = 0;
      this.service.getCustomer()
        .subscribe(response => {
          this.customers = this.getDropdownList(response.json(), 'customer_ID', 'customer_Name');
        });
    }
    else {
      $("#DropDownCustomerSelect2").hide();
      this.sessionEnableTextboxCustomer = 1;
      this.SearchCustomerDropDown('');
    }
  }
  SearchCustomerByID(Query) {
    this.searchfilter.SearchCustomerByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedCustomer(List[0].id, List[0].name)
        }
        else {
          this.textboxCustomerID = 0;
          this.textboxCustomerName = '';
          let Row = {} as TemplateData;
          Row.id = '-1';
          Row.itemName = '';
          var Array = [];
          Array.push(Row);
          this.CustomerId = Array;

        }

      });

  }
  SearchCustomerDropDown(Query) {

    this.searchGridCustomer = [];
    console.log('Query', Query);

    this.searchfilter.SearchCustomerDropDown(Query)
      .subscribe(response => {
        if (this.searchGridCustomer != null) {
          this.searchGridCustomer = (response.json());

          if (this.searchGridCustomerTemp.length <= 0) {
            this.searchGridCustomerTemp = this.searchGridCustomer;
          }
        }

      });

  }
  setCustomerSearchFocus() {
    var timer = setTimeout(() => $("#textboxCustomerSearch").focus(), 500);

  }
  setSelectedCustomer(ID, Name) {
    console.log(ID, Name);
    this.textboxCustomerID = ID;
    this.textboxCustomerName = Name;

    let Row = {} as TemplateData;
    Row.id = ID;
    Row.itemName = Name;
    var Array = [];
    Array.push(Row);
    this.CustomerId = Array;
    // alert(this.CustomerId[0].id);
    this.textboxCustomerSearch = '';
    this.searchGridCustomer = this.searchGridCustomerTemp;

  }
  enableSupplierDropDown() {
    //alert(this.LoginService.getSession('EnableSupplierSearchDropDown'));
    if (this.lservice.getSession('EnableSupplierSearchDropDown') != '1') {
      $("#DropDownSupplierSearch").hide();
      this.sessionEnableTextboxSupplier = 0;
      this.service.getSupplier()
        .subscribe(response => {
          this.suppliers = this.getDropdownList(response.json(), 'supplier_ID', 'supplier_Name');
        });
    }
    else {
      $("#DropDownSupplierSelect2").hide();
      this.sessionEnableTextboxSupplier = 1;
      this.SearchSupplierDropDown('');
    }
  }
  SearchSupplierByID(Query) {


    this.searchfilter.SearchSupplierByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedSupplier(List[0].id, List[0].name)
        }
        else {
          this.textboxSupplierID = 0;
          this.textboxSupplierName = '';
          let Row = {} as TemplateData;
          Row.id = '-1';
          Row.itemName = '';
          var Array = [];
          Array.push(Row);
          this.SupplierId = Array;
        }
      });

  }
  SearchSupplierDropDown(Query) {

    this.searchGridSupplier = [];
    console.log('Query', Query);

    this.searchfilter.SearchSupplierDropDown(Query)
      .subscribe(response => {
        if (this.searchGridSupplier != null) {
          this.searchGridSupplier = (response.json());

          if (this.searchGridSupplierTemp.length <= 0) {
            this.searchGridSupplierTemp = this.searchGridSupplier;
          }
        }

      });

  }
  setSupplierSearchFocus() {
    var timer = setTimeout(() => $("#textboxSupplierSearch").focus(), 500);

  }
  setSelectedSupplier(ID, Name) {
    console.log(ID, Name);
    this.textboxSupplierID = ID;
    this.textboxSupplierName = Name;

    let Row = {} as TemplateData;
    Row.id = ID;
    Row.itemName = Name;
    var Array = [];
    Array.push(Row);
    this.SupplierId = Array;
    //alert(this.SupplierId[0].id);

    this.textboxSupplierSearch = '';
    this.searchGridSupplier = this.searchGridSupplierTemp;



  }
  enableItemDropDown() {
    //alert(this.LoginService.getSession('EnableItemSearchDropDown'));
    if (this.lservice.getSession('EnableItemSearchDropDown') != '1') {
      $("#DropDownItemSearch").hide();
      this.sessionEnableTextboxItem = 0;
      this.service.getItem()
        .subscribe(res => {
          this.items = this.getDropdownList(res.json(), 'item_Code', 'item_Name');
        });
    }
    else {
      $("#DropDownItemSelect2").hide();
      this.sessionEnableTextboxItem = 1;
      this.SearchItemDropDown('');

    }
  }
  SearchItemByID(Query) {

    this.searchfilter.SearchItemByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedItem(List[0].id, List[0].name)

        }
        else {
          this.textboxItemID = 0;
          this.textboxItemName = '';
          let Row = {} as TemplateData;
          Row.id = '-1';
          Row.itemName = '';
          var Array = [];
          Array.push(Row);
          this.ItemId = Array;

        }

      });

  }
  SearchItemDropDown(Query) {

    this.searchGridItem = [];

    this.searchfilter.SearchItemDropDown(Query, 0, 0, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        if (this.searchGridItem != null) {
          this.searchGridItem = (response.json());

          if (this.searchGridItemTemp.length <= 0) {
            this.searchGridItemTemp = this.searchGridItem;
          }

        }

      });


  }
  setItemSearchFocus() {
    var timer = setTimeout(() => $("#textboxItemSearch").focus(), 500);

  }
  setSelectedItem(ID, Name) {
    console.log(ID, Name);
    this.textboxItemID = ID;
    this.textboxItemName = Name;
    let Row = {} as TemplateData;
    Row.id = ID;
    Row.itemName = Name;
    var Array = [];
    Array.push(Row);
    this.ItemId = Array;
    //alert(this.SupplierId[0].id);
    this.textboxItemSearch = '';
    this.searchGridItem = this.searchGridItemTemp;

  }
  enableProvinceLabel() {
    console.log(this.lservice.getSession('EnableProvince'));
    if (this.lservice.getSession('EnableProvince') != '1') {
      this.provinceLabel = 'Region :';

    }
    else {
      this.provinceLabel = 'Province :';

    }
  }
  showPWText() {
    this.isLoadingRpt = true;
    this.showPS = 'none';
    this.showPW = '';
    this.showER = 'none';

  }
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
}

interface TemplateData {
  id: string;
  itemName: string;
}
