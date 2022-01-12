import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetApprovalService, LoginService, AssetRequisition, AssetRequisitionDetails, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'asset-approval',
  templateUrl: './asset-approval.component.html',
  styleUrls: ['./asset-approval.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetApprovalComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  p: number = 1;
  modalReference: NgbModalRef;
  assemblies: any[] = [];
  AssetRequisitionDetails: any[];
  guid: any;
  closeResult: string;
  mode: any = 0;
  btnmode: any = 0;
    date = new Date();
    order_ID: any;

  requisitionListR: any[] = [];
  requisitionList: Array<Select2OptionData>;
  public reqcodeM: any = 1;
  public reqcode: any = 1;
  public reqno: any;
  public reqdate: any;
  public remarks: any;
  submitAdd:any;
  submitUpdate:any;

  employee: any[] = [];
  public empcode: any = 1;
  public empname: any = '';

 isLoading: any = false;
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
  constructor(private service: AssetApprovalService, private ngbDateParserFormatter: NgbDateParserFormatter, private LoginService: LoginService,
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
    this.permissionUtility.setPagePermissions(70012);
    
  }
   
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid(this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
        this.assemblies = (response.json());
        //console.log(response.json());
        }
        else{
          this.isLoading = false;
        this.assemblies = [];
        }
        
      });
  }
  //getRequisition
  getRequisition() {
    this.isLoading =true;
    this.service.getRequisition()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.requisitionList = this.getDropdownList(response.json(), "reqcode", "reqno");
          this.requisitionListR = response.json();
        }
      });
  }
  //changeRequisition
  changeRequisition(e: any) {
    this.reqcode = e;
    var list = this.requisitionListR;
    console.log(list);
    if (list != null) {
      for (let i = 0; i < list.length; i++)
        if (list[i].reqcode == e.value) {
          this.reqno = list[i].reqno;
          this.reqdate = list[i].reqdate;
          this.getEmployee(list[i].reqby);
          this.getRequisitionDetails(this.reqcode);
        }
    }

  }
  //getRequisitionDetails
  getRequisitionDetails(ID) {
    this.AssetRequisitionDetails = [];
    this.isLoading =true;
    this.service.getRequisitionDetails(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.AssetRequisitionDetails = response.json();
      });
  }
  //getEmployee
  getEmployee(ID) {
    this.service.getEmployee(ID)
      .subscribe(response => {
        if (response.json() != null) {
          this.employee = (response.json());
          this.empcode = this.employee[0].empcode;
          this.empname = this.employee[0].empname;
        }

      });
  }
  //checkQuantity
  checkQuantity(i: AssetRequisitionDetails, ApprovedQty) {
    console.log(i.itemid, ApprovedQty); 
    if (i.quantity < ApprovedQty) {
      i.approvedquantity = i.quantity;
      swal('Enter Approved Quantity Less Than Or Equal To Requisition Quantity')
    }
    else if (i.approvedquantity < 0) {
      i.approvedquantity = 0;
    }
  }
  //rejectItem
  rejectItem(i: AssetRequisitionDetails, value) {
    console.log(i.itemid, value);
    if (value == 0) {
      i.approvedquantity = -1;
      i.edit_Mode = true;
    }
    else {
      i.approvedquantity = 0;
      i.edit_Mode = false;
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
    this.empcode = 0;
    this.empname = '';

    this.reqdate = 0;
    this.reqno = '';
    this.reqdate = '';
    this.AssetRequisitionDetails = [];



    this.guid = UUID.UUID();
    this.AssetRequisitionDetails = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);

    this.getRequisition();

  }
  //saveData
  saveData() {

    this.isLoading =true;
    var order = new AssetRequisition(this.reqcode, null, 1, null,this.logedInUserID, this.UserSessionID, this.AssetRequisitionDetails);
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
    var order = new AssetRequisition(this.reqcode, null, 1, null,this.logedInUserID, this.UserSessionID, this.AssetRequisitionDetails);
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
  getDetailsByID(ID, content) {
 if(this.permissionUtility.PermissionView==''){
   this.submitAdd='none';
   this.submitUpdate='none';
 }

    this.isLoading =true;
    this.detailOpen(content);
    this.mode = true;
    this.btnmode = false;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        var list = response.json();

        this.reqcode = list[0].reqcode;
        this.reqno = list[0].reqno;
        this.reqdate = list[0].reqdate;


        this.isLoading =true;
        this.service.getItems()
          .subscribe(response => {
            this.isLoading = false;

            if (response.json() != null) {
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
                this.isLoading = false;

              }

            }

          });


        this.getEmployee(list[0].reqby);

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
