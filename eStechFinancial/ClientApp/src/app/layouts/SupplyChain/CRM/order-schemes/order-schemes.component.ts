import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { OrderSchemeService, OrderScheme, OrderSchemeDetails, LoginService, SearchFilterService, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import swal from 'sweetalert';
import { TextMaskModule } from 'angular2-text-mask';
import { Router } from '@angular/router';
@Component({
  selector: 'order-schemes',
  templateUrl: './order-schemes.component.html',
  styleUrls: ['./order-schemes.component.scss'],
  encapsulation: ViewEncapsulation.None,
  //host: { '(window:keydown)': 'hotkeys($event)' },
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class OrderSchemesComponent implements OnInit {
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
  modalReference: NgbModalRef;
  isLoading: boolean;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;

  ID: any = 0;
  gridlist: any[] = [];

  public schemedate = new cDate();

  itemR: any[] = [];
  item: Array<Select2OptionData> = [];
  itemcodeM: any = 0;
  itemcode: any = 0;
  itemname: any = '';

  area: any[] = [];
  areacode: any = 0;
  areaname: any = '';

  schemeList: any[] = [];
  amount: any = 0;
  totalschemeqty: any = 0;
  totalschemeamount: any = 0;
  totalactualqty: any = 0;
  schemeDetailList: any[] = [];
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;


  constructor(public router: Router, private service: OrderSchemeService, private LoginService: LoginService, private searchfilter: SearchFilterService, private modalService: NgbModal) {
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

  ngOnInit() {

    //this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    //console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 140105) {
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
          //console.log(FUNCTIONALITY[i].page_Name)
        }
    }
    $("#myInput").click();
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getGrid
  getGrid() {
    this.isLoading = true;
    this.service.getGrid()
      .subscribe(response => {
        console.log(response.json());
        this.gridlist = (response.json());
        this.isLoading = false;
        //console.log(response.json())

      });
  }
  //getFills
  getFills() {
    this.getItems();
    this.getArea();

  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();

    this.itemcode = 0;
    this.area = [];
    this.areacode = 0;
    this.schemeList = [];
    this.schemeDetailList = [];
    this.amount = [];
    this.ID = 0;
    this.schemedate = new cDate();
    this.schemeList = [];


    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);

    this.getFills();
  }
  //getItems
  getItems() {
    this.isLoading = true;
    this.service.getItems(this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.itemR = response.json();
          this.item = this.getDropdownList(response.json(), "itemcode", "itemname");
          this.itemcodeM = this.item[0].id;
          this.itemcode = this.item[0].id;

          this.amount = 0;

          console.log(this.itemR)
        }

      });
  }
  //changeItem
  changeItem(e) {
    this.itemcode = e;
    if (this.btnmode) {
      //if (this.itemR != null) {
      //  for (let i = 0; i < this.itemR.length; i++)
      //    if (this.itemR[i].itemcode == this.itemcode) {
      //      this.amount = this.itemR[i].price;
      //    }
      //}
      this.amount = 0;
    }
    this.CalculateActualQty()
  }
  //getArea
  getArea() {
    this.isLoading = true;
    this.service.getArea()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.area = response.json();
          //this.areacode = this.area[0].areacode;
          //this.areaname = this.area[0].areaname;
        }
      });
  }
  //getRouteWiseSchemes
  getRouteWiseSchemes() {
    this.schemeList = [];
    if (this.areacode != 0) {
      this.isLoading = true;
      this.service.getRouteWiseSchemes(this.areacode, this.schemedate.getDateFinal())
        .subscribe(response => {
          this.isLoading = false;
          if (response.json() != null) {
            this.schemeList = response.json();    
          }
        });
    }
  }
  //open
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
    this.schemeList = [];
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

      ar.push({
        id: 0,
        text: '',
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
  //TotalSchemeQty
  TotalSchemeQty() {
    if (this.schemeList != null) {
      var list = this.schemeList
      var sum = 0;
      for (let i = 0; i < list.length; i++)
        if (list[i].marked) {
          sum = sum + parseFloat(list[i].schemeQty);
        }
      this.totalschemeqty = sum;
      return sum.toFixed(2)
    }
  }
  //TotalSchemeAmount
  TotalSchemeAmount() {
    if (this.schemeList != null) {
      var list = this.schemeList
      var sum = 0;
      for (let i = 0; i < list.length; i++)
        if (list[i].marked) {
          sum = sum + parseFloat(list[i].schemeAmount);
        }
      this.totalschemeamount = sum;
      return sum.toFixed(2)
    }
  }
  //TotalActualQty
  TotalActualQty() {
    if (this.schemeList != null) {
      var list = this.schemeList
      var sum = 0;
      for (let i = 0; i < list.length; i++)
        if (list[i].marked) {
          sum = sum + parseFloat(list[i].actualQty);
        }
      this.totalactualqty = sum;
      return sum.toFixed(2)
    }
  }
  //CalculateTotals
  CalculateTotals() {
    this.TotalSchemeQty();
    this.TotalSchemeAmount();
    this.TotalActualQty();
  }
  //CalculateActualQty
  CalculateActualQty() {
    if (this.amount > 0) {
      if (this.schemeList != null) {
        var list = this.schemeList

        for (let i = 0; i < list.length; i++) {
          var value = 0;
          value = parseFloat(list[i].schemeAmount) / this.amount;
          if (value % 1 === 0) {
            list[i].actualQty = value;
            list[i].marked = 1;
            list[i].disabled = 0;
          }
          else {
            list[i].actualQty = 0;
            list[i].marked = 0;
            list[i].disabled = 1;
          }
        }

      }
    }
    else {
      if (this.schemeList != null) {
        var list = this.schemeList

        for (let i = 0; i < list.length; i++) {

          list[i].actualQty = 0;
          list[i].marked = 0;
          list[i].disabled = 1;
        }
      }
    }

    this.CalculateTotals();
  }
  //CreateSchemeDetail
  CreateSchemeDetail() {
    this.isLoading = true;
    var Array = [];
    this.schemeDetailList = [];
    for (let i = 0; i < this.schemeList.length; i++) {

      if (this.schemeList[i].marked) {
        let row = {} as OrderSchemeDetails;
        row.schemeDetail_ID = 0;

        if (this.btnmode)
          row.scheme_ID = 0;
        else
          row.scheme_ID = this.ID;

        row.saleOrder_ID = this.schemeList[i].saleOrder_ID;
        row.customer_ID = this.schemeList[i].customer_ID;
        row.item_Code = this.schemeList[i].item_Code;
        row.saleQty = this.schemeList[i].saleQty;
        row.schemeQty = this.schemeList[i].schemeQty;
        row.schemeAmount = this.schemeList[i].schemeAmount;
        row.actualQty = this.schemeList[i].actualQty;
        row.schemeItemCode = this.schemeList[i].schemeItemCode;
        row.schemeItemAmount = this.schemeList[i].schemeItemAmount;
        Array.push(row);


      }
    }
    this.schemeDetailList = Array;
    this.isLoading = false;
  }
  //saveData
  saveData() {
    this.CreateSchemeDetail();
    this.isLoading = true;
    console.log(this.schemeDetailList)
    var data = new OrderScheme(0, 0, this.schemedate.getDateFinal(), this.areacode, this.itemcode, this.amount, this.totalschemeqty, this.totalschemeamount, this.totalactualqty, this.logedInUserID, this.UserSessionID, this.schemeDetailList);
    console.log(data);
    this.service.saveData(data).then(
      (response) => {
        this.isLoading = false;
        this.routeInvoice();
        //this.getGrid();

        this.modalReference.close();
      },
      (error) => console.log(error));

  }
  //updateData
  updateData() {
          this.CreateSchemeDetail();
          this.isLoading = true;
          console.log(this.schemeDetailList)
          var data = new OrderScheme(this.ID, 0, this.schemedate.getDateFinal(), this.areacode, this.itemcode, this.amount, this.totalschemeqty, this.totalschemeamount, this.totalactualqty, this.logedInUserID, this.UserSessionID, this.schemeDetailList);
          console.log(data);
          this.service.updateData(data).then(
            (response) => {
              this.getGrid();
              this.isLoading = false;
              this.modalReference.close();
            },
            (error) => console.log(error));       
  }
  //getDetailsByID
  getDetailsByID(ID, contentdetail) {

    this.mode = true;
    this.btnmode = false;
    this.isLoading = true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          var list = response.json();
          this.ID = ID;
          var cancel = list[0].cancel;
          if (cancel) {
            $("#cancelBtn").hide();
            $("#submitUpdate").hide();
          }
          else {
            $("#cancelBtn").show();
            $("#submitUpdate").show();

          }

          this.schemedate.setDate(list[0].sodate);
          this.service.getArea()
            .subscribe(response => {
              this.isLoading = false;

              if (response.json() != null) {
                this.area = response.json();
                this.areacode = list[0].areacode;
              }

            });

          this.service.getItems(this.userCurrentOffice, this.userCurrentWarehouse)
            .subscribe(response => {
              if (response.json() != null) {
                this.item = this.getDropdownList(response.json(), "itemcode", "itemname");
                this.itemcodeM = list[0].itemcode;
                this.itemcode = list[0].itemcode;

                this.amount = list[0].amount;

                this.getSchemeDetailsByID(ID);
              }

            });

        }
      });

    this.openDetail(contentdetail);

  }
  //getSchemeDetailsByID
  getSchemeDetailsByID(ID) {

    this.isLoading = true;
    this.service.getSchemeDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          this.schemeList = response.json();


          var list = this.schemeList;
          var flag = false;
          for (let i = 0; i < list.length; i++) {
            if (list[i].disabled) {
              $("#cancelBtn").hide();
              $("#submitUpdate").hide();
              flag = true;
            }
          }
          if (flag)
            swal('Record Cannot Be Updated..It is Being Used !');

        }
      });



  }
  //cancelScheme
  cancelScheme() {
    this.isLoading = true;
    //alert(this.ID)
    this.service.cancelScheme(this.ID)
      .subscribe(response => {
        this.isLoading = false;
        this.getGrid();
        this.modalReference.close();
      });
  }
  //routeInvoice
  routeInvoice() {
    this.router.navigate(['/sale-order']);
  }
}

interface OrderSchemeDetailsData {
  schemeDetail_ID: any;
  scheme_ID: any;
  saleOrder_ID: any;
  customer_ID: any;
  item_Code: any;
  saleQty: any;
  schemeQty: any;
  schemeAmount: any;
  actualQty: any;
}



