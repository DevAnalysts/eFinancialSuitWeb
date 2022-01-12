import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalaryMonthService,  LoginService,SalaryMonth, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
@Component({
  selector: 'salary-month',
  templateUrl: './salary-month.component.html',
  styleUrls: ['./salary-month.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SalaryMonthComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  modalReference: NgbModalRef;
 isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;
    id: any;

  gridlist: any[] = [];
  salarymonth: any[] = [];
  salarymonthcode: any = 0;
  office: any[] = [];
  officecode: any = 1;
  officename: any = '';

  month: any[] = [];
  yearcode: any = '2000';
  monthcode: any = 0;
  monthname: any = '';
  nextmonth:any='';
  lastmonthcode: any = 0;

  iscurrent: any = 1;
  close: any = 0;

  editmode: any = 0;
  addbutton: any = '';


  ////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor(private LoginService: LoginService,private service: SalaryMonthService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(30030);
    }
    
  //getGrid
  getGrid(value:any) {
    this.isLoading =true;
    this.service.getGrid(value,this.userPrivilegedOffice)
      .subscribe(response => {  
        if(response.json() !== null){
          this.gridlist = (response.json());
          this.isLoading = false;
          // console.log(response.json())
        }
        else{
          this.gridlist = [];
        this.isLoading = false;
        
        }
        

      });
  }
  //getFills
  getFills() {
    this.getOffice();
  }


  //getOffice
  getOffice() {
    this.isLoading =true;
    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        this.office = response.json();
        this.officecode = this.office[0].officecode;
        this.officename = this.office[0].officename;
        this.getMonth(this.officecode);
      });
  }
  //getMonth
  getMonth(officecode) {
    this.isLoading =true;
    this.service.getMonth(officecode)
      .subscribe(response => {
        this.isLoading = false;
        this.month = (response.json());
        console.log(this.month);
        this.lastmonthcode = this.month[0].salaryMonthID; 
        var monthcode = this.month[0].monthcode;
        this.setSalaryMonth(monthcode);

      });
  }
  setSalaryMonth(lastmonthcode) {
    var str = new String(lastmonthcode); 
    var month;
    var year;
    if (str.length == 5) {
      month = parseInt(str.substring(0, 1));
      year = parseInt(str.substring(1));
      
    }
    else if (str.length == 6) {
      month = parseInt(str.substring(0, 2));
      year = parseInt(str.substring(2));
    }
    if (month == 12) {
      year = year + 1;
      month = 1;
    }
    else if (month < 12) {
      month = month + 1
    }
    var monthname = '';
    var monthcode = '';
    var nextmonth = '';
    switch (month) {
      case 1:
        monthname = "Jan " + year;
        monthcode = "1" + year;
        nextmonth = "Feb " + year;
        break;
      case 2:
        monthname = "Feb " + year;
        monthcode = "2" + year;
        nextmonth = "Mar " + year;
        break;
      case 3:
        monthname = "Mar " + year;
        monthcode = "3" + year;
        nextmonth = "Apr " + year;
        break;
      case 4:
        monthname = "Apr " + year;
        monthcode = "4" + year;
        nextmonth = "May " + year;
        break;
      case 5:
        monthname = "May " + year;
        monthcode = "5" + year;
        nextmonth = "June " + year;
        break;
      case 6:
        monthname = "June " + year;
        monthcode = "6" + year;
        nextmonth = "July " + year;
        break;
      case 7:
        monthname = "July " + year;
        monthcode = "7" + year;
        nextmonth = "Aug " + year;
        break;
      case 8:
        monthname = "Aug " + year;
        monthcode = "8" + year;
        nextmonth = "Sep " + year;
        break;
      case 9:
        monthname = "Sep " + year;
        monthcode = "9" + year;
        nextmonth = "Oct " + year;
        break;
      case 10:
        monthname = "Oct " + year;
        monthcode = "10" + year;
        nextmonth = "Nov " + year;
        break;
      case 11:
        monthname = "Nov " + year;
        monthcode = "11" + year;
        nextmonth = "Dec " + year;
        break;
      case 12:
        monthname = "Dec " + year;
        monthcode = "12" + year;
        nextmonth = "Jan " + (year+1);
        break;
      default:
    }
    this.monthname = monthname;
    this.nextmonth=nextmonth;
    this.monthcode = parseInt(monthcode);
    console.log(this.monthname, this.monthcode);
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);




    this.salarymonth = [];
    this.office = [];
    this.month = [];
    this.officecode = 1;
    this.monthcode = 1;
    this.yearcode = '2000';
    this.monthname = '';
    this.nextmonth = '';
    this.iscurrent = 1;
    this.close = 0;

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
    console.log()
    this.permissionUtility.PermissionAdd='';
    var obj = new SalaryMonth(0, this.lastmonthcode, this.officecode, this.monthcode, this.monthname, this.close, this.iscurrent, this.logedInUserID);
    //console.log(empren);
    this.service.saveData(obj).then(
      (response) => {

        this.getGrid("");
        this.modalReference.close();
        //swal("Record Added!");
      },
      (error) => console.log(error))

  }
  ////updateData
  //updateData() {
  //  console.log();

  //  var empren = new SalaryAccount(this.empcode, this.paymentmode, this.bankcode, this.branchcode, this.accountno, this.remarks);
  //  //console.log(empren);
  //  this.service.updateData(empren).then(
  //    (response) => {
  //      this.getGrid();
  //      this.modalReference.close();
  //      //swal("Record Updated!");
  //    },
  //    (error) => console.log(error))

  //}
  //getDetailsByID
  getDetailsByID(empselected, content) {
    //alert(empselected);
    this.mode = true;
    this.btnmode = false;

    this.service.getDetailsByID(empselected)
      .subscribe(response => {

        var Listbyid = response.json();
 
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


}
