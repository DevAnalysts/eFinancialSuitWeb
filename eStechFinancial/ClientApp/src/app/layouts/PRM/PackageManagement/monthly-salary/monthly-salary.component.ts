import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MonthlySalaryService, LoginService, MonthlySalary, SalaryDetail, cDate, NgbDateFRParserFormatter, Employee, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'monthly-salary',
  templateUrl: './monthly-salary.component.html',
  styleUrls: ['./monthly-salary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
@media screen {
        .modal-sm {
           max-width: 500px !important;
            height: 250px !important;

       }
}
     

        `],

  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class MonthlySalaryComponent implements OnInit {

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility: PermissionUtility = new PermissionUtility();

  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  modalReference: NgbModalRef;
  isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;
  id: any;

  gridlist: any[] = [];
  salary: any[] = [];
  salarycode: any = 0;
  public salarydate = new cDate();

  emplist: Array<Select2OptionData>;
  sortMe: any[] = [];
  emplistR: any[] = [];
  empmodel: any = 0;
  empcode: any = 0;
  empname: any = '';

  office: any[] = [];
  officecode: any = 1;
  officename: any = '';

  month: any[] = [];
  monthcode: any = 0;
  monthname: any = '';
  mFirstdate: any;
  mLastdate: any;
  arearlabel: any = '';


  uemplist: any[] = [];
  uempcode: any = 0;
  uempname: any = '';
  udesignation: any = '';
  udepartment: any = '';
  uofficecode: any = 0;
  uofficename: any = '';
  uemploymenttype: any = '';
  ujoiningdate: any = '';
  upackage: any = '';

  usalarymonthid: any = 0;
  usalaryid: any = 0;
  uallowance: any[] = [];
  ucontribution: any[] = [];
  udeduction: any[] = [];
  uarear: any[] = [];
  uarearcode: any = 0;
  uarearname: any = 0;
  uareartype: any = '';
  uarearamount: any = 1;
  uarearsave: any = '';
  uallowancetotal: any = 0;
  ucontributiontotal: any = 0;
  udeductiontotal: any = 0;
  uarearallowanceList: any[] = [];
  ////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;

  constructor(private LoginService: LoginService, private service: MonthlySalaryService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(30020);
  }

  //getGrid
  getGrid(value: any) {
    this.isLoading = true;
    this.service.getGrid(value, this.userPrivilegedOffice)
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
    this.getOffice();
    // this.getMonth(this.officecode, this.monthcode);
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
        this.isLoading = false;
        var List = response.json();
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
        this.isLoading = false;
      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    if (this.btnmode != false) {
      this.salary = [];
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
        this.month = response.json();
        if (this.month != null) {
          this.isLoading = false;
          this.monthcode = this.month[0].salaryMonthID;
          this.monthname = this.month[0].month_Name;
          this.mFirstdate = this.month[0].mFirstDate;
          this.mLastdate = this.month[0].mLastDate;
        }
        else
          this.isLoading = false;

      });

  }
  //calculateSalary
  calculateSalary() {
    this.isLoading = true;
    this.service.calculateSalary(this.officecode, this.empcode, this.monthcode, this.mFirstdate, this.mLastdate, this.salarydate.getDateFinal(), this.logedInUserID)
      .subscribe(response => {
        this.isLoading = false;
        this.salary = response.json();
        if (this.salary == null) {
          swal('No Record');
        }
        console.log(this.salary);
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


    this.salarydate = new cDate();
    this.emplist = [];
    this.emplistR = [];
    this.salary = [];
    this.officecode = 0;
    this.monthcode = 0;
    this.monthname = '';
    this.salary = [];

    this.uempcode = 0;
    this.uempname = '';
    this.udesignation = '';
    this.udepartment = '';
    this.uofficecode = 0;
    this.uofficename = '';
    this.uemploymenttype = '';
    this.ujoiningdate = '';
    this.upackage = '';
    this.usalarymonthid = 0;
    this.usalaryid = 0;
    this.uallowance = [];
    this.ucontribution = [];
    this.udeduction = [];
    this.uarear = [];
    this.uarearcode = 0;
    this.uarearname = 0;
    this.uareartype = '';
    this.uarearamount = 1;
    this.uarearsave = '';
    this.uallowancetotal = 0;
    this.ucontributiontotal = 0;
    this.udeductiontotal = 0;
    this.uarearallowanceList = [];
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
    var listsave = [];
    var list = this.salary;
    if (list == null) {
      swal("No Record!.");
      this.isLoading = false;
      return;
    }
    for (let i = 0; i < list.length; i++) {
      if (list[i].status != 0) {
        listsave.push(new MonthlySalary(list[i].salaryid, this.logedInUserID, this.UserSessionID, []))
        //, list[i].salaryMonthID, list[i].officE_CODE, list[i].emP_ID, list[i].from_Date, list[i].to_Date, list[i].paidLeaves, list[i].unpaidLeaves, list[i].total, list[i].salaryDays, list[i].daysInMonth, list[i].status))
      } else
        swal("No Record");
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
    this.isLoading = true;
    console.log(this.uarearallowanceList);
    var data = new MonthlySalary(this.usalaryid, this.logedInUserID, this.UserSessionID, this.uarearallowanceList);
    this.service.updateData(data).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //swal("Academic Qualification  Updated!")
      },
      (error) => console.log(error))

  }
  //cancelSalary
  cancelSalary() {
    this.isLoading = true;
    this.service.cancelSalary(this.usalaryid)
      .subscribe(response => {
        this.isLoading = false;
        var list = response.json();        
        this.modalReference.close();
        this.getGrid("");
        console.log(list);
      });
  }
  //getDetailsByID
  getDetailsByID(salaryid, contentdetail) {
    this.mode = true;
    this.btnmode = false;
    this.isLoading = true;
    this.uarearallowanceList = [];
    this.service.getDetailsByID(salaryid)
      .subscribe(response => {
        this.isLoading = false;
        var Listbyid = response.json();
        this.uempcode = Listbyid[0].uempcode;
        this.uempname = Listbyid[0].uempname;
        this.udesignation = Listbyid[0].udesignation;
        this.udepartment = Listbyid[0].udepartment;
        this.uofficecode = Listbyid[0].uofficecode;
        this.uofficename = Listbyid[0].uofficename;
        this.uemploymenttype = Listbyid[0].uemploymenttype;
        this.ujoiningdate = Listbyid[0].ujoiningdate;
        this.upackage = Listbyid[0].upackage;
        this.usalaryid = Listbyid[0].usalaryid;
        this.usalarymonthid = Listbyid[0].usalarymonthid;

        this.getSalaryAllowanceByID(salaryid);
        console.log(Listbyid);
      });

    this.openDetail(contentdetail);
  }
  //getDetailsByID
  getSalaryAllowanceByID(SalaryID) {
    this.isLoading = true;
    this.service.getSalaryAllowanceByID(SalaryID, 'A')
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.uallowance = response.json();
          this.calculateAllowanceTotal('A');
        }
      });
    this.service.getSalaryAllowanceByID(SalaryID, 'C')
      .subscribe(response => {
        if (response.json() != null) {
          this.ucontribution = response.json();
          console.log(this.ucontribution);
          this.calculateAllowanceTotal('C');
        }
      });
    this.service.getSalaryAllowanceByID(SalaryID, 'D')
      .subscribe(response => {
        if (response.json() != null) {
          this.udeduction = response.json();         
          this.calculateAllowanceTotal('D');
        }
      });

  }
  //calculateAllowanceTotal
  calculateAllowanceTotal(type) {
    var list = [];
    var sum = 0;
    if (type == 'A') { list = this.uallowance }
    if (type == 'C') { list = this.ucontribution }
    if (type == 'D') { list = this.udeduction }
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        sum = sum + list[i].amount;
      }
    }
    if (type == 'A') { this.uallowancetotal = sum }
    if (type == 'C') { this.ucontributiontotal = sum }
    if (type == 'D') { this.udeductiontotal = sum }
    //console.log(list, type, sum);
  }
  //createPackageAllowanceList() {
  //  this.upackageallowanceList = [];
  //  var list
  //  for (let j = 0; j < 3; j++) {
  //    if (j = 0) { list = this.uallowance }
  //    if (j = 1) { list = this.ucontribution }
  //    if (j = 2) { list = this.udeduction }
  //    if (list != null) {
  //      for (let i = 0; i < list.length; i++) {
  //        //this.upackageallowanceList.push(new SalaryDetail(this.packageallowancecode, this.allowance[i].allowancE_CODE, parseFloat(this.allowance[i].fixeD_AMOUNT)));
  //      }
  //    }
  //  }
  //}
  //getDetailsByID
  //getArears
  getArears(type, modalarear) {
    this.uarear = [];
    this.uarearamount = 1;
    //alert(type)
    if (type == 'A') { this.arearlabel = 'Allowance Arears' }
    if (type == 'C') { this.arearlabel = 'Contribution Arears' }
    if (type == 'D') { this.arearlabel = 'Deduction Arears' }
    this.isLoading = true;
    this.service.getArears(this.uempcode, type)
      .subscribe(response => {
        this.isLoading = false;
        this.uarear = response.json();

        if (this.udeduction.length > 0) {
          var uarearTemp = this.uarear.filter(i => !this.udeduction.map(t => t.allowancE_CODE).includes(i.allowancE_CODE));
          this.uarear = uarearTemp.filter(i => !this.udeduction.map(t => t.allowancE_CODE).includes(i.allowancE_CODE));
        }

        this.uarearcode = this.uarear[0].allowancE_CODE;
        this.uarearname = this.uarear[0].allowancE_NAME;
        this.uareartype = type;
        this.checkArear();
        console.log(this.uarear);
      });

    this.openArear(modalarear);
  }
  //checkArear
  checkArear() {
    var list = [];
    this.uarearsave = '';
    if (this.uareartype == 'A') { list = this.uallowance; }
    if (this.uareartype == 'C') { list = this.ucontribution; }
    if (this.uareartype == 'D') { list = this.udeduction; }

    for (let i = 0; i < list.length; i++) {
      if (list[i].allowancE_CODE == this.uarearcode) {
        this.uarearsave = 'none';       
        swal('Arear Already Added!')
      }
    }
  }
  //addArear
  addArear() {
    this.isLoading = true;
    let emptyRow = {} as AllowanceRow;
    emptyRow.allowancE_CODE = this.uarearcode;
    var list = this.uarear;
    for (let i = 0; i < list.length; i++) {
      if (list[i].allowancE_CODE == this.uarearcode) {
        emptyRow.allowancE_NAME = list[i].allowancE_NAME;
      }
    }

    emptyRow.amount = this.uarearamount;
    emptyRow.type = this.uareartype;

    emptyRow.officE_CODE = this.uofficecode;
    emptyRow.emP_ID = this.uempcode;

    emptyRow.salaryDetID = 0;
    emptyRow.salaryID = this.usalaryid;
    emptyRow.salaryMonthID = this.usalarymonthid;
    emptyRow.isReadonly = 0;

    //console.log(emptyRow);
    if (this.uareartype == 'A') { if (this.uarearamount > 0) { this.uallowance.push(emptyRow); this.calculateAllowanceTotal('A'); } }
    if (this.uareartype == 'C') { if (this.uarearamount > 0) { this.ucontribution.push(emptyRow); this.calculateAllowanceTotal('C'); } }
    if (this.uareartype == 'D') { if (this.uarearamount > 0) { this.udeduction.push(emptyRow); this.calculateAllowanceTotal('D'); } }

    this.uarearallowanceList.push(new SalaryDetail(0, this.usalarymonthid, this.usalaryid, this.uofficecode, this.uempcode, this.uarearcode, this.uareartype, this.uarearamount));
    this.isLoading = false;
    this.modalReference.close();
  }
  //openAddModel
  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();
  }
  //openDetail modal
  openDetail(contentdetail) {
    this.modalReference = this.modalService.open(contentdetail, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.clearFields();
  }
  //openArear
  openArear(content) {
    const centerStyle = 'display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; min-height: calc(100% - (.5rem * 2));';
    this.modalReference = this.modalService.open(content, { size: 'sm', windowClass: 'my-modal' });

    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
}
interface EmployeeData {
  empcode: number;
  empname: string;
}
interface AllowanceRow {
  allowancE_CODE: number;
  allowancE_NAME: string;
  amount: number;
  emP_ID: number;
  isReadonly: number;
  officE_CODE: number;
  salaryDetID: number;
  salaryID: number;
  salaryMonthID: number;
  type: string;
}
