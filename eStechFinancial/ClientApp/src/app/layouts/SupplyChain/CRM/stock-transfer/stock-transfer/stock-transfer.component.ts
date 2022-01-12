import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LoginService, SearchFilterService, SaleOrderService, DayEndService, CustomerService, Customers, cDate, NgbDateFRParserFormatter, FileAttachmentService, EmailAlertService, PermissionUtility, SMSMessage, SmsAlertService, sendWhatsappMessage , CommonUtility} from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router'; 

import { stockTransferDetails } from '@shared/models/SupplyChain/CRM/stockTransferDetails';
import { stockTransfer } from '@shared/models/SupplyChain/CRM/stockTransfer';
import { StockTransferService } from '@shared/services/SupplyChain/CRM/stock-transfer/stock-transfer.service';
 
 

@Component({
  selector: 'stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss'],
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
})
export class StockTransferComponent implements OnInit, AfterViewChecked {
  public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  ////////////////////////////////////////
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public commonUtility: CommonUtility = new CommonUtility();
  public permissionUtility: PermissionUtility=new PermissionUtility();

  sms:SMSMessage;
   
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
  stockTransferDetails: any[];
  itemStockIMEI: any[];
  stocks: any[];
  stockTransferDetail: any;
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
  stock_Trans_ID = 0;
  Office_Code: any;
  allowOW1 = false;
  allowOW2 = false;
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
  isView: any = true;
  isStamp: any = false;
  public sT_Date = new cDate();
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
  exchange: any = 0;
  exc: any = 0;
  areaenable: any = 0;
  areashow: any = 'none';
  area: any[] = [];
  removedItems: any[] = [];
  areacode: any = 1;
  areaname: any = ''
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
  reportName: any = 'StockTransferNote.repx';
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
  trans_Quantity: any=0;
  from_Office: any = 0;
  to_Office: any = 0;
  fromOffices: any[];
  toOffices: any[];
  fromWarehouses: any[];
  from_Warehouse: any =1;
  toWarehouses: any[];
  to_Warehouse: any =1;
  unit : any = 0;
  unitList: any[] = [];
  unitList1: any[] = [];
  disabledFromWarehouse:any=false;
  disabledToWarehouse:any=false;
  disabledFromOffice:any=false;
  disabledToOffice:any=false;

  constructor(
    public router: Router,
    private service: StockTransferService, 
    private LoginService: LoginService, 
    private searchfilter: SearchFilterService,
    private saleOrderService: SaleOrderService, 
    private modalService: NgbModal) {
    this.stockTransferDetails = new Array<stockTransferDetails>();
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
    this.searchStockTransfer('');
    this.isItemBook();
    this.showDueDate();
    this.getCurrentDay(); 
    this.getAreaEnableStatus(); 
    //this.getOffices();
    this.permissionUtility.setPagePermissions(140062); 

    $("#cancelSchemeBtn").hide();
    this.logedInUserID = this.LoginService.getSession('user_ID');

    //------------------------------------------------------------------------------------
    //-------------------Get Current Offices
    //------------------------------------------------------------------------------------
   //alert(this.userCurrentWarehouse);
    this.LoginService.getCurrentOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = (response.json());
        console.log('offices',this.offices)
        if (this.offices != null) { 
          this.userOffice = this.offices[0].officE_NAME;
          this.fromOffices = this.offices;
          this.toOffices = this.offices;
          this.from_Office = this.userCurrentOffice;
          this.to_Office = this.userCurrentOffice;
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
        //alert(this.userOffice);
        this.LoginService.getCurrentWareshouse(this.userOffice)
          .subscribe(response => {
            console.log(response.json());
            this.warehouses = (response.json());
            if (this.warehouses != null) {
              this.warehouseID = this.warehouses[0].warehouseID;
            }
          });
          //alert(this.userCurrentOffice)
        this.LoginService.getCurrentWareshouse(this.userCurrentOffice)
          .subscribe(response => {
            this.warehouses = (response.json());
            //console.clear();
            console.log(this.warehouses);
            this.fromWarehouses = this.warehouses;
            console.log(this.warehouses);
            this.toWarehouses = this.warehouses;
            //alert(this.fromWarehouses[0].warehouseID+'----'+this.toWarehouses[0].warehouseID)
            this.from_Warehouse = this.fromWarehouses[0].warehouseID;
            this.to_Warehouse = this.toWarehouses[0].warehouseID;

            if (this.warehouses != null) {// 
              for (let i = 0; i < this.warehouses.length; i++)
                if (this.warehouses[i].warehouseID == this.userCurrentWarehouse) {
                  console.log(this.warehouses[i].warehouseID);
                  this.warehouseID = this.warehouses[i].warehouseID;
                  //var timer = setTimeout(() => {this.warehouseID = this.warehouses[i].warehouseID}, 500);
                }
                else { this.warehouseID = this.warehouses[0].warehouseID; }
            }
            else { this.warehouseID = this.warehouses[0].warehouseID; }

          });
          

      });
      this.getCompanyTemplate();
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getCurrentDay
  getCurrentDay() {
    this.sT_Date.setDate(this.LoginService.getSession('currentOpenDay'));
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
      this.service.getCompanyTemplate(this.userCurrentOffice, 140062, 0)
        .subscribe(response => {
          this.companytemplate = (response.json());
          console.log(this.companytemplate);
          //this.templatecode = this.companytemplate[0].templatecode;
          this.isLoading = false;
        });
    }

  }
  //changeSODate
  changeSTDate(pO_Date) {
    if (this.sT_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.sT_Date.setDate(this.dayEndDate.getDateFinal());
  } 
  //changeDeliveryDate
  changeDeliveryDate(delivery_Date) {
    if (this.delivery_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.delivery_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //searchOrderDetails
  searchStockTransfer(value: string) {
    this.isLoading = true;
    this.service.searchStockTransfer(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json()!==null){
          this.isLoading = false;
          this.order = (response.json());
        }else{
          this.order = [];
          this.isLoading = false;
        }
        console.log(this.order);
        
      });
  }
  //getPriviledgedOffices
  // getPriviledgedOffices() {
  //   this.service.getSaleOfficers(this.userPrivilegedOffice, this.saleOfficerDesignation)
  //     .subscribe(response => {
  //       this.users = (response.json());
  //       console.clear();
  //       console.log(this.users);

  //       if (this.users != null) {
  //         for (let i = 0; i < this.users.length; i++)
  //           if (this.users[i].order_Envoy == this.logedInUserID) {
  //             var timer = setTimeout(() => this.order_Envoy = this.users[i].order_Envoy, 500);
  //           }
  //           else { this.order_Envoy = this.users[0].order_Envoy; }
  //       }
  //       else { this.order_Envoy = this.users[0].order_Envoy; }



  //     });
  // }


  /* getOffices() {
    this.isLoading = true;
    this.service.getOffices()
      .subscribe(response => {
        this.fromOffices = (response.json());
        this.toOffices = (response.json());
        this.from_Office = this.fromOffices[0].office_Code;
        this.to_Office = this.toOffices[0].office_Code; 
         this.getFromWarehouses();
         this.getToWarehouses();
          this.isLoading=false;
      });
  } */
  getUnit(mood)
  {
    if(mood == 0)
    {
      this.saleOrderService.getUnits(mood).subscribe(response => {
        this.unitList1 = (response.json());
        
      });
    }
    else{
        this.saleOrderService.getUnits(mood).subscribe(response => {
        this.unitList = (response.json());
        if(this.unitList!=null){
        this.unit = this.unitList[0].unitID;
        console.log(this.unitList);
        }
      });
    }
  }
 /*  getFromWarehouses(){ 
    this.service.getWarehouse(this.from_Office)
    .subscribe(response => {
      this.fromWarehouses = (response.json());  
      this.from_Warehouse = this.fromWarehouses[0].warehouseID; 
      this.getItems();
    });
    
  } */
/* getToWarehouses(){ 
  this.service.getWarehouse(this.to_Office)
    .subscribe(response => {
      this.toWarehouses = (response.json()); 
  
       if(this.from_Warehouse==1){
      this.to_Warehouse = this.toWarehouses[1].warehouseID;
       
      }
      else{
        this.to_Warehouse = this.toWarehouses[0].warehouseID;
      }
      
    });
} */
  //getAreaEnableStatus
  getAreaEnableStatus() {
    if (this.LoginService.getSession('EnableAreaonSO') != '1') {
      this.areaenable = 0;
    }
    else {
      this.areaenable = 1;
    }
  } 
   
  //getItems  
  getItems() {
    //alert(1)
    this.isLoading = true;
    this.service.getItems(this.from_Office,this.from_Warehouse)
      .subscribe(response => {
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
         
        if(this.items.length!=0){
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        this.isLoading = false;
        }
        this.getStock();
      });
  }
  //changeItem
  changeItems(e: any) {
    this.isLoading = true;
    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
      if(this.items.length!=0)
      this.item_Name = this.items.filter(f=>f.id == this.item_Code)[0].text;
    }
    this.SetItem(this.item_Code);
  }
  SetItem(item_Code:any){
    this.getStock();
    this.allowOfficeWarehouse();  
           
          this.isLoading = false;
          $("#submitAdd").prop("disabled", false);
          $("#submitAddMore").prop("disabled", false);
          this.isLoading = false;
        
        this.DelayCheck = true;
        this.isLoading = false;
  }
   
   
  //clearFields
  clearFields() {
    this.textboxCustomerID = 0;
    this.textboxCustomerName = ''; 
    this.order_Envoy = 0;
    this.supplier_ID = 1;
    this.stock_Trans_ID = 0;
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
    this.stockTransferDetails = [];
    $("#alertWarning").hide();
    //  $("#submitAdd").prop("disabled", false);
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    // this.getPriviledgedOffices(); 
    this.enableItemDropDown();  
    this.getCompanyTemplate(); 
    this.getStock();
    this.RemoveItemButton = '';
    this.EditItemButton = '';
    $("#AddNewItemRow").show();
    this.unit_Price = 0;
    this.stock_Qty = 0;
    this.pending = 0;
    this.taxable = 0;
    this.Tax_Rate = 0;
    //this.from_Office=0;
    //this.to_Office=0;
    //this.from_Warehouse=1;
    //this.to_Warehouse=1;
    this.textboxItemEditFlag = false;
    this.getUnit(0);

    this.disabledFromOffice=false;
    this.disabledToOffice=false;
    this.disabledFromWarehouse=false;
    this.disabledToWarehouse=false;

    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });

  }  
  //getStock
  getStock(){
    this.service.getStocks(this.item_Code, this.from_Office, this.from_Warehouse)
    .subscribe(response => {
      this.stocks = (response.json());
       
      if(this.stocks!==null)
      this.stock_Qty = this.stocks[0].stock_Qty; 
      else
      this.stock_Qty=0;
    this.getUnit(this.item_Code);
      //this.unit = this.stocks[0].uoM; 

    });
  }

  /*   //DeleteStockItem
    DeleteStockItem(g, itemCode){  
      alert(g);
      this.service.DeleteStockItem(itemCode, this.from_Office, this.from_Warehouse, this.to_Office, this.to_Warehouse,g)
      .subscribe(response => {
        this.stocks = (response.json()); 
        
  
      });
    } */
  //changeQuantity
  changeQuantity(trans_Quantity) {
    if (trans_Quantity <= 0) {
      this.trans_Quantity = 1;
    }
  }
  //changeQuantityEdit
  changeQuantityEdit(i: stockTransferDetails, trans_Quantity) {
    if (trans_Quantity <= 0) {
      i.trans_Qty = 1;
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
  //updateItem 
  updateItem(i: stockTransferDetails, e: any) {

    console.log(i);

    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
    } else {
      this.item_Code = this.textboxItemIDEdit;
    }
     
  }
 //changeMode
 changeMode(idx: any, i: stockTransferDetails, Mode: any) {
  this.DelayCheck = true;
  $('td.active').removeClass('active');
  console.log("Index : " + idx + "--- Page :" + this.g);
  console.log(i);




  var flag = false;
  if (this.stockTransferDetails.length > 0) {
    for (var count = 0; count < this.stockTransferDetails.length; count++) {
      if (this.stockTransferDetails[count].item_Code == i.item_Code && idx != count) {
        flag = true;
        break;
      }
    }
  }
 

  if (this.sessionEnableTextboxItem != 1) {
    this.service.getStocks(i.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.stocks = (response.json());

        if(this.stocks!=null)
        this.stock_Qty = this.stocks[0].stock_Qty;

        if (Mode == 0) {
          if (this.stock_Qty != null && this.stock_Qty >= this.trans_Quantity) { 
             i.edit_Mode=false;
            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);
            $("#submitUpdate").prop("disabled", false);
          }
          else {
            $("#submitAdd").prop("disabled", true);
            $("#submitAddMore").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
            swal("Stock is not available." + this.stock_Qty + "");
            return;
          }
        }
        else if (Mode == 2) {
          //this.removedItems.push(i[idx].item_Code, i[idx].stock_Detail_ID)
          console.log("Index : " + idx + "--- Page :" + this.g);
          this.stockTransferDetails.splice(idx, 1);
          //this.getItems();
        
          this.Quantity=1;
           
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
           
        }

      });

  }
  else {
    this.textboxItemEditFlag = true;
    this.service.getStocks(i.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.stocks = (response.json());
        if(this.stocks!=null)
        this.stock_Qty = this.stocks[0].stock_Qty;

        if (Mode == 0) {
          if (this.stock_Qty != null && this.stock_Qty >= this.trans_Quantity) {
             
               i.edit_Mode = false; 
             
            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);
            $("#submitUpdate").prop("disabled", false);
          }
          else {
            $("#submitAdd").prop("disabled", true);
            $("#submitAddMore").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
            swal("Stock is not available." + this.stock_Qty + "");
            return;
          }
        }
        else if (Mode == 2) {
          console.log("Index : " + idx + "--- Page :" + this.g);
          this.stockTransferDetails.splice(idx, 1);
          //this.getItems();
          this.Quantity=1;
           

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
           
        }

      });
  }


}
   getUnitName(id)
  {
    return this.unitList1.filter(f=>f.unitID == id)[0].unit;
  }
  //addGrid
  addGrid(item_Code: any, item_Name: any) {
    //$("#userCurrentOffice").prop("disabled", true);
    //$("#userCurrentWarehouse").prop("disabled", true);
    if (this.DelayCheck) {
      this.DelayCheck = false;
      $('td.active').removeClass('active'); 
        if (this.stock_Qty != null || this.stock_Qty==0) {
           
          if (item_Name != null) {
            if (this.stock_Qty > 0) {
              if(this.stock_Qty>=this.trans_Quantity){
              var serialNo = 0;
              var flag = false;
              if (this.stockTransferDetails.length > 0) {
                for (var count = 0; count < this.stockTransferDetails.length; count++) {
                  if (this.stockTransferDetails[count].item_Code == item_Code) {
                    flag = true;
                    serialNo = count + 1;
                    break;
                  }
                }
              }
               
              if (flag == false) {
                if (this.hide == false) {
                  this.stockTransferDetails.push(new stockTransferDetails(0, 0, this.item_Code, this.item_Name, this.stock_Qty, this.trans_Quantity, this.unit,0));
                  this.getItems(); 
                  this.trans_Quantity=0;
                }
                else {
                  this.stockTransferDetails.push(new stockTransferDetails(0, 0, item_Code, item_Name, this.stock_Qty, this.trans_Quantity, this.unit,0));
                  this.getItems(); 
                  this.trans_Quantity=0;
                }
                //console.log('TAXAMOUNT', this.stockTransferDetails);
                if (this.sessionEnableTextboxItem != 0) {
                   
                  //this.item_Code = 1;
                   
                  this.changeItems(this.item_Code);
                }
                this.editMode = false;
              }
              else {
                swal("Already Exists At Sr # " + serialNo);
                return;
              }
            }
            else{
              swal("Stock Quantity must be greater or equal to transfer quantity");
              return;
            }
            }
            else {
              swal("Stock Quantity is required. Qty not be zero and should be numeric");
              return;
            }
          } else {
            swal("Item is Required");
            return;
          }
         
          $("#submitAdd").prop("disabled", false);
          $("#submitAddMore").prop("disabled", false);
        } else {
          $("#submitAdd").prop("disabled", true);
          $("#submitAddMore").prop("disabled", true);
          swal("Stock is not available." + this.stock_Qty + "");
          return;
        }
       
      $("#txt").focus();
      this.scrollToBottom();
    }
  }
  //IfExists
  IfExists(stock_Trans_ID) {
    sessionStorage.setItem('Stock_Trans_ID', stock_Trans_ID);
    this.service.IfExists(stock_Trans_ID)
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
      sessionStorage.setItem('reportID', "18");
      window.open(pth, "_blank");
    }
    else if (pth == "/so-rpt-excel") {
      sessionStorage.setItem('ReportView', "2");
      sessionStorage.setItem('reportID', "18");
      window.open(pth, "_blank");
    }
    else if (pth == "/so-rpt-mail") {
      sessionStorage.setItem('reportID', "18");
      sessionStorage.setItem('ReportSave', "1");
      sessionStorage.setItem('ReportID', this.ID);
      sessionStorage.setItem('SendingMedium', "1");
    }
   
    else {
      sessionStorage.setItem('reportID', "18");
      window.open(pth, "_blank");
    }
    sessionStorage.setItem('exchange', "-1");

  } 
  
  //saveOrder
  saveStock(stock_Trans_ID: any, sT_Date: any, office_Code: any, from_Office: any, to_Office: any, from_Warehouse: any,
    to_Warehouse, is_Update: any) {
       
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);
    this.allowOfficeWarehouse();  
        this.isLoading = true;

        if(this.from_Warehouse==this.to_Warehouse && this.from_Office==this.to_Office){
          swal("Alert","To office and To warehouse should be different from '\from Office\' and From warehouse","info");
          this.isLoading = false;
          return;
        }
        var order = new stockTransfer(stock_Trans_ID, this.sT_Date.getDateFinal(), 
        this.userCurrentOffice, this.from_Office, this.to_Office,this.logedInUserID
        ,this.templatecode,this.from_Warehouse,this.to_Warehouse, this.stockTransferDetails);
         console.log(order);
        this.service.saveStock(order).then(
          (response) => {

            this.isLoading = false;
            this.ID = response;
            sessionStorage.setItem('ID', this.ID);
            sessionStorage.setItem('exchange', "-1");
            sessionStorage.setItem('AreaID', this.areacode);
            if (this.isView == true) {
              this.onNavigate('/so-rpt-rdlc');
            }

           
            this.searchStockTransfer('');
            this.modalReference.close();
            console.log(response);
           
          },
          (error) => {
            // console.log(error)
            this.isLoading = false;
            this.commonUtility.handleError(error);
          })
       
       
     
  }   
  //updateOrder
  updateStock(stock_Trans_ID: any, sT_Date: any, office_Code: any, from_Office: any, to_Office: any, from_Warehouse: any,
    to_Warehouse, is_Update: any) {
     
    this.allowOfficeWarehouse(); 
        this.isLoading = true;
        if(this.from_Warehouse==this.to_Warehouse && this.from_Office==this.to_Office){
          swal("Alert","To office and To warehouse should be different from '\from Office\' and From warehouse","info");
          this.isLoading = false;
          return;
        }
        var order = new stockTransfer(stock_Trans_ID, this.sT_Date.getDateFinal(), 
        this.userCurrentOffice, this.from_Office, this.to_Office,this.logedInUserID
        ,this.templatecode,this.from_Warehouse,this.to_Warehouse, this.stockTransferDetails);

        this.service.updateStock(order).then(
          (response) => {

            this.isLoading = false;
            this.searchStockTransfer('');
            this.modalReference.close();
            if (this.isView == true) {
              this.onNavigate('/so-rpt-rdlc');
            }
 
          },
          (error) => {
            console.log(error); this.isLoading = false;
          })
      }
       
    
      
  
  //getDetailsByID
  getDetailsByID(stock_Trans_ID, content) {
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });

    this.stockTransferDetails = [];

    this.detailOpen(content);
    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = ''; 
    this.disabledFromOffice=true;
    this.disabledToOffice=true;
    this.disabledFromWarehouse=true;
    this.disabledToWarehouse=true;

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
    sessionStorage.setItem('ID', stock_Trans_ID);
    this.mode = true;
    this.btnmode = false;
    //this.edit();
    this.IfExists(stock_Trans_ID);

    this.isLoading = true;
    this.service.getDetailsByID(stock_Trans_ID)
      .subscribe((o: stockTransfer) => {
        this.isLoading = false; 
        console.clear();
        console.log('stockTransfer', o);
        this.stock_Trans_ID = o.stock_Trans_ID;
        sessionStorage.setItem('exchange', "-1");
        sessionStorage.setItem('ID', this.stock_Trans_ID.toString());
        
         this.from_Office =o.from_Office; 
         this.to_Office = o.to_Office; 
         this.from_Warehouse = o.from_WarehouseID;
         this.to_Warehouse =o.to_WarehouseID; 
         

        this.sT_Date.setDate(o.sT_Date);
        
     setTimeout(() => {
       this.stockTransferDetails=o.stockTransferDetails;
     }, 100);

        if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
          this.templateshow = 'none';
        }
        else {
          this.templateshow = '';
          this.getCompanyTemplate();
          this.templatecode = o.template_ID;
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
      this.allowOW1 = false;
      this.allowOW2 = false;
    }
    else {
      this.allowOW1 = true;
      this.allowOW2 = true;
      this.userCurrentOffice = this.officE_CODE;
      this.userCurrentWarehouse = this.warehouseID;
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
    //this.stockField();
    this.pendingField();
    this.disableDiscountEditing();
    this.rdlcStatus(); 
    this.getUnit(0);
    //this.getOffices();

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
    //this.stockField();
    this.pendingField();
    this.disableDiscountEditing(); 
    // this.getOffices();
    this.getUnit(0);
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
   
}
