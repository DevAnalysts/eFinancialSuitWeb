import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AdvancePaymentService,  voucher, voucherDetails, LoginService, PermissionUtility } from '../../../../shared';

@Component({
  selector: 'advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrls: ['./advance-payment.component.scss']
})
export class AdvancePaymentComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility()

  modalReference: NgbModalRef;
  p: number = 1;
  vouchers: any[];
  offices: any[];
  chequeNos: any[];
  costCenter: any[];
  closeResult: string;
  officE_CODE: any = 1;
  officE_NAME: any;
  abbr: any;
  cosT_CENTER_CODE: any = 1;
  mode: any = 0;
  voucheR_ID: any = "";
 isLoading: any = false;
  remarks: any;
  public accounT_CODE: any = 1;
  public accounT_TITLE: any;
  public bank_Acct_No: any = 1;
  public bank_Acct_TITLE: any;

  public debit_Acct_No: any = 0;
  public debit_Acct_TITLE: any;


  voucheR_TYPE_CODE: any = 2;
  pay_Method: any = 1;
  debit: any = 0;
  credit: any = 0;
  accounts: Array<Select2OptionData>;
  accounts1: Array<Select2OptionData>;
  bankAccounts: any[];
  voucherDetails: any[];
  editMode = false;
  guid: any = "";
  ID: any = "";
  chequE_NO: any;
  particulars: any = "particulars";
  cosT_CENTER_TYPE = "O";
  currencY_CODE = 1;
  voucher_GUID: any;
  date = new Date();
  voucheR_DATE: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  chequE_DATE: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);


  emplist: Array<Select2OptionData>;
  emplistR: any[] = [];
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  departmentcode: any = 1;
  departmentname: any = '';
  designationcode: any = 1;
  designationname: any = '';
  categorycode: any = 1;
  categoryname: any = '';
  amountapproved: any = 0;
  advancecode: any = 0;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  page_Code: any;

  constructor(private service: AdvancePaymentService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
    this.voucherDetails = new Array<voucherDetails>();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  }

  ngOnInit() {
    this.permissionUtility.setPagePermissions(30004);
    this.geBankPaymentVouchers(this.ID);
    this.getDebitBankAccount(this.page_Code);
  }
  //geBankPaymentVouchers
  geBankPaymentVouchers(value: string) {
    this.isLoading =true;
    this.service.geBankPaymentVouchers(value,this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.vouchers = (response.json());
          //console.log(response.json());
        }
        else{
          this.isLoading = false;
          this.vouchers = [];
        }
       
      });
  }
  //getOffices
  getOffices() {
    this.isLoading =true;
    this.service.getOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.offices = (response.json());
          this.officE_CODE = this.userCurrentOffice;
          this.cosT_CENTER_CODE = this.userCurrentOffice;
          this.officE_NAME = this.offices[0].officE_NAME;
          this.abbr = this.offices[0].abbr;
          this.getBankAccounts(this.officE_CODE);
        }

      });
  }
  //changeOffices
  changeOffices(officE_CODE) {
    this.bankAccounts = [];
    this.chequeNos = [];
    this.isLoading =true;
    this.service.getChangeOffices(officE_CODE)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.costCenter = (response.json());
          this.cosT_CENTER_CODE = this.costCenter[0].cosT_CENTER_CODE;
          this.abbr = this.costCenter[0].abbr;
          this.getBankAccounts(this.cosT_CENTER_CODE);
        }
      });
  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          //console.log(response.json());
          this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
          //this.empcode = this.emplist[0].id;
          //this.empname = this.emplist[0].text;
          this.emplistR = response.json();
          //this.departmentname = this.emplistR[0].departmentname;
          //this.designationname = this.emplistR[0].designationname;
          //this.categoryname = this.emplistR[0].categoryname;
          //this.amountapproved = this.emplistR[0].amountapproved;
          //this.advancecode = this.emplistR[0].advancecode;
        }
      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
    for (let i = 0; i < this.emplistR.length; i++)
      if (this.emplistR[i].empcode == this.empcode) {
        this.designationname = this.emplistR[i].designationname;
        this.departmentname = this.emplistR[i].departmentname;
        this.categoryname = this.emplistR[i].categoryname;
        this.categorycode = this.emplistR[i].categorycode;
        this.amountapproved = this.emplistR[i].amountapproved;
        this.advancecode = this.emplistR[i].advancecode;
        //alert(this.advancecode);
      }
  }
  //getAccounts
  getAccounts(officE_CODE) {
    this.isLoading =true;
    this.service.getAccounts(officE_CODE)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.accounts = this.getDropdownList(response.json(), "accounT_CODE", "accounT_TITLE");
          this.accounT_CODE = this.accounts[0].id;
          this.accounT_TITLE = this.accounts[0].text;
        }
      });
  }
  //getDebitBankAccount
  getDebitBankAccount(page_Code) {
    this.isLoading =true;
    this.service.getDebitBankAccount(page_Code)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var debitBank = (response.json());
          this.debit_Acct_No = debitBank[0].debit_Acct_No;
          this.debit_Acct_TITLE = debitBank[0].debit_Acct_TITLE;
        }
      });

  }
  //getChangeAccounts
  getChangeAccounts(e: any) {
    this.isLoading =true;
    this.accounT_CODE = e;
    this.service.getChangeAccounts(this.accounT_CODE)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.accounts1 = this.getDropdownList(response.json(), "accounT_CODE", "accounT_TITLE");
          this.accounT_CODE = this.accounts1[0].id;
          this.accounT_TITLE = this.accounts1[0].text;
        }
      });
  }
  //getBankAccounts
  getBankAccounts(officE_CODE) {
    this.isLoading =true;
    this.service.getBankAccounts(officE_CODE)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.bankAccounts = (response.json());
          this.bank_Acct_No = this.bankAccounts[0].bank_Acct_No;
          this.bank_Acct_TITLE = this.bankAccounts[0].bank_Acct_TITLE;

          this.isLoading =true;
          this.service.getChequeNo(this.bank_Acct_No, "Open", true)
            .subscribe(response => {
              this.isLoading = false;
              if (response.json() != null) {
                this.chequeNos = (response.json());
                this.chequE_NO = this.chequeNos[0].chequE_NO;
              }
            });
        }

      });
  }
  //changeChequeNo
  changeChequeNo(bank_Acct_No) {
    this.isLoading =true;
    this.service.getChequeNo(bank_Acct_No, "Open", true)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.chequeNos = (response.json());
          this.chequE_NO = this.chequeNos[0].chequE_NO;
        }
      });

  }
  //clearFields
  clearFields() {
    this.mode = 0;
    this.remarks = "";

    this.empcode = 0

    this.designationname = '';
    this.departmentname = '';
    this.categoryname = '';
    this.amountapproved = 0;


    this.bankAccounts = [];
    this.chequeNos = [];

    this.getEmployees();
    this.getOffices();
    this.getAccounts(this.officE_CODE);
    this.getBankAccounts(this.officE_CODE);
    this.voucher_GUID = UUID.UUID();
    this.voucherDetails = [];
    //this.getAccounts(this.banK_CODE);
    $("#submitAdd").prop("disabled", false);
    $("#lblCheque").hide();
    $("#ddlCheque").show();
    //this.guid = UUID.UUID();
  }
  //getDetailsByID
  getDetailsByID(voucher_ID, content) {
    this.open(content);
    this.isLoading =true;
    this.service.getDetailsByID(voucher_ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var list = (response.json());
          this.voucheR_ID = list[0].voucher_ID;
          this.voucheR_DATE = list[0].voucheR_DATE;
          this.officE_CODE = list[0].officE_CODE;
          this.remarks = list[0].remarks;
          this.bank_Acct_No = list[0].bank_Acct_No;
          this.chequE_NO = list[0].chequE_NO;
          this.voucherDetails = list[0].voucherDetails;
          this.isLoading =true;



          this.service.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              this.isLoading = false;
              this.offices = (response.json());
              this.officE_CODE = list[0].officE_CODE;
            });

          this.empname = list[0].empname;
          this.departmentname = list[0].departmentname;
          this.designationname = list[0].designationname;
          this.categoryname = list[0].categoryname;
          this.amountapproved = list[0].amountapproved;
        }
      });

    $("#lblCheque").show(); $("#ddlCheque").hide();
    this.mode = true;
  }
  //saveVoucher
  saveVoucher() {
    this.isLoading =true;
    this.particulars = "particulars";
    this.cosT_CENTER_TYPE = "O";

    this.voucherDetails.push(new voucherDetails(0, this.debit_Acct_No, this.debit_Acct_TITLE, this.amountapproved, 0, this.particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, this.cosT_CENTER_TYPE, 1, '', '', '', '', 0,'',0));//Debit
    this.voucherDetails.push(new voucherDetails(0, this.bank_Acct_No, this.bank_Acct_TITLE, 0, this.amountapproved, this.particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, this.cosT_CENTER_TYPE, 1, '', '', '', '', 0,'',0));//Credit

    var order = new voucher(0, 0, this.voucheR_DATE, this.officE_CODE, "", "", this.chequE_NO, this.chequE_DATE, null, 0, this.voucheR_TYPE_CODE, this.amountapproved, this.amountapproved, 1, this.bank_Acct_No, 30004, this.voucher_GUID, this.pay_Method, "", this.advancecode, this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.voucherDetails);

    console.log(order);
    this.service.saveVoucher(order).then(
      (response) => {
        this.isLoading = false;
        this.geBankPaymentVouchers('');
        console.log(response);
      },
      (error) => console.log(error))

  }
  //updateVoucher
  updateVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any) {
    //if (debit > 0 || credit > 0) {
    //  this.accounT_CODE = this.bank_Acct_No;
    //  this.accounT_TITLE = this.bank_Acct_TITLE;
    //  debit = 0;
    //  this.particulars = "particulars";
    //  this.voucherDetails.push(new AdvanceVoucherDetails(0, this.accounT_CODE, this.accounT_TITLE, debit, credit, this.particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, 'O', 1, '', '', '', '', 0));
    //  var order = new AdvanceVoucher(this.voucheR_ID, 0, this.voucheR_DATE, this.officE_CODE, "", "", this.chequE_NO, this.chequE_DATE, 0, this.voucheR_TYPE_CODE, credit, credit, 1, this.bank_Acct_No, 1, this.voucher_GUID, this.pay_Method, "", "", this.remarks, null, null, this.voucherDetails);
    //  this.service.updateVoucher(order).then(
    //    (response) => {
    //      this.geBankPaymentVouchers(this.ID);
    //      console.log(response);
    //    },
    //    (error) => console.log(error))
    //}
    //else {
    //  alert("- Voucher must be greater then 0.");
    //}
  }
  // open Modal
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

      if (!this.mode)
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
