import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseReturnInvoiceService, LoginService, DayEndService, Supplier, ReturnInvoice, PurchaseReturnInvoiceDetail, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'purchase-return-invoice',
  templateUrl: './purchase-return-invoice.component.html',
  styleUrls: ['./purchase-return-invoice.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class PurchaseReturnInvoiceComponent implements OnInit {
  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility: PermissionUtility = new PermissionUtility();
  ////////////////////////////////////////
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  //Member Varialbes
  p: number = 1;
  modalReference: NgbModalRef;
  suppliers: Array<Select2OptionData> = [];
  orders: any;
  invoices: any;
  orderDetails: any[] = [];
  priviledged_Offices: any = '';
  public supplier_ID: any;
  public supplier_Name: any;
  purchase_Invoice_ID: any = 0;
  invoice_NO: any = '';
  invoice_Amount: any = '';
  ShowPurchaseInvoice: any = '';
  purchase_Return_ID: any;
  purchase_Return_Invoice_ID: any = 0;
  total_Cost: any;
  total_Discount: any;
  freight_Chrgs: any = 0.00;
  total_Amount: any;
  remarks: any;
  public return_Invoice_Date = new cDate();
  public dayEndDate = new cDate();
  item_Code: any;
  quantity: any = 0;
  discount_Rate: any = 0;
  mode: any = 0;
  btnMode: any = 0;
  hideTax = true;
  isTaxable: any;
  taxRate: any;
  taxable: any;
  Invoice: any;
  PurchaseReturnInvoiceDetail: any[] = [];
  guid: any;
  invoice_ID: any = "";
  ID: any = 0;
  prevQty: any = 0;
  isLoading: any = false;
  color = '#0094ff';
  closeResult: string;
  dayEndDetail: any[] = [];
  guidOrder: boolean;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  alerts: Array<any> = [];
  actionID: any = 10;
  cancelReturn: any;
  // End Member Varialbes
  constructor(private service: PurchaseReturnInvoiceService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.PurchaseReturnInvoiceDetail = new Array<PurchaseReturnInvoiceDetail>();
    this.userOffice = this.LoginService.getSession('userOffice');
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
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
    this.searchInvoiceDetails('');
    this.permissomUtility.setPagePermissions(80018);
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
    this.return_Invoice_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    //});
  }
  //changeReturnDate
  changeReturnDate(return_Invoice_Date) {
    if (this.return_Invoice_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.return_Invoice_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //searchInvoiceDetails
  searchInvoiceDetails(value: string) {
    this.isLoading = true;
    this.service.searchInvoiceDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if (response.json() !== null) {
          this.isLoading = false;
          this.invoices = (response.json());
        }
        else {
          this.isLoading = false;
          this.invoices = [];
        }

      });
  }
  //clearValues
  clearFields() {
    //Member Varialbes  
    this.suppliers = [];
    this.orders = [];
    this.orderDetails = [];
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
    this.Invoice = [];
    this.taxFields();
    this.PurchaseReturnInvoiceDetail = [];
    this.guid = UUID.UUID();
    this.getPendingSupplier(this.mode);
  }
  //Total Cost      
  TotalCost() {
    var total_Cost = 0;
    if (this.PurchaseReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.PurchaseReturnInvoiceDetail.length; count++) {
        total_Cost += this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity;
      }
    }

    return total_Cost.toFixed(2);;
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0;
    if (this.PurchaseReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.PurchaseReturnInvoiceDetail.length; count++) {
        total_Discount += ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) * this.PurchaseReturnInvoiceDetail[count].discount_Rate / 100);
      }
    }
    return total_Discount.toFixed(2);;
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0;
    if (this.PurchaseReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.PurchaseReturnInvoiceDetail.length; count++) {
        total_Tax += ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) - ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) * this.PurchaseReturnInvoiceDetail[count].discount_Rate / 100)) / 100 * this.PurchaseReturnInvoiceDetail[count].tax_Rate;
      }
    }
    return total_Tax.toFixed(2);;
  }
  //Total Amount
  TotalAmount() {
    if (this.hideTax == true) {
      var total_Amount = 0;
      if (this.PurchaseReturnInvoiceDetail.length > 0) {
        for (var count = 0; count < this.PurchaseReturnInvoiceDetail.length; count++) {
          total_Amount += (((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) - ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) * this.PurchaseReturnInvoiceDetail[count].discount_Rate / 100)) + ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) - ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) * this.PurchaseReturnInvoiceDetail[count].discount_Rate / 100)) / 100 * this.PurchaseReturnInvoiceDetail[count].tax_Rate);
        }
        if (this.freight_Chrgs != "")

          total_Amount += parseFloat(this.freight_Chrgs);

      }
      return total_Amount.toFixed(2);
    }
    else {
      var total_Amount = 0;
      if (this.PurchaseReturnInvoiceDetail.length > 0) {
        for (var count = 0; count < this.PurchaseReturnInvoiceDetail.length; count++) {
          total_Amount += ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) - ((this.PurchaseReturnInvoiceDetail[count].unit_Price * this.PurchaseReturnInvoiceDetail[count].quantity) * this.PurchaseReturnInvoiceDetail[count].discount_Rate / 100));
        }
        if (this.freight_Chrgs != "")

          total_Amount += parseFloat(this.freight_Chrgs);

      }
      return total_Amount.toFixed(2);
    }
  }
  //showCreate
  showCreate() {
    this.clearFields();
    $("#pnlAdd").show();
    $("#pnlDetail").hide();
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#supplier_ID").prop("disabled", false);
    $("#purchase_Return_ID").prop("disabled", false);
  }
  //hideGrid
  hideGrid() {
    this.mode = true;
    $("#pnlAdd").hide();;
    $("#pnlDetail").show();
    $("#submitAdd").hide();
    $("#submitUpdate").show();
  }
  //editMode
  editMode() {
    this.mode = true;
    $("#pnlAdd").show();
    $("#pnlDetail").hide();
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#supplier_ID").prop("disabled", true);
    $("#purchase_Return_ID").prop("disabled", true);
  }
  //getPendingSupplier
  getPendingSupplier(editmode) {
    this.isLoading = true;
    this.service.getPendingSupplier(this.userCurrentOffice, this.purchase_Return_ID, this.mode)
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        if (this.suppliers.length > 0) {
          if (sessionStorage.getItem("EnableEmptyRow") == '1') {
            this.supplier_ID = 0;
          }
          else {
            this.supplier_ID = this.suppliers[0].id;
          }

          this.isLoading = false;

          $("#submitAdd").prop("disabled", false);
          $("#submitUpdate").prop("disabled", false);
        }
        else {

          this.isLoading = false;
          if (this.mode == false) {
            $("#submitAdd").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
          }

        }
      });
  }
  //supplierChange
  changeSupplier(e: any) {
    if (this.mode == false)
      this.supplier_ID = e;
    this.service.getPendingOrder(this.userCurrentOffice, this.supplier_ID, this.purchase_Return_ID, this.mode)
      .subscribe(response => {
        if (response.json() != null) {
          this.orders = (response.json());

          this.purchase_Return_ID = this.orders[0].purchase_Return_ID;
          this.purchase_Invoice_ID = this.orders[0].purchase_Invoice_ID;
          this.invoice_NO = this.orders[0].invoice_NO;
          this.invoice_Amount = this.orders[0].invoice_Amount;

          if (this.invoice_NO != '')
            this.ShowPurchaseInvoice = '';
          else
            this.ShowPurchaseInvoice = 'none';
          this.PurchaseReturnInvoiceDetail = [];
          this.changeOrder(this.supplier_ID, this.purchase_Return_ID);
        }
        else {
          this.purchase_Invoice_ID = 0;
          this.invoice_NO = '';
          this.invoice_Amount = '';
          this.ShowPurchaseInvoice = 'none';
        }
        //   console.log(response.json());
      });
  }
  //orderChange
  changeOrder(supplier_ID, purchase_Return_ID) {
    this.isLoading = true;


    if (this.orders != null) {
      for (var i = 0; i < this.orders.length; i++) {
        if (this.orders[i].purchase_Return_ID == this.purchase_Return_ID) {
          this.purchase_Invoice_ID = this.orders[i].purchase_Invoice_ID;
          this.invoice_NO = this.orders[0].invoice_NO;
          this.invoice_Amount = this.orders[0].invoice_Amount;
        }
        else {
          this.purchase_Invoice_ID = 0;
          this.invoice_NO = '';
          this.invoice_Amount = '';
        }
      }
    }

    if (this.invoice_NO != '')
      this.ShowPurchaseInvoice = '';
    else
      this.ShowPurchaseInvoice = 'none';

    this.service.getPendingOrderDetails(this.supplier_ID, this.purchase_Return_ID, this.purchase_Return_Invoice_ID, this.purchase_Invoice_ID, this.userCurrentOffice, this.userCurrentWarehouse, this.mode)
      .subscribe(response => {
        if (this.supplier_ID == 0 && this.btnMode == true) {
          this.orders = [];
        }
        else {

          if (response.json() != null) {
            this.PurchaseReturnInvoiceDetail = (response.json());
            $("#submitAdd").prop("disabled", false);
          }

        }
        this.isLoading = false;
      });
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(purchase_Return_Invoice_ID, content) {
    this.isLoading = true;
    this.detailOpen(content);
    this.ID = purchase_Return_Invoice_ID;
    this.mode = true;
    this.btnMode = false;
    this.service.getInvoiceDetailsByID(purchase_Return_Invoice_ID)
      .subscribe((o: ReturnInvoice) => {
        this.purchase_Return_Invoice_ID = o.purchase_Return_Invoice_ID;
        this.purchase_Return_ID = o.purchase_Return_ID;
        this.return_Invoice_Date.setDate(o.return_Invoice_Date);
        this.total_Discount = o.total_Discount;
        this.freight_Chrgs = o.freight_Chrgs;
        this.remarks = o.remarks;

        if (o.adjustable == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
          $("#cancelBtn").prop("disabled", false);
        }

        this.service.getPendingSupplier(this.priviledged_Offices, this.purchase_Return_ID, this.mode)
          .subscribe(response => {
            if (response.status === 204) {
              this.isLoading = false;
              $("#submitAdd").prop("disabled", true);
              return undefined;
            } else {
              this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
              if (this.suppliers != null) {
                for (let i = 0; i < this.suppliers.length; i++) {
                  if (this.suppliers[i].id == o.supplier_ID) {
                    this.supplier_ID = this.suppliers[i].id;
                    break;
                  }
                }
                this.changeSupplier(this.supplier_ID);
              }
              this.isLoading = false;

            }
          });
        this.isLoading = false;
      });

  }
  //setValues
  setValues(priviledged_Offices, supplier_ID, purchase_Return_ID, purchase_Return_Invoice_ID) {

    this.service.getPendingSupplier(priviledged_Offices, purchase_Return_ID, true)
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
      });

    ////Set PendingOrder        
    //this.service.getPendingOrder(priviledged_Offices, supplier_ID, purchase_Return_ID, true)
    //  .subscribe(response => {
    //    this.orders = (response.json());
    //   // console.log((response.json()));
    //  });
    //this.purchase_Return_ID = purchase_Return_ID;
    //Set PendingOrderDetails   
    //this.service.getPendingOrderDetails(supplier_ID, purchase_Return_ID, purchase_Return_Invoice_ID, true)
    //  .subscribe(response => {
    //    this.PurchaseReturnInvoiceDetail = (response.json());
    //    this.prevQty = this.PurchaseReturnInvoiceDetail.quantity;
    //    this.PurchaseReturnInvoiceDetail[0].prevQty = this.prevQty;
    //  });
  }
  //changeMode
  changeMode(idx: any, i: PurchaseReturnInvoiceDetail, Mode: any) {

    var flag = false;
    if (this.PurchaseReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.PurchaseReturnInvoiceDetail.length; count++) {
        if (this.PurchaseReturnInvoiceDetail[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {
      if (flag == false) {
        //  console.log(i);
        if (i.quantity > 0) {
          i.edit_Mode = false;
          i.purchase_Cost = (i.unit_Price * i.quantity);
          i.discount_Amount = ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100);
          i.net_Amount = ((i.quantity) * (i.unit_Price) - ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100));
        } else {
          swal("Quantity should be greater then 0");
        }
      } else {
        swal("Already Exists");
      }
    }
    else {
      console.log(i);
      i.edit_Mode = true;
    }

  }
  //changeRate
  changeRate(i: PurchaseReturnInvoiceDetail) {
    if (i.discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (i.discount_Rate <= 0) {
      i.discount_Rate = 0;
    }
    i.discount_Amount = (i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100;
    i.tax_Amount = (((i.quantity * i.unit_Price) - ((i.quantity * i.unit_Price) * i.discount_Rate / 100)) / 100 * i.tax_Rate).toFixed(2);
    i.net_Amount = (((i.quantity * i.unit_Price) - ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100)) + ((i.quantity * i.unit_Price) - ((i.quantity * i.unit_Price) * i.discount_Rate / 100)) / 100 * i.tax_Rate).toFixed(2);
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
  //taxFields
  taxFields() {

    if (this.LoginService.getSession('settingTaxOnPurchase') != '1') {
      this.hideTax = false;
      this.isTaxable = 0;
      this.taxRate = 0;
      $("#lblTotalTax").hide();
    }
    else {
      this.hideTax = true;
      this.isTaxable = this.LoginService.getSession('isTaxable');
      this.taxRate = this.LoginService.getSession('taxRate');
      $("#lblTotalTax").show();
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
          this.service.cancelInvoice(this.purchase_Return_Invoice_ID, this.actionID)
            .subscribe(response => {
              swal("Poof! Your invoice has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              this.searchInvoiceDetails('');
              this.modalReference.close();
            });
        } else {
          swal("Your invoice is safe!");
        }
      });
  }
  //saveInvoice
  saveInvoice(purchase_Return_Invoice_ID: any, return_Invoice_Date: any, return_Invoice_NO: any, office_Code: any,
    supplier_ID: any, purchase_Return_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {

    var invoice = new ReturnInvoice(purchase_Return_Invoice_ID, this.return_Invoice_Date.getDateFinal(), 0, this.userCurrentOffice,
      supplier_ID, purchase_Return_ID, this.purchase_Invoice_ID, total_Cost, total_Discount, total_Tax,
      total_Amount, balanceAmount, paidAmount, this.freight_Chrgs, 0, remarks, this.guid, this.mode, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.PurchaseReturnInvoiceDetail);
    console.log(invoice);
    console.log(this.PurchaseReturnInvoiceDetail);

    this.service.saveInvoice(invoice).then(
      (response) => {
        this.searchInvoiceDetails('');
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))
  }
  //updateInvoice
  updateInvoice(purchase_Return_Invoice_ID: any, return_Invoice_Date: any, return_Invoice_NO: any, office_Code: any,
    supplier_ID: any, purchase_Return_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {

    var invoice = new ReturnInvoice(purchase_Return_Invoice_ID, this.return_Invoice_Date.getDateFinal(), 0, this.userCurrentOffice,
      supplier_ID, purchase_Return_ID, this.purchase_Invoice_ID, total_Cost, total_Discount, total_Tax,
      this.TotalAmount(), balanceAmount, paidAmount, this.freight_Chrgs, 0, remarks, this.guid, this.mode, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.PurchaseReturnInvoiceDetail);
    console.log(invoice);
    this.service.updateInvoice(invoice).then(
      (response) => {
        this.searchInvoiceDetails('');
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))
    this.hideGrid();

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
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    this.clearFields();

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
    $("#submitAdd").hide();
    $("#submitUpdate").show();
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
  // end of modal
}
