import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbDateParserFormatter, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalaryPackage, LoginService, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import swal from 'sweetalert';
import { overtime } from '../../../../shared/models/PRM/PackageManagement/Overtime';
import { OvertimeService } from '../../../../shared/services/PRM/PackageManagement/overtime.service';
import { overtimeDetails } from '../../../../shared/models/PRM/PackageManagement/overtimeDetails';

@Component({
  selector: 'overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class OvertimeComponent implements OnInit {
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  month: any[] = [];
  monthcode: any = 0;
  monthname: any = '';
  mFirstdate: any;
  mLastdate: any;
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
  empdropdown: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';

  emplist: any[] = [];
  emplistR: any[] = [];
  designationname: any = '';
  departmentname: any = '';
  officename: any = '';
  emptypename: any = '';
  joining: any = '';
  currenteffect: any = '';
  currentpkg: any = 0;
  public effectivefromdate = new cDate();
  allowancesList: any[] = [];
  packageallowanceList: any[] = [];
  allowance: any[] = [];
  contribution: any[] = [];
  deduction: any[] = [];

  grosssalary: any = 0;
  packageamount: any = 0;
  allowancetotal: any = 0;
  contributiontotal: any = 0;
  deductiontotal: any = 0;
  remarks: any = '';

  package: any[] = [];
  packagecode: any = 0;
  packageallowancecode: any = 0;

  addbutton: any = '';
  addnewrow: any = 'none';
  startDate = new cDate();
  endDate = new cDate();
  public dayEndDate = new cDate();
  finalDate: any = '';
  overtimeDate1: any = '';
  public overtimeDate = new cDate();
  overTime = [];
  overtimeDetails = [];
  attendanceTitle = [];
  selectedAll: any;
  overtimeId: any = 0;
  week: any[] = ["Sunday", "Monday", "Tuesday", "Wedesday", "Thursday", "Friday", "Saturday"];
  ////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;

  constructor(private LoginService: LoginService, private service: OvertimeService, private modalService: NgbModal) {
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
    this.getGrid();
    this.getCurrentDay();
    this.logedInUserID = this.service.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 20049) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;
          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].usersessionid;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getCurrentDay
  getCurrentDay() {
    this.overtimeDate.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
  }
  //getFills
  getFills() {
    this.getEmployees();
  }
  changeDate() {
    this.overtimeDate.getDateFinal();
    this.service.getEmployeeAttendance(this.overtimeDate.getDateFinal(), this.empcode)
      .subscribe(response => {
        this.overtimeDetails = (response.json());
        console.log(response.json());
      });
  }
  //getMonth
  getMonth(officecode, empcode) {
    this.isLoading = true;
    this.service.getMonth(officecode, empcode)
      .subscribe(response => {
        this.month = response.json();
        if (this.month != null) {
          this.isLoading = false;
          this.monthcode = this.month[0].salaryMonthID;
          this.monthname = this.month[0].month_Name;
          this.startDate.setDate(this.month[0].mFromDate);


          this.overtimeDetails = [];
          let initialTime = new Date(this.month[0].mFirstDate)
            , endTime = new Date(this.month[0].mLastDate)
            , dayMillisec = 24 * 60 * 60 * 1000;
          for (let q = initialTime; q <= endTime; q = new Date(q.getTime() + dayMillisec)) {
            this.convert(q);
          }
          this.service.getOvertimeDetail(empcode, this.finalDate)
            .subscribe(response => {
              if (response.json() != null) {
                this.overtimeDetails = response.json();
              }
            });
        }
        else
          this.isLoading = false;
      });
  }
  //convert
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2),
      days = (date.getDay()),
      dates = this.week[days] + ',' + [day, mnth, date.getFullYear()].join("/");

    let row = {} as overtimeDetails;
    row.overtimeId = 0;
    row.overtimeDate = [day, mnth, date.getFullYear()].join("/");
    // row.displayOvertimeDate = this.week[days] + ', ' + [day, mnth, date.getFullYear()].join("/");
    this.overtimeDate1 = [day, mnth, date.getFullYear()].join("/");
    this.finalDate = [date.getFullYear(), mnth, day].join("-");;
    row.hours = 0;
    row.special = 0;
    row.holiday = 0;
    row.present = 0;
    this.overtimeDetails.push(row);
    //this.overTime.push(this.week[days] + ',' + [day, mnth, date.getFullYear()].join("/"), 0, 0, 0);
    //this.overTime = new Array<overTiemDetail>();
  }
  //changeRate
  changeRate(i: overtimeDetails, hours, special, holiday) {
    if (hours <= 0)
      i.hours = 0;
    if (special <= 0)
      i.special = 0;
    if (holiday <= 0)
      i.holiday = 0;

    var totalHours = (i.hours + i.special + i.holiday);
    console.log(totalHours);
    if (totalHours > 24) {
      $("#submitAdd").prop("disabled", true);
      swal("Total Hours must be less then or equal to 24 hours");
    }
    else
      $("#submitAdd").prop("disabled", false);

  }
  //getGrid
  getGrid() {
    this.isLoading = true;
    this.service.getGrid(this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.gridlist = (response.json());
          //console.log(response.json());
        }
        else{
          this.isLoading = false;
          this.gridlist = [];
        }
        
      });
  }
  //getEmployees
  getEmployees() {
    this.isLoading = true;
    this.service.getEmployees(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.emplistR = (response.json());
      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
    for (let i = 0; i < this.emplistR.length; i++)
      if (this.emplistR[i].empcode == this.empcode) {
        this.designationname = this.emplistR[i].designationname;
        this.departmentname = this.emplistR[i].departmentname;
        this.officename = this.emplistR[i].officename;
        this.emptypename = this.emplistR[i].emptypename;
        this.joining = this.emplistR[i].joining;
      }
    console.log(1);
    if (!this.mode) {
      console.log(2);
      this.overtimeDate.getDateFinal();
      this.service.getEmployeeAttendance(this.overtimeDate.getDateFinal(), this.empcode)
        .subscribe(response => {
          this.overtimeDetails = (response.json());
          console.log(response.json());
        });
    }
  }
  //getDetailsByID
  getDetailsByID(overtimeId, overtimeDate, content) {
    this.mode = true;
    this.btnmode = false;
    this.isLoading = true;
    this.overtimeId = overtimeId;
    this.overtimeDate.setDate(overtimeDate);
    this.getEmployees();
    this.openDetail(content);

    for (let i = 0; i < this.emplistR.length; i++)
      if (this.emplistR[i].empcode == this.empcode) {
        this.designationname = this.emplistR[i].designationname;
        this.departmentname = this.emplistR[i].departmentname;
        this.officename = this.emplistR[i].officename;
        this.emptypename = this.emplistR[i].emptypename;
        this.joining = this.emplistR[i].joining;
      }


    this.service.getOvertimeDetailsByID(overtimeId, this.mode)
      .subscribe((o: overtime) => {
        var details = o;
        console.log(o.overtimeDetails);
        this.overtimeDetails = o.overtimeDetails;
        this.isLoading = false
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
    //this.empmodel = 0;
    this.emplist = [];
    this.emplistR = [];

    this.designationname = '';
    this.departmentname = '';
    this.officename = '';
    this.emptypename = '';
    this.joining = '';
    this.currentpkg = '';

    this.currenteffect = '';
    this.currentpkg = '';
    this.effectivefromdate = new cDate();
    this.grosssalary = 0;
    this.packageamount = 0;

    this.allowance = [];
    this.contribution = [];
    this.deduction = [];
    this.packageallowanceList = [];
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
    this.isLoading = true;
    var ov = new overtime(0, this.empcode, 1, this.overtimeDate, 0, 0, 0, 0, 0, 1, this.overtimeDetails);
    console.log(ov);
    this.service.saveData(ov).then(
      (response) => {
        this.isLoading = false;
        this.overTime = [];
        this.getGrid();
        this.modalReference.close();
      },
      (error) => console.log(error))
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

}

