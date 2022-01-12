import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { GoodsReceiptsNoteService, LoginService, DayEndService, FileAttachmentService, Supplier, GoodsReceive, GoodsReceiveDetail, cDate, NgbDateFRParserFormatter, PermissionUtility, SaleOrderService } from '../../../../../shared';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import swal from 'sweetalert';

@Component({
  selector: 'goods-receipts-note',
  templateUrl: './goods-receipts-note.component.html',
  styleUrls: ['./goods-receipts-note.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class GoodsReceiptsNoteComponent implements OnInit, AfterViewChecked {

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility: PermissionUtility = new PermissionUtility();
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  // for date picker
  public myDatePickerOptions: IAngularMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    inline: false,
    selectorHeight: '25px'
  };
  //Member Variables
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  order: any;
  status: any;
  orders: any[];
  users: any[];
  suppliers: Array<Select2OptionData> = [];
  contacts: any[];
  items: Array<Select2OptionData>;
  unitPrices: any[];
  supplier: Supplier[];
  GoodsReceiveDetails: any[];
  TempReceiveDetails: any[];
  GoodsReceiveDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  selectedSupplier: Supplier = new Supplier(0, 0, '');
  editMode = false;
  index = 1;
  public goods_Receive_DATE = new cDate();
  public receive_Ack_DATE = new cDate();
  public dayEndDate = new cDate();
  order_Envoy: any = 1;
  Msupplier_ID: any;
  supplier_ID: any;
  supplier_IDID: any;
  SupplierID: any = 0;
  purchase_Order_ID = 0;
  Office_Code: any;
  PRN_NO: any;
  Supplier_ID: any = 1;
  contact_Person_ID: any;
  contact_ID: any;
  remarks: any;
  public item_Code: any;
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  hideStock = true;
  allowOW = false;
  pR_Detail_ID: any = 0;
  unit_Price: any = 0;
  packQuantity:any=false; 
  pack_Quantity: any = 0;
  return_ID: any = "";
  foucs: any;
  isLoading: any = false;
  color = '#0094ff';
  guidOrder: boolean;
  stocks: any[];
  stock_Qty: any = 0;
  grn_ID: any = 1;
  priviledged_Offices: any = '';
  good_Receive_ID: any = 0;
  receive_Qty: any = 1;
  accept_Qty: any = 1;
  goods_Receive_ID: any = 0;
  goods_Challan_NO: any = "";
  receive_Ack_By: any = 1;
  closeResult: string;
  grnID: any = 0;
  ID: any = "";
  id: any = "";
  search: any = "";
  isTaxable: any;
  taxRate: any;
  taxable: any;
  Tax_Rate: any = 0;
  dayEndDetail: any[] = [];
  beforeInvoice: any = true;
  alerts: Array<any> = [];
  cancelReturn: any;
  cancelStock: any[] = [];
  cancelStockStatus: any = false;
  userOffice: any;
  userPrivilegedOffice: any;
  grnStatus: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  isView: any = true;
  officE_CODE: any;
  officE_NAME: any = "";
  warehouseID: any;
  warehouse: any = "";
  companytemplate: any[] = [];
  templatecode: any = this.LoginService.getSession('DefaultCompanyTemplate');
  templatename: any = '';
  templateshow: any = '';
  reportName: any = '';
  isRPReport: any = false;
  sortOrder: any = 1;
  isStamp: any = false;
  showOfficeAndWerehouse: any = false;
  unit: any=0;
  unitList: any[];

  constructor(private service: GoodsReceiptsNoteService,
    private SaleOrderService:SaleOrderService,
    private LoginService: LoginService,
    private DayEndService: DayEndService,
    private fileservice: FileAttachmentService,
    private modalService: NgbModal) {
    this.GoodsReceiveDetails = new Array<GoodsReceiveDetail>();

    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;

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
    this.orderDetails(this.search);

    if (this.LoginService.getSession('AllowAttachmentSale') == '1')
      this.ShowAttachment = '';
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(130002);
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
    this.goods_Receive_DATE.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    //});
  }
  //changeGRDate
  changeGRDate(goods_Receive_DATE) {
    if (this.goods_Receive_DATE.getStandardDate() < this.dayEndDate.getStandardDate())
      this.goods_Receive_DATE.setDate(this.dayEndDate.getDateFinal());
  }
  //orderDetails 
  orderDetails(value: string) {
    this.isLoading = true;
    this.service.orderDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.order = (response.json());
          this.isLoading = false;
          //  console.log(response.json());
        }
        else{
          this.order = [];
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
  //IfExists
  IfExists(purchase_Order_ID) {
    this.service.IfExists(purchase_Order_ID, this.good_Receive_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //IfGRNExists
  IfGRNExists(goods_Receive_ID, supplier_ID, purchase_Order_ID) {
    this.service.IfGRNExists(goods_Receive_ID, supplier_ID, purchase_Order_ID)
      .subscribe(response => {
        var statusList = (response.json());
        console.log(response.json());
        this.grnStatus = statusList[0].status;
        if (this.grnStatus == 1) {
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
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.users = (response.json());
        if (this.users != null) {
          for (let i = 0; i < this.users.length; i++)
            if (this.users[i].order_Envoy == this.logedInUserID) {
              //alert(this.logedInUserID);
              var timer = setTimeout(() => this.order_Envoy = this.users[i].order_Envoy, 500);
            }
            else { this.order_Envoy = this.users[0].order_Envoy; }
        }
        else { this.order_Envoy = this.users[0].order_Envoy; }
      });
  }
  //getSuppliers
  getSuppliers(grn_ID) {
    //alert(grn_ID+" : "+this.supplier_ID);
    this.isLoading = true;
    this.service.getSuppliers(grn_ID, this.supplier_ID, this.userPrivilegedOffice, this.mode, this.beforeInvoice)
      .subscribe(response => {
        this.isLoading = false;
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        if (this.suppliers.length > 0) {
          if (this.mode == true)
            this.supplier_ID = this.suppliers[0].id;
          else
            this.supplier_ID = 0;
        } else {
          this.isLoading = false;
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
      });
  }
  //getSuppliersForNonPO
  getSuppliersForNonPO(grn_ID) {
    this.isLoading = true;
    this.service.getSuppliers(grn_ID, this.supplier_ID, this.userPrivilegedOffice, this.mode, this.beforeInvoice)
      .subscribe(response => {
        this.isLoading = false;
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
        if (this.suppliers.length > 0) {
          this.supplier_ID = this.suppliers[0].id;
        } else {

          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
      });
  }
 //getCompanyTemplate
 getCompanyTemplate() {
  if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
    this.templateshow = 'none';
  }
  else {
    this.templateshow = '';
    this.isLoading = true;
    this.service.getCompanyTemplate(this.userCurrentOffice, 130002, false)
      .subscribe(response => {
        this.companytemplate = (response.json());
        this.templatecode = this.companytemplate[0].templatecode;
        this.isLoading = false;
      });
  }

}

  //changeSupplier
  changeSupplier(e: any) {
    this.isLoading = true;
    if (this.mode == false)
      this.supplier_ID = e;

    this.service.getContacts(this.supplier_ID)
      .subscribe(response => {
        this.isLoading = false;
        this.contacts = (response.json());
        if (this.contacts != null) {
          this.contact_ID = this.contacts[0].contact_ID;
          if (this.grn_ID == 1) {

            this.isLoading = true;
            this.service.getPendingOrder(this.userPrivilegedOffice, this.supplier_ID, this.purchase_Order_ID, this.mode, this.beforeInvoice)
              .subscribe(response => {
                this.isLoading = false;

                this.orders = (response.json());
                if (this.orders != null) {
                  this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
                  this.officE_CODE = this.orders[0].officE_CODE;
                  this.officE_NAME = this.orders[0].officE_CODE + '-' + this.orders[0].officE_NAME;
                  this.warehouseID = this.orders[0].warehouseID;
                  this.warehouse = this.orders[0].warehouseID + '-' + this.orders[0].warehouse;
                  this.allowOfficeWarehouse();
                  this.userCurrentOffice = this.officE_CODE;
                  this.userCurrentWarehouse = this.warehouseID;
                  this.changeOrder(this.supplier_ID, this.purchase_Order_ID);

                }
              });
          }
        }

      });
  }
  //allowOfficeWarehouse
  allowOfficeWarehouse() {
    if (sessionStorage.getItem('AllowOfficeWarehouse') != "1") {
      this.allowOW = false;
    }
    else {
      this.allowOW = true;
      //this.userCurrentOffice = this.officE_CODE;
      //this.userCurrentWarehouse = this.warehouseID;
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
  //getItems  
  getItems() {
    this.isLoading = true;
    this.service.getItems()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
          this.item_Code = this.items[0].id;
          this.item_Name = this.items[0].text;

          this.isLoading = true;
          this.service.getUnitPrice(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
            .subscribe(response => {
              this.isLoading = false;
              if (response.json() != null) {
                this.unitPrices = (response.json());
                this.unit_Price = this.unitPrices[0].unit_Price;
                this.pack_Quantity = this.unitPrices[0].packing_Quantity;
                this.taxable = this.unitPrices[0].taxable;

                if (this.taxable == true) {
                  this.Tax_Rate = this.taxRate;
                }
                else { this.Tax_Rate = 0; }
              }
            });
        }
      });
  }
  //changeItems
  changeItem(e: any) {
    if (this.mode == false)
      this.item_Code = e;
    else
      this.item_Code = e;

    this.isLoading = true;
    this.service.getUnitPrice(e, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.unitPrices = (response.json());
          console.log(response.json());
          this.item_Name = this.unitPrices[0].item_Name;
          this.unit_Price = this.unitPrices[0].unit_Price;
          this.stock_Qty = this.unitPrices[0].stock_Qty;
          this.taxable = this.unitPrices[0].taxable;

          if (this.taxable == true)
            this.Tax_Rate = this.unitPrices[0].taxRate;
          else this.Tax_Rate = 0;
        }
        $("#submitAdd").prop("disabled", false);

      });
  }
  //GRNList
  GRNList = [
    { "grn_ID": 1, "grn": "PO" }
    , { "grn_ID": 2, "grn": "Non PO" }
  ]
  //clearFields
  clearFields() {
    this.officE_CODE = 0;
    this.officE_NAME = "";
    this.warehouseID = 0;
    this.warehouse = "";
    this.order_Envoy = 1;
    this.supplier_ID = 1;
    this.SupplierID = 0;
    this.purchase_Order_ID = 0;
    this.Office_Code = 0;
    this.PRN_NO = 0;
    this.Supplier_ID = 1;
    this.contact_Person_ID = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.GoodsReceiveDetails = [];
    this.orders = [];
    this.guid = UUID.UUID();
    this.grn_ID = 1;
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.mode = false;
    this.btnmode = true;
    this.showOfficeAndWerehouse = false;

    $("#alertWarning").hide();
    $("#ddlGRN").prop("disabled", false);
    $("#supplier_ID").prop("disabled", false);
    $("#purchase_Order_ID").prop("disabled", false);
  }
  //orderChange
  changeOrder(supplier_ID, purchase_Order_ID) {
    this.GoodsReceiveDetails = [];
    this.isLoading = true;
    this.service.getPendingOrderDetails(this.userPrivilegedOffice, this.userCurrentWarehouse, supplier_ID, purchase_Order_ID, this.good_Receive_ID, this.mode, this.beforeInvoice)
      .subscribe(response => {
        console.clear();
        console.log(response.json())
        this.isLoading = false;
        if (this.supplier_ID == 0 && this.btnmode == true) {
          this.orders = [];
        }
        else {
          if (response.json() != null) {
            this.showOfficeAndWerehouse = true;
            this.GoodsReceiveDetails = (response.json());
            console.log(this.GoodsReceiveDetails);
            if (this.mode)
              this.TempReceiveDetails = (response.json());
            $("#submitAdd").prop("disabled", false);
          }
        }
      });
  }
  //changeSupp
  changeSupp(supplier_IDID) {
    this.service.getContacts(supplier_IDID)
      .subscribe(response => {
        this.contacts = (response.json());
        this.contact_ID = this.contacts[0].contact_ID;
        //  console.log(response.json());
      });
  }
  //changeGRN
  changeGRN(grn_ID) {
    this.getSuppliers(grn_ID);
    if (grn_ID == 1) {
      this.grnID = false;
      $("#orderlbl").show();
      $("#orderddl").show();
      $("#contactlbl").hide();
      $("#contactddl").hide();
    }
    else {
      this.grnID = true;
      $("#orderlbl").hide();
      $("#orderddl").hide();
      $("#contactlbl").show();
      $("#contactddl").show();
      this.getItems();
      this.GoodsReceiveDetails = [];
    }
  }
  //changeQty
  changeQty(receive_Qty) {
    if (receive_Qty <= 0) {
      this.receive_Qty = 1;
    }
  }
   //changePackingQuantity
   changePackingQty(packingQty) {
    if (this.pack_Quantity <= 0) {
      this.pack_Quantity = 1;
    }
  }
  changePackingQtyEdit(i: GoodsReceiveDetail, pack_Quantity){
    if (pack_Quantity <= 0) {
      i.pack_Quantity = 1;
    }
  }
  //changeQtyEdit
  changeQtyEdit(i: GoodsReceiveDetail, receive_Qty) {
    if (receive_Qty <= 0) {
      i.receive_Qty = 1;
    }
  }
  //changeQuantity
  changeQuantity(i: GoodsReceiveDetail, item_Code, receive_Qty, accept_Qty) {

    this.receive_Qty = receive_Qty;
    this.accept_Qty = accept_Qty;
    if (accept_Qty <= 0) {
      i.accept_Qty = 1;
    }

    if (!this.mode) {

      if (this.receive_Qty - i.accepted_Qty >= accept_Qty) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      } else {
        i.accept_Qty = 1;
        swal("Receive Qty. Should be less then or equal to Pending Qty.");
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
      }
    }
    else {
      var tempAcceptQty = 0;
      if (this.TempReceiveDetails != null) {
        for (let t = 0; t < this.TempReceiveDetails.length; t++)
          if (this.TempReceiveDetails[t].goods_Detail_ID == i.goods_Detail_ID) {
            tempAcceptQty = this.TempReceiveDetails[t].accept_Qty;
          }
      }
      if (this.receive_Qty - (i.accepted_Qty - tempAcceptQty) >= accept_Qty) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      }
      else {
        i.accept_Qty = tempAcceptQty;
        swal("Receive Qty. Should be less then or equal to " + (this.receive_Qty - (i.accepted_Qty - tempAcceptQty)) + " Qty.");
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
      }
    }


  }
  //getDetailsByID
  getDetailsByID(goods_Receive_ID, content) {
    this.mode = true;
    this.btnmode = false;

    this.scrollToBottom();
    this.getDetailsView(goods_Receive_ID);
    this.detailOpen(content);
  }
  //getDetailsView
  getDetailsView(goods_Receive_ID) {
    this.service.getDetailsByID(goods_Receive_ID)
      .subscribe((o: GoodsReceive) => {
        this.good_Receive_ID = o.goods_Receive_ID;
        this.id = o.goods_Receive_ID;
        this.purchase_Order_ID = o.purchase_Order_ID;
        this.Msupplier_ID = o.supplier_ID;
        this.supplier_ID = o.supplier_ID;
        this.goods_Receive_DATE.setDate(o.goods_Receive_DATE);
        this.grn_ID = o.grn_ID;

        //getPriviledgedOffices
        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.users = (response.json());
            this.order_Envoy = o.receive_Ack_By;
          });

        if (o.cancel == 1) {
          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }
        else {
          this.service.IfExists(this.purchase_Order_ID, this.good_Receive_ID)
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
                this.IfGRNExists(this.good_Receive_ID, this.supplier_ID, this.purchase_Order_ID);
              }
            });
            if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
              this.templateshow = 'none';
            }
            else {
              this.templateshow = '';
              this.getCompanyTemplate();
              this.templatecode = o.template_ID;
            }
        }
        this.changeGRN(this.grn_ID);
        this.changeOrder(this.supplier_ID, this.purchase_Order_ID)
        $("#ddlGRN").prop("disabled", true);
        $("#supplier_ID").prop("disabled", true);
        $("#purchase_Order_ID").prop("disabled", true);
        this.remarks = o.remarks;

        this.attachments = [];
        this.guid = o.gRGUID;
        this.getFiles(this.guid);
      });
      
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      if (this.btnmode)
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
  //guidExist
  guidExist(guid: any) {
    this.service.guidExist(guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
      });
  }
  //addGrid
  addGrid(item_Code: any, Item_Name: any,Packing_Type_Name:any,pack_Quantity:any, Unit_Price: any, receive_Qty: any) {
    //if (this.stock_Qty != null && this.stock_Qty >= receive_Qty) {
    if (Item_Name != null) {
      if (receive_Qty > 0) {
        var flag = false;
        if (this.GoodsReceiveDetails.length > 0) {
          for (var count = 0; count < this.GoodsReceiveDetails.length; count++) {
            if (this.GoodsReceiveDetails[count].item_Code == item_Code) {
              flag = true;
              break;
            }
          }
        }
        if (flag == false) {
          this.GoodsReceiveDetails.push(new GoodsReceiveDetail(0, item_Code, Item_Name,Packing_Type_Name,pack_Quantity, Unit_Price, receive_Qty, receive_Qty, receive_Qty, 0, 0, this.stock_Qty,0));
          console.log(this.GoodsReceiveDetails);
          this.editMode = false;
        } else {
          swal("Already Exists");
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
    //} else {
    //  alert("Stock is not available." + this.stock_Qty + "");
    //  $("#submitAdd").prop("disabled", true);
    //}
    $("#submitAdd").prop("disabled", false);
    $("#txt").focus();
    this.scrollToBottom();
  }
  //changeMode
  changeMode(idx: any, i: GoodsReceiveDetail, Mode: any) {
    var flag = false;
    if (this.GoodsReceiveDetails.length > 0) {
      for (var count = 0; count < this.GoodsReceiveDetails.length; count++) {
        if (this.GoodsReceiveDetails[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }
    if (Mode == 0) {
      if (flag == false) {
        if (i.receive_Qty > 0) {
          i.edit_Mode = false;
        } else {
          swal("Quantity should be greater then 0");
        }
      } else {
        swal("Already Exists");
      }
    }
    else if (Mode == 2) {
      this.GoodsReceiveDetails.splice(idx, 1);
    }
    else {
      console.log(i);
      i.edit_Mode = true;
    }

  }
  ////updateItem  
  updateItem(i: GoodsReceiveDetail, e: any) {
    this.item_Code = e;
    this.service.getUnitPrice(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.pack_Quantity = this.unitPrices[0].packing_Quantity;
        this.stock_Qty = this.unitPrices[0].stock_Qty;

        i.item_Code = this.item_Code;
        i.item_Name = this.item_Name;
        i.unit_Price = this.unit_Price;
        i.stock_Qty = this.stock_Qty;
      });
  }
  //onNavigate
  onNavigate(pth) {
    sessionStorage.setItem('IsOrder', '0');
    sessionStorage.setItem('ID', this.id);
    sessionStorage.setItem('Goods_Receive_ID', this.id)
    sessionStorage.setItem('reportName', this.reportName);
    sessionStorage.setItem('ReportSave', "0");
    sessionStorage.setItem('SendingMedium', "0");
    sessionStorage.setItem('templatecode', '0');
    sessionStorage.setItem('isStamp', this.isStamp);
    sessionStorage.setItem('ReportView', "1");
    sessionStorage.setItem('reportID', "13");
    sessionStorage.setItem('exchange', "-1");
    sessionStorage.setItem('ReportParentType', "2");//SaleInvoiceEmail
    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }
    if (pth == "/si-rpt-excel") {
      sessionStorage.setItem('ReportView', "2");
      window.open(pth, "_blank");
    }
    else if (pth == "/si-rpt-mail") {
      sessionStorage.setItem('ReportSave', "1");
      sessionStorage.setItem('ReportID', this.id);
      sessionStorage.setItem('SendingMedium', "1");
    }
    else {
      sessionStorage.setItem('ReportView', "1");
      window.open(pth, "_blank");
    }

    // sessionStorage.setItem('Goods_Receive_ID', this.id);
    // sessionStorage.setItem('reportName', '');
    // sessionStorage.setItem('ReportView', "1");
    // sessionStorage.setItem('templatecode', "0");
    // if (pth == "/grn-rpt-excel") {
    //   sessionStorage.setItem('ReportView', "2");
    //   sessionStorage.setItem('reportID', "10");
    //   window.open(pth, "_blank");
    // }
    // else {
    //   sessionStorage.setItem('reportID', "10");
    //   window.open(pth, "_blank");
    // }
  }
  //cancelGRN
  cancelGRN() {
    this.service.cancelCheck(this.good_Receive_ID, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.cancelStock = (response.json());
        if (this.cancelStock != null) {
          for (let i = 0; i < this.cancelStock.length; i++) {
            if (this.cancelStock[i].quantity > this.cancelStock[i].stockQuantity) {
              this.cancelStockStatus = true;
              swal("Record is not cancelled since it is being used!");
              break;
            }
          }
        }
        if (this.cancelStockStatus != true) {
          swal({
            title: "Do you really want to cancel?",
            text: "Once cancelled, you will not be able to recover this GRN!",
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


                this.service.cancelGRN(this.good_Receive_ID)
                  .subscribe(response => {
                    swal("Poof! Your GRN has been cancelled!", {
                      icon: "success",
                    });
                    this.cancelReturn = (response.json());
                    this.orderDetails("");
                    this.modalReference.close();
                  });
              }
            });
        }
      });

  }
  //saveOrder
  saveOrder(goods_Receive_ID: any, goods_Receive_DATE: any, supplier_ID, purchase_Order_ID: any,
    grn_ID: any, goods_Challan_NO: any, receive_Ack_DATE: any, receive_Ack_By: any, gR_NO: any, return_Ack_DATE: any, return_Ack_By: any, pR_NO: any, remarks: any, isAcknowledge: any, gRGUID: any, voucher_ID: any) {

    console.log(this.GoodsReceiveDetails, 'list');
    if (supplier_ID > 0) {

      var flag = true
      if (this.GoodsReceiveDetails != null) {
        for (let i = 0; i < this.GoodsReceiveDetails.length; i++)
          if (this.GoodsReceiveDetails[i].accept_Qty <= 0) {
            flag = false;
            break;
          }
      }

      if (flag) {
        this.isLoading= true;
        var goodsReceive = new GoodsReceive(this.goods_Receive_ID, this.goods_Receive_DATE.getDateFinal(), supplier_ID, purchase_Order_ID, this.grn_ID,
          goods_Challan_NO, this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "new", this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "newPR", remarks, true, this.guid, 0, 0, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, this.userCurrentWarehouse,34, this.GoodsReceiveDetails);
         
          $("#submitAdd").prop("disabled", true);
        if (this.mode != 0) {
          this.GoodsReceiveDetails[0].flag = true;
        }
        this.service.saveOrder(goodsReceive).then(
          (response) => {
             
            this.id = response;
            sessionStorage.setItem('Goods_Receive_ID', this.id);
            if (this.isView == true) {
              this.onNavigate('/grn-rpt-rdlc');
            }
            this.orderDetails("");
            this.modalReference.close();
            console.log(response);
            this.orderDetails(this.search);
            this.isLoading = false;
          },
          (error) => console.log(error))
      }
      else {
        swal('Receive Qty Cannot be Zero!')
        this.isLoading = false;
      }
    }
    else {
      swal('Select Supplier!')
      this.isLoading = false;
    }

  }
  //updateOrder
  updateOrder(goods_Receive_ID: any, goods_Receive_DATE: any, supplier_ID, purchase_Order_ID: any,
    grn_ID: any, goods_Challan_NO: any, receive_Ack_DATE: any, receive_Ack_By: any, gR_NO: any, return_Ack_DATE: any, return_Ack_By: any, pR_NO: any, remarks: any, isAcknowledge: any, gRGUID: any, voucher_ID: any) {

    this.goods_Receive_ID = this.id;
    var goodsReceive = new GoodsReceive(this.goods_Receive_ID, this.goods_Receive_DATE.getDateFinal(), supplier_ID, this.purchase_Order_ID, this.grn_ID,
      goods_Challan_NO, this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "new", this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "newPR", remarks, true, this.guid, 0, 0, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, this.userCurrentWarehouse, 34, this.GoodsReceiveDetails);
    if (this.mode != 0) {
      this.GoodsReceiveDetails[0].flag = true;
    }
    this.service.updateOrder(goodsReceive).then(
      (response) => {
        this.id = response;
        sessionStorage.setItem('Goods_Receive_ID', this.id);

        if (this.isView == true) {
          this.onNavigate('/grn-rpt-rdlc');
        }
        this.orderDetails("");
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))

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
  hotkeys(event) {
    //alert(event.keyCode);
    //if (event.keyCode == 65) {
    //    alert("A pressed");
    //    this.showCreate();
    // }
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
  //invoiceBeforeGDN
  invoiceBeforeGRN() {
    if (sessionStorage.getItem('settingGRNBeforeInvoice') != "1") {
      this.beforeInvoice = false;
    }
    else {
      this.beforeInvoice = true;
    }
  }
  // open modal
  open(content) {
    this.getCurrentDay();
    this.getCompanyTemplate();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#cancelBtn").hide();
    $("#viewRDLC").prop("disabled", true);
    $("#viewExcel").prop("disabled", true);
    this.stockField();
    this.invoiceBeforeGRN();
    this.clearFields();
    this.getPriviledgedOffices();
    this.getSuppliers(this.grn_ID);
    this.getItems();
    this.changeGRN(this.grn_ID);
    this.scrollToBottom();
    this.rdlcStatus();
    this.getUnit();
    this.showOfficeAndWerehouse = false;
    /* if (this.LoginService.getSession('AllowPackingQuantityOnPO') == '1') {
      this.packQuantity = true;  
    }
    else {
      this.packQuantity = false; 
    } */
  }
  //detailOpen modal
  detailOpen(content) {
  
    this.modalReference = this.modalService.open(content, { size: 'xlg',backdrop: 'static', keyboard: false });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#cancelBtn").show();
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    this.stockField();
    this.invoiceBeforeGRN();
    this.getUnit();
    this.GoodsReceiveDetails = [];
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
      this.isLoading = true;
      this.fileservice.postFile(this.guid, 6, this.filename, this.fileToUpload)
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

}

