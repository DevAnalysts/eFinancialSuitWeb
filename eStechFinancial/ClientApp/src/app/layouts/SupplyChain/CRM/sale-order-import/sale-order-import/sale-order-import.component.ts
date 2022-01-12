import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleOrderImportService, LoginService, DayEndService, saleOrder, saleOrderDetails, cDate, NgbDateFRParserFormatter, FileAttachmentService } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';
@Component({
  selector: 'sale-order-import',
  templateUrl: './sale-order-import.component.html',
  styleUrls: ['./sale-order-import.component.scss'],
  styles: [`
    :host >>> .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040; 
    }
  `],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SaleOrderImportComponent implements OnInit {
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
  //Member Varialbes
  p: number = 1;
  a: number = 1;
  modalReference: NgbModalRef;
  customers: Array<Select2OptionData>;
  saleOrderDetails: any;
  guid: any;
  public invoice_Date = new cDate();
  public dayEndDate = new cDate();
 isLoading: any = false;
  pa: any = 0;
  areaenable: any = 0;
  areashow: any = 'none';
  area: any[] = [];
  areacode: any = 0;
  areaname: any = '';
  PagingList: any[] = [];
  PagingListIndex: any = 1;
  PendingOrders: any[] = [];
  PendingOrdersAmountTotals: any = 0;
  PendingOrdersPaymentTotals: any = 0;
  alerts: Array<any> = [];
  selectedAll: any;
  increment: any = 0;
  dateFlag: any = false;
  savemoreFlag: any = false;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentOfficeName: any;
  userCurrentWarehouse: any;

  itemStockIMEI : any[] = [];

  closeResult: string;
  mode: any = 0;
  // End Member Varialbes

  constructor(public router: Router, private service: SaleOrderImportService, private fileservice: FileAttachmentService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.saleOrderDetails = new Array<saleOrderDetails>();

    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.userCurrentOfficeName = this.LoginService.getSession('userCurrentOfficeName');

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
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));

    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 140014) {
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
    this.invoice_Date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    $("#myInput").click();
  }
  //clearValues
  clearFields() {
    //Member Varialbes
    this.customers = [];
    this.pa = 0;
    this.mode = false;
    this.saleOrderDetails = [];
    this.guid = UUID.UUID();
    $("#checkboxGDN").prop("disabled", false);
    this.setAreaEnableStatus();
  }
  //getAreaEnableStatus
  getAreaEnableStatus() {
    if (this.LoginService.getSession('EnableAreaonSO') != '1') {
      this.areaenable = 0;

    }
    else {
      this.areaenable = 1;
    }

    this.setAreaEnableStatus();
  }
  //setAreaEnableStatus
  setAreaEnableStatus() {
    if (this.areaenable != 1) {
      this.getPendingSaleOrder(1);
    }
    else {
      this.getArea();
      this.areashow = '';
    }
  }
  //getArea 
  getArea() {
    this.isLoading =true;
    this.service.getArea()
      .subscribe(response => {
        this.area = (response.json());
        this.isLoading = false;
        if (this.area != null) {

          if (sessionStorage.getItem("AreaID") != '') {
            this.areacode = sessionStorage.getItem("AreaID");
          }
          else {
            this.areacode = this.area[0].areacode;
            this.areaname = this.area[0].areaname;
          }
          this.getPendingSaleOrder(this.areacode);
        }
      });

  }
  //getPendingCustomer
  getPendingCustomer(Area) {
    this.isLoading =true;
    this.service.getPendingCustomer(this.areacode, this.invoice_Date.getDateFinal(), this.mode)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
      });
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {

      if (!this.mode && this.savemoreFlag == false)
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
  // open modal
  open(content) {
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
    this.setAreaEnableStatus();
  }
  //getDismissReasons
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  //getPendingSaleOrder
  getPendingSaleOrder(areacode) {
    this.PendingOrders = [];
    this.isLoading =true;
    this.service.getPendingSaleOrder(areacode, this.invoice_Date.getDateFinal(),this.userCurrentOffice)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        if (response.json() != null) {
          this.PendingOrders = response.json();
          this.customersPaging();
        }
      });
  }
  //savePendingOrderDayWise
  savePendingOrderDayWise() {
    this.isLoading =true;
    this.increment = 0;
    this.recure();
  }
  //recure
  recure() {
    if (this.increment < this.PendingOrders.length) {
      var i = this.increment;
      var List = this.PendingOrders;
      if (List[i].action == 1 && List[i].total_Amount > 0) {
        $("#submitAdd").prop("disabled", false);
        this.saleOrderDetails = [];
        this.service.getPendingSaleOrderDetail(List[i].customer_ID, List[i].sale_Order_ID,this.userCurrentOffice)
          .subscribe(response => {
            console.log(response.json());
            if (response.json() != null) {
              var SInvoiceDetails = (response.json());

              for (let i = 0; i < SInvoiceDetails.length; i++) {
                SInvoiceDetails[i].sale_Detail_ID = 0;
                SInvoiceDetails[i].sale_Order_ID = 0;
              }

              this.guid = UUID.UUID();
              var invoice = new saleOrder(0, this.invoice_Date.getDateFinal(), this.userCurrentOffice, List[i].sale_Officer_ID, List[i].areaCode, List[i].customer_ID, 1, this.invoice_Date.getDateFinal(), 1, 1, 1, List[i].total_Cost, List[i].total_Discount, 0, 0, List[i].total_Amount, List[i].total_Amount, 1, 1,
                'New', List[i].sale_Order_ID, 0, 1, 0, this.invoice_Date.getDateFinal(), this.logedInUserID, 0, this.guid, 0, 0, 0, 0, 0, 0, this.logedInUserID, this.UserSessionID, 1, 0, this.userCurrentWarehouse, SInvoiceDetails,this.itemStockIMEI);
              console.log(invoice);
              $("#submitAdd").prop("disabled", true);
              this.service.saveInvoice(invoice).then(
                (response) => {
                  console.log(response);
                  this.increment++;
                  console.log("CURSOR: " + this.increment);
                  this.recure();
                },
                (error) => console.log(error))
            }
          });
      }
      else {
        this.increment = this.increment + 1;
        console.log("ELSE CURSOR: " + this.increment)
        this.recure();
      }
    }
    else {
      console.log("ENDED!")
      this.isLoading = false;

      $("#submitAdd").prop("disabled", true);
      this.getPendingSaleOrder(this.areacode);
    }
  }
  //selectAll
  selectAll() {
    var sum = 0;
    if (this.PendingOrders != null) {
      for (let i = 0; i < this.PendingOrders.length; i++) {
        this.PendingOrders[i].action = this.selectedAll;
        if (this.PendingOrders[i].action == this.selectedAll) {
          this.PendingOrders[i].paidAmount = this.PendingOrders[i].total_Amount;
        }
        else {
          this.PendingOrders[i].paidAmount = 0;
        }
        sum = sum + parseFloat(this.PendingOrders[i].paidAmount);

        if (this.PendingOrders[i].action != false)
          $("#submitAdd").prop("disabled", false);
        else
          $("#submitAdd").prop("disabled", true);

      }
    }

    this.PendingOrdersPaymentTotals = sum;
    return sum.toFixed(2);
  }
  //selectByOne
  selectByOne(action) {
    if (action != false)
      $("#submitAdd").prop("disabled", false);
    else
      $("#submitAdd").prop("disabled", true);
  }
  //routeInvoice
  routeInvoice() {
    this.router.navigate(['/sale-order']);
  }
  //customersPaging
  customersPaging() {
    var counter = 0;
    var LoopStart = 0;
    var index = 0;
    this.PagingList = [];
    for (let i = 0; i < this.PendingOrders.length; i++) {
      let CustomerPaging = {} as CustomerPagingData;
      CustomerPaging.desc = (LoopStart + 1) + "-" + (i + 1);
      CustomerPaging.start = LoopStart;
      CustomerPaging.end = i;
      counter++;
      if ((i + 1) == this.PendingOrders.length) {
        index++;
        CustomerPaging.index = index;
        this.PagingList.push(CustomerPaging);
        console.log('(i + 1) == this.PendingOrders.length', this.PendingOrders.length, this.PagingList, LoopStart);
        LoopStart = i;
      }
    }
  }
}

interface CustomerPagingData {
  index: number;
  desc: string;
  start: number;
  end: number;
}


