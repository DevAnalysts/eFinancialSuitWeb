import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateParserFormatter, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import * as $ from 'jquery';
import { Select2OptionData } from 'ng-select2';
import { animationFrameScheduler } from 'rxjs';
import swal from 'sweetalert';
import { cDate, DayEndService, LoginService, NgbDateFRParserFormatter, PermissionUtility, PurchaseReturnNote, PurchaseReturnNoteDetail, PurchaseReturnNoteDetailss, PurchaseReturnNoteService, SearchFilterService, Supplier } from '../../../../../shared';

@Component({
  selector: 'purchase-return-note',
  templateUrl: './purchase-return-note.component.html',
  styleUrls: ['./purchase-return-note.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class PurchaseReturnNoteComponent implements OnInit, AfterViewChecked {
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissonUtility: PermissionUtility = new PermissionUtility();
  ////////////////////////////////////////
  //Member Variables
  p: number = 1;
  modalReference: NgbModalRef;
  order: any[] = [];
  status: any;
  orders: any[] = [];
  users: any[] = [];
  suppliers: Array<Select2OptionData> = [];
  contacts: any[] = [];
  items: Array<Select2OptionData> = [];
  imeiDetail: Array<Select2OptionData> = [];
  unitPrices: any[] = [];
  supplier: Supplier[];
  PurchaseReturnNoteDetails: any[] = [];
  PurchaseReturnNoteDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  selectedSupplier: Supplier = new Supplier(0, 0, '');
  editMode = false;
  hideStock = false;
  index = 1;
  ID: any = '';
  public return_Date = new cDate();
  public dayEndDate = new cDate();
  order_Envoy: any = 1;
  public supplier_ID: any = 1;
  public supplier_Name: any;
  SupplierID: any = 0;
  purchase_Return_ID = 0;
  Office_Code: any;
  PRN_NO: any;
  Supplier_ID: any = 1;
  priviledged_Offices: any = '';
  contact_Person_ID: any;
  contact_ID: any;
  remarks: any;
  public item_Code: any;
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  guid: any;
  mode: any = 0;
  btnMode: any = 0;
  pR_Detail_ID: any = 0;
  unit_Price: any = 0;
  return_ID: any = "";
  foucs: any;
  isLoading: any = false;
  color = '#0094ff';
  stocks: any[];
  stock_Qty: any = 0;
  sold_Qty: any = 0;
  closeResult: string;
  alerts: Array<any> = [];
  dayEndDetail: any[] = [];
  guidOrder: boolean;
  editdisabled: any = '';
  removedisabled: any = '';
  DelayCheck: any = true;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  imeiDetailID: any = 0;
  imei: any = "";
  showInvoice: any = false;
  imeiEnable: boolean = false;
  invocie: number = 0;
  check: any = false;
  imeiLength: any = 15;
  imeiDisable: any = false;
  imeicheck: any = false;
  actionID: any = 8;
  cancelReturn: any;
  //End Member Variables

  constructor(private service: PurchaseReturnNoteService, private LoginService: LoginService, private searchfilter: SearchFilterService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.PurchaseReturnNoteDetails = new Array<PurchaseReturnNoteDetailss>();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
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
    this.orderDetails();
    this.permissonUtility.setPagePermissions(80020);
  }
  //getCurrentDay
  getCurrentDay() {
    this.return_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
  }
  //getAllIMEI
  getAllIMEI() {
    this.service.getAllIMEI(0, false)
      .subscribe(response => {
        if (response.json() != null) {
          this.imeiDetail = (response.json());
        }
      });
  }
  //changeReturnDate
  changeReturnDate(pO_payment_DateDate) {
    if (this.return_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.return_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //orderDetails 
  orderDetails() {
    this.isLoading = true;
    this.service.orderDetails(this.userPrivilegedOffice)
      .subscribe(response => {
        this.order = (response.json());
        this.isLoading = false;
        //  console.log(response.json());
      });
  }
  //searchOrderDetails
  searchOrderDetails(value: string) {
    this.service.searchOrderDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if (response.json() !== null) {
          this.order = (response.json());
        }
        else {
          this.order = [];
        }

      });
  }
  //IfExists
  IfExists(purchase_Return_ID) {  
    this.service.IfExists(purchase_Return_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
          this.editdisabled = 'disabled';
          this.removedisabled = 'disabled';
          $("#addnewrow").hide();        
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
        this.order_Envoy = this.users[0].order_Envoy;
        // console.log(this.users);
      });
  }
  //getSuppliers
  getSuppliers() {
    if (this.check == false) {
      this.isLoading = true;
      this.service.getSuppliers(this.userCurrentOffice, this.supplier_ID, this.mode)
        .subscribe(response => {
          this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
          if (this.suppliers.length > 0) {
            this.supplier_ID = 0;//this.suppliers[0].id;
            //getContacts
            this.service.getContacts(this.supplier_ID)
              .subscribe(response => {
                if (response.json() != null) {
                  this.contacts = response.json();
                  this.contact_ID = this.contacts[0].contact_ID;
                  if (this.supplier_ID == 0 && this.btnMode == true) {
                    this.items = [];
                    this.imeiDetail = [];
                  }
                  else {
                    this.service.getItems(this.supplier_ID, this.textboxInvoiceID)
                      .subscribe(response => {
                        this.items = this.getDropdownListItem(response.json(), "item_Code", "item_Name");
                        if (this.items != null) {
                          this.item_Code = this.items[0].id;
                          this.item_Name = this.items[0].text;
                          this.changeItemStock(this.item_Code);
                          $("#submitAdd").prop("disabled", false);
                        }
                      });
                  }
                }
                this.isLoading = false;
              });
          }
          else {
            $("#submitAdd").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
            this.isLoading = false;
          }

        });
    }
  }
  //innerIMEI
  innerIMEI(e: any) {

    if (this.items == []) {
      this.imeiDetail = [];
      this.sold_Qty = 0;
      this.stock_Qty = 0;
    }
    if (e > 0) {
      this.imeiDetailID = e;
      var detail = this.imeiDetail.findIndex((obj => obj.id == this.imeiDetailID));
      this.imei = this.imeiDetail[detail].text;
    }
  }
  //updateItem  
  updateIMEI(i: PurchaseReturnNoteDetail, e: any) {

    if (e > 0) {

      var detail = this.imeiDetail.findIndex((obj => obj.id == e));
      i.imei = this.imeiDetail[detail].text;
    }

  }
  //changeSupplier
  changeSupplier(e: any) {
    if (e > 0) {
      this.supplier_ID = e;
      this.service.getContacts(this.supplier_ID)
        .subscribe(response => {

          this.contacts = (response.json());
          if (this.contacts != null) {
            this.contact_ID = this.contacts[0].contact_ID;


            this.SearchInvoiceDropDown('', this.supplier_ID);
            this.getItems(this.supplier_ID);
          }
          //  console.log(response.json());
        });


      if (this.mode != true) {
        $("#addnewrow").show();
        this.editdisabled = '';
        this.removedisabled = '';
      }
    }
  }
  //getItems  
  getItems(Supplier_ID) {
    if (this.check == false) {
      this.isLoading = true
      if (this.textboxInvoiceID != 0 && this.textboxInvoiceID != '') { this.imeiDisable = true; }
      this.service.getItems(Supplier_ID, this.textboxInvoiceID)
        .subscribe(response => {
          this.items = this.getDropdownListItem(response.json(), "item_Code", "item_Name");
          if (this.items.length > 0) {
            if (this.items != null) {
              this.item_Code = this.items[0].id;
              this.item_Name = this.items[0].text;
              this.changeItemStock(this.item_Code);
              this.getItemSold();
              this.isLoading = false;
              $("#submitAdd").prop("disabled", false);
            }
            else
              this.isLoading = false;
          }
          else
            this.isLoading = false;
          //   console.log(response.json());
        });
    }
  }
  //changeItem
  changeItem(e: any) {
    if (e > 0) {
      this.item_Code = e;
      this.unitPrices = [];
      this.isLoading = true;
      this.getItemSold();
      //this.changeItemStock(this.item_Code);
      this.service.getUnitPrice(this.item_Code)
        .subscribe(response => {
          this.unitPrices = (response.json());
          if (this.unitPrices != null) {
            this.item_Name = this.unitPrices[0].item_Name;
            this.unit_Price = this.unitPrices[0].unit_Price;
            this.stock_Qty = this.unitPrices[0].stock_Qty;
            this.changeItemStock(this.item_Code);

            this.isLoading = false;
            $("#submitAdd").prop("disabled", false);
            this.imeiEnable = false;

            /* this.changeItemStock(this.item_Code);
            if (this.imeiEnable) {
              this.service.getIMEI(this.item_Code, this.textboxInvoiceID)
                .subscribe(response => {
                  this.imeiDetail = this.getDropdownListItems(response.json(), "imeiDetailID", "imei");
                  if (this.imeiDetail != null) {
                    this.imeiDetailID = this.imeiDetail[0].id;
                    this.imei = this.imeiDetail[0].text;
                  }
                });
            } */
            this.loadGrid();
          } else
            this.isLoading = false;

          this.DelayCheck = true;
        });
    }
  }
  //Load Grid
  loadGrid() {
    if (this.LoginService.getSession('EnableIMEI') == '1') {


      if (this.unitPrices[0].category_Code == 1 || this.unitPrices[0].category_Code == 2) {
        this.imeiEnable = true;


        if (this.textboxInvoiceID > 0) {
          this.service.getIMEI(this.item_Code, this.textboxInvoiceID)
            .subscribe(response => {
              let ar = this.getDropdownListItems(response.json(), "imeiDetailID", "imei");
              console.clear();
              console.log(this.PurchaseReturnNoteDetails);
              if (ar != null) {
                console.log(this.PurchaseReturnNoteDetails.filter(f => f.imei != null));
                if (this.PurchaseReturnNoteDetails.filter(f => f.imei != null).length > 0) {
                  //edit_Mode


                  let imeicol = this.PurchaseReturnNoteDetails.filter(f => f.imei != null && f.edit_Mode == 0).map(x => x.imei);
                  console.log(imeicol);

                  let ar2 = ar.filter(f => !imeicol.includes(f.text));
                  console.log(ar2);
                  if (ar2.length > 0) {

                    this.imeiDetail = ar2;
                  }
                } else {
                  this.imeiDetail = ar;

                }
                if (this.imeiDetail != null)
                  this.imeiDetailID = this.imeiDetail[0].id;
                // this.imei = this.imeiDetail[0].text;
              }
            });
        } else {
          swal("Please select invoice!");
        }
      } else {
        this.imeiEnable = false
      }
    }
  }
  //changeIMEI
  changeIMEI(imei) {
    //this.check = true;
    this.service.changeIMEI(imei)
      .subscribe(response => {
        var info = (response.json());
        if (info != null) {

          this.textboxInvoiceID = info[0].purchase_Invoice_ID;
          this.textboxInvoiceName = info[0].invoice_NO;
          this.supplier_ID = info[0].supplier_ID;
          this.item_Code = info[0].office_Code;

          this.service.getItemSold(this.supplier_ID, this.item_Code, this.textboxInvoiceID, this.userCurrentOffice)
            .subscribe(response => {
              var list = (response.json());
              if (list != null) {
                this.sold_Qty = list[0].sold_Qty;
              }
              else this.sold_Qty = 0;

              this.service.getStocks(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
                .subscribe(response => {
                  this.stocks = (response.json());
                  if (this.stocks != null) {
                    this.stock_Qty = this.stocks[0].stock_Qty;
                  }
                  else this.stock_Qty = 0;
                  this.addGrid(this.item_Code, this.item_Name, this.Quantity, imei)
                });
            });
        }
        else {
          swal("IMEI does not Exists.")
        }
      });

  }
  //getItemSold
  getItemSold() {

    this.service.getItemSold(this.supplier_ID, this.item_Code, this.textboxInvoiceID, this.userCurrentOffice)
      .subscribe(response => {
        var list = (response.json());
        if (list != null) {
          this.sold_Qty = list[0].sold_Qty;
        }
        else this.sold_Qty = 0;
      });
  }
  //showCreate
  showCreate() {
    this.mode = false;
    this.clearFields();
    $("#pnlAdd").show();
    $("#pnlDetail").hide();
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#supplier_ID").prop("disabled", false);
    $("#ddlcontact").prop("disabled", false);
  }
  //hideGrid
  hideGrid() {
    // this.ngOnInit();
    this.mode = true;
    $("#pnlAdd").hide();
    $("#pnlDetail").show();
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#submitAdd").prop("disabled", false);
  }
  //editMode
  edit() {
    this.mode = true;
    $("#pnlAdd").show();
    $("#pnlDetail").hide();
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#submitAdd").prop("disabled", false);
    $("#supplier_ID").prop("disabled", true);
    $("#ddlcontact").prop("disabled", true);
    this.getPriviledgedOffices();
    this.getSuppliers();
    this.scrollToBottom();
  }
  //clearFields
  clearFields() {
    this.textboxInvoiceID = 0;
    this.textboxInvoiceName = '';
    this.order_Envoy = 1;
    this.supplier_ID = 1;
    this.SupplierID = 0;
    this.purchase_Return_ID = 0;
    this.Office_Code = 0;
    this.PRN_NO = 0;
    this.Supplier_ID = 1;
    this.contact_Person_ID = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.stock_Qty = 0;
    this.PurchaseReturnNoteDetails = [];
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.mode = false;
    this.btnMode = true;


    if (this.LoginService.getSession('AllowPurchaseReturnInvoice') == '1') {
      this.showInvoice = true;
      this.invocie = 1;
    }
    else {
      this.showInvoice = false;
      this.invocie = 0;
    }

    if (this.LoginService.getSession('EnableIMEI') == '1') {
      this.imeiEnable = true;
    }
    else {
      this.imeiEnable = false;
    }
  }
  //changeItemStock
  changeItemStock(item_Code) {
    this.item_Code = item_Code
    this.service.getStocks(item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.stocks = (response.json());
        if (this.stocks != null) {
          this.stock_Qty = this.stocks[0].stock_Qty;
        }
        else this.stock_Qty = 0;
        // console.log(response.json());
      });
  }
  //changeQuantity
  changeQuantity(Quantity) {
    if (Quantity <= 0) {
      this.Quantity = 1;
    }
  }
  //changeQuantity
  changeQuantityEdit(i: PurchaseReturnNoteDetailss, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
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
  //getDropdownListItem
  getDropdownListItem(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    ar.push({
      id: 0,
      text: ''
    });
    if (arr != null) {
      arr.forEach(
        function (obj) {
          ar.push({
            id: obj[valuetxt],
            text: obj[valuetxt] + " : " + obj[displaytxt]
          });

        });
    }
    return ar;
  }
  //getDropdownListItem
  getDropdownListItems(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    ar.push({
      id: 0,
      text: ''
    });
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
  //getDetailsByID
  getDetailsByID(purchase_Return_ID, content) {
    this.detailOpen(content);
    //this.edit();
    this.mode = true;
    this.btnMode = false;
    this.IfExists(purchase_Return_ID);
    this.service.getDetailsByID(purchase_Return_ID)
      .subscribe((o: PurchaseReturnNote) => {
        this.purchase_Return_ID = o.purchase_Return_ID;
        this.return_Date.setDate(o.return_Date);
        this.order_Envoy = o.order_Envoy;
        this.contact_Person_ID = o.contact_Person_ID;
        this.supplier_ID = o.supplier_ID;
        this.remarks = o.remarks;

        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.users = (response.json());
            this.order_Envoy = o.order_Envoy;
            //  console.log(this.users);
          });


        this.service.getSuppliers(this.priviledged_Offices, this.supplier_ID, this.mode)
          .subscribe(response => {
            this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
            if (this.suppliers.length > 0) {
              this.PurchaseReturnNoteDetails = o.purchaseReturnNoteDetailss;
              //getContacts
              this.service.getContacts(this.supplier_ID)
                .subscribe(response => {
                  this.contacts = response.json();
                  this.contact_ID = this.contacts[0].contact_ID;

                  if (o.purchase_Invoice_ID != null)
                    this.SearchInvoiceByID(o.purchase_Invoice_ID);

                  this.textboxInvoiceID = o.purchase_Invoice_ID;

                  for (let i = 0; i < this.PurchaseReturnNoteDetails.length; i++) {
                    this.service.getUnitPrice(this.PurchaseReturnNoteDetails[i].item_Code)
                      .subscribe(response => {
                        this.unitPrices = (response.json());
                        this.PurchaseReturnNoteDetails[i].stock_Qty = this.unitPrices[0].stock_Qty;


                        this.service.getStocks(this.PurchaseReturnNoteDetails[i].item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
                          .subscribe(response => {
                            this.stocks = (response.json());
                            if (this.stocks != null) {
                              this.PurchaseReturnNoteDetails[i].stock_Qty = this.stocks[0].stock_Qty;
                            }

                          });

                        this.service.getItemSold(o.supplier_ID, this.PurchaseReturnNoteDetails[i].item_Code, o.purchase_Invoice_ID, this.userCurrentOffice)
                          .subscribe(response => {
                            var list = (response.json());
                            if (list != null) {
                              this.PurchaseReturnNoteDetails[i].sold_Qty = list[0].sold_Qty;
                            }
                            else this.sold_Qty = 0;

                          });
                      });
                  }

                });
              $("#submitAdd").prop("disabled", false);
              $("#submitUpdate").prop("disabled", false);
            }
            else {
              $("#submitAdd").prop("disabled", true);
              $("#submitUpdate").prop("disabled", true);
            }
          });

      });
  }
  //IfExists
  guidExist(guid: any) {
    this.service.guidExist(guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
      });
  }
  //addGrid
  addGrid(item_Code: any, Item_Name: any, Quantity: any, imei: any) {
    if (this.DelayCheck) {
      this.DelayCheck = false;
      if (this.sold_Qty >= Quantity) {
        if (this.stock_Qty != null && this.stock_Qty >= Quantity) {
          if (Item_Name != null) {
            if (Quantity > 0) {
              var flag = false;
              if (this.PurchaseReturnNoteDetails.length > 0) {
                for (var count = 0; count < this.PurchaseReturnNoteDetails.length; count++) {
                  if (this.imeiEnable) {
                    if (this.PurchaseReturnNoteDetails[count].imei == imei) {
                      flag = true;
                      break;
                    }
                  }

                  else {
                    if (this.PurchaseReturnNoteDetails[count].item_Code == item_Code) {
                      flag = true;
                      break;
                    }
                  }

                }
              }
              if (flag == false) {
                if (imei == null || imei == '') {

                  this.service.checkIMEI(item_Code)
                    .subscribe(response => {
                      this.imeicheck = (response.json());
                      if (this.imeicheck == true) {
                        this.DelayCheck = true;
                        swal("Enter imei");
                        return;
                      }
                      else {
                        this.PurchaseReturnNoteDetails.push(new PurchaseReturnNoteDetail(0, 0, item_Code, Item_Name, 0, Quantity, imei, 0, this.stock_Qty, this.sold_Qty));
                        this.editMode = false;
                        this.item_Code = 0;
                        this.stock_Qty = 0;
                        this.sold_Qty = 0;
                        this.imei = '';

                      }
                    })
                }
                else {
                  this.PurchaseReturnNoteDetails.push(new PurchaseReturnNoteDetail(0, 0, item_Code, Item_Name, 0, Quantity, imei, 0, this.stock_Qty, this.sold_Qty));
                  this.editMode = false;
                  this.item_Code = 0;
                  this.stock_Qty = 0;
                  this.sold_Qty = 0;
                  this.imeiDetail = [];
                  this.imei = '';
                  this.imeiDisable = false;
                }

              } else {
                this.DelayCheck = true;
                swal("Already Exists");
                return;
              }
            }
            else {
              this.DelayCheck = true;
              swal("Qty is required.Qty not be zero and should be numeric");
              return;
            }
          } else {
            this.DelayCheck = true;
            swal("Item is Required");
            return;
          }
          $("#submitAdd").prop("disabled", false);
        } else {
          $("#submitAdd").prop("disabled", true);
          swal("Stock is not available." + this.stock_Qty + "");
          return;
        }
      }
      else {
        this.DelayCheck = true;
        swal('Return Quantity Could Not Be More Than Purchased Quantity.')
        return;
      }

      $("#txt").focus();
      this.scrollToBottom();
    }
  }
  //changeMode
  changeMode(idx: any, i: PurchaseReturnNoteDetail, Mode: any) {

    this.DelayCheck = true;
    if (Mode == 1) {
      $("#addnewrow").hide();
      this.mode = false;
      this.editdisabled = 'disabled';
      this.removedisabled = 'disabled';

    }
    else {
      $("#addnewrow").show();
      this.mode = true;
      this.editdisabled = '';
      this.removedisabled = '';
    }

    this.item_Code = this.PurchaseReturnNoteDetails[0].item_Code;
    this.changeItemStock(this.item_Code);
    var flag = false;
    if (this.PurchaseReturnNoteDetails.length > 0) {


      for (var count = 0; count < this.PurchaseReturnNoteDetails.length; count++) {
        if (this.PurchaseReturnNoteDetails[count].item_Code == i.item_Code && i.edit_Mode == 0 && idx != count) {
          flag = true;
          break;
        }
      }
    }
    if (Mode == 0) {
      if (i.sold_Qty >= i.quantity) {
        if (this.stock_Qty != null && this.stock_Qty >= i.quantity) {
          if (flag == false) {
            if (i.quantity > 0) {
              i.edit_Mode = false;
              this.item_Code = 0;
              this.imeiDetail = [];
              this.sold_Qty = 0;
              this.stock_Qty = 0;
            } else {
              swal("Quantity should be greater then 0");
              return;
            }
          } else {
            swal("Already Exists");
            return;
          }
          $("#submitAdd").prop("disabled", false);
          $("#submitUpdate").prop("disabled", false);
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
          swal("Stock is not available." + this.stock_Qty + "");
          return;
        }
      }
      else {
        $("#addnewrow").hide();
        swal('Return Quantity Could Not Be More Than Purchased Quantity.')
        $("#submitUpdate").prop("disabled", true);
        return;
      }
    }
    else if (Mode == 2) {
      this.PurchaseReturnNoteDetails.splice(idx, 1);
      this.item_Code = 0;
      this.imeiDetail = [];
      this.sold_Qty = 0;
      this.stock_Qty = 0;
      this.mode = false;
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
  //updateItem
  updateItem(i: PurchaseReturnNoteDetail, e: any) {
    this.item_Code = e;
    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.stock_Qty = this.unitPrices[0].stock_Qty;
        i.item_Code = this.item_Code;
        i.item_Name = this.item_Name;
        i.unit_Price = this.unit_Price;
        i.stock_Qty = this.stock_Qty;
      });
  }
  //cancelOrder
  cancelOrder() {
    swal({
      title: "Do you really want to cancel?",
      text: "Once cancelled, you will not be able to recover this note!",
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
          this.service.cancelOrder(this.purchase_Return_ID, this.actionID)
            .subscribe(response => {
              swal("Poof! Your note has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              this.orderDetails();
              this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  //saveOrder
  saveOrder(purchase_Return_ID: any, Return_Date: any, Office_Code: any, PRN_NO: any,
    order_Envoy: any, supplier_ID: any,
    contact_Person_ID: any, remarks: any, Cancel: any, mode: any, PRNGUID: any, Day_Id: any) {
    this.isLoading = true;
    console.log(this.return_Date.getDateFinal());
    this.service.guidExist(this.guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
        if (this.guidOrder == false) {
          if (this.PurchaseReturnNoteDetails.length > 0) {

            if (this.showInvoice == true) {
              this.invocie = 1;
              if (this.textboxInvoiceID != 0) {
                var purchaseReturnNote = new PurchaseReturnNote(purchase_Return_ID, this.return_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, this.logedInUserID,
                  supplier_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, this.invocie, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.PurchaseReturnNoteDetails);
                if (this.mode != 0) {
                  this.PurchaseReturnNoteDetails[0].edit_Mode = true;
                }
                console.log(purchaseReturnNote);
                this.service.saveOrder(purchaseReturnNote).then(
                  (response) => {
                    this.orderDetails();
                    this.isLoading = false;
                    this.modalReference.close();
                    console.log(response);
                    this.contacts = [];
                    this.searchGridInvoice = [];
                  },
                  (error) => console.log(error))
              }
              else {
                this.isLoading = false;
                swal("Invoice ID is Required.");
              }
            }
            else {
              this.invocie = 0;
              var purchaseReturnNote = new PurchaseReturnNote(purchase_Return_ID, this.return_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, this.logedInUserID,
                supplier_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, this.invocie, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.PurchaseReturnNoteDetails);
              if (this.mode != 0) {
                this.PurchaseReturnNoteDetails[0].edit_Mode = true;
              }
              console.log(purchaseReturnNote);
              this.service.saveOrder(purchaseReturnNote).then(
                (response) => {
                  this.orderDetails();
                  this.isLoading = false;
                  this.modalReference.close();
                  console.log(response);
                  this.searchGridInvoice = [];
                },
                (error) => console.log(error))
            }
          }
          else {
            this.isLoading = false;
            swal("Item is Required.");
          }
        }
        else {
          this.isLoading = false;
          swal("Error: Already exists.");
        }
      });

  }
  //updateOrder
  updateOrder(purchase_Return_ID: any, Return_Date: any, Office_Code: any, PRN_NO: any,
    order_Envoy: any, supplier_ID: any,
    contact_Person_ID: any, remarks: any, Cancel: any, mode: any, PRNGUID: any, Day_Id: any) {
    if (this.PurchaseReturnNoteDetails.length > 0) {
      var purchaseReturnNote = new PurchaseReturnNote(purchase_Return_ID, this.return_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, this.logedInUserID,
        supplier_ID, this.textboxInvoiceID, contact_Person_ID, remarks, true, this.guid, 1, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.PurchaseReturnNoteDetails);
      if (this.mode != 0) {
        this.PurchaseReturnNoteDetails[0].edit_Mode = true;
      }
      this.service.updateOrder(purchaseReturnNote).then(
        (response) => {
          this.orderDetails();
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
      this.hideGrid();
    }
    else {
      swal("Item is Required.");
    }
    //}
    //else
    //{ alert("- Error: Already exists."); }
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
    this.getPriviledgedOffices();
    this.getSuppliers();
    //this.getItems(this.supplier_ID);
    this.scrollToBottom();
    this.stockField();
  }
  // detailOpen
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
    this.stockField();
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
  // end of modal.

  sessionEnableTextboxInvoice = 0;
  textboxInvoiceID: any = 0;
  textboxInvoiceName: any = '';
  textboxInvoiceSearch: any = '';
  searchGridInvoice: any[] = [];
  //searchGridInvoiceTemp: any[] = [];



  enableInvoiceDropDown(AreaID) {
    if (this.LoginService.getSession('EnableInvoiceSearchDropDown') != '1') {
      $("#DropDownInvoiceSearch").hide();
      this.sessionEnableTextboxInvoice = 0;

    }
    else {
      this.sessionEnableTextboxInvoice = 1;
      this.SearchInvoiceDropDown('', this.supplier_ID);
    }
  }
  SearchInvoiceDropDown(Query, supplier_ID) {
    //alert(customer_ID)
    if (supplier_ID > 0) {

      this.searchGridInvoice = [];
      //console.log('Query', Query);
      this.isLoading = true;
      this.searchfilter.SearchPurchaseInvoiceDropDown(Query, supplier_ID, this.userCurrentOffice)
        .subscribe(response => {
          this.searchGridInvoice = (response.json());
          if (this.searchGridInvoice != null) {
            $('td.active').removeClass('active');
            var TRowID = "#CROW-1";
            var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);

          }
          this.isLoading = false;
        });
    }

  }
  setInvoiceSearchFocus() {
    var timer = setTimeout(() => $("#textboxInvoiceSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#CROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedInvoice(ID, Name) {
    this.PurchaseReturnNoteDetails = [];
    this.textboxInvoiceID = ID;
    this.textboxInvoiceName = Name + " / " + ID;
    this.getItems(this.supplier_ID);
    this.textboxInvoiceSearch = '';

    this.service.getIMEI(this.item_Code, this.textboxInvoiceID)
      .subscribe(response => {
        this.imeiDetail = this.getDropdownListItems(response.json(), "imeiDetailID", "imei");
        if (this.imeiDetail != null) {
          this.imeiDetailID = this.imeiDetail[0].id;
          this.imei = this.imeiDetail[0].text;
        }
      });

  }
  SearchInvoiceByID(Query) {
    this.textboxInvoiceSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchPurchaseInvoiceByID(Query, this.supplier_ID)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.textboxInvoiceName = List[0].name;
        }
        else {
          this.textboxInvoiceName = '';
        }
        this.isLoading = false;
      });
  }
}
