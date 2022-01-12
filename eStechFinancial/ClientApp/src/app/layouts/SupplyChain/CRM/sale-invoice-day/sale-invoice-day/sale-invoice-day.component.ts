import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleInvoiceDayWiseService, LoginService, DayEndService, customer, saleInvoice, saleInvoiceDetails, cDate, NgbDateFRParserFormatter, FileAttachmentService } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';
@Component({
  selector: 'sale-invoice-day',
  templateUrl: './sale-invoice-day.component.html',
  styleUrls: ['./sale-invoice-day.component.scss'],
  styles: [`
    :host >>> .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040; 
    }
  `],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SaleInvoiceDayWiseComponent implements OnInit {
  ////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  ////////////////////////////////////////
  //Member Varialbes
  p: number = 1;
  a: number = 1;
  modalReference: NgbModalRef;
  customers: Array<Select2OptionData>;
  orders: any;
  invoices: any;
  orderDetails: any;
  priviledged_Offices: any = 1;
  public customer_ID: any;
  public customer_Name: any;
  sale_Order_ID: any;
  sale_Invoice_ID: any = 0;
  total_Cost: any;
  total_Discount: any;
  freight_Chrgs: any = 0.00;
  total_Amount: any;
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
  // End Member Varialbes


  alerts: Array<any> = [];
  companytemplate: any[] = [];
  templatecode: any = this.LoginService.getSession('DefaultCompanyTemplate');
  templatename: any = '';
  templateshow: any = '';
  reportName: any = '';
  isRPReport: any = false;
  sortOrder: any = 1;
  selectedAll: any;
  increment: any = 0;
  dateFlag: any = false;
  savemoreFlag: any = false;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  constructor(public router: Router, private service: SaleInvoiceDayWiseService, private fileservice: FileAttachmentService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.saleInvoiceDetails = new Array<saleInvoiceDetails>();

    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
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
    //this.getInvoices();
    this.getAreaEnableStatus();
    if (this.LoginService.getSession('AllowAttachmentSale') == '1')
      this.ShowAttachment = '';
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 140013) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;
          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };
          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].userSessionID;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());    
    this.invoice_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
        $("#myInput").click();
      //});
  }
  //getCompanyTemplate
  getCompanyTemplate() {
    if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
      this.templateshow = 'none';
    }
    else {
      this.templateshow = '';
      //this.isLoading =true;
      this.service.getCompanyTemplate(this.userCurrentOffice)
        .subscribe(response => {
          this.companytemplate = (response.json());

          //this.templatecode = this.companytemplate[0].templatecode;
          //this.templatename = this.companytemplate[0].templatename;
          //this.reportName = this.companytemplate[0].reportName;
          //this.isRPReport = this.companytemplate[0].isRPReport;
          //this.sortOrder = this.companytemplate[0].sortOrder;
          console.log(response.json());
          //this.isLoading = false;
        });
    }

  }
  //changeInvoiceDate
  changeInvoiceDate(invoice_Date) {
    //if (this.invoice_Date.getDateFinal() < this.dayEndDate.getDateFinal())
    //  this.invoice_Date.setDate(this.dayEndDate.getDateFinal());

    //if (this.dateFlag == true) {
    //  //alert('here');
    //  this.customer_ID = 0;
    //  this.orders = [];
    //  this.saleInvoiceDetails = [];
    //  this.allowInvoice = true;
    //  this.isLoading =true;
    //  this.service.getPendingOrder(this.priviledged_Offices, this.customer_ID, this.sale_Order_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
    //    .subscribe(response => {
    //      this.isLoading = false;
    //      this.orders = (response.json());
    //      if (this.orders != null) {
    //        this.sale_Order_ID = this.orders[0].sale_Order_ID;
    //        var exchangeCheck = this.orders[0].exchange;
    //        if (exchangeCheck)
    //          this.exchanceStatus();
    //        else
    //          $("#ex").hide();

    //        this.changeOrder(this.customer_ID, this.sale_Order_ID);

    //      }

    //      //console.log(response.json());
    //    });
    //}

  }
  //getInvoices
  getInvoices() {
    this.isLoading =true;
    this.service.getInvoives()
      .subscribe(response => {
        this.invoices = (response.json());
        //     this.getPendingCustomer(this.mode)
        // console.log(response.json());
        this.isLoading = false;
      });
  }
  //searchSaleInvoices
  searchSaleInvoices(value: string) {
    this.service.searchSaleInvoices(value)
      .subscribe(response => {
        this.invoices = (response.json());
      });
  }
  //clearValues
  clearFields() {
    //Member Varialbes

    this.customers = [];

    this.orders = [];
    this.orderDetails = [];

    this.priviledged_Offices = this.userPrivilegedOffice;
    this.sale_Order_ID = 0
    this.sale_Invoice_ID = 0;
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
    this.Invoice = [];
    this.saleInvoiceDetails = [];
    this.guid = UUID.UUID();

    $("#checkboxGDN").prop("disabled", false);

    this.setAreaEnableStatus();
    this.getCompanyTemplate();
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

    return total_Cost.toFixed(2);;
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
              this.paidAmount = this.total_Amount;
            else
              this.paidAmount = this.pa;
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
              this.paidAmount = this.total_Amount;
            else
              this.paidAmount = this.pa;
            this.balanceAmount = this.total_Amount - this.paidAmount;
          }
        }
      }
    }

    return this.total_Amount.toFixed(2);
  }
  //getAreaEnableStatus
  getAreaEnableStatus() {
    if (this.LoginService.getSession('EnableAreaonSO') != '1') {
      this.areaenable = 0;

    }
    else {
      this.areaenable = 1;
    }

    this.setAreaEnableStatus();
  }
  //setAreaEnableStatus
  setAreaEnableStatus() {
    if (this.areaenable != 1) {
      this.getPendingOrderDayWise(1);

    }
    else {
      this.getArea();
      this.areashow = '';   
    }
  }
  //getArea 
  getArea() {
    this.isLoading =true;
    this.service.getArea()
      .subscribe(response => {
        this.area = (response.json());
        this.isLoading = false;
        if (this.area != null) {

          if (sessionStorage.getItem("AreaID") != '') {
            this.areacode = sessionStorage.getItem("AreaID");
          }
          else {
            this.areacode = this.area[0].areacode;
            this.areaname = this.area[0].areaname;
          }
          this.getPendingOrderDayWise(this.areacode);

        }

      });

  }
  //getPendingCustomer
  getPendingCustomer(Area, mode) {
    this.isLoading =true;
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
            this.customer_ID = this.customers[0].id;
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
    if (this.mode == false && this.savemoreFlag == false) {
      this.customer_ID = e;
      //this.IfExists(this.sale_Order_ID);
      this.allowInvoice = true;
      this.isLoading =true;
      this.service.getPendingOrder(this.userCurrentOffice, this.customer_ID, this.sale_Order_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
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

            this.changeOrder(this.customer_ID, this.sale_Order_ID);

          }

          //console.log(response.json());
        });
      $("#paidAmount").focus();
    }

  }
  //changeOrder
  changeOrder(customer_ID, sale_Order_ID) {
    if (this.mode == false) {
      $("#submitAdd").prop("disabled", true);
      $("#submitAddMore").prop("disabled", true);
      this.IfExists(sale_Order_ID);

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
    i.discount_Amount = (i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100;
    if (discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (discount_Rate < 0) {
      i.discount_Rate = 0;
    }
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
  //onNavifate
  onNavigate(pth) {
    sessionStorage.setItem('templatecode', '0');
    sessionStorage.setItem('isStamp', this.isStamp);
    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }
    sessionStorage.setItem('ReportView', "1");

    if (pth == "/si-rpt-excel")
      sessionStorage.setItem('ReportView', "2");
    else
      sessionStorage.setItem('ReportView', "1");

    sessionStorage.setItem('reportID', "2");
    sessionStorage.setItem('ID', this.ID);
    sessionStorage.setItem('IsOrder', '0');
    sessionStorage.setItem('exchange', "-1");
    window.open(pth, "_blank");

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
              this.getInvoices();
              this.modalReference.close();
            });
        } else {
          swal("Your invoice is safe!");
        }
      });
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(sale_Invoice_ID, content) {
    this.detailOpen(content);
    this.mode = true;
    this.btnmode = false;

    this.isLoading =true;

    this.IfPaymentExists(sale_Invoice_ID);
    this.service.getInvoiceDetailsByID(sale_Invoice_ID)
      .subscribe((o: saleInvoice) => {
        this.isLoading = false;
        console.log(o);
        this.ID = sale_Invoice_ID;
        this.sale_Order_ID = o.sale_Order_ID;
        this.sale_Invoice_ID = o.sale_Invoice_ID;
        this.invoice_Date.setDate(o.invoice_Date);
        this.remarks = o.remarks;
        this.saleInvoiceDetails = o.saleInvoiceDetails;
        this.freight_Chrgs = o.freight_Chrgs;
        this.paidAmount = o.paidAmount;
        this.balanceAmount = o.balanceAmount;
        this.specialDiscount = o.specialDiscount;
        this.total_Amount = o.total_Amount
        var exchangeCheck = o.exchange;

        if (exchangeCheck)
          this.exchanceStatus();
        else
          $("#ex").hide();

        $("#checkboxGDN").prop("disabled", true);

        //if (o.paidAmount > 1) {
        //  $("#submitUpdate").prop("disabled", true);
        //  $("#cancelBtn").prop("disabled", true);
        //}
        //else {
        //  $("#submitUpdate").prop("disabled", false);
        //  $("#cancelBtn").prop("disabled", false);
        //}
        sessionStorage.setItem('reportID', "2");
        sessionStorage.setItem('ID', this.sale_Invoice_ID);
        sessionStorage.setItem('exchange', "-1");

        if (o.cancel == 1) {
          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
        //Set PendingCustomer
        this.isLoading =true;
        this.service.getPendingCustomer(0, this.priviledged_Offices, o.customer_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
          .subscribe(response => {
            this.isLoading = false;
            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            this.customer_ID = o.customer_ID;
            var customlist = response.json();

            if (this.areaenable != 1) { }
            else {
              this.areashow = '';

              this.service.getArea()
                .subscribe(response => {

                  this.area = (response.json());
                  for (let i = 0; i < customlist.length; i++)
                    if (customlist[i].customer_ID == this.customer_ID) {
                      this.areacode = customlist[i].areaID;
                    }
                });
            }
            this.isLoading =true;
            this.service.getPendingOrder(this.priviledged_Offices, this.customer_ID, this.sale_Invoice_ID, this.mode, this.allowInvoice, this.invoice_Date.getDateFinal())
              .subscribe(response => {
                this.isLoading = false;
                this.orders = (response.json());
                if (this.orders != null) {
                  this.sale_Order_ID = this.orders[0].sale_Order_ID;

                  //this.exch = this.orders[0].exchange;
                  //if (this.exch == true)
                  //  this.exchanceStatus();
                  //else
                  //  $("#ex").hide();
                  this.changeOrder(this.customer_ID, this.sale_Order_ID);
                }
                //console.log(response.json());
              });
          });


        if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
          this.templateshow = 'none';
        }
        else {
          this.templateshow = '';
          this.service.getCompanyTemplate(this.userCurrentOffice)
            .subscribe(response => {
              this.companytemplate = (response.json());
              this.templatecode = o.template_ID;

            });
        }

        this.attachments = [];
        this.guid = o.sIGUID;
        this.getFiles(this.guid);
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
      $("#lblTotalTax").hide();

    }
    else {
      this.hide = true;
      this.isTaxable = this.LoginService.getSession('isTaxable');
      this.taxRate = this.LoginService.getSession('taxRate');
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
  //IfExists
  IfExists(sale_Order_ID) {
    this.isLoading =true;
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


        this.isLoading =true;
        this.service.getPendingOrderDetails(this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, sale_Order_ID, this.sale_Invoice_ID, this.mode, this.allowInvoice)
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
    //this.getCurrentDay();
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
    this.setAreaEnableStatus();
    
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
    $("#paidAmount").focus();
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
    this.invoiceBeforeGDN();
    this.GDNStatus();
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
      this.isLoading =true;
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
    this.isLoading =true;
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


  //----------------------------//
  PendingOrders: any[] = [];
  PendingOrdersAmountTotals: any = 0;
  PendingOrdersPaymentTotals: any = 0;
  TotalDeposit: any = 0;
  //getPendingOrderDayWise
  getPendingOrderDayWise(Area) {
    this.PendingOrders = [];
    this.isLoading =true;
    this.service.getPendingOrderDayWise(this.userCurrentOffice, Area, this.invoice_Date.getDateFinal())
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.PendingOrders = response.json();
          console.log(this.PendingOrders);
        }
      });
  }
  //savePendingOrderDayWise
  savePendingOrderDayWise() {
    this.isLoading =true;
    $("#submitAdd").prop("disabled", true);
    this.increment = 0;
    this.recure();
  }
  //recure
  recure() {
    if (this.increment < this.PendingOrders.length) {
      var i = this.increment;
      var List = this.PendingOrders;
      if (List[i].action == 1 && List[i].paidAmount > 0) {
        this.saleInvoiceDetails = [];
        this.service.getPendingOrderDayWiseDetails(this.userCurrentOffice, List[i].customer_ID, List[i].sale_Order_ID)
          .subscribe(response => {
               
            if (response.json() != null) {
              var SInvoiceDetails = (response.json());
              this.guid = UUID.UUID();
              var BalanceAmount = List[i].total_Cost - List[i].paidAmount;
              var invoice = new saleInvoice(0, this.invoice_Date.getDateFinal(), this.userCurrentOffice,'', List[i].customer_ID, List[i].sale_Order_ID, 0,
                List[i].total_Cost, List[i].total_Discount, List[i].total_Tax, List[i].freight_Chrgs,
                List[i].total_Amount, List[i].paidAmount, BalanceAmount, 0, '', this.guid, 1, 0,
                List[i].specialDiscount, this.logedInUserID, this.UserSessionID, 1, 0, this.userCurrentWarehouse,0, SInvoiceDetails);
              console.log('Sale Order ID :', List[i].sale_Order_ID, List[i].sO_NO);
              if (List[i].paidAmount <= List[i].total_Amount) {
                this.service.saveInvoice(invoice).then(
                  (response) => {
                    console.log(response);
                    this.increment++;
                    console.log("CURSOR: " + this.increment);
                    this.recure();
                  },
                  (error) => console.log(error))
              }
            }
          });
      }
      else {
        this.increment = this.increment + 1;
        console.log("ELSE CURSOR: " + this.increment)
        this.recure();
      }
    }
    else {
      console.log("ENDED!")
      this.isLoading = false;  
      this.getPendingOrderDayWise(this.areacode);
    }
  }
  //selectAll
  selectAll() {
    var sum = 0;
    if (this.PendingOrders != null) {
      for (let i = 0; i < this.PendingOrders.length; i++) {
        this.PendingOrders[i].action = this.selectedAll;
        if (this.PendingOrders[i].action == this.selectedAll) {
          this.PendingOrders[i].paidAmount = this.PendingOrders[i].total_Amount;
        }
        else {
          this.PendingOrders[i].paidAmount = 0;
        }
        sum = sum + parseFloat(this.PendingOrders[i].paidAmount);
      }
    }
    this.matchTotalDeposit();
    this.PendingOrdersPaymentTotals = sum.toFixed(2);
    return sum.toFixed(2);
  }
  //markPayment
  markPayment(idx) {
    if (this.PendingOrders[idx].action == 1) {
      this.PendingOrders[idx].paidAmount = this.PendingOrders[idx].total_Amount;
    }
    else {
      this.PendingOrders[idx].paidAmount = 0;
    }
  }
  //calculatePaymentTotals
  calculatePaymentTotals() {
    var sum = 0;
    if (this.PendingOrders != null) {
      for (let i = 0; i < this.PendingOrders.length; i++) {
        if (this.PendingOrders[i].action == 1) {
          sum = sum + parseFloat(this.PendingOrders[i].paidAmount);
        }
      }
    } 
    this.matchTotalDeposit();
    this.PendingOrdersPaymentTotals = sum.toFixed(2);
    return sum.toFixed(2);
  }
  //calculatePaymentTotals
  calculateAmountTotals() {
    var sum = 0;
    if (this.PendingOrders != null) {
      for (let i = 0; i < this.PendingOrders.length; i++)
        if (this.PendingOrders[i].action == 1 && this.PendingOrders[i].total_Amount > 0) {
          sum = sum + parseFloat(this.PendingOrders[i].total_Amount);
        }
    }
    this.PendingOrdersAmountTotals = sum;
    return sum.toFixed(2);
  }
  //matchTotalDeposit
  matchTotalDeposit() {
   
    console.log("this.TotalDeposit " + this.TotalDeposit + " this.PendingOrdersPaymentTotals " + this.PendingOrdersPaymentTotals + " ?? " + (this.TotalDeposit > 0 && this.TotalDeposit == this.PendingOrdersPaymentTotals))
    if (this.TotalDeposit > 0 && this.TotalDeposit == this.PendingOrdersPaymentTotals) {
      $("#submitAdd").prop("disabled", false);
    }
    else {
      $("#submitAdd").prop("disabled", true);
    }
  }
  //routeInvoice
  routeInvoice() {
    this.router.navigate(['/sale-invoice']);
  }
}

