import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';

import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleInvoiceService, LoginService, DayEndService, EmailAlertService, customer, saleInvoice, saleInvoiceDetails, cDate, NgbDateFRParserFormatter, FileAttachmentService, PermissionUtility, SaleOrderService, SMSMessage, sendWhatsappMessage, SmsAlertService, CommonUtility } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Component({
  selector: 'sale-invoice',
  templateUrl: './sale-invoice.component.html',
  styleUrls: ['./sale-invoice.component.scss'],
  styles: [`:host >>> .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040; 
    }
  `],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SaleInvoiceComponent implements OnInit {
  public commonUtility: CommonUtility = new CommonUtility();

  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;

  ////////////////////////////////////////
  //Member Varialbes
  sms:SMSMessage;
  
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  customers: Array<Select2OptionData>;
  refCustomers: Array<Select2OptionData> = [];
  orders: any;
  invoices: any;
  orderDetails: any;
  priviledged_Offices: any = '';
  public customer_ID: any;
  public customer_Name: any;
  public refCustomerID: any = 0;
  public refCustomerName: any;
  PendingOrderListID: any = 0;
  sale_Order_ID: any;
  sale_Invoice_ID: any = 0;
  goods_Supply_ID: any = 0;
  total_Cost: any;
  total_Discount: any;
  freight_Chrgs: any = 0.00;
  total_Amount: any = 0.00;
  paidAmount: any = 0.00;
  balanceAmount: any = 0.00;
  remarks: any;
  item_Code: any;
  quantity: any = 0;
  discount_Rate: any = 0;
  mode: any = 0;
  btnmode: any = 0;
  Invoice: any;
  saleInvoiceDetails: any;
  guid: any;
  public invoice_Date = new cDate();
  public dayEndDate = new cDate();
  invoice_ID: any = "";
  isLoading: any = false;
  color = '#0094ff';
  closeResult: string;
  isView: any = true;
  showVoucher:any=true;
  DisablevoucherCheckBox:any=true;
  isStamp: any = false;
  hide = true;
  hideStock = true;
  hidePending = true;
  allowInvoice = false;
  stock_Qty: any = 0;
  pending: any = 0;
  ID: any = "";
  isTaxable: any;
  taxRate: any = 0;
  taxable: any;
  exchange: any = false;
  exch: any = false;
  cancelReturn: any;
  actionID: any = 5;
  dayEndDetail: any[] = [];
  specialDiscount: any = 0;
  DirectGDN: any = 0;
  payment: any = 0;
  guidOrder: boolean;
  status: any;
  pa: any = 0;
  chgPaid: any = false;
  areaenable: any = 0;
  areashow: any = 'none';
  area: any[] = [];
  areacode: any = 0;
  areaname: any = '';
  voucher_ID: any = 0;
  // End Member Varialbes

  alerts: Array<any> = [];
  companytemplate: any[] = [];
  templatecode: any = this.LoginService.getSession('DefaultCompanyTemplate');
  templatename: any = '';
  templateshow: any = '';
  reportName: any = '';
  isRPReport: any = false;
  sortOrder: any = 1;

  dateFlag: any = true;
  savemoreFlag: any = false;
  ShowSendEmail: any = 'none';
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  IsSaleTaxInv: boolean = false;

  taxrateList: any[] = [];
  taxratecode: any = 1;
  taxratename: any = '';
  taxrate: any = 0;
  taxcode: any = 1;
  discountEditing: any = true;
  refCustomerShow: any = '';
  type: any = "";
  contacts: any[] = [];
  unit: any = 0;
  unitList: any[] = [];
  unitList1: any[] = [];

  public permissionUtility: PermissionUtility = new PermissionUtility();
  constructor(
    public router: Router,
    private oservice: SaleOrderService,
    private smsService: SmsAlertService,
    private service: SaleInvoiceService,
    private fileservice: FileAttachmentService,
    private LoginService: LoginService,
    private DayEndService: DayEndService,
    private emailService: EmailAlertService,

    private modalService: NgbModal) {
    this.saleInvoiceDetails = new Array<saleInvoiceDetails>();
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

    this.getCurrentDay();
    this.searchSaleInvoices('');
    this.getAreaEnableStatus();
    this.getTaxRate();
    this.getUnit(0);
    this.permissionUtility.setPagePermissions(140005);
    this.permissionUtility.setPermissionItem1(140013);
    this.permissionUtility.setPermissionItem2(140050);
    this.logedInUserID = this.LoginService.getSession('user_ID');

    if (this.LoginService.getSession('AllowAttachmentSale') == '1')
      this.ShowAttachment = '';

    if (sessionStorage.getItem('AllowSend&EmailOnSCM') == "1")
      this.ShowSendEmail = '';

    if (this.LoginService.getSession('EnableRefCustomer') != '1')
      this.refCustomerShow = 'none';
    ////////////////////////Set Name From Session Storage///////////////////////////
  }
  //getCurrentDay
  getCurrentDay() {
    this.invoice_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
  }
  //checkTaxCode
  checkTaxCode() {
    if (this.taxcode != 1) {
      // this.IsSaleTaxInv = true;
      this.type = "Tax";
      $("#TaxRateDropDown").prop("disabled", false);
    }
    else {
      $("#TaxRateDropDown").prop("disabled", true);
      this.type = "Exempted";
      //this.IsSaleTaxInv = false;
      this.taxratecode = 1;
      this.taxrateList[0] = 1;

    }
    this.getCompanyTemplate();
  }
  //changeInvoiceDate
  changeInvoiceDate(invoice_Date) {
    if (this.invoice_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.invoice_Date.setDate(this.dayEndDate.getDateFinal());


    if (this.dateFlag == true) {
      this.customer_ID = 0;
      this.orders = [];
      this.saleInvoiceDetails = [];
      this.allowInvoice = true;
      this.setAreaEnableStatus();
      //this.isLoading =true;
      //this.service.getPendingOrder(this.userCurrentOffice, this.customer_ID, this.sale_Order_ID, this.goods_Supply_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
      //    .subscribe(response => {
      //        this.isLoading = false;
      //        this.orders = (response.json());
      //        if (this.orders != null) {
      //            this.PendingOrderListID = this.orders[0].id;
      //            this.sale_Order_ID = this.orders[0].sale_Order_ID;
      //            this.goods_Supply_ID = this.orders[0].goods_Supply_ID;
      //            var exchangeCheck = this.orders[0].exchange;
      //            if (exchangeCheck)
      //                this.exchanceStatus();
      //            else
      //                $("#ex").hide();

      //            this.changeOrder(this.PendingOrderListID);
      //        }

      //    });
    }
  }
  //searchSaleInvoices
  searchSaleInvoices(value: string) {
    this.isLoading = true;
    this.service.searchSaleInvoices(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json()!==null){
          this.isLoading = false;
          this.invoices = (response.json());
        }
        else{
          this.invoices = [];
          this.isLoading = false;
        }
        
      });
  }
  getUnit(mood)
  {
    if(mood == 0)
    {
      this.oservice.getUnits(mood).subscribe(response => {
        this.unitList1 = (response.json());
        
      });
    }
    else{
        this.oservice.getUnits(mood).subscribe(response => {
        this.unitList = (response.json());
        if(this.unitList!=null){
        this.unit = this.unitList[0].unitID;
        console.log(this.unitList);
        }
      });
    }
  }
  //clearValues
  clearFields() {
    //Member Varialbes
    this.customers = [];
    this.refCustomers = [];
    this.orders = [];
    this.orderDetails = [];
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.sale_Order_ID = 0
    this.refCustomerID = 0;
    this.sale_Invoice_ID = 0;
    this.goods_Supply_ID = 0;
    this.total_Cost = 0;
    this.total_Discount = 0;
    this.freight_Chrgs = 0.00;
    this.total_Amount = 0;
    this.pa = 0;
    this.paidAmount = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.quantity = 0;
    this.discount_Rate = 0;
    this.mode = false;
    this.btnmode = true;
    this.exchange = false;
    this.specialDiscount = 0;
    this.payment = 0;
    this.voucher_ID = 0;
    this.Invoice = [];
    this.saleInvoiceDetails = [];
    this.guid = UUID.UUID();
    $("#checkboxGDN").prop("disabled", false);
    $("#viewVoucherRDLC").hide();
    $("#viewRDLC1").hide();
    this.setAreaEnableStatus();
    this.getCompanyTemplate();

    if (this.LoginService.getSession('AllowVoucherOnInvoice') == '1') {
      this.showVoucher = true; 
      this.DisablevoucherCheckBox=true;
    }
    else {
      this.showVoucher = false; 
    }
  }
  //Total Cost
  TotalCost() {
    var total_Cost = 0;
    if (this.saleInvoiceDetails != null) {
      if (this.saleInvoiceDetails.length > 0) {
        for (var count = 0; count < this.saleInvoiceDetails.length; count++) {
          total_Cost += this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity;
        }
      }
    }

    return total_Cost.toFixed(2);
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0;
    if (this.saleInvoiceDetails != null) {
      if (this.saleInvoiceDetails.length > 0) {
        for (var count = 0; count < this.saleInvoiceDetails.length; count++) {
          total_Discount += ((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) * this.saleInvoiceDetails[count].discount_Rate / 100);
        }
      }
    }
    return total_Discount.toFixed(2);;
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0;
    if (this.saleInvoiceDetails != null) {
      if (this.saleInvoiceDetails.length > 0) {
        for (var count = 0; count < this.saleInvoiceDetails.length; count++) {
          total_Tax += ((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) - ((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) * this.saleInvoiceDetails[count].discount_Rate / 100)) / 100 * this.saleInvoiceDetails[count].tax_Rate;
        }
      }
    }
    if(total_Tax > 0.00)
              this.IsSaleTaxInv = true
            else
              this.IsSaleTaxInv = false
    return total_Tax.toFixed(2);
  }
  //Total Amount
  TotalAmount() {
    this.total_Amount = 0;
    if (this.saleInvoiceDetails != null) {
      if (this.saleInvoiceDetails.length > 0) {
        for (var count = 0; count < this.saleInvoiceDetails.length; count++) {
          this.total_Amount += (((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) - ((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) * this.saleInvoiceDetails[count].discount_Rate / 100)) + ((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) - ((this.saleInvoiceDetails[count].unit_Price * this.saleInvoiceDetails[count].quantity) * this.saleInvoiceDetails[count].discount_Rate / 100)) / 100 * this.saleInvoiceDetails[count].tax_Rate);
        }
        if (this.freight_Chrgs != "") {
          this.total_Amount += (parseFloat(this.freight_Chrgs) - parseFloat(this.specialDiscount));

          if (this.mode == false) {
            if (this.chgPaid == false)
              this.paidAmount = this.total_Amount.toFixed(2);
            else
              this.paidAmount = this.pa.toFixed(2);
            if (this.paidAmount <= this.total_Amount) { }
            else {


            }

            this.balanceAmount = this.total_Amount - this.paidAmount;
          }
        }
        else {
          this.total_Amount += (parseFloat("0") - parseFloat(this.specialDiscount));

          if (this.mode == false) {
            if (this.chgPaid == false)
              this.paidAmount = this.total_Amount.toFixed(2);
            else
              this.paidAmount = this.pa.toFixed(2);
            this.balanceAmount = this.total_Amount - this.paidAmount;
          }
        }
      }
    }
    this.total_Amount = this.total_Amount.toFixed(2);
    return this.total_Amount;
  }
  //getAreaEnableStatus
  getAreaEnableStatus() {
    if (this.LoginService.getSession('EnableAreaonSO') != '1') {
      this.areaenable = 0;

    }
    else {
      this.areaenable = 1;


    }
  }
  //setAreaEnableStatus
  setAreaEnableStatus() {
    this.areashow = 'none';
    if (this.areaenable != 1) {
      this.getPendingCustomer(0, this.mode);

    }
    else {
      this.getArea();
      this.areashow = '';

    }
  }
  //getArea 
  getArea() {
    this.isLoading = true;
    this.service.getArea()
      .subscribe(response => {
        this.area = (response.json());
        if (this.area != null) {
          if (sessionStorage.getItem("AreaID") != '') {
            this.areacode = sessionStorage.getItem("AreaID");
            // console.log('Area', this.areacode)
          }
          else {
            this.areacode = this.area[0].areacode;
            this.areaname = this.area[0].areaname;
          }
          this.getPendingCustomer(this.areacode, this.mode);
        }
      });
  }
  //getPendingCustomer
  getPendingCustomer(Area, mode) {
    this.isLoading = true;
    this.sale_Order_ID = 0;
    this.service.getPendingCustomer(Area, this.userCurrentOffice, this.sale_Order_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
      .subscribe(response => {
        this.isLoading = false;
        this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
        if (this.customers.length > 0) {
          if (sessionStorage.getItem("EnableEmptyRow") == '1' && this.savemoreFlag == false) {
            this.customer_ID = 0;
          }
          else {

            //getContacts
            this.service.getContacts(this.customer_ID)
              .subscribe(response => {
                if (response.json() != null) {
                  this.contacts = response.json();
                  console.log(response.json());
                  this.taxcode = this.contacts[0].taxcode;
                  this.checkTaxCode();
                }
              });



            if (this.LoginService.getSession('EnableRefCustomer') != '1') {
              this.refCustomerShow = 'none';
            } else {
              this.getRefCustomers(this.customer_ID);
            }
          }
          this.savemoreFlag = false;
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitAddMore").prop("disabled", true);
        }
      });

  }
  //changeCustomer
  changeCustomer(e: any) {
    this.orders = [];
    this.saleInvoiceDetails = [];
    if (this.mode == false && this.savemoreFlag == false) {
      this.allowInvoice = true;
      this.isLoading = true;
      this.service.getPendingOrder(this.userCurrentOffice, this.customer_ID, this.sale_Order_ID, this.goods_Supply_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
        .subscribe(response => {
          this.isLoading = false;
          this.orders = (response.json());
          if (this.orders != null) {
            this.PendingOrderListID = this.orders[0].id;
            this.sale_Order_ID = this.orders[0].sale_Order_ID;
            this.goods_Supply_ID = this.orders[0].goods_Supply_ID;
            
            if (this.LoginService.getSession('EnableRefCustomer') != '1') {
              this.refCustomerShow = 'none';
            } else {
              this.getRefCustomers(e);
            }
            var exchangeCheck = this.orders[0].exchange;
            if (exchangeCheck)
              this.exchanceStatus();
            else
              $("#ex").hide();
            this.changeOrder(this.PendingOrderListID);
          }
        });
    }
    this.customer_ID = e;
    
    //getContacts
    this.service.getContacts(this.customer_ID)
      .subscribe(response => {
        if (response.json() != null) {
          console.log(response.json());
          this.contacts = response.json();
          this.taxcode = this.contacts[0].taxcode;
          this.checkTaxCode();
        }
      });

  }
  //getRefCustomers
  getRefCustomers(customer_ID) {
    if (this.LoginService.getSession('EnableRefCustomer') != '1') {
      this.refCustomerShow = 'none';
    }
    else {
      this.service.getRefCustomers(customer_ID, this.sale_Order_ID)
        .subscribe(response => {
          if (response.json() != null) {
            $("#reflbl").show();
            $("#refddl").show();
            this.refCustomers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            this.refCustomerID = this.refCustomers[0].id;
          }
          else {
            $("#reflbl").hide();
            $("#refddl").hide();
            this.refCustomerID = 0;
          }
        });
    }

  }
  //changeRefCustomer
  changeRefCustomer(e: any) {
    this.refCustomerID = e;
  }
  //changeOrder
  changeOrder(ID) {
    if (this.orders != null) {
      for (let i = 0; i < this.orders.length; i++)
        if (this.orders[i].id == ID) {
          this.sale_Order_ID = this.orders[i].sale_Order_ID;
          this.goods_Supply_ID = this.orders[i].goods_Supply_ID;
        }
    }
    if (this.mode == false) {
      $("#submitAdd").prop("disabled", true);
      $("#submitAddMore").prop("disabled", true);
      this.IfExists(this.sale_Order_ID);
    }
  }
  //changeQuantity
  changeQuantity(i: saleInvoiceDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //changeDiscountRate
  changeDiscountRate(i: saleInvoiceDetails, discount_Rate) {
    if (discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (discount_Rate < 0) {
      i.discount_Rate = 0;
    }
    i.discount_Amount = (i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100;
  }
  //changeFreightChrgs
  changeFreightChrgs(freight_Chrgs) {
    if (freight_Chrgs <= 0) {
      this.freight_Chrgs = 0;
    }
  }
  //changeSpecialDiscount
  changeSpecialDiscount(specialDiscount) {
    if (specialDiscount <= 0) {
      this.specialDiscount = 0;
    }
    this.TotalAmount();
  }
  //changePaidAmount
  changePaidAmount(paidAmount) {
    this.chgPaid = true;
    this.pa = paidAmount;
    if (paidAmount <= 0) {
      this.paidAmount = 0;
    }
    if (paidAmount <= this.total_Amount) {
      $("#submitAdd").prop("disabled", false);
      $("#submitUpdate").prop("disabled", false);
      $("#submitAddMore").prop("disabled", false);
    }
    else {

      $("#submitAdd").prop("disabled", true);
      $("#submitUpdate").prop("disabled", true);
      $("#submitAddMore").prop("disabled", true);
      swal("Paid Amount must be equal to or less then Total Amount");
    }
    if (this.paidAmount > this.total_Amount)
      this.paidAmount = this.total_Amount;

    this.paidAmount = paidAmount;
    this.balanceAmount = this.total_Amount - this.paidAmount;
  }
  //changeStamp
  changeStamp(isStamp) {
    if (isStamp == true)
      this.isStamp = true;
    else
      this.isStamp = false;
  }
  forreport(id)
  {
    
    
    
      this.templateshow = '';
      this.isLoading = true;
      this.service.getCompanyTemplateForViewReport(id)
        .subscribe(response => {
          this.companytemplate = (response.json());
          this.templatecode = this.companytemplate[0].templatecode;
          this.isLoading = false;
          this.ID = id;
          this.onNavigate('/si-rpt-rdlc');
        });
    
  }
  
  onVoucherNavigate() { 

    sessionStorage.setItem('ID', this.voucher_ID);
     sessionStorage.setItem('ReportView', "1"); 
    sessionStorage.setItem('reportID', "1"); 
  window.open("/gv-rpt-rdlc", "_blank");
  
  }

  //onNavifate
  onNavigate(pth) {
    sessionStorage.setItem('IsOrder', '0');
    sessionStorage.setItem('ID', this.ID);
    sessionStorage.setItem('reportName', this.reportName);
    sessionStorage.setItem('ReportSave', "0");
    sessionStorage.setItem('SendingMedium', "0");
    sessionStorage.setItem('templatecode', '0');
    sessionStorage.setItem('isStamp', this.isStamp);
    sessionStorage.setItem('ReportView', "1");
    sessionStorage.setItem('reportID', "2");
    sessionStorage.setItem('exchange', "-1");
    sessionStorage.setItem('ReportParentType', "2");//SaleInvoiceEmail
    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }
    if (pth == "/si-rpt-excel") {
      sessionStorage.setItem('ReportView', "2");
      window.open(pth, "_blank");
    }
    else if (pth == "/si-rpt-mail") {
      sessionStorage.setItem('ReportSave', "1");
      sessionStorage.setItem('ReportID', this.ID);
      sessionStorage.setItem('SendingMedium', "1");
    }
    else {
      sessionStorage.setItem('ReportView', "1");
      window.open(pth, "_blank");
    }
  }
  //getCompanyTemplate
  getCompanyTemplate() {
    if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
      this.templateshow = 'none';
    }
    else {
      this.templateshow = '';
      this.isLoading = true;
      this.service.getCompanyTemplate(this.userCurrentOffice, 140005, this.IsSaleTaxInv)
        .subscribe(response => {
          this.companytemplate = (response.json());
          this.templatecode = this.companytemplate[0].templatecode;
          this.isLoading = false;
        });
    }

  }
  //cancelInvoice
  cancelInvoice() {
    swal({
      title: "Do you really want to cancel?",
      text: "Once cancelled, you will not be able to recover this invoice!",
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
          swal("Poof! Your invoice has been cancelled!", {
            icon: "success",
          });

          this.service.cancelInvoice(this.sale_Invoice_ID, this.actionID)
            .subscribe(response => {
              this.cancelReturn = (response.json());
              this.searchSaleInvoices('');
              this.modalReference.close();
            });
        } else {
          swal("Your invoice is safe!");
        }
      });
  }
  //saveMoreInvoice
  saveMoreInvoice(sale_Invoice_ID: any, invoice_Date: any, office_Code: any,
    customer_ID: any, sale_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, remarks: any) {


    if (this.saleInvoiceDetails.length > 0) {
      this.isLoading = true;
      if(this.showVoucher==true){
      var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice,this.IsSaleTaxInv,
        customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, this.paidAmount, this.balanceAmount, this.exchange, remarks, this.guid, this.DirectGDN, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);

      //if (this.paidAmount <= this.total_Amount) {
      $("#submitAddMore").prop("disabled", true);
      $("#submitAdd").prop("disabled", true);
      this.service.saveInvoice(invoice).then(
        (response) => {
          this.orders = [];
          this.saleInvoiceDetails = [];
          this.guid = UUID.UUID();
          this.isLoading = false;
          sessionStorage.setItem('AreaID', this.areacode);
          this.ID = response.sale_Invoice_ID;
          this.voucher_ID-response.voucher_ID
          if (this.isView == true) {
            if (this.templatecode.length == 0)
              this.templatecode = this.companytemplate[0].templatecode;

            this.onNavigate('/si-rpt-rdlc');
          }
          this.onVoucherNavigate();
          this.searchSaleInvoices('');
          $("#submitAddMore").prop("disabled", false);
          this.allowInvoice = true;
          this.isLoading = true;
          this.service.getPendingOrder(this.userCurrentOffice, customer_ID, this.sale_Order_ID, this.goods_Supply_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
            .subscribe(response => {
              this.isLoading = false;
              this.orders = (response.json());
              if (this.orders != null) {
                this.sale_Order_ID = this.orders[0].sale_Order_ID;
                var exchangeCheck = this.orders[0].exchange;
                if (exchangeCheck)
                  this.exchanceStatus();
                else
                  $("#ex").hide();

                  this.sendMessage(this.sale_Invoice_ID,customer_ID,total_Amount);

        
                this.changeOrder(0);

              }
              else {
                this.savemoreFlag = true;
                this.taxFields();
                this.stockField();
                this.pendingField();
                this.disableDiscountEditing();
                this.invoiceBeforeGDN();
                this.GDNStatus();
                $("#cancelBtn").hide();
                this.clearFields();
                this.rdlcStatus();
                this.invoiceWithReceipt();
              }
            });
          //  $("#paidAmount").focus();

          console.log(response);
        },
        (error) => { 
          //console.log(error);
          this.isLoading = false;
          this.commonUtility.handleError(error);
        
        })
      }
      else{
        var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice,this.IsSaleTaxInv,
        customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, this.paidAmount, this.balanceAmount, this.exchange, remarks, this.guid, this.DirectGDN, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);

      //if (this.paidAmount <= this.total_Amount) {
      $("#submitAddMore").prop("disabled", true);
      $("#submitAdd").prop("disabled", true);
      this.service.saveInvoice(invoice).then(
        (response) => {
          this.orders = [];
          this.saleInvoiceDetails = [];
          this.guid = UUID.UUID();
          this.isLoading = false;
          sessionStorage.setItem('AreaID', this.areacode);
          this.ID = response.sale_Invoice_ID; 
          if (this.isView == true) {
            if (this.templatecode.length == 0)
              this.templatecode = this.companytemplate[0].templatecode;

            this.onNavigate('/si-rpt-rdlc');
          } 
          this.searchSaleInvoices('');
          $("#submitAddMore").prop("disabled", false);
          this.allowInvoice = true;
          this.isLoading = true;
          this.service.getPendingOrder(this.userCurrentOffice, customer_ID, this.sale_Order_ID, this.goods_Supply_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
            .subscribe(response => {
              this.isLoading = false;
              this.orders = (response.json());
              if (this.orders != null) {
                this.sale_Order_ID = this.orders[0].sale_Order_ID;
                var exchangeCheck = this.orders[0].exchange;
                if (exchangeCheck)
                  this.exchanceStatus();
                else
                  $("#ex").hide();

                  this.sendMessage(this.sale_Invoice_ID,customer_ID,total_Amount);

        
                this.changeOrder(0);

              }
              else {
                this.savemoreFlag = true;
                this.taxFields();
                this.stockField();
                this.pendingField();
                this.disableDiscountEditing();
                this.invoiceBeforeGDN();
                this.GDNStatus();
                $("#cancelBtn").hide();
                this.clearFields();
                this.rdlcStatus();
                this.invoiceWithReceipt();
              }
            });
          //  $("#paidAmount").focus();

          console.log(response);
        },
        (error) => { 
          //console.log(error);
          this.isLoading = false;
          this.commonUtility.handleError(error);
        
        })
      }
    }
    else {
      swal("Order is Required");
    }
    //}
    //else {
    //  this.isLoading = false;
    //  $("#submitAdd").prop("disabled", true);
    //  $("#submitUpdate").prop("disabled", true);
    //  $("#submitAddMore").prop("disabled", true);
    //  swal("Paid Amount must be equal to or less then Total Amount");
    //}
  }

  sendMessage(ID:any,customer_ID:any,total_Amount:any){
   
    this.oservice.getCustomerNo(customer_ID)
    .subscribe(response => {
      this.isLoading = false;

      var list = response.json();

      let CustomerName = list[0].name;

       let message='Mr./Mrs. ' + CustomerName + ' Your Invoice # ' +  ID + ' of Rs. ' +  total_Amount + ' has been issued.';
      let CustomerCell = list[0].cell;

      if (CustomerCell != null) {
        if (CustomerCell.length > 0){
        if (sessionStorage.getItem('EnableWhatsappMessage') == '1') {
          sendWhatsappMessage(CustomerCell, message);
        }

        if (sessionStorage.getItem('SendSmsNotification') == '1') {
         
          
          if( CustomerCell.charAt( 0 ) === '0' )
               CustomerCell  = CustomerCell.slice(1);

               let no ='92'+CustomerCell

        
          this.sms=new SMSMessage(0,CustomerName,total_Amount,140005,no,0, this.logedInUserID);
          
          this.smsService.sendSms(this.sms).then(r=>{
               console.log('Message Status:'+this.sms.result);
          });
          
        }
      }

      }
    }
    );
  }

  sataxinvoice = [
    { "ID": false, "text": "No" }
  , { "ID": true, "text": "Yes" }

]
  //saveOrderAndMail
  saveInvoiceAndMail(content, sale_Invoice_ID: any, invoice_Date: any, office_Code: any,
    customer_ID: any, sale_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, remarks: any) {

    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    $("#submitAddMail").prop("disabled", true);

    if (this.customer_ID > 0) {
      if (this.paidAmount <= this.total_Amount) {

        $("#submitAddMore").hide();
        $("#submitAdd").hide();
        $("#submitAddMail").hide();


        this.isLoading = true;
        var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice,this.IsSaleTaxInv,
          customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
          freight_Chrgs, total_Amount, this.paidAmount, this.balanceAmount, this.exchange, remarks, this.guid, this.DirectGDN, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);

        this.service.saveInvoice(invoice).then(
          (response) => {
            this.ID = response;
            sessionStorage.setItem('ID', this.ID);
            sessionStorage.setItem('exchange', "-1");
            sessionStorage.setItem('AreaID', this.areacode);
            //if (this.isView == true) {
            this.onNavigate('/si-rpt-mail');
            this.isLoading = true;
            this.service.getCustomerEmail(customer_ID)
              .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                  var list = response.json();
                  this.sendParentID = this.ID;
                  this.sendCustomerName = list[0].name;
                  this.sendCustomerEmail = list[0].email;
                  this.sendCustomerBody = 'Please Type Some Text!';
                  this.isLoading = true;
                  this.openSendMail(content);
                  this.searchSaleInvoices('');
                  $("#submitAddMore").prop("disabled", false);

                  this.allowStamp();
                  this.taxFields();
                  this.stockField();
                  this.pendingField();
                  this.disableDiscountEditing();
                  this.invoiceBeforeGDN();
                  this.GDNStatus();
                  this.clearFields();
                  this.rdlcStatus();
                  this.invoiceWithReceipt();
                  this.mode = true;
                }
              });

            console.log(response);
          },

          (error) => { 
            //console.log(error);
            this.isLoading = false;
            this.commonUtility.handleError(error);
          
          })
      }
      else {
        swal("Order should be greater then 0");
        $("#submitAdd").prop("disabled", false);
        $("#submitAddMore").prop("disabled", false);
        $("#submitAddMail").prop("disabled", false);
      }
    } else {
      swal('Select Customer!');
      $("#submitAdd").prop("disabled", false);
      $("#submitAddMore").prop("disabled", false);
      $("#submitAddMail").prop("disabled", false);
    }
  }
  //saveInvoice
  saveInvoice(sale_Invoice_ID: any, invoice_Date: any, office_Code: any,
    customer_ID: any, sale_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, remarks: any) {
    if (this.saleInvoiceDetails.length > 0) {
      this.isLoading = true;
      if (sessionStorage.getItem('AllowInvoiceWithReceipt') != "1") {
        this.paidAmount = 0;
      }
     if(this.showVoucher == true){
      var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice, this.IsSaleTaxInv,
        customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, this.paidAmount, this.balanceAmount, this.exchange, remarks, this.guid, this.DirectGDN, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);
      //if (this.paidAmount <= this.total_Amount) {   
      $("#submitAdd").prop("disabled", true);
      $("#submitAddMore").prop("disabled", true);
      this.service.saveInvoice(invoice).then(
        (response) => { 
          console.clear();
          console.log(response);
          this.isLoading = false;
          sessionStorage.setItem('AreaID', this.areacode);
          //alert(response.sale_Invoice_ID);
          this.ID = response.sale_Invoice_ID;
          if (this.isView == true) {
            this.onNavigate('/si-rpt-rdlc');
          }  
          this.sendMessage(this.sale_Invoice_ID,customer_ID,total_Amount); 
          this.searchSaleInvoices('');
          this.modalReference.close();
          //alert(response.voucher_ID);
          this.voucher_ID=response.voucher_ID;
          this.onVoucherNavigate();
          console.log(response);
        },
        (error) => { 
          //console.log(error);
          this.isLoading = false;
          this.commonUtility.handleError(error);
        
        })
      }
      else{
        var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice,this.IsSaleTaxInv,
        customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
        freight_Chrgs, total_Amount, this.paidAmount, this.balanceAmount, this.exchange, remarks, this.guid, this.DirectGDN, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);
      //if (this.paidAmount <= this.total_Amount) {   
      $("#submitAdd").prop("disabled", true);
      $("#submitAddMore").prop("disabled", true);
      this.service.saveInvoice(invoice).then(
        (response) => {
          this.isLoading = false;
          sessionStorage.setItem('AreaID', this.areacode);
          this.ID = response.sale_Invoice_ID;
          if (this.isView == true) {
            this.onNavigate('/si-rpt-rdlc');
          }  
          this.sendMessage(this.sale_Invoice_ID,customer_ID,total_Amount); 
          this.searchSaleInvoices('');
          this.modalReference.close();
          console.log(response);
        },
        (error) => { 
          //console.log(error);
          this.isLoading = false;
          this.commonUtility.handleError(error);
        
        })
      }
    }
    else {
      swal("Order is Required");
    }
    //}
    //else {
    //  $("#submitAdd").prop("disabled", true);
    //  $("#submitUpdate").prop("disabled", true);
    //  $("#submitAddMore").prop("disabled", true);
    //  console.log((this.paidAmount+1) + (this.total_Amount+1));
    //  swal("Paid Amount must be equal to or less then Total Amount");
    //}

  }
  //updateInvoice
  updateInvoice(sale_Invoice_ID: any, invoice_Date: any, office_Code: any,
    customer_ID: any, sale_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, remarks: any) {

    if(this.showVoucher==true){
    var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice,this.IsSaleTaxInv,
      customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, this.total_Amount, 0, this.balanceAmount, this.exchange, remarks, this.guid, false, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);
    // console.log(invoice);
    this.service.updateInvoice(invoice).then(
      (response) => {
        this.ID=response.sale_Invoice_ID;
        this.voucher_ID=response.voucher_ID;
        if (this.isView == true) {
          this.onNavigate('/si-rpt-rdlc');
        }
        this.onVoucherNavigate();
        this.searchSaleInvoices('');
        this.modalReference.close(); console.log(response);
      },
      (error) => console.log(error))
    }
    else{
      var invoice = new saleInvoice(sale_Invoice_ID, this.invoice_Date.getDateFinal(), this.userCurrentOffice,this.IsSaleTaxInv,
      customer_ID, sale_Order_ID, this.goods_Supply_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, this.total_Amount, 0, this.balanceAmount, this.exchange, remarks, this.guid, false, 0, this.specialDiscount, this.logedInUserID, this.UserSessionID, this.templatecode, this.voucher_ID, this.userCurrentWarehouse, this.refCustomerID, this.saleInvoiceDetails);
    // console.log(invoice);
    this.service.updateInvoice(invoice).then(
      (response) => {
        this.ID=response.sale_Invoice_ID; 
        if (this.isView == true) {
          this.onNavigate('/si-rpt-rdlc');
        }
        this.searchSaleInvoices('');
        this.modalReference.close(); console.log(response);
      },
      (error) => { 
        //console.log(error);
        this.isLoading = false;
        this.commonUtility.handleError(error);
      
      })
    }
    // this.ClearFields();
  }
  getUnitName(id)
  {
    return this.unitList1.filter(f=>f.unitID == id)[0].unit;
  }
  //getInvoiceDetailsByID 
  getInvoiceDetailsByID(sale_Invoice_ID, content, op) {
    
    this.detailOpen(content);
    this.allowInvoice = false;
    this.mode = true;
    this.btnmode = false;
    this.isLoading = true;
    this.IfPaymentExists(sale_Invoice_ID);
    this.service.getInvoiceDetailsByID(sale_Invoice_ID)
      .subscribe((o: saleInvoice) => {
        console.clear();
        console.log(o);
        this.isLoading = false;
        
        this.ID = sale_Invoice_ID;
        this.sale_Order_ID = o.sale_Order_ID;
        this.sale_Invoice_ID = o.sale_Invoice_ID;
        this.goods_Supply_ID = o.goods_Supply_ID;
        this.invoice_Date.setDate(o.invoice_Date);
        this.remarks = o.remarks;
        this.voucher_ID = o.voucher_ID;
        this.saleInvoiceDetails = o.saleInvoiceDetails;
        this.freight_Chrgs = o.freight_Chrgs;
        this.paidAmount = o.paidAmount;
        this.balanceAmount = o.balanceAmount;
        this.specialDiscount = o.specialDiscount;
        this.total_Amount = o.total_Amount;
        var exchangeCheck = o.exchange;
        this.exchange = o.exchange;
        this.customer_ID = o.customer_ID;
        this.refCustomerID = o.refCustomerID;
        this.IsSaleTaxInv = o.isSaleTaxInv;

        if (exchangeCheck)
          this.exchanceStatus();
        else
          $("#ex").hide();

        $("#checkboxGDN").prop("disabled", true);

        sessionStorage.setItem('reportID', "2");
        sessionStorage.setItem('ID', this.sale_Invoice_ID);
        sessionStorage.setItem('exchange', "-1");

        if (o.cancel == 1) {
          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
        //Set PendingCustomer
        this.isLoading = true;
        this.service.getPendingCustomer(0, this.userCurrentOffice, o.customer_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
          .subscribe(response => {
            this.isLoading = false;
            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            this.customer_ID = o.customer_ID;
            //alert(o.customer_ID);
            var customlist = response.json();



            if (this.areaenable != 1) { }
            else {
              this.areashow = '';

              this.service.getArea()
                .subscribe(response => {

                  this.area = (response.json());
                  if (customlist != null) {
                    var cust = customlist.filter(item => item.customer_ID == this.customer_ID)[0];
                    this.areacode = cust.areaID;
                  }

                });
            }
            this.isLoading = true;
            this.service.getPendingOrder(this.userCurrentOffice, this.customer_ID, this.sale_Order_ID, this.goods_Supply_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
              .subscribe(response => {
                this.isLoading = false;
                this.orders = (response.json());
                if (this.orders != null) {
                  this.PendingOrderListID = this.orders[0].id;
                  this.sale_Order_ID = this.orders[0].sale_Order_ID;

                  this.service.IfVoucherExists(this.voucher_ID)
                    .subscribe(response => {
                      this.status = (response.json());
                      if (this.status == true) {
                        $("#alertWarning").show();
                        this.alerts = []
                        this.alerts.push(
                          {
                            id: 4,
                            type: 'danger',
                            message: 'Record is not updatable since its voucher approved/posted...',
                          });
                      }

                      this.service.IfExists(this.sale_Order_ID)
                        .subscribe(response => {

                          this.status = (response.json());
                          //this.allowInvoice = true;
                   
                          $("#checkboxGDN").prop("disabled", false);
                          if (this.status == true) {

                            this.allowInvoice = true;
                        
                            $("#checkboxGDN").prop("disabled", true);
                          }
                          else {
                            //this.DirectGDN = 1;
                          }


                          if (sessionStorage.getItem('settingGDNonInvoice') != "1")
                            $("#showGDN").hide();
                          else
                            $("#showGDN").show();



                          this.service.getPendingOrderDetails(this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.sale_Order_ID, this.sale_Invoice_ID, this.goods_Supply_ID, this.mode, this.allowInvoice)
                            .subscribe(response => {
                              this.saleInvoiceDetails = [];

                              if (response.json() != null) {
                                this.saleInvoiceDetails = (response.json());


                              }

                            });

                        });

                    });
                }

              });
          });

        if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
          this.templateshow = 'none';
        }
        else {
          this.templateshow = '';
          this.getCompanyTemplate();
          this.templatecode = o.template_ID;
        }

        this.attachments = [];
        this.guid = o.sIGUID;
        this.getFiles(this.guid);
        this.IfVoucherExists(this.voucher_ID);

        if (this.LoginService.getSession('EnableRefCustomer') != '1') {
          this.refCustomerShow = 'none';
        } else {
          this.service.getRefCustomers(this.customer_ID, this.sale_Order_ID)
            .subscribe(response => {
              if (response.json() != null) {
                $("#reflbl").show();
                $("#refddl").show();
                this.refCustomers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
                for (let i = 0; i < this.refCustomers.length; i++) {
                  if (this.refCustomers[i].id == o.refCustomerID) {
                    this.refCustomerID = this.refCustomers[i].id;
                  }
                }
              }
              else {
                $("#reflbl").hide();
                $("#refddl").hide();
                this.refCustomerID = 0;
              }
            });
        }
      });
  }
  //changeGDN
  changeGDN(allowInvoice) {
    if (allowInvoice == false)
      this.DirectGDN = 0;
    else {
      this.DirectGDN = 1;

    }
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {

      if (!this.mode && this.savemoreFlag == false)
        
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
  //exchanceStatus
  exchanceStatus() {

    if (sessionStorage.getItem('AllowExchange') != "1")
      $("#ex").hide();
    else {
      $("#exchange").prop("disabled", true);
      $("#ex").show();
    }
  }
  //GDNStatus
  GDNStatus() {
    if (sessionStorage.getItem('settingGDNonInvoice') != "1")
      $("#showGDN").hide();
    else
      $("#showGDN").show();

    if (this.allowInvoice == true)
      this.DirectGDN = 1;
    else
      this.DirectGDN = 0;
    //alert(this.DirectGDN +" GDNStatus() ")
  }
  //taxFields
  taxFields() {
    if (this.LoginService.getSession('settingTaxOnSale') != '1') {
      this.hide = false;
      this.isTaxable = 0;
      this.taxRate = 0;
      //  this.IsSaleTaxInv = false;
      $("#lblTotalTax").hide();

    }
    else {
      this.hide = true;
      this.isTaxable = this.LoginService.getSession('isTaxable');
      this.taxRate = this.LoginService.getSession('taxRate');
      // this.IsSaleTaxInv = true;
      $("#lblTotalTax").show();

    }
  }
  //stockField
  stockField() {
    if (sessionStorage.getItem('settingShowStock') != "1")
      this.hideStock = false;
    else
      this.hideStock = true;
  }
  //pendingField
  pendingField() {
    if (sessionStorage.getItem('settingShowPending') != "1")
      this.hidePending = false;
    else
      this.hidePending = true;
  }
  //disableDiscountEditing
  disableDiscountEditing() {
    if (sessionStorage.getItem('EnableSaleDiscountEditing') != "1") {
      this.discountEditing = false;
    }
    else {
      this.discountEditing = true;
    }

  }
  getCustomers()
  {
    this.service.getCustomers()
    .subscribe(response => {
    this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
    this.customer_ID = this.customers[0].id;
    })
  }
  //invoiceBeforeGDN
  invoiceBeforeGDN() {
    if (sessionStorage.getItem('settingInvoiceBeforeGDN') != "1")
      this.allowInvoice = false;
    else
      this.allowInvoice = true;

  }
  //rdlcStatus
  rdlcStatus() {
    if (sessionStorage.getItem('settingInvoiceReports') != "1") {
      this.isView = false;
    }
    else {
      this.isView = true;
    }
  }
  //invoiceWithReceipt
  invoiceWithReceipt() {
    if (sessionStorage.getItem('AllowInvoiceWithReceipt') != "1") {
      $("#payment").hide();
      this.paidAmount = 0;
    }
    else {
      $("#payment").show();
    }
  }
  //IfPaymentExists
  IfPaymentExists(sale_Invoice_ID) {
    this.service.IfPaymentExists(sale_Invoice_ID)
      .subscribe(response => {

        this.status = (response.json());
        if (this.status == true) {
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
  //IfVoucherExists
  IfVoucherExists(voucher_ID) {
    this.service.IfVoucherExists(this.voucher_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
          this.alerts = []
          this.alerts.push(
            {
              id: 4,
              type: 'danger',
              message: 'Record is not updatable since its voucher approved/posted...',
            });
        }

      });
  }
  //IfExists
  IfExists(sale_Order_ID) {
    this.isLoading = true;
    this.service.IfVoucherExists(this.voucher_ID)
      .subscribe(response => {
        this.status = (response.json());

        if (this.status == true) {
          $("#alertWarning").show();
          this.alerts = []
          this.alerts.push(
            {
              id: 4,
              type: 'danger',
              message: 'Record is not updatable since its voucher approved/posted...',
            });
        }

        else {

          this.service.IfExists(sale_Order_ID)
            .subscribe(response => {
              this.isLoading = false;
              this.status = (response.json());
              this.allowInvoice = true;
            
              $("#checkboxGDN").prop("disabled", false);

              if (this.status == true) {
                this.DirectGDN = 0;
                this.allowInvoice = false;
               
                $("#checkboxGDN").prop("disabled", true);
              }
              else {
                this.DirectGDN = 1;
              }

              if (sessionStorage.getItem('settingGDNonInvoice') != "1")
                $("#showGDN").hide();
              else
                $("#showGDN").show();


              this.isLoading = true;
              this.service.getPendingOrderDetails(this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, sale_Order_ID, this.sale_Invoice_ID, this.goods_Supply_ID, this.mode, this.allowInvoice)
                .subscribe(response => {
                  this.saleInvoiceDetails = [];
                  if (this.customer_ID == 0 && this.btnmode == true && sessionStorage.getItem("EnableEmptyRow")) {
                    this.orders = [];
                  }
                  else {

                    if (response.json() != null) {
                      this.saleInvoiceDetails = (response.json());
                      this.freight_Chrgs = this.saleInvoiceDetails[0].freight_Chrgs;
                      this.specialDiscount = this.saleInvoiceDetails[0].specialDiscount;
                      this.exchange = this.saleInvoiceDetails[0].exchange;
                      this.TotalAmount();
                      $("#submitAdd").prop("disabled", false);
                      $("#submitAddMore").prop("disabled", false);
                    }

                  }
                  this.isLoading = false;
                  this.dateFlag = true;
                });

            });
        }
      });

  }
  //allowStamp
  allowStamp() {
    if (sessionStorage.getItem('AllowStamp') != "1") {
      $("#viewStamp").hide();
    }
    else {
      $("#viewStamp").show();
    }
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
    //  $("#paidAmount").focus();
    $("#submitAdd").show();
    $("#submitAddMore").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    $("#viewRDLC").prop("disabled", true);
    $("#viewExcel").prop("disabled", true);
    $("#ex").hide();
    this.allowStamp();
    this.taxFields();
    this.stockField();
    this.pendingField();
    this.disableDiscountEditing();
    this.invoiceBeforeGDN();
    this.GDNStatus();
    $("#cancelBtn").hide();
    this.clearFields();
    this.rdlcStatus();
    this.invoiceWithReceipt();
    $("#viewIcon").css("display", "none");
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
    // $("#paidAmount").focus();
    $("#submitAdd").hide();
    $("#submitAddMore").hide();
    $("#submitUpdate").show();
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    $("#ex").hide();
    //$("#viewBtn").hide();
    this.allowStamp();
    this.taxFields();
    this.stockField();
    this.pendingField();
    this.disableDiscountEditing();
    this.invoiceBeforeGDN();
    this.GDNStatus();
    this.getCustomers();
    //this.rdlcStatus();
    this.invoiceWithReceipt();
    $("#cancelBtn").show();
  }
  //getDismissReasons
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

  }
  uploadFile() {
    if (this.fileToUpload != null) {
      this.isLoading = true;
      this.fileservice.postFile(this.guid, 2, this.filename, this.fileToUpload)
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
  routeInvoice(value) {
    if (value == 1)
      this.router.navigate(['/sale-invoice-day']);
    else
      this.router.navigate(['/retail-invoice']);
  }
  modalReferenceMail: NgbModalRef;
  sendParentID: any = '';
  sendCustomerName: any = '';
  sendCustomerEmail: any = '';
  sendCustomerBody: any = '';
  openSendMail(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, size: 'custom', windowClass: 'my-modal'
    };

    this.modalReferenceMail = this.modalService.open(content, { size: 'custom' });
    this.modalReferenceMail.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.isLoading = false;

  }
  SendMail(ParentID) {
    if (this.CheckMailMandatoryFields() == true) {
      this.isLoading = true;
      this.emailService.sendReportMail(this.sendParentID, 2, this.sendCustomerEmail, this.sendCustomerBody)
        .subscribe(response => {
          this.isLoading = false;
          console.log(response);
          this.modalReferenceMail.close();

        });
    }
  }
  CheckMailMandatoryFields() {
    if (this.sendParentID != '') {
      if (this.sendCustomerName != '') {
        if (this.sendCustomerEmail != '') {
          return true;
        }
        else {
          swal('Please Enter Email Address!')
          return false;
        }
      }
      else {
        swal('Please Enter Name!')
        return false;
      }
    }
    else {
      return false;
    }
  }
  getTaxRate() {
    this.isLoading = true;
    this.service.getTaxRates()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.taxrateList = (response.json());
          this.taxratecode = this.taxrateList[0].taxratecode;
        }
      });

  }
}

