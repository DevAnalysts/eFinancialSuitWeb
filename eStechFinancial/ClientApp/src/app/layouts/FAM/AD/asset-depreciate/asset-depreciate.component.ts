//import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetDepreciateService, LoginService, AssetDepreciate, AssetDepreciateDetails, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';

@Component({
  selector: 'asset-depreciate',
  templateUrl: './asset-depreciate.component.html',
  styleUrls: ['./asset-depreciate.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class AssetDepreciateComponent implements OnInit {
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

  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = "";

  subcategory: any[] = [];
  subcategorycode: any = 0;
  subcategoryname: any = "";

  item: Array<Select2OptionData> = [];
  itemR: any[] = [];
  itemcodeM: any = 0;
  itemcode: any = 0;
  itemname: any = "";

  selectedAll: any;

  depreciationrate: any;
  public depreciationdate = new cDate();

  DepreciationList: any[] = [];
 ////////////////////////
 userOffice: any;
 userPrivilegedOffice: any;
 userCurrentOffice: any;
 userCurrentWarehouse: any;
 priviledged_Offices: any;

  constructor(private LoginService: LoginService,private service: AssetDepreciateService,  private modalService: NgbModal) { 

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;

  }

  ngOnInit() {
      this.getGrid(this.ID);
      this.setPageInfo(70008);
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

    var DepreciationDate = new Date(this.depreciationdate.getDateFinal().toString());
    var lastDayOfMonth = new Date(DepreciationDate.getFullYear(), DepreciationDate.getMonth() + 1, 0);
    this.depreciationdate.setDate(lastDayOfMonth);
    //console.log(lastDayOfMonth)
  }
  //getOffice
  getOffice() {
    //this.isLoading =true;
    this.service.getOffice(this.priviledged_Offices)
      .subscribe(response => {
        // this.isLoading = false;
        this.office = (response.json());
        this.officecode = this.office[0].officecode;
        this.officename = this.office[0].officename;

        //  console.log(response.json());
      });
  }
  //getCategory
  getCategory() {
      this.isLoading =true;
    this.category = [];
    this.service.getCategory()
      .subscribe(response => {
        this.isLoading = false;
        this.category = (response.json());
      });
    console.log("1 categorycode: " + this.categorycode + " subcategory: " + this.subcategorycode + " itemcode: " + this.itemcode);
  }
  //changeCategory
  changeCategory() {
    if (this.itemcodeM != -1)
      this.itemcodeM = -1;
    else
      this.itemcodeM = 0;
    //this.item = [];

    this.subcategory = [];
    this.subcategorycode = 0;
    this.getSubCategory(this.categorycode);

    var list = this.category;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].categorycode == this.categorycode) {
          this.depreciationrate = list[i].rate;
        }
    }
    console.log("2 categorycode: " + this.categorycode + " subcategory: " + this.subcategorycode + " itemcode: " + this.itemcode);


  }
  //getSubCategory
  getSubCategory(ID) {
    this.isLoading =true;
    this.service.getSubCategory(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.subcategory = (response.json());
      });
    console.log("3 categorycode: " + this.categorycode + " subcategory: " + this.subcategorycode + " itemcode: " + this.itemcode);
  }
  //changeSubCategory
  changeSubCategory() {
    if (this.itemcodeM != -1)
      this.itemcodeM = -1;
    else
      this.itemcodeM = 0;
    //this.item = [];
    console.log("4 categorycode: " + this.categorycode + " subcategory: " + this.subcategorycode + " itemcode: " + this.itemcode);
    this.getItem(this.subcategorycode);
  }
  //getItem
  getItem(ID) {
    this.isLoading =true;
    this.service.getItem(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.item = this.getDropdownList(response.json(), "itemcode", "itemname");
        this.itemR = response.json();

      });
    console.log("5 categorycode: " + this.categorycode + " subcategory: " + this.subcategorycode + " itemcode: " + this.itemcode);
  }
  //changeItem
  changeItem(e: any) {
    this.itemcode = e;

    ////if (this.itemcode > 0) {
    ////  this.categorycode = 0;
    ////  this.categoryname = "";

    ////  var list = this.itemR;
    ////  if (list.length >= 1) {
    ////    for (let i = 0; i < list.length; i++)
    ////      if (list[i].itemcode == this.itemcode) {
    ////        this.depreciationrate = list[i].rate;
    ////      }
    ////  }

    ////}
    console.log("6 categorycode: " + this.categorycode + " subcategory: " + this.subcategorycode + " itemcode: " + this.itemcode);
    ////console.log(this.categorycode + " " + this.itemcode);
  }
  //getDepreciationRecord
  getDepreciationRecord() {
    this.DepreciationList = [];

    if (this.categorycode > 0 || this.itemcode > 0) {
      this.isLoading =true;
      this.service.getDepreciationRecord(this.officecode, this.categorycode,this.subcategorycode, this.itemcode, 0, 0)
        .subscribe(response => {
          this.isLoading = false;
          if (response.json() != null) {
            var list = (response.json());

            console.log(response.json());
            this.calculateDepreciation(list);
          }

        });
    }
    else {
      swal('Select Category Or Item!');
    }

  }
  //calculateDepreciation
  calculateDepreciation(list) {
    if (list != null) {
      for (let i = 0; i < list.length; i++) {
        var DepreciationDateTo = new Date(this.depreciationdate.getDateFinal().toString());
        var LastDepreciationDate = new Date(list[i].lastDepDate);
        console.log("LastDep :", LastDepreciationDate, "DepTo :", DepreciationDateTo);


        var MonthsToDepreciate;
        MonthsToDepreciate = (DepreciationDateTo.getFullYear() - LastDepreciationDate.getFullYear()) * 12;
        MonthsToDepreciate -= LastDepreciationDate.getMonth() + 1;
        MonthsToDepreciate += DepreciationDateTo.getMonth() + 1;
        MonthsToDepreciate <= 0 ? 0 : MonthsToDepreciate;
        console.log("months :", MonthsToDepreciate);

        if (MonthsToDepreciate > 0) {
          var RatePerMonth = parseFloat(this.depreciationrate) / 12;
          var RateToDepreciate = RatePerMonth * MonthsToDepreciate;
          var ValueToDeduct = parseFloat(list[i].openingBalance) * (RateToDepreciate / 100);
          console.log("ValueToDeduct :", ValueToDeduct);
          list[i].bookValue = ValueToDeduct;
          list[i].bookValue = parseFloat(list[i].bookValue).toFixed(2);

          list[i].currentDepreciation = parseFloat(list[i].openingBalance) - ValueToDeduct;
          list[i].currentDepreciation = parseFloat(list[i].currentDepreciation).toFixed(2);
        }
      }

      this.DepreciationList=list;
    }

  }

  //selectAll
  selectAll() {
    for (var i = 0; i < this.DepreciationList.length; i++) {
      this.DepreciationList[i].active = this.selectedAll;
    
    }
  }


  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;

    this.officecode = 0;
    this.categorycode = 0;
    this.itemcode = 0;
    this.DepreciationList = [];

    this.getOffice();
    this.getCategory();

    var DepreciationDate = new Date(this.depreciationdate.getDateFinal().toString());
    var lastDayOfMonth = new Date(DepreciationDate.getFullYear(), DepreciationDate.getMonth() + 1, 0);
    this.depreciationdate.setDate(lastDayOfMonth);



  }
  ////saveData
  saveData() {

    var data = new AssetDepreciate(0, this.depreciationdate.getDateFinal(), this.logedInUserID, this.UserSessionID, this.DepreciationList);
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
        this.depreciationdate.setDate(list[0].depdate);

        this.service.getOffice(this.priviledged_Offices)
          .subscribe(response => {
            this.office = (response.json());
            this.officecode = list[0].officecode;

          });
        this.isLoading =true;
        this.service.getDepreciationRecord(0, 0, 0,0, ID, true)
          .subscribe(response => {
            this.isLoading = false;
            this.DepreciationList = (response.json());
            console.log(response.json());
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










