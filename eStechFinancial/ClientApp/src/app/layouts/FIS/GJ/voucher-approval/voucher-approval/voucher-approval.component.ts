import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { VoucherApprovalService, LoginService, voucher, cDate, NgbDateFRParserFormatter, JournalVoucherService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';
import { SalaryReviewModule } from '@layouts/PRM/PackageManagement/salary-review/salary-review.module';
@Component({
  selector: 'voucher-approval',
  templateUrl: './voucher-approval.component.html',
  styleUrls: ['./voucher-approval.component.scss']
})
export class VoucherApprovalComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
   

  p: number = 1;
  modalReference: NgbModalRef;
  vouchers: any[];
  selectedAll: any = false;
  mode: any = 0;
  chk: any = false;
  voucher_ID: any;
  approvE_BY: any;
  date = new Date();
  public permissionUtility:PermissionUtility=new PermissionUtility();
  voucherDetails: any[];
  approveVoucher: any[] = [];
  ID: any = "";
  approvE_DATE: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  saveDisable: any = false;
  constructor(private service: VoucherApprovalService, private JVService: JournalVoucherService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal, private LoginService: LoginService) {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  }

  ngOnInit() {
    this.getVoucherApproval(this.ID);
    this.permissionUtility.setPagePermissions(40008);
  }
   ////////////////////////
  
  //getVoucherApproval
  getVoucherApproval(value: string) {
    this.isLoading = true;
    this.service.getVoucherApproval(value, this.userPrivilegedOffice)
      .subscribe(response => {
        this.vouchers = (response.json());
        this.isLoading = false;
        if(response.status != 200)
        {
          $("#submitAdd").hide();
          this.vouchers =[];
        }
        else
        {
          $("#submitAdd").show();
        }
      });
      
  }
  //selectAll
  selectAll() {
    this.selectedAll = true;
    for (var i = 0; i < this.vouchers.length; i++) {
      this.vouchers[i].approvE_BY = this.selectedAll;
      if (this.vouchers[i].approvE_BY == true) {
        this.voucher_ID = this.vouchers[i].voucher_ID;
        this.approveVoucher.push(this.voucher_ID);
      }
    }
  }
  //checkIfAllSelected
  checkIfAllSelected() {
    for (let i = 0; i < this.vouchers.length; i++) {
      this.chk = this.vouchers[i].approvE_BY;
      if (this.chk == true) {
        this.voucher_ID = this.vouchers[i].voucher_ID;
        this.approveVoucher.push(this.voucher_ID);
      }
    }
  }
  //ApproveVoucherByID
  ApproveVoucherByID(i: voucher) {
    i.approvE_BY = true;
    this.voucheR_ID = i.voucher_ID;
    this.changeVoucherStatus(this.voucheR_ID, 3);

  }
  //voucherApprove
  voucherApprove() {
    //swal("Are You Sure?", "Are you sure to approve all voucher", "question");
    swal({
      title: "Do you really want to Approve?",
      text: "Once Approved, you will not be able to edit this Voucher!",
      icon: "warning",
      buttons: {
        cancel: {
          text: "No",
          value: false,
          visible: true,
          closeModal: true,
        },
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          closeModal: true,
        },
      },
    })
      .then((willCancel) => {
        if (willCancel) {
          for (let i = 0; i < this.vouchers.length; i++) {
            this.vouchers[i].approvE_BY = this.selectedAll;
            this.chk = this.vouchers[i].approvE_BY;
            if (this.chk == true) {
              this.voucher_ID = this.vouchers[i].voucher_ID;
              this.vouchers[i].approvE_BY = true;
            }
          }
          var json = this.approveVoucher;
          //console.log('------------------' + json);
          this.service.voucherApproval(json).subscribe(
            (response) => {
              this.getVoucherApproval(this.ID);
              console.log(response);
            },
            (error) => console.log(error))
          this.approveVoucher = [];
          
        }

      });
      this.getVoucherApproval("");
      this.selectedAll = false;
   
  }


  //=========================================================================================//
  //=========================================================================================//


  offices: any[];
  chequeNos: any[];
  closeResult: string;
  officE_CODE: any = 1;
  officE_NAME: any;

  voucheR_ID: any = "";
  remarks: any;
  public accounT_CODE: any = 1;
  public accounT_TITLE: any;
  public bank_Acct_No: any = 1;
  public bank_Acct_TITLE: any;
  voucheR_TYPE_CODE: any = 0;
  pay_Method: any = 1;
  debit: any = 0;
  credit: any = 0;
  bankAccounts: any[];
  chequE_NO: any;
  isLoading: any = false;
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  isView: any = true;

  showpayto: any = 'none';
  amount: any = 0;
  payto: any = '';

  public voucheR_DATE = new cDate();
  public chequE_DATE: any = new cDate();

  //=========================================================================================//
  //getBankAccounts
  getBankAccounts(officE_CODE) {
    this.bankAccounts = [];
    this.JVService.getBankAccounts(officE_CODE)
      .subscribe(response => {
        if (response.json() != null) {
          this.bankAccounts = (response.json());
          this.bank_Acct_No = this.bankAccounts[0].bank_Acct_No;
          this.bank_Acct_TITLE = this.bankAccounts[0].bank_Acct_TITLE;

          this.chequeNos = [];
          this.JVService.getChequeNo(this.bankAccounts[0].bank_Acct_No, "Open", true)
            .subscribe(response => {
              if (response.json() != null) {
                this.chequeNos = (response.json());
                this.chequE_NO = this.chequeNos[0].chequE_NO;
                $("#AddNewItemRow").show();
                $("#submitAdd").prop("disabled", false);
              }
              else if (!this.mode) {
                $("#AddNewItemRow").hide();
                $("#submitAdd").prop("disabled", true);
                swal("No Cheque Book Exist!")
              }
              this.isLoading = false;

            });
        }
        else {
          swal("No Bank Account Exist!")
          $("#submitAdd").prop("disabled", true);
        }
      });
  }
  //getCashAccounts
  getCashAccounts(officE_CODE) {
    this.bankAccounts = [];
    this.JVService.getCashAccounts(officE_CODE)
      .subscribe(response => {
        if (response.json() != null) {
          this.bankAccounts = (response.json());
          this.bank_Acct_No = this.bankAccounts[0].bank_Acct_No;
        }

      });
  }
  //paymentMethod
  paymentMethod = [
    { "pay_Method": 1, "payment_Method": "Cross" }
    , { "pay_Method": 2, "payment_Method": "Cash" }
  ]
  //TotalDebit
  TotalDebit() {
    var totalDebit = 0;
    if (this.voucherDetails != null) {
      for (var count = 0; count < this.voucherDetails.length; count++) {
        totalDebit += this.voucherDetails[count].debit;
      }
    }
    return totalDebit.toFixed(2);
  }
  //TotalCredit
  TotalCredit() {
    var totalCredit = 0;
    if (this.voucherDetails != null) {
      for (var count = 0; count < this.voucherDetails.length; count++) {
        totalCredit += this.voucherDetails[count].credit;
      }
    }

    return totalCredit.toFixed(2);
  }
  //getDropdownList
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];

    if (arr != null) {

      //if (!this.mode) {
      ar.push({
        id: 0,
        text: ""
      });
      //}
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
  //getDetailsByID
  getDetailsByID(voucher_ID, TYPE, content) {
    this.isLoading = true;
    this.open(content);

    if (TYPE == 2) //BPV
    {
      this.showpayto = '';
      this.JVService.getBPDetailsByID(voucher_ID)
        .subscribe((o: voucher) => {
          console.log(o);
          this.voucheR_ID = o.voucher_ID;
          this.voucheR_DATE.setDate(o.voucheR_DATE);
          this.chequE_DATE.setDate(o.chequE_DATE);
          this.officE_CODE = o.officE_CODE;
          this.remarks = o.remarks;
          this.chequE_NO = o.chequE_NO;
          this.voucheR_TYPE_CODE = o.voucheR_TYPE_CODE;

          this.amount = o.net_Paied;
          this.payto = o.pay_To;

          this.voucherDetails = o.voucherDetails;
          this.JVService.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              if (response.json() != null) {
                this.offices = (response.json());
                this.officE_CODE = o.officE_CODE;
                this.bankAccounts = [];
                //alert(o.voucheR_TYPE_CODE)

                this.JVService.getBankAccounts(this.officE_CODE)
                  .subscribe(response => {
                    if (response.json() != null) {
                      this.bankAccounts = (response.json());
                      this.bank_Acct_No = o.bank_Acct_No;
                    }
                    this.isLoading = false;
                  });

              }
            });
        });
    }
    else if (TYPE == 1) //CPV
    {
      this.showpayto = '';
      this.JVService.getCPDetailsByID(voucher_ID)
        .subscribe((o: voucher) => {
          console.log(o);
          this.voucheR_ID = o.voucher_ID;
          this.voucheR_DATE.setDate(o.voucheR_DATE);
          this.officE_CODE = o.officE_CODE;
          this.remarks = o.remarks;
          this.chequE_NO = o.chequE_NO;
          this.voucheR_TYPE_CODE = o.voucheR_TYPE_CODE;

          this.amount = o.net_Paied;
          this.payto = o.pay_To;

          this.voucherDetails = o.voucherDetails;
          this.JVService.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              if (response.json() != null) {
                this.offices = (response.json());
                this.officE_CODE = o.officE_CODE;
                this.bankAccounts = [];
                //alert(o.voucheR_TYPE_CODE)

                this.JVService.getCashAccounts(this.officE_CODE)
                  .subscribe(response => {
                    if (response.json() != null) {
                      this.bankAccounts = (response.json());
                      this.bank_Acct_No = o.bank_Acct_No;
                    }
                    this.isLoading = false;
                  });
              }

            });
        });
    }
    else if (TYPE == 4) //BRV
    {
      this.showpayto = 'none';
      this.JVService.getBCDetailsByID(voucher_ID)
        .subscribe((o: voucher) => {
          console.log(o);
          this.voucheR_ID = o.voucher_ID;
          this.voucheR_DATE.setDate(o.voucheR_DATE);
          this.chequE_DATE.setDate(o.chequE_DATE);
          this.officE_CODE = o.officE_CODE;
          this.remarks = o.remarks;
          this.chequE_NO = o.chequE_NO;
          this.voucheR_TYPE_CODE = o.voucheR_TYPE_CODE;

          this.amount = o.net_Paied;

          this.voucherDetails = o.voucherDetails;
          this.JVService.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              if (response.json() != null) {
                this.offices = (response.json());
                this.officE_CODE = o.officE_CODE;
                this.bankAccounts = [];
                //alert(o.voucheR_TYPE_CODE)

                this.JVService.getBankAccounts(this.officE_CODE)
                  .subscribe(response => {
                    if (response.json() != null) {
                      this.bankAccounts = (response.json());
                      this.bank_Acct_No = o.bank_Acct_No;
                    }
                    this.isLoading = false;
                  });

              }
            });

        });
    }
    else if (TYPE == 3) // CRV
    {
      this.showpayto = 'none';
      this.JVService.getCRDetailsByID(voucher_ID)
        .subscribe((o: voucher) => {
          console.log(o);
          this.voucheR_ID = o.voucher_ID;
          this.voucheR_DATE.setDate(o.voucheR_DATE);
          this.chequE_DATE.setDate(o.chequE_DATE);
          this.officE_CODE = o.officE_CODE;
          this.remarks = o.remarks;
          this.chequE_NO = o.chequE_NO;
          this.voucheR_TYPE_CODE = o.voucheR_TYPE_CODE;
          this.amount = o.net_Paied;
          this.voucherDetails = o.voucherDetails;
          this.JVService.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              if (response.json() != null) {
                this.offices = (response.json());
                this.officE_CODE = o.officE_CODE;
                this.bankAccounts = [];
                //alert(o.voucheR_TYPE_CODE)

                this.JVService.getCashAccounts(this.officE_CODE)
                  .subscribe(response => {
                    if (response.json() != null) {
                      this.bankAccounts = (response.json());
                      this.bank_Acct_No = o.bank_Acct_No;
                    }
                    this.isLoading = false;
                  });

              }
            });

        });
    }
    else//JV
    {
      this.JVService.getDetailsByID(voucher_ID)
        .subscribe((o: voucher) => {
          console.log(o);
          this.voucheR_ID = o.voucher_ID;
          this.voucheR_DATE.setDate(o.voucheR_DATE);
          this.chequE_DATE.setDate(o.chequE_DATE);
          this.officE_CODE = o.officE_CODE;
          this.remarks = o.remarks;
          this.chequE_NO = o.chequE_NO;

          this.voucherDetails = o.voucherDetails;
          this.JVService.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              if (response.json() != null) {
                this.offices = (response.json());
                this.officE_CODE = o.officE_CODE;
                this.bankAccounts = [];
              }
              this.isLoading = false;
            });




        });
    }
    this.mode = true;
  }
  //open
  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
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
  //changeVoucherStatus
  changeVoucherStatus(voucheR_ID, Status) {
    if (Status == 3) {
      swal({
        title: "Do you really want to Approve?",
        text: "Once Approved, you will not be able to edit this Voucher!",
        icon: "warning",
        buttons: {
          cancel: {
            text: "No",
            value: false,
            visible: true,
            closeModal: true,
          },
          confirm: {
            text: "Yes",
            value: true,
            visible: true,
            closeModal: true,
          },
        },
      })
        .then((willCancel) => {
          if (willCancel) {
            this.JVService.changeVoucherStatus(voucheR_ID, Status, this.logedInUserID)
              .subscribe(response => {
                var list = (response.json());
                this.getVoucherApproval('');
                this.modalReference.close();
                this.vouchers = [];
              });
          }

        });
    }
  }

  //=========================================================================================//
  //=========================================================================================//


}
