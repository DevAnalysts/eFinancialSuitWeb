import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetSupplierService, LoginService, AssetSupplier, PermissionUtility } from '../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'asset-supplier',
  templateUrl: './asset-supplier.component.html',
  styleUrls: ['./asset-supplier.component.scss']
})
export class AssetSupplierComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  edit: any= false;
  contentTemp: any;
  p: number = 1;
  modalReference: NgbModalRef;
  guid: any;
  suppliers: any[] = [];
  isLoading: any = false;
  closeResult: string;
  mode: any = false;
  btnMode: any = true;
  supplier_ID: any = 0;
  supplier_Name: any = "";
  ntn: any;
  contact_ID: any;
  contact_Name: any;
  cell: any = '';
  phone: any;
  fax: any;
  email: any;
  website: any;
  contact_Phone: any;
  contact_Cell: any;
  balance: any;
  remarks: any = "";
  credit_Limit: any;
  balance_Type_ID: any = 1;
  credit_Hold_ID: any = 1;
  payment_Term_ID: any = 1;
  freight_Term_ID: any = 1;
  industary_ID: any = 1;
  ownership_ID: any = 1;
  ID: any = "";
  exchange: any = false;
  customre_ID: any = 0;
  /////////////////////////////
submitAdd:any
submitUpdate:any;
  addressid: any = 0;
  addresstype: any = '';
  line1: any = '';
  line2: any = '';
  line3: any = '';
  city: Array<Select2OptionData>;
  citycode: any = 0;
  cityname: any = '';
  region: any[] = [];
  regioncode: any = 0;
  regionname: any = '';
  province: any[] = [];
  provincecode: any = 0;
  provincename: any = '';
  country: any[] = [];
  countrycode: any = 0;
  countryname: any = '';
  address: any[] = [];
  status: any = 1;
  cellStatus: any = false;
  contactCellStatus: any = false;
  Exists: any = false;

  guidOrder: boolean; 

  public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  constructor(private service: AssetSupplierService, private LoginService: LoginService, private modalService: NgbModal) { }

  ngOnInit() {
    this.logedInUserID = this.LoginService.getSession('user_ID');
     this.getSuppliers(this.ID);
    this.getCity();
    this.permissionUtility.setPagePermissions(80001);
  }
   
  //getSuppliers
  getSuppliers(value: string) {
    this.isLoading =true;
    this.service.getSuppliers(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.suppliers = (response.json());
          this.isLoading = false;
          //  console.log(response.json());
        }
        else{
          this.suppliers = [];
        this.isLoading = false;
        
        }
        
      });
  }
  //changeSupplierName
  changeSupplierName(supplier_Name) {
    this.contact_Name = supplier_Name;
    this.checkDisableStatus();
  }
  //balanceTypeList
  balanceTypeList = [
    { "balance_Type_ID": 1, "balance_Type": "Payable" }
    , { "balance_Type_ID": 2, "balance_Type": "Advance" }
  ]
  //craditHoldList
  creditHoldList = [
    { "credit_Hold_ID": 1, "credit_Hold": "No" }
    , { "credit_Hold_ID": 2, "credit_Hold": "Yes" }
  ]
  //paymentTermList
  paymentTermList = [
    { "payment_Term_ID": 1, "payment_Term": "Due On Receipt" }
    , { "payment_Term_ID": 2, "payment_Term": "Net 10" }
    , { "payment_Term_ID": 3, "payment_Term": "Net 15" }
    , { "payment_Term_ID": 4, "payment_Term": "Net 20" }
  ]
  //freightTermList
  freightTermList = [
    { "freight_Term_ID": 1, "freight_Term": "No Charge" }
    , { "freight_Term_ID": 2, "freight_Term": "FOD" }
  ]
  //industaryList
  industaryList = [
    { "industary_ID": 1, "industary": "Accounting" }
    , { "industary_ID": 2, "industary": "Building Supply Retail" }
    , { "industary_ID": 3, "industary": "Business Services" }
    , { "industary_ID": 4, "industary": "Social Services" }
    , { "industary_ID": 5, "industary": "Other" }
  ]
  //ownershipList
  ownershipList = [
    { "ownership_ID": 1, "ownership": "Public" }
    , { "ownership_ID": 2, "ownership": "Private" }
    , { "ownership_ID": 3, "ownership": "Subsidiary" }
    , { "ownership_ID": 4, "ownership": "Other" }
  ]
  //IfExists
  IfExists(supplier_ID) {
    this.service.IfExists(supplier_ID)
      .subscribe(response => {
        this.Exists = (response.json());
        if (this.status == true) {
          $("#balance").prop("disabled", true);
        }
        else {
          $("#balance").prop("disabled", false);
        }
      });
  }
  //cellExists
  cellExists(cell) {
    this.service.cellExists(cell)
      .subscribe(response => {
        this.cellStatus = (response.json());

      });
  }
  //contactCellExists
  contactCellExists(contactCell) {
    this.service.contactCellExists(contactCell)
      .subscribe(response => {
        this.contactCellStatus = (response.json());
        alert(this.contactCellStatus);
      });
  }
  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;
    this.supplier_Name = "";
    this.ntn = "";
    this.contact_Name = "";
    this.cell = "";
    this.phone = "";
    this.fax = "";
    this.email = "";
    this.website = "";
    this.contact_Phone = "";
    this.contact_Cell = "";
    this.balance = "";
    this.remarks = "";
    this.credit_Limit = "";
    this.balance_Type_ID = 1;
    this.credit_Hold_ID = 1;
    this.payment_Term_ID = 1;
    this.freight_Term_ID = 1;
    this.industary_ID = 1;
    this.ownership_ID = 1;
    this.exchange = false;
    $("#exchange").prop("disabled", false);
    if (this.edit) {
      $("#exchange").prop("disabled", true);
    }
    this.edit = false;
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.status = 1;

    this.checkEmail= true;
    this.checkCell= true;
    this.checkPhone= true;
    this.checkContactCell= true;
    this.checkContactPhone= true;

    this.getCity();

  }
  //saveSupplier
  saveSupplier() {

    var supplier = new AssetSupplier(this.supplier_ID, this.supplier_Name, this.contact_Name, this.contact_Phone, this.contact_Cell, this.cell, this.phone, this.fax, this.ntn, this.email, this.website, this.credit_Limit, this.credit_Hold_ID, this.payment_Term_ID, this.freight_Term_ID, this.industary_ID, this.ownership_ID, this.balance, this.balance_Type_ID, this.remarks,this.guid, 0, this.line1, this.line2, this.line3, this.citycode, this.provincecode, this.countrycode, this.status,this.logedInUserID, this.UserSessionID);
    console.log(supplier);
    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
    if(!regex.test(this.email)){
      swal("Invalid Email Format");
      return;
    }
    var supplier_Name=this.supplier_Name.trim();
    if (supplier_Name != "") {
      if(this.line1!=''){
          if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.cell == '') {
            swal("Cell number must be defined.")
          }
          else {
            this.service.saveSupplier(supplier).then(
              (response) => {
                this.getSuppliers(this.ID);
                this.modalReference.close();
                console.log(response);
              },
              (error) => console.log(error))
          }
      }else
      swal("Address (Line 1) Must Be Defined");
    }
    else{
      if(this.supplier_Name.replace(/\s/g,"").length<=0){
        swal("Supplier name must be define.");
        this.supplier_Name='';
      } 
    }
     


  }
  //updateSupplier
  updateSupplier() {

    var regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
    if(!regex.test(this.email)){
      swal("Invalid Email Format");
      return;
    } 
    var supplier = new AssetSupplier(this.supplier_ID, this.supplier_Name, this.contact_Name, this.contact_Phone, this.contact_Cell, this.cell, this.phone, this.fax, this.ntn, this.email, this.website, this.credit_Limit, this.credit_Hold_ID, this.payment_Term_ID, this.freight_Term_ID, this.industary_ID, this.ownership_ID, this.balance, this.balance_Type_ID, this.remarks, this.guid, this.addressid, this.line1, this.line2, this.line3, this.citycode, this.provincecode, this.countrycode, this.status,this.logedInUserID, this.UserSessionID);
    console.log(supplier);
    if (this.supplier_Name != "") {
      if(this.line1!=''){
      this.service.updateSupplier(supplier).then(
        (response) => {
          this.getSuppliers(this.ID);
          this.modalReference.close();
          //console.log(response);
        },
        (error) => console.log(error))
    }else
    swal("Address (Line 1) Must Be Defined");
  }
    else
      swal("Supplier name must be define.");
  }
  //getDetailsByID
  getDetailsByID(ID, content) {
    this.edit = true;
    this.open(content);
    this.mode = true;
    this.btnMode = false;
    this.status = 0;   

if(this.permissionUtility.PermissionView==''){
  this.submitAdd='none';
  this.submitUpdate='none';
}
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = response.json(); 
        this.supplier_ID = list[0].supplier_ID;
        this.IfExists(this.supplier_ID);
        this.supplier_Name = list[0].suppliername;

        this.contact_Name = list[0].contactname;
        this.contact_Phone = list[0].contactphone;
        this.contact_Cell = list[0].contactcell;
        this.ntn = list[0].ntn;
        this.cell = list[0].cell;
        this.phone = list[0].phone;
        this.fax = list[0].fax;
        this.email = list[0].email;
        this.website = list[0].website;
        this.balance = list[0].balanceamount;
        this.balance_Type_ID = list[0].balancetype;
        this.remarks = list[0].remarks;
        this.status = list[0].status;

        this.getAddressByID(this.supplier_ID);
        
      });

  }
  //getAddressByID
  getAddressByID(ID) {

    this.isLoading =true;
    this.service.getAddressByID(ID)
      .subscribe(response => {
        this.address = (response.json());
        if (this.address != null) {
          this.addressid = this.address[0].addresscode;
          this.line1 = this.address[0].addressline1;
          this.line2 = this.address[0].addressline2;
          this.line3 = this.address[0].addressline3;
          this.citycode = this.address[0].citycode;
          this.getRegion(this.citycode);
          this.isLoading = false;
        }
        else
          this.isLoading = false;

        //console.log(this.address);
      });

  }
  //allowExchange
  allowExchange() {
    if (sessionStorage.getItem('settingAllowExchange') != "1") {
      $("#ex").hide();
      $("#exc").hide();
    }
    else {
      $("#ex").show();
      $("#exc").show();
    }
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
    this.allowExchange();
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
  //getCity
  getCity() {
    this.isLoading =true;
    this.service.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        this.citycode = this.city[0].id;
        this.cityname = this.city[0].text;
        this.getRegion(this.citycode);
      });
  }
  //getDistrict
  getRegion(citycode) {
    this.isLoading =true;
    this.service.getRegion(citycode)
      .subscribe(response => {
        this.region = (response.json());
        this.regioncode = this.region[0].regioncode;
        this.regionname = this.region[0].regionname;
        this.provincecode = this.region[0].provincecode;
        this.getProvince(this.provincecode);
        this.isLoading = false;
        //console.log(response.json());
      });

  }
  //getProvince
  getProvince(provincecode) {
    this.isLoading =true;
    this.service.getProvince(this.provincecode)
      .subscribe(response => {
        this.province = (response.json());
        this.provincecode = this.province[0].provincecode;
        this.provincename = this.province[0].provincename;
        this.countrycode = this.province[0].countrycode;
        this.getCountry(this.countrycode);
        this.isLoading = false;
        // console.log(response.json());
      });

  }
  //getCountry
  getCountry(countrycode) {
    this.isLoading =true;
    this.service.getCountry(countrycode)
      .subscribe(response => {
        this.country = (response.json());
        this.countrycode = this.country[0].countrycode;
        this.countryname = this.country[0].countryname;
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //convert dropdown lables
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
  //getCityChange
  getCityChange(e: any) {
    this.citycode = e;
    this.getRegion(this.citycode);
    //alert(this.customerid);   
  }

  checkEmail: any = true;
  checkCell: any = true;
  checkPhone: any = true;
  checkContactCell: any = true;
  checkContactPhone: any = true;
  checkDisableStatus() {

      if (this.supplier_Name != ''
        && this.checkEmail != false
        && this.checkCell != false
        && this.checkPhone != false
        && this.checkContactCell != false
        && this.checkContactPhone != false) {
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);
      }
      else {
        $("#submitAdd").prop("disabled", true);
        $("#submitUpdate").prop("disabled", true);
      }

  }

  checkSupplierEmail(email) {
    if (email != '') {
      this.isLoading =true;
      this.service.emailExists(email)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkEmail = false;
            this.checkDisableStatus();
            swal('Email Already Exist');
          }
          else {
            this.checkEmail = true;
            this.checkDisableStatus();
          }


        });
    }
    else {
      this.checkEmail = true;
      this.checkDisableStatus();
    }
  }
  checkSupplierCell(cell) {

    if (cell != '') {
      this.isLoading =true;
      this.service.contactCellExists(cell)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkCell = false;
            this.checkDisableStatus();
            swal('Cell Already Exist');
          }
          else {
            this.checkCell = true;
            this.checkDisableStatus();
          }


        });
    }
    else {

      if (this.LoginService.getSession('MandatoryCellNo') != '1') {
        this.checkCell = true;
        this.checkDisableStatus();
      }
      else {
        this.checkCell = false;
        this.checkDisableStatus();
        swal('Enter Cell No');
      }
    }
  }
  checkSupplierPhone(phone) {
    if (phone != '') {
      this.isLoading =true;
      this.service.contactCellExists(phone)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkPhone = false;
            this.checkDisableStatus();
            swal('Phone Already Exist');
          }
          else {
            this.checkPhone = true;
            this.checkDisableStatus();
          }


        });
    }
    else {
      this.checkPhone = true;
      this.checkDisableStatus();
    }
  }
  checkSContactCell(cell) {
    if (cell != '') {
      this.isLoading =true;
      this.service.contactCellExists(cell)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactCell = false;
            this.checkDisableStatus();
            swal('Cell Already Exist');
          }
          else {
            this.checkContactCell = true;
            this.checkDisableStatus();
          }


        });
    }
    else {
      this.checkContactCell = true;
      this.checkDisableStatus();
    }
  }
  checkSContactPhone(phone) {
    if (phone != '') {
      this.isLoading =true;
      this.service.contactCellExists(phone)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactPhone = false;
            this.checkDisableStatus();
            swal('Phone Already Exist');

          }
          else {
            this.checkContactPhone = true;
            this.checkDisableStatus();
          }

        });
    }
    else {
      this.checkContactPhone = true;
      this.checkDisableStatus();
    }
  }

}










