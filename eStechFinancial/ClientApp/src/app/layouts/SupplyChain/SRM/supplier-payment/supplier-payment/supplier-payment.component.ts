import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SupplierPaymentService, LoginService, DayEndService, Supplier, Payment, FileAttachmentService, purchasePaymentDetails, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert'; 
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'supplier-payment',
  templateUrl: './supplier-payment.component.html',
  styleUrls: ['./supplier-payment.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SupplierPaymentComponent implements OnInit {
  ////////////////////////////////////////
  //Member Variables
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility: PermissionUtility = new PermissionUtility(); 
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  p: number = 1;
  modalReference: NgbModalRef;
  getPaymentDetails: any[] = [];
  suppliers: Array<Select2OptionData> = [];
  getContacts: any[] = [];
  getPaymentMethods: any[] = [];
  bankAccounts: any;
  paymentDetailValues: any[] = [];
  paymentDetailsByID: any;
  supplier_ID: any;
  purchase_Payment_ID: any = 0;
  priviledged_Offices: any = 1;
  mode: any = 0;
  btnmode: any = 0;
  total_Cost: any = 0;
  total_Discount: any = 0;
  freight_Chrgs: any = 0;
  total_Amount: any = 0;
  balance_Amount: any = 0;
  hidden_Balance: any = 0;
  prepaid: any = 0;
  paid_Amount: any = 0;
  invoice_Amount: any = 0;
  selectedAmount: any = 0;
  purchasePaymentDetail: any[] = [];
  purchasePaymentDetails: any[] = [];
  guid: any;
  remarks: any = "";
  public payment_Date = new cDate();
  public dayEndDate = new cDate();
  public chequeDate = new cDate();
  showchequedate: any = 'none';
  payment_ID: any = "";
  isLoading: any = false;
  color = '#0094ff';
  ID: any;
  accounT_NO: any;
  getChequeNumbers: any;
  method_ID: any = 1;
  chequE_NO: any;
  reference_No:any;
  openingBalance: any = 0.00;
  totalPurchases: any = 0.00;
  totalReturns: any = 0.00;
  totalPayments: any = 0.00;
  netPayable: any = 0.00;
  advanceAmount: any = 0.00;
  closeResult: string;
  amount: any = 0;
  selectedAll: any;
  chk: any = false;
  balanceType: any = false;
  paymentStatus: any[] = [];
  status: any;
  alerts: Array<any> = [];
  cancelReturn: any;
  actionID: any = 3;
  paid: any = 0;
  dayEndDetail: any[] = [];
  settingPaymentInvoiceWise: any;
  allowAvancePayment: any;
  allowAvance: any = false;
  allowAvanceAdjustment: any = false;
  adjust: any = 0;
  checkBoxStatus: any = false;
  guidOrder: boolean;
  voucher_ID: any = 0;
  ShowRA: any = "none";
  return_Amount: any = 0.00;
  payto: any = '';
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  public valid:Validation=new Validation();
  //End Member Variables
  constructor(private service: SupplierPaymentService, private fileservice: FileAttachmentService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.purchasePaymentDetails = new Array<purchasePaymentDetails>();
    this.logedInUserID = this.LoginService.getSession('user_ID');
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
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.getCurrentDay();
    this.searchPaymentDetails('');
    this.settingPaymentInvoiceWise = sessionStorage.getItem('settingPaymentInvoiceWise');
    this.ShowReturnAdjustmentColumn();
    this.permissionUtility.setPagePermissions(80010);
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
    this.payment_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    //});
  }
  //changePaymentDate
  changePaymentDate(pO_payment_DateDate) {
    if (this.payment_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.payment_Date.setDate(this.dayEndDate.getDateFinal());

    this.purchasePaymentDetail = [];
    if (this.mode == false) {
      this.getInvoiceDetails(this.supplier_ID, 0, this.mode);
    }
  }
  //searchPaymentDetails
  searchPaymentDetails(value: string) {
    this.service.searchPaymentDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.getPaymentDetails = (response.json());
        }
        else{
          this.getPaymentDetails = [];
        }
        
      });
  }
  //getCustomers
  getSuppliers() {
    this.isLoading = true;
    this.service.getSuppliers(this.userCurrentOffice, this.purchase_Payment_ID, this.allowAvance, this.mode)
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        if (this.suppliers.length > 0) {
          this.supplier_ID = this.suppliers[0].id;
          this.service.getContacts(this.supplier_ID)
            .subscribe(response => {
              if (response.json() != null) {
                this.getContacts = (response.json());
                this.balanceType = parseFloat(this.getContacts[0].balanceType);
                this.openingBalance = parseFloat(this.getContacts[0].openingBalance);
                this.totalPurchases = parseFloat(this.getContacts[0].totalPurchases);
                this.totalReturns = parseFloat(this.getContacts[0].totalReturns);
                if (this.balanceType == 2) {
                  this.totalPayments = parseFloat(this.getContacts[0].totalPayments + this.getContacts[0].advanceAmount);
                  this.advanceAmount = this.getContacts[0].advanceAmount;
                }
                else {
                  this.totalPayments = parseFloat(this.getContacts[0].totalPayments);
                  this.advanceAmount = 0;
                }


                //this.netPayable = (parseFloat(this.getContacts[0].openingBalance) + parseFloat(this.getContacts[0].totalPurchases) - parseFloat(this.getContacts[0].totalReturns) - parseFloat(this.getContacts[0].totalPayments)).toFixed(2);

                this.netPayable = parseFloat(this.getContacts[0].netPayable);
                if (this.netPayable < 0) {
                  this.advanceAmount = -(this.netPayable);
                  this.netPayable = 0;
                }
                if (this.mode == false) {
                  this.getInvoiceDetails(this.supplier_ID, 0, this.mode);
                }
              }
            });
          this.isLoading = false;
          $("#submitAdd").prop("disabled", true);
        }
        else {
          this.isLoading = false;
        }
      });
  }
  //changeContacts
  changeContacts(e: any) {
    if (this.mode == false) {
      this.purchasePaymentDetail = [];
      this.supplier_ID = e;
    }
    this.service.getContacts(this.supplier_ID)
      .subscribe(response => {
        if (response.json() != null) {
          this.getContacts = (response.json());
          this.balanceType = parseFloat(this.getContacts[0].balanceType);
          this.openingBalance = parseFloat(this.getContacts[0].openingBalance);
          this.totalPurchases = parseFloat(this.getContacts[0].totalPurchases);
          this.totalReturns = parseFloat(this.getContacts[0].totalReturns);
          if (this.balanceType == 2) {
            this.totalPayments = parseFloat(this.getContacts[0].totalPayments + this.getContacts[0].advanceAmount);
            this.advanceAmount = this.getContacts[0].advanceAmount;
          }
          else {
            this.totalPayments = parseFloat(this.getContacts[0].totalPayments);
            this.advanceAmount = 0;
          }

          //this.netPayable = (parseFloat(this.getContacts[0].openingBalance) + parseFloat(this.getContacts[0].totalPurchases) - parseFloat(this.getContacts[0].totalReturns) - parseFloat(this.getContacts[0].totalPayments)).toFixed(2);

          this.netPayable = parseFloat(this.getContacts[0].netPayable);
          if (this.netPayable < 0) {
            this.advanceAmount = -(this.netPayable);
            this.netPayable = 0;
          }
          if (this.mode == false) {
            this.getInvoiceDetails(this.supplier_ID, 0, this.mode);
          }
        }
      });
  }
  //getPaymentMethods
  paymentMethod() {
    //getPaymentMethods
    this.service.getPaymentMethods(this.supplier_ID)
      .subscribe(response => {
        this.getPaymentMethods = (response.json());
        this.method_ID = this.getPaymentMethods[0].method_ID;

        this.changePaymentMethod(this.method_ID);
      });
  }
  //changePaymentMethod
  changePaymentMethod(method_ID) {
    this.getBankAccounts();
    if (method_ID == 1) {
      $("#lblAccount").show();
      $("#lblAccountTitle").show();
      $("#lblCheque").hide();
      $("#lblChequeTitle").hide();
      $("#txtCheque").hide();
      $("#ddlCheque").hide();

      this.showchequedate = 'none';
    }
    else {

      $("#lblAccount").show();
      $("#lblAccountTitle").show();
      $("#lblCheque").show();
      $("#lblChequeTitle").show();
      this.showchequedate = '';
      if (this.mode == true) {
        $("#txtCheque").show();
        $("#ddlCheque").hide();
      }
      else {
        $("#txtCheque").hide();
        $("#ddlCheque").show();
      }
    }
  }
  //getBankAccounts
  getBankAccounts() {
    if (this.btnmode) {
      this.isLoading = true;
      this.service.getBankAccounts(this.method_ID)
        .subscribe(response => {
          this.isLoading = false;
          this.bankAccounts = (response.json());
          this.accounT_NO = this.bankAccounts[0].accounT_NO;
          console.log(this.bankAccounts);
          this.changeAccountNo(this.accounT_NO);
        });
    }
  }
  //changeAccountNo
  changeAccountNo(accountCode) {
    this.isLoading = true;
    this.service.getChequeNumbers(accountCode)
      .subscribe(response => {
        this.isLoading = false;
        this.getChequeNumbers = (response.json());
        if (this.getChequeNumbers != null) {
          this.chequE_NO = this.getChequeNumbers[0].chequE_NO;
        }
        // console.log(response.json());
      });
  }
  //getInvoiceDetails
  getInvoiceDetails(supplier_ID, purchase_Payment_ID, mode) {
    this.service.getInvoiceDetails(this.supplier_ID, purchase_Payment_ID, this.payment_Date.getDateFinal(), this.userCurrentOffice, mode)
      .subscribe(response => {
        this.purchasePaymentDetail = (response.json());
        if (this.mode == true)
          if (this.ReturnAmountFlag && !this.btnmode)
            this.paid = this.paid_Amount;
          else
            this.paid = this.purchasePaymentDetail[0].invoice_Amount;


        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //getPaymentDetailValues
  getPaymentDetailValues(purchase_Payment_ID) {
    this.service.getPaymentDetailValues(this.purchase_Payment_ID)
      .subscribe(response => {
        this.paymentDetailValues = (response.json());
        //console.log(response.json());
      });
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];

    if (sessionStorage.getItem("EnableEmptyRow") == '1' && this.btnmode == true) {
      ar.push({
        id: '0',
        text: ''
      });
    }
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
  //clearFields
  clearFields() {
    //Member Varialbes 
    this.mode = false;
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.btnmode = true;
    this.total_Cost = 0;
    this.total_Discount = 0;
    this.freight_Chrgs = 0;
    this.total_Amount = 0.00;
    this.balance_Amount = 0;
    this.hidden_Balance = 0;
    this.openingBalance = 0;
    this.totalPurchases = 0;
    this.totalReturns = 0;
    this.reference_No='';
    this.totalPayments = 0;
    this.netPayable = 0;
    this.prepaid = 0;
    this.paid_Amount = 0;
    this.adjust = 0;
    this.allowAvance = false;
    this.allowAvanceAdjustment = false;
    this.advanceAmount = 0;
    this.remarks = "";
    this.method_ID = 1;
    this.purchasePaymentDetail = [];
    this.purchasePaymentDetails = [];
    this.getContacts = [];
    this.getPaymentMethods = [];
    this.paymentDetailValues = [];
    $("#submitAdd").prop("disabled", true);
    $("#submitUpdate").prop("disabled", true);
  }
  //getTotals
  getTotals() {
    this.total_Cost = 0;
    this.total_Discount = 0;
    this.freight_Chrgs = 0;
    this.total_Amount = 0;
    this.balance_Amount = 0;
    // this.paid_Amount = 0;

    for (var count = 0; count < this.purchasePaymentDetail.length; count++) {
      if (this.purchasePaymentDetail[count].paid_Amount > 0) {
        this.total_Cost += this.purchasePaymentDetail[count].total_Cost;
        this.total_Discount += this.purchasePaymentDetail[count].total_Discount;
        this.freight_Chrgs += this.purchasePaymentDetail[count].freight_Chrgs;
        this.total_Amount += this.purchasePaymentDetail[count].total_Amount;
        this.balance_Amount += this.purchasePaymentDetail[count].total_Amount - this.purchasePaymentDetail[count].paid_Amount;

      }
      //$scope.Paid_Amount= $scope.InvoiceDetails[count].Paid_Amount
    }

  }
  //selectAll
  selectAll() {
    for (var i = 0; i < this.purchasePaymentDetail.length; i++) {
      this.purchasePaymentDetail[i].selected = this.selectedAll;

      var selectedAmount = 0;
      for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
        this.chk = this.purchasePaymentDetail[i].selected;
        if (this.chk == true) {
          if (this.purchasePaymentDetail[i].invoice_Amount != 0)
            selectedAmount += (this.purchasePaymentDetail[i].invoice_Amount);
          else {
            selectedAmount += (this.purchasePaymentDetail[i].balance_Amount);
            this.purchasePaymentDetail[i].invoice_Amount = this.purchasePaymentDetail[i].balance_Amount;
          }
        }
      }
    }
    this.paid = selectedAmount.toFixed(2);
    this.paidStatus(this.paid_Amount);
  }
  //checkIfAllSelected
  checkIfAllSelected() {

    var selectedAmount = 0;
    for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
      this.chk = this.purchasePaymentDetail[i].selected;
      if (this.chk == true) {
        if (this.allowAvance != 0)
          if (this.paid > 0)
            this.adjust = 1;
        if (this.purchasePaymentDetail[i].invoice_Amount != 0)
          selectedAmount += (this.purchasePaymentDetail[i].invoice_Amount);
        else {
          selectedAmount += (this.purchasePaymentDetail[i].balance_Amount);
          this.purchasePaymentDetail[i].invoice_Amount = this.purchasePaymentDetail[i].balance_Amount;
        }
      }
      else {

        this.purchasePaymentDetail[i].invoice_Amount = 0;
      }
    }
    this.paid = selectedAmount.toFixed(2);
    this.paidStatus(this.paid_Amount);
  }
  //changePaid
  changePaid(paid_Amount) {
    if (paid_Amount <= 0) {
      this.paid_Amount = 0;
      $("#submitAdd").prop("disabled", true);
      $("#submitAddMore").prop("disabled", true);
      $("#submitUpdate").prop("disabled", true);
    }
    var selectedAmount = 0, selecteBalance = 0, pd = 0, ia = 0;
    ////again commit
    if (this.allowAvancePayment == 1 && this.allowAvance == 1) {

      if (paid_Amount >= this.paid) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      }
      else {
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
        swal("Supplier Payment should be equal to or greather then total amount.");
      }
    }
    else {

      if (paid_Amount == this.paid && this.allowAvance == 0) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      }
      else {

        if (this.returninvoiceFlag != true) {
          if (this.checkBoxStatus == true) {
            var Flag = true;
            for (let i = 0; i < this.purchasePaymentDetail.length; i++) { //Check Amount In Marked Invoice Amount If Greater Than Zero :: Allow/Not Allow Adjustment
              if (this.purchasePaymentDetail[i].selected == true && this.purchasePaymentDetail[i].invoice_Amount > 0) {
                Flag = false;
              }
            }


            if (Flag && paid_Amount > 0) {
              pd = paid_Amount;
              var sum = 0;
              for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
                if (this.purchasePaymentDetail[i].balance_Amount > 0 && this.purchasePaymentDetail[i].type == 0) {
                  var Value = this.purchasePaymentDetail[i].balance_Amount - pd;
                  if (Value >= 0) {
                    this.purchasePaymentDetail[i].invoice_Amount = pd;
                    this.purchasePaymentDetail[i].selected = true;
                    sum += pd;
                    break;
                  }
                  else {
                    this.purchasePaymentDetail[i].invoice_Amount = this.purchasePaymentDetail[i].balance_Amount;
                    this.purchasePaymentDetail[i].selected = true;
                    pd = pd - this.purchasePaymentDetail[i].balance_Amount;
                    sum += this.purchasePaymentDetail[i].balance_Amount;
                  }

                }
                else {
                  this.purchasePaymentDetail[i].selected = false;
                }

                if (this.purchasePaymentDetail[i].type == 2) {
                  var Value = this.purchasePaymentDetail[i].balance_Amount - pd;
                  if (Value >= 0) {
                    this.purchasePaymentDetail[i].invoice_Amount = pd;
                    this.purchasePaymentDetail[i].selected = true;
                    sum += pd;
                    break;
                  }
                  else {
                    this.purchasePaymentDetail[i].invoice_Amount = this.purchasePaymentDetail[i].balance_Amount;
                    this.purchasePaymentDetail[i].selected = true;
                    pd = pd - this.purchasePaymentDetail[i].balance_Amount;
                    sum += this.purchasePaymentDetail[i].balance_Amount;
                  }
                }

              }

              this.paid = sum.toFixed(2);


              if (paid_Amount == this.paid && this.allowAvance == 0) {
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
                $("#submitUpdate").prop("disabled", false);
              }
              else {
                $("#submitAdd").prop("disabled", true);
                $("#submitAddMore").prop("disabled", true);
                $("#submitUpdate").prop("disabled", true);
              }
              if (paid_Amount > this.advanceAmount && this.allowAvanceAdjustment == 1) {
                $("#submitAdd").prop("disabled", true);
                $("#submitAddMore").prop("disabled", true);
                $("#submitUpdate").prop("disabled", true);
              }
              else {
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
                $("#submitUpdate").prop("disabled", false);
              }
            }

          }
          else {
            $("#submitAdd").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
            swal("Supplier Payment should be equal to invoice amount.");
          }
        }
      }
    }

  }
  //paidStatus
  paidStatus(paid_Amount) {

    if (this.allowAvancePayment == 1) {

      if (paid_Amount >= this.paid && paid_Amount > 0) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      }
      else {
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
        //  swal("Supplier Payment should be greather then total amount.");
      }
    }
    else {

      if (paid_Amount == this.paid && paid_Amount > 0) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      }
      else {
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
        // swal("Supplier Payment should be equal to invoice amount.");
      }
    }

  }
  //changeAllowStatus
  changeAllowStatus(allowAvance) {
    if (allowAvance == true) {
      this.allowAvance = true;
      this.allowAvanceAdjustment = false;
      this.adjust = 0;
    }
  }
  //changeAllowAdjustmentStatus
  changeAllowAdjustmentStatus(allowAvanceAdjustment) {
    if (allowAvanceAdjustment == true) {
      this.allowAvanceAdjustment = true;
      this.allowAvance = false;
      this.adjust = 1;
    }
  }
  //advanceStatus
  advanceStatus() {
    this.allowAvancePayment = sessionStorage.getItem('settingAllowAdvancePayment');
    if (this.allowAvancePayment == 1) {
      this.allowAvance = false;
      $("#lblAllow").show();
      $("#lblAllowPayment").show();
      $("#lblAllowPaymentAdjustment").show();
      $("#lblAdvanceAmount").show();
      $("#lblAdvanceAmounts").show();
    }
    else {
      this.allowAvance = false;
      $("#lblAllow").hide();
      $("#lblAllowPayment").hide();
      $("#lblAllowPaymentAdjustment").hide();
      $("#lblAdvanceAmount").hide();
      $("#lblAdvanceAmounts").hide();
    }
  }
  //changeInvoiceAmount
  changeInvoiceAmount(i: purchasePaymentDetails, invoice_Amount) {

    var selectedAmount = 0;
    for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
      this.chk = this.purchasePaymentDetail[i].selected;
      if (this.chk == true) {

        if (this.purchasePaymentDetail[i].invoice_Amount != 0) {

          if (this.purchasePaymentDetail[i].invoice_Amount <= this.purchasePaymentDetail[i].balance_Amount) {
            selectedAmount += (this.purchasePaymentDetail[i].invoice_Amount);

          }
          else {
            this.purchasePaymentDetail[i].invoice_Amount = this.purchasePaymentDetail[i].balance_Amount;
            selectedAmount += (this.purchasePaymentDetail[i].balance_Amount);
          }
        }
        else {
          this.purchasePaymentDetail[i].invoice_Amount = this.purchasePaymentDetail[i].balance_Amount;
          selectedAmount += (this.purchasePaymentDetail[i].balance_Amount);
        }
      }
    }


    this.adjustReturnAmount();
    this.paid = selectedAmount;
    this.paidStatus(this.paid_Amount);
    // this.paid_Amount = selectedAmount;
  }
  //IfExists
  IfExists(purchase_Payment_ID, supplier_ID, payment_Date) {

    this.service.IfExists(purchase_Payment_ID, supplier_ID, payment_Date)
      .subscribe(response => {
        this.paymentStatus = (response.json());
        //  console.log(response.json());
        this.status = this.paymentStatus[0].status;

        if (this.status == 1) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
          $("#cancelBtn").prop("disabled", false);
        }
      });
  }
  //getDetailsByID
  getDetailsByID(purchase_Payment_ID, payment_Date, supplier_ID, content) {
    this.detailOpen(content);
    this.ID = purchase_Payment_ID;
    this.mode = true;
    this.btnmode = false;
    this.IfExists(purchase_Payment_ID, supplier_ID, payment_Date);

    this.service.getDetailsByID(purchase_Payment_ID)
      .subscribe((o: Payment) => {
        console.clear();
        console.log(o);
        this.purchase_Payment_ID = o.purchase_Payment_ID;
        this.supplier_ID = o.supplier_ID;
        this.chequE_NO = o.chequeNo;
        this.voucher_ID = o.voucher_ID;
        this.remarks = o.remarks;
        this.chequE_NO = o.chequeNo;
        alert(o.refrence_No)
        this.reference_No=o.refrence_No;
        this.chequeDate.setDate(o.modifieD_DATE);
        this.allowAvance = o.advance;
        if (this.allowAvance) {

        }

        if (o.cancel == 1) {
          if (this.status != true) {
            $("#alertWarning").show();
            $("#cancelBtn").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
          }
        }
        if (o.return_Amount > 0) {
          $("#cancelBtn").prop("disabled", true);
        }

        this.payment_Date.setDate(o.payment_Date);
        //getPaymentMethods
        this.service.getPaymentMethods(this.supplier_ID)
          .subscribe(response => {
            this.getPaymentMethods = (response.json());
            this.method_ID = o.methodID;


            this.changePaymentMethod(o.methodID);

            //getBankAccounts
            this.service.getBankAccounts(o.methodID)
              .subscribe(response => {
                this.bankAccounts = (response.json());
                if (this.bankAccounts != null) {
                  this.accounT_NO = o.accountCode;
                  // this.changeAccountNo(this.accounT_NO);
                }
              });
          });

        this.paid_Amount = o.paid_Amount;
        //  this.paid = o.paid_Amount;

        //getCustomers
        this.service.getSuppliers(this.priviledged_Offices, this.ID, this.allowAvance, this.mode)
          .subscribe(response => {
            this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
            //    console.log(this.suppliers);
            this.changeContacts(o.supplier_ID);

          });
        this.getInvoiceDetails(o.supplier_ID, this.purchase_Payment_ID, this.mode);

        this.attachments = [];
        this.guid = o.pPGUID;
        this.getFiles(this.guid);
      });



    $("#cancelBtn").prop("disabled", true);
    $("#submitUpdate").prop("disabled", true);
    $("#paid_Amount").prop("disabled", true);

  }
  //cancelPayment
  cancelPayment() {
    swal({
      title: "Do you really want to cancel?",
      text: "Once cancelled, you will not be able to recover this payment!",
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
          swal("Poof! Your payment has been cancelled!", {
            icon: "success",
          });

          this.service.cancelPayment(this.purchase_Payment_ID, this.actionID)
            .subscribe(response => {
              this.cancelReturn = (response.json());
              this.searchPaymentDetails('');
              this.modalReference.close();
            });
        } else {
          swal("Your payment is safe!");
        }
      });
  }
  //savePayment
  savePayment(purchase_Payment_ID: any, payment_Date: any, payment_NO: any, office_Code: any,
    supplier_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, balance_Amount: any, paid_Amount: any, remarks: any, guid: any) {
    // this.isLoading = true;
    console.log(this.purchasePaymentDetail);

    if (this.method_ID != 1) {
      if (this.chequE_NO != null) {
      }
      else {
        this.isLoading = false;
        swal('Select Cheque')
        return;
      }
    }

    this.chequePayTo();
    var selectedAmount = 0;
    if (this.purchasePaymentDetail != null) {
      for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
        this.chk = this.purchasePaymentDetail[i].selected;
        if (this.chk == true) {
          if (this.returninvoiceFlag)
            this.purchasePaymentDetails.push(new purchasePaymentDetails(0, this.purchasePaymentDetail[i].purchase_Invoice_ID, 0, this.purchasePaymentDetail[i].adjusted, this.purchasePaymentDetail[i].returned, this.purchasePaymentDetail[i].type));
          else
            this.purchasePaymentDetails.push(new purchasePaymentDetails(0, this.purchasePaymentDetail[i].purchase_Invoice_ID, 0, this.purchasePaymentDetail[i].invoice_Amount, 0, this.purchasePaymentDetail[i].type));
        }
      }
    }
    console.log(this.purchasePaymentDetails);
    $("#submitAdd").prop("disabled", true);
    if (this.returninvoiceFlag)

      var payment = new Payment(purchase_Payment_ID, this.payment_Date.getDateFinal(), 0, this.userCurrentOffice,
        supplier_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, balance_Amount, paid_Amount, this.return_Amount, remarks, this.guid, this.method_ID, this.accounT_NO, this.chequE_NO, this.chequeDate.getDateFinal(), this.payto, 0, this.voucher_ID, this.logedInUserID, this.logedInUserID, this.allowAvance, this.adjust, this.purchasePaymentDetails,this.reference_No,);

    else

      var payment = new Payment(purchase_Payment_ID, this.payment_Date.getDateFinal(), 0, this.userCurrentOffice,
        supplier_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, balance_Amount, paid_Amount, 0.00, remarks, this.guid, this.method_ID, this.accounT_NO, this.chequE_NO, this.chequeDate.getDateFinal(), this.payto, 0, this.voucher_ID, this.logedInUserID, this.logedInUserID, this.allowAvance, this.adjust, this.purchasePaymentDetails,this.reference_No,);

    console.log(payment);
debugger
    this.service.guidExist(this.guid)
      .subscribe(response => {
        this.guidOrder = (response.json());

        if (this.guidOrder == false) {
          if (paid_Amount > 0) {
            if (this.allowAvancePayment == 1 && this.allowAvance == 1) {
              if (this.paid_Amount >= this.paid) {
                //  alert("Insert 1");
                this.service.savePayment(payment).then(
                  (response) => {
                    this.searchPaymentDetails('');
                    this.modalReference.close();
                    this.isLoading = false;
                    console.log(response);
                  },
                  (error) => {
                    console.log(error);
                  });
              }
              else {
                this.isLoading = false;
                swal("Supplier Payment should be greater then total amount.");
                $("#submitAdd").prop("disabled", false);
              }
            }
            //If Allow Advance Payment is false
            else {
              //If Allow Payment Invoice Wise is true
              if (this.settingPaymentInvoiceWise == 1 && this.allowAvance == 0) {
                if (paid_Amount > 0) {
                  if (this.paid_Amount == this.paid) {
                    //alert("Insert 2");
                    this.service.savePayment(payment).then(
                      (response) => {
                        this.searchPaymentDetails('');
                        this.modalReference.close();
                        this.isLoading = false;
                        console.log(response);
                      },
                      (error) => {
                        console.log(error);
                      });
                  }
                  else {
                    this.isLoading = false;
                    swal("Supplier Payment should be equal to invoice amount.");
                    $("#submitAdd").prop("disabled", false);
                  }
                }
                else {
                  this.isLoading = false;
                  swal("Supplier Payment should be greater then 0.");
                  $("#submitAdd").prop("disabled", false);
                }
              }
              //If Allow Payment Invoice Wise is false
              else {
                if (paid_Amount > 0) {
                  //alert("Insert 3");
                  this.service.savePayment(payment).then(
                    (response) => {
                      this.searchPaymentDetails('');
                      this.modalReference.close();
                      this.isLoading = false;
                      console.log(response);
                    },
                    (error) => {
                      console.log(error);
                    });
                }
                else {
                  this.isLoading = false;
                  swal("Supplier Payment should be greater then 0.");
                  $("#submitAdd").prop("disabled", false);
                }
              }
            }
          }
          else {
            this.isLoading = false;
            swal("Supplier Payment should be greater then 0.");
          }
        }
        else { swal("Error: Already exists."); }
      });
  }
  //updatePayment
  updatePayment(purchase_Payment_ID: any, payment_Date: any, payment_NO: any, office_Code: any,
    supplier_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, balance_Amount: any, paid_Amount: any, remarks: any, guid: any) {
    // this.purchasePaymentDetails = this.purchasePaymentDetail;
    /*
    var selectedAmount = 0;
    if (this.purchasePaymentDetail != null) {
      for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
        this.chk = this.purchasePaymentDetail[i].selected;
        if (this.chk == true) {
          if (this.ReturnAmountFlag)
            this.purchasePaymentDetails.push(new purchasePaymentDetails(0, this.purchasePaymentDetail[i].purchase_Invoice_ID, 0, this.purchasePaymentDetail[i].adjusted, this.purchasePaymentDetail[i].returned, this.purchasePaymentDetail[i].type));
          else
            this.purchasePaymentDetails.push(new purchasePaymentDetails(0, this.purchasePaymentDetail[i].purchase_Invoice_ID, 0, this.purchasePaymentDetail[i].invoice_Amount, 0, this.purchasePaymentDetail[i].type));


        }
      }
    }
    if (this.ReturnAmountFlag)
    var payment = new Payment(this.ID, this.payment_Date.getDateFinal(), 0, 1,
      supplier_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, balance_Amount, paid_Amount, this.return_Amount, remarks, this.guid, this.method_ID, this.accounT_NO, this.chequeNo, 0, this.voucher_ID, this.purchasePaymentDetails);
    else
      var payment = new Payment(this.ID, this.payment_Date.getDateFinal(), 0, 1,
        supplier_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, balance_Amount, paid_Amount, 0.00, remarks, this.guid, this.method_ID, this.accounT_NO, this.chequeNo, 0, this.voucher_ID, this.purchasePaymentDetails);

    console.log(payment);


    if (paid_Amount > 0) {
      //If Allow Advance Payment is true 
      if (this.allowAvancePayment == 1 && this.allowAvance == 1) {
        if (this.paid_Amount >= this.paid) {
          //  alert("Insert 1");
          this.service.updatePayment(payment).then(
            (response) => {
              this.paymentDetails();
              this.modalReference.close();
              console.log(response);
            },
            (error) => {
              console.log(error);
            });
        }
        else {
          swal("Supplier Payment should be greater then total amount.");
          $("#submitAdd").prop("disabled", false);
        }
      }
      //If Allow Advance Payment is false
      else {
        //If Allow Payment Invoice Wise is true
        if (this.settingPaymentInvoiceWise == 1 && this.allowAvance == 0) {
          if (paid_Amount > 0) {
            if (this.paid_Amount == this.paid) {
              //alert("Insert 2");
              this.service.updatePayment(payment).then(
                (response) => {
                  this.paymentDetails();
                  this.modalReference.close();
                  console.log(response);
                },
                (error) => {
                  console.log(error);
                });

            }
            else {
              swal("Supplier Payment should be equal to invoice amount.");
              $("#submitAdd").prop("disabled", false);
            }
          }
          else {
            swal("Supplier Payment should be greater then 0.");
            $("#submitAdd").prop("disabled", false);
          }
        }
        //If Allow Payment Invoice Wise is false
        else {
          if (paid_Amount > 0) {
            //alert("Insert 3");
            this.service.updatePayment(payment).then(
              (response) => {
                this.paymentDetails();
                this.modalReference.close();
                console.log(response);
              },
              (error) => {
                console.log(error);
              });

          }
          else {
            swal("Supplier Payment should be greater then 0.");
            $("#submitAdd").prop("disabled", false);
          }
        }

      }
    }
    else {
      swal("Supplier Payment should be greater then 0.");
    }
    */
  }
  //ngAfterViewChecked
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  //allowheckBoxStatus
  allowheckBoxStatus() {
    if (sessionStorage.getItem('AllowPaymentCheckBox') != "1")
      this.checkBoxStatus = false;
    else
      this.checkBoxStatus = true;
  }
  //scrollToBottom
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  // open modal
  open(content) {
    this.getCurrentDay();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.advanceStatus();
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#cancelBtn").hide();
    this.clearFields();
    this.guid = UUID.UUID();
    this.getSuppliers();
    this.paymentMethod();
    this.getBankAccounts();
    this.allowheckBoxStatus();
    //$("#txtCheque").hide();

  }
  // detailOpen modal
  detailOpen(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.advanceStatus();
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#submitUpdate").prop("disabled", false);
    $("#cancelBtn").show();
    this.clearFields();
    this.allowheckBoxStatus();

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
  // end of modal

  returninvoiceFlag: any = false;
  returnamountsum: any = 0;

  ReturnAmountFlag() {
    //  console.log('ReturnAmountFlag Start')
    var count = 0;
    if (this.purchasePaymentDetail != null) {
      for (let i = 0; i < this.purchasePaymentDetail.length; i++) {
        //console.log('for Start :: ReturnAmountFlag')

        if (this.purchasePaymentDetail[i].selected == 1 && this.purchasePaymentDetail[i].type == 1) {
          count++;
          break;
        }
      }
      // console.log('count :: ReturnAmountFlag', count)
      if (count > 0)
        this.returninvoiceFlag = true;
      else
        this.returninvoiceFlag = false;
      console.log('returninvoiceFlag :: ReturnAmountFlag', this.returninvoiceFlag)
      this.adjustReturnAmount();
    }
  }
  adjustReturnAmount() {
    var returnsum = 0;

    //Clear Unmarked AV RA
    for (let i = 0; i < this.purchasePaymentDetail.length; i++) {

      if (this.purchasePaymentDetail[i].selected != 1) {
        this.purchasePaymentDetail[i].adjusted = 0;
        this.purchasePaymentDetail[i].returned = 0;
      }
    }

    if (this.returninvoiceFlag) {

      //Return Invoice Amount Sum
      for (let i = 0; i < this.purchasePaymentDetail.length; i++) {

        if (this.purchasePaymentDetail[i].selected == 1 && this.purchasePaymentDetail[i].type == 1) {
          var value = this.purchasePaymentDetail[i].invoice_Amount;
          returnsum = returnsum + (value * (-1));
          //console.log('returnsum ', returnsum);
        }
      }

      this.return_Amount = returnsum;
      //Effect
      for (let i = 0; i < this.purchasePaymentDetail.length; i++) {

        if (this.purchasePaymentDetail[i].selected == 1 && this.purchasePaymentDetail[i].type == 0) {

          var amount = 0;
          amount = this.purchasePaymentDetail[i].invoice_Amount;
          console.log(returnsum >= amount, returnsum, amount)
          if (returnsum >= amount) {

            this.purchasePaymentDetail[i].adjusted = 0;
            this.purchasePaymentDetail[i].returned = this.purchasePaymentDetail[i].invoice_Amount;
            returnsum = returnsum - amount;
          }
          else {

            amount = amount - returnsum;
            this.purchasePaymentDetail[i].adjusted = amount;
            this.purchasePaymentDetail[i].returned = returnsum;
            returnsum = 0;
          }

        }

        if (this.purchasePaymentDetail[i].selected == 1 && this.purchasePaymentDetail[i].type == 1) {

          var amount = 0;
          amount = this.purchasePaymentDetail[i].invoice_Amount;
          this.purchasePaymentDetail[i].adjusted = -amount;

        }

      }


    }
    else {
      this.return_Amount = 0.00;
    }

    //alert(this.return_Amount);

  }

  ShowReturnAdjustmentColumn() {
    //if (sessionStorage.getItem('ShowReturnAdjustments') == '0') {
    //  this.ShowRA = "None";
    //}
    //else {
    //  this.ShowRA = "";
    //}
  }
  //--------------------------
  chequePayTo() {

    if (this.suppliers.length >= 1) {
      for (let i = 0; i < this.suppliers.length; i++)
        if (this.suppliers[i].id == this.supplier_ID) {
          this.payto = this.suppliers[i].text;

        }
    }


  }

  //-----------FILE ATTACHMENT----------//
  ShowAttachment: any = 'none';
  imageUrl: string = "../../../../assets/img/bill.png";
  fileToUpload: File = null;
  filename: any = '';
  attachments: any[] = [];
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    this.filename = this.fileToUpload.name;
    this.uploadFile();
    ////Show image preview
    //var reader = new FileReader();
    //reader.onload = (event: any) => {
    //  this.imageUrl = event.target.result;
    //}
    //reader.readAsDataURL(this.fileToUpload);

  }
  uploadFile() {
    if (this.fileToUpload != null) {
      this.isLoading = true;
      this.fileservice.postFile(this.guid, 6, this.filename, this.fileToUpload)
        .subscribe(data => {
          this.getFiles(this.guid);
        }

        );

    }
  }
  getFiles(ID) {
    this.fileservice.getFileAttachments(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.attachments = (response.json());
        }

      });
  }
  cancelFile(ID) {
    this.isLoading = true;
    this.fileservice.cancelFileAttachments(ID)
      .subscribe(response => {
        this.isLoading = false;
        console.log(response);
        this.attachments = [];
        this.getFiles(this.guid);
      });
  }
  getAttachmentByID(ID) {

    this.isLoading = true
    this.fileservice.getAttachmentByID(ID)
      .subscribe(response => {

        if (response.json()) {
          var list = response.json()
          var name = list[0].filename;

          if (name != "") {
            let pdf: any;
            this.fileservice.viewFile().subscribe(response => {

              pdf = response.text();
              this.isLoading = false;
              var iframe = "<iframe width='100%' height='100%' src='" + pdf + "'></iframe>"
              var x = window.open();
              x.document.open();
              x.document.write(iframe);
              x.document.close();

            });
          }

        }
        else {
          this.isLoading = false;
        }

      });
  }
}

