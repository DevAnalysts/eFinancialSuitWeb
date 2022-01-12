import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetRequisitionService, LoginService, AssetRequisition, AssetRequisitionDetails, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'asset-requisition',
  templateUrl: './asset-requisition.component.html',
  styleUrls: ['./asset-requisition.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetRequisitionComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();

  p: number = 1;
  submitAdd:any;
  submitUpdate:any;
  modalReference: NgbModalRef;

  AssetRequisitionDetails: any[];
  guid: any;

  closeResult: string;
  mode: any = 0;
  btnmode: any = 0;
  date = new Date();

    grid: any[] = [];
    order_ID: any;

  employee: Array<Select2OptionData>;
  public employeecodeM: any = 1;
  public employeecode: any = 1;
  public employeename: any;

  items: Array<Select2OptionData>;
  public itemcodeM: any = 1;
  public itemcode: any = 1;
  public itemname: any;
  public quantity: any = 1;
  public item_Detail: any = '';
  public remarks: any;

 isLoading: any = false;

  public requisitioncode: any = 0;
  public requisitiondate = new cDate();
  EditItemButton: any = '';
  RemoveItemButton: any = '';
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
  constructor(private service: AssetRequisitionService, private ngbDateParserFormatter: NgbDateParserFormatter, private LoginService: LoginService,
    private modalService: NgbModal) {
    this.AssetRequisitionDetails = new Array<AssetRequisitionDetails>();
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
  }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.permissionUtility.setPagePermissions(70011);
     
  }
   
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid(this.priviledged_Offices)
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
  //getEmployee
  getEmployee() {
    this.isLoading =true;
    this.service.getEmployee(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.employee = this.getDropdownList(response.json(), "employeecode", "employeename");
          this.employeecode = this.employee[0].id;
          this.employeename = this.employee[0].text;
        }
      });
  }
  //changeEmployee
  changeEmployee(e: any) {
    this.employeecode = e;
    var list = this.employee;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].id == this.employeecode) {
          this.employeename = list[i].text;
        }
    }

  }
  //getItems  
  getItems() {
    this.isLoading =true;
    this.service.getItems()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.items = this.getDropdownList(response.json(), "itemcode", "itemname");
          //this.itemcode = this.items[0].id;
          //this.itemname = this.items[0].text;
        }
      });
  }
  //changeItems
  changeItems(e: any) {
    this.itemcode = e;
    // console.log(this.itemcode, 'ADD')
    var list = this.items;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].id == this.itemcode) {
          this.itemname = list[i].text;
        }
    }

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
    this.employeecode = 0;
    this.itemcode = 0;
    this.requisitioncode = 0;


    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.guid = UUID.UUID();
    this.AssetRequisitionDetails = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);

    this.getEmployee();
    this.getItems();

  }
  //updateItem 
  updateItem(i: AssetRequisitionDetails, e: any) {
    this.itemcode = e;
    // console.log(this.itemcode, 'UPDATE')
    var list = this.items;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].id == this.itemcode) {
          this.itemname = list[i].text;
        }
    }

    i.itemid = this.itemcode;
    i.itemname = this.itemname;
  }
  //changeMode
  changeMode(idx: any, i: AssetRequisitionDetails, Mode: any) {
    var flag = false;
    if (this.AssetRequisitionDetails.length > 0) {
      for (var count = 0; count < this.AssetRequisitionDetails.length; count++) {
        if (this.AssetRequisitionDetails[count].id == i.itemid && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {
      if (flag == false) {
        if (i.quantity > 0) {
          i.edit_Mode = false;
        } else {
          swal("Quantity should be greater then 0");
          return;
        }
      }
      else {
        swal("Already Exists");
        return;
      }
    }
    else if (Mode == 2) {
      this.AssetRequisitionDetails.splice(idx, 1);

    }
    else {
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.itemid) {
          this.itemcodeM = this.items[j].id;
          // console.log('here')
          //this.itemcode = this.items[j].id;
          break;
        }
      }

      console.log(i);
      i.edit_Mode = true;
    }

    if (Mode == 1) {
      $("#AddNewItemRow").hide();
      this.EditItemButton = 'disabled';
      this.RemoveItemButton = 'disabled';

    }
    else {
      $("#AddNewItemRow").show();
      this.EditItemButton = '';
      this.RemoveItemButton = '';

    }

  }
  //addGrid
  addGrid(itemcode: any, itemname: any, quantity: any) {


    $("#submitAdd").prop("disabled", false);
    if (itemcode > 0) {
      if (quantity > 0) {

        var flag = false;
        if (this.AssetRequisitionDetails.length > 0) {
          for (var count = 0; count < this.AssetRequisitionDetails.length; count++) {
            if (this.AssetRequisitionDetails[count].itemid == itemcode) {
              flag = true;
              break;
            }
          }
        }
        if (flag == false) {

          // console.log(itemcode, itemname, quantity);

          this.AssetRequisitionDetails.push(new AssetRequisitionDetails(0, 0, itemcode, itemname, quantity, 0, 0));
          if (this.itemcodeM == 0)
            this.itemcodeM = -1;
          else
            this.itemcodeM = 0;

          this.itemcode = 0; this.itemname = ''; this.quantity = 1;
          //console.log(this.itemcodeM)
          this.mode = false;
          return;
        }
        else {
          swal("Already Exists");
          return;
        }
      }
      else {
        swal("Qty is required. Qty not be zero and should be numeric");
        $("#txt").focus();
        return;
      }
    }
    else {
      swal("Item is Required.");
      $("#txt").focus();
      return;
    }

  }
  //saveData
  saveData() {

    this.isLoading =true;
    var order = new AssetRequisition(0, this.requisitiondate.getDateFinal(), this.employeecode, this.remarks,this.logedInUserID, this.UserSessionID, this.AssetRequisitionDetails);
    if (this.AssetRequisitionDetails.length > 0) {
      this.service.saveData(order).then(
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
      this.isLoading=false;
      return;
    }

  }
  //updateData
  updateData() { 
    this.isLoading =true; 
    var order = new AssetRequisition(this.requisitioncode, this.requisitiondate.getDateFinal(), this.employeecode, this.remarks, this.logedInUserID, this.UserSessionID, this.AssetRequisitionDetails);
    this.service.updateData(order).then(
      (response) => {
        this.isLoading = false;
        this.getGrid();
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))

  }
  //getDetailsByID
  getDetailsByID(ID,isApproved, content) {


    this.isLoading =true;
    this.detailOpen(content);
    this.mode = true;  
    this.btnmode = false;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        var list = response.json();

        this.requisitioncode = ID;
        this.requisitiondate.setDate(list[0].requisitiondate);
        this.remarks = list[0].remarks;      
         if(this.permissionUtility.PermissionView=='')
         {$("#Approve").hide();}
          if (isApproved) {
            $("#Approve").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);

            $("#AddNewItemRow").hide();
            $("#edit1").hide();
            $("#remove").hide();

          } else {
            $("#Approve").prop("disabled", false);
            $("#submitUpdate").prop("disabled", false);

            $("#AddNewItemRow").show();
            $("#edit1").show();
            $("#remove").show();
          }


        this.isLoading =true;
        this.service.getEmployee(this.priviledged_Offices)
          .subscribe(response => {
            this.isLoading = false;
            if (response.json() != null) {
              this.employee = this.getDropdownList(response.json(), "employeecode", "employeename");
              this.employeecodeM = list[0].requestedbyid;
              this.employeecode = list[0].requestedbyid;

              this.isLoading =true;
              this.service.getItems()
                .subscribe(response => {
                  this.isLoading = false;
                  if (response.json() != null) {
                    this.items = this.getDropdownList(response.json(), "itemcode", "itemname");

                    var itemsList = response.json();
                    if (itemsList != null) {
                    this.AssetRequisitionDetails = list[0].assetrequisitiondetails;

                      this.isLoading =true;
                      for (let a = 0; a < this.AssetRequisitionDetails.length; a++) {
                        for (let i = 0; i < itemsList.length; i++) {
                          if (this.AssetRequisitionDetails[a].itemid == itemsList[i].itemcode) {
                            this.AssetRequisitionDetails[a].itemname = itemsList[i].itemname;
                            break;
                          }
                        }
                      }

                                  
  if(this.permissionUtility.PermissionEdit=='' || this.permissionUtility.PermissionEdit==" ")
    { 
      $("#submitUpdate").show();
      $("#Approve").show();
    }
                      this.isLoading = false;
                    }

                  }

                });
            }
          });
      });
  }
  
  //Approve
  Approve() {
    this.isLoading =true;
    this.service.approveRequisition(this.requisitioncode)
      .subscribe(response => {
        this.isLoading = false;
        this.getGrid();
        this.modalReference.close();
        console.log(response);
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
