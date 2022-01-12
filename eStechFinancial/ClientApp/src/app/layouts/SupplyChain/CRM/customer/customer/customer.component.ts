
import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService, LoginService, Customers, CustomerDiscountService, PermissionUtility, CommonUtility, SearchFilterService, SaleOrderService } from '../../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';

import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  ////////////////////////////////////////
  public commonUtility: CommonUtility = new CommonUtility();
  tactive;
  logedInUserID: any = 1;
  userPrivilegedOffice: any = '1';
  PermissionSpecial: any = 'none';
  PermissionDropdown: any = 'none';
  PermissionCustomerDiscount: any = false;
  ////////////////////////////////////////
  p: number = 1;
  submitAdd: any;
  submitUpdate: any;
  modalReference: NgbModalRef;
  guid: any;
  customers: any[] = [];
  customerdiscounts: any[] = [];
  proscribedPersonsList: any[] = [];
  proscribedOrganizationsList: any[] = [];
  discountRates: any[] = [];
  isLoading: any = false;
  customersR: Array<Select2OptionData> = [];
  closeResult: string;
  mode: any = false;
  btnMode: any = true;
  customer_ID: any = 0;
  customer_Name: any = [
    '',
    [
      Validators.required,
      Validators.maxLength(40),
      Validators.pattern('^[A-Za-z0-9.() ]+$')
    ]
  ];
  nTN: any;
  myRegExp = new RegExp('^[A-Za-z0-9.() ]+$');
  contact_ID: any;
  contact_Name: any;
  cell: any = '';
  phone: any;
  fax: any;
  email: any;
  website: any;
  contact_Phone: any;
  contact_Cell: any;
  balance: any =0 ;
  remarks: any;
  credit_Limit: any;
  balance_Type_ID: any = 0;
  credit_Hold_ID: any = 1;
  payment_Term_ID: any = 1;
  freight_Term_ID: any = 1;
  industary_ID: any = 1;
  ownership_ID: any = 1;
  ID: any = "";
  ///////////
  addressid: any = 0;
  addresstype: any = '';
  line1: any = '';
  line2: any = '';
  line3: any = '';
  AreaShow: any = '';
  discountShow: any = '';
  area: any[] = [];
  customerCategories: any[] = [];
  areacode: any = 1;
  areaname: any = '';
  city: Array<Select2OptionData>;
  citycode: any = 0;
  cityname: any = '';
  region: any[] = [];
  regioncode: any = 0;
  regionname: any = '';
  customerCategoryId: any = 1;
  customerCategoryName: any = "";
  discountRateID: any = 1;
  discountTitle: any = "";
  province: any[] = [];
  provincecode: any = 0;
  provincename: any = '';
  country: any[] = [];
  countrycode: any = 0;
  countryname: any = '';
  address: any[] = [];
  status: any = 1;
  Exists: any = false;
  guidOrder: boolean;
  cellStatus: any = false;
  contactCellStatus: any = false;
  taxcode: any = 1;
  gst : any = 0;
  refStatus:any=false;
  disabledRefrenceCustomer:any=false;
  parent_Customer_ID: any = 0;
  parentCustomer: any[] = [];
  parentShow: any = '';
  DisabledCustomerCategories:any=false;
  balanceDisable : any = false;
  customerCode: any ='';
  textboxCustomerSearch: any = '';
  searchGridCustomer: any[] = [];
  searchGridCustomerTemp: any[] = [];
  // public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos

  public permissionUtility: PermissionUtility = new PermissionUtility();
  public valid: Validation = new Validation();
  // public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos

  public mask1 = ['+', '9', '2', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  order: any;
  orders: any[];
  users: any[];
  refCustomers: Array<Select2OptionData> = [];
  contacts: any[] = [];
  items: Array<Select2OptionData> = [];
  itemsR: any[] = [];
  unitPrices: any[];
  unit_Price: any = 0;
  payments: any[];
  saleOrderDetails: any[];
  itemStockIMEI: any[];
  stocks: any[];
  saleOrderDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  editMode = false;
  index = 1;
  order_Envoy: number;
  emp_Name: any;
  supplier_ID: number;
  sale_Order_ID = 0;
  Office_Code: any;
  allowOW = false;
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
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  Discount_Rate: any = 0;
  Tax_Rate: any = 0;
  btnmode: any = 0;
  order_ID: any = "";
  stock_Qty: any = 0;
  pending: any = 0;
  color = '#0094ff';
  IsDirect: any = false;
  frieght_Id: any = 1;
  isView: any = true;
  isStamp: any = false;
  alerts: Array<any> = [];
  hide = true;
  hideStock = true;
  hidePending = true;
  discountEditing = true;
  discountRateOption = true;
  isTaxable: any=0;
  taxRate: any = 0;
  taxable: any=0;
  IsSaleTaxInv: any = 0;
  sD_Rate: any = 0;
  sD_Amount: any = 0;
  cancelReturn: any;
  actionID: any = 4;
  dayEndDetail: any[] = [];
  specialDiscount: any = 0;
  exchange: any = 0;
  exc: any = 0;
  areaenable: any = 0;
  areashow: any = 'none';
  taxrateList: any[] = [];
  taxratecode: any = 1;
  taxratename: any = '';
  taxrate: any = 0;
  pendingSale: any = false;
  isDueDate: any = false;
  companytemplate: any[] = [];
  templatecode: any = this.LoginService.getSession('DefaultCompanyTemplate');
  templatename: any = '';
  templateshow: any = '';
  reportName: any = 'Order';
  isRPReport: any = false;
  sortOrder: any = 1;
  DelayCheck: any = true;
  userOffice: any;
  ShowSendEmail: any = 'none';
  type: any = "";
  offices: any[];
  warehouses: any[];
  officE_CODE: any;
  officE_NAME: any;
  warehouseID: any;
  warehouse: any;
  refCustomerShow: any = 'none';
  public item_Code: any = 1;
  allowPriceList: boolean = false;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  constructor(public router: Router, private cdservice: CustomerDiscountService, private service: CustomerService, private LoginService: LoginService, private modalService: NgbModal,private searchfilter: SearchFilterService, private saleOrderService : SaleOrderService) { }

  ngOnInit() {

    this.getCustomers(this.ID);
    this.getCity();
    this.getArea();
    this.getDiscountRates();



    if (this.LoginService.getSession('EnableCustomerDiscount') == '1') {

      this.PermissionCustomerDiscount = true;

    }



    this.permissionUtility.setPagePermissions(140001);
    this.permissionUtility.setPermissionItem1(140011);
    this.permissionUtility.setPermissionItem2(140104);




    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  addCustomerName: any = '';
  addCustomerCell: any = '';
  addCustomerPhone: any = '';
  addCustomerEmail: any = '';
  addCustomerAddress: any = '';
  addCustomerStatus: any = 1;
  public refCustomerID: any = 0;
  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = '';
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  sessionEnableTextboxCustomer = 0;
  textboxCustomerID: any = 0;
  textboxCustomerName: any = '';
  unit : any = 0;
  changeCustomer(e: any) {
    //  if (this.mode == false)
    if (this.sessionEnableTextboxCustomer != 1) {
      this.customer_ID = e;
    }
    this.saleOrderService.getContacts(this.customer_ID)
      .subscribe(response => {
        if (response.json() != null) {
          this.contacts = (response.json());
          this.contact_ID = this.contacts[0].contact_ID;
          if (sessionStorage.getItem('EnableDiscountGroup') != "0")
            this.Discount_Rate = this.contacts[0].discountRate;
          this.taxcode = this.contacts[0].taxcode;
          this.checkTaxCode();

          if (this.LoginService.getSession('EnableRefCustomer') != '1') {
            this.refCustomerShow = 'none';
          } else {
            this.getRefCustomers(this.customer_ID);
            this.refCustomerShow = '';
          }

          if (this.btnmode)
            this.frieght_Id = this.contacts[0].frieght_Id;

          this.exc = this.contacts[0].exchange;
          if (this.exc == true)
            this.allowExchange();
          else
            $("#allowExchange").hide();
          this.customerCategoryId = this.contacts[0].customerCategoryId;
        }
        this.frieghtChange();

        this.saleOrderService.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.unit)
          .subscribe(response => {
            if (response.json() != null) {
              this.unitPrices = (response.json());
              this.item_Code = this.unitPrices[0].item_Code;
              this.item_Name = this.unitPrices[0].item_Name;
              this.unit_Price = this.unitPrices[0].unit_Price;
              this.stock_Qty = this.unitPrices[0].stock_Qty;
              this.pending = this.unitPrices[0].pending;

              if(this.IsSaleTaxInv==1)
           {this.taxable = (this.unitPrices[0].taxable?1:0);
           }
          else{
          this.taxable=0;
          } 
              if (this.taxable == 1) {
                this.taxratecode = this.unitPrices[0].taxtypeid; 
              }
              else { 
                this.taxratecode = 1;
                this.Tax_Rate = 0; 
              }

              this.isLoading = false;
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
              this.isLoading = false;
            }
            else
              this.isLoading = false;
          });
      });

  }
  //allowExchange
  allowExchange() {
    if (sessionStorage.getItem('settingAllowExchange') != "1") {
      $("#allowExchange").hide();
    }
    else {
      $("#allowExchange").show();
    }
  }
   //frieghtChange
   frieghtChange = function () {
    var PaymentTerm = this.frieght_Id;
    if (PaymentTerm == 1) {
      $("#freightlbl").hide();
      $("#freighttxt").hide();
      this.freight_Chrgs = 0;
    }
    else {
      $("#freightlbl").show();
      $("#freighttxt").show();
    }
  }
  getRefCustomers(customer_ID) { 
    if (this.LoginService.getSession('EnableRefCustomer') != '1') {
      this.refCustomerShow = 'none';
    }
    else { 
      this.service.getRefCustomers(customer_ID)
        .subscribe(response => {
          if (response.json() != null) {
            $("#reflbl").show();
            $("#refddl").show();
           // this.refCustomers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
           // this.refCustomerID = this.refCustomers[0].id;
          }
          else {
            $("#reflbl").hide();
            $("#refddl").hide();
            this.refCustomerID = 0;
          }
        });
        
    }

  }
  setTRowActiveClass(Tag) {
    console.log(Tag)
    $('td.active').removeClass('active');
    var TRowID = "#" + Tag + "-1";
    var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
  }
  SearchCustomerByIDAndArea(Query) {
    this.textboxCustomerSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchCustomerByIDAndArea(Query, this.areacode)
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
  CustomerAddNew(content) {
    this.addCustomerName = '';
    this.addCustomerCell = '';
    this.addCustomerPhone = '';
    this.addCustomerEmail = '';
    this.addCustomerAddress = '';
    this.addCustomerStatus = 1;

    this.checkEmail = false;
    this.checkPhone = false;
    this.checkContactCell = false;
    this.checkContactPhone = false;

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
  setCustomerSearchFocus() {
    var timer = setTimeout(() => $("#textboxCustomerSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#CROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedCustomer(ID, Name) {



    console.log(ID, Name);
    this.textboxCustomerID = ID;
    this.parent_Customer_ID = ID;
    this.textboxCustomerName = Name;

    this.textboxCustomerSearch = '';
    this.searchGridCustomer = this.searchGridCustomerTemp;
    var timer = setTimeout(() => $("#ddlcontact").focus(), 500);

    if (this.btnmode != false) {
      $("#submitAdd").prop("disabled", false);
      $("#submitAddMore").prop("disabled", false);
    }



  }
  getCategory() {
    this.service.getCategories()
      .subscribe(response => {
        this.category = (response.json());
        this.categorycode = this.category[0].customerCategoryId;
        this.categoryname = this.category[0].customerCategoryName;
      });
  }
  //openCustomerAddNew
  openCustomerAddNew(content) {
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
  //getProscribedPersonsList
  getProscribedPersonsList() {
    this.service.getProscribedPersonsList()
      .subscribe(response => {
        if(response.json()!==null){
        this.proscribedPersonsList = (response.json());
        console.log(response.json());
        }
      });
  }
  //getProscribedOrganizationsList
  getProscribedOrganizationsList() {
    this.service.getProscribedOrganizationsList()
      .subscribe(response => {
        if(response.json()!==null){
        this.proscribedOrganizationsList = (response.json());
        console.log(response.json());
        }
      });
  }
  //getCustomers
  getCustomers(value: string) {
    this.isLoading = true;
    this.service.getCustomers(value)
      .subscribe(response => {
        if(response.json()!==null){
        this.customers = (response.json());
        this.customersR = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
        this.customersR = response.json();
        this.customer_ID = this.customersR[0].id;
        console.log(this.customers);
        }else{
          this.customers = [];
        }
        this.isLoading = false;

        //console.log(response.json());
      });
  }

  //changeCustomerName
  changeCustomerName(customer_Name) {
    this.contact_Name = customer_Name;
    this.checkDisableStatus();
  }
  
  //getParentCustomer
  getParentCustomer(event:any) {
    if(event==true){
    this.refStatus=true;
    this.disabledRefrenceCustomer=true;
    }
    else{
    this.refStatus=false;
    this.disabledRefrenceCustomer=false;
    }
    if (this.LoginService.getSession('EnableRefCustomer') != '1') {
      this.refCustomerShow = 'none';
    }
    else { 
      if(this.refStatus==false){
      this.service.getParentCustomer()
        .subscribe(response => {
          console.clear();
          console.log(response.json());
          if (response.json() != null) {
            $("#reflbl").show();
            $("#refddl").show();
            this.refCustomers = this.getDropdownList(response.json(), "refCustomerID", "refCustomerName");
            this.refCustomerID = this.refCustomers[0].id;
          }
          else {
            $("#reflbl").hide();
            $("#refddl").hide();
            this.refCustomerID = 0;
          }
        });
      }else
      {
        this.refCustomers=[];
      }
        
    }
  }
  //balanceTypeList
  balanceTypeList = [
       { "balance_Type_ID": 0, "balance_Type": "No Balance" }
     , { "balance_Type_ID": 1, "balance_Type": "Customer Receivable" }
     , { "balance_Type_ID": 2, "balance_Type": "Customer Payable" }

  ]
  //changeTaxCode
  changeTaxCode()
  {
    
  }
  //changeBalanceType
  changeBalanceType()
  {
     if(this.balance_Type_ID == 0)
      {
        this.balance = 0;
        this.balanceDisable = true;
      }
      else{
        this.balanceDisable = false;
      }
  }
  //craditHoldList
  creditHoldList = [
    { "credit_Hold_ID": 1, "credit_Hold": "No" }
    , { "credit_Hold_ID": 2, "credit_Hold": "Yes" }
  ]
  //paymentTermList
  paymentTermList = [
    { "payment_Term_ID": 1, "payment_Term": "Due On Receipt" }
    , { "payment_Term_ID": 2, "payment_Term": "Net 10" }
    , { "payment_Term_ID": 3, "payment_Term": "Net 15" }
    , { "payment_Term_ID": 4, "payment_Term": "Net 20" }
  ]
  //freightTermList
  freightTermList = [
    { "freight_Term_ID": 1, "freight_Term": "No Charge" }
    , { "freight_Term_ID": 2, "freight_Term": "FOD" }
  ]
  //industaryList
  industaryList = [
    { "industary_ID": 1, "industary": "Accounting" }
    , { "industary_ID": 2, "industary": "Building Supply Retail" }
    , { "industary_ID": 3, "industary": "Business Services" }
    , { "industary_ID": 4, "industary": "Social Services" }
    , { "industary_ID": 5, "industary": "Other" }
  ]
  //ownershipList
  ownershipList = [
    { "ownership_ID": 1, "ownership": "Private" }
    , { "ownership_ID": 2, "ownership": "Public" }
    , { "ownership_ID": 3, "ownership": "Subsidiary" }
    , { "ownership_ID": 4, "ownership": "Other" }
  ]
  //getCategories
  getCategories() {
    this.service.getCategories()
      .subscribe(response => {
       let allCustomerCategories=(response.json());
        if(allCustomerCategories!==null){ 
          this.customerCategories = allCustomerCategories.filter(f=>f.active==true);
        this.customerCategoryId = this.customerCategories[0].customerCategoryId;
        this.customerCategoryName = this.customerCategories[0].customerCategoryName;
        // console.log(response.json());
        }
      });

  }
  //getDiscountRates
  getDiscountRates() {

    if (this.LoginService.getSession('EnableDiscountGroup') != '1') {
      this.discountShow = 'none';
    }
    else {
      this.isLoading = true;
      this.service.getDiscountRates()
        .subscribe(response => {
          if(response.json()!==null){
          this.discountRates = (response.json());
          this.discountRateID = this.discountRates[0].discountRateID;
          this.discountTitle = this.discountRates[0].discountTitle;
          }
          //console.log(response.json());
        });
    }
  }
  //IfExists
  IfExists(customer_ID) {
    this.service.IfExists(customer_ID)
      .subscribe(response => {
        this.Exists = (response.json());
        if(response.json()!==null){
        //console.log(response.json());
        if (this.Exists == true) {
          $("#balance").prop("disabled", true);
        }
        else {
          $("#balance").prop("disabled", false);
        }
      }
      });
  }
  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.customer_ID = 0;
    this.mode = false;
    this.PermissionCustomerDiscount = true;
    this.btnMode = true;
    this.customer_Name = "";
    this.nTN = "";
    this.contact_Name = "";
    this.cell = "";
    this.phone = "";
    this.fax = "";
    this.email = "";
    this.website = "";
    this.contact_Phone = "";
    this.contact_Cell = "";
    this.balance = "";
    this.remarks = "";
    this.credit_Limit = "";
    this.status = 1;
    this.balance_Type_ID = 0;
    this.balance = 0;
    this.balanceDisable = true;
    this.credit_Hold_ID = 1;
    this.payment_Term_ID = 1;
    this.freight_Term_ID = 1;
    this.industary_ID = 1;
    this.ownership_ID = 1;
    this.customerCategoryId = 1;
    this.taxcode = 1;
    this.discountRateID = 1;
    this.parent_Customer_ID = 0;
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.status = 1;
    this.checkEmail = true;
    this.checkCell = true;
    this.checkPhone = true;
    this.checkContactCell = true;
    this.checkContactPhone = true;
    this.DisabledCustomerCategories=false;
    this.refStatus=false;
    this.disabledRefrenceCustomer=false;
    //this.mandatoryFields();
    this.getParentCustomer(this.refStatus);
    this.getCity();
    this.getArea();
    this.getCategories();
    this.getDiscountRates();
    //this.getRefCustomers('',this.customer_ID);
    this.SearchCustomerDropDownByArea('', this.areacode)
    if (this.LoginService.getSession('EnableCustomerDiscount') == '1') {
      this.PermissionCustomerDiscount = true;
    }
    else {
      this.PermissionCustomerDiscount = false;
    }
  }
  //saveCustomer
  saveCustomer(customer_ID, customer_Name, nTN, contact_Name, phone, fax, email, website, contact_Phone, contact_Cell, balance, remarks, credit_Limit, balance_Type_ID, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, line1, line2, line3, status, customerCode) {
    if (this.areacode != null) {
    }
    else {
      this.areacode = 1;
    }
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!regex.test(email)) {
      swal("Invalid Email Format");
      return;
    }
    
  if(this.cell!='' && this.cell.toString().length!=11){
    swal("Invalid cell number");
    return;
  }
  if(this.phone!='' && this.phone.toString().length!=11){
  swal("Invalid phone number");
  return;
  }
  if(this.contact_Cell!='' && this.contact_Cell.toString().length<11){
  swal("Invalid cell# number");
  return;
  }
  if(this.contact_Phone!='' && this.contact_Cell.toString().length<11){
    swal("Invalid phone# number");
    return;
    }
  if(this.fax!='' && this.fax.toString().length<11){
  swal("Invalid fax number");
  return;
  }
    // this.parent_Customer_ID = this.customers.filter(f=>f.customer_Name == this.textboxCustomerName)[0].customer_ID;
    var customer = new Customers(customer_ID, customer_Name, this.customerCategoryId, 0, contact_Name, contact_Phone, contact_Cell, this.cell, phone, fax, nTN, email, website, credit_Limit, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, balance, balance_Type_ID, this.guid, remarks, 0, 0, line1, line2, line3, this.citycode, this.provincecode, this.countrycode, status, this.areacode, this.logedInUserID, this.permissionUtility.UserSessionID, this.taxcode, this.discountRateID, this.parent_Customer_ID, customerCode,this.refStatus);
    var customer_Name = this.customer_Name.trim();
    if (customer_Name != "") {
      if (this.line1 != '') {
        
        if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.cell == '') {
          swal("Cell number must be defined.")
        }
        else if((this.balance_Type_ID == 0 || this.balance_Type_ID == 1 || this.balance_Type_ID == 2) && (this.balance.length==0))
        {
          swal("balance must be defined"+this.balance,"","info");
          return;
        }
        else {

          this.service.saveCustomer(customer).then(
            (response) => {
              //console.log(response[0].customer_ID);

              this.saveCustomerDiscounts(response[0].customer_ID);

              this.getCustomers(this.ID);
              this.modalReference.close();
              console.log(response);
            },
            (error) => { 
              //console.log(error);
              this.isLoading = false;
              this.commonUtility.handleError(error);
            
            })
        }
      } else
        swal("Address (Line 1) is required");
    }
    else {
      if (this.customer_Name.replace(/\s/g, "").length <= 0) {
        this.customer_Name = '';
      }
      swal("Customer name must be define.");
    }

  }

  //saveCustomerDiscounts
  saveCustomerDiscounts(customerID) {
    if (this.LoginService.getSession('EnableCustomerDiscount') == '1') {

      if (customerID > 0) {
        if (this.customerdiscounts.length > 0) {
          if (this.customerdiscounts[0].customerid == 0)
            this.customerdiscounts[0].customerid = customerID;
          if (this.customerdiscounts.length > 0) {

            var fcustomerdiscounts = this.customerdiscounts.filter(f => f.status == true);
            if (fcustomerdiscounts.length > 0) {

              this.cdservice.saveData(fcustomerdiscounts, customerID).then(
                (response) => {
                  this.isLoading = false;

                },
                
                  (error) =>{
                     //console.log(error);
                     this.isLoading = false;
                     this.commonUtility.handleError(error);
                })
            }
          }
        }
      }
    }

  }
  SearchCustomerDropDownByArea(Query, AreaID) {

    this.searchGridCustomer = [];
    console.log('Query', Query);
    this.isLoading = true;
    this.searchfilter.SearchCustomerDropDownByArea(Query, AreaID)
      .subscribe(response => {
        if (this.searchGridCustomer != null) {
          
          this.searchGridCustomer = (response.json());
          $('td.active').removeClass('active');
          var TRowID = "#CROW-1";
          var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
          if (this.searchGridCustomerTemp.length <= 0) {
            this.searchGridCustomerTemp = this.searchGridCustomer;
            //
          }
        }
        this.isLoading = false;
      });

  }
  //updateCustomer
  updateCustomer(customer_ID: any, customer_Name: any, nTN: any, contact_Name: any, phone: any, fax: any, email: any, website: any, contact_Phone: any, contact_Cell: any, balance: any, remarks: any, credit_Limit: any, balance_Type_ID: any, credit_Hold_ID: any, payment_Term_ID: any, freight_Term_ID: any, industary_ID: any, ownership_ID: any, line1, line2, line3, status, customerCode) {

    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!regex.test(email)) {
      swal("Invalid Email Format");
      return;
    }
     
  if(this.cell!='' && this.cell.toString().length!=11){
    swal("Invalid cell number");
    return;
  }
  if(this.phone!='' && this.phone.toString().length!=11){
  swal("Invalid phone number");
  return;
  }
  if(this.contact_Cell!='' && this.contact_Cell.toString().length<11){
  swal("Invalid cell# number");
  return;
  }
  if(this.contact_Phone!='' && this.contact_Cell.toString().length<11){
    swal("Invalid phone# number");
    return;
    }
  if(this.fax!='' && this.fax.toString().length<11){
  swal("Invalid fax number");
  return;
  }
    var customer = new Customers(customer_ID, customer_Name, this.customerCategoryId, this.contact_ID, contact_Name, contact_Phone, contact_Cell, this.cell, phone, fax, nTN, email, website, credit_Limit, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, balance, balance_Type_ID, this.guid, remarks, 0, this.addressid, line1, line2, line3, this.citycode, this.provincecode, this.countrycode, status, this.areacode, this.logedInUserID, this.permissionUtility.UserSessionID, this.taxcode, this.discountRateID, this.parent_Customer_ID, customerCode,this.refStatus);
    var customer_Name = this.customer_Name.trim();
    console.log(customer);
    if (customer_Name != "") {
      this.service.updateCustomer(customer).then(
        (response) => {

          this.saveCustomerDiscounts(customer_ID);

          this.getCustomers(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) =>{
          //console.log(error);
          this.isLoading = false;
          this.commonUtility.handleError(error);
        })
    }
    else {
      if (this.customer_Name.replace(/\s/g, "").length <= 0) {
        this.customer_Name = '';
        swal("Customer name must be define.");
      }

    }
  }
  //getDetailsByID
  getDetailsByID(customer_ID, content) {
    this.mode = true;
    this.btnMode = false;
    this.status = 0;

    this.service.getDetailsByID(customer_ID)
      .subscribe((o: Customers) => {
        if (this.LoginService.getSession('EnableCustomerDiscount') == '1') {
          this.PermissionCustomerDiscount = true;
        }
        else {
          this.PermissionCustomerDiscount = false;
        }
        sessionStorage.setItem('mcustomer_ID', o.customer_ID);
        sessionStorage.setItem('mcustomer_Name', o.customer_Name);
        this.customer_ID = o.customer_ID;
        this.IfExists(this.customer_ID);
        this.customer_Name = o.customer_Name;
        this.contact_ID = o.contact_ID;
        this.contact_Name = o.contact_Name;
        this.contact_Phone = o.contact_Phone;
        this.contact_Cell = o.contact_Cell;
        this.nTN = o.ntn;
        this.cell = o.cell;
        this.phone = o.phone;
        this.fax = o.fax;
        this.email = o.email;
        this.website = o.website;
        this.balance = o.balanceAmount;
        this.balance_Type_ID = o.balanceType;
        this.credit_Limit = o.credit_Limit;
        this.credit_Hold_ID = o.credit_Hold;
        this.payment_Term_ID = o.payment_Term;
        this.freight_Term_ID = o.freight_Term;
        this.industary_ID = o.industary;
        this.ownership_ID = o.ownership;
        this.remarks = o.remarks;
        this.status = o.status;
        this.areacode = o.areaid;
        this.getAddressByID(this.customer_ID);
        this.taxcode = o.taxcode;
        this.discountRateID = o.discountRateID;
        this.parent_Customer_ID = o.parent_Customer_ID;
        
        this.customerCode = o.customerCode;
        this.refStatus = o.allowRefrenceCustomer;

        if (this.LoginService.getSession('EnableRefCustomer') != '1') {
          this.parentShow = 'none';
        }
        else {
          if (this.parent_Customer_ID != 0 || this.parent_Customer_ID != null) {
            this.service.getParentCustomer()
              .subscribe(response => {
                let ar: Array<any> = [];
                ar.push({
                  parentCustomerID: 0,
                  parentCustomerName: 'NA'
                });
                if (response.json() != null) {
                  var arr = response.json();
                  if (arr != null) {
                    arr.forEach(
                      function (obj) {
                        ar.push({
                          parentCustomerID: obj['parentCustomerID'],
                          parentCustomerName: obj['parentCustomerName'],
                        });
                      });
                  }
                  this.textboxCustomerName = this.customers.filter(f=>f.customer_ID == o.parent_Customer_ID)[0].customer_Name;
                  this.textboxCustomerName = (o.parent_Customer_ID).toString() + ":" + this.textboxCustomerName;
                }
                this.parentCustomer = ar;
                this.parent_Customer_ID = o.parent_Customer_ID;
              });
          }
        }

        this.service.getCategories()
          .subscribe(response => { 
            let allCustomerCategories = (response.json());
            this.DisabledCustomerCategories=false;
            let disabledCustomerCategories = allCustomerCategories.filter(f=>f.customerCategoryId==o.customerCategoryId && f.active==false)
            if(disabledCustomerCategories!==null)
            {
              if(disabledCustomerCategories.length>0){
                this.DisabledCustomerCategories=true;
                this.customerCategories = allCustomerCategories.filter(f=>f.active==false)
              }else{
              this.customerCategories = allCustomerCategories.filter(f=>f.active==true)
            } 
            this.customerCategoryId = o.customerCategoryId;
            }
            
            
          });
      });


    this.openDetail(content);
    if (this.permissionUtility.PermissionView == '' || this.permissionUtility.PermissionView == "") {
      $("#submitAdd").hide();
      $("#submitUpdate").hide();

    }
  }
  //getAddressByID
  getAddressByID(customer_ID) {
    this.isLoading = true;
    this.service.getAddressByID(customer_ID)
      .subscribe(response => {
        this.address = (response.json());
        if (this.address != null) {
          this.addressid = this.address[0].addresS_ID;
          this.line1 = this.address[0].addresS_Line1;
          this.line2 = this.address[0].addresS_Line2;
          this.line3 = this.address[0].addresS_Line3;
          this.citycode = this.address[0].citY_CODE;
          this.getRegion(this.citycode);
          this.isLoading = false;
        }
        else
          this.isLoading = false;
        //console.log(response.json());
      });

  }
  // open Modal
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
  }
  // openDetail Modal
  openDetail(content) {
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
  checkEmail: any = false;
  checkPhone: any = false;
  checkContactCell: any = false;
  checkContactPhone: any = false;
  checkAddress: any = false;
  ///////////////////////////////
  //getModels
  setCustomerDiscounts(customerdiscounts: any[]) {
    console.log('Customer Discount :' + customerdiscounts[0].brandid);
    this.customerdiscounts = customerdiscounts;
  }
  checkCustomerAddress(address){
    if(address.trim() != "")
    {
      this.checkAddress = true;
      this.checkDisableStatus();
    }
    else{
      $("#SaveNewCustomer").prop("disabled", true);
    }
  }
  //getArea
  getArea() {
    if (this.LoginService.getSession('EnableAreaonSO') != '1') {
      this.AreaShow = 'none';
    }
    else {
      this.isLoading = true;
      this.service.getArea()
        .subscribe(response => {
          if(response.json()!==null){
          this.area = (response.json());
          this.areacode = this.area[0].areacode;
          this.areaname = this.area[0].areaname;
          this.isLoading = false;
          }
          //console.log(response.json());
        });
    }
  }
  //getCity
  getCity() {
    this.isLoading = true;
    this.service.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        if (response.json() != null) {
          this.citycode = this.city[0].id;
          this.cityname = this.city[0].text;
          this.getRegion(this.citycode);
          this.isLoading = false;
        }
      });
  }
  //getDistrict
  getRegion(citycode) {
    this.isLoading = true;
    this.service.getRegion(citycode)
      .subscribe(response => {
        if(response.json()!==null){
        this.region = (response.json());
        this.regioncode = this.region[0].regioncode;
        this.regionname = this.region[0].regionname;
        this.getProvince(this.regioncode);
        }
        this.isLoading = false;
        //console.log(response.json());
      });

  }
  //getProvince
  getProvince(regioncode: any) {
    this.isLoading = true;
    this.service.getProvince(regioncode)
      .subscribe(response => {
        if(response.json()!==null){
        this.province = (response.json());
        this.provincecode = this.province[0].provincecode;
        this.provincename = this.province[0].provincename; 
        this.countrycode = this.province[0].countrycode;
        this.getCountry(this.countrycode);
        
        }
        this.isLoading = false;
        // console.log(response.json());
      });

  }
  //getCountry
  getCountry(countrycode) {
    this.isLoading = true;
    this.service.getCountry(countrycode)
      .subscribe(response => {
        if(response.json()!==null){
        this.country = (response.json());
        this.countrycode = this.country[0].countrycode;
        this.countryname = this.country[0].countryname;
        
        }
        this.isLoading = false;
        // console.log(response.json());
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
  //getCustomerChange
  getCityChange(e: any) {
    this.citycode = e;
    this.getRegion(this.citycode);
    //alert(this.customerid);   
  }

 
  checkCell: any = true;
  
  checkcCustomerCode: any = true;
  checkDisableStatus() {

    if (this.customer_Name != ''
      && this.checkEmail != false
      && this.checkCell != false
      && this.checkPhone != false
      && this.checkContactCell != false
      && this.checkcCustomerCode != false
      && this.checkContactPhone != false) {
      $("#submitAdd").prop("disabled", false);
      $("#submitUpdate").prop("disabled", false);
    }
    else {
      $("#submitAdd").prop("disabled", true);
      $("#submitUpdate").prop("disabled", true);
    }

  }

  checkCustomerEmail(email) {
    if (email != '') {
      var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if (!regex.test(email)) {
        swal("Invalid Email Format");
        return;
      }
      this.isLoading = true;
      this.service.emailExists(email)
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
  checkCustomerCell(cell) {

    if (cell != '') {
      this.isLoading = true;
      this.service.contactCellExists(cell)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkCell = false;
            this.checkDisableStatus();
            swal('Cell Already Exist');
          }
          else {
            this.checkCell = true;
            this.checkDisableStatus();
          }


        });
    }
    else {

      if (this.LoginService.getSession('MandatoryCellNo') != '1') {
        this.checkCell = true;
        this.checkDisableStatus();
      }
      else {
        this.checkCell = false;
        this.checkDisableStatus();
        swal('Enter Cell No');
      }
    }
  }
  checkCustomerPhone(phone) {
    if (phone != '') {
      this.isLoading = true;
      this.service.contactCellExists(phone)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkPhone = false;
            this.checkDisableStatus();
            swal('Phone Already Exist');
          }
          else {
            this.checkPhone = true;
            this.checkDisableStatus();
          }


        });
    }
    else {
      this.checkPhone = true;
      this.checkDisableStatus();
    }
  }
  checkCContactCell(cell) {
    if (cell != '') {
      this.isLoading = true;
      this.service.contactCellExists(cell)
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
      this.checkContactCell = true;
      this.checkDisableStatus();
    }
  }
  checkCContactPhone(phone) {
    if (phone != '') {
      this.isLoading = true;
      this.service.contactCellExists(phone)
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
  checkCustomerCode(code) {
    if (code != '') {
      this.isLoading = true;
      this.service.customerCodeExists(code)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkcCustomerCode = false;
            this.checkDisableStatus();
            swal('Customer Code is Already Exist',"Please Enter a Different Code","warning");

          }
          else {
            this.checkcCustomerCode = true;
            this.checkDisableStatus();
          }

        });
    }
    else {
      this.checkcCustomerCode = true;

      this.checkDisableStatus();
    }
  }

  /*  mandatoryBorder: any = 'border-right:5px solid red;';
   validBorder: any = 'border-right:5px solid green;';
 
   mandatoryFields() {
     $("#cell").prop("style", this.validBorder);
     $("#customer_Name").prop("style", this.validBorder);
 
     if (this.cell == "") { $("#cell").prop("style", this.mandatoryBorder); }
     if (this.customer_Name == "") {
       $("#customer_Name").prop("style", this.mandatoryBorder);
 
     }
   } */
  //routePage
  routePage(value) {
    if (value == 1)
      this.router.navigate(['/customer-log']);
    else
      this.router.navigate(['/customer-sort']);
  }
   //checkTaxCode
   checkTaxCode() {
    if (this.taxcode != 1) {
      this.IsSaleTaxInv = 1;
      this.type = "Tax";
    
    }
    else {
   
      this.type = "Exempted";
      this.IsSaleTaxInv = 0;
    }

  }
}
interface ProscribedPersonsList {
  name: string;
  fatherName: string;
  cnic: number;
  province: string;
  district: string;
}









