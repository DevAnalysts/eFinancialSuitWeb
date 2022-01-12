import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { IncomeTaxRateService,LoginService,  IncomeTaxRate, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'incometax-rate',
  templateUrl: './incometax-rate.component.html', 
  styleUrls: ['./incometax-rate.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class IncomeTaxRateComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility()
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
    p: number = 1;
    id: any;
  modalReference: NgbModalRef;
 isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;

  gridlist: any[] = [];
  taxrateid: any = 0;
  fiscalyear: any[] = [];
  fiscalyearcode: any = 0;
  fiscalyearname: any = '';
  amountfrom: any = 1;
  amountto: any = 0;
  rate: any = 0;
  examount: any = 0;
  examounttax: any = 0;
  active: any = 0;

  showsave: any = '';
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
constructor(private LoginService: LoginService,private service: IncomeTaxRateService, private modalService: NgbModal) {
  this.userOffice = this.LoginService.getSession('userOffice');
  this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
  this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
  this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  this.priviledged_Offices = this.userPrivilegedOffice;
   this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getGrid("");
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(110044);
  }
  //getGrid
  getGrid(value:any) {
    this.isLoading =true;
    this.service.getGrid(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.gridlist = (response.json());
  
          // console.log(response.json())
        }
        else{
          this.isLoading = false;
        this.gridlist = [];
        }
        

      });
  }
  //getFills
  getFills() {

    this.getFiscalYear();
    this.getAmountFrom();

  }

  //getFiscalYear
  getFiscalYear() {
    this.isLoading =true;
    this.service.getFiscalYear()
      .subscribe(response => {
        this.isLoading = false;
        this.fiscalyear = response.json();
        // console.log(response.json());
        this.fiscalyearcode = this.fiscalyear[0].fy;
        this.fiscalyearname = this.fiscalyear[0].fy;

      });
  }
  //getAmountFrom
  getAmountFrom() {
    this.isLoading =true;
    this.service.getAmountFrom()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var list = response.json();
          console.log(response.json())
          this.amountfrom = list[0].amountfrom;
          this.amountto = parseInt(list[0].amountfrom) + 1;

        }
        else {
          //this.amountfrom = 1;
          //this.amountto = 2;
        }
      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.showsave = '';
    this.amountfrom = 1;
    this.amountto = 0;
    this.rate = 0;
    this.examount = 0;
    this.examounttax = 0;
    this.status = 0;



    this.getFills();
  }
  //IfExists
  IfExists(bookcode) {
    this.service.IfExists(bookcode)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //saveData
  saveData() {
    this.isLoading =true;
    if (this.amountfrom > this.amountto) {
      this.showsave = 'none';
      swal('Enter "Amount To" Greater Than "Amount From"!');

    }
    else {
      var data = new IncomeTaxRate(this.taxrateid, this.fiscalyearcode, this.amountfrom, this.amountto, this.rate, this.examount, this.examounttax, this.active, this.logedInUserID, this.UserSessionID);

      this.service.saveData(data).then(
        (response) => {
          this.isLoading = false;
          this.getGrid("");
          this.modalReference.close();
        },
        (error) => console.log(error))

    }

  }
  //updateData
  updateData() {

    this.isLoading =true;
    if (this.amountfrom > this.amountto) {
      this.showsave = 'none';
      swal('Enter "Amount To" Greater Than "Amount From"!');

    }
    else {
      var data = new IncomeTaxRate(this.taxrateid, this.fiscalyearcode, this.amountfrom, this.amountto, this.rate, this.examount, this.examounttax, this.active, this.logedInUserID, this.UserSessionID);

      this.service.updateData(data).then(
        (response) => {
          this.isLoading = false;
          this.getGrid("");
          this.modalReference.close();
        },
        (error) => console.log(error))

    }

  }

  //getDetailsByID
  getDetailsByID(ID, content) {
    //alert(leavecode);
    this.isLoading =true;
    this.mode = true;
    this.btnmode = false;
    this.taxrateid = ID;

    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var list = response.json();

          this.isLoading =true;
          this.service.getFiscalYear()
            .subscribe(response => {
              this.isLoading = false;
              this.fiscalyear = response.json();
              this.fiscalyearcode = list[0].year;
              this.fiscalyearname = list[0].year;
            });

          this.amountfrom = list[0].amountfrom;
          this.amountto = list[0].amountto;
          this.rate = list[0].rate;
          this.examount = list[0].examount;
          this.examounttax = list[0].examounttax;
          this.active = list[0].status;
        }
      });

    this.openDetail(content);

  }
  //openAddModel
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
  //openDetail modal
  openDetail(content) {
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
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
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

  checkAmountFrom() {

    if (this.amountfrom >= this.amountto) {
      this.showsave = 'none';
      swal('Enter "Amount To" Greater Than "Amount From"!');
    }
    else {
      this.showsave = '';
    }
  }

}
