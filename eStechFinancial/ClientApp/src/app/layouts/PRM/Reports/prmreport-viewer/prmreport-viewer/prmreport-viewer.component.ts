import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { SharedPipesModule, ReportViewerService, ReportParam, ReportService, Columns, LoginService, ReportsList, HeaderService, DataService, ReportMaster, SearchFilterService, cDate, NgbDateFRParserFormatter, SharedParams } from '../../../../../shared';
import { ActivatedRoute, Router } from '@angular/router'; 

declare var jsPDF: any;
declare var html2canvas: any
declare var window: any;
declare var ngTableExcelExport;


@Component({
    selector: 'prmreport-viewer',
    templateUrl: './prmreport-viewer.component.html',
    styleUrls: ['./prmreport-viewer.component.css'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class PRMReportViewerComponent implements OnInit, OnChanges {
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
        classes: "custom-class",
    };
    settings1 = {
        enableCheckAll: 'false',
        singleSelection: 'true',
        enableSearchFilter: true,
        classes: "custom-class",
    };

    //Drop downs variables
    offices: any[];
    departments: any[];
    designations: any[];
    categories: any[];

    employees: any[];
    employemnts: any[];
    genders: any[];



    date = new Date();
    public OfficeId: any[];
    public DepartmentId: any[];
    public DesignationId: any[];
    public CategoryId: any[];

    public EmployeeId: any[];
    public EmploymentTypeId: any;
    public GenderId: any = 1;
    public DateFrom = new cDate();
    public DateTo = new cDate();

    public status: any = true;
    public confirm: any = true;
    public cnic: any;

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
    officeShow: boolean = false;
    dateFromShow: boolean = false;
    dateToShow: boolean = false;
    departmentShow: boolean = false;
    designationShow: boolean = false;
    categoryShow: boolean = false;
    employeeShow: boolean = false;
    employeeTypeShow: boolean = false;
    genderShow: boolean = false;
    cnicShow: boolean = false;
    statusShow: boolean = false;
    confirmShow: boolean = false;
    isCollapsed: boolean = false;
    companyshow: boolean = false;

    hid;
    ID;
    AuthKey;
    logedInUserID: any = 1;
    reportType: any = 3;
    showPS: string = '';
    showPW: string = 'none';
    showER: string = 'none';
    userOffice: any = 2;
    userPrivilegedOffice: any = '';
    userCurrentOffice: any;
    userCurrentWarehouse: any;

    constructor(private dataserv: DataService, private route: ActivatedRoute, private rv: ReportViewerService, private service: ReportService, private lservice: LoginService, private hservice: HeaderService, public router: Router, private searchfilter: SearchFilterService, private LoginService: LoginService) {

        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
        this.rMaster = new ReportMaster();
        sessionStorage.setItem('ReportView', '1')
        let iDate = new Date(sessionStorage.getItem('InceptionDate'));

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

        this.service.getOffice(this.userPrivilegedOffice)
            .subscribe(response => {
                this.offices = this.getDropdownList(response.json(), 'officE_CODE', 'officE_NAME');
            });


        this.service.getDepartments()
            .subscribe(response => {
                this.departments = this.getDropdownList(response.json(), 'departmentcode', 'departmentname');
            });


        this.service.getDesignations()
            .subscribe(res => {
                console.log(res.json());
                this.designations = this.getDropdownList(res.json(), 'designationcode', 'designationname');

            });


        this.service.getCategories()
            .subscribe(res => {
                this.categories = this.getDropdownList(res.json(), 'categorycode', 'categoryname');
            });


        this.service.getEmployees(this.userPrivilegedOffice)
            .subscribe(response => {
                this.employees = this.getDropdownList(response.json(), 'employeecode', 'employeename');
            });

        this.service.getEmploymentTypies()
            .subscribe(response => {
                this.employemnts = this.getDropdownList(response.json(), 'employmentcode', 'employmentname');
            });


        this.genders = [
            { "gendercode": 1, "gendername": "Male" }
            , { "gendercode": 2, "gendername": "Female" }
        ]


        //this.service.getGenders()
        //  .subscribe(response => {
        //    this.genders = this.getDropdownList(response.json(), 'gendercode', 'gendername');
        //  });
    }
    selectOneYear(datefrom, dodate, to) {
        
        if (datefrom == undefined) {
            datefrom = this.DateFrom;
            var fromyear = datefrom.model.year;
            var frommonth = datefrom.model.month;
            var fromday = datefrom.model.day;
        }
        else {

            fromyear = parseInt(datefrom.substring(6, 10));
            frommonth = parseInt(datefrom.substring(3, 5));
            fromday = parseInt(datefrom.substring(0, 2));
        }
        if (dodate == undefined) {
            dodate = this.DateTo;
            var doyear = dodate.model.year;
            var domonth = dodate.model.month;
            var doday = dodate.model.day;
        }
        else {
            doyear = parseInt(dodate.substring(6, 10));
            domonth = parseInt(dodate.substring(3, 5));
            doday = parseInt(dodate.substring(0, 2));
        }
        var date = new cDate();
        if (this.dateToShow == true) {
            if (sessionStorage.getItem('page_Name') == "Salary Summary") {

                if (fromyear != doyear) {
                    if (frommonth > domonth || (frommonth == domonth && fromday > doday) || (doyear != fromyear)) {
                        if (to == 1) {
                            var year = parseInt(datefrom.substring(6, 10));
                            var month = parseInt(datefrom.substring(3, 5));
                            var day = parseInt(datefrom.substring(0, 2));
                        }
                        else {
                            var year = parseInt(dodate.substring(6, 10));
                            var month = parseInt(dodate.substring(3, 5));
                            var day = parseInt(dodate.substring(0, 2));
                        }
                        if (day == 1) {
                            if (month == 1) {
                                if (to == 1)
                                    month = 12;
                            }
                            else {
                                if (to == 1) {
                                    year = year + 1;
                                    month = month - 1;
                                }
                                else {
                                    year = year - 1;
                                    day = day + 1;
                                }

                            }
                            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                                if (to == 1)
                                    day = 31;
                            }
                            else if (month == 2) {
                                if (to == 1)
                                    day = 28;
                            }
                            else {
                                if (to == 1)
                                    day = 30;
                            }
                        }
                        else {
                            if (to == 1) {
                                day = day - 1;
                                year = year + 1;
                            }
                            else {
                                day = day + 1;
                                year = year - 1;
                            }
                        }
                        if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && day == 32 && to == 0) {
                            day = 1;
                            month = month + 1;
                            if (month == 13)
                                month = 1;
                        }
                        if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31 && to == 0) {
                            day = 1;
                            month = month + 1;
                            if (month == 13)
                                month = 1;
                        }
                        if (year % 4 == 0 && month == 2 && to == 1) {
                            day = 29;
                        }
                        date.model.year = year;
                        date.model.month = month;
                        date.model.day = day;
                        if (to == 1)
                            this.DateTo = date;
                        else
                            this.DateFrom = date;
                    }
                }
            }
        }


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

        // console.log(changeRecord);
    }

    ngOnInit() {

        this.DateFrom.setFirstDayOfCurrentYear(this.date);
        this.DateTo.setLastDayOfCurrentYear(this.date);

        this.ishidden = true;
        this.hservice.getUserPriviligedFiles(this.logedInUserID)
            .subscribe(response => {
                this.reports = this.chunkReports((response.json()), sessionStorage.getItem('hid'));
                console.log(this.reports);
                this.changeReport(new ReportsList(this.rMaster.PageCode, this.rMaster.PageName, this.rMaster.ReportSP, this.rMaster.ReportName, sessionStorage.getItem("reportFormat"), null), "1");
            });
    }

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
    }

    count(r: any[], key: any) {

        if (key == 'PO_NO' || key == 'PO_DATE' || key == 'Supplier_Name') {
            return r['NoofRows'];
        } else {
            return 1;
        }

    }

    changeReport(obj: any, sender: any) {
        this.isLoading = true;
        $("#mydiv").html("");
        this.ishidden = true;
        if (obj != null) {
            this.selectedReport = obj;

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

            if (this.selectedReport.reportFormat == "2") {


                this.rMaster.ModuleCode = sessionStorage.getItem('header');
                this.rMaster.CompanyName = sessionStorage.getItem('CompanyName');
                this.rMaster.CompanyAddress = sessionStorage.getItem('CompanyAddress');
                this.rMaster.CompanyNote = sessionStorage.getItem('CompanyNote');
                this.rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');

                this.rMaster.DateParam = this.reportPeriod;
                this.rMaster.PageCode = this.selectedReport.page_Code;
                this.rMaster.PageName = this.selectedReport.page_Name;
                this.rMaster.ReportName = "Reports\\PRMReports\\" + this.selectedReport.reportName;
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
                                var timer = setTimeout(() => { this.showER = 'none'; this.showPS = ''; this.showPW = 'none'; this.isLoadingRpt = false }, 5000);
                            }
                        },
                        (error) => {
                            console.log(error);
                            this.isLoading = false;
                            this.isLoadingRpt = false;
                            this.showPW = 'none';
                            this.showPW = 'none';
                            this.showER = '';
                        })
                }
                else {
                    this.isCollapsed = true;
                }
            }
        }
    }

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

    handleChange(id: any, e) {
        var isChecked = e.target.checked;
        this.rv.togglecolumns(this.logedInUserID, id, isChecked).subscribe(response => {
        });
    }

    Onchange(arg) {
        // console.log(arg);
    }

    reportParams(rid: number) {

        switch (rid) {

            ////CSEmployee------------------------------------////      
            case 930001:
            case 930003:
            case 930004:
            case 930006:
            case 930007:
            case 920008:
            case 920009:
            case 930009:
            case 930010:
            case 930011:
            case 930016:
            case 930018:
            case 930019:
            case 930020:
            case 930021:
                this.params.push(new ReportParam("@OfficeCode", (this.OfficeId != null ? this.OfficeId[0].id : this.userPrivilegedOffice)));
                this.params.push(new ReportParam("@Datefrom", (this.DateFrom.getDateFinal() != null ? this.DateFrom.getDateFinal() : this.date)));
                this.params.push(new ReportParam("@Dateto", (this.DateTo.getDateFinal() != null ? this.DateTo.getDateFinal() : this.date)));
                this.params.push(new ReportParam("@DepartmentCode", (this.DepartmentId != null ? this.DepartmentId[0].id : "-1")));
                this.params.push(new ReportParam("@DesignationCode", (this.DesignationId != null ? this.DesignationId[0].id : "-1")));
                this.params.push(new ReportParam("@CategoryCode", (this.CategoryId != null ? this.CategoryId[0].id : "-1")));
                this.params.push(new ReportParam("@EmployeeCode", (this.EmployeeId != null ? this.EmployeeId[0].id : "-1")));
                this.params.push(new ReportParam("@EmploymentTypeID", (this.EmploymentTypeId != null ? this.EmploymentTypeId[0].id : "-1")));
                this.params.push(new ReportParam("@CNIC", (this.cnic != null ? this.cnic : "")));
                this.params.push(new ReportParam("@JobStatusID", (this.status != null ? (this.status == true ? 1 : 0) : "-1")));

                this.criteriaSets("CSEmployee");
                this.confirmShow = false;
                this.dspparams = "Office :" + (this.OfficeId != null ? this.OfficeId[0].itemName : "All") + "          "
                    + (this.DepartmentId != null ? "Department : " + this.DepartmentId[0].itemName + "          " : "")
                    + (this.DesignationId != null ? "Designation : " + this.DesignationId[0].itemName + "          " : "")
                    + (this.CategoryId != null ? "Category : " + this.CategoryId[0].itemName + "          " : "")
                    + (this.EmployeeId != null ? "Employee : " + this.EmployeeId[0].itemName + "          " : "")
                    + (this.EmploymentTypeId != null ? "Employment Type : " + this.EmploymentTypeId[0].itemName + "          " : "")
                    + (this.cnic != null ? "CNIC : " + this.cnic + "          " : "")
                    + (this.status != null ? "Status : " + this.status + "          " : "");
                break;
        }
    }

    onprint(id: any) {
        window.print()
    }

    getHeading(): any {
        let sum = 0;
        let hdn = 0;

        if (this.columns != null) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i]['column_IsTotal'] == true) {
                    sum = i - 1;
                    break;
                }
            }
            if (this.columns[sum]['column_IsVisible'] == false) {

                for (let x = 0; x < sum; x++) {
                    if (this.columns[x]['column_IsVisible'] == false) {

                        sum = x - 1;
                        break;
                    }
                }
            }
        }
        return sum;
    }

    getColSpan(): any {
        let sum = 0;
        if (this.columns != null) {
            for (let i = 0; i < this.columns.length; i++) {
                if (this.columns[i]['column_IsVisible'] == true) {
                    sum += 1;
                    if (this.columns[i]['column_IsTotal'] == true) {
                        break;
                    }
                }
            }
        }
        return sum;
    }

    getSum(arr: Array<any>, dataKey: any): any {
        let sum = 0;
        if (arr != null) {
            for (let i = 0; i < arr.length; i++) {
                sum += parseFloat(arr[i][dataKey]);
            }
        }
        return sum.toFixed(2);
    }

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

    criteriaSets(cset: any) {
        if (cset == "CSEmployee") {
            this.officeShow = true;
            this.dateFromShow = true;
            this.dateToShow = true;
            this.departmentShow = true;
            this.designationShow = true;
            this.categoryShow = true;
            this.employeeShow = true;
            this.employeeTypeShow = true;
            this.genderShow = true;
            this.cnicShow = true;
            this.statusShow = true;
            this.confirmShow = true;

        }
        var timer = setTimeout(() => this.isLoading = false, 3000);
    }

    showPWText() {
        this.isLoadingRpt = true;
        this.showPS = 'none';
        this.showPW = '';
        this.showER = 'none';
    }
}

interface TemplateData {
    id: string;
    itemName: string;
}
