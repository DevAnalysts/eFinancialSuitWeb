import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DisposalVoucherService, LoginService, DisposalVoucher, AssetDepreciateDetails, cDate, NgbDateFRParserFormatter, voucher } from '../../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'disposal-voucher',
  templateUrl: './disposal-voucher.component.html',
  styleUrls: ['./disposal-voucher.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DisposalVoucherComponent implements OnInit {
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0; 
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none'; 
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';

    id: any = "";

  p: number = 1;
  modalReference: NgbModalRef;
  guid: any;
  closeResult: string;
  mode: any = 0;
  btnmode: any = 0;
  date = new Date();
  EditItemButton: any = '';
  RemoveItemButton: any = '';
 isLoading: any = false;


  grid: any[] = [];
  vouchers: any[] = [];
  public vouchercode: any = 0;
  public voucherdate = new cDate();

  office: any[] = [];
  officecode: any = 0;
  officename: any = "";

  remarks: any = "";
  ////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
 
  constructor(private service: DisposalVoucherService, private ngbDateParserFormatter: NgbDateParserFormatter, private LoginService: LoginService,
    private modalService: NgbModal) {
  
      this.userOffice = this.LoginService.getSession('userOffice');
      this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
      this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
      this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
      this.priviledged_Offices = this.userPrivilegedOffice;
  }

  ngOnInit() {
    this.getGrid();

    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.setPageInfo(79770);
  }
   ////////////////////////
   setPageInfo(value) {
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    if (FUNCTIONALITY.length >= 1) {
      var arr = FUNCTIONALITY.filter(f => f.page_Code == value);
      //console.log(arr);
      if (arr.length > 0) {
        this.FUNCTIONALITYNAME = arr[0].page_Name;
        //console.log( arr[0].page_Name);
        this.FUNCTIONALITYDETAILNAME = arr[0].pd;
        //console.log('C' +arr[0].pd);
        //RolePermissions
        if (arr[0].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
        if (arr[0].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
        if (arr[0].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
        if (arr[0].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
        if (arr[0].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };
 
        //AuditTrail
        this.UserSessionID = arr[0].userSessionID;
      }
    }
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.grid = (response.json());
          //console.log(response.json());
        }
        else{
          this.isLoading = false;
        this.grid = [];
        }
        
      });
  }
  //getOffice
  getOffice() {
    this.isLoading =true;
    this.service.getOffice(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.office = (response.json());
        this.officecode = this.office[0].officecode;
        this.officename = this.office[0].officename;

          console.log(response.json());
      });
  }
  //getRecords
  getRecords() {
    this.isLoading =true;
    this.service.getRecords(0)
      .subscribe(response => {
        this.isLoading = false;
        this.vouchers = (response.json());
        console.log(response.json());
      });
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {

      //if (this.btnmode)
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
  //clearFields
  clearFields() {
    this.remarks = "";
    this.mode = false;
    this.btnmode = true;


    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.guid = UUID.UUID();

    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
this.getOffice();
  }

  //saveData
  saveData() {
    var data = [];
    let emptyRow = {} as DepVouchers;
    for (let i = 0; i < this.vouchers.length; i++) {
      if (this.vouchers[i].status == true) {
        emptyRow.disposalID = this.vouchers[i].disposalID;
        emptyRow.creationdate = this.voucherdate.getDateFinal();
        emptyRow.disposalDate = this.vouchers[i].disposalDate;
        emptyRow.salePrice = this.vouchers[i].salePrice;
        data.push(emptyRow);
      }
    }
   

    console.log(data);
    this.isLoading =true;
    if (emptyRow!=null) {
      this.service.saveData(data).then(
        (response) => {
          this.isLoading = false;
          this.getGrid(); 
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("Please! Insert at least one record.");
      return;
    }

  }
  //////updateData
  ////updateData() {

  ////  this.isLoading =true;
  ////  var order = new AssetRequisition(this.requisitioncode, this.requisitiondate.getDateFinal(), this.employeecode, this.remarks, this.logedInUserID, this.UserSessionID, this.AssetRequisitionDetails);
  ////  this.service.updateData(order).then(
  ////    (response) => {
  ////      this.isLoading = false;
  ////      this.getGrid();
  ////      this.modalReference.close();
  ////      console.log(response);
  ////    },
  ////    (error) => console.log(error))

  ////}
  //getDetailsByID
  getDetailsByID(ID,isApproved, content) {
    this.isLoading =true;
    this.detailOpen(content);
    this.mode = true;
    this.btnmode = false;
    this.service.getRecords(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.vouchers = (response.json());
          console.log(response.json());
          this.getOffice();
      });
  }

  // open modal
  open(content) {
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
    this.clearFields();
    $("#submitAdd").show();
    $("#submitUpdate").hide();
  }
  // detailOpen modal
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
interface DepVouchers {
  disposalID: number;
  creationdate: string;
  disposalDate: string;
  salePrice: number;
}
