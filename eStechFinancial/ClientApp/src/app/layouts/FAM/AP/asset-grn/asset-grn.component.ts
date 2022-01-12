import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetGRNService, LoginService, DayEndService, Supplier, GoodsReceive, GoodsReceiveDetail, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import swal from 'sweetalert';

@Component({
  selector: 'asset-grn',
  templateUrl: './asset-grn.component.html',
  styleUrls: ['./asset-grn.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class AssetGRNComponent implements OnInit, AfterViewChecked {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  submitAdd:any;
  submitUpdate:any;
  public permissionUtility:PermissionUtility=new PermissionUtility();
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
  modalReference: NgbModalRef;
  grid: any;

  suppliers: Array<Select2OptionData> = [];
  Msupplier_ID: any;
  supplier_ID: any;

  items: Array<Select2OptionData>;
  public item_Code: any;
  public item_Name: any;

  status: any;
  orders: any[];
  users: any[];
 
  contacts: any[];
  
  unitPrices: any[];
 
  GoodsReceiveDetails: any[];
  GoodsReceiveDetail: any;
  ////selectedItem: Object = {};
  ////newselectedItem: Object = {};
  ////selectedSupplier: Supplier = new Supplier(0, 0, '');
  editMode = false;
  index = 1;
  public goods_Receive_DATE = new cDate();
  public receive_Ack_DATE = new cDate();
  public dayEndDate = new cDate();
  order_Envoy: any = 1;
  purchase_Order_ID = 0;
  Office_Code: any;
  PRN_NO: any;
  remarks: any;  
  
  ////supplier_IDID: any;
  ////SupplierID: any = 0;

  ////Supplier_ID: any = 1;
  ////contact_Person_ID: any;
  ////contact_ID: any;
  
  
  IsUpdate: any;
  Quantity: any = 1;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  hideStock = true;
  pR_Detail_ID: any = 0;
  unit_Price: any = 0;
  return_ID: any = "";
  foucs: any;
 isLoading: any = false;
  color = '#0094ff';
  guidOrder: boolean;
  stocks: any[];
  stock_Qty: any = 0;
  grn_ID: any = 1;
  priviledged_Offices: any = 1;
  good_Receive_ID: any = 0;
  receive_Qty: any = 1;
  accept_Qty: any = 1;
  goods_Receive_ID: any = 0;
  goods_Challan_NO: any = "";
  receive_Ack_By: any = 1;
  closeResult: string;
  grnID: any = 0;
  Query: any = "";
  id: any = "";
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
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  //End Member Variables
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
  constructor(private service: AssetGRNService,
    private LoginService: LoginService,
    private DayEndService: DayEndService,
    private modalService: NgbModal) {
    this.GoodsReceiveDetails = new Array<GoodsReceiveDetail>();

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
    this.getGrid(this.Query);
    this.permissionUtility.setPagePermissions(970023);
 }
  
  //getCurrentDay
  getCurrentDay() {
    this.DayEndService.getCurrentDay(this.userCurrentOffice)
      .subscribe(response => {
        this.dayEndDetail = (response.json());
        this.goods_Receive_DATE.setDate(this.dayEndDetail[0].poS_Day);
        this.dayEndDate.setDate(this.dayEndDetail[0].poS_Day);
      });
  }
  //changeGRDate
  changeGRDate(goods_Receive_DATE) {
    if (this.goods_Receive_DATE.getStandardDate() < this.dayEndDate.getStandardDate())
      this.goods_Receive_DATE.setDate(this.dayEndDate.getDateFinal());
  }
  //getGrid
  getGrid(value: string) {
    this.isLoading =true;
    this.service.getGrid(value,this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.grid = (response.json());
          //  console.log(response.json());
        }
        else{
          this.isLoading = false;
        this.grid = [];
        }
        
      });
  }
  //////IfExists
  ////IfExists(purchase_Order_ID) {
  ////  this.service.IfExists(purchase_Order_ID)
  ////    .subscribe(response => {
  ////      this.status = (response.json());
  ////      if (this.status == true) {
  ////        $("#alertWarning").show();
  ////        $("#submitUpdate").prop("disabled", true);
  ////      }
  ////      else {
  ////        $("#alertWarning").hide();
  ////        $("#submitUpdate").prop("disabled", false);
  ////      }
  ////    });
  ////}
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices(this.priviledged_Offices)
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
    this.isLoading =true;
    this.service.getSuppliers(grn_ID, this.supplier_ID, this.priviledged_Offices, this.mode, this.beforeInvoice)
      .subscribe(response => {
        this.isLoading = false;
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");

      });
  }
  //////getSuppliersForNonPO
  ////getSuppliersForNonPO(grn_ID) {
  ////  this.isLoading =true;
  ////  this.service.getSuppliers(grn_ID, this.supplier_ID, this.priviledged_Offices, this.mode, this.beforeInvoice)
  ////    .subscribe(response => {
  ////      this.isLoading = false;
  ////      this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
  ////      if (this.suppliers.length > 0) {
  ////        this.supplier_ID = this.suppliers[0].id;
  ////        ////this.isLoading =true;
  ////        ////this.service.getContacts(this.supplier_ID)
  ////        ////  .subscribe(response => {
  ////        ////    this.isLoading = false;
  ////        ////    this.contacts = (response.json());
  ////        ////    if (this.contacts != null) {
  ////        ////      this.contact_ID = this.contacts[0].contact_ID;
  ////        ////      if (this.mode == true) {
  ////        ////        this.isLoading =true;
  ////        ////        this.service.getPendingOrder(this.priviledged_Offices, this.supplier_ID, this.purchase_Order_ID, this.mode, this.beforeInvoice)
  ////        ////          .subscribe(response => {
  ////        ////            this.isLoading = false;
  ////        ////            this.orders = (response.json());
  ////        ////            if (this.orders.length > 0) {
  ////        ////              this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
  ////        ////              this.changeOrder(this.supplier_ID, this.purchase_Order_ID);
  ////        ////            }
  ////        ////          });
  ////        ////      }
  ////        ////    }
  ////        ////  });


  ////      } else {

  ////        $("#submitAdd").prop("disabled", true);
  ////        $("#submitUpdate").prop("disabled", true);
  ////      }
  ////    });
  ////}
  //changeSupplier
  changeSupplier(e: any) {
    this.isLoading =true;
    if (this.mode == false)
      this.supplier_ID = e;

    ////this.service.getContacts(this.supplier_ID)
    ////  .subscribe(response => {
    ////    this.isLoading = false;
    ////    this.contacts = (response.json());
    ////    if (this.contacts != null) {
    ////      this.contact_ID = this.contacts[0].contact_ID;
    ////if (this.grn_ID == 1) {
    this.isLoading =true;
    this.service.getPendingOrder(this.priviledged_Offices, this.supplier_ID, this.purchase_Order_ID, this.mode, this.beforeInvoice)
      .subscribe(response => {
        this.isLoading = false;

        this.orders = (response.json());
        if (this.orders != null) {
          this.purchase_Order_ID = this.orders[0].purchase_Order_ID;
          this.changeOrder(this.supplier_ID, this.purchase_Order_ID);
        }
      });
    ////}
    ////  }

    ////});
  }
  //getItems  
  getItems() {
    this.isLoading =true;
    this.service.getItems()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
          ////this.item_Code = this.items[0].id;
          ////this.item_Name = this.items[0].text;

          ////this.isLoading =true;
          ////this.service.getUnitPrice(this.item_Code)
          ////  .subscribe(response => {
          ////    this.isLoading = false;
          ////    if (response.json() != null) {
          ////      this.unitPrices = (response.json());
          ////      this.unit_Price = this.unitPrices[0].unit_Price;
          ////      this.taxable = this.unitPrices[0].taxable;

          ////      if (this.taxable == true) {
          ////        this.Tax_Rate = this.taxRate;
          ////      }
          ////      else { this.Tax_Rate = 0; }
          ////    }
          ////  });
        }
      });
  }
  //changeItems
  changeItem(e: any) {


    if (this.mode == false)
      this.item_Code = e;
    else
      this.item_Code = e;


    this.isLoading =true;
    ////this.service.getUnitPrice(e.value)
    ////  .subscribe(response => {
    ////    this.isLoading = false;
    ////    if (response.json() != null) {
    ////      this.unitPrices = (response.json());
    ////      console.log(response.json());
    ////      this.item_Name = this.unitPrices[0].item_Name;
    ////      this.unit_Price = this.unitPrices[0].unit_Price;
    ////      this.stock_Qty = this.unitPrices[0].stock_Qty;
    ////      this.taxable = this.unitPrices[0].taxable;

    ////      if (this.taxable == true)
    ////        this.Tax_Rate = this.unitPrices[0].taxRate;
    ////      else this.Tax_Rate = 0;
    ////    }
    ////    $("#submitAdd").prop("disabled", false);

    ////  });
  }
  //////GRNList
  ////GRNList = [
  ////  { "grn_ID": 1, "grn": "PO" }
  ////  , { "grn_ID": 2, "grn": "Non PO" }
  ////]
  //clearFields
  clearFields() {
    this.order_Envoy = 1;
    this.supplier_ID = 1;
    ////this.SupplierID = 0;
    this.purchase_Order_ID = 0;
    this.Office_Code = 0;
    this.PRN_NO = 0;
    ////this.Supplier_ID = 1;
    ////this.contact_Person_ID = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.GoodsReceiveDetails = [];
    this.guid = UUID.UUID();
    this.grn_ID = 1;
    this.priviledged_Offices = 1;
    this.mode = false;
    this.btnmode = true;

    $("#alertWarning").hide();
    $("#ddlGRN").prop("disabled", false);
    $("#supplier_ID").prop("disabled", false);
    $("#purchase_Order_ID").prop("disabled", false);
  }
  //orderChange
  changeOrder(supplier_ID, purchase_Order_ID) {
    this.isLoading =true;
    this.service.getPendingOrderDetails(supplier_ID, purchase_Order_ID, this.good_Receive_ID, this.mode, this.beforeInvoice)
      .subscribe(response => {
        this.isLoading = false;
        if (this.supplier_ID == 0 && this.btnmode == true) {
          this.orders = [];
        }
        else {

          if (response.json() != null) {
            this.GoodsReceiveDetails = (response.json());
            $("#submitAdd").prop("disabled", false);
          }

        }
      });
  }
  //////changeSupp
  ////changeSupp(supplier_IDID) {
  ////  this.service.getContacts(supplier_IDID)
  ////    .subscribe(response => {
  ////      this.contacts = (response.json());
  ////      this.contact_ID = this.contacts[0].contact_ID;
  ////      //  console.log(response.json());
  ////    });
  ////}
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
    if (this.receive_Qty >= accept_Qty) {
      $("#submitAdd").prop("disabled", false);
      $("#submitUpdate").prop("disabled", false);
    } else {
      swal("Receive Qty. should be less then or equal to Order Qty.");
      $("#submitAdd").prop("disabled", true);
      $("#submitUpdate").prop("disabled", true);
    }
  }
  //getDetailsByID
  getDetailsByID(goods_Receive_ID, content) {
    this.mode = true;
    this.btnmode = false;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }

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
        this.service.getPriviledgedOffices(this.priviledged_Offices)
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
          ////this.service.IfExists(this.purchase_Order_ID)
          ////  .subscribe(response => {
          ////    this.status = (response.json());
          ////    if (this.status == true) {
          ////      $("#alertWarning").show();
          ////      $("#submitUpdate").prop("disabled", true);
          ////      $("#cancelBtn").prop("disabled", true);
          ////    }
          ////    else {
          ////      $("#alertWarning").hide();
          ////      $("#submitUpdate").prop("disabled", false);
          ////      $("#cancelBtn").prop("disabled", false);
          ////    }
          ////  });
        }
        this.changeGRN(this.grn_ID);

        this.changeOrder(this.supplier_ID, this.purchase_Order_ID)
        $("#ddlGRN").prop("disabled", true);
        $("#supplier_ID").prop("disabled", true);
        $("#purchase_Order_ID").prop("disabled", true);
        this.remarks = o.remarks;
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
  //////guidExist
  ////guidExist(guid: any) {
  ////  this.service.guidExist(guid)
  ////    .subscribe(response => {
  ////      this.guidOrder = (response.json());
  ////    });
  ////}
  //addGrid
  ////addGrid(item_Code: any, Item_Name: any, Unit_Price: any, receive_Qty: any) {
  ////  //if (this.stock_Qty != null && this.stock_Qty >= receive_Qty) {
  ////  if (Item_Name != null) {
  ////    if (receive_Qty > 0) {
  ////      var flag = false;
  ////      if (this.GoodsReceiveDetails.length > 0) {
  ////        for (var count = 0; count < this.GoodsReceiveDetails.length; count++) {
  ////          if (this.GoodsReceiveDetails[count].item_Code == item_Code) {
  ////            flag = true;
  ////            break;
  ////          }
  ////        }
  ////      }
  ////      if (flag == false) {
  ////        this.GoodsReceiveDetails.push(new GoodsReceiveDetail(0, item_Code, Item_Name, Unit_Price, receive_Qty, receive_Qty, 0, 0, this.stock_Qty));
  ////        console.log(this.GoodsReceiveDetails);
  ////        this.editMode = false;
  ////      } else {
  ////        swal("Already Exists");
  ////        return;
  ////      }
  ////    }
  ////    else {
  ////      swal("Qty is required. Qty not be zero and should be numeric");
  ////      return;
  ////    }
  ////  } else {
  ////    swal("Item is Required");
  ////    return;
  ////  }
  ////  //} else {
  ////  //  alert("Stock is not available." + this.stock_Qty + "");
  ////  //  $("#submitAdd").prop("disabled", true);
  ////  //}
  ////  $("#submitAdd").prop("disabled", false);
  ////  $("#txt").focus();
  ////  this.scrollToBottom();
  ////}
  //changeMode
  changeMode(idx: any, i: GoodsReceiveDetail, Mode: any) {
    ////var flag = false;
    ////if (this.GoodsReceiveDetails.length > 0) {
    ////  for (var count = 0; count < this.GoodsReceiveDetails.length; count++) {
    ////    if (this.GoodsReceiveDetails[count].item_Code == i.item_Code && idx != count) {
    ////      flag = true;
    ////      break;
    ////    }
    ////  }
    ////}
    ////if (Mode == 0) {
    ////  if (flag == false) {
    ////    if (i.receive_Qty > 0) {
    ////      i.edit_Mode = false;
    ////    } else {
    ////      swal("Quantity should be greater then 0");
    ////    }
    ////  } else {
    ////    swal("Already Exists");
    ////  }
    ////}
    ////else if (Mode == 2) {
    this.GoodsReceiveDetails.splice(idx, 1);



    ////}
    ////else {
    ////  console.log(i);
    ////  i.edit_Mode = true;
    }

  ////}
  ////updateItem  
  ////updateItem(i: GoodsReceiveDetail, e: any) {
  ////  this.item_Code = e;

  ////  ////this.service.getUnitPrice(this.item_Code)
  ////  ////  .subscribe(response => {
  ////  ////    this.unitPrices = (response.json());
  ////  ////    this.unit_Price = this.unitPrices[0].unit_Price;
  ////  ////    this.item_Code = this.unitPrices[0].item_Code;
  ////  ////    this.item_Name = this.unitPrices[0].item_Name;
  ////  ////    this.stock_Qty = this.unitPrices[0].stock_Qty;

  ////  ////    i.item_Code = this.item_Code;
  ////  ////    i.item_Name = this.item_Name;
  ////  ////    i.unit_Price = this.unit_Price;
  ////  ////    i.stock_Qty = this.stock_Qty;
  ////  ////  });
  ////}
  //cancelGRN
  cancelGRN() {
    ////this.service.cancelCheck(this.good_Receive_ID)
    ////  .subscribe(response => {
    ////    this.cancelStock = (response.json());
    ////    if (this.cancelStock != null) {
    ////      for (let i = 0; i < this.cancelStock.length; i++) {
    ////        if (this.cancelStock[i].quantity > this.cancelStock[i].stockQuantity) {
    ////          this.cancelStockStatus = true;
    ////          swal("Record is not cancelled since it is being used!");
    ////          break;
    ////        }
    ////      }
    ////    }
    ////    if (this.cancelStockStatus != true) {
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
              this.getGrid(this.Query);
              this.modalReference.close();
            });
        }
      });
    ////  }
    ////});

  }
  //saveOrder
  saveOrder(goods_Receive_ID: any, goods_Receive_DATE: any, supplier_ID, purchase_Order_ID: any,
    grn_ID: any, goods_Challan_NO: any, receive_Ack_DATE: any, receive_Ack_By: any, gR_NO: any, return_Ack_DATE: any, return_Ack_By: any, pR_NO: any, remarks: any, isAcknowledge: any, gRGUID: any, voucher_ID: any) {

    if (this.GoodsReceiveDetails.length > 0) {
      var goodsReceive = new GoodsReceive(this.goods_Receive_ID, this.goods_Receive_DATE.getDateFinal(), supplier_ID, purchase_Order_ID, this.grn_ID,
        goods_Challan_NO, this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "new", this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "newPR", remarks, true, this.guid, 0, 0, this.logedInUserID, this.UserSessionID,1,1,34,this.GoodsReceiveDetails);
      $("#submitAdd").prop("disabled", true);
      if (this.mode != 0) {
        this.Query=""
        this.GoodsReceiveDetails[0].flag = true;
      }
      this.service.saveOrder(goodsReceive).then(
        (response) => {
          this.getGrid(this.Query);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal('No Item Available!')
    }

  }
  //updateOrder
  updateOrder(goods_Receive_ID: any, goods_Receive_DATE: any, supplier_ID, purchase_Order_ID: any,
    grn_ID: any, goods_Challan_NO: any, receive_Ack_DATE: any, receive_Ack_By: any, gR_NO: any, return_Ack_DATE: any, return_Ack_By: any, pR_NO: any, remarks: any, isAcknowledge: any, gRGUID: any, voucher_ID: any) {

    this.goods_Receive_ID = this.id;
    var goodsReceive = new GoodsReceive(this.goods_Receive_ID, this.goods_Receive_DATE.getDateFinal(), supplier_ID, this.purchase_Order_ID, this.grn_ID,
      goods_Challan_NO, this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "new", this.goods_Receive_DATE.getDateFinal(), this.order_Envoy, "newPR", remarks, true, this.guid, 0, 0,this.logedInUserID, this.UserSessionID,1,1,34,this.GoodsReceiveDetails);
    if (this.mode != 0) {
      this.GoodsReceiveDetails[0].flag = true;
    }
    this.service.updateOrder(goodsReceive).then(
      (response) => {
        this.getGrid(this.Query);
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
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#cancelBtn").hide();
    this.stockField();
    this.invoiceBeforeGRN();
    this.clearFields();
    this.getPriviledgedOffices();
    this.getSuppliers(this.grn_ID);
    this.getItems();
    this.changeGRN(this.grn_ID);
    this.scrollToBottom();

  }
  //detailOpen modal
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
    $("#submitUpdate").show();
    $("#cancelBtn").show();
    this.stockField();
    this.invoiceBeforeGRN();
    this.GoodsReceiveDetails = [];
    //   this.clearFields();
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

