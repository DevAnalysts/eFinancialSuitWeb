import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderService, LoginService, SupplierService, Suppliers, FileAttachmentService, SearchFilterService, DayEndService, Supplier, purchaseOrder, purchaseOrderDetails, cDate, NgbDateFRParserFormatter, EmailAlertService, PermissionUtility, CommonUtility, SaleOrderService } from '../../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'purchase-order',
  host: { '(window:keydown)': 'hotkeys($event)' },
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class PurchaseOrderComponent implements OnInit, AfterViewChecked {
  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;

  public permissomUtility: PermissionUtility = new PermissionUtility();
  public commonUtility: CommonUtility = new CommonUtility();
  public valid: Validation = new Validation();
  ////////////////////////////////////////
  public exampleData: Array<Select2OptionData>;
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  g: number = 1;
  aaa: number = 1;
  modalReference: NgbModalRef;
  public supp: any;
  closeResult: string;
  order: any;
  status: any;
  orders: any[];
  unitList: any[];
  users: any;
  suppliers: Array<Select2OptionData> = [];
  contacts: any[] = [];
  items: Array<Select2OptionData>;
  unitPrices: any[];
  payments: any[];
  supplier: Supplier[];
  purchaseOrderDetails: any[];
  purchaseOrderDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  selectedSupplier: Supplier = new Supplier(0, 0, '');
  editMode = false;
  hide = true;
  hideStock = true;
  hideUPP = true;
  allowOW = true;
  packQuantity: any = true;
  packQty: any[];
  pack_Quantity: any = 0;
  measurement_Unit: any = 0;
  index = 1;
  order_Envoy: any = 1;
  public supplier_ID: any;
  public supplier_Name: any;
  supplier_IDID: any;
  SupplierID: any = 0;
  purchase_Order_ID = 0;
  Office_Code: any;
  PO_NO: any;
  Supplier_ID: any = 1;
  contact_Person_ID: any;
  contact_ID: any = 0;
  shipping_Method: any;
  payment_ID: any;
  freight_Term: any;
  total_Cost: any = 0;
  total_Discount: any = 0;
  freight_Chrgs: any = 0;
  total_Amount: any = 0;
  remarks: any;
  public item_Code: any;
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 0;
  Discount_Rate: any = 0;
  Tax_Rate: any = 0;
  stock_Qty: any = 0;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  method_Id: any = 1;
  frieght_Id: any = 1;
  pO_Detail_ID: any = 0;
  unit_Price: any = 0;
  upp: any = 0;
  order_ID: any = "";
  foucs: any;
  isLoading: boolean;
  color = '#0094ff';
  guidOrder: boolean;
  public pO_Date = new cDate();
  public delivery_Date = new cDate();
  public Shipping_Date = new cDate();
  public paymentDate = new cDate();
  public dayEndDate = new cDate();
  isView: any = true;
  ID: any = "";
  AllowTaxOnPurchase: boolean = false;
  IsPurchaseTaxInv: number = 0;
  isTaxable: boolean;
  taxRate: any = 0;
  taxable: any;
  cancelReturn: any;
  buttons: any;
  dangerMode: any;
  actionID: any = 1;
  exchange: any = 0;
  exc: any = 0;
  settings1 = {
    singleSelection: 'true',
    enableSearchFilter: true
  };
  multiItems: any = false;
  dayEndDetail: any[] = [];
  alerts: Array<any> = [];
  isDueDate: any = false;
  DelayCheck: any = true;

  offices: any[];
  warehouses: any[];
  officE_CODE: any;
  officE_NAME: any;
  warehouseID: any;
  warehouse: any;
  //End Member Variables
  ShowSendEmail: any = 'none';
  searchInput = "";
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  


  templatecode: any = 20;
  templatename: any = '';
  templateshow: any = '';
  companytemplate: any[] = [];
  packingType: any;
  allowTax: any = false;
  packingTypeID: any;
  measurement_Unit_ID: any;
  unit: any=0;

  constructor(private service: PurchaseOrderService,
    private SaleOrderService:SaleOrderService,
    private LoginService: LoginService,
    private SupplierService: SupplierService,
    private searchfilter: SearchFilterService,
    private DayEndService: DayEndService,
    private fileservice: FileAttachmentService,
    private emailService: EmailAlertService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {

    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.purchaseOrderDetails = new Array<purchaseOrderDetails>();

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
    this.getTaxRate();
    //////////////////////////Set Name From Session Storage///////////////////////////

    if (this.LoginService.getSession('AllowAttachmentPurchase') == '1')
      this.ShowAttachment = '';

    if (sessionStorage.getItem('AllowSend&EmailOnSCM') == "1")
      this.ShowSendEmail = '';
    if(sessionStorage.getItem('AllowTaxOnPurchase') == "1")
      this.allowTax = true;



    if (this.LoginService.getSession('PurchaseTaxCode') == '1')
      this.taxcode = 2;
    else
      this.taxcode = 1;
    this.getCurrentDay();
    this.searchOrderDetails('');
    this.permissomUtility.setPagePermissions(80006);

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
  //getCompanyTemplate
  getCompanyTemplate() {
    if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
      this.templateshow = 'none';
      this.isView = false;
    }
    else {
      this.isView = true;
      this.templateshow = '';
      this.isLoading = true;


      this.service.getCompanyTemplate(this.userCurrentOffice, 80006, this.IsPurchaseTaxInv)
        .subscribe(response => {
          this.companytemplate = (response.json());
          console.log(response.json());
          let filterarr = this.companytemplate.filter(
            t => t.isRPReport == 1);
          if (filterarr.length > 0)
            this.templatecode = filterarr[0].templatecode;
          else
            this.templatecode = this.companytemplate[0].templatecode;

          // console.log(response.json());
          this.isLoading = false;
        });
    }

  }
  //getCurrentDay
  getCurrentDay() {
    this.pO_Date.setDate(this.LoginService.getSession('currentOpenDay'));
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
  //changePODate
  changePODate(pO_Date) {
    if (this.pO_Date.getStandardDate() < this.dayEndDate.getStandardDate()) {
      this.pO_Date.setDate(this.dayEndDate.getDateFinal());
    }
  }
  //changeDeliveryDate
  changeDeliveryDate(delivery_Date) {
    if (this.delivery_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.delivery_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //searchOrderDetails
  searchOrderDetails(value: string) {
    this.service.searchOrderDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if (response.json() !== null) {
          this.order = (response.json());
        } else {
          this.order = [];
        }

      });
  }
  //IfExists
  IfExists(purchase_Order_ID) {
    this.isLoading = true;
    this.service.IfExists(purchase_Order_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
          $("#AddNewItemRow").hide();
          this.EditItemButton = 'disabled';
          this.RemoveItemButton = 'disabled';
          this.isLoading = false;
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
          $("#cancelBtn").prop("disabled", false);
          $("#AddNewItemRow").show();
          this.EditItemButton = '';
          this.RemoveItemButton = '';
          this.isLoading = false;
        }
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

              var timer = setTimeout(() => this.order_Envoy = this.users[i].order_Envoy, 500);
            }
            else { this.order_Envoy = this.users[0].order_Envoy; }
        }
        else { this.order_Envoy = this.users[0].order_Envoy; }
        console.log(this.users);
      },
        (error) => {
          // console.log(error)
          this.isLoading = false;
          this.commonUtility.handleError(error);
        });

  }
  //clearFields
  clearFields() {
    this.textboxSupplierID = 0;
    this.textboxSupplierName = '';
    this.order_Envoy = 1;
    this.supplier_ID = 0;
    this.SupplierID = 0;
    this.contact_ID = 0;
    this.purchase_Order_ID = 0;
    this.Office_Code = 0;
    this.PO_NO = 0;
    this.Supplier_ID = 1;
    this.contact_Person_ID = 0;
    this.payment_ID = 1;
    this.method_Id = 1;
    this.frieght_Id = 1;
    this.total_Cost = 0;
    this.total_Discount = 0;
    this.freight_Chrgs = 0;
    this.total_Amount = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.Discount_Rate = 0;
    this.Tax_Rate = 0;
    this.suppliers = [];
    this.contacts = [];
    this.purchaseOrderDetails = [];
    this.ID = "";
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    this.mode = false;
    this.btnmode = true;
    $("#submitAdd").prop("disabled", false);
    $("#submitAddMore").prop("disabled", false);
    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';
    this.textboxItemEditFlag = false;
    this.unit_Price = 0;
    this.stock_Qty = 0;
    this.upp = 0;
    this.taxable = 0;
    this.Tax_Rate = 0;
    this.taxFields();
    this.taxratecode = 0;
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });


  }
  //getSuppliers
  getSuppliers() { 
    // this.isLoading = true;
    this.service.getSuppliers()
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        this.supplier_ID = this.suppliers[0].id;
        this.supplier_Name = this.suppliers[0].text;
        //  this.isLoading = false;    
      },

        (error) => {
          // console.log(error)
          this.isLoading = false;
          this.commonUtility.handleError(error);
        });
  }
  //changeSupplier
  changeSupplier(e: any) { 
    //if (this.mode == false)
    if (this.sessionEnableTextboxSupplier != 1) {
      this.supplier_ID = e;
    }

    this.service.getContacts(this.supplier_ID)
      .subscribe(response => {
        if (response.json() != null) {
          this.contacts = response.json();
          this.contact_ID = this.contacts[0].contact_ID;
          if (this.btnmode)
            this.frieght_Id = this.contacts[0].frieght_Id;
          this.exc = this.contacts[0].exchange;
          if (this.exc == 1)
            this.allowExchange();
          else
            $("#allowExchange").hide();

          this.taxcode = this.contacts[0].taxcode;

          this.frieghtChange();

        }
      });
  }
  //getItems
  getItems() {
    this.isLoading = true;
    this.service.getItems()
      .subscribe(response => {
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        //getUnitPrice
        this.service.getUnitPrice(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
          .subscribe(response => {
            //console.clear();
            //console.log(response.json());
            this.unitPrices = (response.json());
            this.unit_Price = this.unitPrices[0].unit_Price;
            this.upp = this.unitPrices[0].upp;
            this.taxable = this.unitPrices[0].taxable;
            this.pack_Quantity = this.unitPrices[0].packing_Quantity;
            if (this.taxable == true) {
              this.Tax_Rate = this.unitPrices[0].taxRate;
            }
            else { this.Tax_Rate = 0; }
            this.isLoading = false;
          });
      });
  }
  //changeItem
  changeItem(e: any) {
    this.isLoading = true;
    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
    } 
    this.setItem(this.item_Code); 

  }

  setItem(item_Code: any) {
    this.allowOfficeWarehouse();
    this.service.getUnitPrice(item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        //console.clear();
        console.log(response.json());
        if (response.json() != null) {
          this.unitPrices = (response.json());
          this.item_Name = this.unitPrices[0].item_Name;
          this.unit_Price = this.unitPrices[0].unit_Price;
          this.upp = this.unitPrices[0].upp;
          this.stock_Qty = this.unitPrices[0].stock_Qty;
          this.stock_Qty = this.unitPrices[0].stock_Qty;
          this.pack_Quantity = this.unitPrices[0].packing_Quantity; 
          this.measurement_Unit_ID = this.unitPrices[0].measurement_Unit_ID;
          this.measurement_Unit = this.unitPrices[0].measurement_Unit;
          //alert(this.unitPrices[0].packing_Type_ID);
          this.packingTypeID = this.unitPrices[0].packing_Type_ID;
          this.packingType = this.unitPrices[0].packingType;
          if (this.IsPurchaseTaxInv == 1) {
            this.taxable = this.unitPrices[0].taxable as boolean;
          }
          else {
            this.taxable = false;
          }
          this.upp = this.upp * this.Quantity;
          //console.clear();

          if (this.taxable == true) {

            if (this.taxrateList != null) {
              console.log(this.taxable + '-----------' + this.IsPurchaseTaxInv + '-===--' + this.unitPrices[0].taxtypeid);
              this.taxratecode = this.unitPrices[0].taxtypeid;
              for (let i = 0; i < this.taxrateList.length; i++)
                if (this.taxrateList[i].taxrateid == this.taxratecode) {

                  this.Tax_Rate = this.taxrateList[i].taxrate;

                }
            }

          } else {
            this.Tax_Rate = 0;
            this.taxratecode = 1;
            // $("#TaxRateDropDown").prop("disabled", true);
          }

          $("#submitAdd").prop("disabled", false);
          $("#submitAddMore").prop("disabled", false);
        } else {
          if (this.sessionEnableTextboxItem != 1) {

          }
          else {
            this.unit_Price = 0;
            this.stock_Qty = 0;
            this.upp = 0;
            this.taxable = 0;
            this.Tax_Rate = 0;
          }
        }
        this.isLoading = false;
        this.DelayCheck = true;
      });
  }
  //getPayments
  getPayments() {
    this.service.getPayments()
      .subscribe(response => {
        this.payments = (response.json());
        // console.log(response.json());
      });
  }
  //Total Cost
  TotalCost() {
    var total_Cost = 0;
    if (this.purchaseOrderDetails.length > 0) {
      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        total_Cost += this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp;
      }
    }

    return total_Cost.toFixed(2);
  }
  //Total Discount
  TotalDiscount() {
    var total_Discount = 0;
    if (this.purchaseOrderDetails.length > 0) {
      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        total_Discount += ((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) * this.purchaseOrderDetails[count].discount_Rate / 100);
      }
    }
    return total_Discount.toFixed(2);;
  }
  //Total Tax
  TotalTax() {
    var total_Tax = 0;
    if (this.purchaseOrderDetails.length > 0) {
      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        total_Tax += ((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) - ((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) * this.purchaseOrderDetails[count].discount_Rate / 100)) / 100 * this.purchaseOrderDetails[count].tax_Rate;
      }
    }
    return total_Tax.toFixed(2);;
  }
  //Total Amount
  TotalAmount() {
    var total_Amount = 0;
    if (this.purchaseOrderDetails.length > 0) {
      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        total_Amount += (((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) - ((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) * this.purchaseOrderDetails[count].discount_Rate / 100)) + ((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) - ((this.purchaseOrderDetails[count].unit_Price * this.purchaseOrderDetails[count].upp) * this.purchaseOrderDetails[count].discount_Rate / 100)) / 100 * this.purchaseOrderDetails[count].tax_Rate);
      }
      if (this.freight_Chrgs != "")

        total_Amount += parseFloat(this.freight_Chrgs);

    }
    return total_Amount.toFixed(2);
  }
  //changeUnitPrice
  changeUnitPrice(unit_Price) {
    if (unit_Price <= 0) {
      this.unit_Price = 1;
    }
  }
  //changePackingQuantity
  changePackingQty(packingQty) {
    if (this.pack_Quantity <= 0) {
      this.pack_Quantity = 1;
    }
  }
  //changeUnitPriceEdit
  changeUnitPriceEdit(i: purchaseOrderDetails, unit_Price) {
    if (unit_Price <= 0) {
      i.unit_Price = 1;
    }
  }
  changePackingQtyEdit(i: purchaseOrderDetails, pack_Quantity) {
    if (pack_Quantity <= 0) {
      i.pack_Quantity = 1;
    }
  }
  //changeUPP
  changeUPP(Quantity) {

    var up = 0;
    if (Quantity <= 0) {
      this.Quantity = 1;
      Quantity = 1;
    }
    this.upp = Quantity * this.unitPrices[0].upp;

  }
  //changeUPPEdit
  changeUPPEdit(i: purchaseOrderDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }

    i.upp = quantity * this.unitPrices[0].upp;
  }
  //changeUPPEdit
  changeUPPFalseEdit(i: purchaseOrderDetails, upp) {

    if (upp <= 0) {
      i.upp = 1;
    }

  }
  //changeQuantity
  changeQuantity(upp) {
    if (upp <= 0) {
      this.upp = 1;
    }

  }
  //changeQuantityEdit
  changeQuantityEdit(i: purchaseOrderDetails, upp) {
    if (upp <= 0) {
      i.upp = 1;
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
  changeDiscountRateEdit(i: purchaseOrderDetails, discount_Rate) {
    if (discount_Rate > 100) {
      i.discount_Rate = 100;
    }
    else if (discount_Rate <= 0) {
      i.discount_Rate = 0;
    }
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
    var PaymentTerm = this.payment_ID
    var today = new Date();
    var millies = Date.parse(this.today);
    var newDate = new Date();
    var dd = 0;
    var mm = 0;
    var yyyy = 0;

    if (PaymentTerm == 1) {

      dd = today.getDate();
      mm = today.getMonth() + 1;//January is 0!
      yyyy = today.getFullYear();
      if (dd < 10) { this.dd = '00' + dd }
      if (mm < 10) { this.mm = '00' + mm }
      this.paymentDate = mm + '/' + dd + '/' + yyyy;
      // alert(this.paymentDate);
      document.getElementById("paymentDateLbl").style.display = "none";
      document.getElementById("paymentDateTxt").style.display = "none";

    } else if (PaymentTerm == 2) {

      newDate.setDate(newDate.getDate() + 10);
      dd = newDate.getDate();
      mm = newDate.getMonth() + 1;//January is 0!
      yyyy = newDate.getFullYear();
      if (dd < 10) { this.dd = '00' + dd }
      if (mm < 10) { this.mm = '00' + mm }
      this.paymentDate = mm + '/' + dd + '/' + yyyy;
      // alert(this.paymentDate);
      document.getElementById("paymentDateLbl").style.display = "block";
      document.getElementById("paymentDateTxt").style.display = "block";
    }
    else if (PaymentTerm == 3) {

      newDate.setDate(newDate.getDate() + 15);
      this.dd = newDate.getDate();
      this.mm = newDate.getMonth() + 1;//January is 0!
      this.yyyy = newDate.getFullYear();
      if (dd < 10) { this.dd = '00' + dd }
      if (mm < 10) { this.mm = '00' + mm }
      this.paymentDate = mm + '/' + dd + '/' + yyyy;
      //alert(this.paymentDate);
      document.getElementById("paymentDateLbl").style.display = "block";
      document.getElementById("paymentDateTxt").style.display = "block";
    }
    else if (PaymentTerm == 4) {

      newDate.setDate(newDate.getDate() + 20);
      this.dd = newDate.getDate();
      this.mm = newDate.getMonth() + 1;//January is 0!
      this.yyyy = newDate.getFullYear();
      if (dd < 10) { this.dd = '00' + dd }
      if (mm < 10) { this.mm = '00' + mm }
      this.paymentDate = mm + '/' + dd + '/' + yyyy;
      //alert(this.paymentDate);
      document.getElementById("paymentDateLbl").style.display = "block";
      document.getElementById("paymentDateTxt").style.display = "block";
    } else {
      document.getElementById("paymentDateLbl").style.display = "none";
      document.getElementById("paymentDateTxt").style.display = "none";
      this.paymentDate = "";
    }
  }
  //changeFreight
  changeFreight(freight_Chrgs) {
    if (freight_Chrgs <= 0)
      this.freight_Chrgs = 0;
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
  //IfExists
  guidExist(guid: any) {
    this.service.guidExist(guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
      });
  }
  //addGrid
  addGrid(item_Code: any, item_Name: any, pack_Quantity: any, Unit_Price: any, upp: any, Quantity: any, Discount_Rate: any, Tax_Rate: any) {
    $("#userCurrentOffice").prop("disabled", true);
    $("#userCurrentWarehouse").prop("disabled", true);

    if (this.DelayCheck) {
      this.DelayCheck = false;

      // 

      if (Unit_Price != 0) {
        if (item_Name != null) {
          if (this.Quantity > 0) {
            var flag = false;
            if (this.purchaseOrderDetails.length > 0) {
              for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
                if (this.purchaseOrderDetails[count].item_Code == item_Code) {
                  flag = true;
                  break;
                }
              }
            }
            if (this.hideUPP == true) {
              if (flag == false) {
                if (this.IsPurchaseTaxInv == 0) { 
                  this.purchaseOrderDetails.push(new purchaseOrderDetails(0, 0, item_Code, item_Name, pack_Quantity, Unit_Price, upp, Quantity, (Unit_Price * upp).toFixed(2), Discount_Rate, ((upp) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), this.taxratecode, 0, 0, ((upp) * (Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)).toFixed(2), 0, this.stock_Qty, this.measurement_Unit, this.packingTypeID));
                  this.item_Code = 1;
                  this.unit_Price = 0;
                  this.upp = 1;
                  //this.taxratecode=0;
                  this.Discount_Rate = 0;
                }
                else { 
                  this.purchaseOrderDetails.push(new purchaseOrderDetails(0, 0, item_Code, item_Name, pack_Quantity, Unit_Price, upp, Quantity, (Unit_Price * upp).toFixed(2), Discount_Rate, ((upp) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), this.taxratecode, Tax_Rate, ((((upp * Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate).toFixed(2), (((upp) * (Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)) + ((((upp * Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate)).toFixed(2), 0, this.stock_Qty, this.measurement_Unit, this.packingTypeID));
                  this.item_Code = 1;
                  this.unit_Price = 0;
                  this.upp = 1;
                  //this.taxratecode=0;
                  this.Discount_Rate = 0;
                }

                if (this.sessionEnableTextboxItem != 1) {
                } else {
                  // alert('Added')
                  this.textboxItemID = 0;
                  this.item_Code = 0;
                  this.textboxItemName = '';
                  //this.changeItems(this.item_Code);
                }

                this.editMode = false;
              } else {
                swal("Already Exists");
                return;
              }
            }
            else {

              if (flag == false) {
                if (this.hide == false) {
                  this.purchaseOrderDetails.push(new purchaseOrderDetails(0, 0, item_Code, item_Name, pack_Quantity, Unit_Price, upp, (Quantity * upp), (Unit_Price * (Quantity * upp)).toFixed(2), Discount_Rate, (((Quantity * upp)) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), this.taxratecode, 0, 0, (((Quantity * upp)) * (Unit_Price) - (((Quantity * upp)) * (Unit_Price) * (Discount_Rate) / 100)).toFixed(2), 0, this.stock_Qty, this.measurement_Unit, this.packingTypeID));
                  this.item_Code = 1;
                  this.unit_Price = 0;
                  this.upp = 1;
                  //this.taxratecode=1;
                  this.Discount_Rate = 0;
                }
                else {
                  this.purchaseOrderDetails.push(new purchaseOrderDetails(0, 0, item_Code, item_Name, pack_Quantity, Unit_Price, upp, (Quantity * upp), (Unit_Price * (Quantity * upp)).toFixed(2), Discount_Rate, (((Quantity * upp)) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), this.taxratecode, Tax_Rate, (((((Quantity * upp) * Unit_Price) - (((Quantity * upp)) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate).toFixed(2), ((((Quantity * upp)) * (Unit_Price) - (((Quantity * upp)) * (Unit_Price) * (Discount_Rate) / 100)) + (((((Quantity * upp) * Unit_Price) - (((Quantity * upp)) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate)).toFixed(2), 0, this.stock_Qty, this.measurement_Unit, this.packingTypeID));
                  this.item_Code = 1;
                  this.unit_Price = 0;
                  this.upp = 1;
                  //this.taxratecode=1;
                  this.Discount_Rate = 0;
                }

                if (this.sessionEnableTextboxItem != 1) {
                } else {
                  // alert('Added')
                  this.textboxItemID = 0;
                  this.item_Code = 0;
                  this.textboxItemName = '';
                  //this.changeItems(this.item_Code);
                }

                this.editMode = false;
              } else {
                swal("Already Exists");
                return;
              }
            }
          }
          else {
            swal("Qty is required.Qty not be zero and must be numeric.");
            return;
          }
        } else {
          swal("Item is Required");
          return;
        }
        $("#submitAdd").prop("disabled", false);
        $("#submitAddMore").prop("disabled", false);
      } else {
        swal("Unit price must be greater then 0");
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }
  }
  //changeMode
  changeMode(idx: any, i: purchaseOrderDetails, Mode: any) {
    this.DelayCheck = true;
    var flag = false;
    if (this.purchaseOrderDetails.length > 0) {


      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        if (this.purchaseOrderDetails[count].item_Code == i.item_Code && idx != count) {
          if (this.multiItems == 1)
            flag = false;
          else
            flag = true;
          break;
        }
      }
    }
    if (this.sessionEnableTextboxItem != 1) {
      if (Mode == 0) {
        if (i.unit_Price != 0) {
          if (flag == false) {
            if (i.quantity > 0) {
              i.edit_Mode = false;
              if (this.hideUPP == false) {
                i.quantity = i.upp;
                i.purchase_Cost = (i.unit_Price * i.quantity).toFixed(2);

              }
              else
                i.purchase_Cost = (i.unit_Price * i.upp).toFixed(2);
              i.discount_Amount = (i.purchase_Cost * (i.discount_Rate) / 100).toFixed(2);
              if (this.IsPurchaseTaxInv == 1) {
                i.tax_Amount = ((i.purchase_Cost - i.discount_Amount) / 100 * i.tax_Rate).toFixed(2);

              } else {
                i.tax_Rate = 0;
                i.tax_Amount = 0;
              }
              i.net_Amount = ((parseFloat(i.purchase_Cost) - parseFloat(i.discount_Amount)) + parseFloat(i.tax_Amount)).toFixed(2);


            } else {
              swal("Quantity must be greater then 0");
              return;
            }
          } else {
            swal("Already Exists");
            return;
          }
        } else {
          swal("Unit price must be greater then 0");
          return;
        }
      }
      else if (Mode == 2) {
        this.purchaseOrderDetails.splice(idx, 1);
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
    else {
      this.textboxItemEditFlag = true;
      if (Mode == 0) {
        if (i.unit_Price != 0) {
          if (flag == false) {
            if (i.quantity > 0) {
              i.edit_Mode = false;
              if (this.hideUPP == false) {
                i.quantity = i.upp;
                i.purchase_Cost = (i.unit_Price * i.quantity).toFixed(2);

              }
              else
                i.purchase_Cost = (i.unit_Price * i.upp).toFixed(2);
              i.discount_Amount = (i.purchase_Cost * (i.discount_Rate) / 100).toFixed(2);

              if (this.IsPurchaseTaxInv == 1) {
                i.tax_Amount = ((i.purchase_Cost - i.discount_Amount) / 100 * i.tax_Rate).toFixed(2);

              } else {
                i.tax_Rate = 0;
                i.tax_Amount = 0;
              }
              i.net_Amount = ((parseFloat(i.purchase_Cost) - parseFloat(i.discount_Amount)) + parseFloat(i.tax_Amount)).toFixed(2);

              //i.tax_Amount = ((i.purchase_Cost - i.discount_Amount) / 100 * i.tax_Rate).toFixed(2);
              // i.net_Amount = ((parseFloat(i.purchase_Cost) - parseFloat(i.discount_Amount)) + parseFloat(i.tax_Amount)).toFixed(2);
            } else {
              swal("Quantity must be greater then 0");
              return;
            }
          } else {
            swal("Already Exists");
            return;
          }
        } else {
          swal("Unit price must be greater then 0");
          return;
        }
      }
      else if (Mode == 2) {
        this.purchaseOrderDetails.splice(idx, 1);
      }
      else {
        this.textboxItemIDEdit = i.item_Code;
        this.textboxItemNameEdit = i.item_Name;

        console.log(i);
        i.edit_Mode = true;
      }



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
      this.stock_Qty = 0;
      this.unit_Price = 0;
      this.upp = 0;
    }
  }
  //updateItem  
  updateItem(i: purchaseOrderDetails, e: any) {
    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
    } else {
      this.item_Code = this.textboxItemIDEdit;
    }
    this.service.getUnitPrice(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.upp = this.unitPrices[0].upp;
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.stock_Qty = this.unitPrices[0].stock_Qty;
        this.taxable = this.unitPrices[0].taxable;
        this.pack_Quantity = this.unitPrices[0].packing_Quantity;

        if (this.taxable != null) {
          this.Tax_Rate = this.taxRate;
          i.tax_Rate = this.Tax_Rate;
        }
        else {
          i.tax_Rate = 0;
          i.tax_Amount = 0;
          this.Tax_Rate = 0;
        }

        i.purchase_Cost = ((i.upp * i.quantity) * i.unit_Price).toFixed(2);
        i.tax_Amount = Math.round(((i.purchase_Cost) - ((i.purchase_Cost) * i.discount_Rate / 100)) / 100 * i.tax_Rate);

        i.item_Code = this.item_Code;
        i.item_Name = this.item_Name;
        i.unit_Price = this.unit_Price;
        i.stock_Qty = this.stock_Qty;
      });
  }
  //onNavifate  
  onNavigate(pth) {
    sessionStorage.setItem('IsOrder', '1');
    sessionStorage.setItem('reportName', this.reportName);
    sessionStorage.setItem('templatecode', '0');
    sessionStorage.setItem('ReportSave', "0");
    sessionStorage.setItem('SendingMedium', "0");
    sessionStorage.setItem('ReportView', "1");
    sessionStorage.setItem('ReportParentType', "3");//PurchaseOrderEmail
    sessionStorage.setItem('ID', this.ID);
    sessionStorage.setItem('exchange', "-1");
    sessionStorage.setItem('reportID', "1");

    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }

    if (pth == "/po-rpt-excel") {
      sessionStorage.setItem('ReportView', "2");
      window.open(pth, "_blank");
    }
    else if (pth == "/po-rpt-mail") {
      sessionStorage.setItem('ReportSave', "1");
      sessionStorage.setItem('ReportID', this.ID);
      sessionStorage.setItem('SendingMedium', "1");
    }
    else {
      sessionStorage.setItem('ReportView', "1");
      window.open(pth, "_blank");
    }

  }
  //getDetailsByID
  getDetailsByID(purchase_Order_ID, content) {
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });

    if (this.LoginService.getSession('EnableSupplierSearchDropDown') != '1') {
      $("#DropDownSupplierSearch").hide();
      this.sessionEnableTextboxSupplier = 0;

    }
    else {

      $("#DropDownSupplierSelect2").hide();
      this.sessionEnableTextboxSupplier = 1;
      this.textboxSupplierID = 0;
      this.supplier_ID = 0;
      this.textboxSupplierName = '';
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
      this.upp = 0;
      this.taxable = 0;
      this.Tax_Rate = 0;
    }

    sessionStorage.setItem('reportID', "1");
    sessionStorage.setItem('ID', purchase_Order_ID);
    this.detailOpen(content);

    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.mode = true;
    this.btnmode = false;
    this.isLoading = true;
    this.IfExists(purchase_Order_ID);

    this.service.getDetailsByID(purchase_Order_ID, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe((o: purchaseOrder) => {
        console.log(o);
        this.purchase_Order_ID = o.purchase_Order_ID;
        this.ID = o.purchase_Order_ID;
        this.pO_Date.setDate(o.pO_Date);
        this.delivery_Date.setDate(o.delivery_Date);
        this.paymentDate.setDate(o.paymentDate);
        this.contact_Person_ID = o.contact_Person_ID;
        this.contact_ID = o.contact_Person_ID;
        this.payment_ID = o.payment_ID;
        this.shipping_Method = o.shipping_Method;
        this.frieght_Id = o.freight_Term;
        this.freight_Chrgs = o.freight_Chrgs;
        this.total_Amount = o.total_Amount;
        this.total_Discount = o.total_Discount;
        this.purchaseOrderDetails = o.purchaseOrderDetails;
        this.isLoading = false;
        this.exchange = o.exchange;
        $("#exchange").prop("disabled", false);
        this.remarks = o.remarks;



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

        //getPriviledgedOffices
        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.users = (response.json());
            this.order_Envoy = o.order_Envoy;
          });

        if (o.cancel == 1) {
          if (this.status != true) {
            $("#alertWarning").show();
            $("#cancelBtn").prop("disabled", true);
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

        //getSuppliers
        this.service.getSuppliers()
          .subscribe(response => {
            this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");

            if (this.sessionEnableTextboxSupplier != 1) {
              this.supplier_ID = o.supplier_ID;
            }
            else {
              for (let i = 0; i < this.suppliers.length; i++) {
                if (this.suppliers[i].id == o.supplier_ID) {
                  this.textboxSupplierID = this.suppliers[i].id;
                  this.supplier_ID = this.suppliers[i].id;
                  this.textboxSupplierName = this.suppliers[i].text;

                }
              }
            }

          });

        this.attachments = [];
        this.guid = o.pOGUID;
        this.getFiles(this.guid);

        this.taxFields();
      });

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
          this.service.cancelOrder(this.purchase_Order_ID, this.actionID)
            .subscribe(response => {
              swal("Poof! Your order has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              this.searchOrderDetails('');
              this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  //saveMoreOrder
  saveMoreOrder(purchase_Order_ID: any, PO_Date: any, Office_Code: any, PO_NO: any,
    order_Envoy: any, Approved_By_ID: any, isApproved: any, supplier_ID: any,
    contact_Person_ID: any, delivery_Date: any, Shipping_Date: any,
    method_Id: any, payment_ID: any, frieght_Id: any, Total_Cost: any,
    Total_Discount: any, Pre_Tax_Amount: any, Total_Tax: any, freight_Chrgs: any,
    Total_Amount: any, remarks: any, Reorder_ID: any, Order_Type: any, paymentDate: any,
    Voucher_ID: any, Pay_Voucher_ID: any, Cancel: any, mode: any, POGUID: any, Customer_ID: any,
    C_Contact_Person_ID: any, Requisition_ID: any, Day_Id: any, IsServiceInvoice: any) {
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    this.isLoading = true;
    this.allowOfficeWarehouse();
    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        var order = new purchaseOrder(purchase_Order_ID,
          this.pO_Date.getDateFinal(), this.userCurrentOffice, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.purchaseOrderDetails, null);
        console.log(order);
        if (this.mode != 0) {
          this.purchaseOrderDetails[0].edit_Mode = true;
        }
        this.service.saveOrder(order).then(
          (response) => {
            this.isLoading = false;
            this.ID = response;
            console.log(this.ID);
            sessionStorage.setItem('ID', this.ID);
            if (this.isView == true) {
              this.onNavigate('/po-rpt-rdlc');
            }
            this.searchOrderDetails('');
            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);
            this.clearFields();
            //this.getItems();
            //this.getSuppliers();
            this.getPayments();
            this.frieghtChange();
            this.scrollToBottom();
            this.getPriviledgedOffices();
            $("#cancelBtn").hide();
            this.taxFields();
            this.stockField();
            this.uppField();
            this.rdlcStatus();
            this.allowMultiItems();
            console.log(response);
          },
          (error) => {
            // console.log(error)
            this.isLoading = false;
            this.commonUtility.handleError(error);
          })

      }
      else {
        swal("Order must be greater then 0.");
      }
    } else {
      swal('Please Select Supplier!')
    }
  }
  //saveOrder
  saveOrder(purchase_Order_ID: any, PO_Date: any, Office_Code: any, PO_NO: any,
    order_Envoy: any, Approved_By_ID: any, isApproved: any, supplier_ID: any,
    contact_Person_ID: any, delivery_Date: any, Shipping_Date: any,
    method_Id: any, payment_ID: any, frieght_Id: any, Total_Cost: any,
    Total_Discount: any, Pre_Tax_Amount: any, Total_Tax: any, freight_Chrgs: any,
    Total_Amount: any, remarks: any, Reorder_ID: any, Order_Type: any, paymentDate: any,
    Voucher_ID: any, Pay_Voucher_ID: any, Cancel: any, mode: any, POGUID: any, Customer_ID: any,
    C_Contact_Person_ID: any, Requisition_ID: any, Day_Id: any, IsServiceInvoice: any) {

    this.allowOfficeWarehouse();
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        var order = new purchaseOrder(purchase_Order_ID,
          this.pO_Date.getDateFinal(), this.userCurrentOffice, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.purchaseOrderDetails, null);
        console.log(order);
         
        if (this.mode != 0) {
          this.purchaseOrderDetails[0].edit_Mode = true;
        }

        this.service.saveOrder(order).then(
          (response) => {
            this.ID = response;
            console.log(this.ID);
            sessionStorage.setItem('ID', this.ID);

            this.searchOrderDetails('');
            this.modalReference.close();
            if (this.isView == true) {
              this.onNavigate('/po-rpt-rdlc');
            }
            console.log(response);
          },
          (error) => {
            // console.log(error)
            this.isLoading = false;
            this.commonUtility.handleError(error);
          })
      }
      else {
        swal("Order must be greater then 0.");
      }
    }
    else {
      swal('Please Select Supplier!')

    }
  }
  //saveOrderAndMail
  saveOrderAndMail(content, purchase_Order_ID: any, PO_Date: any, Office_Code: any, PO_NO: any,
    order_Envoy: any, Approved_By_ID: any, isApproved: any, supplier_ID: any,
    contact_Person_ID: any, delivery_Date: any, Shipping_Date: any,
    method_Id: any, payment_ID: any, frieght_Id: any, Total_Cost: any,
    Total_Discount: any, Pre_Tax_Amount: any, Total_Tax: any, freight_Chrgs: any,
    Total_Amount: any, remarks: any, Reorder_ID: any, Order_Type: any, paymentDate: any,
    Voucher_ID: any, Pay_Voucher_ID: any, Cancel: any, mode: any, POGUID: any, Customer_ID: any,
    C_Contact_Person_ID: any, Requisition_ID: any, Day_Id: any, IsServiceInvoice: any) {

    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    $("#submitAddMail").prop("disabled", true);
    this.allowOfficeWarehouse();
    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        $("#submitAddMore").hide();
        $("#submitAdd").hide();
        $("#submitAddMail").hide();
        this.isLoading = true;
        var order = new purchaseOrder(purchase_Order_ID,
          this.pO_Date.getDateFinal(), this.userCurrentOffice, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.purchaseOrderDetails, null);

        this.service.saveOrder(order).then(
          (response) => {
            this.ID = response;
            sessionStorage.setItem('ID', this.ID);
            //if (this.isView == true) {
            this.onNavigate('/po-rpt-mail');
            this.isLoading = true;
            this.service.getSupplierEmail(supplier_ID)
              .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                  var list = response.json();
                  this.sendParentID = this.ID;
                  this.sendSupplierName = list[0].name;
                  this.sendSupplierEmail = list[0].email;
                  this.sendSupplierBody = 'Please Type Some Text!';
                  this.isLoading = true;
                  this.openSendMail(content);
                  this.searchOrderDetails('');
                  $("#submitAddMore").prop("disabled", false);
                  this.getCurrentDay();
                  this.clearFields();
                  //this.enableItemDropDown();
                  //this.enableSupplierDropDown();
                  this.getPayments();
                  this.frieghtChange();
                  //this.scrollToBottom();
                  this.getPriviledgedOffices();
                  $("#cancelBtn").hide();
                  this.taxFields();
                  this.stockField();
                  this.uppField();
                  this.rdlcStatus();
                  this.allowMultiItems();
                  this.mode = true;
                }
              });
            console.log(response);
          },
          (error) => {
            // console.log(error)
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
  //updateOrder
  updateOrder(purchase_Order_ID: any, PO_Date: any, Office_Code: any, PO_NO: any,
    order_Envoy: any, Approved_By_ID: any, isApproved: any, supplier_ID: any,
    contact_Person_ID: any, delivery_Date: any, Shipping_Date: any,
    method_Id: any, payment_ID: any, frieght_Id: any, Total_Cost: any,
    Total_Discount: any, Pre_Tax_Amount: any, Total_Tax: any, freight_Chrgs: any,
    Total_Amount: any, remarks: any, Reorder_ID: any, Order_Type: any, paymentDate: any,
    Voucher_ID: any, Pay_Voucher_ID: any, Cancel: any, mode: any, POGUID: any, Customer_ID: any,
    C_Contact_Person_ID: any, Requisition_ID: any, Day_Id: any, IsServiceInvoice: any) {
    this.allowOfficeWarehouse();
    this.isLoading = true;
    //if (!this.guidExist(this.guid)) {
    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        var order = new purchaseOrder(purchase_Order_ID,
          this.pO_Date.getDateFinal(), this.userCurrentOffice, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.purchaseOrderDetails, null);

        //if (this.mode != 0) {
        //  this.purchaseOrderDetails[0].edit_Mode = true;
        //}
        this.service.updateOrder(order).then(
          (response) => {
            this.isLoading = false;
            this.searchOrderDetails('');
            this.modalReference.close();
            if (this.isView == true) {
              this.onNavigate('/po-rpt-rdlc');
            }
            console.log(response);
          },
          (error) => {
            // console.log(error)
            this.isLoading = false;
            this.commonUtility.handleError(error);
          })
      }
      else {
        swal("Order must be greater then 0.");
      }
    }
    else {
      swal('Please Select Supplier!')
    }
    //}
    //else { swal("Error: Already exists."); }
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
      // alert(e.keyCode);
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
    if (this.LoginService.getSession('AllowTaxOnPurchase') != '1') {
      this.hide = false;
      this.IsPurchaseTaxInv = 0;
      this.isTaxable = false;
      this.taxRate = 0;
      this.AllowTaxOnPurchase = false;
      $("#lblTotalTax").hide();
    }
    else {
      this.IsPurchaseTaxInv = 1;
      this.hide = true;
      this.AllowTaxOnPurchase = true;

      if (this.LoginService.getSession('isTaxable').toString() == "1")
        this.isTaxable = true;
      else
        this.isTaxable = false;

      this.taxRate = this.LoginService.getSession('taxRate');
      $("#lblTotalTax").show();
    }
    this.getCompanyTemplate();
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
  //uppField
  uppField() {

    if (sessionStorage.getItem('AllowPallletQty') != "1") {
      this.hideUPP = false;
    }
    else {
      this.hideUPP = true;
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
  //allowExchange
  allowMultiItems() {
    if (sessionStorage.getItem('AllowMultiItems') != "1")
      this.multiItems = false;
    else
      this.multiItems = true;
  }
  //open Model
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
    $("#viewRDLC").prop("disabled", true);
    $("#viewExcel").prop("disabled", true);
    $("#allowExchange").hide();
    this.allowOfficeWarehouse();
    this.getCurrentDay();
    this.clearFields();
    this.enableItemDropDown();
    this.enableSupplierDropDown();
    this.getPayments();
    this.frieghtChange();
    this.scrollToBottom();
    this.getPriviledgedOffices();
    $("#cancelBtn").hide();
    this.taxFields();
    this.stockField();
    this.uppField();
    this.rdlcStatus();
    this.allowMultiItems();
    this.getItems();
    this.getUnit()
    if (this.LoginService.getSession('AllowPackingQuantityOnPO') == '1') {
      this.packQuantity = true;
    }
    else {
      this.packQuantity = false;
    }

    var timer = setTimeout(() => { $("#textboxSupplier").focus(); }, 500);
  }
  // detailOpen modal
  detailOpen(content) {
    this.isLoading = true;
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
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    $("#allowExchange").hide();
    // this.allowOfficeWarehouse();
    this.clearFields();
    this.enableSupplierDropDown();
    this.enableItemDropDown();
    $("#cancelBtn").show();
    //$("#viewBtn").hide();
    this.taxFields();
    this.stockField();
    this.uppField();
    this.allowMultiItems();
    this.getUnit();
    this.isLoading = false;
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
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  //showDueDate
  showDueDate() {
    if (sessionStorage.getItem('ShowDueDateOnSO') != "1") {
      this.isDueDate = false;
    }
    else {
      this.isDueDate = true;
    }
  }

  sessionEnableTextboxSupplier = 0;
  textboxSupplierID: any = 0;
  textboxSupplierName: any = '';
  textboxSupplierSearch: any = '';
  searchGridSupplier: any[] = [];
  searchGridSupplierTemp: any[] = [];

  enableSupplierDropDown() {
    //alert(1);
    //alert(this.LoginService.getSession('EnableSupplierSearchDropDown'));
    if (this.LoginService.getSession('EnableSupplierSearchDropDown') != '1') {
      $("#DropDownSupplierSearch").hide();
      this.sessionEnableTextboxSupplier = 0;
      this.getSuppliers()
    }
    else {
      $("#DropDownSupplierSelect2").hide();
      this.sessionEnableTextboxSupplier = 1;
      this.SearchSupplierDropDown('');
    }
  }
  SearchSupplierByID(Query) {
    // alert(2);
    this.textboxSupplierSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchSupplierByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedSupplier(List[0].id, List[0].name)
        }
        else {
          //alert('Here');
          this.supplier_ID = 0;
          this.textboxSupplierID = 0;
          this.textboxSupplierName = '';
          this.contacts = [];
          this.contact_ID = 0;

        }
        this.isLoading = false;
      });

  }
  SearchSupplierDropDown(Query) {
    //alert(3);
    this.searchGridSupplier = [];
    console.log('Query', Query);
    this.isLoading = true;
    this.searchfilter.SearchSupplierDropDown(Query)
      .subscribe(response => {
        if (this.searchGridSupplier != null) {
          this.searchGridSupplier = (response.json());

          $('td.active').removeClass('active');
          var TRowID = "#SROW-1";
          var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);

          if (this.searchGridSupplierTemp.length <= 0) {
            this.searchGridSupplierTemp = this.searchGridSupplier;
          }
        }
        //this.isLoading = false;
      });
    this.isLoading = false;
  }
  setSupplierSearchFocus() {
    //alert(4);
    var timer = setTimeout(() => $("#textboxSupplierSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#SROW-1").eq(0).find('td').addClass('active');

  }
  setSelectedSupplier(ID, Name) {
    //alert(5);
    console.log(ID, Name);
    this.textboxSupplierID = ID;
    this.supplier_ID = ID;
    this.textboxSupplierName = Name;

    this.textboxSupplierSearch = '';
    this.searchGridSupplier = this.searchGridSupplierTemp;

    $("#submitAdd").prop("disabled", false);
    $("#submitAddMore").prop("disabled", false);



  }

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
    //alert(6);
    //alert(this.LoginService.getSession('EnableItemSearchDropDown'));
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
    //alert(7);
    this.textboxItemSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchItemByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedItem(List[0].id, List[0].name)
        }
        else {

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
    //console.log('userCurrentOffice-------------:' + this.userCurrentOffice + 'userCurrentWarehouse-------------:'+ this.userCurrentWarehouse);
    this.searchfilter.SearchItemDropDown(Query, 1, 0, this.userCurrentOffice, this.userCurrentWarehouse)
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
    this.DelayCheck = true;
    $('td.active').removeClass('active');
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
  TRowLength: any = 0;
  addSupplierName: any = '';
  addSupplierCell: any = '';
  addSupplierEmail: any = '';
  addSupplierPhone: any = '';
  addSupplierAddress: any = '';
  addSupplierStatus: any = 1;

  city: any[] = [];
  citycode: any = 0;
  cityname: any = '';

  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = '';


  //getCity
  getCity() {
    this.isLoading = true;
    this.SupplierService.getCity()
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
  //SupplierAddNew
  SupplierAddNew(content) {
    this.addSupplierName = '';
    this.addSupplierCell = '';
    this.addSupplierPhone = '';
    this.addSupplierAddress = '';
    this.addSupplierEmail = '';
    this.addSupplierStatus = 1;

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
    //this.getCategory();
    this.openSupplierAddNew(content);

  }
  //openSupplierAddNew
  openSupplierAddNew(content) {
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

    $("#SaveNewSupplier").prop("disabled", true);
    var timer = setTimeout(() => $("#addSupplierName").focus(), 500);

  }
  //saveSupplier
  saveSupplier() {
    var addSupplierName = this.addSupplierName.trim();
    if (addSupplierName != "") {

      if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.addSupplierCell == '') {
        swal("Cell number must be defined.")
      }
      else {

        var supplier = new Suppliers(0, this.addSupplierName, null, 0, this.addSupplierName, this.addSupplierPhone, this.addSupplierCell, this.addSupplierCell, this.addSupplierPhone, '', '', this.addSupplierEmail, '', 0, 1, 1, 1, 1, 1, 0, 1, '', 0, 0, this.guid, 0, this.addSupplierAddress, '', '', this.citycode, 1, 1, this.addSupplierStatus, this.logedInUserID, this.UserSessionID);
        console.log(supplier);
        this.isLoading = true
        this.SupplierService.saveSupplier(supplier).then(
          (response) => {
            var list = response;
            this.service.getSuppliers()
              .subscribe(response => {
                this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");

                this.setSelectedSupplier(list[0].supplier_ID, list[0].supplier_ID + ' : ' + list[0].supplier_Name);

                this.service.getContacts(list[0].supplier_ID)
                  .subscribe(response => {
                    if (response.json() != null) {
                      this.contacts = response.json();
                      this.contact_ID = this.contacts[0].contact_ID;
                      this.frieght_Id = this.contacts[0].frieght_Id;
                      this.exc = this.contacts[0].exchange;
                      if (this.exc == 1)
                        this.allowExchange();
                      else
                        $("#allowExchange").hide();
                      this.frieghtChange();
                      // console.log(response.json());
                      this.isLoading = false;
                    }
                  });
              });

            //this.getSuppliers();
            //this.setSelectedSupplier(list[0].supplier_ID, list[0].supplier_ID + ' : ' + list[0].supplier_Name);

            this.modalReference.close();
            console.log(response);
          },
          (error) => console.log(error))

      }

    }
    else {
      swal("Supplier name must be define.");
    }

  }
  checkEmail: any = true;
  checkPhone: any = true;
  checkContactCell: any = true;
  checkContactPhone: any = true;
  checkDisableStatus() {

    if (this.addSupplierName != ''
      && this.checkEmail != false
      && this.checkContactCell != false
      && this.checkContactPhone != false) {
      $("#SaveNewSupplier").prop("disabled", false);
    }
    else {
      $("#SaveNewSupplier").prop("disabled", true);
    }

  }
  checkSupplierCell(cell) {
    if (cell != '') {
      this.isLoading = true;
      this.SupplierService.contactCellExists(cell)
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
  checkSupplierPhone(phone) {
    if (phone != '') {
      this.isLoading = true;
      this.SupplierService.contactCellExists(phone)
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
  checkSupplierEmail(email) {
    if (email != '') {
      this.isLoading = true;
      this.SupplierService.emailExists(email)
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
      this.fileservice.postFile(this.guid, 4, this.filename, this.fileToUpload)
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

  reportName: any = '';
  modalReferenceMail: NgbModalRef;
  sendParentID: any = '';
  sendSupplierName: any = '';
  sendSupplierEmail: any = '';
  sendSupplierBody: any = '';
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


  }
  SendMail(ParentID) {
    if (this.CheckMailMandatoryFields() == true) {
      this.isLoading = true;
      this.emailService.sendReportMail(this.sendParentID, 3, this.sendSupplierEmail, this.sendSupplierBody)
        .subscribe(response => {
          this.isLoading = false;
          console.log(response);
          this.modalReferenceMail.close();

        });
    }
  }
  CheckMailMandatoryFields() {
    if (this.sendParentID != '') {
      if (this.sendSupplierName != '') {
        if (this.sendSupplierEmail != '') {
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

  taxcode: any = 1;
  TaxRateDropDown: any = 'disabled';
  taxrateList: any[] = [];
  taxratecode: any = 1;
  taxratename: any = '';
  taxrate: any = 0;

  //getTaxRate 
  getTaxRate() {
    this.isLoading = true;
    this.service.getTaxRates()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.taxrateList = (response.json());
          if (this.IsPurchaseTaxInv == 0)
            this.taxratecode = this.taxrateList[0].taxratecode;

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
  changeTaxRateGrid(objIndex: number) {
    if (this.taxrateList != null && this.IsPurchaseTaxInv == 1) {
      //  let objIndex = this.purchaseOrderDetails.findIndex((obj => obj.item_Code == j.item_Code));
      let tax = this.taxrateList.filter(t => t.taxrateid == this.purchaseOrderDetails[objIndex].taxrateid);
      let trate: any = 0;
      let tamount: any = 0;
      let namount: any = 0;
      let pcost = this.purchaseOrderDetails[objIndex].purchase_Cost;
      let damount = this.purchaseOrderDetails[objIndex].discount_Amount;
      if (tax.length > 0) {
        trate = tax[0].taxrate;
        tamount = ((pcost - damount) / 100 * trate).toFixed(2);
        namount = ((parseFloat(pcost) - parseFloat(damount)) + parseFloat(tamount)).toFixed(2);
      }
      this.purchaseOrderDetails[objIndex].tax_Rate = trate;
      this.purchaseOrderDetails[objIndex].tax_Amount = tamount;
      this.purchaseOrderDetails[objIndex].net_Amount = namount;

    }
  }
  is_edit: boolean = false;
  SetTax(isPurchaseTaxInv: number) {
    this.IsPurchaseTaxInv = isPurchaseTaxInv;
    if (isPurchaseTaxInv == 1) {
      $("#TaxRateDropDown").prop("disabled", false);
      this.is_edit = false;
      this.setItem(this.item_Code);
    }
    else {
      this.taxratecode = this.taxrateList[0].taxrateid;
      this.Tax_Rate = 0;
      this.is_edit = true;
      if (this.purchaseOrderDetails.length > 0) {
        var arr = this.purchaseOrderDetails.filter(f => f.item_Code != this.item_Code)
        for (let i = 0; i < arr.length; i++) {

          arr[i].taxrateid = this.taxratecode;
          arr[i].net_Amount -= this.purchaseOrderDetails[i].tax_Amount;
          arr[i].tax_Rate = 0;
          arr[i].tax_Amount = 0;
        }
      }
      $("#TaxRateDropDown").prop("disabled", true);
    }
    this.getCompanyTemplate();
  }
}



