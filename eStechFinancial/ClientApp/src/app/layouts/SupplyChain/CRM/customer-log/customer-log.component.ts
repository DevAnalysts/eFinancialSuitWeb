import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { CustomerLogService, CustomerLogBook, cDate, NgbDateFRParserFormatter  } from '../../../../shared';
import swal from 'sweetalert';

import { log } from 'util';

@Component({
  selector: 'customer-log',
  templateUrl: './customer-log.component.html',
  styleUrls: ['./customer-log.component.scss'],

  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CustomerLogComponent implements OnInit {
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
  public Logdate = new cDate();
  p: number = 1;
  modalReference: NgbModalRef;
  findcustomers: Array<Select2OptionData>;
  findcustomermodel: any;
  findcustomerid: any = 1;
  findcustomername: any = '';
  findstatus: any = 0;


  customerlogbook: any[] = [];
  customers: Array<Select2OptionData>;
  customer: any[] = [];
  customermodel: any;
  customerid: any = 1;
  customername: any = '';
  status: any[] = [];
  statusid: any = 1;
  statusname: any = ''
  comments: any = ''
  log: any[] = [];
  logbycustomerid: any[] = [];
  logid: any = 0;
  //update: any = 0;

  customerphone: any = '';
  customercell: any = '';
  contact: any[] = [];
  contactcode: any = 0;
  contactname: any = '';
  contact1: any = '';
  contact2: any = '';
  contact3: any = '';
  contact4: any = '';
  email: any = '';

  checkComments: any = '';
  hidesave: any = '';
  disabled: any = '';
  //isLoading: any = true;
  //logedInUserID: any = 1;

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
  editcheck: any = 0;

  constructor(private service: CustomerLogService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.getCustomerLogBook();
    this.getStatus();
    this.getCustomers();
    this.findCustomers();
    this.logedInUserID = this.service.getSession('user_ID');

    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 140011) {
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

  }
  //findCustomers
  findCustomers() {
    this.isLoading =true;
    this.service.getCustomer()
      .subscribe(response => {
        this.findcustomers = this.getDropdownList(response.json(), "customerid", "customername");
        this.findcustomerid = this.customers[0].id;
        this.findcustomername = this.customers[0].text;
      });
  }
  //findCustomerChange
  findCustomerChange(e: any) {
    if (this.findcustomerid != e.value) {
      this.findcustomerid = e.value
      this.getCustomerLogBookFiltered(this.findcustomerid, this.findstatus)
    }
  }
  //getCustomerLogBookFiltered
  getCustomerLogBookFiltered(customerid, statusid) {
    this.isLoading =true;
    this.service.getCustomerLogBookFiltered(customerid, statusid)
      .subscribe(response => {
        this.customerlogbook = (response.json());
        this.isLoading = false;
        //console.log(response.json());
      });
  }
  //getFills
  getFills() {
    this.getCustomers();
    this.getStatus();
  }
  //getCustomer
  getCustomerLogBook() {
    this.isLoading =true;
    this.service.getCustomerLogBook()
      .subscribe(response => {
        this.customerlogbook = (response.json());
        this.isLoading = false;
        //console.log(response.json());
      });
  }
  //getCustomer
  getCustomers() {
    this.isLoading =true;
    this.service.getCustomer()
      .subscribe(response => {
        this.customers = this.getDropdownList(response.json(), "customerid", "customername");
        this.customerid = this.customers[0].id;
        this.customername = this.customers[0].text;
        this.customer = response.json();
        this.customerphone = this.customer[0].customerphone;
        this.customercell = this.customer[0].customercell;
        this.getContact(this.customerid);
      });
  }
  //getCustomerChange
  getCustomerChange(e: any) {
   // alert('Here')
    if (this.editcheck != 1) {
      this.customerid = e;
      for (let i = 0; i < this.customer.length; i++)
        if (this.customer[i].customerid == this.customerid) {
          this.customerphone = this.customer[i].customerphone;
          this.customercell = this.customer[i].customercell;
        }
      this.getContact(this.customerid);
      this.getCustomerLogByCustomerID(this.customerid);
      this.update = 0;
      //alert('update=0');
    }
  }
  //getContact
  getContact(customerid) {
    this.isLoading =true;
    this.service.getContact(customerid)
      .subscribe(response => {
        this.contact = (response.json());
        this.contactcode = this.contact[0].contactcode;
        this.contactname = this.contact[0].contactname;
        this.contact1 = this.contact[0].contact1;
        this.contact2 = this.contact[0].contact2;
        this.contact3 = this.contact[0].contact3;
        this.contact4 = this.contact[0].contact4;
        this.email = this.contact[0].email;
        this.isLoading = false;
      });
  }
  //ChangeContactDetails
  ChangeContactDetails(contactcode) {
    for (let i = 0; i < this.contact.length; i++)
      if (this.contact[i].contactcode == contactcode) {
        this.contact1 = this.contact[i].contact1;
        this.contact2 = this.contact[i].contact2;
        this.contact3 = this.contact[i].contact3;
        this.contact4 = this.contact[i].contact4;
        this.email = this.contact[i].email;
      }
  }
  //getStatus
  getStatus() {
    this.isLoading =true;
    this.service.getStatus()
      .subscribe(response => {
        this.status = (response.json());
        this.statusid = this.status[0].statusid;
        this.statusname = this.status[0].statusname;
        this.isLoading = false;
        //console.log(response.json());
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
  //getCustomerLog  
  getCustomerLogByCustomerID(customerid) {
    this.isLoading =true;
    this.service.getCustomerLogByCustomerID(customerid)
      .subscribe(response => {
        if (response.json() != null) {
          this.logbycustomerid = (response.json());
          this.logid = this.logbycustomerid[0].logid;
          this.customerid = this.logbycustomerid[0].customerid;
          this.statusid = this.logbycustomerid[0].statusid;
          this.comments = this.logbycustomerid[0].comments;
          this.Logdate.setDate(this.logbycustomerid[0].logdate);
          this.update = 1;
          this.isLoading = false;
        }
        else {
          this.update = 0;
          this.comments = '';
        }

      });
  }
  //getCustomerLog
  getCustomerLogByID(logid) {
    this.editcheck = 1;
    this.update = 1;
    this.disabled = 'disabled';
    this.isLoading =true;
    this.service.getCustomerLogByID(logid)
      .subscribe(response => {
        if (response.json() != null) {
          this.log = (response.json());
          this.logid = this.log[0].logid;

          this.service.getCustomer()
            .subscribe(response => {
              this.customers = this.getDropdownList(response.json(), "customerid", "customername");
              this.customerid = this.log[0].customerid;
              this.customermodel = this.log[0].customerid;
              var customerlist = response.json();
              for (let i = 0; i < customerlist.length; i++)
                if (customerlist[i].customerid == this.customerid) {
                  this.customerphone = customerlist[i].customerphone;
                  this.customercell = customerlist[i].customercell;
                }

              this.getContact(this.log[0].customerid);
              this.getCustomerLogByCustomerID(this.log[0].customerid);
            });



          this.statusid = this.log[0].statusid;
          this.comments = this.log[0].comments;
          this.Logdate.setDate(this.log[0].logdate);
          this.isLoading = false;
        }

      });
  }
  //saveComments 
  saveComments(logid, customerid, customerphone, customercell, contactcode, contact1, contact2, contact3, contact4, email, comments, statusid) {
    if (comments.length >= 1) {
      if (this.update == 0) {
        var customerlog = new CustomerLogBook(0, customerid, customerphone, customercell, contactcode, contact1, contact2, contact3, contact4, email, this.Logdate.getDateFinal(), comments, this.logedInUserID, statusid, this.UserSessionID);
        console.log(customerlog);
        this.service.saveCustomerLog(customerlog).then(
          (response) => {
            this.update = 1;
            //alert('update=1');
            console.log(response);
            this.getCustomerLogBook();
            this.modalReference.close();
            swal("Comments Saved");
          },
          (error) => console.log(error))
      }
      else {
        var customerlog = new CustomerLogBook(logid, customerid, customerphone, customercell, contactcode, contact1, contact2, contact3, contact4, email, this.Logdate.getDateFinal(), comments, this.logedInUserID, statusid, this.UserSessionID);
        console.log(customerlog);
        this.service.updateCustomerLog(customerlog).then(
          (response) => {
            console.log(response);
            this.getCustomerLogBook();
            this.modalReference.close();
            //this.clearFields();
            //this.getStatus();
            //this.getCustomers();
            ; swal("Comments Updated");
          },
          (error) => console.log(error))
      }
    }
    else {
      this.wrongComment();
    }
  }
  //clearFields
  clearFields() {
    this.customerphone = '';
    this.customercell = '';
    this.contact1 = '';
    this.contact2 = '';
    this.contact3 = '';
    this.contact4 = '';
    this.email = '';
    this.Logdate = new cDate();
    this.comments = '';
    this.update = 0;
    this.editcheck = 0;
    this.disabled = '';
    this.Logdate = new cDate();
    this.service.getCustomer()
      .subscribe(response => {
        this.customers = this.getDropdownList(response.json(), "customerid", "customername");
        this.customermodel = this.customers[0].id;

      });
    this.getFills();
  }
  //checkName
  wrongComment() {
    if (this.comments.length >= 1) {
      this.checkComment();
    }
    else {
      this.checkComments = '1px solid red';
      this.hidesave = 'none';

    }
  }
  checkComment() {
    this.checkComments = '';
    this.hidesave = '';
  }
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
  cancel() {
    this.clearFields();
  }
}










