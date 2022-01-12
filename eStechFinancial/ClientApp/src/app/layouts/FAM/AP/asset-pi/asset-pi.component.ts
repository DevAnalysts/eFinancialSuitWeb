import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetPIService, LoginService, DayEndService, JournalVoucherService, Supplier, AssetPI, AssetPIDetail, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'asset-pi',
  templateUrl: './asset-pi.component.html',
  styleUrls: ['./asset-pi.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetPIComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0; 
  public permissionUtility:PermissionUtility=new PermissionUtility();
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  //Member Varialbes
  p: number = 1;
  modalReference: NgbModalRef;
  suppliers: Array<Select2OptionData> = [];
  public supplier_IDM: any;
  public supplier_ID: any;
  public supplier_Name: any;
  submitAdd:any;
  submitUpdate:any;
  orders: any[] = [];
  grid: any[];
  orderDetails: any[] = []; 

  purchase_Order_ID: any;
  purchase_Invoice_ID: any = 0;
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
 ////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
  constructor(private service: AssetPIService, private LoginService: LoginService, private DayEndService: DayEndService, private JournalVoucherService: JournalVoucherService, private modalService: NgbModal) {
    this.PurchaseInvoiceDetail = new Array<AssetPIDetail>();
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
    this.getGrid(this.id);
    this.getCurrentDay();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.permissionUtility.setPagePermissions(970024);
    }
      
   
  //getCurrentDay
  getCurrentDay() {
    this.DayEndService.getCurrentDay(this.userCurrentOffice)
      .subscribe(response => {
        this.dayEndDetail = (response.json());
        this.invoice_Date.setDate(this.dayEndDetail[0].poS_Day);
        this.dayEndDate.setDate(this.dayEndDetail[0].poS_Day);
      });
  }
  //changeInvoiceDate
  changeInvoiceDate(invoice_Date) {
    if (this.invoice_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.invoice_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //getGrid
  getGrid(value: string) {
    this.isLoading =true;
    this.service.getGrid(value,this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.grid = (response.json());
        }
        else{
          this.isLoading = false;
        this.grid = [];
        }
        

      });
  }
  //clearFields
  clearFields() {
    //Member Varialbes  
    this.suppliers = [];
    this.orders = [];
    this.orderDetails = [];

    this.PurchaseInvoiceDetail = [];
    this.priviledged_Offices = 1;
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
    ////this.stockField();
    //$("#alertWarning").hide();
    this.guid = UUID.UUID();
    $("#checkboxGRN").prop("disabled", false);
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
    this.service.getPendingSupplier(this.priviledged_Offices, this.supplier_ID, this.mode, this.allowInvoice)
      .subscribe(response => {
        this.isLoading = false;
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        ////if (this.suppliers!=null) {

        ////  this.isLoading =true;
        ////  this.service.getPendingOrder(this.priviledged_Offices, this.supplier_ID, this.purchase_Order_ID, this.mode, this.allowInvoice)
        ////    .subscribe(response => {
        ////      this.isLoading = false;
        ////      if (response.json()!=null) {
        ////        this.orders = (response.json());

        ////        this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
        ////        this.exchange = this.orders[0].exchange;
        ////        //if (this.exchange == true)
        ////        //  this.exchanceStatus();
        ////        //else
        ////          $("#ex").hide();
        ////      }

        ////    });
        ////}
        ////else {

        ////  $("#submitAdd").prop("disabled", true);
        ////  $("#submitAddMore").prop("disabled", true);
        ////  $("#submitUpdate").prop("disabled", true);
        ////}
      });
  }
  //supplierChange
  changeSupplier(e: any) {
    this.supplier_ID = e;
    this.isLoading =true;
    this.service.getPendingOrder(this.priviledged_Offices, this.supplier_ID, this.purchase_Order_ID, this.mode, this.allowInvoice)
      .subscribe(response => {
        this.isLoading = false;
        this.orders = (response.json());

        if (this.orders != null) {
          this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
          ////this.exchange = this.orders[0].exchange;
          ////if (this.exchange == true)
          ////  this.exchanceStatus();
          ////else
          $("#ex").hide();
          this.changeOrder(this.supplier_ID, this.purchase_Order_ID);

        }
      });
  }   
  //orderChange
  changeOrder(supplier_ID, purchase_Order_ID) {
    this.isLoading =true;
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);

    this.service.getPendingOrderDetails(this.supplier_ID, this.purchase_Order_ID, this.purchase_Invoice_ID, this.mode, this.allowInvoice)
      .subscribe(response => {
        this.PurchaseInvoiceDetail = [];
        this.isLoading = false;
        if (this.supplier_ID == 0 && this.btnMode == true) {
          this.orders = [];
        }
        else {


          if (response.json() != null) {
            this.PurchaseInvoiceDetail = (response.json());

            this.freight_Chrgs = this.PurchaseInvoiceDetail[0].freight_Chrgs;
            this.exchange = this.PurchaseInvoiceDetail[0].exchange;
            this.PurchaseInvoiceDetail[0].prevQty = 0;
            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);
          }

        }

      });


  }
  //changeQuantity
  changeQuantity(i: AssetPIDetail, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //changeDiscountRate
  changeDiscountRate(i: AssetPIDetail, discount_Rate) {
    i.discount_Amount = (i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100;
    if (discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (discount_Rate <= 0) {
      i.discount_Rate = 0;
    }
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
  //onNavifate  
  onNavigate() {
    sessionStorage.setItem('reportID', "5");
    sessionStorage.setItem('ID', this.IDD);
    window.open("/supply-chain-reports", "_blank");
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
              this.getGrid(this.id);
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
    var invoice = new AssetPI(purchase_Invoice_ID, this.invoice_Date.getDateFinal(), 0, office_Code,
      supplier_ID, purchase_Order_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID,this.logedInUserID, this.UserSessionID, this.PurchaseInvoiceDetail);
    console.log(invoice);

    this.service.saveInvoice(invoice).then(
      (response) => {
        this.isLoading = false;
        this.IDD = response;
        this.getGrid(this.id);
        //if (this.isView == true) {
        //  this.onNavigate();
        //}
        $("#submitAddMore").prop("disabled", false);
        this.clearFields();
        ////this.invoiceBeforeGDN();
        ////this.GRNStatus();
        this.getPendingSupplier(this.mode);
        console.log(response);
      },
      (error) => console.log(error))
  }
  //saveInvoice
  saveInvoice(purchase_Invoice_ID: any, invoice_Date: any, invoice_NO: any, office_Code: any,
    supplier_ID: any, purchase_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {
    this.isLoading =true;  
    if(this.supplier_ID!=undefined || supplier_ID!=undefined){
        $("#submitAdd").prop("disabled", true);
        var invoice = new AssetPI(purchase_Invoice_ID, this.invoice_Date.getDateFinal(), 0, office_Code,
          supplier_ID, purchase_Order_ID, total_Cost, total_Discount, total_Tax,
          freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID,this.logedInUserID, this.UserSessionID, this.PurchaseInvoiceDetail);
        console.log(invoice);

        this.service.saveInvoice(invoice).then(
          (response) => {
            this.isLoading = false;
            this.IDD = response;
            this.getGrid(this.id);
            //if (this.isView == true) {
            //  this.onNavigate();
            //}
            this.modalReference.close();
            console.log(response);
          },
          (error) => console.log(error))
    }else
    swal("Please Select Supplier");
    this.isLoading=false;
  }
  //updateInvoice
  updateInvoice(purchase_Invoice_ID: any, invoice_Date: any, invoice_NO: any, office_Code: any,
    supplier_ID: any, purchase_Order_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    freight_Chrgs: any, total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {
    this.isLoading =true;
    if(this.supplier_ID!=undefined || supplier_ID!=undefined){
    var invoice = new AssetPI(this.ID, this.invoice_Date.getDateFinal(), 0, office_Code,
      supplier_ID, purchase_Order_ID, total_Cost, total_Discount, total_Tax,
      freight_Chrgs, total_Amount, balanceAmount, paidAmount, remarks, this.guid, this.mode, this.exchange, this.DirectGRN, 0, this.voucher_ID,this.logedInUserID, this.UserSessionID, this.PurchaseInvoiceDetail);
    console.log(invoice);

    this.service.updateInvoice(invoice).then(
      (response) => {
        this.isLoading = false;
        this.getGrid(this.id);
        this.modalReference.close();
      },
      (error) => console.log(error))
    }else
    swal("Please Select Supplier");
    this.isLoading=false;
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(ID, content) {
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none'
      this.submitUpdate='none'
    }
    this.detailOpen(content);
    this.ID = ID;
    this.mode = true;
    this.btnMode = false;
    this.isLoading =true;
    //$("#submitAdd").prop("disabled", true);
    //$("#submitUpdate").prop("disabled", true);
    //this.IfPaymentExists(purchase_Invoice_ID);
    this.service.getInvoiceDetailsByID(ID)
      .subscribe((o: AssetPI) => {
        this.purchase_Invoice_ID = o.purchase_Invoice_ID;
        this.purchase_Order_ID = o.purchase_Order_ID;
        this.supplier_ID = o.supplier_ID;
        this.exchange = o.exchange;
        //if (this.exchange == true)
        //  this.exchanceStatus();
        //else
        //  $("#ex").hide();

        $("#checkboxGRN").prop("disabled", true);

        this.invoice_Date.setDate(o.invoice_Date);
        this.remarks = o.remarks;
        this.voucher_ID = o.voucher_ID;
        this.PurchaseInvoiceDetail = o.PurchaseInvoiceDetail;
        if (o.cancel == 1) {
          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
        sessionStorage.setItem('reportID', "5");
        sessionStorage.setItem('ID', this.purchase_Order_ID);
        //Set PendingSupplier
        this.service.getPendingSupplier(this.priviledged_Offices, o.supplier_ID, this.mode, this.allowInvoice)
          .subscribe(response => {
            this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
          });
        this.isLoading = false;
        //$("#submitAdd").prop("disabled", false);
        //$("#submitUpdate").prop("disabled", false);
      });
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
  // open modal
  open(content) {
    this.getCurrentDay();
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

    $("#submitAdd").show();
    $("#submitAddMore").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    $("#cancelBtn").hide();
    $("#ex").hide();
    this.clearFields();
    ////this.invoiceBeforeGDN();
    ////this.GRNStatus();
    this.getPendingSupplier(this.mode);
  }
  //detailOpen
  detailOpen(content) {
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
    $("#submitAdd").hide();
    $("#submitAddMore").hide();
    $("#submitUpdate").show();
    $("#submitUpdate").prop("disabled", false);
    $("#cancelBtn").show();
    $("#ex").hide();
    this.clearFields();
    ////this.invoiceBeforeGDN();
    ////this.GRNStatus();
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
}
