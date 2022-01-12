import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LoginService, SearchFilterService, DayEndService, customer,  CustomerService, Customers, cDate, NgbDateFRParserFormatter, FileAttachmentService, EmailAlertService, PermissionUtility, SMSMessage, SmsAlertService, sendWhatsappMessage } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { saleOrderDetails2 } from '@shared/models/SupplyChain/CRM/saleOrderDetails2';
import { saleOrderContract } from '@shared/models/SupplyChain/CRM/saleOrderContract';
import { saleOrderContractMain} from '@shared/models/SupplyChain/CRM/saleOrderContractMain';
import { saleOrderContractMainDetails} from '@shared/models/SupplyChain/CRM/saleOrderContractMainDetail';
import { SaleOrderContractService} from '@shared/services/SupplyChain/CRM/sale-order-contract/sale-order-contract.service';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'app-sale-order-contract',
  templateUrl: './sale-order-contract.component.html',
  styleUrls: ['./sale-order-contract.component.css'],
  styles: [`
@media screen {
        .modal-sm {
           max-width: 500px !important;
            height: 250px !important;
       }
 .modal-custom {
           max-width: 800px !important;
            height: 250px !important;
       }
}
     .hide-page-numbers /deep/ .ngx-pagination li:not(.pagination-previous):not(.pagination-next) {
  display: none;
}

td.active {
  background: #5897FA;
}
        `],
  host: { '(window:keydown)': 'hotkeys($event)' },
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
}
)
export class SaleOrderContractComponent implements OnInit, AfterViewChecked {
  public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  ////////////////////////////////////////
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  sms:SMSMessage;
  public valid:Validation=new Validation();  
  /*  FUNCTIONALITYNAME: any = '';
   FUNCTIONALITYDETAILNAME: any = '';
   
   PermissionAdd: any = 'none';
   PermissionEdit: any = 'none';
   PermissionView: any = 'none';
   PermissionDelete: any = 'none';
   PermissionSpecial: any = 'none';
   PermissionDropdown: any = 'none';
   PermissionItem1: any = 'none';
   PermissionItem2: any = 'none'; */
  ////////////////////////////////////////
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  modalReferenceMail: NgbModalRef;
  order: any;
  orders: any[];
  users: any[];
  customersR: any[];
  customers: Array<Select2OptionData> = [];
  refCustomers: Array<Select2OptionData> = [];
  contacts: any[] = [];
  items: Array<Select2OptionData> = [];
  itemsR: any[] = [];
  unitPrices: any[];
  unit_Price: any = 0;
  payments: any[];
  saleOrderDetails: any[];
  saleOrderDetails2: any[];
  saleOrderDetail2: any;
  saleOrderAllDetails: any [];
  saleOrderContracts: any[];
  saleOrderContract: any;
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
  public customer_ID: any;
  public customer_Name: any;
  public refCustomerID: any = 0;
  public refCustomerName: any;
  contact_ID: any = 0;
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
  remarks: any;
  public item_Code: any = 1;
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  Discount_Rate: any = 0;
  Tax_Rate: any = 0;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  order_ID: any = "";
  stock_Qty: any = 0;
  pending: any = 0;
  isLoading: boolean;
  color = '#0094ff';
  guidOrder: boolean;
  status: any;
  IsDirect: any = false;
  frieght_Id: any = 1;
  customerCategoryId: any = 2;
  closeResult: string;
  isView: any = false;
  isStamp: any = false;
  public sO_Date = new cDate();
  public delivery_Date = new cDate();
  public Shipping_Date = new cDate();
  public paymentDate = new cDate();
  public dayEndDate = new cDate();
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
  ID: any = "";
  sD_Rate: any = 0;
  sD_Amount: any = 0;
  cancelReturn: any;
  actionID: any = 4;
  dayEndDetail: any[] = [];
  specialDiscount: any = 0;
  allowPriceList: boolean = false;
  customerCodes: any;
  exchange: any = 0;
  exc: any = 0;
  areaenable: any = 0;
  areashow: any = 'none';
  area: any[] = [];
  areacode: any = 1;
  areaname: any = ''
  taxrateList: any[] = [];
  taxratecode: any = 1;
  taxratename: any = '';
  taxrate: any = 0;
  currency: any = 'USD';
  public loadingDate = new cDate();
  public issuedDate = new cDate();
  public expPODate = new cDate();
  public shipedDate = new cDate();
  public clientDate = new cDate();
  public shipmentDate = new cDate();
  contractNo: any = '';
  refNo: any = '' ;
  exportQty: any =  0.01;
  productionQty: any =  0.01;
  shipmentTerm: any ='CAD';
  paymentTerm1: any ='CIF';
  buyerPO: any = '';
  pOtype: any = '';
  customerCode:any = '';
  conversionRate: any=  0.01;
  Color: any = '';
  Size: any = '' ;
  PackingQty: any = '1 Pair';
  upc: any  = '';
  Unit:any = 'DZN';
  Rate: any= 0.01;
  FnWt: any =  0.01;
  Processing: any = 'Direct Press';
  Composition: any = '';
  isCloseCheckbox: any = false;
   term_Condition: any = '';
  qtyHeader : any = 'Qty';
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
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;
  ShowSendEmail: any = 'none';
  taxcode: any = 1;
  type: any = "";
  offices: any[];
  warehouses: any[];
  officE_CODE: any;
  officE_NAME: any;
  warehouseID: any;
  warehouse: any;
  saleOfficerDesignation: any = '';
  refCustomerShow: any = '';
  public PermissionUtility: PermissionUtility = new PermissionUtility();

  constructor(
    public router: Router,
    private service: SaleOrderContractService,
    private fileservice: FileAttachmentService,
    private emailService: EmailAlertService,
    
    private smsService: SmsAlertService,
    private LoginService: LoginService,
    private customerService: CustomerService,
    private searchfilter: SearchFilterService,
    private DayEndService: DayEndService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    this.saleOrderDetails = new Array< saleOrderContractMainDetails>();
    this.saleOrderDetail2 = new Array<saleOrderDetails2>();
    this.saleOrderContracts = new Array<saleOrderContract>();
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.saleOfficerDesignation = this.LoginService.getSession('SaleOfficerDesignation');

    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }
  //ngOnInit
  ngOnInit() {
    this.isItemBook();
    this.showDueDate();
    this.getCurrentDay();
    this.searchSaleOrders('');
    this.getAreaEnableStatus();
    this.settingAllowPriceList();
    this.getTaxRate();
    this.PermissionUtility.setPagePermissions(140052);
    this.PermissionUtility.setPermissionItem1(140105);
    this.PermissionUtility.setPermissionItem2(140014);

    if (this.LoginService.getSession('AllowAttachmentSale') == '1')
      this.ShowAttachment = '';

    if (sessionStorage.getItem('AllowSend&EmailOnSCM') == "1")
      this.ShowSendEmail = '';

    $("#cancelSchemeBtn").hide();
    this.logedInUserID = this.LoginService.getSession('user_ID');

    //------------------------------------------------------------------------------------
    //-------------------Get Current Offices
    //------------------------------------------------------------------------------------
    this.LoginService.getCurrentOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = (response.json());
        if (this.offices != null) {
          this.userOffice = this.offices[0].officE_NAME;
          for (let i = 0; i < this.offices.length; i++)
            if (this.offices[i].officE_CODE == this.userCurrentOffice) {
              var timer = setTimeout(() => this.officE_CODE = this.offices[i].officE_CODE, 500);
            }
            else { this.officE_CODE = this.offices[0].officE_CODE; }
        }
        else { this.officE_CODE = this.offices[0].officE_CODE; }
        //------------------------------------------------------------------------------------
        //-------------------Get Current Warehouses
        //------------------------------------------------------------------------------------
        this.LoginService.getCurrentWareshouse(this.userOffice)
          .subscribe(response => {
            this.warehouses = (response.json());
            if (this.warehouses != null) {
              this.warehouseID = this.warehouses[0].warehouseID;
            }
          });
        this.LoginService.getCurrentWareshouse(this.userCurrentOffice)
          .subscribe(response => {
            this.warehouses = (response.json());


            if (this.warehouses != null) {
              for (let i = 0; i < this.warehouses.length; i++)
                if (this.warehouses[i].warehouseID == this.userCurrentWarehouse) {
                  var timer = setTimeout(() => this.warehouseID = this.warehouses[i].warehouseID, 500);
                }
                else { this.warehouseID = this.warehouses[0].warehouseID; }
            }
            else { this.warehouseID = this.warehouses[0].warehouseID; }

          });

      });

    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getCurrentDay
  getCurrentDay() {
    //this.sO_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.delivery_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.Shipping_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.paymentDate.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
  }
  //changeOffice
  changeOffice(officE_CODE) {
    if (this.offices != null) {
      for (let i = 0; i < this.offices.length; i++) {
        if (this.offices[i].officE_CODE == this.officE_CODE) {
          this.officE_NAME = this.offices[i].officE_NAME;
        }
      }
    }

    this.LoginService.getCurrentWareshouse(officE_CODE)
      .subscribe(response => {
        this.warehouses = (response.json());
        if (this.warehouses != null) {
          this.warehouseID = this.warehouses[0].warehouseID;
          this.warehouse = this.warehouses[0].warehouseName;
        }
      });
  }
  //changeWarehouse
  changeWarehouse(warehouseID) {
    if (this.warehouses != null) {
      for (let i = 0; i < this.warehouses.length; i++) {
        if (this.warehouses[i].warehouseID == this.warehouseID) {
          this.warehouseID = this.warehouses[i].warehouseID;
          this.warehouse = this.warehouses[i].warehouseName;
          // sessionStorage.setItem('userCurrentWarehouse', this.warehouseID);
        }
      }
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
      this.service.getCompanyTemplate(this.userCurrentOffice, 140052, this.IsSaleTaxInv)
        .subscribe(response => {
          this.companytemplate = (response.json());
          this.templatecode = this.companytemplate[0].templatecode;
          this.isLoading = false;
        });
    }

  }
  //changeSODate
  changeSODate(pO_Date) {
    if (this.sO_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.sO_Date.setDate(this.dayEndDate.getDateFinal());
  } 
  //changeDeliveryDate
  changeDeliveryDate(delivery_Date) {
    if (this.delivery_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.delivery_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //searchOrderDetails
  searchSaleOrders(value: string) {
    this.isLoading = true;
    this.service.searchSaleOrders(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json()!==null){
          this.isLoading = false;
          this.order = (response.json());
        }else{
          this.order = [];
          this.isLoading = false;
        }
        
      });
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getSaleOfficers(this.userPrivilegedOffice, this.saleOfficerDesignation)
      .subscribe(response => {
        this.users = (response.json());
        console.clear();
        console.log(this.users);

        if (this.users != null) {
          for (let i = 0; i < this.users.length; i++)
            if (this.users[i].order_Envoy == this.logedInUserID) {
              var timer = setTimeout(() => this.order_Envoy = this.users[i].order_Envoy, 500);
            }
            else { this.order_Envoy = this.users[0].order_Envoy; }
        }
        else { this.order_Envoy = this.users[0].order_Envoy; }



      });
  }
  changeQtyHeader(qty: any)
  {
    this.qtyHeader = 'Qty(' +qty+ ')';
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
  //setAreaEnableStatust
  setAreaEnableStatus() {
    this.areashow = 'none';
    // 
    if (this.areaenable != 1) {
      this.enableCustomerDropDownByArea(1);
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
            // console.log('Area', this.areacode)
          }
          else {
            this.areacode = this.area[0].areacode;
            this.areaname = this.area[0].areaname;
          }
          //this.getCustomers(this.areacode);
          this.enableCustomerDropDownByArea(this.areacode);
        }
      });
  }
  //getCustomers
  getCustomers(AreaID) {
    // this.isLoading = true;
    this.service.getCustomersForSO(AreaID)
      .subscribe(response => {
        this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
        this.customersR = response.json();
        this.customer_ID = this.customers[0].id;
        //getContacts
        this.service.getContacts(this.customer_ID)
          .subscribe(response => {
            if (response.json() != null) {
              this.contacts = response.json();
              this.contact_ID = this.contacts[0].contact_ID;
              if (this.btnmode)
                this.frieght_Id = this.contacts[0].frieght_Id;
              if (sessionStorage.getItem('EnableDiscountGroup') != "0")
                this.Discount_Rate = this.contacts[0].discountRate;

              this.exc = this.contacts[0].exchange;
              if (this.exc == true)
                this.allowExchange();
              else
                $("#allowExchange").hide();
              this.frieghtChange();
              this.customerCategoryId = this.contacts[0].customerCategoryId;
            }
            if (this.LoginService.getSession('EnableRefCustomer') != '1') {
              this.refCustomerShow = 'none';
            } else {
              this.getRefCustomers(this.customer_ID);
            }

            this.getCustomerCode();
          });
      });
  }
  //getRefCustomers
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
  //getItems  
  getItems() {
    this.isLoading = true;
    this.service.getItems( this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        this.isLoading = false;
      });
  }
  //changeItem
  changeItems(e: any) {
    this.isLoading = true;
    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
    }
    this.SetItem(this.item_Code);
  }
  SetItem(item_Code:any){
    
    this.allowOfficeWarehouse();
    this.service.getUnitPrice(item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID)
      .subscribe(response => {
        this.unitPrices = (response.json());

        if (response.json() != null) {
          //getContacts
          this.service.getContacts(this.customer_ID)
            .subscribe(response => {
              if (response.json() != null) {
                var cust = response.json();
                if (sessionStorage.getItem('EnableDiscountGroup') != "0")
                  this.Discount_Rate = cust[0].discountRate;
              }
            });
          this.item_Code = this.unitPrices[0].item_Code;
          this.item_Name = this.unitPrices[0].item_Name;
          this.unit_Price = this.unitPrices[0].unit_Price;
          this.stock_Qty = this.unitPrices[0].stock_Qty;
          this.pending = this.unitPrices[0].pending;
          this.Size = this.unitPrices[0].size;
         // console.log('++++' + this.unitPrices[0].taxable +' **** '+this.IsSaleTaxInv);
          if(this.IsSaleTaxInv==1)
           {this.taxable = (this.unitPrices[0].taxable?1:0);
           }
          else{
          this.taxable=0;
          }


          if (this.taxable == 1 ) { 
            if (this.taxrateList != null) {
              console.log(this.taxable +'-----------'+this.IsSaleTaxInv +'-===--'+this.unitPrices[0].taxtypeid);
              this.taxratecode = this.unitPrices[0].taxtypeid;
              for (let i = 0; i < this.taxrateList.length; i++)
                if (this.taxrateList[i].taxrateid == this.taxratecode) {
                  this.Tax_Rate = this.taxrateList[i].taxrate;
                }
            }
           
          }else {
            this.Tax_Rate = 0;
            this.taxratecode = 1;          
          }


/*
          if (this.taxable == 1) {
            this.taxratecode = this.unitPrices[0].taxtypeid;
            //this.hide= true;

            if (this.taxrateList != null) {
              for (let i = 0; i < this.taxrateList.length; i++){
                if (this.taxrateList[i].taxrateid == this.taxratecode) {

                  this.Tax_Rate = this.taxrateList[i].taxrate;
                }
              }
            }
            if (this.taxcode != 1)
             $("#TaxRateDropDown").prop("disabled", false);
          }
          else {
            this.Tax_Rate = 0;
            this.taxratecode = 1;
           // this.hide =false;
            $("#TaxRateDropDown").prop("disabled", true);
          }
*/
          this.isLoading = false;
          $("#submitAdd").prop("disabled", false);
          $("#submitAddMore").prop("disabled", false);
          this.isLoading = false;
        }
        else {
          if (this.sessionEnableTextboxItem != 1) {
            this.clearGridNewRow();
          }
          else {
            this.clearGridNewRow();

          }
        }
        this.DelayCheck = true;
        this.isLoading = false;
      });
  }
  clearGridNewRow()
  {
    this.unit_Price = 0;
    this.stock_Qty = 0;
    this.pending = 0;
    this.taxable = 0;
    this.Tax_Rate = 0;
    this.Color  = '';
    this.Size  = '' ;
    this.PackingQty  =  '1 Pair';
    this.upc   = '';
    this.Unit = 'DZN';
    this.Rate = 1.00;
  }
  //getPayments
  getPayments() {
    this.service.getPayments()
      .subscribe(response => {
        this.payments = (response.json());
        // console.log(response.json());
      });
  }
  getCustomerCode()
  {
    this.service.getCustomerCode(this.customer_ID)
    .subscribe(response => {
      this.customerCodes = (response.json());
      console.log(this.customerCodes);
      this.customerCode = this.customerCodes[0].customerCode;
    });
  }
  //changeCustomer
  changeCustomer(e: any) {
    //  if (this.mode == false)
    if (this.sessionEnableTextboxCustomer != 1) {
      this.customer_ID = e;
    }
    this.service.getContacts(this.customer_ID)
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

        this.service.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID)
          .subscribe(response => {
            if (response.json() != null) {
              this.unitPrices = (response.json());
              this.item_Code = this.unitPrices[0].item_Code;
              this.item_Name = this.unitPrices[0].item_Name;
              this.unit_Price = this.unitPrices[0].unit_Price;
              this.stock_Qty = this.unitPrices[0].stock_Qty;
              this.pending = this.unitPrices[0].pending;
              this.Size = this.unitPrices[0].size;

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
          this.getCustomerCode();
      });

  }
  //changeRefCustomer
  changeRefCustomer(e: any) {
    this.refCustomerID = e;   
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
      // 
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
    this.textboxCustomerID = 0;
    this.textboxCustomerName = '';
    this.attachments = [];
    this.order_Envoy = 0;
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
    this.specialDiscount = 0;
    this.Tax_Rate = 0;

    this.area = [];
    this.areacode = 0;
    this.areaname = '';

    this.customers = [];
    this.saleOrderDetails = [];
    this.saleOrderDetails2 = [];
    this.saleOrderContracts = [];
    $("#alertWarning").hide();
    //  $("#submitAdd").prop("disabled", false);
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    this.getPriviledgedOffices();
    this.setAreaEnableStatus();
    this.enableItemDropDown();
    this.getPayments();
    this.frieghtChange();
    this.changeIsDirect(this.IsDirect);
    this.getCompanyTemplate();
    this.getTaxRate();
    this.RemoveItemButton = '';
    this.EditItemButton = '';
    $("#AddNewItemRow").show();
    this.unit_Price = 0;
    this.stock_Qty = 0;
    this.pending = 0;
    this.taxable = 0;
    this.Tax_Rate = 0;
    this.textboxItemEditFlag = false;
    this.currency  = 'USD';
    this.loadingDate = new cDate();
    this.issuedDate = new cDate();
    this.expPODate = new cDate();
    this.shipedDate = new cDate();
    this.clientDate = new cDate();
    this.contractNo  = '';
    this.refNo  = '' ;
    this.Rate= 1.00
    this.exportQty  =  1.00;
    this.productionQty  =  1.00;
    this.shipmentTerm  ='CIF';
    this.buyerPO  = '';
    this.pOtype  = '';
    this.customerCode = '';
    this.conversionRate =  1.00;
    this.Color  = '';
    this.Size  = '' ;
    this.PackingQty  = '1 Pair';
    this.upc   = '';
    this.Unit = 'DZN';
    this.FnWt  =  1.00;
    this.Processing  = 'Direct Press';
    this.Composition  = '';
    this.paymentTerm1 = 'CAD';



    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });

  }
  //Total Cost
  TotalCost() {
    var total_Cost = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Cost += this.saleOrderDetails[count].rate * this.saleOrderDetails[count].quantity;
      }
    }

    return total_Cost.toFixed(2);;
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Discount += ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100);
      }
    }
    return total_Discount.toFixed(2);
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        total_Tax += ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) - ((this.saleOrderDetails[count].unit_Price * this.saleOrderDetails[count].quantity) * this.saleOrderDetails[count].discount_Rate / 100)) / 100 * this.saleOrderDetails[count].tax_Rate;
      }
    }
    return total_Tax.toFixed(2);;
  }
  //Total Amount
  TotalAmount() {
    var total_Amount = 0, t = 0;

    if (this.saleOrderDetails != null) {
      if (this.saleOrderDetails.length > 0) {
        for (var count = 0; count < this.saleOrderDetails.length; count++) {
          total_Amount += ((this.saleOrderDetails[count].rate * this.saleOrderDetails[count].quantity)) * this.conversionRate;
        }

        total_Amount += (parseFloat(this.freight_Chrgs) - parseFloat(this.specialDiscount));
      }
    }
    return total_Amount.toFixed(2);
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
  //changeUnitPrice
  changePrice(unit_Price) {
    if (unit_Price <= 0) {
      this.unit_Price = 1;
    }
  }
  changeRate(rate)
  {
    if (rate <= 0) {
      this.Rate = 1.00;
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
  changeDiscountRateEdit(i:  saleOrderContractMainDetails, discount_Rate) {
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
  changeQuantityEdit(i:  saleOrderContractMainDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //changeUnitPrice
  changeUnitPrice(unit_Price) {
    if (unit_Price <= 0) {
      this.unit_Price = 1;
    }
  }
  //changeUnitPriceEdit
  changeUnitPriceEdit(i:  saleOrderContractMainDetails, unit_Price) {
    if (unit_Price <= 0) {
      i.unit_Price = 1;
    }
  }
  changeRateEdit(i:  saleOrderContractMainDetails, rate) {
    if (rate <= 0.00) {
      i.rate = 1.00;
    }
  }
  //changeFreight
  changeFreight(freight_Chrgs) {
    if (freight_Chrgs <= 0)
      this.freight_Chrgs = 0;
  }
  //changePayment
  changePayment(paid_Amount) {
    if (paid_Amount <= 0)
      this.paid_Amount = 0;
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
  }
  //changeStamp
  changeStamp(isStamp) {
    if (isStamp == true)
      this.isStamp = true;
    else
      this.isStamp = false;
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
  updateItem(i:  saleOrderContractMainDetails, e: any) {

    console.log(i);

    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
    } else {
      this.item_Code = this.textboxItemIDEdit;
    }
    
    this.service.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.stock_Qty = this.unitPrices[0].stock_Qty;
        this.pending = this.unitPrices[0].pending;
        this.taxable = this.unitPrices[0].taxable;
        this.Size = this.unitPrices[0].size;
        if (this.taxable != false) {
          this.Tax_Rate = this.taxRate;
          i.tax_Rate = this.Tax_Rate;
        }
        else {
          i.tax_Rate = 0;
          i.tax_Amount = 0;
          this.Tax_Rate = 0;
        }
        i.sale_Cost = (i.quantity * i.unit_Price).toFixed(2);

        i.tax_Amount = Math.round(((i.sale_Cost) - ((i.sale_Cost) * i.discount_Rate / 100)) / 100 * i.tax_Rate);

        i.item_Code = this.item_Code;
        i.item_Name = this.item_Name;
        i.unit_Price = this.unit_Price;
        i.stock_Qty = this.stock_Qty;
        i.pending = this.pending;
        i.color =  this.Color;
          i.size =this.Size ;
        i.packingQty  =  this.PackingQty;
         i.upc  = this.upc ;
         i.unit =  this.Unit;

      });

  }
  //changeMode
  changeMode(idx: any, i:  saleOrderContractMainDetails, Mode: any) {
    this.DelayCheck = true;
    $('td.active').removeClass('active');
    console.log("Index : " + idx + "--- Page :" + this.g);
    console.log(i);




    var flag = false;
    if (this.saleOrderDetails.length > 0) {
      for (var count = 0; count < this.saleOrderDetails.length; count++) {
        if (this.saleOrderDetails[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (this.pendingSale == true)
      var Qty = i.quantity + this.pending;
    else
      Qty = i.quantity;

    if (this.sessionEnableTextboxItem != 1) {
      // this.service.getStocks(i.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      //   .subscribe(response => {
      //     this.stocks = (response.json());
      //     this.stock_Qty = this.stocks[0].stock_Qty;

          if (Mode == 0) {
            
            if(this.checkFields(i.color, i.size, i.packingQty, i.upc, i.unit, i.weight, i.processing))
            return;
            // if (this.stock_Qty != null && this.stock_Qty >= Qty) {
              if (i.rate != 0) {
                console.log('--' + i.rate);
                //if (flag == false) {
                if (i.quantity > 0) {
                  i.edit_Mode = false;
                  i.sale_Cost = (i.rate * i.quantity).toFixed(2);
                  i.discount_Amount = ((i.quantity) * (i.rate) * (i.discount_Rate) / 100).toFixed(2);
                  i.tax_Amount = ((i.sale_Cost - i.discount_Amount) / 100 * i.tax_Rate).toFixed(2);
                  i.net_Amount = ((parseFloat(i.sale_Cost) - parseFloat(i.discount_Amount)) + parseFloat(i.tax_Amount)).toFixed(2);
                } else {
                  swal("Quantity should be greater then 0");
                  return;
                }
                //} else {
                //  swal("Already Exists");
                //  return;
                //}
              } else {
                swal("Rate should be greater then 0");
                return;
              }
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
              $("#submitUpdate").prop("disabled", false);
            // }
            // else {
            //   $("#submitAdd").prop("disabled", true);
            //   $("#submitAddMore").prop("disabled", true);
            //   $("#submitUpdate").prop("disabled", true);
            //   swal("Stock is not available." + this.stock_Qty + "");
            //   return;
            // }
          }
          else if (Mode == 2) {

            console.log("Index : " + idx + "--- Page :" + this.g);
            this.saleOrderDetails.splice(idx, 1);
            //this.getItems();
            this.Quantity=1;
            this.Discount_Rate=0;
            this.taxratecode = this.taxrateList[0].taxrateid;
            this.Tax_Rate = this.taxrateList[0].taxrate;
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

          if (Mode == 1) {
            $("#AddNewItemRow").hide();
            this.EditItemButton = 'disabled';
            this.RemoveItemButton = 'disabled';


          }
          else {
            $("#AddNewItemRow").show();
            this.EditItemButton = '';
            this.RemoveItemButton = '';
            /* this.stock_Qty = 0;
            this.unit_Price = 0;
            this.pending = 0; */
          }

        // });

    }
    else {
      this.textboxItemEditFlag = true;
      // this.service.getStocks(i.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      //   .subscribe(response => {
      //     this.stocks = (response.json());
      //     this.stock_Qty = this.stocks[0].stock_Qty;

          if (Mode == 0) {
            
            if(this.checkFields(i.color, i.size, i.packingQty, i.upc, i.unit, i.weight, i.processing))
            return;
            // if (this.stock_Qty != null && this.stock_Qty >= Qty) {
              if (i.rate != 0) {
                //if (flag == false) {
                if (i.quantity > 0) {
                  i.edit_Mode = false;
                  //this.service.getStocks(i.item_Code)
                  //  .subscribe(response => {
                  //    this.stocks = (response.json());
                  //    this.stock_Qty = this.stocks[0].stock_Qty;

                  //  });

                  i.sale_Cost = (i.rate * i.quantity).toFixed(2);
                  i.discount_Amount = ((i.quantity) * (i.rate) * (i.discount_Rate) / 100).toFixed(2);

                  i.tax_Amount = ((i.sale_Cost - i.discount_Amount) / 100 * i.tax_Rate).toFixed(2);
                  i.net_Amount = ((parseFloat(i.sale_Cost) - parseFloat(i.discount_Amount)) + parseFloat(i.tax_Amount)).toFixed(2);



                } else {
                  swal("Quantity should be greater then 0");
                  return;
                }
                //} else {
                //  swal("Already Exists");
                //  return;
                //}
              } else {
                swal("Rate should be greater then 0");
                return;
              }
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
              $("#submitUpdate").prop("disabled", false);
            // }
            // else {
            //   $("#submitAdd").prop("disabled", true);
            //   $("#submitAddMore").prop("disabled", true);
            //   $("#submitUpdate").prop("disabled", true);
            //   swal("Stock is not available." + this.stock_Qty + "");
            //   return;
            // }
          }
          else if (Mode == 2) {
            console.log("Index : " + idx + "--- Page :" + this.g);
            this.saleOrderDetails.splice(idx, 1);
            //this.getItems();
            this.Quantity=1;
            this.Discount_Rate=0;
            this.taxratecode = this.taxrateList[0].taxrateid;
            this.Tax_Rate = this.taxrateList[0].taxrate;

          }
          else {
            console.log("Index : " + idx + "--- Page :" + this.g);
            this.textboxItemIDEdit = i.item_Code;
            this.textboxItemNameEdit = i.item_Name;

            console.log(i);
            i.edit_Mode = true;
          }

          if (Mode == 1) {
            $("#AddNewItemRow").hide();
            this.EditItemButton = 'disabled';
            this.RemoveItemButton = 'disabled';

          }
          else {
            $("#AddNewItemRow").show();
            this.EditItemButton = '';
            this.RemoveItemButton = '';
            this.textboxItemEditFlag = false;
            /* this.stock_Qty = 0;
            this.unit_Price = 0;
            this.pending = 0; */
          }

        // });
    }


  }
  //addGrid
  addGrid(item_Code: any, item_Name: any, Quantity: any,Color: any ,Size: any ,PackingQty: any ,upc: any ,Unit: any ,FnWt: any ,Processing: any ,isClosed: any, Rate: any) {
    
    $("#userCurrentOffice").prop("disabled", true);
    $("#userCurrentWarehouse").prop("disabled", true);
    if (this.DelayCheck) {
      this.DelayCheck = false;
      $('td.active').removeClass('active');
      if (this.pendingSale == true)
        var Qty = Quantity + this.pending;
      else
        Qty = Quantity;
      if(Color!= '' && Size!= '' && PackingQty!= '' && upc!= '' && Unit!= '' && FnWt!= '' && Processing!= '' ){
        if (Rate != 0) {
          // if (this.stock_Qty != null && this.stock_Qty >= Qty) {
            if (item_Name != null) {
              if (Quantity > 0) {
                var serialNo = 0;
                var flag = false;
                if (this.saleOrderDetails.length > 0) {
                  for (var count = 0; count < this.saleOrderDetails.length; count++) {
                    if (this.saleOrderDetails[count].item_Code == item_Code) {
                      flag = true;
                      serialNo = count + 1;
                      break;
                    }
                  }
                }
                if (flag == false) {
                  if (this.hide == false) {
                    this.saleOrderDetails2.push(new saleOrderDetails2(0,0,Color,Size,PackingQty,upc,Unit,FnWt,Processing,'',((Quantity * Rate) * this.conversionRate), Rate));
                    this.saleOrderDetails.push(new  saleOrderContractMainDetails(0, 0, item_Code, item_Name, 0.00, Quantity, (Rate * Quantity), 0.00, 0.00, 0, 0, 0, 0, ((Quantity) * (Rate)).toFixed(2), 0, this.stock_Qty, this.pending, 0,Color,Size,PackingQty,upc,Unit,FnWt,Processing,'',((Quantity * Rate) * this.conversionRate),Rate));
                    //this.saleOrderAllDetails.push(this.saleOrderDetails, this.saleOrderDetails2);     , 0,Color,Size,PackingQty,upc,Unit,FnWt,Processing,Composition,(((Quantity * Unit_Price) * this.conversionRate)) + (Quantity * Unit_Price)
                    
                    this.Quantity=1;
                    this.Discount_Rate=0; 
                    this.taxratecode = this.taxrateList[0].taxrateid;
                    this.Tax_Rate = this.taxrateList[0].taxrate;
                  }
                  else {
                    this.saleOrderDetails2.push(new saleOrderDetails2(0,0,Color,Size,PackingQty,upc,Unit,FnWt,Processing,'',((Quantity * Rate) * this.conversionRate), Rate));
                    this.saleOrderDetails.push(new  saleOrderContractMainDetails(0, 0, item_Code, item_Name, 0.00, Quantity, (Rate * Quantity), 0.00, 0.00, 0, 0, 0, 0, ((Quantity) * (Rate)).toFixed(2), 0, this.stock_Qty, this.pending, 0,Color,Size,PackingQty,upc,Unit,FnWt,Processing,'',((Quantity * Rate) * this.conversionRate),Rate));
                    
                    this.Quantity=1;
                    this.Discount_Rate=0;
                    this.taxratecode = this.taxrateList[0].taxrateid;
                    this.Tax_Rate = this.taxrateList[0].taxrate;
                  }
                  //console.log('TAXAMOUNT', this.saleOrderDetails);
                  if (this.sessionEnableTextboxItem != 0) {
                    this.textboxItemID = 0;
                    this.item_Code = 0;
                    this.textboxItemName = '';
                    this.changeItems(this.item_Code);
                  }
                  this.editMode = false;
                  this.clearGridNewRow();
                }
                else {
                  swal("Already Exists At Sr # " + serialNo);
                  return;
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
            $("#submitAddMore").prop("disabled", false);
          // } else {
          //   $("#submitAdd").prop("disabled", true);
          //   $("#submitAddMore").prop("disabled", true);
          //   swal("Stock is not available." + this.stock_Qty + "");
          //   return;
          // }
        } else {
          swal("Rate should be greater then 0");
          this.returnBack();
          return;
        }
      }else {
        this.checkFields(Color, Size, PackingQty, upc, Unit, FnWt, Processing);


        this.returnBack();
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }
  }
  checkFields(Color, Size, PackingQty, upc, Unit, FnWt, Processing)
  {
    
    let check = false
    if(Color == '' || Size == '' || PackingQty == '' || upc == '' || Unit == '' || FnWt == '' || Processing == '' )
    {
        if(Color == '')
        swal("Color is requied!","","error");

        else if(Size == '' || Size == null)
        swal("Size is requied!","","error");

        else if(PackingQty == '') 
        swal("Packing Qty is requied!","","error");

        else if(upc == '') 
        swal("upc # is requied!","","error");

        else if(Unit == '') 
        swal("Unit is requied!","","error");

        else if(FnWt == '') 
        swal("FnWt is requied!","","error");

        else if(Processing == '')
        swal("Processing is requied!","","error");

        check = true
    }
    return check;
  }
  returnBack()
  {
        this.DelayCheck = true;
        this.isLoading = false;
    $("#userCurrentOffice").prop("disabled", false);
    $("#userCurrentWarehouse").prop("disabled", false);
    $("#submitAdd").prop("disabled", false);
    $("#submitAddMore").prop("disabled", false);
    $('td.active').addClass('active');
  }
  //IfExists
  IfExists(sale_Order_ID) {
    this.service.IfExists(sale_Order_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {

          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);

          if (this.LoginService.getSession('AllowSchemeCancel') == '1')
            $("#cancelSchemeBtn").show();
          else
            $("#cancelSchemeBtn").hide();



          $("#submitUpdate").prop("disabled", true);
          $("#AddNewItemRow").hide();
          this.EditItemButton = 'disabled';
          this.RemoveItemButton = 'disabled';

        }
        else {

          $("#alertWarning").hide();
          $("#cancelBtn").prop("disabled", false);


          if (this.LoginService.getSession('AllowSchemeCancel') == '1')
            $("#cancelSchemeBtn").show();
          else
            $("#cancelSchemeBtn").hide();

          $("#submitUpdate").prop("disabled", false);
          $("#AddNewItemRow").show();
          this.EditItemButton = '';
          this.RemoveItemButton = '';
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
    sessionStorage.setItem('IsOrder', '1');
    sessionStorage.setItem('reportName', this.reportName);
    sessionStorage.setItem('templatecode', '0');
    sessionStorage.setItem('ReportSave', "0");
    sessionStorage.setItem('SendingMedium', "0");
    sessionStorage.setItem('isStamp', this.isStamp);
    sessionStorage.setItem('ReportView', "1");
    sessionStorage.setItem('ReportParentType', "1");//SaleOrderEmail

    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }

    //alert(sessionStorage.getItem('templatecode'));
    if (pth == "/duplicate-rpt-rdlc") {
      sessionStorage.setItem('reportID', "5");
      window.open(pth, "_blank");
    }
    else if (pth == "/so-rpt-excel") {
      sessionStorage.setItem('ReportView', "2");
      sessionStorage.setItem('reportID', "4");
      window.open(pth, "_blank");
    }
    else if (pth == "/so-rpt-rdlc") {
      sessionStorage.setItem('ReportView', "1");
      sessionStorage.setItem('reportID', "14");
      window.open(pth, "_blank");
    }
    else if (pth == "/so-rpt-mail") {
      sessionStorage.setItem('reportID', "4");
      sessionStorage.setItem('ReportSave', "1");
      sessionStorage.setItem('ReportID', this.ID);
      sessionStorage.setItem('SendingMedium', "1");
    }
   
    else {
      sessionStorage.setItem('reportID', "4");
      window.open(pth, "_blank");
    }
    sessionStorage.setItem('exchange', "-1");

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
          this.service.cancelOrder(this.sale_Order_ID, this.actionID)
            .subscribe(response => {
              swal("Poof! Your order has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              this.searchSaleOrders('');
              this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  //cancelScheme
  cancelScheme() {
    swal({
      title: "Do you really want to cancel schem?",
      text: "Once cancelled, you will not be able to recover this scheme!",
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
          this.service.cancelScheme(this.sale_Order_ID)
            .subscribe(response => {
              swal("Poof! Your order scheme has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              this.saleOrderDetail

              this.service.getDetailsByID(this.sale_Order_ID)
                .subscribe((o:  saleOrderContractMain) => {
                  this.saleOrderDetails = o.saleOrderDetails;
                  $("#alertWarning").hide();
                  $("#submitUpdate").prop("disabled", false);
                  $("#AddNewItemRow").show();
                  this.EditItemButton = '';
                  this.RemoveItemButton = '';


                });
              // this.service.getDetailsByID(this.sale_Order_ID);
              //this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  ckeckEmptyFields( buyerPO, refNo, customerCode, shipmentTerm, contractNo, paymentTerm){
    let check = false
    if(buyerPO == '' || refNo == '' || customerCode == '' || shipmentTerm =='' || paymentTerm == '' || contractNo == '')
        {
          if( contractNo == '')
          swal("Please Enter the Contract No.!","","info");
          else if(buyerPO == '')
          swal("Please Enter Customer PO!","","info");
          else if(refNo == '')
          swal("Please Enter the Ref #!","","info");
          else if(customerCode == '' || customerCode == null)
          swal("Please Enter the Customer Code!","","info");
          else if(shipmentTerm == '')
          swal("Please Enter the Shipment Term!","","info");
          else if(paymentTerm == '')
          swal("Please Enter the Payment Term","","info");
          check = true;
          
        }
    var sodate = new Date(this.sO_Date.getDateFinal());
      var issuedate = new Date(this.issuedDate.getDateFinal());
      var loaddate = new Date(this.loadingDate.getDateFinal());
      var shipmentdate = new Date(this.shipmentDate.getDateFinal());
      var shipdate = new Date(this.shipedDate.getDateFinal());
      var exportdate = new Date(this.expPODate.getDateFinal());
      var clientate = new Date(this.clientDate.getDateFinal());
      if (sodate > issuedate  || sodate > shipmentdate || sodate > shipdate || sodate > exportdate   || sodate > loaddate || loaddate > shipdate) 
      {
        if(sodate > issuedate) {
          swal('Issued Date Must Be Greater Than PO Date',"","warning");
        }
        else if(sodate > loaddate)
        {
          swal('Loading Date Must Be Greater Than To PO Date','','warning');
        }
        else if(loaddate > shipdate)
        {
          swal('Shiped Date Must Be Greater Than To Loading Date','','warning');
        }
        else if(sodate > shipmentdate)
        {
          swal('Shipment Date Must Be Greater Than To PO Date','','warning');
        }
        else if(sodate > exportdate)
        {
          swal('Export PO Date Must Be Greater Than To PO Date','','warning');
        }
        $("#submitAdd").prop("disabled", false);
        $("#submitAddMore").prop("disabled", false);
        check = true;
      }
      return check;
    
  }
  //saveOrder
  saveOrder(sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
    delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
    total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
    cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any,
    exportQty: any, expPODate: any, shipmentTerm: any,  refNo: any,  productionQty: any,  shipedDate: any,  pOtype: any,  
    customerCode: any, clientDate : any,  loadingDate: any,  issuedDate: any, conversionRate : any, currency : any,  
    contractNo: any,  buyerPO  ,paymentTerm, shipmentDate,term_Condition) {
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    this.allowOfficeWarehouse();
    if (this.customer_ID > 0) {
      if(this.ckeckEmptyFields( buyerPO, refNo, customerCode, shipmentTerm, contractNo, paymentTerm))
      {
          $("#submitAdd").prop("disabled", false);
          $("#submitAddMore").prop("disabled", false);
          return;
      }
      if (total_Amount > 0) {
          
          this.saleOrderContracts.push( new saleOrderContract(0,this.sO_Date.getDateFinal(),exportQty,this.expPODate.getDateFinal(),
          shipmentTerm,  term_Condition,refNo, productionQty, this.shipedDate.getDateFinal(),sale_Order_ID, pOtype, customerCode,this.clientDate.getDateFinal(), 
          this.isCloseCheckbox, remarks, this.loadingDate.getDateFinal(), this.issuedDate.getDateFinal(),conversionRate ,currency , contractNo, buyerPO,
          this.shipmentDate.getDateFinal(), paymentTerm))
          //this.saleOrderContracts.push( new saleOrderContract(0,sO_Date,exportQty,expPODate,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate,sale_Order_ID, pOtype, customerCode,clientDate, 0, '' , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO))
          this.isLoading = true;
          var order = new  saleOrderContractMain(sale_Order_ID, this.sO_Date.getDateFinal(), this.userCurrentOffice, order_Envoy, customer_ID, contact_ID,
            this.delivery_Date.getDateFinal(), method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
            total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,
            0, 1, manual_Discount, entry_Date, 1, false, this.guid, this.IsDirect, this.sD_Rate, this.sD_Amount, this.specialDiscount, this.exchange, 0, this.logedInUserID, this.UserSessionID, this.templatecode, this.refCustomerID, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI
            ,this.saleOrderDetails2, this.saleOrderContracts
            );

          this.service.saveOrder(order).then(
            (response) => {

              this.isLoading = false;
              this.ID = response;
              sessionStorage.setItem('ID', this.ID);
              sessionStorage.setItem('exchange', "-1");
              sessionStorage.setItem('AreaID', this.areacode);
              if (this.isView == true) {
                this.onNavigate('/so-rpt-rdlc');
              }

            
              this.searchSaleOrders('');
              this.modalReference.close();
              console.log(response);
            
            },
            (error) => {
              console.log(error); this.isLoading = false;
            })
        
      }
      else {
        swal("Order should be greater then 0");
      }
    } else {
      swal('Select Customer!');
    }
  }
  //saveOrder
  // saveMoreOrder(sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
  //   delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
  //   total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
  //   cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any,
  //   exportQty: any, expPODate: any, shipmentTerm: any,  refNo: any,  productionQty: any,  shipedDate: any,  pOtype: any,  
  //   customerCode: any, clientDate : any,  loadingDate: any,  issuedDate: any, conversionRate : any, currency : any,  
  //   contractNo: any,  buyerPO,paymentTerm, shipmentDate,term_Condition) {
  //   $("#submitAddMore").prop("disabled", true);
  //   $("#submitAdd").prop("disabled", true);
  //   this.allowOfficeWarehouse();
  //   if (this.customer_ID > 0) {
  //     if(this.ckeckEmptyFields( buyerPO, refNo, customerCode, shipmentTerm, contractNo, paymentTerm))
  //     {
  //         $("#submitAdd").prop("disabled", false);
  //         $("#submitAddMore").prop("disabled", false);
  //         return;
  //     }
  //     if (total_Amount > 0) {
        
  //       this.saleOrderContracts.push( new saleOrderContract(0,this.sO_Date.getDateFinal(),exportQty,this.expPODate.getDateFinal(),shipmentTerm, term_Condition,refNo, productionQty, this.shipedDate.getDateFinal(),sale_Order_ID, pOtype, customerCode,this.clientDate.getDateFinal(), this.isCloseCheckbox,remarks, this.loadingDate.getDateFinal(), this.issuedDate.getDateFinal(),conversionRate ,currency , contractNo, buyerPO,this.shipmentDate.getDateFinal(), paymentTerm))
  //       //this.saleOrderContracts.push( new saleOrderContract(0,sO_Date,exportQty,expPODate,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate,sale_Order_ID, pOtype, customerCode,clientDate, 0, '' , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO))
  //       this.isLoading = true;
  //       var order = new  saleOrderContractMain(sale_Order_ID, this.sO_Date.getDateFinal(), this.userCurrentOffice, order_Envoy, customer_ID, contact_ID,
  //         this.delivery_Date.getDateFinal(), method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
  //         total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,

  //         0, 1, manual_Discount, entry_Date, 1, false, this.guid, this.IsDirect, this.sD_Rate, this.sD_Amount, this.specialDiscount, this.exchange, 0, this.logedInUserID, this.UserSessionID, this.templatecode, this.refCustomerID, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI
  //         ,this.saleOrderDetails2, this.saleOrderContracts
  //         //  productionQty, shipedDate, pOtype, customerCode,clientDate, 0 , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO
  //         );


  //       this.service.saveOrder(order).then(
  //         (response) => {

  //           this.isLoading = false;
  //           this.ID = response;
  //           sessionStorage.setItem('ID', this.ID);
  //           sessionStorage.setItem('exchange', "-1");
  //           sessionStorage.setItem('AreaID', this.areacode);
  //           if (this.isView == true) {
  //             this.onNavigate('/so-rpt-rdlc');
  //           }
  //           this.searchSaleOrders('');


  //           $("#submitAddMore").prop("disabled", false);
  //           console.log('Working')
  //           this.clearFields();
  //           this.taxFields();
  //           this.stockField();
  //           this.pendingField();
  //           this.disableDiscountEditing();
  //           this.rdlcStatus();
  //           this.IncludePendingSale();


  //           console.log(response);
  //         },
  //         (error) => console.log(error))
        
  //     }
  //     else {
  //       swal("Order should be greater then 0");
  //     }
  //   } else {
  //     swal('Select Customer!');
  //   }
  // }
  //saveOrderAndMail
  // saveOrderAndMail(content, sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
  //   delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
  //   total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
  //   cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any,
  //   exportQty: any, expPODate: any, shipmentTerm: any,  refNo: any,  productionQty: any,  shipedDate: any,  pOtype: any,  
  //   customerCode: any, clientDate : any,  loadingDate: any,  issuedDate: any, conversionRate : any, currency : any,  
  //   contractNo: any,  buyerPO,paymentTerm, shipmentDate,term_Condition) {

  //   $("#submitAdd").prop("disabled", true);
  //   $("#submitAddMore").prop("disabled", true);
  //   $("#submitAddMail").prop("disabled", true);
  //   $("#submitAddWA").prop("disabled", true);
  //   this.allowOfficeWarehouse();
  //   if (this.customer_ID > 0) {
  //     if(this.ckeckEmptyFields( buyerPO, refNo, customerCode, shipmentTerm, contractNo, paymentTerm))
  //     {
  //         $("#submitAdd").prop("disabled", false);
  //         $("#submitAddMore").prop("disabled", false);
  //         return;
  //     }
  //     if (total_Amount > 0) {
  //       $("#submitAddMore").hide();
  //       $("#submitAdd").hide();
  //       $("#submitAddMail").hide();
  //       $("#submitAddWA").hide();
  //       this.saleOrderContracts.push( new saleOrderContract(0,this.sO_Date.getDateFinal(),exportQty,this.expPODate.getDateFinal(),shipmentTerm, term_Condition,refNo, productionQty, this.shipedDate.getDateFinal(),sale_Order_ID, pOtype, customerCode,this.clientDate.getDateFinal(), this.isCloseCheckbox, remarks, this.loadingDate.getDateFinal(), this.issuedDate.getDateFinal(),conversionRate ,currency , contractNo, buyerPO,this.shipmentDate.getDateFinal(), paymentTerm))
  //       this.isLoading = true;
  //       var order = new  saleOrderContractMain(sale_Order_ID, this.sO_Date.getDateFinal(), this.userCurrentOffice, order_Envoy, customer_ID, contact_ID,
  //         this.delivery_Date.getDateFinal(), method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
  //         total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,
  //         0, 1, manual_Discount, entry_Date, 1, false, this.guid, this.IsDirect, this.sD_Rate, this.sD_Amount, this.specialDiscount, this.exchange, 0, this.logedInUserID, this.UserSessionID, this.templatecode, this.refCustomerID, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI
  //         ,this.saleOrderDetails2, this.saleOrderContracts
  //         // ,sO_Date,exportQty,expPODate,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate, pOtype, customerCode,clientDate, 0 , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO
  //         );

  //       this.service.saveOrder(order).then(
  //         (response) => {


  //           this.ID = response;

  //           sessionStorage.setItem('ID', this.ID);
  //           sessionStorage.setItem('exchange', "-1");
  //           sessionStorage.setItem('AreaID', this.areacode);
  //           //if (this.isView == true) {
  //           this.onNavigate('/so-rpt-mail');
  //           this.isLoading = true;
  //           this.modalReference.close();
  //           this.service.getCustomerEmail(customer_ID)
  //             .subscribe(response => {
  //               this.isLoading = false;
  //               if (response.json() != null) {
  //                 var list = response.json();
  //                 this.sendParentID = this.ID;
  //                 this.sendCustomerName = list[0].name;
  //                 this.sendCustomerEmail = list[0].email;
  //                 this.sendCustomerBody = 'Please Type Some Text!';
  //                 this.isLoading = true;
  //                 this.openSendMail(content);
  //                 this.searchSaleOrders('');


  //                 $("#submitAddMore").prop("disabled", false);
  //                 console.log('Working')
  //                 this.clearFields();
  //                 this.taxFields();
  //                 this.stockField();
  //                 this.pendingField();
  //                 this.disableDiscountEditing();
  //                 this.rdlcStatus();
  //                 this.IncludePendingSale();


  //                 this.mode = true;
  //               }
  //             });


  //           console.log(response);
  //         },

  //         (error) => {
  //           console.log(error); this.isLoading = false;
  //         })
        
  //     }
  //     else {
  //       swal("Order should be greater then 0");
  //       $("#submitAdd").prop("disabled", false);
  //       $("#submitAddMore").prop("disabled", false);
  //       $("#submitAddMail").prop("disabled", false);
  //     }
  //   } else {
  //     swal('Select Customer!');
  //     $("#submitAdd").prop("disabled", false);
  //     $("#submitAddMore").prop("disabled", false);
  //     $("#submitAddMail").prop("disabled", false);
  //   }
  // }
  // //saveOrderAndMail
  // saveOrderAndWhatsapp(content, sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
  //   delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
  //   total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
  //   cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any,
  //   exportQty: any, expPODate: any, shipmentTerm: any,  refNo: any,  productionQty: any,  shipedDate: any,  pOtype: any,  
  //   customerCode: any, clientDate : any,  loadingDate: any,  issuedDate: any, conversionRate : any, currency : any,  
  //   contractNo: any,  buyerPO,paymentTerm, shipmentDate,term_Condition) {
 
  //   $("#submitAdd").prop("disabled", true);
  //   $("#submitAddMore").prop("disabled", true);
  //   $("#submitAddMail").prop("disabled", true);
  //   this.allowOfficeWarehouse();
  //   if (this.customer_ID > 0) {
  //     if(this.ckeckEmptyFields( buyerPO, refNo, customerCode, shipmentTerm, contractNo, paymentTerm))
  //     {
  //         $("#submitAdd").prop("disabled", false);
  //         $("#submitAddMore").prop("disabled", false);
  //         return;
  //     }
  //     if (total_Amount > 0) {
  //       $("#submitAddMore").hide();
  //       $("#submitAdd").hide();
  //       $("#submitAddMail").hide();
  //       this.saleOrderContracts.push( new saleOrderContract(0,this.sO_Date.getDateFinal(),exportQty,this.expPODate.getDateFinal(),shipmentTerm, term_Condition,refNo, productionQty, this.shipedDate.getDateFinal(),sale_Order_ID, pOtype, customerCode,this.clientDate.getDateFinal(), this.isCloseCheckbox, remarks, this.loadingDate.getDateFinal(), this.issuedDate.getDateFinal(),conversionRate ,currency , contractNo, buyerPO,this.shipmentDate.getDateFinal(), paymentTerm))
  //       //this.saleOrderContracts.push( new saleOrderContract(0,sO_Date,exportQty,expPODate,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate,sale_Order_ID, pOtype, customerCode,clientDate, 0, '' , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO))
  //       this.isLoading = true;
  //       var order = new  saleOrderContractMain(sale_Order_ID, this.sO_Date.getDateFinal(), this.userCurrentOffice, order_Envoy, customer_ID, contact_ID,
  //         this.delivery_Date.getDateFinal(), method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
  //         total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,
  //         0, 1, manual_Discount, entry_Date, 1, false, this.guid, this.IsDirect, this.sD_Rate, this.sD_Amount, this.specialDiscount, this.exchange, 0, this.logedInUserID, this.UserSessionID, this.templatecode, this.refCustomerID, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI
  //         ,this.saleOrderDetails2, this.saleOrderContracts
  //         // ,sO_Date,exportQty,expPODate,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate, pOtype, customerCode,clientDate, 0 , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO
  //         );

  //       this.service.saveOrder(order).then(
  //         (response) => {


  //           this.ID = response;

  //           sessionStorage.setItem('ID', this.ID);
  //           sessionStorage.setItem('exchange', "-1");
  //           sessionStorage.setItem('AreaID', this.areacode);
  //           //if (this.isView == true) {
  //           this.onNavigate('/so-rpt-whatsapp');
  //           this.isLoading = true;
  //           this.service.getCustomerEmail(customer_ID)
  //             .subscribe(response => {
  //               this.isLoading = false;
  //               if (response.json() != null) {
  //                 var list = response.json();
  //                 this.sendParentID = this.ID;
  //                 this.sendCustomerName = list[0].name;
  //                 this.sendCustomerEmail = list[0].email;
  //                 this.sendCustomerBody = 'Please Type Some Text!';
  //                 this.isLoading = true;
  //                 this.openSendWhatsapp(content);
  //                 this.searchSaleOrders('');


  //                 $("#submitAddMore").prop("disabled", false);
  //                 console.log('Working')
  //                 this.clearFields();
  //                 this.taxFields();
  //                 this.stockField();
  //                 this.pendingField();
  //                 this.disableDiscountEditing();
  //                 this.rdlcStatus();
  //                 this.IncludePendingSale();


  //                 this.mode = true;
  //               }
  //             });


  //           console.log(response);
  //         },

  //         (error) => {
  //           console.log(error); this.isLoading = false;
  //         })
        
  //     }
  //     else {
  //       swal("Order should be greater then 0");
  //       $("#submitAdd").prop("disabled", false);
  //       $("#submitAddMore").prop("disabled", false);
  //       $("#submitAddMail").prop("disabled", false);
  //     }
  //   } else {
  //     swal('Select Customer!');
  //     $("#submitAdd").prop("disabled", false);
  //     $("#submitAddMore").prop("disabled", false);
  //     $("#submitAddMail").prop("disabled", false);
  //   }
  // }
  //updateOrder
  updateOrder(sale_Order_ID: any, sO_Date: any, office_Code: any, order_Envoy: any, customer_ID: any, contact_ID: any,
    delivery_Date: any, method_Id: any, payment_ID: any, frieght_Id: any, total_Cost: any, total_Discount: any,
    total_Tax: any, freight_Chrgs: any, total_Amount: any, paid_Amount: any, reorder_ID: any, quotation_ID: any, order_Type: any, remarks: any,
    cancel: any, company_ID: any, manual_Discount: any, entry_Date: any, user_ID: any, is_Update: any, sOGUID: any,
    exportQty: any, expPODate: any, shipmentTerm: any,  refNo: any,  productionQty: any,  shipedDate: any,  pOtype: any,  
    customerCode: any, clientDate : any,  loadingDate: any,  issuedDate: any, conversionRate : any, currency : any,  
    contractNo: any,  buyerPO,paymentTerm, shipmentDate,term_Condition) {
    this.allowOfficeWarehouse();
    
    if (this.customer_ID > 0) {
      if(this.ckeckEmptyFields( buyerPO, refNo, customerCode, shipmentTerm, contractNo, paymentTerm))
      {
          $("#submitAdd").prop("disabled", false);
          $("#submitAddMore").prop("disabled", false);
          return;
      }
      if (total_Amount > 0) {
        
        this.isLoading = true;
        this.saleOrderContracts.push( new saleOrderContract(0,this.sO_Date.getDateFinal(),exportQty,this.expPODate.getDateFinal(),shipmentTerm, term_Condition,refNo, productionQty, this.shipedDate.getDateFinal(),sale_Order_ID, pOtype, customerCode,this.clientDate.getDateFinal(), 0, remarks, this.loadingDate.getDateFinal(), this.issuedDate.getDateFinal(),conversionRate ,currency , contractNo, buyerPO,this.shipmentDate.getDateFinal(), paymentTerm))
        //this.saleOrderContracts.push( new saleOrderContract(0,sO_Date,exportQty,expPODate,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate,sale_Order_ID, pOtype, customerCode,clientDate, 0, '' , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO))
        var order = new  saleOrderContractMain(sale_Order_ID, this.sO_Date.getDateFinal(), this.userCurrentOffice, order_Envoy, customer_ID, contact_ID,
          this.delivery_Date.getDateFinal(), method_Id, payment_ID, frieght_Id, total_Cost, total_Discount,
          total_Tax, freight_Chrgs, total_Amount, paid_Amount, 1, 1, "New", remarks,

          1, 1, manual_Discount, entry_Date, 1, true, this.guid, this.IsDirect, this.sD_Rate, this.sD_Amount, this.specialDiscount, this.exchange, 0, this.logedInUserID, this.UserSessionID, this.templatecode, this.refCustomerID, this.userCurrentWarehouse, this.saleOrderDetails, this.itemStockIMEI
          ,this.saleOrderDetails2, this.saleOrderContracts
          // ,shipmentTerm, 'Term & Condition',refNo, productionQty, shipedDate, pOtype, customerCode,clientDate, 0 , loadingDate, issuedDate,conversionRate ,currency , contractNo, buyerPO
          );

        this.service.updateOrder(order).then(
          (response) => {

            this.isLoading = false;
            this.searchSaleOrders('');
            this.modalReference.close();
            if (this.isView == true) {
              this.onNavigate('/so-rpt-rdlc');
            }


          

            console.log(response);
          },
          (error) => {
            console.log(error); this.isLoading = false;
          })
        
      }
      else {
        swal("Order must be greater then 0.");
      }
    }
    else {
      swal("Please Select Customer!")
    }
    // this.ClearFields();
  }
  //getDetailsByID
  getDetailsByID(sale_Order_ID, content) {
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });

    this.saleOrderDetails = [];

    this.detailOpen(content);
    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';


    if (this.LoginService.getSession('EnableCustomerSearchDropDown') != '1') {
      $("#DropDownCustomerSearch").hide();
      this.sessionEnableTextboxCustomer = 0;

    }
    else {
      $("#DropDownCustomerSelect2").hide();
      this.sessionEnableTextboxCustomer = 1;
      this.textboxCustomerID = 0;
      this.customer_ID = 0;
      this.textboxCustomerName = '';

    }
    if (this.LoginService.getSession('EnableItemSearchDropDown') != '1') {
      $("#DropDownItemSearch").hide();
      this.sessionEnableTextboxItem = 0;
      this.getItems();
    }
    else {
      $("#DropDownItemSelect2").hide();
      this.sessionEnableTextboxItem = 1;
      this.SearchItemDropDown('');

      this.textboxItemID = 0;
      this.item_Code = 0;
      this.textboxItemName = '';
      this.stock_Qty = 0;
      this.pending = 0;
      this.taxable = 0;
      this.Tax_Rate = 0;
    }

    sessionStorage.setItem('reportID', "4");
    sessionStorage.setItem('ID', sale_Order_ID);
    this.mode = true;
    this.btnmode = false;
    //this.edit();
    this.IfExists(sale_Order_ID);

    this.isLoading = true;
    this.service.getDetailsByID(sale_Order_ID)
      .subscribe((o:  saleOrderContractMain) => {
        this.isLoading = false;
        this.attachments = [];
        console.clear();
        console.log(' saleOrderContractMain', o);
        this.sale_Order_ID = o.sale_Order_ID;
        sessionStorage.setItem('exchange', "-1");
        sessionStorage.setItem('ID', this.sale_Order_ID.toString());
        sessionStorage.setItem('customerID', o.customer_ID.toString());
        this.sO_Date.setDate(o.sO_Date);
        this.contact_ID = o.contact_ID;
        this.payment_ID = o.payment_ID;
        this.remarks = o.remarks;
        this.delivery_Date.setDate(o.delivery_Date);
        this.method_Id = o.shipping_Method;
        this.specialDiscount = o.specialDiscount;
        this.total_Amount = o.total_Amount;
        this.total_discount = o.total_Discount;
        this.saleOrderDetails = o.saleOrderDetails;
        this.currency = o.saleOrderContract[0].currency;
        this.loadingDate.setDate(o.saleOrderContract[0].loadingDate);
        this.issuedDate.setDate(o.saleOrderContract[0].issuedDate);
        this.expPODate.setDate(o.saleOrderContract[0].expairDate);
        this.shipedDate .setDate(o.saleOrderContract[0].shipedDate);
        this.clientDate.setDate(o.saleOrderContract[0].clientDate);
        this.shipmentDate.setDate(o.saleOrderContract[0].shipmentDate);
        this.contractNo  = o.saleOrderContract[0].contractNo;
        this.refNo  = o.saleOrderContract[0].refanceNo ;
        this.exportQty  = o.saleOrderContract[0].exportQty;
        this.productionQty  = o.saleOrderContract[0].productionQty;
        this.shipmentTerm  = o.saleOrderContract[0].shipmentTerm;
        this.buyerPO  = o.saleOrderContract[0].buyerPO;
        this.pOtype  = o.saleOrderContract[0].pOType;
        this.customerCode= o.saleOrderContract[0].customerCode;
        this.conversionRate = o.saleOrderContract[0].conversionRate;
        this. term_Condition = o.saleOrderContract[0].term_Condition;
        this.paymentTerm1 = o.saleOrderContract[0].paymentTerm;
        this.saleOrderDetails = [];
        
        for(let i=0; i< o.saleOrderDetails.length; i++)
        {
          this.saleOrderDetails.push( new  saleOrderContractMainDetails (o.saleOrderDetails[i].sale_Detail_ID, o.saleOrderDetails[i].sale_Order_ID, o.saleOrderDetails[i].item_Code, o.saleOrderDetails[i].item_Name, o.saleOrderDetails[i].unit_Price,
            o.saleOrderDetails[i].quantity, o.saleOrderDetails[i].sale_Cost, o.saleOrderDetails[i].discount_Rate, o.saleOrderDetails[i].discount_Amount, o.saleOrderDetails[i].taxrateid, o.saleOrderDetails[i].tax_Rate, o.saleOrderDetails[i].tax_Amount, o.saleOrderDetails[i].manual_Discount, o.saleOrderDetails[i].net_Amount,
            o.saleOrderDetails[i].edit_Mode, o.saleOrderDetails[i].stock_Qty, o.saleOrderDetails[i].pending, o.saleOrderDetails2[i].sale_Order_Detail_ID2,  o.saleOrderDetails2[i].color, o.saleOrderDetails2[i].size, o.saleOrderDetails2[i].packingQty, o.saleOrderDetails2[i].upc, o.saleOrderDetails2[i].unit, o.saleOrderDetails2[i].weight, o.saleOrderDetails2[i].processing,
            o.saleOrderDetails2[i].composition, o.saleOrderDetails2[i].amountPKR, o.saleOrderDetails2[i].rate))
        }
        for(let i =0; i < o.saleOrderDetails.length; i++)
        {
          this.saleOrderDetails2.push( new  saleOrderDetails2 ( o.saleOrderDetails2[i].sale_Order_Detail_ID2, o.saleOrderDetails[i].sale_Detail_ID, o.saleOrderDetails2[i].color, o.saleOrderDetails2[i].size, o.saleOrderDetails2[i].packingQty, o.saleOrderDetails2[i].upc, o.saleOrderDetails2[i].unit, o.saleOrderDetails2[i].weight, o.saleOrderDetails2[i].processing,
            o.saleOrderDetails2[i].composition, o.saleOrderDetails2[i].amountPKR, o.saleOrderDetails2[i].rate))
        }
        
        this.exchange = o.exchange;
        this.refCustomerID = o.refCustomerID;

        if (this.LoginService.getSession('EnableRefCustomer') != '1') {
          this.refCustomerShow = 'none';
        } else {
          this.service.getRefCustomers(this.customer_ID)
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

        //set office & warehouse
        if (sessionStorage.getItem('AllowOfficeWarehouse') != "1") {
          this.allowOW = false;
        }
        else {
          this.allowOW = true;
          this.officE_CODE = o.officE_CODE;
          this.LoginService.getCurrentWareshouse(o.officE_CODE)
            .subscribe(response => {
              this.warehouses = (response.json());
              if (this.warehouses != null) {
                this.warehouseID = o.warehouseID;
              }
            });
        }

        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            //this.isLoading = true
            this.users = (response.json());
            this.order_Envoy = o.sale_Envoy;
          });
        if (o.scheme == 1) {
          if (this.status != true) {
            $("#alertWarning").show();
            $("#submitUpdate").prop("disabled", true);
            $("#AddNewItemRow").hide();
            this.EditItemButton = 'disabled';
            this.RemoveItemButton = 'disabled';
            $("#cancelBtndrop").show();
            this.alerts = []
            this.alerts.push(
              {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is used in Sale Order Scheme...',
              });
          }
        }
        else
          if (o.cancel == 1) {
            if (this.status != true) {
              $("#alertWarning").show();
              $("#file-input").prop("disabled", true);
              $("#cancelBtn").prop("disabled", true);

              if (this.LoginService.getSession('AllowSchemeCancel') == '1')
                $("#cancelSchemeBtn").show();
              else
                $("#cancelSchemeBtn").hide();

              $("#alertWarning").show();
              $("#submitUpdate").prop("disabled", true);
              $("#AddNewItemRow").hide();
              this.EditItemButton = 'disabled';
              this.RemoveItemButton = 'disabled';

              this.alerts = []
              this.alerts.push(
                {
                  id: 4,
                  type: 'danger',
                  message: 'Record is not updatable since it is Cancelled...',
                });
            }
          }

        for (let i = 0; i < this.saleOrderDetails.length; i++) {

          this.isLoading = true;
          this.service.getUnitPrice(this.saleOrderDetails[i].item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID)
            .subscribe(response => {
          
              this.isLoading = false;
              this.unitPrices = (response.json());
              if(this.unitPrices !==null){
              this.saleOrderDetails[i].stock_Qty = this.unitPrices[0].stock_Qty;
              this.saleOrderDetails[i].pending = this.unitPrices[0].pending;
              }
            });
        }
        if (this.sessionEnableTextboxCustomer != 1) {


          this.isLoading = true;
          this.service.getCustomersForSO(0)
            .subscribe(response => {
              this.isLoading = false;
              this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
              this.isLoading = false;
              if( this.customers!==null){
              for (let i = 0; i < this.customers.length; i++) {
                if (this.customers[i].id == o.customer_ID) {
                  this.customer_ID = this.customers[i].id;
                  this.customer_Name = this.customers[i].text;

                  var customlist = response.json();

                  if (this.areaenable != 1) {

                  }
                  else {
                    this.areashow = '';
                    this.service.getArea()
                      .subscribe(response => {
                        this.area = (response.json());
                        for (let i = 0; i < customlist.length; i++)
                          if (customlist[i].customer_ID == this.customer_ID) {
                            this.areacode = customlist[i].areacode;

                            if (this.sessionEnableTextboxCustomer != 0) {
                              this.SearchCustomerDropDownByArea('', this.areacode);
                            }


                          }

                      });
                  }

                }
              }
            }
            });
        }
        else {
          this.SearchCustomerByIDAndArea(o.customer_ID);

          if (this.areaenable != 0) {
            this.service.getCustomersForSO(0)
              .subscribe(response => {
                this.isLoading = false;
                var customlist = response.json();
                this.areashow = '';

                this.service.getArea()
                  .subscribe(response => {
                    this.area = (response.json());
                    for (let i = 0; i < customlist.length; i++)
                      if (customlist[i].customer_ID == this.customer_ID) {
                        this.areacode = customlist[i].areacode;
                        this.SearchCustomerDropDownByArea('', this.areacode);
                      }
                  });

              });
          }
        }


        this.frieght_Id = o.freight_Term;
        this.freight_Chrgs = o.freight_Chrgs;

        if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
          this.templateshow = 'none';
        }
        else {
          this.templateshow = '';
          this.getCompanyTemplate();
          this.templatecode = o.template_ID;
        }

        this.guid = o.sOGUID;
        this.getFiles(this.guid);

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
            var timer = setTimeout(() => $(TRowID).click(), 1000);
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
      this.isTaxable = 0;
      this.Tax_Rate = 0;
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
  //rdlcStatus
  rdlcStatus() {
    if (sessionStorage.getItem('settingInvoiceReports') != "1") {
      this.isView = false;
    }
    else {
      this.isView = true;
    }
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
  //allowOfficeWarehouse
  allowOfficeWarehouse() {
    if (sessionStorage.getItem('AllowOfficeWarehouse') != "1") {
      this.allowOW = false;
    }
    else {
      this.allowOW = true;
      this.userCurrentOffice = this.officE_CODE;
      this.userCurrentWarehouse = this.warehouseID;
    }
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
  //IncludePendingSale
  settingAllowPriceList() {
    if (sessionStorage.getItem('settingAllowPriceList') != "1")
      this.allowPriceList = false;
    else
      this.allowPriceList = true;
  }
  //IncludePendingSale
  IncludePendingSale() {
    if (sessionStorage.getItem('IncludePendingSale') != "1") {
      this.pendingSale = false;
    }
    else {
      this.pendingSale = true;
    }
  }
  // open modal
  open(content) {
    this.getCurrentDay();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.service.getContractNo().
    subscribe(reponse=> {
      console.log(reponse.json());
      this.contractNo = (reponse.json())[0].contractNo;
    });
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
    $("#file-input").prop("disabled", false);
    $("#submitUpdate").hide();
    $("#btnDuplicate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    $("#viewRDLC").prop("disabled", true);
    $("#viewExcel").prop("disabled", true);
    $("#cancelBtn").hide();
    $("#cancelSchemeBtn").hide();
    $("#allowExchange").hide();

    if (this.LoginService.getSession('EnableCustomerSearchDropDown') != '1') {
      $("#DropDownCustomerSearch").hide();
    }
    else {
      $("#DropDownCustomerSelect2").hide();
    }

    this.allowOfficeWarehouse();
    this.clearFields();
    this.taxFields();
    this.stockField();
    this.pendingField();
    this.disableDiscountEditing();
    this.rdlcStatus();
    this.allowStamp();
    this.IncludePendingSale();

    var timer = setTimeout(() => $("#textboxCustomer").focus(), 500);
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
    $("#file-input").prop("disabled", false);
    $("#submitAdd").hide();
    $("#submitAddMore").hide();
    $("#submitUpdate").show();
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    $("#cancelBtn").show();

    if (this.LoginService.getSession('AllowSchemeCancel') == '1')
      $("#cancelSchemeBtn").show();
    else
      $("#cancelSchemeBtn").hide();

    $("#allowExchange").hide();
    //$("#viewBtn").hide();
    $("#viewStamp").show();
    if (this.LoginService.getSession('AllowDuplicate') == '1')
      $("#btnDuplicate").show();
    else
      $("#btnDuplicate").hide();

    this.clearFields(); 
    this.taxFields();

    this.stockField();
    this.pendingField();
    this.disableDiscountEditing();
    this.allowStamp();
    //this.rdlcStatus();
    this.IncludePendingSale();

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
  //showDueDate
  showDueDate() {
    if (sessionStorage.getItem('ShowDueDateOnSO') != "1") {
      this.isDueDate = false;
    }
    else {
      this.isDueDate = true;
    }
  }
  ///////////////////////////////////////////
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  sessionEnableTextboxCustomer = 0;
  textboxCustomerID: any = 0;
  textboxCustomerName: any = '';
  textboxCustomerSearch: any = '';
  searchGridCustomer: any[] = [];
  searchGridCustomerTemp: any[] = [];
  ///////////////////////////////////////////
  enableCustomerDropDownByArea(AreaID) {

    if (this.LoginService.getSession('EnableCustomerSearchDropDown') != '1') {
      $("#DropDownCustomerSearch").hide();
      this.sessionEnableTextboxCustomer = 0;
      this.getCustomers(AreaID)
    }
    else {
      $("#DropDownCustomerSelect2").hide();
      this.sessionEnableTextboxCustomer = 1;
      this.SearchCustomerDropDownByArea('', AreaID);
    }
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
  setCustomerSearchFocus() {
    var timer = setTimeout(() => $("#textboxCustomerSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#CROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedCustomer(ID, Name) {



    console.log(ID, Name);
    this.textboxCustomerID = ID;
    this.customer_ID = ID;
    this.textboxCustomerName = Name;

    this.textboxCustomerSearch = '';
    this.searchGridCustomer = this.searchGridCustomerTemp;
    var timer = setTimeout(() => $("#ddlcontact").focus(), 500);

    if (this.btnmode != false) {
      $("#submitAdd").prop("disabled", false);
      $("#submitAddMore").prop("disabled", false);
    }



  }
  ///////////////////////////////////////////
  sessionEnableTextboxItem = 0;
  textboxItemID: any = 0;
  textboxItemName: any = '';
  textboxItemSearch: any = '';
  searchGridItem: any[] = [];
  searchGridItemTemp: any[] = [];
  textboxItemEditFlag: any = false;
  textboxItemIDEdit: any = 0;
  textboxItemNameEdit: any = '';
  textboxItemSearchEdit: any = '';
  isBook: any = false;
  ///////////////////////////////////////////
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
    //
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
          //
          if (this.textboxItemEditFlag != true) {
            this.item_Code = 0;
            this.textboxItemID = 0;
            this.textboxItemName = '';

          }
          else {
            this.textboxItemIDEdit = 0;
            this.textboxItemNameEdit = '';
          }

        }
        this.isLoading = false;
      });

  }
  SearchItemDropDown(Query) {
    this.allowOfficeWarehouse();
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
    if (this.textboxItemEditFlag != true) {
      var timer = setTimeout(() => $("#textboxItemSearch").focus(), 500);
    } else {
      var timer = setTimeout(() => $("#textboxItemSearchEdit").focus(), 500);
    }
    $('td.active').removeClass('active');
    $("#IROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedItem(ID, Name) {

    $('td.active').removeClass('active');
    this.DelayCheck = true;
    if (this.textboxItemEditFlag != true) {
      this.textboxItemID = ID;
      this.item_Code = ID;
      this.textboxItemName = Name;
      this.textboxItemSearch = '';
      var timer = setTimeout(() => $("#unit_Price").focus(), 500);
    }
    else {
      console.log(ID, Name);
      this.textboxItemIDEdit = ID;
      this.item_Code = ID;
      this.textboxItemNameEdit = Name;
      this.textboxItemSearchEdit = '';
      $("#UPEdit").focus();
      //var timer = setTimeout(() => $("#UPEdit").focus(), 500);
    }
    this.searchGridItem = this.searchGridItemTemp;
  }
  setTRowActiveClass(Tag) {
    console.log(Tag)
    $('td.active').removeClass('active');
    var TRowID = "#" + Tag + "-1";
    var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
  }
  ///////////////////////////////////////////
  addCustomerName: any = '';
  addCustomerCode: any ='';
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
  ///////////////////////////////////////////
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
  //saveCustomer
  saveCustomer() {

    if (this.addCustomerName != "") {

      if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.addCustomerCell == '') {
        swal("Cell number must be defined.")
      }
      else {

        var customer = new Customers(0, this.addCustomerName, this.categorycode, 0, this.addCustomerName, this.addCustomerPhone, this.addCustomerCell, this.addCustomerCell, this.addCustomerPhone, '', '', this.addCustomerEmail, '', 0, 1, 1, 1, 1, 1, 0, 1, this.guid, '', 0, 0, this.addCustomerAddress, '', '', this.citycode, 1, 1, this.addCustomerStatus, 1, this.logedInUserID, this.UserSessionID, 1, 1, this.refCustomerID, this.customerCode);
        console.log(customer);
        this.isLoading = true;
        this.customerService.saveCustomer(customer).then(
          (response) => {
            var list = response;

            this.service.getCustomersForSO(this.areacode)
              .subscribe(response => {
                this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
                this.setSelectedCustomer(list[0].customer_ID, list[0].customer_ID + ' : ' + list[0].customer_Name);

                //if (this.customer_ID == 1)
                //  this.customerCategoryId = 1;
                //else this.customerCategoryId = 2;
                //getContacts
                this.service.getContacts(list[0].customer_ID)
                  .subscribe(response => {
                    this.contacts = response.json();
                    if (this.contacts != null) {
                      this.contact_ID = this.contacts[0].contact_ID;
                      this.frieght_Id = this.contacts[0].frieght_Id;
                      this.exc = this.contacts[0].exchange;
                      if (this.exc == true)
                        this.allowExchange();
                      else
                        $("#allowExchange").hide();
                      this.frieghtChange();
                      this.customerCategoryId = this.contacts[0].customerCategoryId;
                      this.isLoading = false
                    }
                  });
              });


            //this.getCustomers(this.areacode);
            // this.setSelectedCustomer(list[0].customer_ID, list[0].customer_ID + ' : ' + list[0].customer_Name);

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
  ///////////////////////////////////////////
  checkEmail: any = false;
  checkPhone: any = false;
  checkContactCell: any = false;
  checkContactPhone: any = false;
  checkAddress: any = false;
  checkCustomerCode: any = false
  ///////////////////////////////////////////
  checkDisableStatus() { 
    if (this.addCustomerName.trim() != ''
      && this.checkEmail != false
      && this.checkContactCell != false
      && this.checkContactPhone != false
      && this.checkAddress != false
      && this.addCustomerCode.trim() != '') {
        
      $("#SaveNewCustomer").prop("disabled", false);
    }
   
    else {
      $("#SaveNewCustomer").prop("disabled", true);
    }

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
  checkcCustomerCode(code) {
    if (code != '') {
      this.isLoading = true;
      this.customerService.customerCodeExists(code)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkCustomerCode = false;
            this.checkDisableStatus();
            swal('Customer Code is Already Exist',"Please Enter a Different Code","warning");

          }
          else {
            this.checkCustomerCode = true;
            this.checkDisableStatus();
          }

        });
    }
    else {
      this.checkCustomerCode = true;

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
  //-----------FILE ATTACHMENT----------//
  ///////////////////////////////////////////
  ShowAttachment: any = 'none';
  imageUrl: string = "../../../../assets/img/bill.png";
  fileToUpload: File = null;
  filename: any = '';
  attachments: any[] = [];
  ///////////////////////////////////////////
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload);
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
      this.fileservice.postFile(this.guid, 1, this.filename, this.fileToUpload)
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
  ///////////////////////////////////////////
  sendParentID: any = '';
  sendCustomerName: any = '';
  sendCustomerEmail: any = '';
  sendCustomerBody: any = '';
  ///////////////////////////////////////////
  //openSendMail
  openSendMail(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',     
      keyboard: false,
    };

    this.modalReferenceMail = this.modalService.open(content, { size: 'xlg' });
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
  ///////////////////////////////////////////
  wsendParentID: any = '';
  wsendCustomerName: any = '';
  wsendCustomerEmail: any = '';
  wsendCustomerBody: any = '';
  ///////////////////////////////////////////
  //openSendMail
  openSendWhatsapp(content) {
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
  SendWhatsapp(ParentID) {
    if (this.CheckWhatsappMandatoryFields() == true) {
      this.isLoading = true;
      this.emailService.sendReportMail(this.wsendParentID, 1, this.wsendCustomerEmail, this.wsendCustomerBody)
        .subscribe(response => {
          this.isLoading = false;
          this.modalReferenceMail.close();
        });
    }
  }
  CheckWhatsappMandatoryFields() {
    if (this.wsendParentID != '') {
      if (this.wsendCustomerName != '') {
        if (this.wsendCustomerEmail != '') {
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
  //routeInvoice
  routeInvoice(value) {
    if (value == 1)
      if (sessionStorage.getItem('AllowSchemeScreen') != "0")
        this.router.navigate(['/order-schemes']);
      else
        this.router.navigate(['/order-scheme']);
    else
      this.router.navigate(['/sale-order-import']);
  }
  //getTaxRate 
  getTaxRate() { 
    this.isLoading = true;
    this.service.getTaxRates()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.taxrateList = (response.json());
          if(this.IsSaleTaxInv==0)     
             this.taxratecode = this.taxrateList[0].taxrateid; 
          
           
        }
      });
  }
  //changeTaxRate
  changeTaxRate() {
    if (this.taxrateList != null) {
      for (let i = 0; i < this.taxrateList.length; i++)
        if (this.taxrateList[i].taxrateid == this.taxratecode) {
          this.Tax_Rate = this.taxrateList[i].taxrate;
        }
    }
  }
  //changeTaxRate
  changeTaxRateGrid(j:  saleOrderContractMainDetails) {

    if (this.taxrateList != null) {
      for (let i = 0; i < this.taxrateList.length; i++)
        if (this.taxrateList[i].taxrateid == j.taxrateid) {

          j.tax_Rate = this.taxrateList[i].taxrate;
          j.tax_Amount = ((j.sale_Cost - j.discount_Amount) / 100 * j.tax_Rate).toFixed(2);
          j.net_Amount = ((parseFloat(j.sale_Cost) - parseFloat(j.discount_Amount)) + parseFloat(j.tax_Amount)).toFixed(2);
        }
    }
  }

  is_edit: boolean=false;
  SetTax(IsSaleTaxInv:any){
    this.IsSaleTaxInv=IsSaleTaxInv;
  
     if(IsSaleTaxInv==1){ 
       $("#TaxRateDropDown").prop("disabled", false); 
       this.is_edit=false; 
 
       this.SetItem(this.item_Code);
     
     }
 else{
   this.taxratecode=this.taxrateList[0].taxrateid;
  this.Tax_Rate=0;
  this.is_edit=true;
   if(this.saleOrderDetails.length>0)
   { 
     for (let i = 0; i < this.saleOrderDetails.length; i++) {
       
         this.saleOrderDetails[i].taxrateid = this.taxratecode; 
         this.saleOrderDetails[i].net_Amount-=this.saleOrderDetails[i].tax_Amount;
         this.saleOrderDetails[i].tax_Rate=0;
         this.saleOrderDetails[i].tax_Amount=0;
     }
   }
    $("#TaxRateDropDown").prop("disabled", true); 
 }
    
 
     this.getCompanyTemplate();
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
