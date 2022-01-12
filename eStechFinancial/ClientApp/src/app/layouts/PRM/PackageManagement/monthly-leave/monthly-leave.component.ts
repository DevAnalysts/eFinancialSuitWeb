import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MonthlyLeaveService, LoginService, MonthlyLeave, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
    selector: 'monthly-leave',
    templateUrl: './monthly-leave.component.html',
    styleUrls: ['./monthly-leave.component.scss'],


    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class MonthlyLeaveComponent implements OnInit {

    logedInUserID: any = 1;
    UserSessionID: any = 0;
    public permissionUtility: PermissionUtility = new PermissionUtility();
    public valid: Validation = new Validation();
    public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
    p: number = 1;
    id: any;
    modalReference: NgbModalRef;
    isLoading: any = false;
    closeResult: string;
    alerts: Array<any> = [];
    guid: any;
    mode: any = false;
    btnmode: any = false;
    status: any = false;


    gridlist: any[] = [];
    salary: any[] = [];
    salarycode: any = 0;


    emplist: Array<Select2OptionData>;
    sortMe: any[] = [];
    emplistR: any[] = [];
    empmodel: any = 0;
    empcode: any = 1;
    empname: any = '';

    office: any[] = [];
    officecode: any = 1;
    officename: any = '';

    month: any[] = [];
    monthcode: any = 1;
    monthname: any = '';
    days: any = 1;
    showsave: any = '';
    public leavefromdate = new cDate();
    public leavetodate = new cDate();
    public resigndate = new cDate();
    public joiningdate = new cDate();
    datemode: any = '';
    //displayMonths = 1;
    //navigation = 'none';
    //showWeekNumbers = false;
    leaves: any[] = [];
    leavescode: any = 0;
    ////////////////////////
    userOffice: any;
    userPrivilegedOffice: any;
    userCurrentOffice: any;
    userCurrentWarehouse: any;
    priviledged_Offices: any;
    constructor(private LoginService: LoginService, private service: MonthlyLeaveService, private modalService: NgbModal) {
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
        this.priviledged_Offices = this.userPrivilegedOffice;
        this.alerts.push(
            {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is being used...',
            });
    }

    ngOnInit() {
        this.getGrid("");
        this.logedInUserID = this.service.getSession('user_ID');
        this.permissionUtility.setPagePermissions(20045);
    }
    //getGrid
    getGrid(value: any) {
        this.isLoading = true;
        this.service.getGrid(value, this.userPrivilegedOffice)
            .subscribe(response => {
                if(response.json() !== null){
                    this.isLoading = false;
                    this.gridlist = (response.json());
                    //console.log(response.json())
                }
                else{
                    this.isLoading = false;
                    this.gridlist = [];
                }
                
            });

    }
    //getFills
    getFills() {
        this.getOffice();
        this.getMonth(this.officecode, this.monthcode);
    }
    //getOffice
    getOffice() {
        this.isLoading = true;
        this.service.getOffice(this.userPrivilegedOffice)
            .subscribe(response => {
                this.isLoading = false;
                this.office = response.json();
                this.officecode = this.office[0].officecode;
                this.getEmployees(this.officecode);

            });
    }
    //getEmployees
    getEmployees(officecode) {
        this.isLoading = true;
        this.service.getEmployees(officecode)
            .subscribe(response => {
                var List = response.json();
                this.isLoading = false;
                //Adding Row With Key = 0 N Sorting The Employee List
                {
                    let emptyRow = {} as EmployeeData;
                    emptyRow.empcode = 0;
                    emptyRow.empname = 'Select...';
                    List.push(emptyRow);
                    this.sortMe = List;

                    List = this.sortMe.sort(function (a, b) {
                        if (a.empcode < b.empcode)
                            return -1;
                        if (a.empcode > b.empcode)
                            return 1;
                        return 0;
                    });
                }

                this.emplist = this.getDropdownList(List, "empcode", "empname");
                this.empcode = this.emplist[0].id;
                this.empname = this.emplist[0].text;
                this.emplistR = response.json();

            });
    }
    //getEmployeesChange
    getEmployeesChange(e: any) {
        if (this.btnmode != false) {
            this.leaves = [];
            this.empcode = e;
            this.getMonth(this.officecode, e.value);
        }
    }
    //getMonth
    getMonth(officecode, empcode) {
        console.log(officecode, empcode);
        this.isLoading = true;
        this.service.getMonth(officecode, empcode)
            .subscribe(response => {
                this.isLoading = false;
                this.month = response.json();
                this.monthcode = this.month[0].monthcode;
                this.monthname = this.month[0].month_Name;

                this.datemode = this.month[0].mode;
                if (this.datemode == 'A') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate = new cDate();
                    this.resigndate = new cDate();
                    //  alert('A');
                }
                else if (this.datemode == 'B') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate = new cDate();
                    this.resigndate = new cDate();
                    //  alert('B');
                }
                else if (this.datemode == 'C') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate = new cDate();
                    this.resigndate = new cDate();
                    //  alert('C');
                }
                else if (this.datemode == 'AR') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate = new cDate();
                    this.resigndate.setDate(this.month[0].mLastDate);
                    //swal('Employee Resign Date is ' + this.resigndate.getDate())
                }
                else if (this.datemode == 'R') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate = new cDate();
                    this.resigndate.setDate(this.month[0].mLastDate);
                    //swal('Employee Resign Date is ' + this.resigndate.getDate())
                }
                else if (this.datemode == 'J') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate.setDate(this.month[0].mFirstDate);
                    this.resigndate = new cDate();
                }
                else if (this.datemode == 'AJ') {
                    this.leavefromdate.setDate(this.month[0].mFirstDate);
                    this.leavetodate.setDate(this.month[0].mLastDate);
                    this.joiningdate.setDate(this.month[0].mFirstDate);
                    this.resigndate = new cDate();
                    //swal('Employee Joining Date is ' + this.joiningdate.getDate())
                }
            });

    }
    //calculateLeave
    calculateLeave() {
        var leavetodate = $("#LTdt").val();
        if (leavetodate == '' || leavetodate.toString().length < 10) {
            swal("Leave To Date Is Empty Or Invalid");
            return;
        }
        this.isLoading = true;
        this.service.calculateLeave(this.officecode, this.empcode, this.leavefromdate.getDate(), this.leavetodate.getDate(), this.monthcode)
            .subscribe(response => {
                this.isLoading = false;
                this.leaves = response.json();
                console.log(response.json());
                if (this.leaves == null) {
                    swal('No Record');
                }

            });
    }
    //clearFields
    clearFields() {
        this.mode = false;
        this.btnmode = true;
        this.guid = UUID.UUID();
        $("#alertWarning").hide();
        $("#submitAdd").prop("disabled", false);
        this.empcode = '';
        this.empmodel = 1;


        this.leavefromdate = new cDate();
        this.leavetodate = new cDate();
        this.emplist = [];
        this.emplistR = [];
        this.salary = [];
        this.officecode = 0;
        this.monthcode = 0;
        this.monthname = '';
        this.leaves = [];
        this.getFills();
    }
    //IfExists
    IfExists(bookcode) {
        this.service.IfExists(bookcode)
            .subscribe(response => {
                this.status = (response.json());
                if (this.status == true) {
                    $("#alertWarning").show();
                    $("#submitUpdate").prop("disabled", true);
                }
                else {
                    $("#alertWarning").hide();
                    $("#submitUpdate").prop("disabled", false);
                }
            });
    }
    //saveData
    saveData() {
        var leavetodate = $("#LTdt").val();
        if (leavetodate == '' || leavetodate.toString().length < 10) {
            swal("Leave To Date Is Empty Or Invalid");
            return;
        }
        this.isLoading = true;
        var listsave = [];
        var list = this.leaves;
        for (let i = 0; i < list.length; i++) {
            if (list[i].status != 0) {
                listsave.push(new MonthlyLeave(0, list[i].salaryMonthID, list[i].officE_CODE, list[i].emP_ID, list[i].from_Date, list[i].to_Date, list[i].paidLeaves, list[i].unpaidLeaves, list[i].total, list[i].salaryDays, list[i].daysInMonth, list[i].status))
            } else
                swal("No Records!")
            this.isLoading = false;
        }
        console.log(listsave);
        if (listsave.length > 0) {

            this.service.saveData(listsave).then(
                (response) => {
                    this.isLoading = false;
                    this.getGrid("");
                    this.modalReference.close();
                    //swal("Academic Qualification  Updated!")
                },
                (error) => console.log(error))
        }
        else {
            this.isLoading = false;
            swal('No Records!')
        }
    }
    //updateData
    updateData() {
        var leavetodate = $("#LTdt").val();
        if (leavetodate == '' || leavetodate.toString().length < 10) {
            swal("Leave To Date Is Empty Or Invalid");
            return;
        }
        this.isLoading = true;
        var listcancel = [];
        var list = this.leaves;
        for (let i = 0; i < list.length; i++) {
            if (list[i].status != 0) {
                listcancel.push(new MonthlyLeave(list[i].monthlyLeaveID, list[i].salaryMonthID, list[i].officE_CODE, list[i].emP_ID, this.leavefromdate.getDateFinal(), this.leavetodate.getDateFinal(), list[i].paidLeaves, list[i].unpaidLeaves, list[i].total, list[i].salaryDays, list[i].daysInMonth, list[i].status))
            }
        }

        this.service.updateData(listcancel).then(
            (response) => {
                this.isLoading = false;
                this.getGrid("");
                this.modalReference.close();
                //swal("Academic Qualification  Updated!")
            },
            (error) => console.log(error))

    }
    //getDetailsByID
    getDetailsByID(monthleavecode, content) {
        //alert(monthleavecode);
        this.mode = true;
        this.btnmode = false;
        this.isLoading = true;
        this.service.getDetailsByID(monthleavecode)
            .subscribe(response => {
                this.isLoading = false;
                var Listbyid = response.json();

                //this.monthname = Listbyid[0].monthname
                this.service.getOffice(this.userPrivilegedOffice)
                    .subscribe(response => {

                        this.office = response.json();
                        this.officecode = Listbyid[0].officE_CODE;
                        this.isLoading = true;
                        this.service.getEmployees(this.officecode)
                            .subscribe(response => {
                                this.isLoading = false;
                                var List = response.json();
                                this.emplist = this.getDropdownList(List, "empcode", "empname");
                                this.empcode = Listbyid[0].emP_ID;
                                this.empmodel = Listbyid[0].emP_ID;


                            });

                        this.monthcode = Listbyid[0].salaryMonthID;
                        this.monthname = Listbyid[0].monthname;
                        this.leavefromdate.setDate(Listbyid[0].fromdate);
                        this.leavetodate.setDate(Listbyid[0].todate);
                        this.leaves = Listbyid;
                    });
                console.log(Listbyid);
            });

        this.openDetail(content);


    }
    //openAddModel
    open(content) {
        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        // console.log(ngbModalOptions);
        this.modalReference = this.modalService.open(content, { size: 'xlg' });
        // this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.clearFields();

    }
    //openDetail modal
    openDetail(content) {
        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        // console.log(ngbModalOptions);
        this.modalReference = this.modalService.open(content, { size: 'xlg' });
        // this.modalReference = this.modalService.open(content);
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        $("#alertWarning").hide();
        $("#submitAdd").prop("disabled", false);
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
    // convert dropdown lables
    getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
        let ar: Array<any> = [];
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
    //checkDateRange
    checkDateRange() {
        if (this.datemode == 'AR' || this.datemode == 'R') {
            if (this.leavetodate.getDate() > this.resigndate.getDate()) {
                swal('Enter "To Date" Less Than Equal To Employee Resignation Date ' + this.resigndate.getDate())
                this.leavetodate.setDate(this.resigndate.getDateFinal());
            }
        }
        else {
            var tempdays = this.days;
            var date1 = new Date(this.leavefromdate.getDateFinal());
            var date2 = new Date(this.leavetodate.getDateFinal());

            var diffc = date1.getTime() - date2.getTime();
            var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24))) + 1;

            var sundaycounter = this.calculateSundays(date1, date2);
            if (sundaycounter < 0) {
                this.days = days + sundaycounter;
            }
            else {
                this.days = days - sundaycounter;
            }

            if (date1 > date2) {
                $("#submitAdd").prop("disabled", true);
                swal('From Date Must Be Less Than To Date')
            }
            else {
                $("#submitAdd").prop("disabled", false);
            }
            // swal('OK')

        }
    }
    //calculateSundays
    calculateSundays(fromDate, toDate) {
        var count = 0;
        if (fromDate.getDate() == toDate.getDate()) {
            if (fromDate.getDay() === 0) {
                ++count;
            }
        }
        else {
            if (fromDate.getDay() === 0) {
                --count;
            }
            while (fromDate < toDate) {
                fromDate.setDate(fromDate.getDate() + 1);
                if (fromDate.getDay() === 0) {
                    ++count;
                }
            }
            console.log('final', count);
        }
        return count;
    }

}
interface EmployeeData {
    empcode: number;
    empname: string;
}

