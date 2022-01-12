import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BookingSheetService, BookingSheet, BookingSheetDetail, cDate, NgbDateFRParserFormatter, Employee, Item, LoginService, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'booking-sheet',
  templateUrl: './booking-sheet.component.html',
  styleUrls: ['./booking-sheet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
@media screen {
        .modal-sm {
           max-width: 500px !important;
            height: 250px !important;
       }
}

        `],
  //host: { '(window:keydown)': 'hotkeys($event)' },
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class BookingSheetComponent implements OnInit {
  ////////////////////////////////////////
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
   
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

  isView: any = true;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  ////////////////////////
  public permissionUtility:PermissionUtility=new PermissionUtility();
  constructor(private service: BookingSheetService, private LoginService: LoginService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(140103);  
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {

        this.gridlist = (response.json());
        // console.log(response.json());
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
    this.isLoading =true;
    this.service.getItems(this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        if (response.json() != null) {
          this.Items = (response.json());
          this.getArea();
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
    //console.log('LoopStart', Start, 'LoopEnd', End, 'Customer Header', this.CustomersTitles)
    //console.log('Temprory Items :', this.ItemsTemp);

    //Insert Single Empty Discount Row Customer Wise
    let ItemOrderRowDiscount = {} as ItemOrderData;
    ItemOrderRowDiscount.iteM_NAME = 'DISCOUNT';
    var ArrayCustomersDiscount = [];
    for (let l = Start; l <= End; l++) {
      let RowItemCustomersArrayDiscount = {} as CustomerData;
      RowItemCustomersArrayDiscount.customercode = this.AreaWiseCustomers[l].customercode;
      RowItemCustomersArrayDiscount.customername = this.AreaWiseCustomers[l].customername;
      RowItemCustomersArrayDiscount.qty = 0;

      ArrayCustomersDiscount.push(RowItemCustomersArrayDiscount);

    }
    ItemOrderRowDiscount.customer = ArrayCustomersDiscount;
    this.ItemsOrderGrid.push(ItemOrderRowDiscount);

    //console.log(this.ItemsOrderGrid)

    //Insert Empty Qty  Rows Customer Wise
    for (let i = 0; i < this.Items.length; i++) {
      let ItemOrderRow = {} as ItemOrderData;
      ItemOrderRow.iteM_CODE = this.Items[i].iteM_CODE;
      ItemOrderRow.iteM_NAME = this.Items[i].iteM_NAME;
      ItemOrderRow.stock = this.Items[i].stock;
      ItemOrderRow.pending = this.Items[i].pending;
      ItemOrderRow.price = this.Items[i].price;
      ItemOrderRow.totalqty = 0;

      var ArrayCustomers = [];
      for (let l = Start; l <= End; l++) {
        let RowItemCustomersArray = {} as CustomerData;
        RowItemCustomersArray.customercode = this.AreaWiseCustomers[l].customercode;
        RowItemCustomersArray.customername = this.AreaWiseCustomers[l].customername;
        RowItemCustomersArray.qty = 0;

        ArrayCustomers.push(RowItemCustomersArray);

      }
      ItemOrderRow.customer = ArrayCustomers;

      this.ItemsOrderGrid.push(ItemOrderRow);
      console.log('---------------------------');
      console.log(this.ItemsOrderGrid);
      console.log('---------------------------');
      $("#CROW-1").focus();
      this.isLoading = false;
    }
    //console.log('Item Order Array', this.ItemsOrderGrid);

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
    this.isLoading =true;
    $("#submitAdd").prop("disabled", true);
    $("#submitDraft").prop("disabled", true);
    this.createBookingSheetDetail()
    if (this.checkQty) {
      var data = new BookingSheet(0, this.duedate.getDateFinal(), this.saleofficercode, this.areacode, this.PagingListIndex, this.remarks, Draft, this.guid, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, this.BookingSheetDetailList);
      //console.log('data,',data);
      this.service.saveData(data).then(
        (response) => {

          $("#submitAdd").prop("disabled", false);
          $("#submitDraft").prop("disabled", false);
          this.isLoading = false;

          if (Draft != 1) {
            if (response != null) {
              var list = response;
              console.log('list', list);
              var Min = '0';
              var Max = '0';
              Min = list[0].bookingDetail_ID;
              Max = list[0].booking_ID;
              sessionStorage.setItem('OrderFrom', Min);
              sessionStorage.setItem('OrderTo', Max);
              if (this.isView == true) {
                this.onNavigate('/bs-so-rpt-rdlc');
              }

            }
          }
          this.getGrid();
          this.modalReference.close();
        },

        (error) => console.log(error)

      )
    }
    else {
      this.isLoading = false;
      $("#submitAdd").prop("disabled", false);
      $("#submitDraft").prop("disabled", false);
      swal('No Changes To Save!')
    }

  }
  //updateData
  updateData(Draft) {
    this.isLoading =true;
    $("#submitUpdate").prop("disabled", true);
    $("#submitUpdateDraft").prop("disabled", true);
    this.createBookingSheetDetail();
    if (this.checkQty) {
      var data = new BookingSheet(this.bookingcode, this.duedate.getDateFinal(), this.saleofficercode, this.areacode, this.PagingListIndex, this.remarks, Draft, this.guid, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, this.BookingSheetDetailList);
      //console.log(data);
      this.service.updateData(data).then(
        (response) => {
          this.getGrid();
          this.modalReference.close();
          $("#submitUpdate").prop("disabled", false);
          $("#submitUpdateDraft").prop("disabled", false);
          this.isLoading = false;
        },
        (error) => console.log(error))
    }
    else {
      $("#submitUpdate").prop("disabled", false);
      $("#submitUpdateDraft").prop("disabled", false);
      this.isLoading =true;
      swal('No Changes To Update!')
    }


  }
  //getDetailsByID
  getDetailsByID(ID, contentdetail) {
    this.bookingcode = ID;
    this.mode = true;
    this.btnmode = false;
    this.checkQty = false;
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var Bookinglist = response.json();

        //console.log(Bookinglist);

        this.duedate.setDate(Bookinglist[0].bookinG_DATE);
        //this.discount = Bookinglist[0].discount;
        this.remarks = Bookinglist[0].remarks;
        this.bookingstatus = Bookinglist[0].status;

        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.saleofficer = (response.json());
            this.saleofficercode = Bookinglist[0].useR_ID;

          });

        this.service.getItems(this.userCurrentOffice, this.userCurrentWarehouse)
          .subscribe(response => {

            if (response.json() != null) {
              this.Items = (response.json());
              this.service.getArea()
                .subscribe(response => {
                  if (response.json()) {
                    this.area = (response.json());
                    this.areacode = Bookinglist[0].areaid;
                    this.AreaWiseCustomers = [];
                    this.CustomersTitles = [];
                    this.ItemsOrderGrid = [];
                    this.isLoading =true;
                    this.service.getCustomers(this.areacode)
                      .subscribe(response => {
                        if (response.json() != null) {
                          this.AreaWiseCustomers = (response.json());
                          this.PagingList = [];
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
                              //console.log('counter == 15', this.PagingList, LoopStart);
                            }
                            else if ((i + 1) == this.AreaWiseCustomers.length) {
                              index++;
                              CustomerPaging.index = index;
                              this.PagingList.push(CustomerPaging);
                              //console.log('(i + 1) == this.AreaWiseCustomers.length', this.AreaWiseCustomers.length, this.PagingList, LoopStart);
                              LoopStart = i;
                            }
                          }
                          this.PagingListIndex = Bookinglist[0].pagE_ID;
                          var Index = this.PagingListIndex;

                          for (let i = 0; i < this.PagingList.length; i++) {
                            if (this.PagingList[i].index == Index) {

                              /* this.selectCustomersPage(this.PagingList[i].start, this.PagingList[i].end);*///////////////////

                              var Start = this.PagingList[i].start;
                              var End = this.PagingList[i].end;

                              this.CustomersTitles = [];
                              this.ItemsOrderGrid = [];

                              for (let j = Start; j <= End; j++) {
                                let RowCustomerHeader = {} as CustomerData;
                                RowCustomerHeader.customername = this.AreaWiseCustomers[j].customername;
                                this.CustomersTitles.push(RowCustomerHeader);

                              }                             
                              let ItemOrderRowDiscount = {} as ItemOrderData;
                              ItemOrderRowDiscount.iteM_NAME = 'DISCOUNT';
                              var ArrayCustomersDiscount = [];
                              for (let l = Start; l <= End; l++) {
                                let RowItemCustomersArrayDiscount = {} as CustomerData;
                                RowItemCustomersArrayDiscount.customercode = this.AreaWiseCustomers[l].customercode;
                                RowItemCustomersArrayDiscount.customername = this.AreaWiseCustomers[l].customername;
                                RowItemCustomersArrayDiscount.qty = 0;

                                ArrayCustomersDiscount.push(RowItemCustomersArrayDiscount);

                              }
                              ItemOrderRowDiscount.customer = ArrayCustomersDiscount;
                              this.ItemsOrderGrid.push(ItemOrderRowDiscount);

                              //Insert Empty Qty  Rows Customer Wise
                              for (let i = 0; i < this.Items.length; i++) {
                                let ItemOrderRow = {} as ItemOrderData;
                                ItemOrderRow.iteM_CODE = this.Items[i].iteM_CODE;
                                ItemOrderRow.iteM_NAME = this.Items[i].iteM_NAME;
                                ItemOrderRow.stock = this.Items[i].stock;
                                ItemOrderRow.pending = this.Items[i].pending;
                                ItemOrderRow.price = this.Items[i].price;
                                ItemOrderRow.totalqty = 0;

                                var ArrayCustomers = [];
                                for (let l = Start; l <= End; l++) {
                                  let RowItemCustomersArray = {} as CustomerData;
                                  RowItemCustomersArray.customercode = this.AreaWiseCustomers[l].customercode;
                                  RowItemCustomersArray.customername = this.AreaWiseCustomers[l].customername;
                                  RowItemCustomersArray.qty = 0;
                                  ArrayCustomers.push(RowItemCustomersArray);

                                }
                                ItemOrderRow.customer = ArrayCustomers;

                                this.ItemsOrderGrid.push(ItemOrderRow);
                              }
                              //console.log('Item Order Array', this.ItemsOrderGrid);
                              this.getBookingDetailsByID(ID);
                              this.isLoading = false;

                            }
                          }

                        }

                      });
                  }

                });


            }

          });    

      });

    this.openDetail(contentdetail);
  }
  //getDetailsByID
  getBookingDetailsByID(ID) {
    this.isLoading =true;
    this.service.getBookingDetailsByID(ID)
      .subscribe(response => {
        var DetailList = response.json();


        for (let x = 0; x < DetailList.length; x++) {
          for (let i = 1; i < this.ItemsOrderGrid.length; i++) {
            var SumCustomerQty = 0
            if (this.ItemsOrderGrid[i].iteM_CODE == DetailList[x].iteM_CODE) {
              for (let j = 0; j < this.ItemsOrderGrid[i].customer.length; j++) {
                if (this.ItemsOrderGrid[i].customer[j].customercode == DetailList[x].customeR_CODE) {
                  this.ItemsOrderGrid[i].customer[j].qty = DetailList[x].quantity;
                  this.ItemsOrderGrid[0].customer[j].qty = DetailList[x].discount;
                }
                SumCustomerQty = SumCustomerQty + parseInt(this.ItemsOrderGrid[i].customer[j].qty);
              }
              this.ItemsOrderGrid[i].totalqty = SumCustomerQty;
            }
          }
        }
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
    this.checkQty = false;
    var Array = [];
    for (let i = 1; i < this.ItemsOrderGrid.length; i++) {
      for (let j = 0; j < this.ItemsOrderGrid[i].customer.length; j++) {
        if (parseInt(this.ItemsOrderGrid[i].customer[j].qty) > 0) {
          let row = {} as BookingSheetData;
          row.bookingdetaiL_ID = 0;
          row.bookinG_ID = 0;
          row.iteM_CODE = this.ItemsOrderGrid[i].iteM_CODE
          row.customeR_CODE = this.ItemsOrderGrid[i].customer[j].customercode
          row.quantity = this.ItemsOrderGrid[i].customer[j].qty
          //console.log('Discount',this.ItemsOrderGrid[0].customer)
          //Adding Discount To Each Detail Customer Wise
          for (let k = 0; k < this.ItemsOrderGrid[0].customer.length; k++) {
            if (this.ItemsOrderGrid[i].customer[j].customercode == this.ItemsOrderGrid[0].customer[k].customercode) {
              if (this.ItemsOrderGrid[0].customer[k].qty >= 0) {
                row.discount = this.ItemsOrderGrid[0].customer[k].qty
              }
            }
          }

          Array.push(row);
          //console.log('Pushed', i, j, this.ItemsOrderGrid[i].iteM_NAME, this.ItemsOrderGrid[i].customer[j].customername);
          this.checkQty = true;
        }
      }
    }
    this.BookingSheetDetailList = Array;
    //console.log('Array',Array);

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
    sessionStorage.setItem('isStamp', 'false');
    sessionStorage.setItem('exchange', "-1");
    sessionStorage.setItem('ReportView', "2");
    sessionStorage.setItem('areacode', this.areacode);
    sessionStorage.setItem('areaname', this.areaname);
    sessionStorage.setItem('reportID', "8");
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
}

interface ItemOrderData {
  iteM_CODE: any;
  iteM_NAME: any;
  stock: any;
  pending: any;
  price: any;
  customer: any[];
  totalqty: number;

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
  bookingdetaiL_ID: number;
  bookinG_ID: number;
  iteM_CODE: number;
  customeR_CODE: number;
  quantity: string;
  discount: number;
}
