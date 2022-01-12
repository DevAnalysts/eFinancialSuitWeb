//import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetManageService, LoginService, AssetManage } from '../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';

@Component({
  selector: 'asset-manage',
  templateUrl: './asset-manage.component.html',
  styleUrls: ['./asset-manage.component.scss']
})
export class AssetManageComponent implements OnInit {
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

  assetcode: any = 0;
  assetname: any = "";
  assetno: any = "";
  acquisitiondate: any = "";

  office: any[] = [];
  officecode: any = 0;
  officename: any = "";

  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = "";

  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = "";

  subcategory: any[] = [];
  subcategorycode: any = 0;
  subcategoryname: any = "";

  status: any[] = [];
  statuscode: any = 0;
  statusname: any = "";

  color: any = "";
  size: any = "";
  make: any = "";
  model: any = "";
  useful: any = "";
  imei: any = "";
  engine: any = "";
  chasis: any = "";
  registration: any = "";
  remarks: any = "";

  emp: Array<Select2OptionData> = [];
  empcodeM: any = 0;
  empcode: any = 0;
  empname: any = "";

  depreciationrate: any;
  depreciationdate: any;

////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;

  constructor(private service: AssetManageService, private LoginService: LoginService, private modalService: NgbModal) { 

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
  }

  ngOnInit() {
      this.logedInUserID = this.LoginService.getSession('user_ID');
      this.getGrid(this.ID);
      this.setPageInfo(70004);
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
  //getOffice
  getOffice(ID) {
    this.isLoading =true;
    this.service.getOffice(ID,this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.office = (response.json());
        this.officecode = this.office[0].officecode;
        this.officename = this.office[0].officename;

        //  console.log(response.json());
      });
  }
  //getDepartment
  getDepartment(ID) {
    this.isLoading =true;
    this.service.getDepartment(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.department = (response.json());
        this.departmentcode = this.department[0].departmentcode;
        this.departmentname = this.department[0].departmentname;

        //  console.log(response.json());
      });
  }
  //getDepreciationDate
  getDepreciationDate(ID) {
    this.isLoading =true;
    this.service.getDepreciationDate(ID)
      .subscribe(response => {
        this.isLoading = false;
        var list = (response.json());
        this.depreciationdate = list[0].depdate;

      });
  }
  //getCategory
  getCategory(ID) {
    this.isLoading =true;
    this.service.getCategory(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.category = (response.json());
        this.categorycode = this.category[0].categorycode;
        this.categoryname = this.category[0].categoryname;

        //  console.log(response.json());
      });
  }
  //getSubCategory
  getSubCategory(ID) {
    this.isLoading =true;
    this.service.getSubCategory(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.subcategory = (response.json());
        this.subcategorycode = this.subcategory[0].subcategorycode;
        this.subcategoryname = this.subcategory[0].subcategoryname;

        //  console.log(response.json());
      });
  }
  //getStatus
  getStatus(ID) {
    this.isLoading =true;
    this.service.getStatus(ID)
      .subscribe(response => {
        this.isLoading = false;
        this.status = (response.json());
        this.statuscode = this.status[0].statuscode;
        this.statusname = this.status[0].statusname;

        //  console.log(response.json());
      });
  }
  //getEmployee
  getEmployee() {
    this.isLoading =true;
    this.service.getEmployee(this.priviledged_Offices)
      .subscribe(response => {
        this.emp = this.getDropdownList(response.json(), "empcode", "empname");
        this.isLoading = false;
      });
  }
  //changeEmployee
  changeEmployee(e: any) {
    this.empcode = e;

  }
  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;

    this.officecode = 0;
    this.officename = "";
    this.departmentcode = 0;
    this.departmentname = "";
    this.categorycode = 0;
    this.categoryname = "";
    this.subcategorycode = 0;
    this.subcategoryname = "";
    this.statuscode = 0;
    this.statusname = "";
    this.empcodeM = 0;
    this.empcode = 0;
    this.empname = "";

    this.color = "";
    this.size = "";
    this.make = "";
    this.model = "";
    this.useful = "";
    this.imei = "";
    this.engine = "";
    this.chasis = "";
    this.registration

  }
  //saveSupplier
  saveSupplier() {

    var data = new AssetManage(this.assetcode, this.color, this.size, this.make, this.model, this.useful, this.empcode, this.imei, this.engine, this.chasis, this.registration, this.remarks, this.logedInUserID, this.UserSessionID);
    console.log(data);

    this.service.saveSupplier(data).then(
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
    this.open(content);
    this.mode = true;
    this.btnMode = false;
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        var list = response.json();
        this.assetcode = ID
        this.assetname = list[0].assetname;
        this.assetno = list[0].assetno;
        this.acquisitiondate = list[0].acquisitiondate;
        this.remarks = list[0].remarks;
        this.depreciationrate = list[0].depreciationrate;
        this.getDepreciationDate(ID);

        this.color = list[0].color;
        this.size = list[0].size;
        this.make = list[0].make;
        this.model = list[0].model;
        this.useful = list[0].useful;
        this.imei = list[0].imei;
        this.engine = list[0].engine;
        this.chasis = list[0].chasis;
        this.registration = list[0].registration;

        this.getOffice(list[0].officecode);
        this.getDepartment(list[0].deptcode);
        this.getStatus(list[0].status);
        this.getCategory(list[0].categorycode);
        this.getSubCategory(list[0].subcategorycode);
        this.isLoading =true;
        this.service.getEmployee(this.priviledged_Offices)
          .subscribe(response => {
            this.isLoading = false;
            this.emp = this.getDropdownList(response.json(), "empcode", "empname");
            this.empcodeM = list[0].empcode;

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
  //ownershipList
  ownershipList = [
    { "ownership_ID": 1, "ownership": "Public" }
    , { "ownership_ID": 2, "ownership": "Private" }
    , { "ownership_ID": 3, "ownership": "Subsidiary" }
    , { "ownership_ID": 4, "ownership": "Other" }
  ]


}










