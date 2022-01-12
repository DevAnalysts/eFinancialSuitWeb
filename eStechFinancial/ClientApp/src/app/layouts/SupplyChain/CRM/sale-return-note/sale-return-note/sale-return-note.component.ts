import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleOrderService, SaleReturnNoteService, LoginService, DayEndService, customer, SaleReturnNote, SaleReturnNoteDetail, SaleReturnNoteDetails, SearchFilterService, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'app-sale-return-note',
  templateUrl: './sale-return-note.component.html',
  styleUrls: ['./sale-return-note.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SaleReturnNoteComponent implements OnInit, AfterViewChecked {
  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility: PermissionUtility = new PermissionUtility();
  ////////////////////////////////////////
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  order: any;
  status: any;
  orders: any[];
  users: any[];
  customers: Array<Select2OptionData> = [];
  contacts: any[];
  items: Array<Select2OptionData> = [];
  imeiDetail: Array<Select2OptionData> = [];
  unitPrices: any[];
  imeiDetailCheck: any[];
  customer: customer[];
  SaleReturnNoteDetails: any[];
  SaleReturnNoteDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  selectedCustomer: customer = new customer(0, 0, '');
  customerCategoryId: any = 2;
  editMode = false;
  index = 1;
  public return_Date = new cDate();
  public dayEndDate = new cDate();
  order_Envoy: any = 1;
  public customer_ID: any = 1;
  public customer_Name: any;
  customer_IDID: any;
  CustomerID: any = 0;
  ID: any = '';
  sale_Return_ID = 0;
  Office_Code: any;
  SRN_NO: any;
  Customer_ID: any = 1;
  contact_Person_ID: any;
  contact_ID: any;
  priviledged_Offices: any = '';
  remarks: any;
  public item_Code: any = 1;
  public item_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  guid: any;
  mode: any = 0;
  btnMode: any = 0;
  hideStock = true;
  sR_Detail_ID: any = 0;
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
  allowPriceList: boolean = false;
  editdisabled: any = '';
  removedisabled: any = '';
  DelayCheck: any = true;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  disabledIMEI: any = false;
  imeiLength: any = 15;

  imeiDetailID: any = 0;
  imei: any = "";
  showInvoice: any = false;
  imeiEnable: boolean = false;
  invoice: number = 0;
  check: any = false;
  txtimei: any = '';
  unit: any = 0;
  areaenable: any = 0;
  areashow: any = 'none';
  area: any[] = [];
  areacode: any = 0;
  areaname: any = '';
  unitList: any[] = [];
  unitList1: any[] = [];
  uoM: any = 0;
  looseStock_Qty: any = 0.00;
  abbr: any = '';
  stockQty: any = 0;
  actionID: any = 9;
  cancelReturn: any;

  constructor(private service: SaleReturnNoteService, private LoginService: LoginService, private DayEndService: DayEndService, private searchfilter: SearchFilterService, private modalService: NgbModal, private sOService: SaleOrderService) {
    this.SaleReturnNoteDetails = new Array<SaleReturnNoteDetails>();
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
    this.getAreaEnableStatus();
    this.orderDetails();
    // this.getAllIMEI();
    console.log(this.SaleReturnNoteDetails);
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(80021);

  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
    this.return_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    //});
  }
  //getAllIMEI
  getAllIMEI() {
    this.service.getAllIMEI(0, false)
      .subscribe(response => {
        if (response.json() != null) {
          this.imeiDetailCheck = (response.json());
        }
      });
  }
  //changeReturnDate
  changeReturnDate(pO_payment_DateDate) {
    this.setAreaEnableStatus();
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
          this.isLoading = true;
          this.order = (response.json());
        }
        else {
          this.isLoading = false;
          this.order = [];
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
              var timer = setTimeout(() => this.order_Envoy = this.users[i].order_Envoy, 500);
            }
            else { this.order_Envoy = this.users[0].order_Envoy; }
        }
        //  console.log(this.users);
      });
  }
  //getcustomers
  getCustomers() {
    if (this.check == false) {
      this.unitPrices = [];
      this.isLoading = true;
      this.service.getCustomers(this.userCurrentOffice, this.customer_ID, this.mode, this.areacode)
        .subscribe(response => {
          console.log('customer' + response.json());
          this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
          if (this.customers.length > 0) {
            this.customer_ID = 0;//this.customers[0].id;

            //getContacts
            this.service.getContacts(this.customer_ID)
              .subscribe(response => {
                if (response.json() != null) {
                  this.contacts = response.json();
                  this.contact_ID = this.contacts[0].contact_ID;
                  this.customerCategoryId = this.contacts[0].customerCategoryId;
                  if (this.customer_ID == 0 && this.btnMode == true) {
                    this.items = [];
                    this.imeiDetail = [];
                  }
                  else {
                    this.service.getItems(this.customer_ID, this.textboxInvoiceID, this.userCurrentOffice)
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
              });

            this.isLoading = false;
          }
          else {
            this.isLoading = false;
            $("#submitAdd").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
          }

        });
    }
  }
  //changeCustomer
  changeCustomer(e: any) {
    if (e > 0) {
      //   this.textboxInvoiceID = 0;
      // this.textboxInvoiceName = '';

      this.unitPrices = [];
      if (this.mode == false) {
        this.customer_ID = e;
        this.SaleReturnNoteDetails = [];
      }
      this.service.getContacts(this.customer_ID)
        .subscribe(response => {
          if (this.customer_ID == 0 && this.btnMode == true) {
            //this.items = [];
            this.imeiDetail = [];
            this.imei = '';
            this.contacts = [];
            this.sold_Qty = 0;
            this.stock_Qty = 0;
          }
          else {
            if (response.json() != null) {
              this.contacts = (response.json());
              this.contact_ID = this.contacts[0].contact_ID;
              if (this.mode == true) {
                this.textboxInvoiceName = '';
                this.textboxInvoiceID = 0;
                this.imei = '';
              }
              this.SearchInvoiceDropDown('', this.customer_ID);

              this.getItems(this.customer_ID)

              this.disabledIMEI = false;
            }
          }
        });

      if (this.mode != true) {
        $("#addnewrow").show();
        this.editdisabled = '';
        this.removedisabled = '';
      }
    }
  }
  //getItems  
  getItems(Customer_ID) {
    if (this.check == false) {
      if (this.customer_ID == 0 && this.btnMode == true) {
      }
      else {
        if (this.textboxInvoiceID != 0 && this.textboxInvoiceID != '') { this.disabledIMEI = true; }

        //  if (this.LoginService.getSession('AllowSaleReturnInvoice') == '0') {
        this.service.getItems(Customer_ID, this.textboxInvoiceID, this.userCurrentOffice)
          .subscribe(response => {
            this.items = this.getDropdownListItem(response.json(), "item_Code", "item_Name");
            if (this.items.length > 0) {
              this.item_Code = this.items[0].id;
              this.item_Name = this.items[0].text;

            }
          });
        //}
      }
    }
  }
  changeUnitID() {
    if (this.uoM > 100)
      this.stockQty = this.looseStock_Qty;
    else
      this.stockQty = this.stock_Qty;
    //this.changeItem(this.item_Code);
  }
  //changeItem
  changeItem(e: any) {

    if (e > 0) {
      this.unitPrices = [];
      this.abbr = '';
      this.isLoading = true;
      this.item_Code = e;
      this.getUnit(this.item_Code);
      this.getItemSold();
      this.changeItemStock(this.item_Code);
      this.service.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.unit)
        .subscribe(response => {
          this.unitPrices = (response.json());
          console.log(this.unitPrices);
          if (this.unitPrices != null) {
            this.item_Code = this.unitPrices[0].item_Code;
            this.item_Name = this.unitPrices[0].item_Name;
            this.unit_Price = this.unitPrices[0].unit_Price;

            this.stock_Qty = this.unitPrices[0].stock_Qty;
            this.looseStock_Qty = this.unitPrices[0].looseStock_Qty;
            if (this.unit > 100)
              this.stockQty = this.looseStock_Qty;
            else
              this.stockQty = this.stock_Qty;

            this.isLoading = false;
            $("#submitAdd").prop("disabled", false);
            this.imeiEnable = false;

            this.loadGrid();
          }
          else
            this.isLoading = false;

          this.DelayCheck = true;
          //  console.log(response.json());
        });
    } else {
      this.sold_Qty = 0;
      this.stock_Qty = 0;
    }
  }
  getUnit(mood) {
    if (mood == 0) {
      this.sOService.getUnits(mood).subscribe(response => {
        this.unitList1 = (response.json());

      });
    }
    else {
      this.sOService.getUnits(mood).subscribe(response => {
        this.unitList = (response.json());
        if (this.unitList != null) {
          this.unit = this.unitList[0].unitID;
          console.log(this.unitList);
        }
      });
    }
  }
  getUnitName(id) {
    return this.unitList1.filter(f => f.unitID == id)[0].unit;
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
              console.log(this.SaleReturnNoteDetails);
              if (ar != null) {
                console.log(this.SaleReturnNoteDetails.filter(f => f.imei != null));
                if (this.SaleReturnNoteDetails.filter(f => f.imei != null).length > 0) {
                  //edit_Mode


                  let imeicol = this.SaleReturnNoteDetails.filter(f => f.imei != null && f.edit_Mode == 0).map(x => x.imei);
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
  //updateItem  
  updateIMEI(i: SaleReturnNoteDetail, e: any) {
    if (e > 0) {
      var detail = this.imeiDetail.findIndex((obj => obj.id == e));
      i.imei = this.imeiDetail[detail].text;
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
  //changeIMEI
  changeIMEI(imei) {
    this.check = true;
    //  var arrary = this.imeiDetailCheck.filter(o => o.imei == imei);

    //  if (arrary.length == 0) {
    //   swal("Serial# / IMEI# does not exist in database");
    //  }
    // else {
    if (imei != '') {
      this.service.changeIMEI(imei)
        .subscribe(response => {
          var info = (response.json());
          console.clear();
          console.log(info);

          if (info != null) {
            this.customer_ID = info[0].customer_ID;
            this.textboxInvoiceID = info[0].sale_Invoice_ID;
            this.textboxInvoiceName = info[0].invoice_NO;
            this.item_Code = info[0].office_Code;

            this.service.getItemSold(this.customer_ID, this.item_Code, this.textboxInvoiceID, this.userCurrentOffice)
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
                    this.addGrid(this.item_Code, this.item_Name, this.Quantity, this.txtimei, this.uoM)
                  });
              });
          }
          else {
            swal("IMEI does not Exists.")
          }
        });
    }
    //  }
  }
  //changeItemStock
  changeItemStock(item_Code) {
    if (!this.mode) {
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
  }
  //getItemSold
  getItemSold() {
    if (!this.mode) {
      this.service.getItemSold(this.customer_ID, this.item_Code, this.textboxInvoiceID, this.userCurrentOffice)
        .subscribe(response => {
          var list = (response.json());
          console.log(list);
          if (list != null) {
            this.sold_Qty = list[0].sold_Qty;
            this.abbr = list[0].abbr;
            this.unit = list[0].unit_ID;
            this.uoM = list[0].unit_ID;
          }
          else
            this.sold_Qty = 0;
        });
    }

  }
  //showCreate
  showCreate() {
    this.mode = false;
    this.clearFields();
    $("#pnlAdd").show();
    $("#pnlDetail").hide();
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#customer_ID").prop("disabled", false);
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
    $("#customer_ID").prop("disabled", true);
    $("#ddlcontact").prop("disabled", true);
    this.getPriviledgedOffices();
    this.getCustomers();
    this.scrollToBottom();
    $("#submitAdd").prop("disabled", false);
  }
  //clearFields
  clearFields() {
    this.textboxInvoiceID = 0;
    this.textboxInvoiceName = '';
    this.order_Envoy = this.logedInUserID;
    this.customer_ID = 1;
    this.CustomerID = 0;
    this.sale_Return_ID = 0;
    this.Office_Code = 0;
    this.SRN_NO = 0;
    this.customer_ID = 1;
    this.contact_Person_ID = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.customers = [];
    this.contacts = [];
    this.searchGridInvoice = [];
    this.items = [];
    this.SaleReturnNoteDetails = [];
    this.stock_Qty = 0;
    this.sold_Qty = 0;
    this.imeiDetail = [];
    this.imei = '';
    this.priviledged_Offices = this.userPrivilegedOffice
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;
    this.disabledIMEI = false;
    this.setAreaEnableStatus();
    this.textboxInvoiceID = 0;
    this.textboxInvoiceName = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.getUnit(0);

    if (this.LoginService.getSession('AllowSaleReturnInvoice') == '1') {
      this.showInvoice = true;
      this.invoice = 1;
    }
    else {
      this.showInvoice = false;
      this.invoice = 0;
    }
    if (this.LoginService.getSession('EnableIMEI') == '1') {
      this.imeiEnable = true;

    }
    else {
      this.imeiEnable = false;
    }
  }
  //changeSupp
  changeSupp(customer_IDID) {
    this.service.getContacts(customer_IDID)
      .subscribe(response => {
        this.contacts = (response.json());
        this.contact_ID = this.contacts[0].contact_ID;
        //  console.log(response.json());
      });
  }
  //changeQuantity
  changeQuantity(Quantity) {
    if (Quantity < 0) {
      this.Quantity = 1;
    }
  }
  //changeQuantity
  changeQuantityEdit(i: SaleReturnNoteDetails, quantity) {
    if (quantity < 0) {
      i.quantity = 1;
    }
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
      this.getCustomers();

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
          this.getCustomers();
        }
      });
  }
  //getDetailsByID
  getDetailsByID(sale_Return_ID, content) {
    this.detailOpen(content);
    this.mode = true;
    this.btnMode = false;
    this.textboxInvoiceID = 0;
    this.IfExists(sale_Return_ID);
    this.service.getDetailsByID(sale_Return_ID)
      .subscribe((o: SaleReturnNote) => {
        this.sale_Return_ID = o.sale_Return_ID;
        this.return_Date.setDate(o.return_Date);
        this.order_Envoy = o.order_Envoy;
        this.customer_ID = o.customer_ID
        this.contact_Person_ID = o.contact_Person_ID;
        this.remarks = o.remarks;


        //getPriviledgedOffices
        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.users = (response.json());
            this.order_Envoy = o.order_Envoy;
          });
        //getCustomers
        this.service.getCustomers(this.userCurrentOffice, this.customer_ID, this.mode, this.areacode)
          .subscribe(response => {
            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            if (this.customers.length > 0) {
              this.SaleReturnNoteDetails = [];
              this.SaleReturnNoteDetails = o.saleReturnNoteDetails;
              //getContacts
              this.service.getContacts(this.customer_ID)
                .subscribe(response => {
                  this.contacts = response.json();
                  this.contact_ID = this.contacts[0].contact_ID;

                  if (o.sale_Invoice_ID != null)
                    this.SearchInvoiceByID(o.sale_Invoice_ID);

                  this.textboxInvoiceID = o.sale_Invoice_ID;
                  for (let i = 0; i < this.SaleReturnNoteDetails.length; i++) {
                    this.service.getUnitPrice(this.SaleReturnNoteDetails[i].item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.unit)
                      .subscribe(response => {
                        this.unitPrices = (response.json());
                        this.SaleReturnNoteDetails[i].stock_Qty = this.unitPrices[0].stock_Qty;


                        this.service.getItemSold(o.customer_ID, this.SaleReturnNoteDetails[i].item_Code, o.sale_Invoice_ID, this.userCurrentOffice)
                          .subscribe(response => {
                            var list = (response.json());
                            if (list != null)
                              this.SaleReturnNoteDetails[i].sold_Qty = list[0].sold_Qty;
                            else
                              this.SaleReturnNoteDetails[i].sold_Qty = 0;
                          });
                      });
                    this.service.getIMEI(this.SaleReturnNoteDetails[i].item_Code, o.sale_Invoice_ID)
                      .subscribe(response => {
                        var list = (response.json())
                        this.imei = list[0].imei;
                      });
                  }

                });
              //$("#submitAdd").prop("disabled", false);
              //$("#submitUpdate").prop("disabled", false);
            }
            else {
              $("#submitAdd").prop("disabled", true);
              $("#submitUpdate").prop("disabled", true);
            }
            // if (this.areaenable != 1) { }
            // else {
            //   this.areashow = '';

            //   this.service.getArea()
            //     .subscribe(response => {

            //       this.area = (response.json());
            //       if (customlist != null) {
            //         var cust = customlist.filter(item => item.customer_ID == this.customer_ID)[0];
            //         this.areacode = cust.areaID;
            //       }

            //     });
            // }
          });
      });
  }
  //IfExists
  IfExists(sale_Return_ID) {
    this.service.IfExists(sale_Return_ID)
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
          $("#addnewrow").show();
          this.editdisabled = '';
          this.removedisabled = '';
        }
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
  addGrid(item_Code: any, item_Name: any, Quantity: any, imei: any, uoM: any) {

    if (this.textboxInvoiceID != 0) {
      if (imei == '' && this.imeiEnable == true) {
        swal("Please Select IMEI");
        return;
      }
    }
    if (this.DelayCheck) {
      this.DelayCheck = false;
      if (this.sold_Qty >= Quantity) {
        //if (this.stock_Qty != null && this.stock_Qty >= Quantity) {
        if (item_Name != null) {
          if (Quantity > 0) {
            var flag = false;
            if (this.SaleReturnNoteDetails.length > 0) {
              for (var count = 0; count < this.SaleReturnNoteDetails.length; count++) {
                if (this.imeiEnable) {
                  if (this.SaleReturnNoteDetails[count].imei == imei) {
                    flag = true;
                    break;
                  }
                }
                else {
                  if (this.SaleReturnNoteDetails[count].item_Code == item_Code) {
                    flag = true;
                    break;
                  }
                }
              }
            }
            if (flag == false) {
              this.SaleReturnNoteDetails.push(new SaleReturnNoteDetail(0, 0, item_Code, item_Name, 0, Quantity, imei, 0, this.stock_Qty, this.sold_Qty, uoM, uoM, this.looseStock_Qty, this.abbr));
              this.editMode = false;
              this.item_Code = 0;
              this.stock_Qty = 0;
              this.sold_Qty = 0;
              this.imeiDetail = [];
              this.imei = '';
              this.txtimei = '';

              this.service.getItems(this.Customer_ID, this.textboxInvoiceID, this.userCurrentOffice)
                .subscribe(response => {
                  this.items = this.getDropdownListItem(response.json(), "item_Code", "item_Name");
                  if (this.items.length > 0) {
                    this.item_Code = this.items[0].id;
                    this.item_Name = this.items[0].text;

                  }
                });
              //this.items=[];

            } else {
              this.DelayCheck = true;
              swal("Already Exists");
              this.imei = '';
              return;
            }
          }
          else {
            this.DelayCheck = true;
            swal("Qty is required. Qty not be zero and should be numeric");
            return;
          }
        }
        else {
          this.DelayCheck = true;
          swal("Item is Required.");
          return;
        }
        //$("#submitAdd").prop("disabled", false);
        //}
        //else {

        //  $("#submitAdd").prop("disabled", true);
        //  swal("Stock is not available." + this.stock_Qty + "");
        //  return;
        //}
      }
      else {
        this.DelayCheck = true;
        swal('Return Quantity Could Not Be More Than Sold Quantity.')
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }

  }
  //changeMode
  changeMode(idx: any, i: SaleReturnNoteDetail, Mode: any) {

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

    //this.item_Code = this.SaleReturnNoteDetails[idx].item_Code;
    //this.changeItem(this.item_Code);
    var flag = false;
    if (this.SaleReturnNoteDetails.length > 0) {
      for (var count = 0; count < this.SaleReturnNoteDetails.length; count++) {
        if (this.SaleReturnNoteDetails[count].item_Code == i.item_Code && i.edit_Mode == 0 && idx != count) {
          flag = true;
          break;
        }
      }
    }
    if (Mode == 0) {
      if (this.sold_Qty >= i.quantity) {
        //if (this.stock_Qty != null && i.stock_Qty >= i.quantity) {
        if (flag == false) {
          if (i.quantity > 0) {
            i.edit_Mode = false;
            i.sold_Qty = this.sold_Qty;
            this.imeiDetail = [];
            this.sold_Qty = 0;
          } else {
            $("#submitAdd").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
            swal("Quantity should be greater then 0");
            return;
          }
        } else {
          swal("Already Exists");
          return;
        }
        $("#submitUpdate").prop("disabled", false);
        $("#submitAdd").prop("disabled", false);
        /* }
         else {
           $("#submitAdd").prop("disabled", true);
           $("#submitUpdate").prop("disabled", true);
 
           swal("Stock is not available." + this.stock_Qty + "");
           return;
         }*/
        this.item_Code = 0;
      }
      else {
        $("#addnewrow").hide();
        this.editdisabled = 'disabled';
        this.removedisabled = 'disabled';
        swal('Quantity Cannot Be Greater Than Sold Items')
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
      }

    }
    else if (Mode == 2) {
      this.SaleReturnNoteDetails.splice(idx, 1);
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
      //console.log(i);
      i.edit_Mode = true;
    }


  }
  //updateItem  
  updateItem(i: SaleReturnNoteDetail, e: any) {
    this.item_Code = e;
    this.service.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse, this.customer_ID, this.unit)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.stock_Qty = this.unitPrices[0].stock_Qty;
        this.looseStock_Qty = this.unitPrices[0].looseStock_Qty;

        i.item_Code = this.item_Code;
        i.item_Name = this.item_Name;
        i.unit_Price = this.unit_Price;
        i.stock_Qty = this.stock_Qty;
        i.looseStock_Qty = this.looseStock_Qty;

      });
  }
  //convert dropdown lables
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
          this.service.cancelOrder(this.sale_Return_ID, this.actionID)
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
  saveOrder(sale_Return_ID: any, Return_Date: any, Office_Code: any, PRN_NO: any,
    order_Envoy: any, customer_ID: any,
    contact_Person_ID: any, remarks: any, Cancel: any, mode: any, PRNGUID: any, Day_Id: any) {
    this.isLoading = true;
    this.service.guidExist(this.guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
        if (this.guidOrder == false) {
          if (this.SaleReturnNoteDetails.length > 0) {

            // alert(customer_ID);
            if (this.mode != 0) {
              this.SaleReturnNoteDetails[0].edit_Mode = true;
            }


            if (this.showInvoice == true) {
              this.invoice = 1;
              var saleReturnNote = new SaleReturnNote(sale_Return_ID, this.return_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, order_Envoy,
                customer_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, this.invoice, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.SaleReturnNoteDetails);
              if (this.textboxInvoiceID != 0) {
                this.service.saveOrder(saleReturnNote).then(
                  (response) => {
                    this.isLoading = false;
                    this.orderDetails();
                    this.modalReference.close();
                    //console.log(response);
                  },
                  (error) => console.log(error))
              }
              else {
                this.isLoading = false;
                swal("Invoice ID is Required.");
              }
            }
            else {
              this.invoice = 0;
              var saleReturnNote = new SaleReturnNote(sale_Return_ID, this.return_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, order_Envoy,
                customer_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, this.invoice, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.SaleReturnNoteDetails);
              this.service.saveOrder(saleReturnNote).then(
                (response) => {
                  this.isLoading = false;
                  this.orderDetails();
                  this.modalReference.close();
                  //console.log(response);
                },
                (error) => console.log(error))
            }
            this.hideGrid();
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
  updateOrder(sale_Return_ID: any, Return_Date: any, Office_Code: any, PRN_NO: any,
    order_Envoy: any, customer_ID: any,
    contact_Person_ID: any, remarks: any, Cancel: any, mode: any, PRNGUID: any, Day_Id: any) {
    if (this.SaleReturnNoteDetails.length > 0) {
      var purchaseReturnNote = new SaleReturnNote(sale_Return_ID, this.return_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, order_Envoy,
        customer_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, 1, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, this.SaleReturnNoteDetails);
      //  alert(customer_ID);
      if (this.mode != 0) {
        this.SaleReturnNoteDetails[0].edit_Mode = true;
      }
      this.service.updateOrder(purchaseReturnNote).then(
        (response) => {
          this.orderDetails();
          this.modalReference.close();
          //console.log(response);
        },
        (error) => console.log(error))
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

    if (sessionStorage.getItem('settingAllowPriceList') != "1")
      this.allowPriceList = false;
    else
      this.allowPriceList = true;

    this.clearFields();
    this.getPriviledgedOffices();
    this.getArea();
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
    if (sessionStorage.getItem('settingAllowPriceList') != "1")
      this.allowPriceList = false;
    else
      this.allowPriceList = true;
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    this.clearFields();
    this.stockField();
    this.getUnit(0);
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
      this.SearchInvoiceDropDown('', this.customer_ID);
    }
  }
  SearchInvoiceDropDown(Query, customer_ID) {
    //alert(customer_ID)
    if (customer_ID > 0) {

      this.searchGridInvoice = [];
      //console.log('Query', Query);
      this.isLoading = true;
      this.searchfilter.SearchSaleInvoiceDropDown(Query, customer_ID, this.userCurrentOffice)
        .subscribe(response => {
          this.searchGridInvoice = (response.json());
          if (this.searchGridInvoice != null) {
            console.log(this.searchGridInvoice);
            $('td.active').removeClass('active');
            var TRowID = "#CROW-1";


            var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
            //if (this.searchGridInvoiceTemp.length <= 0) {
            //  this.searchGridInvoiceTemp = this.searchGridInvoice;
            //  //alert(this.areacode);
            //}
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
    this.SaleReturnNoteDetails = [];
    this.textboxInvoiceID = ID;
    this.textboxInvoiceName = Name + " / " + ID;

    this.getItems(this.customer_ID);
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
    this.searchfilter.SearchSaleInvoiceByID(Query, this.customer_ID)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.textboxInvoiceID = List[0].id;
          this.textboxInvoiceName = List[0].name;
        }
        else {
          //this.textboxInvoiceID = 0;
          this.textboxInvoiceName = '';
        }
        this.isLoading = false;
      });

  }
}

