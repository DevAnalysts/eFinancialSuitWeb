import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SupplierService, LoginService, Suppliers, PermissionUtility, CommonUtility } from '../../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
  ////////////////////////////////////////
   regex:any = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/; 
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility(); 
  public commonUtility: CommonUtility = new CommonUtility();
  public valid:Validation=new Validation(); 
  ////////////////////////////////////////
  myRegExp=new RegExp('^[A-Za-z0-9.() ]+$');
  edit: any = false;
  contentTemp: any;
  p: number = 1;
  modalReference: NgbModalRef;
  modalReferenceAddLink: NgbModalRef;
  guid: any;
  suppliers: any[] = [];
  supplierCategories: any[] = [];
  supplierCategoryId: any = 1;
  supplierCategoryName: any = "";
  DisabledSupplierCategories:any=false;
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
  balance: any = 0;
  remarks: any = "";
  credit_Limit: any;
  balance_Type_ID: any = 0;
  credit_Hold_ID: any = 1;
  payment_Term_ID: any = 1;
  freight_Term_ID: any = 1;
  industary_ID: any = 1;
  ownership_ID: any = 1;
  ID: any = "";
  exchange: any = false;
  customre_ID: any = 0;
  /////////////////////////////

  addressid: any = 0;
  addresstype: any = '';
  line1: any = '';
  line2: any = '';
  line3: any = '';
  city: Array<Select2OptionData>;
  citycode: any = 0;
  cityname: any = '';
  areacode: any = 1;
  area: any[] = [];
  areaname: any = '';
  AreaShow: any = '';
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
  taxcode: any = 1;

  balanceDisable: any = false;


  public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  constructor(private service: SupplierService, private LoginService: LoginService, private modalService: NgbModal) { }

  ngOnInit() {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.getSuppliers(this.ID);
    this.getCity();
    //this.getCategories();
    this.balance = 0;
    this.permissionUtility.setPagePermissions(80001);
  }
  //getSuppliers
  getSuppliers(value: string) {
    this.isLoading =true;
    this.service.getSuppliers(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.suppliers = (response.json());
          console.clear();
          console.log(this.suppliers);
          this.isLoading = false;
          //  console.log(response.json());
        }else{
          this.suppliers = [];
          this.isLoading = false;
        }
        
      });
  }
  //getCategories
  getCategories() {
    this.service.getCategories()
      .subscribe(response => {
        console.log(response.json());
       let allSupplierCategories=(response.json());
        if(allSupplierCategories!==null){ 
          this.supplierCategories = allSupplierCategories.filter(f=>f.active==true);
        this.supplierCategoryId = this.supplierCategories[0].supplierCategoryId;
        this.supplierCategoryName = this.supplierCategories[0].supplierCategoryName;
        // console.log(response.json());
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
      { "balance_Type_ID": 0, "balance_Type": "No Balance" }
    , { "balance_Type_ID": 1, "balance_Type": "Supplier Payable" }
    , { "balance_Type_ID": 2, "balance_Type": "Advance/Receivable" }

  ]
  //changeBalanceType()
  changeBalanceType()
  {
    if(this.balance_Type_ID == 0)
    {
      this.balance = 0;
      this.balanceDisable = true;
    }
    else{
      this.balanceDisable = false;
    }
  }
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
    { "ownership_ID": 1, "ownership": "Private" }
    , { "ownership_ID": 2, "ownership": "Public" }
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
    this.balance_Type_ID = 0;
    this.balance = 0;
    this.balanceDisable = true;
    this.credit_Hold_ID = 1;
    this.payment_Term_ID = 1;
    this.freight_Term_ID = 1;
    this.industary_ID = 1;
    this.ownership_ID = 1;
    this.exchange = false;
    this.DisabledSupplierCategories=false;
    $("#exchange").prop("disabled", false);
    if (this.edit) {
      $("#exchange").prop("disabled", true);
    }
    this.edit = false;
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.status = 1;

    this.checkEmail = true;
    this.checkCell = true;
    this.checkPhone = true;
    this.checkContactCell = true;
    this.checkContactPhone = true;
    this.taxcode = 1;
    this.getCity();
    //this.mandatoryFields();
  }
  //saveSupplier
  saveSupplier(supplier_ID: any, supplier_Name: any, ntn: any, contact_Name: any, phone: any, fax: any, email: any, website: any, contact_Phone: any, contact_Cell: any, balance: any, remarks: any, credit_Limit: any, balance_Type_ID: any, credit_Hold_ID: any, payment_Term_ID: any, freight_Term_ID: any, industary_ID: any, ownership_ID: any,
    line1, line2, line3, status) {
      //alert(email); checkSupplierEmail
      if(!this.regex.test(email)){  
        swal("Invalid Email Format","","error");
        return;
      }
      if(this.cell!='' && this.cell.toString().length!=11){
        swal("Invalid cell number","","error");
        return;
      }
      if(this.phone!='' && this.phone.toString().length!=11){
      swal("Invalid phone number","","error");
      return;
      }
      if(this.contact_Cell!='' && this.contact_Cell.toString().length<11){
      swal("Invalid cell# number","","error");
      return;
      }
      if(this.contact_Phone!='' && this.contact_Cell.toString().length<11){
        swal("Invalid phone# number","","error");
        return;
        }
      if(this.fax!='' && this.fax.toString().length<11){
      swal("Invalid fax number","","error");
      return;
      }
      if((this.balance_Type_ID == 1 || this.balance_Type_ID == 3) && (this.balance =='' || this.balance == 0 || this.balance == null))
      {
        swal("balance must be defined","","info");
        return;
      }
    var supplier = new Suppliers(supplier_ID, supplier_Name,this.supplierCategoryId, 0, contact_Name, contact_Phone, contact_Cell, this.cell, phone, fax, ntn, email, website, credit_Limit, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, balance, balance_Type_ID, this.remarks, this.exchange, this.customre_ID, this.guid, 0, line1, line2, line3, this.citycode, this.provincecode, this.countrycode, status, this.logedInUserID, this.UserSessionID)//, this.taxcode);
    console.log(supplier);
    var supplier_Name=this.supplier_Name.trim();
    
    if (supplier_Name != "") {
      if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.cell == '') {
        swal("Cell number must be defined.","","info")
      }
      else {
        this.service.saveSupplier(supplier).then(
          (response) => {
            this.getSuppliers(this.ID);
            this.modalReference.close();
            console.log(response);
          },
          (error) => { 
            //console.log(error);
            this.isLoading = false;
            this.commonUtility.handleError(error);
          
          })
      }
    }
    else{  
      if(this.supplier_Name.replace(/\s/g,"").length<=0){ 
        this.supplier_Name='';
       swal("Supplier name must be define.","","info");
    }
  } 
  }
 /*  whiteSpace(){
    var a=$("#supplier_Name").val().toString(); 
    if(a.replace(/\s/g,"").length<=0){
      //alert("No Blank Space Allowed");
      this.supplier_Name='';
    }
  } */
  //updateSupplier
  updateSupplier(supplier_ID: any, supplier_Name: any, ntn: any, contact_Name: any, phone: any, fax: any, email: any, website: any, contact_Phone: any, contact_Cell: any, balance: any, remarks: any, credit_Limit: any, balance_Type_ID: any, credit_Hold_ID: any, payment_Term_ID: any, freight_Term_ID: any, industary_ID: any, ownership_ID: any,
    line1, line2, line3, status) {
      if(!this.regex.test(email)){  
        swal("Invalid Email Format");
        return;
      }
      if(this.cell!='' && this.cell.toString().length!=11){
        swal("Invalid cell number");
        return;
      }
      if(this.phone!='' && this.phone.toString().length!=11){
      swal("Invalid phone number");
      return;
      }
      if(this.contact_Cell!='' && this.contact_Cell.toString().length<11){
      swal("Invalid cell# number");
      return;
      }
      if(this.contact_Phone!='' && this.contact_Cell.toString().length<11){
        swal("Invalid phone# number");
        return;
        }
      if(this.fax!='' && this.fax.toString().length<11){
      swal("Invalid fax number");
      return;
      }
    var supplier = new Suppliers(supplier_ID, supplier_Name,this.supplierCategoryId, this.contact_ID, contact_Name, contact_Phone, contact_Cell, this.cell, phone, fax, ntn, email, website, credit_Limit, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, balance, balance_Type_ID, this.remarks, this.exchange, this.customre_ID, this.guid, this.addressid, line1, line2, line3, this.citycode, this.provincecode, this.countrycode, status, this.logedInUserID, this.UserSessionID)//,this.taxcode);
    console.log(supplier);
    var supplier_Name=this.supplier_Name.trim();
    if (supplier_Name != "") {
      this.service.updateSupplier(supplier).then(
        (response) => {
          this.getSuppliers(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) => { 
          //console.log(error);
          this.isLoading = false;
          this.commonUtility.handleError(error);
        
        })
    }
    else{
      if(this.supplier_Name.replace(/\s/g,"").length<=0){ 
        this.supplier_Name='';
       swal("Supplier name must be define.");
    }
  }
  }
  //getDetailsByID
  getDetailsByID(supplier_ID, content) {
    this.edit = true;
    this.open(content);
    this.mode = true;
    this.btnMode = false;
    this.status = 0;


    this.service.getDetailsByID(supplier_ID)
      .subscribe((o: Suppliers) => {
        this.supplier_ID = o.supplier_ID;
        this.IfExists(this.supplier_ID);
        this.supplier_Name = o.supplier_Name;
        this.contact_ID = o.contact_ID;
        this.contact_Name = o.contact_Name;
        this.contact_Phone = o.contact_Phone;
        this.contact_Cell = o.contact_Cell;
        this.ntn = o.ntn;
        this.cell = o.cell;
        this.phone = o.phone;
        this.fax = o.fax;
        this.email = o.email;
        this.website = o.website;
        this.balance = o.balanceAmount;

        this.balance_Type_ID = o.balanceType;
        this.credit_Limit = o.credit_Limit;
        this.credit_Hold_ID = o.credit_Hold;
        this.payment_Term_ID = o.payment_Term;
        this.freight_Term_ID = o.freight_Term;
        this.industary_ID = o.industary;
        this.ownership_ID = o.ownership;
        this.customre_ID = o.customer_ID;
        this.remarks = o.remarks;
        this.status = o.status;
        this.exchange = o.exchange;
        //this.supplierCategoryId = o.supplierCategory;
        //this.taxcode = o.taxcode;
        if (this.exchange)
          $('#link').hide();
        else
          $('#link').show();
        this.getAddressByID(this.supplier_ID);

        this.service.getCategories()
          .subscribe(response => { 
            let allSupplierCategories = (response.json());
            this.DisabledSupplierCategories=false;
            let disabledSupllierCategories = allSupplierCategories.filter(f=>f.supplierCategoryId==o.supplierCategory && f.active==false)
            if(disabledSupllierCategories!==null)
            {
              if(disabledSupllierCategories.length>0){
                this.DisabledSupplierCategories=true;
                this.supplierCategories = allSupplierCategories.filter(f=>f.active==false)
              }else{
              this.supplierCategories = allSupplierCategories.filter(f=>f.active==true)
            } 
            this.supplierCategoryId = o.supplierCategory;
            }else{
              this.supplierCategoryId = o.supplierCategory;
              this.supplierCategories = allSupplierCategories.filter(f=>f.supplierCategory == o.supplierCategory);
            }
            
            
          });

      });

  }
  //getAddressByID
  getAddressByID(supplier_ID) {

    this.isLoading =true;
    this.service.getAddressByID(supplier_ID)
      .subscribe(response => {
        this.address = (response.json());
        if (this.address != null) {
          this.addressid = this.address[0].addresS_ID;
          this.line1 = this.address[0].addresS_Line1;
          this.line2 = this.address[0].addresS_Line2;
          this.line3 = this.address[0].addresS_Line3;
          this.citycode = this.address[0].citY_CODE;
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
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.allowExchange();
    this.clearFields();
    this.getCategories();
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
  //getArea
  getArea() {
    if (this.LoginService.getSession('EnableAreaonSO') != '1') {
      this.AreaShow = 'none';
    }
    else {
      this.isLoading = true;
      this.service.getArea()
        .subscribe(response => {
          if(response.json()!==null){
          this.area = (response.json());
          this.areacode = this.area[0].areacode;
          this.areaname = this.area[0].areaname;
          this.isLoading = false;
          }
          //console.log(response.json());
        });
    }
  }
  //getCity
  getCity() {
    this.isLoading = true;
    this.service.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        if (response.json() != null) {
          this.citycode = this.city[0].id;
          this.cityname = this.city[0].text;
          this.getRegion(this.citycode);
          this.isLoading = false;
        }
      });
  }
  //getDistrict
  getRegion(citycode) {
    this.isLoading = true;
    this.service.getRegion(citycode)
      .subscribe(response => {
        if(response.json()!==null){
        this.region = (response.json());
        this.regioncode = this.region[0].regioncode;
        this.regionname = this.region[0].regionname;
        this.getProvince(this.regioncode);
        }
        this.isLoading = false;
        //console.log(response.json());
      });

  }
  //getProvince
  getProvince(regioncode: any) {
    this.isLoading = true;
    this.service.getProvince(regioncode)
      .subscribe(response => {
        if(response.json()!==null){
        this.province = (response.json());
        this.provincecode = this.province[0].provincecode;
        this.provincename = this.province[0].provincename; 
        this.countrycode = this.province[0].countrycode;
        this.getCountry(this.countrycode);
        
        }
        this.isLoading = false;
        // console.log(response.json());
      });

  }
  //getCountry
  getCountry(countrycode) {
    this.isLoading = true;
    this.service.getCountry(countrycode)
      .subscribe(response => {
        if(response.json()!==null){
        this.country = (response.json());
        this.countrycode = this.country[0].countrycode;
        this.countryname = this.country[0].countryname;
        
        }
        this.isLoading = false;
        // console.log(response.json());
      });
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
      if(!this.regex.test(email)){  
        swal("Invalid Email Format");
        return;
      }

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


  interoffice: any = 1;
  interdept: any = 0;
  transfertype: any = 1;
  showCustomer: any = '';
  showLinkSave: any = 'hide';

  //AddLink
  AddLink(content) {
    this.showLinkSave = 'none';
    this.customers = [];
    this.getCustomers();
    this.openAddLink(content);


  }
  //openAddLink
  openAddLink(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, size: 'sm', windowClass: 'my-modal'
    };

    this.modalReferenceAddLink = this.modalService.open(content, { size: 'sm' });
    this.modalReferenceAddLink.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    //$("#SaveNewSupplier").prop("disabled", true);
    //var timer = setTimeout(() => $("#addSupplierName").focus(), 500);

  }

  customers: Array<Select2OptionData> = [];
  customercodeM: any;
  customercode: any;
  customername: any;

  //getCustomers
  getCustomers() {
    this.showLinkSave = 'none';
    this.service.getCustomer()
      .subscribe(response => {

        this.customers = this.getDropdownList(response.json(), "customercode", "customername");
        this.showLinkSave = '';

      });
  }
  //changeCustomer
  changeCustomer(e: any) {
    this.customercode = e;
  }
  changeIO() {
    this.interoffice = 1;
    this.interdept = 0;
    this.transfertype = 1;
    this.showCustomer = '';
  }
  changeID() {
    this.interoffice = 0;
    this.interdept = 1;
    this.transfertype = 2;
    this.showCustomer = 'none';
  }
  //saveLink
  saveLink() {
    this.service.saveLink(this.supplier_ID,this.customercode)
      .subscribe(response => {
    swal('Linked!');
    this.exchange = true;
    $('#link').hide();
    this.modalReferenceAddLink.close();
    });
  }

 /*  mandatoryBorder: any = 'border-right:5px solid red;';
  validBorder: any = 'border-right:5px solid green;'; */

 /*  mandatoryFields() {

    $("#supplier_Name").prop("style", this.validBorder);
    if (this.supplier_Name == "") { $("#supplier_Name").prop("style", this.mandatoryBorder); }

    $("#cell").prop("style", this.validBorder);
    if (this.cell == "") { $("#cell").prop("style", this.mandatoryBorder); }
  } */
}
//Waseem





/***************************Fraz Anwer */



