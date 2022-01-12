//import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetTransferService, LoginService, AssetTransfer, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';

@Component({
  selector: 'asset-transfer',
  templateUrl: './asset-transfer.component.html',
  styleUrls: ['./asset-transfer.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetTransferComponent implements OnInit {
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
  adviceno: any = 0;
  transfertype: any = 1;
  transferdate: any = new cDate()

  interoffice: any = 1;
  interdept: any = 0;

  item: Array<Select2OptionData> = [];
  itemR: any[] = [];
  itemcodeM: any = 0;
  itemcode: any = 0;
  itemname: any = "";

  officefrom: any[] = [];
  officefromcode: any = 0;
  officefromname: any = "";
  departmentfrom: any[] = [];
  departmentfromcode: any = 0;
  departmentfromname: any = "";
  empfrom: any[] = [];
  empfromcode: any = 0;
  empfromname: any = "";

  displayoffice :any = true;
  officeto: any[] = [];
  officetocode: any = 0;
  officetoname: any = "";
  departmentto: any[] = [];
  departmenttocode: any = 0;
  departmenttoname: any = "";
  empto: Array<Select2OptionData> = [];
  emptoR: any[] = [];
  emptocodeM: any = 0;
  emptocode: any = 0;
  emptoname: any = "";

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
  


  constructor(private service: AssetTransferService, private LoginService: LoginService, private modalService: NgbModal) { 

    
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
  }
   //ngOnInit
  ngOnInit() {
    this.getGrid(this.ID);
    this.setPageInfo(70015);
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

    //var DepreciationDate = new Date(this.transferdate.getDateFinal().toString());
    //var lastDayOfMonth = new Date(DepreciationDate.getFullYear(), DepreciationDate.getMonth() + 1, 0);
    //this.depreciationdate.setDate(lastDayOfMonth);
    //console.log(lastDayOfMonth)
  }
  //getItem
  getItem() {
    this.isLoading =true;
    this.service.getItem()
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
          var officecode = list[i].officefrom;
          var depcode = list[i].depfrom;
          var empcode = list[i].empfrom;
        }
    }

    if (this.itemcode > 0) {
      this.getAssetDepreciation(this.itemcode);
      this.getOfficeFrom(officecode);
      this.getDepartmentFrom(depcode);
      this.getEmployeeFrom(empcode);
    }
    else {
      this.officefromcode = 0;
      this.departmentfromcode = 0;
      this.empfromcode = 0;
    }
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
  //getOfficeFrom
  getOfficeFrom(ID) {
    this.service.getOfficeFrom(this.priviledged_Offices)
      .subscribe(response => {
        this.officefrom = (response.json());
        this.officefromcode = ID;

      });
  }
  //getDepartmentFrom
  getDepartmentFrom(ID) {

    this.service.getDepartmentFrom(this.priviledged_Offices)
      .subscribe(response => {

        this.departmentfrom = (response.json());
        this.departmentfromcode = ID;
      });
  }
  //getEmployeeFrom
  getEmployeeFrom(ID) {
    this.isLoading =true;
    this.service.getEmployeeFrom(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.empfrom = (response.json());
        this.empfromcode = ID;

        this.getOfficeTo();
        this.getDepartmentTo();
        this.getEmployeeTo();
      });
  }
  //getOfficeTo
  getOfficeTo() {
    this.service.getOfficeTo(this.priviledged_Offices)
      .subscribe(response => {
        this.officeto = (response.json());
        if (this.transfertype != 1) {
          this.officetocode = this.officefromcode;
        }
        else {
          this.officetocode = 0;
        }

      });
  }
  //getDepartmentTo
  getDepartmentTo() {

    this.service.getDepartmentTo(this.priviledged_Offices)
      .subscribe(response => {
        this.departmentto = (response.json());

      });
  }
  //getEmployeeTo
  getEmployeeTo() {
    this.isLoading =true;
    this.service.getEmployeeTo(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.empto = this.getDropdownList(response.json(), "empcode", "empname");
          this.emptoR = response.json();
        }

      });
  }
  //changeEmployeeTo
  changeEmployeeTo(e: any) {
    this.emptocode = e;

  }
  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;

    this.transferdate = new cDate();
    this.transfertype = 1;
    this.adviceno = '';

    this.officefromcode = 0;
    this.officetocode = 0;
    this.departmentfromcode = 0;
    this.departmenttocode = 0;
    this.empfromcode = 0;
    this.emptocode = 0;

    this.itemcode = 0;
    this.getItem();

  }
  ////saveData
  saveData() {

    if (this.itemcode > 0) {
      if (this.adviceno != '') {
        if (this.officetocode > 0) {
          if (this.departmenttocode > 0) {
            var data = new AssetTransfer(0, this.transferdate.getDateFinal(), this.transfertype, this.itemcode, this.officefromcode, this.officetocode, this.departmentfromcode, this.departmenttocode, this.empfromcode, this.emptocode, this.remarks, this.adviceno, this.logedInUserID, this.UserSessionID);
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
          else { swal('Select Department To!'); }
        }
        else { swal('Select Office To!'); }
      }
      else { swal('Select Advice No!'); }
    }
    else { swal('Select Asset!'); }

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
        this.adviceno = list[0].adviceno;
        this.transfertype = list[0].transfertype;
        this.transferdate.getDateFinal(list[0].transferdate);
        this.remarks = list[0].remarks;

        this.isLoading =true;
        this.service.getItem()
          .subscribe(response => {
            this.isLoading = false;
            if (response.json() != null) {
              this.item = this.getDropdownList(response.json(), "itemcode", "itemname");
              this.itemR = response.json();
              this.itemcodeM = list[0].assetcode;


              this.service.getOfficeFrom(this.priviledged_Offices)
                .subscribe(response => {
                  this.officefrom = (response.json());
                  this.officeto = (response.json());
                  this.officefromcode = list[0].officefrom;
                  this.officetocode = list[0].officeto;

                });

              this.service.getDepartmentFrom(1)
                .subscribe(response => {
                  this.departmentfrom = (response.json());
                  this.departmentfromcode = list[0].departmentfrom;

                  this.departmentto = (response.json());
                  this.departmenttocode = list[0].departmentto;


                });

              this.service.getEmployeeTo(this.priviledged_Offices)
                .subscribe(response => {
                  this.isLoading = false;
                  if (response.json() != null) {
                    this.empto = this.getDropdownList(response.json(), "empcode", "empname");
                    this.emptocodeM = list[0].transferedto;

                    this.empfrom = response.json();
                    this.empfromcode = list[0].transferedby;
                  }

                });

            }

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
  changeIO() {
    this.interoffice = 1;
    this.interdept = 0;
    this.transfertype = 1;
    this.displayoffice = false

    if (this.btnMode)
    this.getOfficeTo()

  }
  changeID() {
    this.interoffice = 0;
    this.interdept = 1;
    this.transfertype = 2;
    this.displayoffice = true
    if (this.btnMode)
    this.getOfficeTo()
  }

}










