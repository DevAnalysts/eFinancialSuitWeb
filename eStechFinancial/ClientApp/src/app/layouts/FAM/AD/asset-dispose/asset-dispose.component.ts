//import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetDisposeService, LoginService, AssetDispose, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';

@Component({
  selector: 'asset-dispose',
  templateUrl: './asset-dispose.component.html',
  styleUrls: ['./asset-dispose.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetDisposeComponent implements OnInit {
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';

  edit: any = false;
  contentTemp: any;
  p: number = 1;
  modalReference: NgbModalRef;
  guid: any;
  grid: any[] = [];
 isLoading: any = false;
  closeResult: string;
  mode: any = false;
  btnMode: any = true;
  ID: any = "";
   
  office: any[] = [];
  officecode: any = 0;
  officename: any = "";

  item: Array<Select2OptionData> = [];
  itemR: any[] = [];
  itemcodeM: any = 0;
  itemcode: any = 0;
  itemname: any = "";

  disposabledate: any = new cDate()


  acquisitiondate: any = "";
  purchasecost: any = "";
  depreciationdate: any = "";
  totaldepreciation: any = "";
  bookvalue: any = "";
  disposalvalue: any = 0;
  disposalreason: any = "";
  incometax: any = 0;
  disposedto: any = "";
  address: any = "";
  remarks: any = "";
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;

  constructor(private service: AssetDisposeService, private LoginService: LoginService, private modalService: NgbModal) { 

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
  }

  ngOnInit() {
     this.getGrid(this.ID);
     this.setPageInfo(74322);
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
  getGrid(value: string) {
    this.isLoading =true;
    this.service.getGrid(value,this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.grid = (response.json());
          this.isLoading = false;
          //console.log(response.json());
        }
        else{
          this.grid = [];
        this.isLoading = false;
        
        }
        
      });
  }
  //changeDate
  changeDate(e) {

    var DepreciationDate = new Date(this.disposabledate.getDateFinal().toString());
    //var lastDayOfMonth = new Date(DepreciationDate.getFullYear(), DepreciationDate.getMonth() + 1, 0);
    //this.depreciationdate.setDate(lastDayOfMonth);
    //console.log(lastDayOfMonth)
  }
  //getOffice
  getOffice() {
    this.isLoading =true;
    this.service.getOffice(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.office = (response.json());
        //this.officecode = this.office[0].officecode;
        //this.officename = this.office[0].officename;

        //  console.log(response.json());
      });
  }
  //ChangeOffice
  changeOffice() {
    this.itemcode = 0;
    this.item = [];
    this.getItem(this.officecode);
  }
  //getItem
  getItem(ID) {
    this.isLoading =true;
    this.service.getItem(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.item = this.getDropdownList(response.json(), "itemcode", "itemname");
          this.itemR = response.json();
        }
        
      });
  }
  //changeItem
  changeItem(e: any) {
    this.itemcode = e;

    var list = this.itemR;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].itemcode == this.itemcode) {
          this.acquisitiondate = list[i].acquisitiondate;
          this.purchasecost = list[i].puchasecost;
        }
    }

    this.getAssetDepreciation(this.itemcode);



  }
  //getAssetDepreciation
  getAssetDepreciation(ID) {
    this.depreciationdate = '';
    this.totaldepreciation = '';
    this.bookvalue = '';
    this.isLoading =true;
    this.service.getAssetDepreciation(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var list = (response.json());
          this.depreciationdate = list[0].depdate;
          this.totaldepreciation = list[0].deptotalamount;
          this.bookvalue = list[0].bookvalue;


        }
      });
  }

  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;

    this.officecode = 0;

    this.itemcode = 0;

    this.getOffice();
    //this.getItem();

  }
  ////saveData
  saveData() {

    var data = new AssetDispose(0, this.officecode, this.itemcode, this.disposabledate.getDateFinal(), this.disposalvalue, this.incometax, this.disposedto, this.address, this.remarks, this.logedInUserID, this.UserSessionID);
    console.log(data);

    this.service.saveData(data).then(
      (response) => {
        this.getGrid(this.ID);
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error)
    );

  }
  //getDetailsByID
  getDetailsByID(ID, content) {
    this.edit = true;
    this.opendetail(content);

    this.mode = true;
    this.btnMode = false;
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        var list = response.json();

        this.isLoading =true;
        this.service.getOffice(this.priviledged_Offices)
          .subscribe(response => {
            this.isLoading = false;
            this.office = (response.json());
            this.officecode = list[0].officecode;


            this.isLoading =true;
            this.service.getItem(list[0].officecode)
              .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                  this.item = this.getDropdownList(response.json(), "itemcode", "itemname");
                  this.itemR = response.json();
                  this.itemcodeM = list[0].assetcode;

                  this.disposalvalue = list[0].disposalprice;
                  this.incometax = list[0].disposaltax;
                  this.disposedto = list[0].disposedTo;
                  this.address = list[0].address;
                  this.remarks = list[0].remarks;
                }

              });

          });
       


      });

  }
  //open Model
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
  }
  //opendetail
  opendetail(content) {

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
    ////this.clearFields();
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
  //convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      ar.push({
        id: 0,
        text: ""
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


}










