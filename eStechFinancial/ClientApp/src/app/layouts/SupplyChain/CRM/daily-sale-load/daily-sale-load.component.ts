import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DailySaleLoadService, BookingSheet, cDate, NgbDateFRParserFormatter, LoginService, DailySaleLoad } from '../../../../shared';;
import swal from 'sweetalert';
@Component({
  selector: 'daily-sale-load',
  templateUrl: './daily-sale-load.component.html',
  styleUrls: ['./daily-sale-load.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
@media screen {
        .modal-sm {
           max-width: 500px !important;
            height: 250px !important;
       }
}
        `],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DailySaleLoadComponent implements OnInit {
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
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  a: number = 1;
  id: any;
  modalReference: NgbModalRef;
  isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;


  gridlist: any[] = [];
  public duedate = new cDate();
  area: any[] = [];
  areacode: any = 0;
  areaname: any = "";
  saleofficer: any[] = [];
  saleofficercode: any = 0;
  //discount: any = 0;

  Items: any[] = [];
  ItemsOrderGrid: any[] = [];
  CustomersTitles: any[] = [];
  AreaWiseCustomers: any[] = [];
  PagingList: any[] = [];
  PagingListIndex: any = 1;
  checkQty: any = false;
  remarks: any = '';

  bookingcode: any = 0;
  bookingstatus: any = 0;

  BookingSheetDetailList: any[] = [];
  dailySaleLoadDetail: any[] = [];

  isView: any = true;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  ////////////////////////


  totalLoad: any = 0;
  totalLessReturn: any = 0;
  totalGrossSale: any = 0;
  totalRP: any = 0;
  totalNetSale: any = 0;
  lpd: any = 0;
  totalLPD: any = 0;
  loadOutRequest: any = 1;
  loadOutReturn: any = 0;
  DailySaleLoadID: any = 0;

  constructor(private service: DailySaleLoadService, private LoginService: LoginService, private modalService: NgbModal) {
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

  ngOnInit() {
    this.getGrid();
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    //console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 809133) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;
          //console.log(FUNCTIONALITY[i].page_Name)

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
  //getGrid
  getGrid() {
    this.isLoading = true;
    this.service.getGrid()
      .subscribe(response => {
        this.gridlist = (response.json());
        this.isLoading = false;
        //console.log(response.json())
      });
  }
  //getFills
  getFills() {
    this.getPriviledgedOffices();
    this.getItems();

  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.saleofficer = (response.json());
        if (this.saleofficer != null) {
          for (let i = 0; i < this.saleofficer.length; i++)
            if (this.saleofficer[i].order_Envoy == this.logedInUserID) {
              var timer = setTimeout(() => this.saleofficercode = this.saleofficer[i].order_Envoy, 500);
            }
            else { this.saleofficercode = this.saleofficer[0].order_Envoy; }
        }
      });
  }
  //getItems
  getItems() {
    this.Items = [];
    this.isLoading = true;
    this.service.getItems(this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        if (response.json() != null) {
          this.Items = (response.json());
          this.getArea();

          for (let i = 0; i < this.Items.length; i++) {
            let ItemOrderRow = {} as ItemOrderData;
            ItemOrderRow.iteM_CODE = this.Items[i].iteM_CODE;
            ItemOrderRow.iteM_NAME = this.Items[i].iteM_NAME;
            ItemOrderRow.quantity = this.Items[i].stock;
            ItemOrderRow.loadInCase = 0;
            ItemOrderRow.loadInPcs = 0;
            ItemOrderRow.totalLoad = 0;
            ItemOrderRow.returnInCase = 0;
            ItemOrderRow.returnInPcs = 0;
            ItemOrderRow.lessReturn = 0;
            ItemOrderRow.grossSale = 0;
            ItemOrderRow.rp = 0;
            ItemOrderRow.lpd = 0;
            this.ItemsOrderGrid.push(ItemOrderRow);
          }

        }
      });
  }
  //getArea 
  getArea() {
    this.service.getArea()
      .subscribe(response => {
        if (response.json()) {
          this.area = (response.json());
          this.areacode = this.area[0].areacode;
          this.areaname = this.area[0].areaname;
          this.getCustomers(this.areacode);
        }
        else {
          $("#submitAdd").prop("disabled", true);
        }
      });
  }
  //getCustomers
  getCustomers(AreaID) {
    this.AreaWiseCustomers = [];
    this.CustomersTitles = [];
    this.ItemsOrderGrid = [];
    this.service.getCustomers(AreaID)
      .subscribe(response => {
        if (response.json() != null) {
          this.AreaWiseCustomers = (response.json());
          this.PagingList = [];
          this.customersPaging();
          //console.log('AreaWiseCustomers : ', this.AreaWiseCustomers);
          $("#submitAdd").prop("disabled", false);
        }
        else {
          $("#next").hide();
          $("#submitAdd").prop("disabled", true);
        }

      });

  }
  //CustomersPaging
  customersPaging() {
    var counter = 0;
    var LoopStart = 0;
    var index = 0;

    for (let i = 0; i < this.AreaWiseCustomers.length; i++) {

      let CustomerPaging = {} as CustomerPagingData;
      CustomerPaging.desc = (LoopStart + 1) + "-" + (i + 1);
      CustomerPaging.start = LoopStart;
      CustomerPaging.end = i;
      counter++;

      if (counter == 15) {
        index++;
        CustomerPaging.index = index;
        this.PagingList.push(CustomerPaging);
        counter = 0;
        LoopStart = i + 1;
        console.log('counter == 15', this.PagingList, LoopStart);
      }
      else if ((i + 1) == this.AreaWiseCustomers.length) {
        index++;
        CustomerPaging.index = index;
        this.PagingList.push(CustomerPaging);
        console.log('(i + 1) == this.AreaWiseCustomers.length', this.AreaWiseCustomers.length, this.PagingList, LoopStart);
        LoopStart = i;
      }
    }

    this.setCustomersPage(1);
  }
  //checkCustomersPage
  checkCustomersPage(Index) {
    if (this.checkQty) {
      swal({
        title: "Do you want to make Draft of Booking Sheet?",
        text: "Once changed, you will not be able to recover this Sheet!",
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
            this.checkQty = false;
            this.setCustomersPage(Index)
            swal('Saved!');
          } else {
            this.checkQty = false;
            this.setCustomersPage(Index)
          }
        });
    }
    else {
      this.setCustomersPage(Index)
    }
  }
  //setCustomersPage
  setCustomersPage(Index) {
    for (let i = 0; i < this.PagingList.length; i++) {
      if (this.PagingList[i].index == Index) {
        this.selectCustomersPage(this.PagingList[i].start, this.PagingList[i].end);
      }
    }
  }
  //selectCustomersPage
  selectCustomersPage(Start, End) {
    this.CustomersTitles = [];
    this.ItemsOrderGrid = [];

    for (let j = Start; j <= End; j++) {
      let RowCustomerHeader = {} as CustomerData;
      RowCustomerHeader.customername = this.AreaWiseCustomers[j].customername;
      this.CustomersTitles.push(RowCustomerHeader);
    }

    //Insert Empty Qty  Rows Customer Wise

    for (let i = 0; i < this.Items.length; i++) {
      let ItemOrderRow = {} as ItemOrderData;
      ItemOrderRow.iteM_CODE = this.Items[i].iteM_CODE;
      ItemOrderRow.iteM_NAME = this.Items[i].iteM_NAME;
      ItemOrderRow.quantity = this.Items[i].pending;
      ItemOrderRow.loadInCase = 0;
      ItemOrderRow.loadInPcs = 0;
      ItemOrderRow.totalLoad = 0;
      ItemOrderRow.returnInCase = 0;
      ItemOrderRow.returnInPcs = 0;
      ItemOrderRow.lessReturn = 0;
      ItemOrderRow.grossSale = 0;
      ItemOrderRow.rp = 0;
      ItemOrderRow.lpd = 0;
      this.ItemsOrderGrid.push(ItemOrderRow);
      $("#CROW-1").focus();
      this.isLoading = false;
    }
  }
  //addGrid
  addGrid(item_Code: any, quantity: any, loadInCase: any, loadInPcs: any, returnInCase: any, returnInPcs: any, rp: any) {
    for (let i = 1; i < this.ItemsOrderGrid.length; i++) {
      if (this.ItemsOrderGrid[i].iteM_CODE == item_Code) {
        // console.log('-----------------' + item_Code);
        this.ItemsOrderGrid[i].totalLoad = ((quantity * loadInCase) + loadInPcs);
        this.ItemsOrderGrid[i].lessReturn = ((quantity * returnInCase) + returnInPcs);
        this.ItemsOrderGrid[i].grossSale = (this.ItemsOrderGrid[i].totalLoad - this.ItemsOrderGrid[i].lessReturn);
        this.ItemsOrderGrid[i].netSale = this.ItemsOrderGrid[i].grossSale - rp;
        this.lpd = (this.ItemsOrderGrid[i].grossSale / quantity).toFixed(2);
        this.ItemsOrderGrid[i].lpd = this.lpd;


      }
    }


    //this.ItemsOrderGrid.push(item_Code, quantity, loadInCase, loadInPcs, this.totalLoad, returnInCase, returnInPcs, this.lessReturn, rp);

    //this.saleOrderDetails.push(new saleOrderDetails(0, 0, item_Code, item_Name, Unit_Price, Quantity, (Unit_Price * Quantity), Discount_Rate, ((Quantity) * (Unit_Price) * (Discount_Rate) / 100), this.taxratecode, 0, 0, 0, ((Quantity) * (Unit_Price) - ((Quantity) * (Unit_Price) * (Discount_Rate) / 100)).toFixed(2), 0, this.stock_Qty, this.pending));


    //}
    //else {
    //  swal("Qty is required. Qty not be zero and should be numeric");
    //  return;
    //}

    $("#submitAdd").prop("disabled", false);
    $("#submitAddMore").prop("disabled", false);
    //} else {
    //  $("#submitAdd").prop("disabled", true);
    //  $("#submitAddMore").prop("disabled", true);
    //  swal("Stock is not available." + this.stock_Qty + "");
    //  return;
    //}

    $("#txt").focus();

  }
  //checkStock
  checkStock(itemcode, itemstock, itempending, customercode) {

    var Stock = parseInt(itemstock);
    var Pending = parseInt(itempending);
    var SumCustomerQty = 0;

    if (this.ItemsOrderGrid != null) {
      for (let i = 1; i < this.ItemsOrderGrid.length; i++) {
        if (this.ItemsOrderGrid[i].iteM_CODE == itemcode) {
          for (let j = 0; j < this.ItemsOrderGrid[i].customer.length; j++) {
            SumCustomerQty = SumCustomerQty + parseInt(this.ItemsOrderGrid[i].customer[j].qty);
          }
          if (Stock < (Pending + SumCustomerQty)) {
            for (let k = 0; k < this.ItemsOrderGrid[i].customer.length; k++) {

              if (this.ItemsOrderGrid[i].customer[k].customercode == customercode) {
                this.ItemsOrderGrid[i].customer[k].qty = 0;
                SumCustomerQty = 0
                for (let j = 0; j < this.ItemsOrderGrid[i].customer.length; j++) {
                  SumCustomerQty = SumCustomerQty + parseInt(this.ItemsOrderGrid[i].customer[j].qty);
                }
                this.ItemsOrderGrid[i].totalqty = SumCustomerQty;
                swal('Stock Limited!');
              }


            }
          }
          else {
            this.ItemsOrderGrid[i].totalqty = SumCustomerQty;
            this.checkQty = true;
          }
        }
      }
    }
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    $("#submitDraft").prop("disabled", false);
    $("#viewRDLC").prop("disabled", false);

    this.duedate = new cDate();
    //this.discount = 0;
    this.remarks = '';
    this.saleofficer = [];
    this.saleofficercode = this.logedInUserID;
    this.Items = [];
    this.ItemsOrderGrid = [];
    this.CustomersTitles = [];
    this.AreaWiseCustomers = [];
    this.PagingList = [];
    this.PagingListIndex = 1;
    this.checkQty = false;
    this.getFills();
  }
  //IfExists
  IfExists(bookcode) {
    this.service.IfExists(bookcode)
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
  //saveData
  saveData(Draft) {
    //this.isLoading = true;
    $("#submitAdd").prop("disabled", true);
    $("#submitDraft").prop("disabled", true);
    this.createBookingSheetDetail()
    console.log(this.dailySaleLoadDetail);
    //if (this.checkQty) {
    var data = new DailySaleLoad(0, this.duedate.getDateFinal(), this.saleofficercode, this.areacode, this.totalLoad, this.totalLessReturn, this.totalGrossSale, this.totalRP, this.totalNetSale, this.totalLPD, this.remarks, this.logedInUserID, this.dailySaleLoadDetail);
    //console.log('data,',data);
    this.service.saveData(data).then(
      (response) => {
        this.DailySaleLoadID = response;

        sessionStorage.setItem('DailySaleLoadID', this.DailySaleLoadID);
        if (this.isView == true) {
          this.onNavigate('/dsl-rpt-rdlc');
        }
        $("#submitAdd").prop("disabled", false);

        this.isLoading = false;
        this.getGrid();
        this.modalReference.close();
      },
      (error) => console.log(error)
    )
    //}
    //else {
    //  this.isLoading = false;
    //  $("#submitAdd").prop("disabled", false);
    //  $("#submitDraft").prop("disabled", false);
    //  swal('No Changes To Save!')
    //}

  }
  //updateData
  updateData(Draft) {
    //this.isLoading = true;
    $("#submitUpdate").prop("disabled", true);
    $("#submitAdd").prop("disabled", false);
    $("#submitDraft").prop("disabled", true);
    //this.createBookingSheetDetail()
    console.log(this.dailySaleLoadDetail);
    //if (this.checkQty) {
    var data = new DailySaleLoad(this.DailySaleLoadID, this.duedate.getDateFinal(), this.saleofficercode, this.areacode, this.totalLoad, this.totalLessReturn, this.totalGrossSale, this.totalRP, this.totalNetSale, this.totalLPD, this.remarks, this.logedInUserID, this.dailySaleLoadDetail);
    //console.log('data,',data);
    this.service.updateData(data).then(
      (response) => {
        this.DailySaleLoadID = response;

        sessionStorage.setItem('DailySaleLoadID', this.DailySaleLoadID);
        if (this.isView == true) {
          this.onNavigate('/dsl-rpt-rdlc');
        }
        $("#submitAdd").prop("disabled", false);

        this.isLoading = false;
        this.getGrid();
        this.modalReference.close();
      },
      (error) => console.log(error)
    )
    //}
    //else {
    //  this.isLoading = false;
    //  $("#submitAdd").prop("disabled", false);
    //  $("#submitDraft").prop("disabled", false);
    //  swal('No Changes To Save!')
    //}

  }
  //getDetailsByID
  getDetailsByID(ID, contentdetail) {
    this.DailySaleLoadID = ID;
    this.mode = true;
    this.btnmode = false;
    this.checkQty = false;

    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var Bookinglist = response.json();
        this.DailySaleLoadID = Bookinglist[0].dailySaleLoadID;
        this.duedate.setDate(Bookinglist[0].saleDate);
        this.remarks = Bookinglist[0].remarks;

        //----------------------------------------------
        //----------------------------------------------
        this.totalLoad = Bookinglist[0].totalLoad;//totalLoad
        this.totalLessReturn = Bookinglist[0].totalLessReturn;//totalLessReturn
        this.totalGrossSale = Bookinglist[0].totalGrossSale;//totalGrossSale        
        this.totalRP = Bookinglist[0].totalRP;//totalRP
        this.totalNetSale = Bookinglist[0].totalNetSale;//totalNetSale
        this.totalLPD = Bookinglist[0].totalLPD;//totalLPD
        //----------------------------------------------
        //----------------------------------------------

        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.saleofficer = (response.json());
            this.saleofficercode = Bookinglist[0].user_ID;
            this.areacode = Bookinglist[0].areaid;

            this.Items = [];
            this.isLoading = true;
            this.service.getItems(this.userCurrentOffice, this.userCurrentWarehouse)
              .subscribe(response => {
                if (response.json() != null) {
                  this.Items = (response.json());
                  this.getArea();
                  for (let i = 0; i < this.Items.length; i++) {
                    let ItemOrderRow = {} as ItemOrderData;
                    ItemOrderRow.iteM_CODE = this.Items[i].iteM_CODE;
                    ItemOrderRow.iteM_NAME = this.Items[i].iteM_NAME;
                    ItemOrderRow.quantity = this.Items[i].stock;
                    this.ItemsOrderGrid.push(ItemOrderRow);
                    this.getBookingDetailsByID(ID);
                    this.isLoading = false;
                  }

                }
              });
          });
      });

    this.openDetail(contentdetail);
  }
  //getDetailsByID
  getBookingDetailsByID(ID) {
    this.dailySaleLoadDetail = [];
    this.ItemsOrderGrid = [];
    this.isLoading = true;
    this.service.getSaleDetailsByID(ID)
      .subscribe(response => {
        var DetailList = response.json();
        for (let x = 0; x < DetailList.length; x++) {
          if (parseInt(DetailList[x].loadOutInCase) > 0) {
            for (let i = 1; i < this.ItemsOrderGrid.length; i++) {
              if (this.ItemsOrderGrid[i].iteM_CODE == DetailList[x].iteM_CODE) {
                this.ItemsOrderGrid[i].iteM_CODE = DetailList[x].iteM_CODE;
                this.ItemsOrderGrid[i].packingQuantity = DetailList[x].packingQuantity;
                this.ItemsOrderGrid[i].loadOutInCase = DetailList[x].loadOutInCase;
                this.ItemsOrderGrid[i].loadOutInPcs = DetailList[x].loadOutInPcs;
                this.ItemsOrderGrid[i].load = DetailList[x].load;
                this.ItemsOrderGrid[i].loadOutReturnInCase = DetailList[x].loadOutReturnInCase;
                this.ItemsOrderGrid[i].loadOutReturnInPcs = DetailList[x].loadOutReturnInPcs;
                this.ItemsOrderGrid[i].lessReturn = DetailList[x].lessReturn;
                this.ItemsOrderGrid[i].grossSale = DetailList[x].grossSale;
                this.ItemsOrderGrid[i].rp = DetailList[x].rp;
                this.ItemsOrderGrid[i].netSale = DetailList[x].netSale;
                this.ItemsOrderGrid[i].lpd = DetailList[x].lpd;
              }
            }
          }
        }
        this.dailySaleLoadDetail = this.ItemsOrderGrid;
        this.isLoading = false;
      });

  }
  //openAddModel
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
  //openDetail modal
  openDetail(contentdetail) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(contentdetail, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
    $("#submitCancel").prop("disabled", false);
    $("#submitAdd").prop("disabled", false);
    $("#submitAddAdjust").prop("disabled", false);
    $("#viewRDLC").prop("disabled", false);

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
  //createBookingSheetDetail
  createBookingSheetDetail() {
    ////this.checkQty = false;
    var Array = [];
    for (let i = 1; i < this.ItemsOrderGrid.length; i++) {
      if (parseInt(this.ItemsOrderGrid[i].loadInCase) > 0) {
        let row = {} as BookingSheetData;
        row.dailySaleLoadDetailID = 0;
        row.dailySaleLoadID = 0;
        row.item_Code = this.ItemsOrderGrid[i].iteM_CODE;
        row.packingQuantity = this.ItemsOrderGrid[i].quantity;
        row.loadOutInCase = this.ItemsOrderGrid[i].loadInCase;
        row.loadOutInPcs = this.ItemsOrderGrid[i].loadInPcs;
        row.load = this.ItemsOrderGrid[i].totalLoad;
        row.loadOutReturnInCase = this.ItemsOrderGrid[i].returnInCase;
        row.loadOutReturnInPcs = this.ItemsOrderGrid[i].returnInPcs;
        row.lessReturn = this.ItemsOrderGrid[i].lessReturn;
        row.grossSale = this.ItemsOrderGrid[i].grossSale;
        row.rP = this.ItemsOrderGrid[i].rp;
        row.netSale = this.ItemsOrderGrid[i].netSale;
        row.lPD = this.ItemsOrderGrid[i].netSale / this.ItemsOrderGrid[i].quantity;


        //----------------------------------------------
        //----------------------------------------------
        this.totalLoad += row.load;//totalLoad
        this.totalLessReturn += row.lessReturn;//totalLessReturn
        this.totalGrossSale += row.grossSale;//totalGrossSale        
        this.totalRP += row.rP;//totalRP
        this.totalNetSale += row.netSale;//totalNetSale
        this.totalLPD += row.lPD;//totalLPD
        //----------------------------------------------
        //----------------------------------------------
        console.log('totalLoad: ' + this.totalLoad);
        console.log('totalLessReturn:' + this.totalLessReturn);
        console.log('totalGrossSale:' + this.totalGrossSale);
        console.log('totalRP:' + this.totalRP);
        console.log('totalNetSale:' + this.totalNetSale);
        console.log('totalLPD:' + this.totalLPD);
        Array.push(row);
      }
    }
    this.dailySaleLoadDetail = Array;

  }
  //cancelBookingSheet
  cancelBookingSheet() {
    this.service.cancelBookingSheet(this.bookingcode)
      .subscribe(response => {
        this.getGrid();
        this.modalReference.close();
      });
  }
  //onNavigate
  onNavigate(pth) {
    sessionStorage.setItem('DailySaleLoadID', this.DailySaleLoadID);
    sessionStorage.setItem('reportID', "9");
    sessionStorage.setItem('ReportParentType', "3");
    window.open(pth, "_blank");
  }
  //processKeyUp
  processKeyUp(e) {

    if (e.keyCode == 38) { // press up
      e.preventDefault();
      var ID = document.activeElement.id;
      //console.log(ID);
      if (ID.split("-", 3)) {
        var splitted = ID.split("-", 3);
        if (parseInt(splitted[1]) > 0) {
          var target = "#" + splitted[0] + "-" + (parseInt(splitted[1]) - 1) + "-" + (parseInt(splitted[2]));
          console.log(target);
          $(target).focus();
          $(target).select();
        }
      }
    }
    else if (e.keyCode == 40) { // press down
      e.preventDefault();
      var ID = document.activeElement.id;
      // console.log(ID);
      if (ID.split("-", 3)) {
        var splitted = ID.split("-", 3);
        var target = "#" + splitted[0] + "-" + (parseInt(splitted[1]) + 1) + "-" + (parseInt(splitted[2]));
        console.log(target);
        $(target).focus();
        $(target).select();
      }
    }


  }
  //changeLoadRequest
  changeLoadRequest() {
    this.loadOutRequest = true;
    this.loadOutReturn = false;
  }
  //changeLoadReturn
  changeLoadReturn() {
    this.loadOutRequest = false;
    this.loadOutReturn = true;
  }
}

interface ItemOrderData {
  iteM_CODE: any;
  iteM_NAME: any;
  quantity: any;
  loadInCase: any;
  loadInPcs: any;
  totalLoad: any;
  returnInCase: any;
  returnInPcs: any;
  lessReturn: any;
  grossSale: any;
  rp: any;
  netSale: any;
  lpd: any;
}
interface CustomerData {
  customercode: string;
  customername: string;
  qty: number;
}
interface CustomerPagingData {
  index: number;
  desc: string;
  start: number;
  end: number;
}
interface BookingSheetData {

  dailySaleLoadDetailID: any,
  dailySaleLoadID: any,
  item_Code: any,
  packingQuantity: any,
  loadOutInCase: any,
  loadOutInPcs: any,
  load: any,
  loadOutReturnInCase: any,
  loadOutReturnInPcs: any,
  lessReturn: any,
  grossSale: any,
  rP: any,
  netSale: any,
  lPD: any

  //bookingdetaiL_ID: number;
  //bookinG_ID: number;
  //iteM_CODE: number;
  //customeR_CODE: number;
  //quantity: string;
  //discount: number;
}
