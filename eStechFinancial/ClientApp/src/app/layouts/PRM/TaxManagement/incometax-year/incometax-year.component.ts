import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { IncomeTaxYearService, IncomeTaxYear, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'incometax-year',
  templateUrl: './incometax-year.component.html',
  styleUrls: ['./incometax-year.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class IncomeTaxYearComponent implements OnInit {
  
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
  fiscalyear: any[] = [];
  fiscalyearcode: any = 0;
  fiscalyearname: any = '';
  exsenior: any = 0;
  exrate: any = 0;
  examount: any = 0;


  constructor(private service: IncomeTaxYearService, private modalService: NgbModal) {
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getGrid("");
    this.permissionUtility.setPagePermissions(110046);
    this.logedInUserID = this.service.getSession('user_ID');
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

  }

  //getFiscalYear
  getFiscalYear() {
    this.isLoading =true;
    this.service.getFiscalYear()
      .subscribe(response => {
        this.isLoading = false;
        this.fiscalyear = response.json();
        console.log(response.json());
        this.fiscalyearcode = this.fiscalyear[0].fy;
        this.fiscalyearname = this.fiscalyear[0].fy;

      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
 



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
    var data = new IncomeTaxYear(this.fiscalyearcode, this.exsenior, this.exrate, this.examount, this.logedInUserID,this.UserSessionID);
    console.log();
    this.service.saveData(data).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
      },
      (error) => { console.log(error); 
        swal('Fiscal Year Exists!')
        this.isLoading=false;
       })

  }
  //updateData
  updateData() {

    this.isLoading =true;
    var data = new IncomeTaxYear(this.fiscalyearcode, this.exsenior, this.exrate, this.examount, this.logedInUserID, this.UserSessionID);
    console.log();
    this.service.updateData(data).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
      },
      (error) => console.log(error))
      this.isLoading=false;
  }
 
  //getDetailsByID
  getDetailsByID(TaxYear, content) {
    //alert(leavecode);
    this.isLoading =true;
    this.mode = true;
    this.btnmode = false;
    
    this.service.getDetailsByID(TaxYear)
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

              this.exsenior = list[0].exsenior;
              this.exrate = list[0].exrate;
              this.examount = list[0].examount;   
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
 

}
