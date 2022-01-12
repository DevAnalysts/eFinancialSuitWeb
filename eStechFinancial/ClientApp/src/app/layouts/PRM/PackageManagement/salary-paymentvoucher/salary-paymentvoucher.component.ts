import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalaryPaymentVoucherService,LoginService, SalaryPV, cDate, NgbDateFRParserFormatter, Employee, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';

@Component({
  selector: 'salary-payment-voucher',
  templateUrl: './salary-paymentvoucher.component.html',
  styleUrls: ['./salary-paymentvoucher.component.scss'],
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
export class SalaryPaymentVoucherComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility()
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

  office: any[] = [];
  officecode: any = 1;
  officename: any = '';

  month: any[] = [];
  monthcode: any = 0;
  monthname: any = '';
  mFirstdate: any;
  mLastdate: any;
  arearlabel: any = '';

  remarks: any = '';
  voucherid: any = 0;

  uofficename: any = 0;
  uvoucherid: any = 0;
  uvoucherno: any = 0;
  uvoucherdate: any = 0;
  uremarks: any = '';
  uvoucherlist: any[] = []
  ucancelbtn: any = '';

  paymenttype: any = 1;
  showcashaccount: any = 'none';
  cashaccount: any = [];
  accountcode: any = 0;
  accountname: any = '';
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
constructor(private LoginService: LoginService,private service: SalaryPaymentVoucherService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(40035);
   }
  //getGrid
  getGrid(value:any) {
    this.isLoading =true;
    this.service.getGrid(value,this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){

          this.gridlist = (response.json());
          this.isLoading = false;
          // console.log(response.json())
        }
        else{
          
        this.gridlist = [];
        this.isLoading = false;
        }


      });
  }
  //getFills
  getFills() {
    this.getOffice();
  }
  //getOffice
  getOffice() {
    this.isLoading =true;
    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {

        this.office = response.json();
        this.officecode = this.office[0].officecode;
        this.getMonth(this.officecode, 0);
        this.isLoading = false;
      });
  }
  //getMonth
  getMonth(officecode, empcode) {
    empcode = 0;
    console.log(officecode, empcode);
    this.service.getMonth(officecode, empcode)
      .subscribe(response => {
        this.month = response.json();
        if (this.month != null) {
          this.monthcode = this.month[0].salaryMonthID;
          this.monthname = this.month[0].month_Name;
          this.mFirstdate = this.month[0].mFirstDate;
          this.mLastdate = this.month[0].mLastDate;
        }

      });

  }
  //getCashAccounts
  getCashAccounts(paymenttype) {
    this.salary = []; 
   // console.log(TYPE);
    if (paymenttype == 1) {
      this.showcashaccount = '';
      this.service.getCashAccounts()
        .subscribe(response => {
          this.cashaccount = response.json(); 
          this.accountcode = this.cashaccount[0].accounT_CODE;
          this.accountname = this.cashaccount[0].accounT_TITLE;
        });

    }
    else {
      this.showcashaccount = 'none';
      this.accountcode = 0;
      this.accountname = '';
    }


  }
  changeAccount(code) {
    this.salary = [];
   // alert(code);
    //this.accountcode = code;
  }
  //viewPV
  viewPV() {

    this.service.viewPV(this.monthcode, this.officecode, this.salarydate.getDateFinal(), this.remarks, this.logedInUserID, this.paymenttype, this.accountcode)
      .subscribe(response => {
        this.isLoading =true;
        this.salary = response.json();
        console.log('---------------------');
        console.log(this.salary);
        console.log('---------------------');

        if (this.salary == null) {
          swal('No Record');
        }
        else {
          this.voucherid = this.salary[0].voucheR_ID;
        }
        console.log(this.salary);
        this.isLoading = false;

      });

  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);



    this.salarydate = new cDate();

    this.salary = [];
    this.officecode = 0;
    this.monthcode = 0;
    this.monthname = '';
    this.salary = [];

    this.uofficename = '';
    this.uvoucherid = 0;
    this.uvoucherno = '';
    this.uvoucherdate = '';
    this.uremarks = '';
    this.guid = UUID.UUID();
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
    var data = new SalaryPV(this.voucherid, this.monthcode, this.guid, this.paymenttype, this.accountcode);
    if(this.salary==null){
      swal("No Record!.");
      return;
    }
    if (this.salary.length > 0) {
      this.service.saveData(data).then(
        (response) => {
          this.getGrid("");
          this.modalReference.close();
          //swal("!")
        },
        (error) => console.log(error))
    }
    else { swal('No Record!')}
   

  }
  //getDetailsByID
  getDetailsByID(Voucher_ID, contentdetail) {
    //alert(Voucher_ID);
    this.mode = true;
    this.btnmode = false;

    this.service.getDetailsByID(Voucher_ID)
      .subscribe(response => {
        this.uvoucherlist = response.json();
        this.uofficename = this.uvoucherlist[0].officename;
        this.uvoucherid = this.uvoucherlist[0].voucherid;
        this.uvoucherno = this.uvoucherlist[0].voucherno;
        this.uvoucherdate = this.uvoucherlist[0].voucherdate;
        this.uremarks = this.uvoucherlist[0].remarks;

        console.log(this.uvoucherlist);
      });

    this.openDetail(contentdetail);

  }
  //cancelSalary
  cancelSalary() {
    this.service.cancelSalary(this.voucherid)
      .subscribe(response => {
        var list = response.json();
        this.getGrid("");
        this.modalReference.close();
        console.log(list);
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
  openDetail(contentdetail) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(contentdetail, ngbModalOptions);
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



