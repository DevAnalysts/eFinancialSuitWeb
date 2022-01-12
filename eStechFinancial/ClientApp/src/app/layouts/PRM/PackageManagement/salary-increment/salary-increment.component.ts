import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalaryIncrementService,  LoginService,SalaryReview, cDate, NgbDateFRParserFormatter, Employee } from '../../../../shared';
import swal from 'sweetalert';
import { TextMaskModule } from 'angular2-text-mask';
@Component({
  selector: 'salary-increment',
  templateUrl: './salary-increment.component.html',
  styleUrls: ['./salary-increment.component.scss'],
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
export class SalaryIncrementComponent implements OnInit {     
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
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
  public effectivefromdate = new cDate();

  gridlist: any[] = [];
  salary: any[] = [];
  salarycode: any = 0;
  public salarydate = new cDate();

  incrementrate: any = 0;

  emplist: Array<Select2OptionData>;
  sortMe: any[] = [];
  emplistR: any[] = [];
  empmodel: any = 0;
  empcode: any = 0;
  empname: any = '';

  office: any[] = [];
  officecode: any = 1;
  officename: any = '';

  category: any[] = [];
  categorycode: any = 1;
  categoryname: any = '';

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
  usalaryhistoryid: any = 0;
  uallowance: any[] = [];
  ucontribution: any[] = [];
  udeduction: any[] = [];
  uallowancetotal: any = 0;
  ucontributiontotal: any = 0;
  udeductiontotal: any = 0;
  uarearallowanceList: any[] = [];
  ucancelbtn: any = '';
  ////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor(private LoginService: LoginService,private service: SalaryIncrementService, private modalService: NgbModal) {
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
    //this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    //console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 30021) {
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
          //console.log(FUNCTIONALITY[i].page_Name)
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        this.gridlist = (response.json());

        // console.log(response.json())

      });
  }
  //getFills
  getFills() {
    //this.getOffice();
    this.getCategory();
    // this.getMonth(this.officecode, this.monthcode);
  }
  //getOffice
  getOffice() {
    this.isLoading =true;
    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        this.office = response.json();
        this.officecode = this.office[0].officecode;
        this.getEmployees(this.officecode);
       
      });
  }
  //getCategory
  getCategory() {
    this.isLoading =true;
    this.service.getCategory()
      .subscribe(response => {
        this.isLoading = false;
        this.category = response.json();
        this.categorycode = this.category[0].categorycode;
        //this.getEmployees(this.officecode);

      });
  }
  //getEmployees
  getEmployees(officecode) {
    this.isLoading =true;
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
    this.isLoading =true;
    this.service.getMonth(officecode, empcode)
      .subscribe(response => {
        this.isLoading = false;
        this.month = response.json();
        console.log(this.month);
        this.monthcode = this.month[0].salaryMonthID;
        this.monthname = this.month[0].month_Name;
        this.mFirstdate = this.month[0].mFirstDate;
        this.mLastdate = this.month[0].mLastDate;


      });

  }
  //reviewSalary
  reviewSalary() {    
    this.isLoading =true;
    this.service.getGrossIncrement(this.categorycode, this.incrementrate)
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
    this.usalaryhistoryid = 0;
    this.uallowance = [];
    this.ucontribution = [];
    this.udeduction = [];

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
    //this.isLoading =true;
    //var listsave = [];
    //var list = this.salary;
    //for (let i = 0; i < list.length; i++) {
    //  if (list[i].status != 0) {
    //    listsave.push(new SalaryReview(list[i].salaryid, this.logedInUserID))
    //  }
    //}
    //console.log(listsave);
    //this.service.saveData(listsave).then(
    //  (response) => {
    //    this.isLoading = false;
    //    this.getGrid();
    //    this.modalReference.close();
    //    //swal("!")
    //  },
    //  (error) => console.log(error))

  }
  //getDetailsByID
  getDetailsByID(salaryhistorycode, contentdetail) {

    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.uarearallowanceList = [];
    this.service.getDetailsByID(salaryhistorycode)
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
        this.usalaryhistoryid = Listbyid[0].usalaryhistoryid;
        this.usalarymonthid = Listbyid[0].usalarymonthid;
        this.checkVoucherExist(this.usalaryhistoryid);
        this.getSalaryAllowanceByID(salaryhistorycode);
        console.log(Listbyid);
      });

    this.openDetail(contentdetail);

  }
  //checkVoucherExist
  checkVoucherExist(salaryhistoryid) {
    this.ucancelbtn = '';
    this.service.checkVoucherExist(salaryhistoryid)
      .subscribe(response => {
        var list = response.json();
        if (list != null) {
          this.ucancelbtn = 'none';
          swal('Voucher Created')
        }
        else {
         
        }
      });
  }
  //cancelSalary
  cancelSalary() {
    this.isLoading =true;
    this.service.cancelSalary(this.usalaryhistoryid)
      .subscribe(response => {
        this.isLoading = false;
        var list = response.json();
        this.getGrid();
        this.modalReference.close();
        console.log(list);
      });


  }
  //getDetailsByID
  getSalaryAllowanceByID(salaryhistorycode) {
    this.isLoading =true;
    this.service.getSalaryAllowanceByID(salaryhistorycode, 'A')
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.uallowance = response.json();
          console.log(this.uallowance , 'A');
          this.calculateAllowanceTotal('A');
        }
      });
    this.service.getSalaryAllowanceByID(salaryhistorycode, 'C')
      .subscribe(response => {
        if (response.json() != null) {
          this.ucontribution = response.json();
          console.log(this.ucontribution, 'C');
          this.calculateAllowanceTotal('C');
        }
      });
    this.service.getSalaryAllowanceByID(salaryhistorycode, 'D')
      .subscribe(response => {
        if (response.json() != null) {
          this.udeduction = response.json();
          console.log(this.udeduction, 'D');
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
  openDetail(contentdetail) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(contentdetail, { size: 'xlg' });
   // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.clearFields();
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
