import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Customers } from '../shared/models';
import { CustomerService } from '../shared';

@Component({
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None

})
export class StarterComponent implements OnInit {
  ////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  ////////////////////////////////////////
  p: number = 1;
  modalReference: NgbModalRef;
  closeResult: string;
  public customers: any[];
  guid: any;
 isLoading: any = false;
  mode: any = false;
  btnMode: any = true;
  customer_ID: any = 0;
  customer_Name: any = "";
  nTN: any;
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
  remarks: any;
  credit_Limit: any;
  balance_Type_ID: any = 1;
  credit_Hold_ID: any = 1;
  payment_Term_ID: any = 1;
  freight_Term_ID: any = 1;
  industary_ID: any = 1;
  ownership_ID: any = 1;
  ID: any = "";
  ///////////
  addressid: any = 0;
  addresstype: any = '';
  line1: any = '';
  line2: any = '';
  line3: any = '';
  AreaShow: any = '';
  area: any[] = [];
  categories: any[] = [];
  areacode: any = 1;
  areaname: any = '';
  //city: any[] = [];
  city: Array<Select2OptionData>;
  citycode: any = 0;
  cityname: any = '';
  region: any[] = [];
  regioncode: any = 0;
  regionname: any = '';
  customerCategoryId: any = 1;
  customerCategoryName: any = "";
  province: any[] = [];
  provincecode: any = 0;
  provincename: any = '';
  country: any[] = [];
  countrycode: any = 0;
  countryname: any = '';
  address: any[] = [];
  status: any = 1;
  Exists: any = false;
  guidOrder: boolean;
  cellStatus: any = false;
  contactCellStatus: any = false;
  constructor(private service: CustomerService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getCustomers(this.ID);
    this.getCity();
    this.getArea();
  }

  getCustomers(value: string) {
    this.isLoading =true;
    this.service.getCustomers(value)
      .subscribe(response => {
        this.customers = (response.json());
        this.isLoading = false;       
      });
  }
  //changeCustomerName
  changeCustomerName(customer_Name) {
    this.contact_Name = customer_Name;
    //  this.checkDisableStatus();
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
  //getCategories
  getCategories() {
    this.service.getCategories()
      .subscribe(response => {
        this.categories = (response.json());
        this.customerCategoryId = this.categories[0].customerCategoryId;
        this.customerCategoryName = this.categories[0].customerCategoryName;
        // console.log(response.json());
      });

  }
  //clearFields
  clearFields() {
    //this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;
    this.customer_Name = "";
    this.nTN = "";
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
    this.status = 1;
    this.balance_Type_ID = 1;
    this.credit_Hold_ID = 1;
    this.payment_Term_ID = 1;
    this.freight_Term_ID = 1;
    this.industary_ID = 1;
    this.ownership_ID = 1;
    this.customerCategoryId = 1;
    this.line1 = "";
    this.line2 = "";
    this.line3 = "";
    this.status = 1;
    //this.checkEmail = true;
    //this.checkCell = true;
    //this.checkPhone = true;
    //this.checkContactCell = true;
    //this.checkContactPhone = true;
    this.getCity();
    this.getArea();
    this.getCategories();
  }
  openLg(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();
  }
  openDetail(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    this.clearFields();
  }

  //saveCustomer
  saveCustomer(customer_ID, customer_Name, nTN, contact_Name, phone, fax, email, website, contact_Phone, contact_Cell, balance, remarks, credit_Limit, balance_Type_ID, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, line1, line2, line3, status) {
    if (this.areacode != null) {
    }
    else {
      this.areacode = 1;
    }
    var customer = new Customers(customer_ID, customer_Name, this.customerCategoryId, 0, contact_Name, contact_Phone, contact_Cell, this.cell, phone, fax, nTN, email, website, credit_Limit, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, balance, balance_Type_ID, this.guid, remarks, 0, 0, line1, line2, line3, this.citycode, this.provincecode, this.countrycode, status, this.areacode, this.logedInUserID, this.UserSessionID,1,1,0,0);
    console.log(customer);
    if (this.customer_Name != "") {
      //if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.cell == '') {
      //  alert("Cell number must be defined.")
      //}
      //else {

      this.service.saveCustomer(customer).then(
        (response) => {
          this.getCustomers(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
      //}
    }
    else
      alert("Customer name must be define.");


  }
  //updateCustomer
  updateCustomer(customer_ID: any, customer_Name: any, nTN: any, contact_Name: any, phone: any, fax: any, email: any, website: any, contact_Phone: any, contact_Cell: any, balance: any, remarks: any, credit_Limit: any, balance_Type_ID: any, credit_Hold_ID: any, payment_Term_ID: any, freight_Term_ID: any, industary_ID: any, ownership_ID: any, line1, line2, line3, status) {

    var customer = new Customers(customer_ID, customer_Name, this.customerCategoryId, this.contact_ID, contact_Name, contact_Phone, contact_Cell, this.cell, phone, fax, nTN, email, website, credit_Limit, credit_Hold_ID, payment_Term_ID, freight_Term_ID, industary_ID, ownership_ID, balance, balance_Type_ID, this.guid, remarks, 0, this.addressid, line1, line2, line3, this.citycode, this.provincecode, this.countrycode, status, this.areacode, this.logedInUserID, this.UserSessionID,1,1,0,0);
    console.log(customer);

    if (this.customer_Name != "") {
      this.service.updateCustomer(customer).then(
        (response) => {
          this.getCustomers(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else
      alert("Customer name must be define.");



  }
  //getDetailsByID
  getDetailsByID(customer_ID, content) {
    this.openDetail(content);
    this.mode = true;
    this.btnMode = false;
    this.status = 0;
    this.service.getDetailsByID(customer_ID)
      .subscribe((o: Customers) => {
        this.customer_ID = o.customer_ID;
        //  this.IfExists(this.customer_ID);
        this.customer_Name = o.customer_Name;
        this.contact_ID = o.contact_ID;
        this.contact_Name = o.contact_Name;
        this.contact_Phone = o.contact_Phone;
        this.contact_Cell = o.contact_Cell;
        this.nTN = o.ntn;
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
        this.remarks = o.remarks;
        this.status = o.status;
        this.areacode = o.areaid;
        this.getAddressByID(this.customer_ID);

        this.service.getCategories()
          .subscribe(response => {
            this.categories = (response.json());
            this.customerCategoryId = o.customerCategoryId;
          });
      });

  }
  //getAddressByID
  getAddressByID(customer_ID) {
    this.isLoading =true;
    this.service.getAddressByID(customer_ID)
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
        //console.log(response.json());
      });

  }
  //getArea
  getArea() {
    //if (this.LoginService.getSession('EnableAreaonSO') != '1') {
    //  this.AreaShow = 'none';
    //}
    //else {
    this.isLoading =true;
    this.service.getArea()
      .subscribe(response => {
        this.area = (response.json());
        this.areacode = this.area[0].areacode;
        this.areaname = this.area[0].areaname;

        //console.log(response.json());
      });
    //}
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
  //getCity() {
  //  this.isLoading =true;
  //  this.service.getCity()
  //    .subscribe(response => {
  //      this.city = (response.json());
  //      // console.log(response.json());
  //      //this.city = this.getDropdownList(response.json(), "citycode", "cityname");
  //      this.citycode = this.city[0].citycode;
  //      this.cityname = this.city[0].cityname;
  //      this.getRegion(this.citycode);
  //    });
  //}
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
  //getCustomerChange
  getCityChange(citycode) {
    this.citycode = citycode;
    this.getRegion(this.citycode);
    //alert(this.customerid);   
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

