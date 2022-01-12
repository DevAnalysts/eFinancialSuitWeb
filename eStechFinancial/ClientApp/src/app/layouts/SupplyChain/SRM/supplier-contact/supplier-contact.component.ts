import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { SupplierContactService, Contacts, Address, Contact, LoginService } from '../../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { TextMaskModule } from 'angular2-text-mask';


@Component({
  selector: 'supplier-contact',
  templateUrl: './supplier-contact.component.html',
  styleUrls: ['./supplier-contact.component.scss']
})
export class SupplierContactComponent implements OnInit {
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
  public myDatePickerOptions: IAngularMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy',
    inline: false,
    selectorHeight: '25px'
  };

  ////Member Variables
  p: number = 1;
  public mask1 = ['+', '9', '2', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  public mask2 = [/[1-9]/, /\d/, /\d/, /\d/, /\d/, '-', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/] //CNIC
  //public mask3 = [/[A-Za-z0-9._%+-]/, '@', '.', /\w/]
  //public mask3 = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

  //guid: any;
  contacts: any[] = [];

  suppliers: Array<Select2OptionData>;
  genders: any[] = [];
  martials: any[] = [];
  address: any[] = [];
  addressid: any = 0;

  city: any[] = [];
  citycode: any = 1;
  cityname: any = '';

  region: any[] = [];
  regioncode: any = 1;
  regionname: any = '';

  province: any[] = [];
  provincecode: any = 1;
  provincename: any = '';

  country: any[] = [];
  countrycode: any = 1;
  countryname: any = '';


  contactid: any = 0;
  contactname: any = '';
  supplierid: any = 0;
  suppliername: any = '';
  jobtitle: any = '';
  cnic: any = '';
  fathername: any = '';
  date = new Date();
  dob: any;
  bphone: any = '';
  mphone: any = '';
  fax: any = '';
  email: any = '';
  gender: any = 1;
  mstatus: any = 1;
  line1: any = '';
  line2: any = '';
  line3: any = '';
  pcontact: any = 0;
  status: any = 0;
  checkname: any = '';
  hidesave: any = '';


  closeResult: string;
  isLoading: any = true;
  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  public checked: boolean = true;
  public unchecked: boolean = false;

  update: any = 0;


  constructor(private service: SupplierContactService, private LoginService: LoginService, private modalService: NgbModal, private ngbDateParserFormatter: NgbDateParserFormatter) {
    //   this.dob = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  }

  ngOnInit() {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 80002) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;

          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].userSessionID;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
    this.getContact();
    this.getSupplier();
    this.getCity();
    //this.getGender();
    //this.getMartial();
    this.logedInUserID = this.service.getSession('user_ID');
  }
  //getContact
  getContact() {
    this.isLoading =true;
    this.service.getContact()
      .subscribe(response => {
        this.contacts = (response.json());
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //getSupplier
  getSupplier() {
    this.isLoading =true;
    this.service.getSupplier()
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplierid", "suppliername");
        this.supplierid = this.suppliers[0].id;
        this.suppliername = this.suppliers[0].text;
      });
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
  //getSupplierChange
  getSupplierChange(e: any) {
    this.supplierid = e;
    //alert(this.customerid);   
  }
  //getCityChange
  getCityChange(e: any) {
    this.citycode = e;
    this.getRegion(this.citycode);

  }
  //getDetailByID
  getDetailsByID(contactid) {
    //clearFields();
    this.update= 1;
    this.service.getDetailsByID(contactid)
      .subscribe((o: Contacts) => {
        this.contactid = o.contacT_ID;
        this.contactname = o.contacT_Name;
        this.supplierid = o.companY_ID;
        this.jobtitle = o.joB_Title;
        this.cnic = o.cnic;
        this.fathername = o.fatheR_Name;
        this.bphone = o.b_Phone;
        this.mphone = o.m_Phone;
        this.fax = o.fax;
        this.email = o.email;
        this.gender = o.gender;
        this.mstatus = o.m_Status;
        this.pcontact = o.p_Contact;
        this.status = o.status;
        this.getAddressByID(this.contactid);
      });
    console.log(this.contactid, this.contactname, this.supplierid, this.line1);
  }
  //getAddressByID
  getAddressByID(contactid) {
    this.isLoading =true;
    this.service.getAddressByID(contactid)
      .subscribe(response => {
        this.address = (response.json());
        this.addressid = this.address[0].addresS_ID;
        this.line1 = this.address[0].addresS_Line1;
        this.line2 = this.address[0].addresS_Line2;
        this.line3 = this.address[0].addresS_Line3;
        this.citycode = this.address[0].citY_CODE;
        this.getRegion(this.citycode);
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //saveContact
  saveContact(contactname, supplierid, jobtitle, cnic, fathername, bphone, mphone, fax, email, gender, mstatus, pcontact, status, line1, line2, line3, citycode, provincecode, countrycode) {
    if (this.update == 0) {

      var contact = new Contacts(this.contactid, contactname, supplierid, jobtitle, cnic, fathername, bphone, mphone, fax, email, gender, mstatus, pcontact, status, this.logedInUserID, this.UserSessionID, new Address(0, line1, line2, line3, citycode, provincecode, countrycode));
      console.log(contact);
      if (contactname != "") {
        this.checkname = '';

        this.service.saveContact(contact).then(
          (response) => { swal("Contact Created")},
          
          (error) => console.log(error));
        this.clearFields();
        this.addbutton = '';
        this.ngOnInit();
        
      }
      else {
        this.checkname = '1px solid red';
        this.hidesave = 'none';
      }
    }
    else {
      var contact = new Contacts(this.contactid, contactname, supplierid, jobtitle, cnic, fathername, bphone, mphone, fax, email, gender, mstatus, pcontact, status,this.logedInUserID, this.UserSessionID, new Address(this.addressid, line1, line2, line3, citycode, provincecode, countrycode));
      console.log(contact);
      if (contactname != "") {
        this.checkname = '';

        this.service.updateContact(contact).then(
          (response) => { swal("Contact Updated") },
          (error) => console.log(error));
        this.update = 0;
        //swal("Contact Updated");
      }
      else {
        this.checkname = '1px solid red';
        this.hidesave = 'none';
      }
     
    }
  }
  //clearFields
  clearFields() {
    this.contactid = 0;
    this.contactname = '';
    this.supplierid = 1;
    this.jobtitle = '';
    this.cnic = '';
    this.fathername = '';
    this.bphone = '';
    this.mphone = '';
    this.fax = '';
    this.email = '';
    this.gender = 1;
    this.mstatus = 1;
    this.pcontact = 0;
    this.status = 0;
    //Address Info ADD NEW FORM
    this.line1 = '';
    this.line2 = '';
    this.line3 = '';
    this.citycode = 1;
    this.regioncode = 1;
    this.provincecode = 1;
    this.countrycode = 1;

  }
  //checkName
  checkName() {
    this.checkname = '';
    this.hidesave = '';
  }
  Add() {
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = ''
  }
  Edit() {

  }
  Cancel() {
    this.clearFields();
    this.getContact();
    this.getSupplier();
    this.getCity();
    this.addbutton = '';
  }
  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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










