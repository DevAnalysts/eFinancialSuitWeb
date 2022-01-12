import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LeaveEntryService, LoginService, Leaves, cDate, NgbDateFRParserFormatter, MonthlyLeaveService, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'leave-entry',
  templateUrl: './leave-entry.component.html',
  styleUrls: ['./leave-entry.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class LeaveEntryComponent implements OnInit {

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility: PermissionUtility = new PermissionUtility();
  public valid: Validation = new Validation();
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  id: any;
  submitAdd: any;
  submitUpdate: any;
  submitDelete: any;
  modalReference: NgbModalRef;
  isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;

  gridlist: any[] = [];
  emplist: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 0;
  designationname: any = '';
  office: any[] = [];
  officecode: any = 0
  officename: any = '';
  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = '';
  leavetype: any[] = [];
  leavetypecode: any = 1;
  leavetypename: any = '';
  leave: any[] = [];
  leavebyid: any[] = [];
  leavecode: any = 0;
  leavebalance: any = 0;
  Calculateleavebalance: any = 0;
  halfday: any = 0;
  days: any = 1;
  tempdays: any = 0;
  public fromdate = new cDate();
  public todate = new cDate();
  todateon: any = '';
  todateoff: any = 'none';
  showcancelstatus: any = 'none';
  addbutton: any = '';
  addnewrow: any = 'none';
  month: any[] = [];
  monthcode: any = 0;
  monthname: any = '';
  datemode: any = '';
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  bioAttendanceEnable: any = false;
  bioAttendanceStatus: any = false;
  constructor(private LoginService: LoginService, private service: LeaveEntryService, private serviceLeave: MonthlyLeaveService, private modalService: NgbModal) {
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
  //ngOnInit
  ngOnInit() {
    this.getGrid("");
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(20012);
  }

  //getGrid
  getGrid(value: any) {
    this.isLoading = true;

    this.service.getGrid(value, this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.gridlist = (response.json());
          // console.log(response.json())
        }
        else{
          this.isLoading = false;
          this.gridlist = [];
        }
        
      });


  }
  //getFills
  getFills() {
    this.getEmployees();
  }
  //getEmployees
  getEmployees() {
    this.isLoading = true;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        //  console.log(response.json());
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        //this.empcode = this.emplist[0].id;
        //this.empname = this.emplist[0].text;
        //this.termination = response.json();

      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getOffice(this.empcode);
    this.getCategory(this.empcode);
    this.getLeaveType(this.empcode);
  }
  //getMonth
  getMonth(officecode, empcode) {
    this.isLoading = true;
    this.serviceLeave.getMonth(officecode, empcode)
      .subscribe(response => {
        this.isLoading = false;
        this.month = response.json();
        if (this.month != null) {
          this.monthcode = this.month[0].salaryMonthID;
          this.monthname = this.month[0].month_Name;

          this.datemode = this.month[0].mode;
          if (this.datemode == 'A') {
            this.fromdate.setDate(this.month[0].mFromDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
          else if (this.datemode == 'AR') {
            this.fromdate.setDate(this.month[0].mFromDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
          else if (this.datemode == 'R') {
            this.fromdate.setDate(this.month[0].mFirstDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
          else if (this.datemode == 'J') {
            this.fromdate.setDate(this.month[0].mFirstDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
          else if (this.datemode == 'AJ') {
            this.fromdate.setDate(this.month[0].mFromDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
          else if (this.datemode == 'B') {
            this.fromdate.setDate(this.month[0].mFromDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
          else if (this.datemode == 'C') {
            this.fromdate.setDate(this.month[0].mFirstDate);
            this.todate.setDate(this.month[0].mLastDate);

          }
        }
      });

  }
  //getDesignation
  getDesignation(empcode) {

    this.service.getDesignation(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.designation = (response.json());
          this.designationcode = this.designation[0].designationcode;
          this.designationname = this.designation[0].designationname;
        }
      });
  }
  //getDepartment
  getDepartment(empcode) {
    this.service.getDepartment(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
        }
      });
  }
  //getOffice
  getOffice(empcode) {
    this.service.getOffice(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.office = (response.json());
          this.officecode = this.office[0].officecode;
          this.officename = this.office[0].officename;
          //this.getMonth(this.officecode, empcode)
        }
      });
  }
  //getCategory
  getCategory(empcode) {

    this.service.getCategory(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.category = (response.json());
          this.categorycode = this.category[0].categorycode;
          this.categoryname = this.category[0].categoryname;
        }

      });
  }
  //getLeaveType
  getLeaveType(empcode) {
    this.isLoading = true;
    this.service.getLeaveType(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.leavetype = (response.json());
          //   console.log(response.json());
          this.leavetypecode = this.leavetype[0].leavetypE_CODE;
          this.leavetypename = this.leavetype[0].type_Name;
          this.getLeaveTypeChange(this.leavetypecode);
        }

      });
  }
  //getLeaveTypeChange
  getLeaveTypeChange(leavetypecode: any) {
    var ltcode = leavetypecode;
    //console.log(this.empcode, ltcode);
    this.getOpeningBalance(this.empcode, ltcode);
  }
  //getOpeningBalance
  getOpeningBalance(empcode, leavetypecode) {
    this.isLoading = true;
    //alert(leavetypecode);
    this.leavebalance = '';
    this.service.getOpeningBalance(empcode, leavetypecode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var leavebalancelist = (response.json());
          this.leavebalance = leavebalancelist[0].leavebalance;
        }
        else {
          this.leavebalance = 0;

        }
        if (this.leavetypecode == 9) {
          this.leavebalance = 0;

          $("#submitAdd").prop("disabled", false);
        }
        else {
          if (this.leavebalance != 0) {

            $("#submitAdd").prop("disabled", false);
          }
          else {

            $("#submitAdd").prop("disabled", true);
            swal('Leave Balance Zero.')
          }
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
    this.empcode = 0;

    this.department = [];
    this.designation = [];
    this.category = [];
    this.office = [];
    this.leavetype = [];

    this.emplist = [];
    this.leave = [];
    this.leavebyid = [];
    this.leavetypecode = 1;
    this.leavebalance = '';
    this.Calculateleavebalance = 0;
    this.fromdate = new cDate();
    this.todate = new cDate();
    this.halfday = 0;
    this.todateon = '';
    this.todateoff = 'none';
    this.days = 1;
    this.showcancelstatus = 'none';
    this.getFills();
    if (this.LoginService.getSession('BioAttendanceEnable') != '1')
      this.bioAttendanceEnable = 0;
    else
      this.bioAttendanceEnable = 1;

  }
  //IfExists
  IfExists(empcode, fromdate, todate) {
    this.service.IfExists(empcode, fromdate, todate)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#submitAdd").prop("disabled", true);
        }
        else {
          $("#submitAdd").prop("disabled", false);
        }
      });
  }
  //getBioAttendance
  getBioAttendance(empcode, fromdate, todate) {
    this.service.getBioAttendance(empcode, fromdate, todate)
      .subscribe(response => {
        var status = (response.json());
        if (status == true)
          this.bioAttendanceEnable = true;

        else
          this.bioAttendanceEnable = false;

      });
  }
  //saveEmployeeLeave
  saveEmployeeLeave(leavetypecode, leavebalance, halfday, days) {
    this.isLoading = true;
    if (this.empcode == 0) {
      $("#submitAdd").prop("disabled", true);
      swal("Please select employee!");
      this.isLoading = false;
      return;
    }
    if (this.days == 0 || this.days > 200) {
      $("#submitAdd").prop("disabled", true);
      swal("Days Must Be > 0 But <= 200")
      this.isLoading = false;
      return;
    }
    var fromdate = $("#frmdt").val();
    var todate = $("#todt").val();
    if (fromdate == '' || fromdate.toString().length < 10) {
      swal("From Date Is Empty Or Invalid");
      this.isLoading = false;
      return;
    }
    if (todate == '' || todate.toString().length < 10) {
      swal("To Date Is Empty Or Invalid");
      this.isLoading = false;
      return;
    }

    this.service.IfExists(this.empcode, this.fromdate.getDateFinal(), this.todate.getDateFinal())
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          this.isLoading = false;
          $("#submitAdd").prop("disabled", true);
          swal("Employee Leave already exist!");
        }
        else {
          if (this.bioAttendanceEnable) {
            this.service.getBioAttendance(this.empcode, this.fromdate.getDateFinal(), this.todate.getDateFinal())
              .subscribe(response => {
                var status = (response.json());
                console.log(response.json());
                if (status == true)
                  this.bioAttendanceStatus = true;
                else
                  this.bioAttendanceStatus = false;
               
                if (!this.bioAttendanceStatus) {
                 this.isLoading = false;
                    var empren = new Leaves(0, this.empcode, leavetypecode, leavebalance, this.fromdate.getDateFinal(), this.todate.getDateFinal(), halfday, days, this.logedInUserID, this.UserSessionID);
                    this.service.saveEmployeeLeave(empren).then(
                      (response) => {
                        this.isLoading = false;
                        this.getGrid('');
                        this.modalReference.close();
                      },
                      (error) => console.log(error))
                    $("#submitAdd").prop("disabled", false);
                }
                else {
                  this.isLoading = false;
                  $("#submitAdd").prop("disabled", true);
                   swal("Attendance has been generated!");
                }
              });
          }
        }
      });
  }
  //updateEmployeeLeave
  updateEmployeeLeave(leavetypecode, leavebalance, halfday, days) {
    console.log(this.leavecode, leavetypecode, leavebalance, halfday, days);
    this.isLoading = true;
    if (this.days == 0 || this.days > 200) {
      $("#submitAdd").prop("disabled", true);
      swal("Days Must Be > 0 But <= 200")
      this.isLoading = false;
      return;
    }
    this.submitAdd = '';
    this.permissionUtility.PermissionAdd = '';
    var empren = new Leaves(this.leavecode, this.empcode, leavetypecode, this.Calculateleavebalance, this.fromdate.getDateFinal(), this.todate.getDateFinal(), halfday, days, this.logedInUserID, this.UserSessionID);
    console.log(empren);
    this.service.updateEmployeeLeave(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid('');
        this.modalReference.close();
        //console.log(response);
        //swal("Record Updated!");
      },
      (error) => console.log(error))
  }
  //cancelEmployeeLeave
  cancelEmployeeLeave() {
    this.isLoading = true;
    this.service.cancelEmployeeLeave(this.empcode, this.leavetypecode, this.leavecode, this.logedInUserID)
      .subscribe(response => {
        this.isLoading = false;
        this.modalReference.close();
        this.getGrid(null);
        //swal('Leave Canceled');
      });
  }
  //getDetailsByID
  getDetailsByID(empselected, leavecode, content) {
    this.isLoading = true;
    if (this.permissionUtility.PermissionView == '') {
      this.submitAdd = 'none';
      this.submitUpdate = 'none';
      $("#submitAdd").prop("disabled", true);
    }
    this.leavecode = leavecode;
    this.mode = true;
    this.btnmode = false;
    this.showcancelstatus = 'none';
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.isLoading = true;
        this.service.getDetailsByID(leavecode)
          .subscribe(response => {
            this.isLoading = false;
            if (response.json() != null) {
              this.leavebyid = response.json();

              this.isLoading = true;
              this.service.getLeaveType(empselected)
                .subscribe(response => {
                  this.isLoading = false;
                  this.leavetype = (response.json());
                  this.leavetypecode = this.leavebyid[0].leavetypecode;

                  this.isLoading = true;
                  this.service.getOpeningBalance(this.empcode, this.leavetypecode)
                    .subscribe(response => {
                      this.isLoading = false;
                      if (response.json() != null) {
                        var leavebalancelist = (response.json());
                        this.leavebalance = leavebalancelist[0].leavebalance;
                        this.Calculateleavebalance = this.leavebalance;
                      }
                      var CancelCheck = this.leavebyid[0].leavestatus;
                      if (CancelCheck != 1) {
                        if (this.permissionUtility.PermissionView == '')
                          $('#submitAdd').prop('disabled', true);


                        this.showcancelstatus = '';
                      }

                    });
                });
                  this.getCategory(empselected);
                  this.getDesignation(empselected);
                  this.getDepartment(empselected);
                  this.getOffice(empselected);

                  this.openDetail(content);
              this.fromdate.setDate(this.leavebyid[0].fromdate);
              this.todate.setDate(this.leavebyid[0].todate);
              this.halfday = this.leavebyid[0].halfday;
              this.getHalfDay(this.halfday);
              this.days = this.leavebyid[0].days;
            }
          });
        
      });

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

      if (this.btnmode)
        ar.push({
          id: 0,
          text: ''
        });

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
  //setHalfDay
  setHalfDay(halfday) {
    if (this.btnmode == false) {
      this.service.getOpeningBalance(this.empcode, this.leavetypecode)
        .subscribe(response => {
          var leavebalancelist = (response.json());
          this.Calculateleavebalance = leavebalancelist[0].leavebalance;
          //alert(this.Calculateleavebalance);
          if (this.halfday != 0) {
            this.todateon = 'none';
            this.todateoff = '';
            this.todate = new cDate();
            var tempdays = this.leavebyid[0].days;
            this.days = 0.5;
            var leavebalance = this.Calculateleavebalance + tempdays - this.days;
            this.Calculateleavebalance = leavebalance;
            if (this.Calculateleavebalance >= 0) {

              $("#submitAdd").prop("disabled", false);
            }
            else {
              $("#submitAdd").prop("disabled", true);
              swal('Leave Balance is Negative.')
            }
          }
          else {
            this.todateon = '';
            this.todateoff = 'none';
            this.days = this.leavebyid[0].days;
            this.fromdate.setDate(this.leavebyid[0].fromdate);
            this.todate.setDate(this.leavebyid[0].todate);
          }
        });

    }
    else {
      if (this.halfday != 1) {
        this.todateon = 'none';
        this.todateoff = '';
        this.todate = new cDate();
        this.days = 0.5;
        //alert(this.days)
      }
      else {
        this.todateon = '';
        this.todateoff = 'none';
        this.days = 1;
        //this.calculateDays();
      }

    }
  }
  //getHalfDay
  getHalfDay(halfday) {
    if (this.halfday != 0) {
      this.todateon = 'none';
      this.todateoff = '';
      this.todate = new cDate();
      this.days = 0.5;
    }
    else {
      this.todateon = '';
      this.todateoff = 'none';
      this.days = 1;
    }
  }
  //calculateDays
  calculateDays() {
    $("#submitAdd").prop("disabled", false);
    //console.log(this.fromdate);
    if (this.fromdate.model === null || this.todate.model === null) {
      $("#submitAdd").prop("disabled", true);
      return;
    }

    if (this.btnmode == false) {
      if (this.halfday != 1) {
        var tempdays = this.days;
        var date1 = new Date(this.fromdate.getDateFinal());
        var date2 = new Date(this.todate.getDateFinal());

        if (date1 > date2) {
          $("#submitAdd").prop("disabled", true);
          swal('From Date Must Be Less Than To Date')
        }
        else {
          var diffc = date1.getTime() - date2.getTime();
          var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24))) + 1;
          //   console.log(days);
          var leavebalance = this.Calculateleavebalance + tempdays - days;
          //   console.log(this.Calculateleavebalance, '+', tempdays, '-', days, '=', leavebalance);

          var sundaycounter = this.calculateSundays(date1, date2);
          if (sundaycounter < 0) {
            this.days = days + sundaycounter;
          }
          else {
            this.days = days - sundaycounter;
          }

          this.Calculateleavebalance = leavebalance;
          if (this.Calculateleavebalance < 0) {

            $('#submitAdd').prop('disabled', true);
            swal('Enter Days Within Leave Balance Range')
          }
          else if (this.days == 0 || this.days > 200) {

            $('#submitAdd').prop('disabled', true);
            swal('Days Should Be >0 But <= 200')
          }
          else {

            $('#submitAdd').prop('disabled', false);
          }

        }

      }
      else {

      }
    }
    else {
      if (this.halfday != 1) {
        var date1 = new Date(this.fromdate.getDateFinal());
        var date2 = new Date(this.todate.getDateFinal());
        var diffc = date1.getTime() - date2.getTime();
        var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24))) + 1;
        // console.log(days);
        var sundaycounter = this.calculateSundays(date1, date2);
        if (sundaycounter < 0) {
          this.days = days + sundaycounter;
        }
        else {
          this.days = days - sundaycounter;
        }


        if (date1 > date2) {

          $('#submitAdd').prop('disabled', true);
          swal('From Date Must Be Less Than To Date')
        }
        else if (this.days > this.leavebalance) {

          $('#submitAdd').prop('disabled', true);
          swal('Enter Days Within Leave Balance Range')
        }
        else if (this.days == 0 || this.days > 200) {

          $('#submitAdd').prop('disabled', true);
          swal('Days Should Be >0 But <=200')
        }
        else {
          $('#submitAdd').prop('disabled', false);
        }
      }

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
      //console.log('final', count);
    }
    return count;
  }


}
