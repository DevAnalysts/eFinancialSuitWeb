import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomerReceiptImportService, LoginService, salePayment, customerPaymentDetails, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import { Router } from '@angular/router';
@Component({
  selector: 'customer-receipt-import',
  templateUrl: './customer-receipt-import.component.html',
  styleUrls: ['./customer-receipt-import.component.scss'],
  styles: [`
    :host >>> .alert-custom {
      color: #99004d;
      background-color: #f169b4;
      border-color: #800040; 
    }
  `],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CustomerReceiptImportComponent implements OnInit {
  ////////////////////////////////////////
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  
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
  closeResult: string;
  mode: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  // End Member Varialbes

  constructor(public router: Router, private service: CustomerReceiptImportService, private LoginService: LoginService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(140015);    

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
      this.getPendingSalePayment(1);
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
          this.getPendingSalePayment(this.areacode);
        }
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
  //getPendingSalePayment
  getPendingSalePayment(areacode) {
    this.PendingOrders = [];
    this.isLoading = true;
    this.service.getPendingSalePayment(areacode, this.invoice_Date.getDateFinal(), this.userCurrentOffice)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        if (response.json() != null) {
          this.PendingOrders = response.json();
          this.customersPaging();
        }
      });
  }
  //savePendingPayments
  savePendingPayments() {
    this.isLoading =true;
    this.increment = 0;
    this.recure();
  }
  //recure
  recure() {
    if (this.increment < this.PendingOrders.length) {
      var i = this.increment;
      var List = this.PendingOrders;
      console.log(this.PendingOrders);
      if (List[i].action == 1 && List[i].paid_Amount > 0) {
        $("#submitAdd").prop("disabled", false);
        this.saleOrderDetails = [];      
        var customerPaymentDetails = [];
        this.guid = UUID.UUID();
        var invoice = new salePayment(0, this.invoice_Date.getDateFinal(), 0, this.userCurrentOffice, List[i].customer_ID, 0, 0, 0, 0, 0, 0, List[i].paid_Amount, 0, List[i].id, this.guid, 1, 0,'', 0, this.invoice_Date.getDateFinal(), 0, 0, 0, this.logedInUserID, this.userCurrentWarehouse,0,0, customerPaymentDetails);
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
      this.getPendingSalePayment(this.areacode);
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
  routeCustomerReceipt() {
    this.router.navigate(['/customer_receipt']);
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


