import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ItemAdjustmentService, ItemsAdjustment, cDate, NgbDateFRParserFormatter, Employee, LoginService, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import { Router } from '@angular/router';
import swal from 'sweetalert';
@Component({
  selector: 'item-adjustment',
  templateUrl: './item-adjustment.component.html',
  styleUrls: ['./item-adjustment.component.scss'],
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
export class ItemAdjustmentComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
   
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  a: number = 1;
  filter: any;
  filter2: any;
  modalReference: NgbModalRef;
 isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;


  gridlist: any[] = [];
  adjustmentcode: any = 0;
  public adjustmentdate = new cDate();
  remarks: any = '';
  subcategory: any[] = [];
  subcategorycode: any = 1;
  subcategoryname: any = '';


  items: any[] = [];
  itemcode: any = 0;
  itemname: any = '';

  pysicalqty: any = 0.00;
  differenceqty: any = 0.00;

  itemadjuststatus: any = 0;
  page = 1;

  ShowModal: any = 'none';
  ShowGrid: any = '';

  ////////////////////////////
  userOffice: any;
  userCurrentOffice: any;
  userWarehouse: any;
  userCurrentWarehouse: any;
  userPrivilegedOffice: any;
  ////////////////////////////
  public permissionUtility:PermissionUtility=new PermissionUtility();
  constructor(public router: Router, private service: ItemAdjustmentService, private modalService: NgbModal, private LoginService: LoginService) {
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');

    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissionUtility.setPagePermissions(809116);
    $("#myInput").click();
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {

        this.gridlist = (response.json());
        this.isLoading = false;
        // console.log(response.json())

      });
  }
  //getFills
  getFills() {
    this.getSubCategory();
  }
  //getSubCategory
  getSubCategory() {
    this.isLoading =true;
    this.service.getSubCategory()
      .subscribe(response => {

        this.subcategory = response.json();
        this.subcategorycode = this.subcategory[0].subcategorycode;
        this.getItem(this.subcategorycode);
        this.isLoading = false;
      });
  }
  //getItem
  getItem(Code) {
    if (this.btnmode == true) {
      this.items = [];
      this.isLoading =true;
      this.service.getItem(Code, this.userCurrentOffice, this.userCurrentWarehouse)
        .subscribe(response => {
          if (this.items != null) {
            this.items = response.json();
            for (let i = 0; i < this.items.length; i++) {
              this.items[i].physicalQty = '';
            }
            //console.log(this.items)
            this.isLoading = false;
          }
          else { swal('No Item Found!') }

        });
    }
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    $("#submitAddAdjust").prop("disabled", false);
    $("#remove").prop("disabled", false);

    this.adjustmentdate = new cDate();
    this.itemadjuststatus = 0;
    this.subcategorycode = 0;
    this.subcategoryname = '';
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
  saveData(adjustable) {
    this.isLoading =true;
    var check = 0
    if (this.items.length >= 1) {
      for (let i = 0; i < this.items.length; i++)
        if (parseInt(this.items[i].physicalQty) >= 0) {
          check = 1;
        }
    }
    console.log(this.items);

    if (check != 0) {
      var data = new ItemsAdjustment(0, this.subcategorycode, this.adjustmentdate.getDateFinal(), this.remarks, adjustable, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, this.userCurrentWarehouse, this.items);
      //  console.log(data)
      if (this.items.length > 0) {
        this.service.saveData(data).then(
          (response) => {
            this.isLoading = false;
            this.getGrid();
            //this.modalReference.close();
            this.show(1);

          },
          (error) => console.log(error))
      }

    }
    else {
      this.isLoading = false;
      swal('Enter Physical Qty!')
    }


  }
  //updateData
  updateData() {
    this.isLoading =true;
    var data = new ItemsAdjustment(this.adjustmentcode, 0, this.adjustmentdate.getDateFinal(), '', 1, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, this.userCurrentWarehouse, this.items);
    if (this.items.length > 0) {
      this.service.updateData(data).then(
        (response) => {
          this.isLoading = false;
          this.getGrid();
          //this.modalReference.close();
          this.show(1);
          //swal("!")
        },
        (error) => console.log(error))

    }
    else {
      this.isLoading = false;
      swal('No Record!')
    }

  }
  //getDetailsByID
  getDetailsByID(ID, contentdetail) {
    this.adjustmentcode = ID;
    this.mode = true;
    this.btnmode = false;

    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = response.json();

        this.service.getSubCategory()
          .subscribe(response => {

            this.subcategory = response.json();
            this.subcategorycode = list[0].subcategorycode;
            this.items = [];
            this.isLoading =true;
            this.service.getAdjustedItemDetailsByID(ID)
              .subscribe(response => {
                this.items = response.json();
                console.log(this.items)
                this.isLoading = false;


                this.itemadjuststatus = list[0].status;
                if (this.itemadjuststatus > 0) {
                  $("#submitUpdate").prop("disabled", true);
                  $("#cancel").prop("disabled", true);
                }


              });
            this.isLoading = false;
          });


        this.adjustmentdate.setDate(list[0].adjustmentdate);
        this.remarks = list[0].remarks;





        console.log(list);
      });



    this.openDetail(contentdetail);

  }
  //getAdjustedItemDetailsByID
  getAdjustedItemDetailsByID(Code) {
    this.items = [];
    this.isLoading =true;
    this.service.getAdjustedItemDetailsByID(Code)
      .subscribe(response => {
        this.items = response.json();
        console.log(this.items)
        this.isLoading = false;
      });
  }
  //openAddModel
  open() {  
    this.show(2);
    this.clearFields();
  }
  //openDetail modal
  openDetail(content) {  
    this.show(2);
    $("#alertWarning").hide();
    $("#submitUpdate").prop("disabled", false);
    $("#cancel").prop("disabled", false);
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
  //checkStock
  checkStock(code, value) {
    console.log(code, value);
    var check = 0;
    if (this.items.length >= 1) {
      for (let i = 0; i < this.items.length; i++)
        if (this.items[i].item_AdjustmentDetail_ID == code) {
          if (parseFloat(this.items[i].systemQty) < parseFloat(value)) {
            check = 1;
          }
        }
    }

    //if (check != 0) {
    //  $("#submitAdd").prop("disabled", true);
    //  $("#submitAddAdjust").prop("disabled", true);

    //}
    //else {
    //  $("#submitAdd").prop("disabled", false);
    //  $("#submitAddAdjust").prop("disabled", false);
    //}

  }
  //cancelDraft
  cancelDraft() {
    this.isLoading =true;
    this.service.cancelDraft(this.adjustmentcode)
      .subscribe(response => {
        this.getGrid();
        this.modalReference.close();
        this.isLoading = false
        swal('Draft Canceled');
        this.show(1);
        ;
      });
  }
  //deleteRow
  deleteRow(id) {

    for (let i = 0; i < this.items.length; i++)
      if (this.items[i].item_Code == id) {
        //alert(id);
        this.items.splice(i, 1);
        console.log(this.items)
      }
  }
  show(Value) {  
    if (Value == '1') {
      this.ShowGrid = '';
      this.ShowModal = 'none';
    }
    else {
      this.ShowGrid = 'none';
      this.ShowModal = '';
    }
  }
  routeInvoice() {
    this.router.navigate(['/item-registration']);
  }
}



