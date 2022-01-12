import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleReturnInvoiceService, LoginService, DayEndService, customer, SaleReturnInvoice, SaleReturnInvoiceDetail, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';


@Component({
  selector: 'sale-return-invoice',
  templateUrl: './sale-return-invoice.component.html',
  styleUrls: ['./sale-return-invoice.component.scss'],
  host: { '(window:keydown)': 'hotkeys($event)' },
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class SaleReturnInvoiceComponent implements OnInit {
  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;

  ////////////////////////////////////////
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  //Member Varialbes
  p: number = 1;
  modalReference: NgbModalRef;
  customers: Array<Select2OptionData> = [];
  orders: any[] = [];
  invoices: any;
  orderDetails: any[] = [];
  priviledged_Offices: any = 1;
  public customer_ID: any;
  public customer_Name: any;
  sale_Invoice_ID: any = 0;
  invoice_NO: any = '';
  invoice_Amount: any = '';
  return_Amount: any = '';
  ShowSaleInvoice: any = '';
  sale_Return_ID: any;
  sale_Return_Invoice_ID: any = 0;
  total_Cost: any;
  total_Discount: any;
  freight_Chrgs: any = 0.00;
  special_Discount: any = 0.00;
  total_Amount: any;
  remarks: any;
  public return_Invoice_Date = new cDate();
  public dayEndDate = new cDate();
  item_Code: any;
  quantity: any = 0;
  discount_Rate: any = 0;
  mode: any = 0;
  btnmode: any = 0;
  hideTax: any = true;
  isTaxable: any;
  taxRate: any;
  taxable: any;
  cancelReturn: any;
  Invoice: any;
  SaleReturnInvoiceDetail: any[] = [];

  guid: any;
  invoice_ID: any = "";
  ID: any = 0;
  prevQty: any = 0;
  isLoading: any = false;
  color = '#0094ff';
  closeResult: string;
  dayEndDetail: any[] = [];
  guidOrder: boolean;
  alerts: Array<any> = [];
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  actionID: any = 11;
  public permissionUtility: PermissionUtility = new PermissionUtility
  constructor(private service: SaleReturnInvoiceService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.SaleReturnInvoiceDetail = new Array<SaleReturnInvoiceDetail>();
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
    this.getCurrentDay();
    this.searchInvoiceDetails('');
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissionUtility.setPagePermissions(140010);
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
    this.service.searchInvoiceDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if (response.json() !== null) {
          this.invoices = (response.json());
        } else {
          this.invoices = [];
        }
      });
  }
  //clearFields
  clearFields() {
    //Member Varialbes  
    // this.customers = [];
    this.orders = [];
    this.orderDetails = [];
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.total_Cost = 0;
    this.total_Discount = 0;
    this.freight_Chrgs = 0.00;
    this.special_Discount = 0.00;
    this.total_Amount = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.quantity = 0;
    this.discount_Rate = 0;
    this.mode = false;
    this.btnmode = true;
    this.Invoice = [];
    this.taxFields();
    this.sale_Invoice_ID = 0;
    this.SaleReturnInvoiceDetail = [];
    this.guid = UUID.UUID();
    this.getPendingCustomer(this.mode);
  }
  //Total Cost      
  TotalCost() {
    var total_Cost = 0;
    if (this.SaleReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.SaleReturnInvoiceDetail.length; count++) {
        total_Cost += this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity;
      }
    }

    return total_Cost.toFixed(2);;
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0;
    if (this.SaleReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.SaleReturnInvoiceDetail.length; count++) {
        total_Discount += ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) * this.SaleReturnInvoiceDetail[count].discount_Rate / 100);
      }
    }
    return total_Discount.toFixed(2);;
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0;
    if (this.SaleReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.SaleReturnInvoiceDetail.length; count++) {
        total_Tax += ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) - ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) * this.SaleReturnInvoiceDetail[count].discount_Rate / 100)) / 100 * this.SaleReturnInvoiceDetail[count].tax_Rate;
      }
    }
    return total_Tax.toFixed(2);;
  }
  //Total Amount
  TotalAmount() {
    if (this.hideTax == true) {
      var total_Amount = 0;
      if (this.SaleReturnInvoiceDetail.length > 0) {
        for (var count = 0; count < this.SaleReturnInvoiceDetail.length; count++) {
          total_Amount += (((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) - ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) * this.SaleReturnInvoiceDetail[count].discount_Rate / 100)) + ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) - ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) * this.SaleReturnInvoiceDetail[count].discount_Rate / 100)) / 100 * this.SaleReturnInvoiceDetail[count].tax_Rate);
        }
        if (this.freight_Chrgs > 0)
          total_Amount += parseFloat(this.freight_Chrgs);

        if (this.special_Discount > 0)
          total_Amount -= parseFloat(this.special_Discount);

      }
      return total_Amount.toFixed(2);
    }
    else {
      var total_Amount = 0;
      if (this.SaleReturnInvoiceDetail.length > 0) {
        for (var count = 0; count < this.SaleReturnInvoiceDetail.length; count++) {
          total_Amount += ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) - ((this.SaleReturnInvoiceDetail[count].unit_Price * this.SaleReturnInvoiceDetail[count].quantity) * this.SaleReturnInvoiceDetail[count].discount_Rate / 100));
        }
        if (this.freight_Chrgs > 0)

          total_Amount += parseFloat(this.freight_Chrgs);
        if (this.special_Discount > 0)
          total_Amount -= parseFloat(this.special_Discount);
      }
      return total_Amount.toFixed(2);
    }
  }
  //getPendingCustomer
  getPendingCustomer(mode) {
    this.service.getPendingCustomer(this.userCurrentOffice, this.sale_Return_ID, this.mode)
      .subscribe(response => {
        this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
        if (this.customers.length > 0) {
          if (sessionStorage.getItem("EnableEmptyRow") == '1') {
            this.customer_ID = 0;
          }
          else {
            this.customer_ID = this.customers[0].id;;
          }
          this.service.getPendingOrder(this.userCurrentOffice, this.customer_ID, this.sale_Return_ID, this.mode)
            .subscribe(response => {
              this.orders = (response.json());
              if (this.orders != null) {
                this.sale_Return_ID = this.orders[0].sale_Return_ID;
                this.sale_Invoice_ID = this.orders[0].sale_Invoice_ID;
                this.changeOrder(this.customer_ID, this.sale_Return_ID, this.sale_Invoice_ID);
              }
            });
          this.isLoading = false;
          $("#submitAdd").prop("disabled", false);
          //  console.log(response.json());
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
  //changeCustomer
  changeCustomer(e: any) {
    this.isLoading = true;

    if (e.value > 0) {
      if (this.mode == false)
        this.customer_ID = e;
    }
    this.service.getPendingOrder(this.userCurrentOffice, this.customer_ID, this.sale_Return_ID, this.mode)
      .subscribe(response => {
        this.orders = (response.json());
        if (this.orders != null) {
          this.sale_Return_ID = this.orders[0].sale_Return_ID;
          this.sale_Invoice_ID = this.orders[0].sale_Invoice_ID;
          this.invoice_NO = this.orders[0].invoice_NO;
          this.invoice_Amount = this.orders[0].invoice_Amount;
          this.return_Amount = this.orders[0].return_Amount;

          if (this.invoice_NO != '')
            this.ShowSaleInvoice = '';
          else
            this.ShowSaleInvoice = 'none';

          this.SaleReturnInvoiceDetail = [];
          this.changeOrder(this.customer_ID, this.sale_Return_ID, this.sale_Invoice_ID);
        }
        else {
          this.sale_Invoice_ID = 0;
          this.invoice_NO = '';
          this.invoice_Amount = '';
          this.ShowSaleInvoice = 'none';
          this.isLoading = false;
        }


      });

  }
  //orderChange
  changeOrder(customer_ID, sale_Return_ID, sale_Invoice_ID) {
    this.isLoading = true;

    if (this.orders != null) {
      var salereturn = this.orders.filter(r => r.sale_Return_ID == this.sale_Return_ID)
      if (salereturn !== null) {
        this.sale_Invoice_ID = salereturn[0].sale_Invoice_ID;
        this.invoice_NO = salereturn[0].invoice_NO;
        this.invoice_Amount = salereturn[0].invoice_Amount;
      }
      else {
        this.sale_Invoice_ID = 0;
        this.invoice_NO = '';
        this.invoice_Amount = '';
      }
    }

    if (this.invoice_NO != '')
      this.ShowSaleInvoice = '';
    else
      this.ShowSaleInvoice = 'none';

    this.SaleReturnInvoiceDetail = [];
    this.service.getPendingOrderDetails(this.customer_ID, this.sale_Return_ID, this.sale_Return_Invoice_ID, this.sale_Invoice_ID, this.userCurrentOffice, this.userCurrentWarehouse, this.mode)
      .subscribe(response => {

        if (this.customer_ID == 0 && this.btnmode == true && sessionStorage.getItem("EnableEmptyRow")) {
          this.orders = [];
        }
        else {

          if (response.json() != null) {
            console.clear();
            console.log(response.json());
            this.SaleReturnInvoiceDetail = (response.json());

            $("#submitAdd").prop("disabled", false);
          }

        }
        this.isLoading = false;
      });

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
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(sale_Return_Invoice_ID, content) {
    this.detailOpen(content);
    this.ID = sale_Return_Invoice_ID;
    this.btnmode = false;
    this.mode = true;
    this.isLoading = true;
    this.service.getInvoiceDetailsByID(sale_Return_Invoice_ID)
      .subscribe((o: SaleReturnInvoice) => {
        this.remarks = o.remarks;
        this.sale_Return_Invoice_ID = o.sale_Return_Invoice_ID;
        this.sale_Return_ID = o.sale_Return_ID;
        this.return_Invoice_Date.setDate(o.return_Invoice_Date);
        this.total_Discount = o.total_Discount;
        this.freight_Chrgs = o.freight_Chrgs;
        this.special_Discount = o.special_Discount;

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
        this.service.getPendingCustomer(this.priviledged_Offices, this.sale_Return_ID, this.mode)
          .subscribe(response => {
            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            if (this.customers.length > 0) {

              this.customer_ID = o.customer_ID;
              //this.changeCustomer(this.customer_ID);
              this.isLoading = false;
              $("#submitAdd").prop("disabled", false);
            }
          });
      });

  }
  //changeMode
  changeMode(idx: any, i: SaleReturnInvoiceDetail, Mode: any) {

    var flag = false;
    if (this.SaleReturnInvoiceDetail.length > 0) {
      for (var count = 0; count < this.SaleReturnInvoiceDetail.length; count++) {
        if (this.SaleReturnInvoiceDetail[count].item_Code == i.item_Code && idx != count) {
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
          i.sale_Cost = (i.unit_Price * i.quantity);
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
  changeRate(i: SaleReturnInvoiceDetail) {
    if (i.discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (i.discount_Rate <= 0) {
      i.discount_Rate = 0;
    }
    i.discount_Amount = ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100).toFixed(2);
    i.tax_Amount = (((i.quantity * i.unit_Price) - ((i.quantity * i.unit_Price) * i.discount_Rate / 100)) / 100 * i.tax_Rate);
    i.net_Amount = ((i.quantity * i.unit_Price) - ((i.quantity * i.unit_Price) * (i.discount_Rate) / 100) + i.tax_Amount).toFixed(2);

  }
  //taxFields
  taxFields() {
    if (this.LoginService.getSession('settingTaxOnSale') != '1') {
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
          this.service.cancelInvoice(this.sale_Return_Invoice_ID, this.actionID)
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
  saveInvoice(sale_Return_Invoice_ID: any, return_Invoice_Date: any, return_Invoice_NO: any, office_Code: any,
    customer_ID: any, sale_Return_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {
    var flag = true;
    if (this.sale_Invoice_ID > 0) {
      if (total_Amount <= this.invoice_Amount) {
        flag = true;
      }
      else {
        flag = false;
        swal("NetPayable Must Be Equal or Less Than Invoice Amount");
      }
    }
    else {
      flag = true
    }

    if (flag) {

      var invoice = new SaleReturnInvoice(sale_Return_Invoice_ID, this.return_Invoice_Date.getDateFinal(), 0, this.userCurrentOffice,
        customer_ID, sale_Return_ID, this.sale_Invoice_ID, total_Cost, total_Discount, total_Tax, this.freight_Chrgs, this.special_Discount,
        total_Amount, balanceAmount, paidAmount, 0, remarks, this.guid, this.mode, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.SaleReturnInvoiceDetail);
      console.log(invoice);
      this.isLoading = true;

      this.service.guidExist(this.guid)
        .subscribe(response => {
          this.guidOrder = (response.json());
          if (this.guidOrder == false) {
            this.service.saveInvoice(invoice).then(
              (response) => {
                this.isLoading = false;
                this.searchInvoiceDetails('');
                this.modalReference.close();
                console.log(response);
              },
              (error) => console.log(error))
          }
          else {
            this.isLoading = false;
            swal("Error: Already exists.");
          }
        });
    }
  }
  //updateInvoice
  updateInvoice(sale_Return_Invoice_ID: any, return_Invoice_Date: any, return_Invoice_NO: any, office_Code: any,
    customer_ID: any, purchase_Return_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
    total_Amount: any, balanceAmount: any, paidAmount: any, remarks: any, mode: any) {

    var invoice = new SaleReturnInvoice(this.ID, this.return_Invoice_Date.getDateFinal(), 0, this.userCurrentOffice,
      customer_ID, purchase_Return_ID, this.sale_Invoice_ID, total_Cost, total_Discount, total_Tax, this.freight_Chrgs, this.special_Discount,
      total_Amount, balanceAmount, paidAmount, 0, remarks, this.guid, this.mode, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.SaleReturnInvoiceDetail);
    console.log(invoice);
    this.service.updateInvoice(invoice).then(
      (response) => {
        this.service.getInvoives();
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))

    // this.ClearFields();
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


