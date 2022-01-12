import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetPOService, LoginService, SupplierService, Suppliers, DayEndService, Supplier, AssetPO, AssetPODetail, cDate, NgbDateFRParserFormatter, PermissionUtility }
  from '../../../../shared';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import swal from 'sweetalert';

@Component({
  selector: 'asset-po',
  host: { '(window:keydown)': 'hotkeys($event)' },
  templateUrl: './asset-po.component.html',
  styleUrls: ['./asset-po.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetPOComponent implements OnInit, AfterViewChecked {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public exampleData: Array<Select2OptionData>;
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  aaa: number = 1;
  modalReference: NgbModalRef;
  public supp: any;
  closeResult: string;
  grid: any;

  suppliers: Array<Select2OptionData> = [];
  public supplier_IDM: any;
  public supplier_ID: any;
  public supplier_Name: any;

  itemsR: any[] = [];
  items: Array<Select2OptionData>;
  public item_CodeM: any = 0;
  public item_Code: any;
  public item_Name: any;





  status: any;
  orders: any[];
  users: any;

  contacts: any[] = [];
  contact_ID: any = 0;
  frieght_Id: any = 1;
  exc: any = 0;

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
  index = 1;
  order_Envoy: any = 1;

  supplier_IDID: any;
  SupplierID: any = 0;
  purchase_Order_ID = 0;
  Office_Code: any;
  PO_NO: any;
  Supplier_ID: any = 1;
  contact_Person_ID: any;

  shipping_Method: any;
  payment_ID: any;
  freight_Term: any;
  total_Cost: any = 0;
  total_Discount: any = 0;
  freight_Chrgs: any = 0;
  total_Amount: any = 0;
  remarks: any;





  IsUpdate: any;
  ApprovedQty: any = 0;
  Quantity: any = 0;
  Discount_Rate: any = 0;
  Tax_Rate: any = 0;
  stock_Qty: any = 0;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  method_Id: any = 1;

  pO_Detail_ID: any = 0;
  unit_Price: any = 0;
  upp: any = 1;
  order_ID: any = "";
  foucs: any;
 isLoading: any = false;
  color = '#0094ff';
  guidOrder: boolean;
  public pO_Date = new cDate();
  public delivery_Date = new cDate();
  public Shipping_Date = new cDate();
  public paymentDate = new cDate();
  public dayEndDate = new cDate();
  isView: any = true;
  ID: any = "";
  isTaxable: any;
  taxRate: any = 0;
  taxable: any;
  cancelReturn: any;
  buttons: any;
  dangerMode: any;
  actionID: any = 1;
  exchange: any = 0;
  submitAdd:any;
  submitUpdate:any;
  settings1 = {
    singleSelection: 'true',
    enableSearchFilter: true
  };
  multiItems: any = false;
  dayEndDetail: any[] = [];
  alerts: Array<any> = [];
  isDueDate: any = false;
  DelayCheck: any = true;
  userCurrentOffice: any;
  userCurrentWarehouse: any;   
  //End Member Variables

  constructor(private service: AssetPOService,
    private LoginService: LoginService,
    private SupplierService: SupplierService,
    private DayEndService: DayEndService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    this.purchaseOrderDetails = new Array<AssetPODetail>();
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

    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.getCurrentDay();
    this.getGrid();
    this.permissionUtility.setPagePermissions(970022);
  } 
   
  //getCurrentDay
  getCurrentDay() {
    this.DayEndService.getCurrentDay(this.userCurrentOffice)
      .subscribe(response => {
        this.dayEndDetail = (response.json());
        this.pO_Date.setDate(this.dayEndDetail[0].poS_Day);
        this.delivery_Date.setDate(this.dayEndDetail[0].poS_Day);
        this.Shipping_Date.setDate(this.dayEndDetail[0].poS_Day);
        this.paymentDate.setDate(this.dayEndDetail[0].poS_Day);
        this.dayEndDate.setDate(this.dayEndDetail[0].poS_Day);
      });
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
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        //  console.log(response.json());
      });
  }
  //searchGrid
  searchGrid(value: string) {
    this.service.searchGrid(value)
      .subscribe(response => {
        if(response.json() !== null){

          this.grid = (response.json());
        }
        else{
          this.grid = [];
        }
        
      });
  }
  //getSuppliers
  getSuppliers() {
    // this.isLoading =true;
    this.service.getSuppliers()
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        //this.supplier_ID = this.suppliers[0].id;
        //this.isLoading = false;    
      });
  }
  //changeSupplier
  changeSupplier(e: any) {
    this.supplier_ID = e;

    this.service.getContacts(this.supplier_ID)
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
        }
      });
  }
  //getItems  
  getItems() {
    this.isLoading =true;
    this.service.getItems()
      .subscribe(response => {
        this.isLoading = false;
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        this.itemsR = response.json();
      });
  }
  //changeItem
  changeItem(e: any) {

    this.item_Code = e;
    var list = this.itemsR;
    if (list != null) {
      for (let i = 0; i < list.length; i++)
        if (list[i].item_Code == e.value) {
          this.item_Name = list[i].item_Name;
          this.ApprovedQty = list[i].quantity;
        }
    }
    this.unit_Price = 0;
    this.Discount_Rate = 0;
    this.Quantity = 1;
    this.upp = 1;
    this.DelayCheck = true;

  }
  //updateItem  
  updateItem(i: AssetPODetail, e: any) {

    this.item_Code = e;
    //alert(item_Code)
    var list = this.itemsR;
    if (list != null) {
      for (let i = 0; i < list.length; i++)
        if (list[i].item_Code == e.value) {
          this.item_Name = list[i].item_Name;
          this.ApprovedQty = list[i].quantity;
        }
    }
    this.DelayCheck = true;

  }
  //IfExists
  IfExists(purchase_Order_ID) {
    ////this.isLoading =true;
    ////this.service.IfExists(purchase_Order_ID)
    ////  .subscribe(response => {
    ////    this.status = (response.json());
    ////    if (this.status == true) {
    ////      $("#alertWarning").show();
    ////      $("#submitUpdate").prop("disabled", true);
    ////      $("#cancelBtn").prop("disabled", true);

    ////      $("#AddNewItemRow").hide();
    ////      this.EditItemButton = 'disabled';
    ////      this.RemoveItemButton = 'disabled';

    ////      this.isLoading = false;
    ////    }
    ////    else {
    ////      $("#alertWarning").hide();
    ////      $("#submitUpdate").prop("disabled", false);
    ////      $("#cancelBtn").prop("disabled", false);
    ////      $("#AddNewItemRow").show();
    ////      this.EditItemButton = '';
    ////      this.RemoveItemButton = '';
    ////      this.isLoading = false;
    ////    }
    ////  });
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices()
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
      });
  }
  //clearFields
  clearFields() {

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

    this.unit_Price = 0;
    this.stock_Qty = 0;
    this.upp = 1;
    this.taxable = 0;
    this.Tax_Rate = 0;
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
  //changeUnitPriceEdit
  changeUnitPriceEdit(i: AssetPODetail, unit_Price) {
    if (unit_Price <= 0) {
      i.unit_Price = 1;
    }
  }
  //changeUPP
  changeUPP(Quantity) {
    var up = 0;
    if (Quantity <= 0) {
      this.Quantity = 1;
    }
    this.upp = Quantity;//* this.unitPrices[0].upp;

  }
  //changeUPPEdit
  changeUPPEdit(i: AssetPODetail, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
    i.upp = quantity;//* this.unitPrices[0].upp;
  }
  //changeUPPEdit
  changeUPPFalseEdit(i: AssetPODetail, upp) {
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
  changeQuantityEdit(i: AssetPODetail, upp) {
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
  changeDiscountRateEdit(i: AssetPODetail, discount_Rate) {
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
  addGrid(item_Code: any, item_Name: any, Unit_Price: any, upp: any, Quantity: any, Discount_Rate: any, Tax_Rate: any) {

    if (this.DelayCheck) {
      this.DelayCheck = false;

      if (Unit_Price != 0) {
        if (item_Name != null) {
          if (this.Quantity > 0) {
            if (this.Quantity <= this.ApprovedQty) {
              var flag = false;
              if (this.purchaseOrderDetails.length > 0) {
                for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
                  if (this.purchaseOrderDetails[count].itemID == item_Code) {
                    flag = true;
                    break;
                  }
                }
              }
              if (this.hideUPP == true) {
                if (flag == false) {
                  if (this.hide == false) {
                    this.purchaseOrderDetails.push(new AssetPODetail(0, 0, item_Code, item_Name, Unit_Price, upp, this.ApprovedQty, Quantity, (Unit_Price * upp).toFixed(2), Discount_Rate, ((upp) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), 0, 0, ((upp) * (Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)).toFixed(2), 0, this.stock_Qty));
                  }
                  else {
                    this.purchaseOrderDetails.push(new AssetPODetail(0, 0, item_Code, item_Name, Unit_Price, upp, this.ApprovedQty, Quantity, (Unit_Price * upp).toFixed(2), Discount_Rate, ((upp) * (Unit_Price) * (Discount_Rate) / 100).toFixed(2), Tax_Rate, ((((upp * Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate).toFixed(2), (((upp) * (Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)) + ((((upp * Unit_Price) - ((upp) * (Unit_Price) * (Discount_Rate) / 100)) / 100) * Tax_Rate)).toFixed(2), 0, this.stock_Qty));
                  }

                  $("#submitAdd").prop("disabled", false);
                  $("#submitAddMore").prop("disabled", false);

                  if (this.item_CodeM == 0)
                    this.item_CodeM = -1;
                  else
                    this.item_CodeM = 0;

                  this.editMode = false;
                } else {
                  swal("Already Exists");
                  return;
                }
              }
            }
            else {
              this.DelayCheck = true;
              swal("Qty cannot be greater than Approved Qty.");
              return;
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
      } else {
        this.DelayCheck = true;
        swal("Unit price must be greater then 0");
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }
  }
  //changeMode
  changeMode(idx: any, i: AssetPODetail, Mode: any) {
    this.DelayCheck = true;
    var flag = false;
    if (this.purchaseOrderDetails.length > 0) {
      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        if (this.purchaseOrderDetails[count].itemID == i.itemID && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {
      if (i.unit_Price != 0) {
        if (flag == false) {
          if (i.quantity > 0) {
            i.edit_Mode = false;

            i.purchase_Cost = (i.unit_Price * i.upp).toFixed(2);
            i.discount_Amount = (i.purchase_Cost * (i.discount_Rate) / 100).toFixed(2);
            i.tax_Amount = ((i.purchase_Cost - i.discount_Amount) / 100 * i.tax_Rate).toFixed(2);
            i.net_Amount = ((parseFloat(i.purchase_Cost) - parseFloat(i.discount_Amount)) + parseFloat(i.tax_Amount)).toFixed(2);
            i.approvedqty = this.ApprovedQty;
            if (this.item_CodeM == 0)
              this.item_CodeM = -1;
            else
              this.item_CodeM = 0;

          }
          else {
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
      //alert(i.itemID);
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.itemID) {
          this.item_CodeM = this.items[j].id;
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

      this.stock_Qty = 0;
      this.unit_Price = 0;
      this.upp = 1;
    }

    //}
  }

  //onNavifate  
  onNavigate(pth) {
    sessionStorage.setItem('ReportView', "1");

    if (pth == "/po-rpt-excel")
      sessionStorage.setItem('ReportView', "2");
    else
      sessionStorage.setItem('ReportView', "1");

    sessionStorage.setItem('reportID', "1");
    sessionStorage.setItem('ID', this.ID);
    sessionStorage.setItem('exchange', "-1");
    window.open(pth, "_blank");
  }
  //getDetailsByID
  getDetailsByID(ID, content) {
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });


    sessionStorage.setItem('reportID', "1");
    sessionStorage.setItem('ID', ID);
    this.detailOpen(content);

    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.IfExists(ID);

    this.service.getDetailsByID(ID)
      .subscribe((o: AssetPO) => {
        this.isLoading = false;
        console.log(o);
        this.purchase_Order_ID = ID;
        this.ID = o.purchase_Order_ID;
        this.pO_Date.setDate(o.pO_Date);
        this.delivery_Date.setDate(o.delivery_Date);
        this.paymentDate.setDate(o.paymentDate);
        this.contact_Person_ID = o.contact_Person_ID;
        this.contact_ID = o.contact_Person_ID;
        this.payment_ID = o.payment_ID;
        this.shipping_Method = o.shipping_Method;
        this.freight_Term = o.freight_Term;
        this.freight_Chrgs = o.freight_Chrgs;
        this.total_Amount = o.total_Amount;
        this.total_Discount = o.total_Discount;
        this.remarks = o.remarks;


        this.isLoading =true;
        this.service.getPriviledgedOffices()
          .subscribe(response => {
            this.isLoading = false;
            this.users = (response.json());
            this.order_Envoy = o.order_Envoy;

            this.isLoading =true;
            this.service.getSuppliers()
              .subscribe(response => {
                this.isLoading = false;
                this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
                this.supplier_IDM = o.supplier_ID;
                this.supplier_ID = o.supplier_ID;


                this.purchaseOrderDetails = o.purchaseOrderDetails;
                this.isLoading =true;
                this.service.getItems()
                  .subscribe(response => {
                    this.isLoading = false;
                    this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
                    this.itemsR = response.json();
                    var list = this.itemsR;
                    for (let i = 0; i < this.purchaseOrderDetails.length; i++)
                      for (let j = 0; j < list.length; j++)
                        if (this.purchaseOrderDetails[i].itemID == list[j].item_Code) {
                          this.purchaseOrderDetails[i].approvedqty = list[i].quantity;
                        }

                  });

              });

          });


        //this.exchange = o.exchange;
        //$("#exchange").prop("disabled", false);
        ////if (this.exchange) {
        ////  $("#exchange").prop("disabled", true);
        ////}

        //if (o.cancel == 1) {
        //  if (this.status != true) {
        //    $("#alertWarning").show();
        //    $("#cancelBtn").prop("disabled", true);
        //    $("#submitUpdate").prop("disabled", true);

        //    $("#AddNewItemRow").hide();
        //    this.EditItemButton = 'disabled';
        //    this.RemoveItemButton = 'disabled';

        //    this.alerts = []
        //    this.alerts.push(
        //      {
        //        id: 4,
        //        type: 'danger',
        //        message: 'Record is not updatable since it is Cancelled...',
        //      });
        //  }
        //}

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
              this.getGrid();
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
    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        var order = new AssetPO(purchase_Order_ID,
          this.pO_Date.getDateFinal(), Office_Code, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange, this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);

        if (this.mode != 0) {
          this.purchaseOrderDetails[0].edit_Mode = true;
        }
        this.service.saveOrder(order).then(
          (response) => {
            this.ID = response;
            console.log(this.ID);
            sessionStorage.setItem('ID', this.ID);
            if (this.isView == true) {
              this.onNavigate('/po-rpt-rdlc');
            }


            this.getGrid();
            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);
            this.clearFields();

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
          (error) => console.log(error))

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

    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        var order = new AssetPO(purchase_Order_ID,
          this.pO_Date.getDateFinal(), Office_Code, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange,this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);

        if (this.mode != 0) {
          this.purchaseOrderDetails[0].edit_Mode = true;
        }

        this.service.saveOrder(order).then(
          (response) => {
            this.ID = response;
            console.log(this.ID);
            sessionStorage.setItem('ID', this.ID);

            this.getGrid();
            this.modalReference.close();
            if (this.isView == true) {
              this.onNavigate('/po-rpt-rdlc');
            }
            console.log(response);
          },
          (error) => console.log(error))

      }
      else {
        swal("Order must be greater then 0.");
      }
    }
    else {
      swal('Please Select Supplier!')

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


    if (this.supplier_ID > 0) {
      if (Total_Amount > 0) {
        var order = new AssetPO(purchase_Order_ID,
          this.pO_Date.getDateFinal(), Office_Code, PO_NO, order_Envoy,
          1, 1, supplier_ID,
          contact_Person_ID, this.delivery_Date.getDateFinal(), this.Shipping_Date.getDateFinal(),
          method_Id, payment_ID, frieght_Id,
          Total_Cost, Total_Discount, Pre_Tax_Amount,
          Total_Tax, freight_Chrgs, Total_Amount,
          remarks, Reorder_ID, Order_Type, this.paymentDate.getDateFinal(), 0, 0, false, this.mode,
          this.guid, null, null, 1, 0,
          false, this.exchange,this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);


        this.service.updateOrder(order).then(
          (response) => {
            this.getGrid();
            this.modalReference.close();
            if (this.isView == true) {
              this.onNavigate('/po-rpt-rdlc');
            }
            console.log(response);
          },
          (error) => console.log(error))
      }
      else {
        swal("Order must be greater then 0.");
      }
    }
    else {
      swal('Please Select Supplier!')
    }

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

  }
  //taxFields
  taxFields() {
    //if (this.LoginService.getSession('settingTaxOnPurchase') != '1') {
    this.hide = false;
    this.isTaxable = 0;
    this.taxRate = 0;
    $("#lblTotalTax").hide();
    //}
    //else {
    //  this.hide = true;
    //  this.isTaxable = this.LoginService.getSession('isTaxable');
    //  this.taxRate = this.LoginService.getSession('taxRate');
    //  $("#lblTotalTax").show();
    //}
  }
  //stockField
  stockField() {
    this.hideStock = true;
  }
  //uppField
  uppField() {
    this.hideUPP = true;
  }
  //rdlcStatus
  rdlcStatus() {
    this.isView = false;
  }
  //allowExchange
  allowExchange() {
    $("#allowExchange").hide();
  }
  //allowExchange
  allowMultiItems() {
    this.multiItems = false;
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
    $("#viewRDLC").prop("disabled", true);
    $("#viewExcel").prop("disabled", true);
    $("#allowExchange").hide();
    this.getCurrentDay();
    this.clearFields();
    this.getSuppliers();
    this.getItems();

    this.frieghtChange();
    this.scrollToBottom();
    this.getPriviledgedOffices();
    $("#cancelBtn").hide();
    this.taxFields();
    this.stockField();
    this.uppField();
    this.rdlcStatus();
    this.allowMultiItems();

    var timer = setTimeout(() => $("#textboxSupplier").focus(), 500);
  }
  // detailOpen modal
  detailOpen(content) {
    this.isLoading =true;
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
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    $("#allowExchange").hide();

    this.clearFields();

    $("#cancelBtn").show();

    this.taxFields();
    this.stockField();
    this.uppField();
    this.allowMultiItems();
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
    this.isLoading =true;
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

    this.modalReference = this.modalService.open(content, { size: 'xlg' });
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

    ////if (this.addSupplierName != "") {

    ////  if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.addSupplierCell == '') {
    ////    swal("Cell number must be defined.")
    ////  }
    ////  else {

    ////    var supplier = new Suppliers(0, this.addSupplierName, 0, this.addSupplierName, this.addSupplierPhone, this.addSupplierCell, this.addSupplierCell, this.addSupplierPhone, '', '', this.addSupplierEmail, '', 0, 1, 1, 1, 1, 1, 0, 1, '', 0, 0, this.guid, 0, this.addSupplierAddress, '', '', this.citycode, 1, 1, this.addSupplierStatus);
    ////    console.log(supplier);
    ////    this.isLoading = true
    ////    this.SupplierService.saveSupplier(supplier).then(
    ////      (response) => {
    ////        var list = response;
    ////        this.service.getSuppliers()
    ////          .subscribe(response => {
    ////            this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");

    ////            //this.setSelectedSupplier(list[0].supplier_ID, list[0].supplier_ID + ' : ' + list[0].supplier_Name);

    ////            this.service.getContacts(list[0].supplier_ID)
    ////              .subscribe(response => {
    ////                if (response.json() != null) {
    ////                  this.contacts = response.json();
    ////                  this.contact_ID = this.contacts[0].contact_ID;
    ////                  this.frieght_Id = this.contacts[0].frieght_Id;
    ////                  this.exc = this.contacts[0].exchange;
    ////                  if (this.exc == 1)
    ////                    this.allowExchange();
    ////                  else
    ////                    $("#allowExchange").hide();
    ////                  this.frieghtChange();
    ////                  // console.log(response.json());
    ////                  this.isLoading = false;
    ////                }
    ////              });
    ////          });

    ////        //this.getSuppliers();
    ////        //this.setSelectedSupplier(list[0].supplier_ID, list[0].supplier_ID + ' : ' + list[0].supplier_Name);

    ////        this.modalReference.close();
    ////        console.log(response);
    ////      },
    ////      (error) => console.log(error))

    ////  }

    ////}
    ////else {
    ////  swal("Supplier name must be define.");
    ////}

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
      this.isLoading =true;
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
      this.isLoading =true;
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
      this.isLoading =true;
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



}



