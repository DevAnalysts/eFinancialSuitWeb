import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleReplacementService, LoginService, DayEndService, customer, SaleReplacement, SaleReplacementDetail, SaleReplacementDetails, SearchFilterService, cDate, NgbDateFRParserFormatter } from '../../../../../shared';
import swal from 'sweetalert';


@Component({
  selector: 'app-sale-replacement',
  templateUrl: './sale-replacement.component.html',
  styleUrls: ['./sale-replacement.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SaleReplacementComponent implements OnInit, AfterViewChecked {
  ////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
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
  unitPrices: any[];
  customer: customer[];
  SaleReplacementDetails: any[];
  SaleReplacementDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  selectedCustomer: customer = new customer(0, 0, '');
  customerCategoryId: any = 2;
  editMode = false;
  index = 1;
  public replacement_Date = new cDate();
  public dayEndDate = new cDate();
  order_Envoy: any = 1;
  public customer_ID: any = 1;
  public customer_Name: any;
  customer_IDID: any;
  CustomerID: any = 0;
  ID: any = '';
  sale_Replacement_ID = 0;
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

  constructor(private service: SaleReplacementService, private LoginService: LoginService, private DayEndService: DayEndService, private searchfilter: SearchFilterService, private modalService: NgbModal) {
    this.SaleReplacementDetails = new Array<SaleReplacementDetails>();
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
    this.orderDetails();
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 809130) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;

          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].userSessionID;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getCurrentDay
  getCurrentDay() {
    this.replacement_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));   
  }
  //changeReplacementDate
  changeReplacementDate(pO_payment_DateDate) {
    if (this.replacement_Date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.replacement_Date.setDate(this.dayEndDate.getDateFinal());
  }
  //orderDetails 
  orderDetails() {
    this.isLoading =true;
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
        this.order = (response.json());
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
    this.unitPrices = [];
    this.isLoading =true;
    this.service.getCustomers(this.userCurrentOffice, this.customer_ID, this.mode)
      .subscribe(response => {
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
  //changeCustomer
  changeCustomer(e: any) {
    this.textboxInvoiceID = 0;
    this.textboxInvoiceName = '';

    this.unitPrices = [];
    if (this.mode == false) {
      this.customer_ID = e;
      this.SaleReplacementDetails = [];
    }
    this.service.getContacts(this.customer_ID)
      .subscribe(response => {
        if (this.customer_ID == 0 && this.btnMode == true) {
          this.items = [];
          this.contacts = [];
          this.sold_Qty = 0;
          this.stock_Qty = 0;
        }
        else {
          if (response.json() != null) {
            this.contacts = (response.json());
            this.contact_ID = this.contacts[0].contact_ID;
            this.SearchInvoiceDropDown('', this.customer_ID);
            this.getItems(this.customer_ID)
          }
        }
      });

    if (this.mode != true) {
      $("#addnewrow").show();
      this.editdisabled = '';
      this.removedisabled = '';
    }
  }
  //getItems  
  getItems(Customer_ID) {
    if (this.customer_ID == 0 && this.btnMode == true) {
    }
    else {
      this.service.getItems(Customer_ID, this.textboxInvoiceID, this.userCurrentOffice)
        .subscribe(response => {
          this.items = this.getDropdownListItem(response.json(), "item_Code", "item_Name");
          if (this.items.length > 0) {
            this.item_Code = this.items[0].id;
            this.item_Name = this.items[0].text;
          }
        });
    }
  }
  //changeItem
  changeItem(e: any) {
    this.unitPrices = [];
    this.isLoading =true;
    this.item_Code = e;
    this.getItemSold();
    this.changeItemStock(this.item_Code);
    this.service.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.unitPrices = (response.json());
        if (this.unitPrices != null) {
          this.item_Code = this.unitPrices[0].item_Code;
          this.item_Name = this.unitPrices[0].item_Name;
          this.unit_Price = this.unitPrices[0].unit_Price;
          this.stock_Qty = this.unitPrices[0].stock_Qty;

          this.isLoading = false;
          $("#submitAdd").prop("disabled", false);
        }
        else
          this.isLoading = false;

        this.DelayCheck = true;
        //  console.log(response.json());
      });
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
          if (list != null)
            this.sold_Qty = list[0].sold_Qty;
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
    this.sale_Replacement_ID = 0;
    this.Office_Code = 0;
    this.SRN_NO = 0;
    this.customer_ID = 1;
    this.contact_Person_ID = 0;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 1;
    this.customers = [];
    this.items = [];
    this.SaleReplacementDetails = [];
    this.priviledged_Offices = this.userPrivilegedOffice
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;
    this.textboxInvoiceID = 0;
    this.textboxInvoiceName = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);

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
  changeQuantityEdit(i: SaleReplacementDetails, quantity) {
    if (quantity < 0) {
      i.quantity = 1;
    }
  }
  //getDetailsByID
  getDetailsByID(sale_Replacement_ID, content) {
    this.detailOpen(content);
    this.mode = true;
    this.btnMode = false;
    this.textboxInvoiceID = 0;
    this.service.getDetailsByID(sale_Replacement_ID)
      .subscribe((o: SaleReplacement) => {
        this.sale_Replacement_ID = o.sale_Replacement_ID;
        this.replacement_Date.setDate(o.replacement_Date);
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
        this.service.getCustomers(this.userCurrentOffice, this.customer_ID, this.mode)
          .subscribe(response => {
            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
            if (this.customers.length > 0) {
              this.SaleReplacementDetails = o.saleReplacementDetails;
              //getContacts
              this.service.getContacts(this.customer_ID)
                .subscribe(response => {
                  this.contacts = response.json();
                  this.contact_ID = this.contacts[0].contact_ID;

                  if (o.sale_Invoice_ID != null)
                    this.SearchInvoiceByID(o.sale_Invoice_ID);

                  this.textboxInvoiceID = o.sale_Invoice_ID;
                  for (let i = 0; i < this.SaleReplacementDetails.length; i++) {
                    this.service.getUnitPrice(this.SaleReplacementDetails[i].item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse)
                      .subscribe(response => {
                        this.unitPrices = (response.json());
                        this.SaleReplacementDetails[i].stock_Qty = this.unitPrices[0].stock_Qty;


                        this.service.getItemSold(o.customer_ID, this.SaleReplacementDetails[i].item_Code, o.sale_Invoice_ID, this.userCurrentOffice)
                          .subscribe(response => {
                            var list = (response.json());
                            if (list != null)
                              this.SaleReplacementDetails[i].sold_Qty = list[0].sold_Qty;
                            else
                              this.SaleReplacementDetails[i].sold_Qty = 0;
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
  IfExists(sale_Replacement_ID) {
    this.service.IfExists(sale_Replacement_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
          this.editdisabled = 'disabled';
          this.removedisabled = 'disabled';
          $("#addnewrow").hide();
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
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
  addGrid(item_Code: any, item_Name: any, Quantity: any) {

    if (this.DelayCheck) {
      this.DelayCheck = false;
      if (this.sold_Qty >= Quantity) {      
        if (item_Name != null) {
          if (Quantity > 0) {
            var flag = false;
            if (this.SaleReplacementDetails.length > 0) {
              for (var count = 0; count < this.SaleReplacementDetails.length; count++) {
                if (this.SaleReplacementDetails[count].item_Code == item_Code) {
                  flag = true;
                  break;
                }
              }
            }
            if (flag == false) {
              this.SaleReplacementDetails.push(new SaleReplacementDetail(0, 0, item_Code, item_Name, 0, Quantity, 0, this.stock_Qty, this.sold_Qty));
              this.editMode = false;
              this.item_Code = 0;
            } else {
              swal("Already Exists");
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
      }
      else {
        this.DelayCheck = true;
        swal('Replacement Quantity Could Not Be More Than Sold Quantity.')
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }

  }
  //changeMode
  changeMode(idx: any, i: SaleReplacementDetail, Mode: any) {
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
    var flag = false;
    if (this.SaleReplacementDetails.length > 0) {
      for (var count = 0; count < this.SaleReplacementDetails.length; count++) {
        if (this.SaleReplacementDetails[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }
    if (Mode == 0) {
      if (this.sold_Qty >= i.quantity) {
        if (this.stock_Qty != null && i.stock_Qty >= i.quantity) {
          if (flag == false) {
            if (i.quantity > 0) {
              i.edit_Mode = false;
              i.sold_Qty = this.sold_Qty;
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
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);

          swal("Stock is not available." + this.stock_Qty + "");
          return;
        }
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
      this.SaleReplacementDetails.splice(idx, 1);
    }
    else {
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.item_Code) {
          this.item_Code = this.items[j].id;
          break;
        }
      }      
      i.edit_Mode = true;
    }
  }
  //updateItem  
  updateItem(i: SaleReplacementDetail, e: any) {
    this.item_Code = e;
    this.service.getUnitPrice(this.item_Code, this.customerCategoryId, this.allowPriceList, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.unitPrices = (response.json());
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
  //saveOrder
  saveOrder(sale_Replacement_ID: any, Replacement_Date: any, Office_Code: any, PR_NO: any,
    order_Envoy: any, customer_ID: any,
    contact_Person_ID: any, remarks: any, Cancel: any, mode: any, PRNGUID: any, Day_Id: any) {
    this.isLoading =true;
    this.service.guidExist(this.guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
        if (this.guidOrder == false) {
          if (this.SaleReplacementDetails.length > 0) {
            var saleReplacement = new SaleReplacement(sale_Replacement_ID, this.replacement_Date.getDateFinal(), this.userCurrentOffice, PR_NO, order_Envoy,
              customer_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, 1, this.logedInUserID, this.UserSessionID,this.userCurrentWarehouse, this.SaleReplacementDetails);
            // alert(customer_ID);
            if (this.mode != 0) {
              this.SaleReplacementDetails[0].edit_Mode = true;
            }
            this.service.saveOrder(saleReplacement).then(
              (response) => {
                this.isLoading = false;
                this.orderDetails();
                this.modalReference.close();
                //console.log(response);
              },
              (error) => console.log(error))
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
  updateOrder(sale_Replacement_ID: any, Replacement_Date: any, Office_Code: any, PRN_NO: any,
    order_Envoy: any, customer_ID: any,
    contact_Person_ID: any, remarks: any, Cancel: any, mode: any, PRGUID: any, Day_Id: any) {
    if (this.SaleReplacementDetails.length > 0) {
      var saleReplacement = new SaleReplacement(sale_Replacement_ID, this.replacement_Date.getDateFinal(), this.userCurrentOffice, PRN_NO, order_Envoy,
        customer_ID, this.textboxInvoiceID, contact_Person_ID, remarks, false, this.guid, 1, this.logedInUserID, this.UserSessionID,this.userCurrentWarehouse, this.SaleReplacementDetails);
      //  alert(customer_ID);
      if (this.mode != 0) {
        this.SaleReplacementDetails[0].edit_Mode = true;
      }
      this.service.updateOrder(saleReplacement).then(
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
    this.getCustomers();
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
      this.isLoading =true;
      this.searchfilter.SearchSaleInvoiceDropDown(Query, customer_ID, this.userCurrentOffice)
        .subscribe(response => {
          this.searchGridInvoice = (response.json());
          if (this.searchGridInvoice != null) {            
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


    this.SaleReplacementDetails = [];
    this.textboxInvoiceID = ID;
    this.textboxInvoiceName = Name + " / " + ID;

    this.getItems(this.customer_ID);
    this.textboxInvoiceSearch = '';
    //this.searchGridInvoice = this.searchGridInvoiceTemp;
    //var timer = setTimeout(() => $("#ddlcontact").focus(), 500);

    //if (this.btnMode != false) {
    //  $("#submitAdd").prop("disabled", false);
    //  $("#submitAddMore").prop("disabled", false);
    //}

  }
  SearchInvoiceByID(Query) {
    this.textboxInvoiceSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchSaleInvoiceByID(Query, this.customer_ID)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          //this.textboxInvoiceID = List[0].id;
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

