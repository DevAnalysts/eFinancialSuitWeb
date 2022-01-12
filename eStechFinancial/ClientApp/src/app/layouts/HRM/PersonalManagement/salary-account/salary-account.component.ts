import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalaryAccountService, LoginService,SalaryAccount, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'salary-account',
  templateUrl: './salary-account.component.html',
  styleUrls: ['./salary-account.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SalaryAccountComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
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

  submitAdd:any;
  submitUpdate:any;

  gridlist: any[] = [];
  salary: any[] = [];
  salarycode: any = 0;


  emplist: Array<Select2OptionData>;
  emplistR: any[] = [];
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  departmentname: any = '';
  designationname: any = '';
  officename: any = '';
  paymentmode: any = 1;
  bank: any[] = [];
  bankcode: any = 1;
  bankname: any = '';

  branch: any[] = [];
  branchcode: any = 1;
  branchname: any = '';
  accountno: any = '';
  startingpkg: any = 0;
  currentpkg: any = 0;

  remarks = '';

  public terminatedate = new cDate();
  public leavingdate = new cDate();
  editmode: any = 0;
  addbutton: any = '';
  addnewrow: any = 'none';
  hideRow: any = '';

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor( private LoginService: LoginService,private service: SalaryAccountService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(30006);

    }
      
  
  //getGrid
  getGrid(value:any) {
    this.isLoading =true;
    this.service.getGrid(value,this.priviledged_Offices)
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
    this.getBank();
  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;

        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = this.emplist[0].id;
        this.empname = this.emplist[0].text;
        this.emplistR = response.json();
        this.designationname = this.emplistR[0].designationname;
        this.departmentname = this.emplistR[0].departmentname;
        this.officename = this.emplistR[0].officename;
        this.startingpkg = this.emplistR[0].startingpkg;
        this.currentpkg = this.emplistR[0].currentpkg;
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
        this.startingpkg = this.emplistR[i].startingpkg;
        this.currentpkg = this.emplistR[i].currentpkg;

      }

  }
  //getBank
  getBank() {
    this.isLoading =true;
    this.service.getBank()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.bank = response.json();
          this.bankcode = this.bank[0].bankcode;
          this.bankname = this.bank[0].bankname;
          this.getBankBranch(this.bankcode);
        }
      });
  }
  //getBankBranch
  getBankBranch(bankcode) {
    this.isLoading =true;
    this.service.getBankBranch(bankcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.branch = (response.json());
          this.branchcode = this.branch[0].branchcode;
          this.branchname = this.branch[0].branchname;
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
    //this.empmodel = 1;

    this.designationname = '';
    this.departmentname = '';
    this.officename = '';
    this.startingpkg = '';
    this.currentpkg = '';

    this.terminatedate = new cDate();
    this.leavingdate = new cDate();
    this.emplist = [];
    this.emplistR = [];
    this.salary = [];
    this.paymentmode = 1;
    this.bankcode = 1;
    this.branchcode = 1;
    this.accountno = '';
    this.startingpkg = 0;
    this.currentpkg = 0;
    this.remarks = '';
    this.hideRow = '';
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
  //checkPaymentMode
  checkPaymentMode() {
    if (this.paymentmode == 2) {
      this.hideRow = 'none';
    }
    else {
      this.getBank();
      this.hideRow = '';
    }
  }
  //saveData
  saveData() {
    this.isLoading =true; 
    if(this.empcode!=0){
    if (this.paymentmode == 1) {
      if(this.accountno==''){ 
      swal("Account No. must Be Defined");
      return;}
      var empren = new SalaryAccount(this.empcode, this.paymentmode, this.bankcode, this.branchcode, this.accountno, this.remarks, this.logedInUserID, this.UserSessionID);
    }
    else {
      var empren = new SalaryAccount(this.empcode, this.paymentmode, 0, 0, '', this.remarks, this.logedInUserID, this.UserSessionID);
    }
    //console.log(empren);
    this.service.saveData(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //swal("Record Added!");
      },
      (error) => console.log(error))
    }else
    swal("Please Select Employee");
    this.isLoading=false;
  }
  //updateData
  updateData(reason) {
    console.log();
    this.isLoading =true;
    if (this.paymentmode == 1) {
      if(this.accountno==''){ 
      swal("Account No. must Be Defined");
      return;}
       var empren = new SalaryAccount(this.empcode, this.paymentmode, this.bankcode, this.branchcode, this.accountno, this.remarks, this.logedInUserID, this.UserSessionID);
   }
   else {
       var empren = new SalaryAccount(this.empcode, this.paymentmode, 0, 0, '', this.remarks, this.logedInUserID, this.UserSessionID);
  }
    this.service.updateData(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //swal("Record Updated!");
      },
      (error) => console.log(error))
     
  }
  //getDetailsByID
  getDetailsByID(empselected, content) {
    //alert(empselected);
    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.emplistR = (response.json());

        for (let i = 0; i < this.emplistR.length; i++)
          if (this.emplistR[i].empcode == this.empcode) {
            this.designationname = this.emplistR[i].designationname;
            this.departmentname = this.emplistR[i].departmentname;
            this.officename = this.emplistR[i].officename;
          }
if(this.permissionUtility.PermissionView==''){
  this.submitAdd='none';
  this.submitUpdate='none';
}
        this.isLoading =true;
        this.service.getDetailsByID(empselected)
          .subscribe(response => {
            this.isLoading = false;
            var Listbyid = response.json();
            this.paymentmode = Listbyid[0].paymentmode;
            if (this.paymentmode == 2) {
              this.hideRow = 'none';
            }
            else {
              this.hideRow = '';
            }
            this.accountno = Listbyid[0].accountno;
            this.currentpkg = Listbyid[0].currentpkg;
            this.startingpkg = Listbyid[0].startingpkg;
            this.remarks = Listbyid[0].remarks;

            this.branchcode = Listbyid[0].branchcode;
            this.isLoading =true;
            this.service.getBank()
              .subscribe(response => {
                this.isLoading = false;
                this.bank = response.json();
                this.bankcode = Listbyid[0].bankcode;

                this.isLoading =true;
                this.service.getBankBranch(this.bankcode)
                  .subscribe(response => {
                    this.isLoading = false;
                    this.branch = (response.json());
                    this.branchcode = Listbyid[0].branchcode;
                  });

              });

          });

        this.openDetail(content);
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


}
