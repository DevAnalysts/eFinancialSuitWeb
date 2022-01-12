import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseInvoiceService, LoginService, DayEndService, FileAttachmentService, JournalVoucherService, Supplier, SCM_Purchase_Invoice, PurchaseInvoiceDetail, cDate, NgbDateFRParserFormatter, PermissionUtility, SaleOrderService } from '../../../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'purchase-invoice',
  templateUrl: './purchase-invoice.component.html',
  styleUrls: ['./purchase-invoice.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class PurchaseInvoiceComponent implements OnInit {
  ////////////////////////////////////////   
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility:PermissionUtility=new PermissionUtility();  
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  //Member Varialbes
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  suppliers: Array<Select2OptionData> = [];
  orders: any[] = [];
  invoices: any[];
  orderDetails: any[] = [];
  priviledged_Offices: any = '';
  public supplier_ID: any;
  public supplier_Name: any;
  PendingOrderListID: any = 0;
  purchase_Order_ID: any;
  purchase_Invoice_ID: any = 0;
  goods_Receive_ID: any = 0;
  total_Cost: any;
  total_Discount: any;
  freight_Chrgs: any = 0.00;
  total_Amount: any;
  remarks: any;
  public invoice_Date = new cDate();
  public dayEndDate = new cDate();
  item_Code: any;
  quantity: any = 0;
  discount_Rate: any = 0;
  mode: any = 0;
  btnMode: any = 0;
  Invoice: any;
  PurchaseInvoiceDetail: any[] = [];
  guid: any;
  invoice_ID: any = "";
  ID: any = 0;
  prevQty: any = 0;
 isLoading: any = false;
  color = '#0094ff';
  closeResult: string;
  alerts: Array<any> = [];
  isView: any = false;
  showVoucher:any=true;
  DisablevoucherCheckBox:any=true;
  hide = true;
  hideStock = true;
  allowInvoice = false;
  stock_Qty: any = 0;
  IDD: any = "";
  id: any = "";
  isTaxable: any;
  taxRate: any;
  taxable: any;
  exchange: any = false;
  exch: any = false;
  cancelReturn: any;
  actionID: any = 2;
  dayEndDetail: any[] = [];
  DirectGRN: any = 0;
  guidOrder: boolean;
  status: any;
  voucher_ID: any = 0;
  accounts: any;
  accountTitle: any = 'GRIR_Payable';
  Order_ID: any = 0;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  isDueDate: any = false;
  public delivery_Date = new cDate();
  unit: any=0;
  unitList: any[];

  constructor(private service: PurchaseInvoiceService,private SaleOrderService:SaleOrderService, private LoginService: LoginService, private fileservice: FileAttachmentService, private DayEndService: DayEndService, private JournalVoucherService: JournalVoucherService, private modalService: NgbModal) {
    this.PurchaseInvoiceDetail = new Array<PurchaseInvoiceDetail>();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.alerts.push(
      {
        id: 1,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',

      }     
    );
  }
  //ngOnInit
  ngOnInit() {
    //  alert(sessionStorage.getItem('GRIR_Payable'));
    $("#showGRN").hide();
    this.getInvoices(this.id);
    this.getCurrentDay();
    this.getTaxRate();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    if (this.LoginService.getSession('AllowAttachmentSale') == '1')
      this.ShowAttachment = '';
    ////////////////////////Set Name From Session Storage///////////////////////////
      this.permissomUtility.setPagePermissions(80008);  
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
    this.invoice_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
      //});
  }
  //changeInvoiceDate
  changeInvoiceDate(invoice_Date) {
    if (this.invoice_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.invoice_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //getInvoices
  getInvoices(value: string) {
    this.isLoading =true;
    this.service.getInvoives(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.invoices = (response.json());
          this.isLoading = false;
          // this.getPendingSupplier(this.mode)
          // console.log(response.json());
        }
        else{
          this.invoices = [];
          this.isLoading = false;
        }
        
      });
  }
  //getUnit
  getUnit(){
    this.SaleOrderService.getUnits(0).subscribe(response => {
      this.unitList = (response.json());
      if(this.unitList!=null){
      this.unit = this.unitList[0].unitID;
      console.log(this.unitList);
      }
    });
  }
  getUnitName(unit_ID){
    return this.unitList.filter(f=>f.unitID==unit_ID)[0].unit;
  }
  //clearFields
  clearFields() {

    //Member Varialbes  
    this.suppliers = [];
    this.orders = [];
    this.orderDetails = [];
    //this.invoices = [];
    this.PurchaseInvoiceDetail = [];
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.total_Cost = 0;
    this.total_Discount = 0;
    this.freight_Chrgs = 0.00;
    this.total_Amount = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.quantity = 0;
    this.discount_Rate = 0;
    this.mode = false;
    this.btnMode = true;
    this.exchange = false;
    $("#ex").hide();
    this.taxField();
    this.stockField();
    //$("#alertWarning").hide();
    this.guid = UUID.UUID();
    $("#checkboxGRN").prop("disabled", false);

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
    if (this.PurchaseInvoiceDetail != null) {
      if (this.PurchaseInvoiceDetail.length > 0) {
        for (var count = 0; count < this.PurchaseInvoiceDetail.length; count++) {
          total_Cost += this.PurchaseInvoiceDetail[count].purchase_Cost;
        }
      }
    }
    return total_Cost.toFixed(2);;
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0;
    if (this.PurchaseInvoiceDetail != null) {
      if (this.PurchaseInvoiceDetail.length > 0) {
        for (var count = 0; count < this.PurchaseInvoiceDetail.length; count++) {
          total_Discount += ((this.PurchaseInvoiceDetail[count].purchase_Cost) * this.PurchaseInvoiceDetail[count].discount_Rate / 100);
        }
      }
    }
    return total_Discount.toFixed(2);;
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0;
    if (this.PurchaseInvoiceDetail != null) {
      if (this.PurchaseInvoiceDetail.length > 0) {
        for (var count = 0; count < this.PurchaseInvoiceDetail.length; count++) {
          total_Tax += ((this.PurchaseInvoiceDetail[count].purchase_Cost) - ((this.PurchaseInvoiceDetail[count].purchase_Cost) * this.PurchaseInvoiceDetail[count].discount_Rate / 100)) / 100 * this.PurchaseInvoiceDetail[count].tax_Rate;
        }
      }
    }
    return total_Tax.toFixed(2);
  }
  //Total Amount
  TotalAmount() {
    
    var total_Amount = 0;
    if (this.PurchaseInvoiceDetail != null) {
      if (this.PurchaseInvoiceDetail.length > 0) {
        for (var count = 0; count < this.PurchaseInvoiceDetail.length; count++) {
          total_Amount += (((this.PurchaseInvoiceDetail[count].purchase_Cost) - ((this.PurchaseInvoiceDetail[count].purchase_Cost) * this.PurchaseInvoiceDetail[count].discount_Rate / 100)) + ((this.PurchaseInvoiceDetail[count].purchase_Cost) - ((this.PurchaseInvoiceDetail[count].purchase_Cost) * this.PurchaseInvoiceDetail[count].discount_Rate / 100)) / 100 * this.PurchaseInvoiceDetail[count].tax_Rate);
        }
        if (this.freight_Chrgs != "")

          total_Amount += parseFloat(this.freight_Chrgs);
      }
    }
    return total_Amount.toFixed(2);
  }
  //getPendingSupplier
  getPendingSupplier(mode) {
    this.isLoading =true;

    this.service.getPendingSupplier(this.userCurrentOffice, this.userCurrentWarehouse, this.supplier_ID, this.mode, this.allowInvoice)
      .subscribe(response => {

        this.isLoading = false;


        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        if (this.suppliers.length > 0) {
          if (sessionStorage.getItem("EnableEmptyRow") == '1') {
            this.supplier_ID = 0;
          }
          else {
            this.supplier_ID = this.suppliers[0].id;
          }

          this.isLoading =true;
          this.service.getPendingOrder(this.userCurrentOffice, this.userCurrentWarehouse, this.supplier_ID, this.purchase_Order_ID, this.goods_Receive_ID, this.mode, this.allowInvoice)
            .subscribe(response => {
              this.isLoading = false;

              if (response.json() != null) {
                this.orders = (response.json());
                // console.log(this.orders);
                this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
                this.goods_Receive_ID = this.orders[0].goods_Receive_ID;
                this.exchange = this.orders[0].exchange;
                if (this.exchange == true)
                  this.exchanceStatus();
                else
                  $("#ex").hide();
              }

            });
        }
        else {

          this.isLoading = false;

          $("#submitAdd").prop("disabled", true);
          $("#submitAddMore").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
      });
  }
  //supplierChange
  changeSupplier(e: any) {

    this.supplier_ID = e;
    this.isLoading =true;
    this.service.getPendingOrder(this.userCurrentOffice, this.userCurrentWarehouse, this.supplier_ID, this.purchase_Order_ID, this.goods_Receive_ID, this.mode, this.allowInvoice)
      .subscribe(response => {

        this.orders = (response.json());
        console.log(response.json());
        if (this.orders != null) {
          this.PendingOrderListID = this.orders[0].id;
          this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
          this.goods_Receive_ID = this.orders[0].goods_Receive_ID;
          this.exchange = this.orders[0].exchange;
          if (this.exchange == true)
            this.exchanceStatus();
          else
            $("#ex").hide();

          this.changeOrder(this.PendingOrderListID);

        }

      });
  }
  //orderChange
  changeOrder(ID) {

    if (this.orders != null) {
      for (let i = 0; i < this.orders.length; i++)
        if (this.orders[i].id == ID) {
          this.purchase_Order_ID = this.orders[i].purchase_Order_ID;
          this.goods_Receive_ID = this.orders[i].goods_Receive_ID;
        }
    }


    this.Order_ID = this.purchase_Order_ID;
    this.isLoading =true;
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    this.IfExists(this.Order_ID);
  }
  //changeQuantity
  changeQuantity(i: PurchaseInvoiceDetail, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //changeDiscountRate
  changeDiscountRate(i: PurchaseInvoiceDetail, discount_Rate) {  
    if (discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (discount_Rate <= 0) {
      i.discount_Rate = 0;
    }
    i.discount_Amount = (i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100;
    i.tax_Amount = (((i.quantity * i.unit_Price) - ((i.quantity * i.unit_Price) * i.discount_Rate / 100)) / 100 * i.tax_Rate).toFixed(2);
    i.net_Amount = (((i.quantity * i.unit_Price) - ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100)) + ((i.quantity * i.unit_Price) - ((i.quantity * i.unit_Price) * i.discount_Rate / 100)) / 100 * i.tax_Rate).toFixed(2);
  }
  //changeDiscountRate
  changeFreight(freight_Chrgs) {
    if (freight_Chrgs <= 0) {
      this.freight_Chrgs = 0;
    }
  }
  //convert dropdown lables
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
  onVoucherNavigate() {  
    sessionStorage.setItem('ID', this.voucher_ID);
     sessionStorage.setItem('ReportView', "1"); 
    sessionStorage.setItem('reportID', "1"); 
  window.open("/gv-rpt-rdlc", "_blank");
  
  } 
  
  //getAccount
  getAccount() {
    this.JournalVoucherService.getAccount(this.accountTitle)
      .subscribe(response => {
        this.accounts = (response.json());
        console.log(response.json());
      });
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

          this.service.cancelInvoice(this.purchase_Invoice_ID, this.actionID)
            .subscribe(response => {
              this.cancelReturn = (response.json());
              this.getInvoices(this.id);
              this.modalReference.close();
            });
        } else {
          swal("Your invoice is safe!");
        }
      });
  }
  //saveMoreInvoice
  saveMoreInvoice(purchase_Invoice_ID: any, invoice_Date: any, invoice_NO: any, office_Code: any,
    supplier_ID: any, purchase_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {
    this.isLoading =true;
    $("#submitAddMore").prop("disabled", true);
    if(this.showVoucher==true){
    var invoice = new SCM_Purchase_Invoice(purchase_Invoice_ID, this.invoice_Date.getDateFinal(), this.delivery_Date.getDateFinal(), 0, this.userCurrentOffice, supplier_ID, purchase_Order_ID, this.goods_Receive_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID, this.logedInUserID, this.UserSessionID,
      this.PurchaseInvoiceDetail);
    console.log(invoice);

    this.service.saveInvoice(invoice).then(
      (response) => {

        this.voucher_ID = response.voucher_ID;
        this.onVoucherNavigate();
        this.service.getInvoives(this.id, this.userPrivilegedOffice)
          .subscribe(response => {
            this.invoices = (response.json());
          });

        this.guid = UUID.UUID();
        $("#submitAddMore").prop("disabled", false);

        this.service.getPendingOrder(this.userCurrentOffice, this.userCurrentWarehouse, supplier_ID, this.purchase_Order_ID, this.goods_Receive_ID, this.mode, this.allowInvoice)
          .subscribe(response => {

            if (response.json() != null) {
              this.orders = (response.json());
              this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
              this.changeOrder(0);
              this.exchange = this.orders[0].exchange;

              if (this.exchange == true)
                this.exchanceStatus();
              else
                $("#ex").hide();

            }
            else {
              this.isLoading =true;

              this.clearFields();
              this.invoiceBeforeGDN();
              this.GRNStatus();
              this.getPendingSupplier(this.mode);
            }
          });
        console.log(response);
      },
      (error) => console.log(error))
    }
    else{
      var invoice = new SCM_Purchase_Invoice(purchase_Invoice_ID, this.invoice_Date.getDateFinal(),this.delivery_Date.getDateFinal(), 0, this.userCurrentOffice, supplier_ID, purchase_Order_ID, this.goods_Receive_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID, this.logedInUserID, this.UserSessionID,
      this.PurchaseInvoiceDetail);
    console.log(invoice);

    this.service.saveInvoice(invoice).then(
      (response) => {

        this.IDD = response;
        this.service.getInvoives(this.id, this.userPrivilegedOffice)
          .subscribe(response => {
            this.invoices = (response.json());
          });

        this.guid = UUID.UUID();
        $("#submitAddMore").prop("disabled", false);

        this.service.getPendingOrder(this.userCurrentOffice, this.userCurrentWarehouse, supplier_ID, this.purchase_Order_ID, this.goods_Receive_ID, this.mode, this.allowInvoice)
          .subscribe(response => {

            if (response.json() != null) {
              this.orders = (response.json());
              this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
              this.changeOrder(0);
              this.exchange = this.orders[0].exchange;

              if (this.exchange == true)
                this.exchanceStatus();
              else
                $("#ex").hide();

            }
            else {
              this.isLoading =true;

              this.clearFields();
              this.invoiceBeforeGDN();
              this.GRNStatus();
              this.getPendingSupplier(this.mode);
            }
          });
        console.log(response);
      },
      (error) => console.log(error))
    }
  }
  //saveInvoice
  saveInvoice(  purchase_Invoice_ID: any, 
                invoice_Date: any, 
                invoice_NO: any, 
                office_Code: any,
                supplier_ID: any, 
                purchase_Order_ID: any, 
                total_Cost: any, 
                total_Discount: any, 
                total_Tax: any,
                freight_Chrgs: any, 
                total_Amount: any, 
                balanceAmount: any, 
                paidAmount: any, 
                remarks: any, 
                mode: any) {
    this.isLoading =true;
     if(this.showVoucher==true){
        
    var invoice = new SCM_Purchase_Invoice(purchase_Invoice_ID, 
                                          this.invoice_Date.getDateFinal(), 
                                          this.delivery_Date.getDateFinal(), 
                                          0, 
                                          this.userCurrentOffice,
                                          supplier_ID, 
                                          purchase_Order_ID, 
                                          this.goods_Receive_ID, 
                                          total_Cost, 
                                          total_Discount, 
                                          total_Tax,
                                          freight_Chrgs, 
                                          total_Amount, 
                                          balanceAmount, 
                                          paidAmount, 
                                          remarks, 
                                          this.guid, 
                                          this.mode, 
                                          this.exchange, 
                                          this.DirectGRN, 
                                          0, 
                                          this.voucher_ID, 
                                          this.logedInUserID, 
                                          this.UserSessionID, 
                                          this.PurchaseInvoiceDetail);
    console.log(invoice);  

    this.service.saveInvoice(invoice).then(
      (response) => {
        $("#submitAdd").prop("disabled", true);
        this.isLoading = false;
        this.voucher_ID = response.voucher_ID;
        this.getInvoices(this.id);
        //if (this.isView == true) {
        //  this.onNavigate();
        //}
        this.onVoucherNavigate();
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))
    }
    else{
      var invoice = new SCM_Purchase_Invoice(purchase_Invoice_ID, this.invoice_Date.getDateFinal(), this.delivery_Date.getDateFinal(), 0, this.userCurrentOffice,
      supplier_ID, purchase_Order_ID, this.goods_Receive_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID, this.logedInUserID, this.UserSessionID, this.PurchaseInvoiceDetail);
    console.log(invoice);
       
    this.service.saveInvoice(invoice).then(
      (response) => {
        $("#submitAdd").prop("disabled", true);
        this.isLoading = false;
        this.IDD = response.purchase_Invoice_ID;
        this.getInvoices(this.id);
        //if (this.isView == true) {
        //  this.onNavigate();
        //}
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))
    }
  }
  //updateInvoice
  updateInvoice(purchase_Invoice_ID: any, invoice_Date: any, delivery_Date: any, invoice_NO: any, office_Code: any,
    supplier_ID: any, purchase_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {
    this.isLoading =true;

    if(this.showVoucher==true){
    var invoice = new SCM_Purchase_Invoice(this.ID, this.invoice_Date.getDateFinal(), this.delivery_Date.getDateFinal(),0, this.userCurrentOffice,
      supplier_ID, purchase_Order_ID, this.goods_Receive_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID, this.logedInUserID, this.UserSessionID, this.PurchaseInvoiceDetail);
    console.log(invoice);

    this.service.updateInvoice(invoice).then(
      (response) => {
        this.voucher_ID=response.voucher_ID;
        this.isLoading = false;
        this.getInvoices(this.id);
        this.onVoucherNavigate();
        this.modalReference.close();
      },
      (error) => console.log(error))
    }
    else{
      var invoice = new SCM_Purchase_Invoice(this.ID, this.invoice_Date.getDateFinal(), this.delivery_Date.getDateFinal(), 0, this.userCurrentOffice,
      supplier_ID, purchase_Order_ID, this.goods_Receive_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID, this.logedInUserID, this.UserSessionID, this.PurchaseInvoiceDetail);
    console.log(invoice);

    this.service.updateInvoice(invoice).then(
      (response) => {
        this.isLoading = false;
        this.getInvoices(this.id);
        this.modalReference.close();
      },
      (error) => console.log(error))
    }
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(purchase_Invoice_ID, content) {
    this.detailOpen(content);
    this.ID = purchase_Invoice_ID;
    this.mode = true;
    this.btnMode = false;
    this.isLoading =true;
    //$("#submitAdd").prop("disabled", true);
    //$("#submitUpdate").prop("disabled", true);
    this.IfPaymentExists(purchase_Invoice_ID);
    this.service.getInvoiceDetailsByID(purchase_Invoice_ID)
      .subscribe((o: SCM_Purchase_Invoice) => {
        console.clear();
        console.log(o);
        this.purchase_Invoice_ID = o.purchase_Invoice_ID;
        this.purchase_Order_ID = o.purchase_Order_ID;        
        if (o.goods_Receive_ID != null)
          this.goods_Receive_ID = o.goods_Receive_ID;
        else
          this.goods_Receive_ID = 0;

        this.supplier_ID = o.supplier_ID;
        this.exchange = o.exchange;
        if (this.exchange == true)
          this.exchanceStatus();
        else
          $("#ex").hide();

        $("#checkboxGRN").prop("disabled", true);

        this.invoice_Date.setDate(o.invoice_Date);
        this.delivery_Date.setDate(o.delivery_Date);
        this.remarks = o.remarks;
        this.voucher_ID = o.voucher_ID;
        this.PurchaseInvoiceDetail = o.purchaseInvoiceDetail;
        if (o.cancel == 1) {
          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
        sessionStorage.setItem('reportID', "5");
        sessionStorage.setItem('ID', this.purchase_Order_ID);
        //Set PendingSupplier
        this.service.getPendingSupplier(this.userCurrentOffice, this.userCurrentWarehouse, o.supplier_ID, this.mode, this.allowInvoice)
          .subscribe(response => {
            this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");


            this.service.getPendingOrder(this.userCurrentOffice, this.userCurrentWarehouse, o.supplier_ID, this.purchase_Order_ID, this.goods_Receive_ID, this.mode, this.allowInvoice)
              .subscribe(response => {
                this.isLoading = false;
                this.orders = (response.json());
                console.log(response.json());
                if (this.orders != null) {
                  this.PendingOrderListID = this.orders[0].id;
                  this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
                }
              });

          });
        this.isLoading = false;
        //$("#submitAdd").prop("disabled", false);
        //$("#submitUpdate").prop("disabled", false);

        this.attachments = [];
        this.guid = o.pIGUID;
        this.getFiles(this.guid);
      });
  }
  //changeGRN
  changeGRN(allowInvoice) {
    if (allowInvoice == false)
      this.DirectGRN = 0;
    else
      this.DirectGRN = 1;
  }
  //ngAfterViewChecked
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  //scrollToBottom
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  //exchanceStatus
  exchanceStatus() {
    if (sessionStorage.getItem('settingAllowExchange') != "1")
      $("#ex").hide();
    else {
      $("#exchange").prop("disabled", true);
      $("#ex").show();
    }
  }
  //GDNStatus
  GRNStatus() {

    if (sessionStorage.getItem('settingGRNonInvoice') != "1"){
      $("#showGRN").hide();
      this.allowInvoice=false;
    }
    else{
      $("#showGRN").show();
      this.allowInvoice=true;
    }

    if (this.allowInvoice == true)
      this.DirectGRN = 1;
    else
      this.DirectGRN = 0;
  }
  //taxField
  taxField() {
    if (this.LoginService.getSession('settingTaxOnPurchase') != '1') {
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
  //invoiceBeforeGDN
  invoiceBeforeGDN() {

    if (sessionStorage.getItem('settingInvoiceBeforeGRN') != "1")
      this.allowInvoice = false;
    else
      this.allowInvoice = true;
  }
  //IfPaymentExists
  IfPaymentExists(purchase_Invoice_ID) {
    this.service.IfPaymentExists(purchase_Invoice_ID)
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
  IfExists(purchase_Order_ID) {

    this.service.IfExists(purchase_Order_ID)
      .subscribe(response => {
        this.status = (response.json());
        this.allowInvoice = true;

        // alert(this.mode + " this.mode " + this.status + " this.mode");
        if (this.mode) {
          $("#checkboxGRN").prop("disabled", true);
          if (this.status == false) {
            this.DirectGRN = 0;
            this.allowInvoice = false;

          }

        }
        else {

          $("#checkboxGRN").prop("disabled", false);
          if (this.status == true) {

            this.DirectGRN = 0;
            this.allowInvoice = false;
            $("#checkboxGRN").prop("disabled", true);
          }
          else {

            this.DirectGRN = 1;
          }
        }

        // alert(this.allowInvoice);
        if (sessionStorage.getItem('settingGRNonInvoice') != "1")
          $("#showGRN").hide();
        else
          $("#showGRN").show();


        this.service.getPendingOrderDetails(this.userCurrentOffice, this.userCurrentWarehouse,this.supplier_ID, this.purchase_Order_ID, this.purchase_Invoice_ID, this.goods_Receive_ID, this.mode, this.allowInvoice)
          .subscribe(response => {
            this.PurchaseInvoiceDetail = [];
            this.isLoading = false;

            if (this.supplier_ID == 0 && this.btnMode == true && sessionStorage.getItem("EnableEmptyRow")) {
              this.orders = [];
            }
            else {


              if (response.json() != null) {
                this.PurchaseInvoiceDetail = (response.json());
                console.log(response.json());
                this.freight_Chrgs = this.PurchaseInvoiceDetail[0].freight_Chrgs;
                this.exchange = this.PurchaseInvoiceDetail[0].exchange;
                this.PurchaseInvoiceDetail[0].prevQty = 0;
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
              }

            }

          });

      });
  }
  //changeDeliveryDate
  changeDeliveryDate(delivery_Date) {
    if (this.delivery_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.delivery_Date.setDate(this.dayEndDate.getDateFinal());
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

    $("#submitAdd").show();
    $("#submitAddMore").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    $("#cancelBtn").hide();
    $("#ex").hide();
    $("#viewVoucherRDLC").hide();
    $("#viewRDLC1").hide();
    this.clearFields();
    this.invoiceBeforeGDN();
    this.GRNStatus();
    this.getPendingSupplier(this.mode);
    this.getUnit();
  }
  //detailOpen
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
    $("#submitAdd").hide();
    $("#submitAddMore").hide();
    $("#submitUpdate").show();
    $("#submitUpdate").prop("disabled", false);
    $("#cancelBtn").show();
    $("#ex").hide();
    this.clearFields();
    this.invoiceBeforeGDN();
    this.GRNStatus();
    this.getUnit();
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
      this.isLoading =true;
      this.fileservice.postFile(this.guid, 5, this.filename, this.fileToUpload)
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


  taxrateList: any[] = [];
  taxratecode: any = 1;
  taxratename: any = '';
  taxrate: any = 0;
  taxcode: any = 1;
  //getTaxRate 
  getTaxRate() {
    this.isLoading =true;
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
