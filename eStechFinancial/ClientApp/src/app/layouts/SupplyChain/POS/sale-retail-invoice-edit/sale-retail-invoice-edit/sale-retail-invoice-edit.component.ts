import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleOrderService, LoginService, SearchFilterService, saleOrder, Customers, CustomerService, saleOrderDetails, itemStockIMEI, EmailAlertService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'sale-retail-invoice-edit',
  templateUrl: './sale-retail-invoice-edit.component.html',
  styleUrls: ['./sale-retail-invoice-edit.component.scss'],
  host: { '(window:keydown)': 'hotkeys($event)' }
})
export class SaleRetailInvoiceEditComponent implements OnInit, AfterViewChecked {


  sender: any = 0;
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  modalReferenceMail: NgbModalRef;
  order: any;
  orders: any[];
  users: any[];
  customers: Array<Select2OptionData>;
  contacts: any[];
  items: Array<Select2OptionData>;
  unitPrices: any[];
  unit_Price: any = 0;
  payments: any[];
  saleOrderDetails: any[] = [];
  stocks: any[];
  saleOrderDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  editMode = false;
  index = 1;
  order_Envoy: number;
  supplier_ID: number;
  public customer_ID: any;
  public customer_Name: any;
  contact_ID: any = 0;
  sale_Order_ID = 0;
  Office_Code: any;
  sO_NO: any;
  method_Id: any = 1;
  payment_ID: any = 1;
  freight_Id: any = 1;
  total_Cost: any;
  total_discount: any;
  discount_Amount: any;
  freight_Chrgs: any = 0.00;
  total_Amount: any = 0;
  paid_Amount: any = 0;
  remarks: any;
  public item_Code: any = 1;
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  Discount_Rate: any = 0;
  Tax_Rate: any = 0;
  item_ID: any = 0;
  guid: any;
  cguid: any;
  mode: any = 0;
  order_ID: any = "";
  stock_Qty: any = 0;
  pending: any = 0;
  isLoading: boolean = false;
  guidOrder: boolean;
  status: any;
  IsDirect: any = true;
  frieght_Id: any = 1;
  closeResult: string;
  isView: any = true;
  ShowIMEI: any = false;

  date = new Date();
  sO_Date: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  delivery_Date: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  Shipping_Date: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  payment_Date: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  alerts: Array<any> = [];
  hide = true;
  hideStock = true;
  hidePending = true;
  discountEditing = true;
  isTaxable: any;
  taxRate: any;
  taxable: any;
  idd: any;
  sd_Rate: any = 0;
  sd_Amount: any = 0;
  rate: any = 0;
  tax_Amount: any = 0.00;
  tax_Rate: any = 0;
  method_ID: any;
  cash: any = 0;
  balance: any = 0;
  adjust: any = 0;
  getPaymentMethods: any;
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;
  templatecode: any = this.LoginService.getSession('DefaultCompanyTemplate');
  templatename: any = '';
  templateshow: any = '';
  companytemplate: any[] = [];

  category_Code: any = 0;
  warrantyID: any = 1;
  warrantyName: any = "";
  colorID: any = 1;
  colorName: any = "";
  imei: string = "";
  itemStockIMEI: any[];
  aQuantity: any = 0;
  flagExists: any = false;
  detail: any[];
  credit_Limit: any = 0;
  netPayable: any = 0;
  totalAmount: any = 0;
  totalNetPayable: any = 0;
  areaenable: any = 0;
  areashow: any = 'none';
  area: any[] = [];
  areacode: any = 1;
  areaname: any = '';
  allitems: any[] = [];
  orderID: any = '';
  imeiLength: any = 15;
  cancelReturn: any;
  unit: any = "";
  public permissionUtility: PermissionUtility = new PermissionUtility();
  constructor(
    private LoginService: LoginService,
    private searchfilter: SearchFilterService,
    private customerService: CustomerService,
    private service: SaleOrderService,
    private emailService: EmailAlertService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    this.saleOrderDetails = new Array<saleOrderDetails>();
    this.itemStockIMEI = new Array<itemStockIMEI>();
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
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
    this.clearFields();
    this.orderID = sessionStorage.getItem('sale_Order_ID');
    this.logedInUserID = this.LoginService.getSession('user_ID');

    this.getDetailsByID(this.orderID);
    this.permissionUtility.setPagePermissions(140051);
    //this.getSaleOrders();
    $("#imei").focus().val('');
  }
  //imei no. limit
  ImeiNumberValue(event:KeyboardEvent){
    var value = $("#number").val(); 
    var preV = value.toString().substr(0, value.toString().length - 1); 
    if(value>15){ 
      swal("Imei can not be greater than 15");
     this.imeiLength=preV;
     }
     /* if(value<3){
      this.imeiLength=3;
     } */
    }
  //getSaleOrders
  getSaleOrders() {
    //getSaleOrders
    this.isLoading = true;
    this.service.getSaleOrders()
      .subscribe(response => {
        this.order = (response.json());
        this.idd = this.order[0].sale_Order_ID;
        //  console.log(response.json());
        this.isLoading = false;
      });
  }
  //searchOrderDetails
  searchSaleOrders(value: string) {
    this.service.searchSaleOrders(value, this.userPrivilegedOffice)
      .subscribe(response => {
        this.order = (response.json());
      });
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.users = (response.json());
        this.order_Envoy = this.users[0].order_Envoy;
        if (this.users != null) {
          for (let i = 0; i < this.users.length; i++)
            if (this.users[i].order_Envoy == this.logedInUserID) {
              this.order_Envoy = this.users[i].order_Envoy;
            }
            else { this.order_Envoy = this.users[0].order_Envoy; }
        }
        else { this.order_Envoy = this.users[0].order_Envoy; }
        //console.log(this.users);
      });
  }
  //getCustomers
  getCustomers(AreaID) {

    this.isLoading = true;
    this.service.getCustomersForSO(AreaID)
      .subscribe(response => {
        this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
        this.customer_ID = this.customers[0].id;

        //getContacts
        this.service.getContacts(this.customer_ID)
          .subscribe(response => {
            this.contacts = response.json();
            this.contact_ID = this.contacts[0].contact_ID;
            if(this.contacts[0].credit_Limit!=null || this.contacts[0].credit_Limit!='')
            {this.credit_Limit = this.contacts[0].credit_Limit;}
            if(this.contacts[0].credit_Limit=='' || this.contacts[0].credit_Limit==null){
            this.credit_Limit = 0;}
            this.netPayable = this.contacts[0].netPayable;

            if (sessionStorage.getItem('EnableCustomerDiscount') != "1")
              if (sessionStorage.getItem('EnableDiscountGroup') != "0")
                this.Discount_Rate = this.contacts[0].discountRate;
            this.isLoading = false;
            //console.log(response.json());
          });
      });
  }
  loadItem(imei) {
    if (imei.length > 0) {
      if (imei.length == this.imeiLength) {
        let tmparr = this.detail;
        let arr1 = tmparr.filter(i => i.imei == imei);

        if (arr1 != null) {
          if (arr1.length > 0) {

            let idx = this.items.findIndex(c => c.id == arr1[0].item_Code);

            this.item_Code = this.items[idx].id;
            this.item_Name = this.items[idx].text;
            this.sender = 1;
            if (this.imei.length > 0) {
              this.getImeiItem(this.item_Code);
              $("#imei").focus().val('');
            }
          }
          else {
            this.imei = '';
            swal("Serial# / IMEI# does not exist in Stock.").then(r => {
              $("#imei").focus().val('');
            });
          }
        } else {
          this.imei = '';
          swal("Serial# / IMEI# does not exist in Stock.").then(r => {
            $("#imei").focus().val('');
          });
        }
        $("#submitAdd").prop("disabled", false);
      }
      else {
        swal("IMEI# is invalid");
        $("#submitAdd").prop("disabled", true);
      }
    }
  }
  getImeiItem(item_Code: any) {
    if (this.sessionEnableTextboxItem != 1) {
      this.Quantity = 1;
      this.category_Code = 0;
      this.unit_Price = 0;
      this.item_Name = '';
      this.stock_Qty = 0;
      this.pending = 0;
      this.taxable = 0;
      this.Discount_Rate = 0;
      this.taxratecode = 1;
      this.Tax_Rate = 0;


      this.item_Code = item_Code;

      this.service.getUnitPrice(this.item_Code, 0, false, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.unit)
        .subscribe(response => {
          this.unitPrices = (response.json());

          if (response.json() != null) {
            this.category_Code = this.unitPrices[0].category_Code;
            this.unit_Price = this.unitPrices[0].unit_Price;
            this.item_Name = this.unitPrices[0].item_Name;
            this.stock_Qty = this.unitPrices[0].stock_Qty;
            this.pending = this.unitPrices[0].pending;
            this.taxable = this.unitPrices[0].taxable;
            this.category_Code = this.unitPrices[0].category_Code;
            this.Discount_Rate = this.unitPrices[0].discountRate;
            //getContacts
            this.service.getContacts(this.customer_ID)
              .subscribe(response => {
                var cont = response.json();
                if (response.json() != null) {
                  if (sessionStorage.getItem('EnableCustomerDiscount') != "1")
                    if (sessionStorage.getItem('EnableDiscountGroup') != "0")
                      this.Discount_Rate = cont[0].discountRate;
                }
              });
            this.changeItem(this.item_Code);
            if (this.taxable == true && this.taxcode != 1) {
              this.taxratecode = this.unitPrices[0].taxtypeid;
              $("#TaxRateDropDown").prop("disabled", false);
            }
            else {
              this.taxratecode = 1;
              this.Tax_Rate = 0;
              $("#TaxRateDropDown").prop("disabled", true);
            }
            this.changeTaxRate();

            if (this.imei.length > 0) {
              this.addGrid(this.item_Code, this.item_Name, this.unit_Price, 1, this.Discount_Rate, this.Tax_Rate, this.imei)
              $("#imei").focus().val('');
            }
          }

        });
    }

  }
  removeData(idx: any, i: itemStockIMEI, Mode: any) {

    let pos = this.saleOrderDetails.findIndex(f => f.item_Code == i.item_Code);
    if (pos > -1) {
      if (this.saleOrderDetails[pos].quantity > 1) {
        this.saleOrderDetails[pos].quantity -= 1;
      }
      else {
        this.saleOrderDetails.splice(pos, 1);
      }
      
      let posimei=this.itemStockIMEI.findIndex(f => f.imei == i.imei);
      if (posimei > -1) {
      this.itemStockIMEI.splice(posimei, 1);
      }
    }
  }
  //getItems  
  getItems() {
    this.service.getItems()
      .subscribe(response => {
        if (response.json() != null) {
          console.log(response.json());
          this.allitems = response.json();
          this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
          this.item_Code = this.items[0].id;
          this.item_Name = this.items[0].text;
        }
      });
  }
  //changeItem
  changeItems(e: any, sender: any) {
    if (this.sessionEnableTextboxItem != 1) {
      if (sender == 0) {
        this.item_Code = e;
        this.getImeiItem(this.item_Code);
        this.sender = 0;
      }
    }
  }
  //getPayments
  getPayments() {
    this.service.getPayments()
      .subscribe(response => {
        this.payments = (response.json());
        // console.log(response.json());
      });
  }
  //paymentMethod
  paymentMethod() {
    //getPaymentMethods
    this.service.getPaymentMethods()
      .subscribe(response => {
        this.getPaymentMethods = (response.json());
        //   this.method_ID = this.getPaymentMethods[0].method_ID;

      });
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
      this.areacode = 1;
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
          }
          else {
            this.areacode = this.area[0].areacode;
            this.areaname = this.area[0].areaname;
          }
        }
      });
  }
  //changeCustomer
  changeCustomer(e: any) {
    if (this.sessionEnableTextboxCustomer != 1) {
      this.customer_ID = e;
      this.service.getContacts(this.customer_ID)
        .subscribe(response => {
          this.contacts = (response.json());
          this.contact_ID = this.contacts[0].contact_ID;
          this.taxcode = this.contacts[0].taxcode;
          if(this.contacts[0].credit_Limit!=null || this.contacts[0].credit_Limit!='')
          {this.credit_Limit = this.contacts[0].credit_Limit;}
          if(this.contacts[0].credit_Limit=='' || this.contacts[0].credit_Limit==null){
          this.credit_Limit = 0;}
          this.netPayable = this.contacts[0].netPayable;
          if (sessionStorage.getItem('EnableCustomerDiscount') != "1")
            if (sessionStorage.getItem('EnableDiscountGroup') != "0")
              this.Discount_Rate = this.contacts[0].discountRate;
          this.checkTaxCode();

        });
    }
  }
  //frieghtChange
  frieghtChange = function () {
    var PaymentTerm = this.frieght_Id;

    if (PaymentTerm == 1) {
      $("#freightlbl").hide();
      $("#freighttxt").hide();
      this.freight_Chrgs = 0;
      //document.getElementById("freightlbl").style.display = "none";
      //document.getElementById("freighttxt").style.display = "none";
    }
    else {
      $("#freightlbl").show();
      $("#freighttxt").show();
      //document.getElementById("freightlbl").style.display = "block";
      //document.getElementById("freighttxt").style.display = "block";
      this.freight_Chrgs = 1;
    }
  }
  //paymentTermChange
  paymentTermChange = function () {
    var PaymentTerm = this.payment_ID;
    var today = new Date();
    var millies = Date.parse(this.today);
    var newDate = new Date();
    var dd = 0;
    var mm = 0;
    var yyyy = 0;

    if (PaymentTerm == 1) {

      document.getElementById("paymentDateLbl").style.display = "none";
      document.getElementById("paymentDateTxt").style.display = "none";
      dd = today.getDate();
      mm = today.getMonth() + 1;//January is 0!
      yyyy = today.getFullYear();

      if (dd < 10) { this.dd = '0' + dd }
      if (mm < 10) { this.mm = '0' + mm }
      this.paymentDate = yyyy + '/' + mm + '/' + dd;

    } else if (PaymentTerm == 2) {

      newDate.setDate(newDate.getDate() + 10);
      dd = newDate.getDate();
      mm = newDate.getMonth() + 1;//January is 0!
      yyyy = newDate.getFullYear();
      if (dd < 10) { this.dd = '0' + dd }
      if (mm < 10) { this.mm = '0' + mm }

      document.getElementById("paymentDateLbl").style.display = "block";
      document.getElementById("paymentDateTxt").style.display = "block";

      this.paymentDate = yyyy + '/' + mm + '/' + dd;
    }
    else if (PaymentTerm == 3) {
      newDate.setDate(newDate.getDate() + 15);
      this.dd = newDate.getDate();
      this.mm = newDate.getMonth() + 1;//January is 0!
      this.yyyy = newDate.getFullYear();
      if (this.dd < 10) { this.dd = '0' + this.dd }
      if (this.mm < 10) { this.mm = '0' + this.mm }

      document.getElementById("paymentDateLbl").style.display = "block";
      document.getElementById("paymentDateTxt").style.display = "block";
      this.paymentDate = yyyy + '/' + mm + '/' + dd;

    }
    else if (PaymentTerm == 4) {

      newDate.setDate(newDate.getDate() + 20);
      this.dd = newDate.getDate();
      this.mm = newDate.getMonth() + 1;//January is 0!
      this.yyyy = newDate.getFullYear();
      if (this.dd < 10) { this.dd = '0' + this.dd }
      if (this.mm < 10) { this.mm = '0' + this.mm }

      document.getElementById("paymentDateLbl").style.display = "block";
      document.getElementById("paymentDateTxt").style.display = "block";
      this.paymentDate = this.dd + '/' + this.mm + '/' + this.yyyy;

    } else {
      document.getElementById("paymentDateLbl").style.display = "none";
      document.getElementById("paymentDateTxt").style.display = "none";
      this.paymentDate = "";
    }

  }
  //ShipMethodList
  ShipMethodList = [
    { "method_Id": 1, "method_Name": "Airborne" }
    , { "method_Id": 2, "method_Name": "DHL" }
    , { "method_Id": 3, "method_Name": "UPS" }
    , { "method_Id": 4, "method_Name": "Postal Mail" }
    , { "method_Id": 5, "method_Name": "Other" }]
  //FrieghtTermsList
  FrieghtTermsList = [
    { "frieght_Id": 1, "frieght_Name": "No Charge" }
    , { "frieght_Id": 2, "frieght_Name": "FOB" }
  ]
  //clearFields
  clearFields() {
    this.cash = 0;
    this.unit_Price = 0;
    this.order_Envoy = 1;
    this.supplier_ID = 1;
    this.sale_Order_ID = 0;
    this.Office_Code = 1;
    this.sO_NO = 0;
    //this.customer_ID = 1;
    this.contact_ID = 0;
    this.method_Id = 1;
    this.payment_ID = 1;
    this.freight_Id = 1;
    this.total_Cost = 0;
    this.discount_Amount = 0;
    this.freight_Chrgs = 0.00;
    this.total_Amount = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.Discount_Rate = 0;
    this.Tax_Rate = 0;
    this.tax_Amount = 0;
    this.saleOrderDetails = [];
    this.itemStockIMEI = [];
    this.sd_Rate = 0;
    this.sd_Amount = 0;
    this.balance = 0;
    this.imei = "";
    $("#alertWarning").hide();
    //$("#submitAdd").prop("disabled", false);
    this.mode = true;
    this.guid = UUID.UUID();
    this.getPriviledgedOffices();
    this.changeCustomerDropDownByArea(1);
    this.enableItemDropDown();
    this.enableRefDropDown();
    this.getPayments();
    this.frieghtChange();
    this.paymentMethod();
    this.changeIsDirect(this.IsDirect);
    this.taxFields();
    this.getCompanyTemplate();
    this.isItemBook();
    this.getTaxRate();
    this.getAllIMEI();
    this.getAreaEnableStatus();
    this.setAreaEnableStatus();
  }
  //Total Cost
  TotalCost() {
    var total_Cost = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Cost += this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity;
      }
    }

    return total_Cost.toFixed(2);;
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0, t = 0, total_Tax = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Discount += ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100);
        t = this.saleOrderDetails[count].tax_Rate;

        total_Tax += ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) / 100 * this.saleOrderDetails[count].tax_Rate;
      }
    }
    this.tax_Rate = t;
    this.tax_Amount = total_Tax.toFixed(2);
    return total_Discount.toFixed(2);
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0, t = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Tax += ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) / 100 * this.saleOrderDetails[count].tax_Rate;
      }
    }

    this.tax_Amount = total_Tax.toFixed(2);
    return total_Tax.toFixed(2);
  }
  //Total Amount
  TotalAmount() {
    var total_Amount = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Amount += (((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) + ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) / 100 * this.saleOrderDetails[count].tax_Rate);
      }
      //if (this.freight_Chrgs != "")
      //  total_Amount += parseFloat(this.freight_Chrgs);
    }
    total_Amount = total_Amount - this.sd_Amount;
    this.adjust = total_Amount.toFixed(2);; //- this.sd_Amount;

    return total_Amount.toFixed(2);
  }
  //NetPayableAmountsaveOrder
  NetPayableAmount() {
    var NetPayable = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        NetPayable += (((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) + ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) / 100 * this.saleOrderDetails[count].tax_Rate);
      }
      if (this.freight_Chrgs != "")
        NetPayable += parseFloat(this.freight_Chrgs);
    }
    NetPayable = NetPayable - this.sd_Amount;

    // console.log('NetPayable:' + NetPayable);
    this.adjust = NetPayable.toFixed(2);; //- this.sd_Amount;

    if (this.cash > 0)
      this.changeCash(this.cash);
    return NetPayable.toFixed(2);
  }
  //changeItems
  changeItem(item_Code) {
    this.item_Code = item_Code
    this.service.getStocks(item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.stocks = (response.json());
        if (this.stocks != null) {
          this.stock_Qty = this.stocks[0].stock_Qty;
        }
      });
  }
  //changeIsDirect
  changeIsDirect(IsDirect) {
    if (IsDirect == false) {
      $("#paidlbl").hide();
      $("#paidtxt").hide();
      //document.getElementById("paidlbl").style.display = "none";
      //document.getElementById("paidtxt").style.display = "none";
    }
    else {
      $("#paidlbl").show();
      $("#paidtxt").show();
      //document.getElementById("paidlbl").style.display = "block";
      //document.getElementById("paidtxt").style.display = "block";
    }
  }
  //changeDiscountRate
  changeDiscountRate(Discount_Rate) {
    if (Discount_Rate > 100) {
      this.Discount_Rate = 100;
    }
    else if (Discount_Rate <= 0) {
      this.Discount_Rate = 0;
    }
  }
  //changeDiscountRateEdit
  changeDiscountRateEdit(i: saleOrderDetails, discount_Rate) {
    if (discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (discount_Rate <= 0) {
      i.discount_Rate = 0;
    }
  }
  //changeQuantity
  changeQuantity(Quantity) {
    if (Quantity <= 0) {
      this.Quantity = 1;
    }
  }
  //changeQuantityEdit
  changeQuantityEdit(i: saleOrderDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //changeSpecialRate
  changeSpecialRate(sd_Rate) {
    $("#specialAmount").prop("disabled", true);
    if (sd_Rate <= 0) {
      this.sd_Rate = 0;
      $("#specialAmount").prop("disabled", false);
    }
    else if (sd_Rate > 100) {
      sd_Rate = 100;
      this.sd_Rate = 100;
      this.sd_Rate = sd_Rate;
      this.rate = sd_Rate / 100;
    }
    this.rate = ((sd_Rate / 100) * this.adjust).toFixed(2);
    this.sd_Amount = this.rate;
  }
  //changeSpecialAmount
  changeSpecialAmount(sd_Amount) {
    if (sd_Amount <= 0) {
      this.sd_Amount = 0;
      $("#specialRate").prop("disabled", false);
    }
    else {
      $("#specialRate").prop("disabled", true);
      this.sd_Amount = sd_Amount;
    }
  }
  //changeUnitPrice
  changeUnitPrice(i: saleOrderDetails, unit_Price) {
    if (unit_Price <= 0) {
      i.quantity = 1;
    }
  }
  //changeUnitPriceEdit
  changeUnitPriceEdit(i: saleOrderDetails, unit_Price) {
    if (unit_Price <= 0) {
      i.unit_Price = 1;
    }
  }
  //changeFreight
  changeFreight(freight_Chrgs) {
    if (freight_Chrgs <= 0) {
      this.freight_Chrgs = 0;
    }
    else if (freight_Chrgs > 0) {
      this.freight_Chrgs = (freight_Chrgs).toFixed(2);
      this.NetPayableAmount();
    }

  }
  //changeIMEILength
  changeIMEILength(imeiLength) {
    if (imeiLength > 15) {
      this.imeiLength = 15;
    }
    else if (imeiLength < 3) {
      this.imeiLength = 3;
    }
  }
  //changePayment
  changePayment(paid_Amount) {
    if (paid_Amount <= 0)
      this.paid_Amount = 0;
  }
  //changeCash
  changeCash(cash) {
    if (cash <= 0) {
      this.cash = 0;
    }
    else {
      this.cash = cash;
    }

    if (this.cash > this.adjust) {
      this.balance = (this.cash - this.adjust).toFixed(2);
      //$("#submitAdd").prop("disabled", false);
    }
    else if (this.cash < this.adjust) {
      this.balance = 0;
    }
    //else {
    //  swal("Cash amount must be equal to or less then payable amount");
    //  $("#submitAdd").prop("disabled", true);
    //}
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
  //updateItem 
  updateItem(i: saleOrderDetails, item_Code: any, item_Name: any, unit_Price: any) {
    i.item_Code = item_Code;
    i.item_Name = item_Name;
    i.unit_Price = unit_Price;
    this.service.getStocks(i.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.stocks = (response.json());
        this.stock_Qty = this.stocks[0].stock_Qty;
      });
  }
  //changeMode
  changeMode(idx: any, i: saleOrderDetails, Mode: any) {
    var flag = false;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        if (this.saleOrderDetails[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {
      if (i.unit_Price != 0) {
        if (flag == false) {
          if (i.quantity > 0) {
            this.service.getStocks(i.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
              .subscribe(response => {
                this.stocks = (response.json());
                this.stock_Qty = this.stocks[0].stock_Qty;
                //nsole.log(response.json());           
              });
            if (this.stock_Qty != null && this.stock_Qty >= i.quantity) {
              i.edit_Mode = false;
              i.sale_Cost = (i.unit_Price * i.quantity);
              i.discount_Amount = ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100);
              i.tax_Amount = (i.sale_Cost - i.discount_Amount) / 100 * i.discount_Rate;
              i.net_Amount = (i.sale_Cost - i.discount_Amount) + i.tax_Amount;
              //i.net_Amount = ((i.quantity) * (i.unit_Price) - ((i.quantity) * (i.unit_Price) * (i.discount_Rate) / 100));
              //  $("#submitAdd").prop("disabled", false);
            }
            else {
              swal("Stock is not available");
              return;
              //$("#submitAdd").prop("disabled", true);
            }
          } else {
            swal("Quantity should be greater then 0");
            return;
          }
        } else {
          swal("Already Exists");
          return;
        }
      } else {
        swal("Unit price should be greater then 0");
        return;
      }
    }
    else if (Mode == 2) {
      this.saleOrderDetails.splice(idx, 1);
      var count = this.itemStockIMEI.findIndex((obj => obj.item_Code == i.item_Code));
      var arrcCount = this.itemStockIMEI.filter((obj => obj.item_Code == i.item_Code));
      this.itemStockIMEI.splice(count, arrcCount.length);
    }
    else {
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.item_Code) {
          this.item_Code = this.items[j].id;
          break;
        }
      }
      console.log(i);
      i.edit_Mode = true;
    }
  }
  //getAllIMEI
  getAllIMEI() {
    this.service.getAllIMEI(0, false,140051)
      .subscribe(response => {
        this.detail = (response.json());
        if (response.json() != null) {
          this.warrantyID = this.detail[0].warrantyID;
          this.warrantyName = this.detail[0].warrantyName;
          this.colorID = this.detail[0].colorID;
          this.colorName = this.detail[0].colorName;
        }
      });
  }
  //addIMEI
  addIMEI(imei) {
    if (imei != '') {
      if (imei.length > 0) {
        if (this.category_Code == 1 || this.category_Code == 2) {
          if (this.imei != '') {
            this.itemStockIMEI.push(new itemStockIMEI(0, 0, 0, this.item_Code, imei, this.colorID, this.colorName, this.warrantyID, this.warrantyName));

          }
          else {
            swal("Serial# / IMEI# must be required");
          }
        }
      }
    }
    else {
      swal("Serial# / IMEI# must be required");
    }
  }
  //addGrid
  addGrid(item_Code: any, item_Name: any, Unit_Price: any, Quantity: any, Discount_Rate: any, Tax_Rate: any, imei: any) {

    this.item_ID = item_Code;
    Tax_Rate = this.taxrate;
    Discount_Rate = this.Discount_Rate;

    if (item_Code != 0) {
      if (Unit_Price != 0) {
        if (this.stock_Qty != null && this.stock_Qty >= (Quantity + this.pending)) {
          if (item_Name != null) {
            if (Quantity > 0) {

              var idx = 0;
              var flag = false;

              if (this.saleOrderDetails.length > 0) {
                var arr = this.saleOrderDetails.filter(o => o.item_Code == item_Code);
                if (arr.length == 1) {
                  var count = this.saleOrderDetails.findIndex((obj => obj.item_Code == item_Code));
                  var arr = this.itemStockIMEI.filter(o => o.imei == imei);
                  if (arr.length == 0) {
                    if (this.category_Code == 1 || this.category_Code == 2) {
                      if (this.imei != '') {
                        if (this.detail != null) {
                          //  alert(imei + '------------------' + item_Code)
                          console.log(this.detail);
                          var arr = this.detail.filter(o => o.imei == imei && o.item_Code == item_Code);
                          if (arr.length == 1) {
                            this.saleOrderDetails[count].quantity += Quantity;
                            this.saleOrderDetails[count].sale_Cost = (this.saleOrderDetails[count].quantity * this.saleOrderDetails[count].unit_Price);
                            this.addIMEI(imei);
                          }
                          else {
                            swal("Serial# / IMEI# does not exist in database");
                          }
                        }
                      }
                      else {
                        swal("Serial# / IMEI# must be required");
                      }
                    }
                    else {
                      this.saleOrderDetails[count].quantity += Quantity;
                      this.saleOrderDetails[count].sale_Cost = (this.saleOrderDetails[count].quantity * this.saleOrderDetails[count].unit_Price);
                    }
                  }
                  else {
                    swal("Already Exists Serial# / IMEI#" + this.imei);
                  }
                  flag = true;
                }
              }
              if (flag == false) {
                if (this.category_Code == 1 || this.category_Code == 2) {
                  Quantity=1;
                  this.Quantity=1;
                  if (this.imei != '') {
                    if (this.detail != null) {
                      var arr = this.detail.filter(o => o.imei == imei && o.item_Code == item_Code);
                      if (arr.length == 1) {
                        this.addIMEI(imei);
                        this.saleOrderDetails.push(new saleOrderDetails(0, 0, item_Code, item_Name, Unit_Price, Quantity, (Unit_Price * Quantity).toFixed(2), Discount_Rate, ((Quantity) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), this.taxratecode, Tax_Rate, ((((Quantity * Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate).toFixed(2), 0, (((Quantity) * (Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)) + ((((Quantity * Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate)).toFixed(2), 0, this.stock_Qty, this.pending,'', this.unit));
                      }
                      else {
                        swal("Serial# / IMEI# does not exist in database");
                      }
                    }
                  }
                  else {
                    swal("Serial# / IMEI# must be required");
                  }
                }
                else {
                  this.saleOrderDetails.push(new saleOrderDetails(0, 0, item_Code, item_Name, Unit_Price, Quantity, (Unit_Price * Quantity).toFixed(2), Discount_Rate, ((Quantity) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), this.taxratecode, Tax_Rate, ((((Quantity * Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate).toFixed(2), 0, (((Quantity) * (Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)) + ((((Quantity * Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate)).toFixed(2), 0, this.stock_Qty, this.pending,'', this.unit));
                }
                if (this.taxcode != 1) {
                  if (this.taxable == true) {
                    $("#TaxRateDropDown").prop("disabled", false);
                  }
                  else {
                    $("#TaxRateDropDown").prop("disabled", true);
                  }
                }
                else {
                  $("#TaxRateDropDown").prop("disabled", true);
                  this.taxratecode = 1;
                }
                this.editMode = false;
              }
              else {
                // swal("Already Exists at Sr#" + idx);
              }

            }
            else {
              swal("Qty is required. Qty not be zero and should be numeric");
              return;
            }
          } else {
            swal("Item is Required");
            return;
          }
          $("#submitAdd").prop("disabled", false);
        } else {

          $("#submitAdd").prop("disabled", true);
          swal("Stock is not available." + this.stock_Qty + "");
          return;
        }
      } else {
        swal("Unit Price should be greater then 0");
        return;
      }
    } else {
      swal("Please Select Item");
      return;
    }
    //$("#item_ID").select2('open');

    if (this.sessionEnableTextboxItem != 1) {
      // $('#item_ID').select2().focus();

    } else {
      $('#textboxItem').focus();
      this.textboxItemID = 0;
      this.item_Code = 0;
      this.textboxItemName = '';
      this.textboxItemSearch = '';
      this.searchGridItem = this.searchGridItemTemp;
    }
    this.imei = "";
    this.scrollToBottom();
    this.TotalCost();
    this.TotalDiscount();
    this.TotalAmount();
    this.TotalTax();
  }
  //IfExists
  IfExists(sale_Order_ID) {
    this.service.IfExists(sale_Order_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          //$("#submitUpdate").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          //$("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //guidExist
  guidExist(guid: any) {
    this.service.guidExist(guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
      });
  }
  //onNavigate 
  onNavigate(pth) {
    sessionStorage.setItem('ReportView', '1');
    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }
    sessionStorage.setItem('ShowIMEI', this.ShowIMEI);
    sessionStorage.setItem('IsOrder', '0');
    sessionStorage.setItem('isStamp', "false");
    sessionStorage.setItem('reportID', "2");
    sessionStorage.setItem('exchange', "-1");
    window.open(pth, "_blank");
  }
  //getCompanyTemplate
  getCompanyTemplate() {
    if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
      this.templateshow = 'none';
    }
    else {
      this.templateshow = '';
      this.isLoading = true;
      this.service.getCompanyTemplate(this.userCurrentOffice, 140005, 0)
        .subscribe(response => {
          this.companytemplate = (response.json());
          let filterarr = this.companytemplate.filter(
            t => t.isRPReport == 1);

          if (filterarr.length > 0)
            this.templatecode = filterarr[0].templatecode;
          else
            this.templatecode = this.companytemplate[0].templatecode;

          console.log(response.json());
          this.isLoading = false;
        });
    }

  }
  //saveOrder
  updateOrder(sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
    delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
    total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
    cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any) {
    var flag = false;


    if (this.cash == 0)
      flag = true;
    else //if (this.NetPayableAmount() == this.cash)   
      flag = true;


    if (flag) {
      if (freight_Chrgs > 0) {
        frieght_Id = 2;
        total_Amount = parseFloat(total_Amount) + parseFloat(freight_Chrgs);
      }
      if (this.cash > 0)
        paid_Amount = total_Amount;
      else
        paid_Amount = 0;

      var order = new saleOrder(sale_Order_ID, sO_Date, this.userCurrentOffice, this.order_Envoy, this.areacode, customer_ID, contact_ID,
        delivery_Date, method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
        total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,
        0, 1, manual_Discount, entry_Date, 1, true, this.guid, true, this.sd_Rate, this.sd_Amount, this.sd_Amount, 0, 0, this.logedInUserID, this.UserSessionID, 1, this.refcustomerid, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI);
      console.log(order);
      sessionStorage.setItem('ReportView', '1');
      sessionStorage.setItem('templatecode', '1');


      this.totalAmount = total_Amount;

      if (this.cash > this.totalAmount)
        this.cash = this.totalAmount;

      this.totalNetPayable = (parseFloat(this.netPayable) + parseFloat(this.totalAmount) - (parseFloat(this.cash) - parseFloat(this.balance)));
      //  alert('totalNetPayable: ' + (parseFloat(this.netPayable) + parseFloat(this.totalAmount)-(parseFloat(this.cash)-parseFloat(this.balance))) + ' credit_Limit: ' + this.credit_Limit);
      if (this.totalNetPayable < this.credit_Limit) {

        this.service.guidExist(this.guid)
          .subscribe(response => {
            this.guidOrder = (response.json());
            if (this.guidOrder == false) {
              if (this.adjust > 0) {
                if (this.sessionEnableTextboxCustomer != 1) {
                  this.isLoading = true;
                  this.service.update(order).then(
                    (response) => {
                      this.isLoading = false;
                      this.idd = response;
                      sessionStorage.setItem('ID', this.idd);
                      sessionStorage.setItem('exchange', "-1");

                      
                      if (this.isView == true) {
                        this.onNavigate('/si-rpt-rdlc');
                      }

                      if (sessionStorage.getItem('EnableWhatsappMessage') == '1') {
                        this.service.getCustomerNo(customer_ID)
                          .subscribe(response => {
                            this.isLoading = false;

                            var list = response.json();

                            let CustomerName = list[0].name;


                            let CustomerCell = list[0].cell;

                            if (CustomerCell != null) {
                              if (CustomerCell.length > 0)
                                this.sendWhatsappMessage(CustomerCell, 'Mr./Mrs. ' + CustomerName + ' Your Invoice # ' + this.idd + ' of Rs. ' + this.totalAmount + ' has been issued.');
                            }
                          }
                          );

                      }

                      this.clearFields();
                      console.log(response);
                    },
                    (error) => console.log(error))
                }
                else {
                  if (this.textboxCustomerName != '') {
                    this.isLoading = true;
                    this.service.saveOrder(order).then(
                      (response) => {
                        this.isLoading = false;
                        this.idd = response;
                        console.log(+"iddddddddddddddddd" + response);
                        sessionStorage.setItem('ID', this.idd);
                        sessionStorage.setItem('exchange', "-1");

                        if (this.isView == true) {
                          this.onNavigate('/si-rpt-rdlc');
                        }

                        if (sessionStorage.getItem('EnableWhatsappMessage') == '1') {
                          this.service.getCustomerNo(customer_ID)
                            .subscribe(response => {
                              this.isLoading = false;

                              var list = response.json();

                              let CustomerName = list[0].name;


                              let CustomerCell = list[0].cell;

                              if (CustomerCell != null) {
                                if (CustomerCell.length > 0)
                                  this.sendWhatsappMessage(CustomerCell, 'Mr./Mrs. ' + CustomerName + ' Your Invoice # ' + this.idd + ' of Rs. ' + this.totalAmount + ' has been issued.');
                              }
                            }
                            );

                        }

                        this.textboxCustomerID = 0;
                        this.customer_ID = 0;
                        this.textboxCustomerName = '';
                        this.textboxCustomerSearch = '';
                        this.searchGridCustomer = this.searchGridCustomerTemp;
                        this.searchGridItemTemp = [];
                        this.SearchItemDropDown('');
                        this.clearFields();
                        console.log(response);
                      },
                      (error) => console.log(error))
                  }
                  else {
                    $("#submitAdd").prop("disabled", true);
                    swal('Select Customer!')
                  }
                }
              }
              else {
                $("#submitAdd").prop("disabled", true);
                swal("Order should be greater then 0.");
              }
            }
            else { swal("Error: Already exists."); }
          });
      }
      else {
        swal("Net Payable Must be less then or equal to credit limit.");

      }
    }
    else swal("Cash Amount must be equal to Payable Amount or Zero.");

  }
  //getDetailsByID
  getDetailsByID(sale_Invoice_ID) { 
    sessionStorage.setItem('reportID', "4");
    sessionStorage.setItem('ID', sale_Invoice_ID);
    sessionStorage.setItem('exchange', "-1");

    this.mode = true;
this.service.getOrderIDByInvoiceID(sale_Invoice_ID)
.subscribe((o: saleOrder)=>
{
  sale_Invoice_ID=o.sale_Order_ID;

    this.service.getDetailsByID(sale_Invoice_ID)
      .subscribe((o: saleOrder) => {
        console.clear();
        console.log(o);
        this.sale_Order_ID = o.sale_Order_ID;
        this.sO_Date = o.sO_Date;
        this.order_Envoy = o.sale_Envoy;

        this.contact_ID = o.contact_ID;
        this.payment_ID = o.payment_ID;
        this.remarks = o.remarks;
        this.delivery_Date = o.delivery_Date;
        this.method_Id = o.shipping_Method;
        this.freight_Id = o.freight_Term;
        this.freight_Chrgs = o.freight_Chrgs;
        this.total_Amount = o.total_Amount;
        this.total_discount = o.total_Discount;
        this.cash = parseInt("0" + this.cash);
        //alert(parseInt("0"+this.cash));

        this.saleOrderDetails = o.saleOrderDetails;
        this.getPriviledgedOffices();
        this.service.getCustomersForSO(0)
          .subscribe(response => {
            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            this.customer_ID = o.customer_ID;
            this.service.getContacts(o.customer_ID)
              .subscribe(response => {
                this.contacts = response.json();
                this.contact_ID = this.contacts[0].contact_ID;
                //alert(this.contacts[0].credit_Limit);
                if(this.contacts[0].credit_Limit!=null || this.contacts[0].credit_Limit!='')
                {this.credit_Limit = this.contacts[0].credit_Limit;}
                if(this.contacts[0].credit_Limit=='' || this.contacts[0].credit_Limit==null){
                this.credit_Limit = 0;}
                this.netPayable = this.contacts[0].netPayable;
              });
          });

        });
        this.service.getAllIMEI(sale_Invoice_ID, true,140051)
          .subscribe(response => {
            this.itemStockIMEI = response.json();
            console.clear();
            console.log(this.itemStockIMEI);
          });
       
        if (o.cancel == true) {
          $("#cancelBtn").prop("disabled", true);
          $("#submitAdd").prop("disabled", true);
        }
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
  //hotkeys
  hotkeys(e) {
    var TRowID = $('td.active').parent().attr("id");

    if (TRowID) {

      if (TRowID.split("-", 2)) {

        var splitted = TRowID.split("-", 2);
        if (e.keyCode == 38 && parseInt(splitted[1]) > 1) { //UP
          $('td.active').removeClass('active');
          TRowID = "#" + splitted[0] + "-" + (parseInt(splitted[1]) - 1)
          $(TRowID).eq(0).find('td').addClass('active');

        }
        if (e.keyCode == 40) { //DOWN
          $('td.active').removeClass('active');
          TRowID = "#" + splitted[0] + "-" + (parseInt(splitted[1]) + 1)
          $(TRowID).eq(0).find('td').addClass('active');

        }
        if (this.LoginService.getSession('EnableEnterKeyOnDDL') != '0') {
          if (e.keyCode == 13) {
            TRowID = "#" + TRowID;
            $(TRowID).click();
          }
        }
        $("div,table").animate({
          // get the proper position of the active tr
          scrollTop: (parseInt(splitted[1]) + 1) * 25
        }, 35);

      }
    }
  }
  //taxFields
  taxFields() {
    if (this.LoginService.getSession('settingTaxOnSale') != '1') {
      this.hide = false;
      $("#taxHide").hide();
      this.isTaxable = 0;
      this.taxRate = 0;
      $("#lblTax").hide();
      $("#lblTax1").hide();
      $("#lblTotalTax").hide();
    }
    else {
      this.hide = true;
      $("#taxHide").show();
      this.isTaxable = this.LoginService.getSession('isTaxable');
      this.taxRate = this.LoginService.getSession('taxRate');
      $("#lblTax").show();
      $("#lblTax1").show();
      $("#lblTotalTax").show();
    }
  }
  //stockField
  stockField() {
    if (sessionStorage.getItem('settingShowStock') != "1") {
      this.hideStock = false;
    }
    else {
      this.hideStock = true;

    }
  }
  //pendingField
  pendingField() {
    if (sessionStorage.getItem('settingShowPending') != "1") {
      this.hidePending = false;
    }
    else {
      this.hidePending = true;
    }
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
  // open modal
  open(content) {
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

    this.clearFields();
    $("#viewIcon").css("display", "block");
    this.taxFields();
    this.stockField();
    this.pendingField();
    this.disableDiscountEditing();
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
  ////////////////////////////////////////////
  sessionEnableTextboxCustomer = 0;
  textboxCustomerID: any = 0;
  textboxCustomerName: any = '';
  textboxCustomerSearch: any = '';
  searchGridCustomer: any[] = [];
  searchGridCustomerTemp: any[] = [];
  ////////////////////////////////////////////
  changeCustomerDropDownByArea(value) {
    if (this.LoginService.getSession('EnableCustomerSearchDropDown') != '1') {
      $("#DropDownCustomerSearch").hide();
      this.sessionEnableTextboxCustomer = 0;
      //   this.getCustomers(value);
    }
    else {
      $("#DropDownCustomerSelect2").hide();
      this.sessionEnableTextboxCustomer = 1;
      this.SearchCustomerDropDown('');
    }
  }
  SearchCustomerByID(Query) {
    this.textboxCustomerSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchCustomerByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedCustomer(List[0].id, List[0].name)
        }
        else {

          this.customer_ID = 0;
          this.textboxCustomerID = 0;
          this.textboxCustomerName = '';
          this.contacts = [];
          this.contact_ID = 0;
        }
        this.isLoading = false;
      });

  }
  SearchCustomerDropDown(Query) {

    this.searchGridCustomer = [];
    console.log('Query', Query);
    this.isLoading = true;
    this.searchfilter.SearchCustomerDropDown(Query)
      .subscribe(response => {
        if (this.searchGridCustomer != null) {
          this.searchGridCustomer = (response.json());
          $('td.active').removeClass('active');
          var TRowID = "#CROW-1";
          var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
          if (this.searchGridCustomerTemp.length <= 0) {
            this.searchGridCustomerTemp = this.searchGridCustomer;
          }
        }
        this.isLoading = false;
      });

  }
  setCustomerSearchFocus() {
    var timer = setTimeout(() => $("#textboxCustomerSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#CROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedCustomer(ID, Name) {
    $('td.active').removeClass('active');
    console.log(ID, Name);
    this.textboxCustomerID = ID;
    this.customer_ID = ID;
    this.textboxCustomerName = Name;

    this.textboxCustomerSearch = '';
    this.searchGridCustomer = this.searchGridCustomerTemp;

    //getContacts
    this.service.getContacts(this.textboxCustomerID)
      .subscribe(response => {
        if (response.json() != null) {
          this.contacts = response.json();
          this.contact_ID = this.contacts[0].contact_ID;
          this.taxcode = this.contacts[0].taxcode;
          this.checkTaxCode();
          $("#submitAdd").prop("disabled", false);
        }
        this.isLoading = false;
      });
  }
  ////////////////////////////////////////////
  sessionEnableTextboxItem = 0;
  textboxItemID: any = 0;
  textboxItemName: any = '';
  textboxItemSearch: any = '';
  searchGridItem: any[] = [];
  searchGridItemTemp: any[] = [];
  isBook: any = false;
  ////////////////////////////////////////////
  //isItemBook
  isItemBook() {
    if (sessionStorage.getItem('EnablePublisherInItemDropDown') != "1") {
      this.isBook = false;
    }
    else {
      this.isBook = true;
    }
  }
  enableItemDropDown() {

    if (this.LoginService.getSession('EnableItemSearchDropDown') != '1') {
      $("#DropDownItemSearch").hide();
      this.sessionEnableTextboxItem = 0;
      this.getItems();
    }
    else {
      $("#DropDownItemSelect2").hide();
      this.sessionEnableTextboxItem = 1;
      this.SearchItemDropDown('');

    }
  }
  SearchItemByID(Query) {
    this.textboxItemSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchItemByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedItem(List[0].id, List[0].name)
        }
        else {

          this.item_Code = 0;
          this.textboxItemID = 0;
          this.textboxItemName = '';

        }
        this.isLoading = false;
      });

  }
  SearchItemDropDown(Query) {

    this.searchGridItem = [];
    this.isLoading = true;
    this.searchfilter.SearchItemDropDown(Query, 1, 1, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        if (this.searchGridItem != null) {
          this.searchGridItem = (response.json());
          $('td.active').removeClass('active');
          var TRowID = "#IROW-1";
          var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
          if (this.searchGridItemTemp.length <= 0) {
            this.searchGridItemTemp = this.searchGridItem;
          }

        }
        this.isLoading = false;
      });


  }
  setItemSearchFocus() {
    var timer = setTimeout(() => $("#textboxItemSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#IROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedItem(ID, Name) {
    $('td.active').removeClass('active');
    console.log(ID, Name);
    this.textboxItemID = ID;
    this.item_Code = ID;
    this.textboxItemName = Name;
    this.textboxItemSearch = '';
    this.searchGridItem = this.searchGridItemTemp;

    this.service.getUnitPrice(ID, 0, false, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.unit)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.item_Name = this.unitPrices[0].item_Name;
        this.stock_Qty = this.unitPrices[0].stock_Qty;
        this.pending = this.unitPrices[0].pending;
        this.taxable = this.unitPrices[0].taxable;
        //this.Discount_Rate = this.unitPrices[0].discountRate;
        this.changeItem(ID);

        if (this.taxable == true) {
          this.taxratecode = this.unitPrices[0].taxtypeid;
          $("#TaxRateDropDown").prop("disabled", false);
        }
        else {

          this.taxratecode = 1;
          this.Tax_Rate = 0;
          $("#TaxRateDropDown").prop("disabled", true);
        }


      });

    var timer = setTimeout(() => $("#Discount").focus(), 500);
  }
  setTRowActiveClass(Tag) {
    console.log(Tag)
    $('td.active').removeClass('active');
    var TRowID = "#" + Tag + "-1";
    var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
  }
  ////////////////////////////////////////////
  Customerflag: any = 0;
  addCustomerName: any = '';
  addCustomerCell: any = '';
  addCustomerPhone: any = '';
  addCustomerEmail: any = '';
  addCustomerAddress: any = '';
  addCustomerStatus: any = 1;
  city: any[] = [];
  citycode: any = 0;
  cityname: any = '';
  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = '';
  sendParentID: any = '';
  sendCustomerName: any = '';
  sendCustomerEmail: any = '';
  sendCustomerBody: any = '';
  ////////////////////////////////////////////
  //getCity
  getCity() {
    this.isLoading = true;
    this.customerService.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        this.citycode = this.city[0].id;
        this.cityname = this.city[0].text;
        this.isLoading = false;
      });
  }
  //getCustomerChange
  getCityChange(e: any) {
    this.citycode = e;
  }
  //getCategories
  getCategory() {
    this.customerService.getCategories()
      .subscribe(response => {
        this.category = (response.json());
        this.categorycode = this.category[0].customerCategoryId;
        this.categoryname = this.category[0].customerCategoryName;
      });
  }
  //CustomerAddNew
  CustomerAddNew(content) {
    this.addCustomerName = '';
    this.addCustomerCell = '';
    this.addCustomerPhone = '';
    this.addCustomerEmail = '';
    this.addCustomerAddress = '';
    this.addCustomerStatus = 1;
    this.Customerflag = 0;

    this.checkEmail = true;
    this.checkPhone = true;
    this.checkContactCell = true;
    this.checkContactPhone = true;

    this.city = [];
    this.citycode = 0;
    this.cityname = '';

    this.category = [];
    this.categorycode = 0;
    this.categoryname = '';

    this.getCity();
    this.getCategory();
    this.openCustomerAddNew(content);

  }
  //openCustomerAddNew
  openCustomerAddNew(content) {
    this.cguid = UUID.UUID();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, size: 'sm', windowClass: 'my-modal'
    };

    this.modalReference = this.modalService.open(content, { size: 'sm' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    $("#SaveNewCustomer").prop("disabled", true);
    var timer = setTimeout(() => $("#addCustomerName").focus(), 500);

  }
  //saveCustomer
  saveCustomer() {

    if (this.addCustomerName != "") {

      if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.addCustomerCell == '') {
        swal("Cell number must be defined.")
      }
      else {

        var customer = new Customers(0, this.addCustomerName, this.categorycode, 0, this.addCustomerName, this.addCustomerPhone, this.addCustomerCell, this.addCustomerCell, this.addCustomerPhone, '', '', '', '', 0, 1, 1, 1, 1, 1, 0, 1, this.cguid, '', 0, 0, this.addCustomerAddress, '', '', this.citycode, 1, 1, this.addCustomerStatus, 1, this.logedInUserID, this.UserSessionID, 1, 1, 0, 0);
        console.log(customer);
        this.isLoading = true;
        this.customerService.saveCustomer(customer).then(
          (response) => {
            var list = response;

            this.service.getCustomersForSO(this.areacode)
              .subscribe(response => {

                if (this.Customerflag == 0) {

                  this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");

                  this.setSelectedCustomer(list[0].customer_ID, list[0].customer_ID + ' : ' + list[0].customer_Name);
                  //getContacts
                  this.service.getContacts(this.customer_ID)
                    .subscribe(response => {
                      this.contacts = response.json();
                      this.contact_ID = this.contacts[0].contact_ID;

                      //  console.log(response.json());
                    });
                }
                else {
                  this.isLoading = false;
                  this.setSelectedRef(list[0].customer_ID, list[0].customer_ID + ' : ' + list[0].customer_Name);

                }
              });


            this.modalReference.close();
            console.log(list);
          },
          (error) => console.log(error))

      }
    }
    else {
      swal("Customer name must be define.");
    }

  }
  ////////////////////////////////////////////
  checkEmail: any = true;
  checkPhone: any = true;
  checkContactCell: any = true;
  checkContactPhone: any = true;
  ////////////////////////////////////////////
  checkDisableStatus() {

    if (this.addCustomerName != ''
      && this.checkEmail != false
      && this.checkContactCell != false
      && this.checkContactPhone != false) {
      $("#SaveNewCustomer").prop("disabled", false);
    }
    else {
      $("#SaveNewCustomer").prop("disabled", true);
    }

  }
  checkCustomerCell(cell) {
    if (cell != '') {
      this.isLoading = true;
      this.customerService.contactCellExists(cell)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactCell = false;
            this.checkDisableStatus();
            swal('Cell Already Exist');
          }
          else {
            this.checkContactCell = true;
            this.checkDisableStatus();
          }


        });
    }
    else {

      if (this.LoginService.getSession('MandatoryCellNo') != '1') {
        this.checkContactCell = true;
        this.checkDisableStatus();
      }
      else {
        this.checkContactCell = false;
        this.checkDisableStatus();
        swal('Enter Cell No');
      }
    }
  }
  checkCustomerPhone(phone) {
    if (phone != '') {
      this.isLoading = true;
      this.customerService.contactCellExists(phone)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactPhone = false;
            this.checkDisableStatus();
            swal('Phone Already Exist');

          }
          else {
            this.checkContactPhone = true;
            this.checkDisableStatus();
          }

        });
    }
    else {
      this.checkContactPhone = true;
      this.checkDisableStatus();
    }
  }
  checkCustomerEmail(email) {
    if (email != '') {
      this.isLoading = true;
      this.customerService.emailExists(email)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkEmail = false;
            this.checkDisableStatus();
            swal('Email Already Exist');
          }
          else {
            this.checkEmail = true;
            this.checkDisableStatus();
          }
        });
    }
    else {
      this.checkEmail = true;
      this.checkDisableStatus();
    }
  }
  ////////////////////////////////////////////
  refcustomerid = 0;
  sessionEnableTextboxRef = 0;
  textboxRefID: any = 0;
  textboxRefName: any = '';
  textboxRefSearch: any = '';
  searchGridRef: any[] = [];
  searchGridRefTemp: any[] = [];
  ////////////////////////////////////////////
  enableRefDropDown() {

    if (this.LoginService.getSession('AllowRefCustomer') != '1') {
      $("#DropDownRefSearchLabel").hide();
      $("#DropDownRefSearch").hide();
    }
    else {
      this.SearchRefDropDown('');
    }
  }
  SearchRefByID(Query) {
    this.textboxRefSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchRefByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedRef(List[0].id, List[0].name)
        }
        else {

          this.refcustomerid = 0;
          this.textboxRefID = 0;
          this.textboxRefName = '';

        }
        this.isLoading = false;
      });

  }
  SearchRefDropDown(Query) {

    this.searchGridRef = [];
    console.log('Query', Query);
    this.isLoading = true;
    this.searchfilter.SearchRefDropDown(Query)
      .subscribe(response => {
        if (this.searchGridRef != null) {
          this.searchGridRef = (response.json());
          $('td.active').removeClass('active');
          var TRowID = "#RROW-1";
          var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
          if (this.searchGridRefTemp != null) {
            this.searchGridRefTemp = this.searchGridRef;
          }
        }
        this.isLoading = false;
      });

  }
  setRefSearchFocus() {
    var timer = setTimeout(() => $("#textboxRefSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#RROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedRef(ID, Name) {
    $('td.active').removeClass('active');
    console.log(ID, Name);
    this.textboxRefID = ID;
    this.refcustomerid = ID;
    this.textboxRefName = Name;

    this.textboxRefSearch = '';
    this.searchGridRef = this.searchGridRefTemp;


  }
  //RefCustomerAddNew
  RefCustomerAddNew(content) {
    this.addCustomerName = '';
    this.addCustomerCell = '';
    this.addCustomerPhone = '';
    this.addCustomerEmail = '';
    this.addCustomerAddress = '';
    this.addCustomerStatus = 1;
    this.Customerflag = 1;

    this.checkEmail = true;
    this.checkPhone = true;
    this.checkContactCell = true;
    this.checkContactPhone = true;

    this.city = [];
    this.citycode = 0;
    this.cityname = '';

    this.category = [];
    this.categorycode = 0;
    this.categoryname = '';

    this.getCity();
    this.customerService.getCategories()
      .subscribe(response => {
        this.category = (response.json());
        this.categorycode = 30017;
      });
    this.openCustomerAddNew(content);

  }
  ////////////////////////////////////////////
  taxrateList: any[] = [];
  taxratecode: any = 1;
  taxratename: any = '';
  taxrate: any = 0;
  taxcode: any = 1;
  DisableTaxRate: any = '';
  ////////////////////////////////////////////f
  //getTaxRate 
  getTaxRate() {
    this.isLoading = true;
    this.service.getTaxRates()
      .subscribe(response => {
        if (response.json() != null) {
          this.taxrateList = (response.json());
          this.taxratecode = this.taxrateList[0].taxratecode;

        }

      });

  }
  //changeTaxRate
  changeTaxRate() {
    if (this.taxrateList != null) {
      for (let i = 0; i < this.taxrateList.length; i++)
        if (this.taxrateList[i].taxrateid == this.taxratecode) {
          this.taxrate = this.taxrateList[i].taxrate;

        }
    }
  }
  //checkTaxCode
  checkTaxCode() {
    if (this.taxcode != 1) {
      $("#TaxRateDropDown").prop("disabled", false);
    }
    else {
      this.taxratecode = 1;
      $("#TaxRateDropDown").prop("disabled", true);
    }
  }
  //cancelOrder
  cancelOrder() { 

    swal({
      title: "Do you really want to cancel?",
      text: "Once cancelled, you will not be able to recover this order!",
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

          this.service.cancelOrders(this.sale_Order_ID, 0)
            .subscribe(response => {
              swal("Your order has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              //this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  //saveEmail
  saveOrderAndEmail(content, sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
    delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
    total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
    cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any) {
    var flag = false;


    if (this.cash == 0)
      flag = true;
    else //if (this.NetPayableAmount() == this.cash)   
      flag = true;


    if (flag) {
      if (freight_Chrgs > 0) {
        frieght_Id = 2;
        total_Amount = parseFloat(total_Amount) + parseFloat(freight_Chrgs);
      }
      if (this.cash > 0)
        paid_Amount = total_Amount;
      else
        paid_Amount = 0;

      var order = new saleOrder(sale_Order_ID, sO_Date, this.userCurrentOffice, this.order_Envoy, this.areacode, customer_ID, contact_ID,
        delivery_Date, method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
        total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,
        0, 1, manual_Discount, entry_Date, 1, false, this.guid, this.IsDirect, this.sd_Rate, this.sd_Amount, this.sd_Amount, 0, 0, this.logedInUserID, this.UserSessionID, 1, this.refcustomerid, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI);
      console.log(order);
      sessionStorage.setItem('ReportView', '1');
      sessionStorage.setItem('templatecode', '1');


      this.totalAmount = total_Amount;
      this.totalNetPayable = (parseFloat(this.netPayable) + parseFloat(this.totalAmount) - (parseFloat(this.cash) - parseFloat(this.balance)));
      alert('totalNetPayable: ' + (parseFloat(this.netPayable) + parseFloat(this.totalAmount) - (parseFloat(this.cash) - parseFloat(this.balance))) + ' credit_Limit: ' + this.credit_Limit);
      if (this.totalNetPayable < this.credit_Limit || this.totalNetPayable==this.cash) {

        this.service.guidExist(this.guid)
          .subscribe(response => {
            this.guidOrder = (response.json());
            if (this.guidOrder == false) {
              if (this.adjust > 0) {
                if (this.sessionEnableTextboxCustomer != 1) {
                  this.isLoading = true;
                  this.service.saveOrder(order).then(
                    (response) => {
                      this.isLoading = false;
                      this.idd = response;
                      sessionStorage.setItem('ID', this.idd);
                      sessionStorage.setItem('exchange', "-1");
                      //if (this.isView == true) {
                      this.onNavigate('/si-rpt-rdlc');
                      // }


                      this.service.getCustomerEmail(customer_ID)
                        .subscribe(response => {
                          this.isLoading = false;
                          if (response.json() != null) {

                            var list = response.json();
                            console.log(response.json());
                            this.sendParentID = this.idd;
                            this.sendCustomerName = list[0].name;
                            this.sendCustomerEmail = list[0].email;
                            this.sendCustomerBody = 'Please Type Some Text!';
                            this.isLoading = true;
                            this.openSendMail(content);
                            console.log('Working')
                            this.clearFields();

                          }
                        });
                      console.log(response);
                    },
                    (error) => console.log(error))
                }
                else {
                  if (this.textboxCustomerName != '') {
                    this.isLoading = true;
                    this.service.saveOrder(order).then(
                      (response) => {
                        this.isLoading = false;
                        this.idd = response;
                        console.log("iddddddddddddddddd" + response);
                        sessionStorage.setItem('ID', this.idd);
                        sessionStorage.setItem('exchange', "-1");


                        this.onNavigate('/si-rpt-rdlc');

                        this.service.getCustomerEmail(customer_ID)
                          .subscribe(response => {
                            this.isLoading = false;
                            if (response.json() != null) {
                              var list = response.json();
                              this.sendParentID = this.idd;
                              this.sendCustomerName = list[0].name;
                              this.sendCustomerEmail = list[0].email;
                              this.sendCustomerBody = 'Please Type Some Text!';
                              this.isLoading = true;
                              this.openSendMail(content);
                              console.log('Working')

                              this.textboxCustomerID = 0;
                              this.customer_ID = 0;
                              this.textboxCustomerName = '';
                              this.textboxCustomerSearch = '';
                              this.searchGridCustomer = this.searchGridCustomerTemp;
                              this.searchGridItemTemp = [];
                              this.SearchItemDropDown('');
                              this.clearFields();

                            }
                          });

                        console.log(response);
                      },
                      (error) => console.log(error))
                  }
                  else {
                    $("#submitAdd").prop("disabled", true);
                    swal('Select Customer!')
                  }
                }
              }
              else {
                $("#submitAdd").prop("disabled", true);
                swal("Order should be greater then 0.");
              }
            }
            else { swal("Error: Already exists."); }
          });
      }
      else {
        swal("Net Payable Must be less then or equal to credit limit.");

      }
    }
    else swal("Cash Amount must be equal to Payable Amount or Zero.");

  }
  //saveOrder
  saveOrderAndWhatsapp(content, sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
    delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
    total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
    cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any) {
    var flag = false;


    if (this.cash == 0)
      flag = true;
    else //if (this.NetPayableAmount() == this.cash)   
      flag = true;


    if (flag) {
      if (freight_Chrgs > 0) {
        frieght_Id = 2;
        total_Amount = parseFloat(total_Amount) + parseFloat(freight_Chrgs);
      }
      if (this.cash > 0)
        paid_Amount = total_Amount;
      else
        paid_Amount = 0;

      var order = new saleOrder(sale_Order_ID, sO_Date, this.userCurrentOffice, this.order_Envoy, this.areacode, customer_ID, contact_ID,
        delivery_Date, method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
        total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,
        0, 1, manual_Discount, entry_Date, 1, false, this.guid, this.IsDirect, this.sd_Rate, this.sd_Amount, this.sd_Amount, 0, 0, this.logedInUserID, this.UserSessionID, 1, this.refcustomerid, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI);
      console.log(order);
      sessionStorage.setItem('ReportView', '1');
      sessionStorage.setItem('templatecode', '1');


      this.totalAmount = total_Amount;
      this.totalNetPayable = (parseFloat(this.netPayable) + parseFloat(this.totalAmount));
      // alert('totalNetPayable: ' + (parseFloat(this.netPayable) + parseFloat(this.totalAmount)) + ' credit_Limit: ' + this.credit_Limit);
      if (this.totalNetPayable < this.credit_Limit) {

        this.service.guidExist(this.guid)
          .subscribe(response => {
            this.guidOrder = (response.json());
            if (this.guidOrder == false) {
              if (this.adjust > 0) {
                if (this.sessionEnableTextboxCustomer != 1) {
                  this.isLoading = true;
                  this.service.saveOrder(order).then(
                    (response) => {
                      this.isLoading = false;
                      this.idd = response;
                      sessionStorage.setItem('ID', this.idd);
                      sessionStorage.setItem('exchange', "-1");
                      if (this.isView == true) {
                        this.onNavigate('/si-rpt-rdlc');
                      }

                      if (sessionStorage.getItem('EnableWhatsappMessage') == '1') {
                        this.service.getCustomerNo(customer_ID)
                          .subscribe(response => {
                            this.isLoading = false;

                            var list = response.json();

                            let CustomerName = list[0].name;
                            let CustomerCell = list[0].cell;

                            this.sendWhatsappMessage(CustomerCell, 'Mr./Mrs. ' + CustomerName + ' Your Invoice # ' + this.idd + ' of Rs. ' + this.totalAmount + ' has been issued.');
                          }
                          );

                      }
                      this.clearFields();
                      console.log(response);
                    },
                    (error) => console.log(error))
                }
                else {
                  if (this.textboxCustomerName != '') {
                    this.isLoading = true;
                    this.service.saveOrder(order).then(
                      (response) => {
                        this.isLoading = false;
                        this.idd = response;
                        console.log(+"iddddddddddddddddd" + response);
                        sessionStorage.setItem('ID', this.idd);
                        sessionStorage.setItem('exchange', "-1");


                        if (this.isView == true) {
                          this.onNavigate('/si-rpt-rdlc');
                        }
                        if (sessionStorage.getItem('EnableWhatsappMessage') == '1') {
                          this.service.getCustomerNo(customer_ID)
                            .subscribe(response => {
                              this.isLoading = false;

                              var list = response.json();

                              let CustomerName = list[0].name;
                              let CustomerCell = list[0].cell;

                              this.sendWhatsappMessage(CustomerCell, 'Mr./Mrs. ' + CustomerName + ' Your Invoice # ' + this.idd + 'of Rs. ' + this.totalAmount + ' has been issued.');
                            }
                            );

                        }

                        this.textboxCustomerID = 0;
                        this.customer_ID = 0;
                        this.textboxCustomerName = '';
                        this.textboxCustomerSearch = '';
                        this.searchGridCustomer = this.searchGridCustomerTemp;
                        this.searchGridItemTemp = [];
                        this.SearchItemDropDown('');
                        this.clearFields();
                        console.log(response);
                      },
                      (error) => console.log(error))
                  }
                  else {
                    $("#submitAdd").prop("disabled", true);
                    swal('Select Customer!')
                  }
                }
              }
              else {
                $("#submitAdd").prop("disabled", true);
                swal("Order should be greater then 0.");
              }
            }
            else { swal("Error: Already exists."); }
          });
      }
      else {
        swal("Net Payable Must be less then or equal to credit limit.");

      }
    }
    else swal("Cash Amount must be equal to Payable Amount or Zero.");

  }
  //sendWhatsappMessage
  sendWhatsappMessage(CustomerCell, message) {
    let apilink = 'http://';

    apilink = 'http://web.whatsapp.com/send?phone=' + CustomerCell + '&text=' + encodeURI(message);

    window.open(apilink, "_blank");
  }
  //openSendMail
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

    //$("#SaveNewCustomer").prop("disabled", true);
    //var timer = setTimeout(() => $("#addCustomerName").focus(), 500);

  }
  SendMail(ParentID) {
    if (this.CheckMailMandatoryFields() == true) {
      this.isLoading = true;
      this.emailService.sendReportMail(this.sendParentID, 1, this.sendCustomerEmail, this.sendCustomerBody)
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
}

