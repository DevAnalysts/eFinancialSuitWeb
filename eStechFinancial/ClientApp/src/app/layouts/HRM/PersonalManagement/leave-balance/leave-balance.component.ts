import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { LeaveBalanceService,LoginService, LeaveBalance, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'leave-balance',
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class LeaveBalanceComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
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
  emplist: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  department: any[] = [];
  departmentcode: any = 1;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 1;
  designationname: any = '';
  office: any[] = [];
  officecode: any = 1;
  officename: any = '';
  category: any[] = [];
  categorycode: any = 1;
  categoryname: any = '';
  leavetype: any[] = [];
  leavetypecode: any = 1;
  leavetypename: any = '';
  openingbalance: any = '';
  leavebalance: any = 0;

  leave: any[] = [];
  submitAdd:any;
  submitUpdate:any;
  leavecode: any = 0;
  leavebalancecode: any = 0;


  editmode: any = 0;
  addtextbox: any = 'none';
  showbtn: any = '';


  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor( private LoginService: LoginService,private service: LeaveBalanceService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20009);
    }
     ////////////////////////
  
  //getGrid
  getGrid(value:any) {
    this.isLoading =true; 
    this.service.getGrid(value,this.priviledged_Offices)
      .subscribe(response => {
        if(response.json() !== null){
          this.isLoading = false;
          this.gridlist = (response.json()); 
        }
        else{
          this.isLoading = false;
          this.gridlist = []; 
        }
       
      });
     
  }
  //getFills
  getFills() {
    this.getEmployees();
   
  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        console.log(response.json());
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        //this.empcode = this.emplist[0].id;
        //this.empname = this.emplist[0].text;
        //this.termination = response.json();

      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;

    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getOffice(this.empcode);
    this.getCategory(this.empcode);
    this.getLeaveType(this.empcode);
  }
  //getDesignation
  getDesignation(empcode) {

    this.service.getDesignation(empcode)
      .subscribe(response => {

        if (response.json() != null) {
          this.designation = (response.json());
          this.designationcode = this.designation[0].designationcode;
          this.designationname = this.designation[0].designationname;
        }
      });
  }
  //getDepartment
  getDepartment(empcode) {

    this.service.getDepartment(empcode)
      .subscribe(response => {

        if (response.json() != null) {
          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
        }
      });
  }
  //getOffice
  getOffice(empcode) {

    this.service.getOffice(empcode)
      .subscribe(response => {

        if (response.json() != null) {
          this.office = (response.json());
          this.officecode = this.office[0].officecode;
          this.officename = this.office[0].officename;
        }
      });
  }
  //getCategory
  getCategory(empcode) {

    this.service.getCategory(empcode)
      .subscribe(response => {
 
        if (response.json() != null) {
          this.category = (response.json());
          this.categorycode = this.category[0].categorycode;
          this.categoryname = this.category[0].categoryname;
        }
      });
  }
  //getLeaveType
  getLeaveType(empcode) {
    this.isLoading =true;
    this.service.getLeaveType(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
        this.leavetype = (response.json());
 
          this.leavetypecode = this.leavetype[0].leavetypE_CODE;
          this.leavetypename = this.leavetype[0].type_Name;
          this.getLeaveTypeChange();
        }
      });
  }
  //getLeaveTypeChange
  getLeaveTypeChange() {
    this.isLoading =true;
    this.service.getLeaveTypeChange(this.empcode, this.leavetypecode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.showbtn = 'none'
          //swal('Opening Balance Already Exist')
        }
        else {
          this.showbtn = ''
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
    this.empcode = 0;
  
    this.department = [];
    this.designation = [];
    this.category = [];
    this.emplist = [];
    this.leave = [];
    this.office = [];
    this.leavetype = [];

    this.openingbalance = '';
    this.leavebalance = '';
    this.leavetypecode = 1;
    this.leavebalancecode = 0;
    this.addtextbox = 'none';
    this.showbtn = '';
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
  //saveEmployeeLeaveBal
  saveEmployeeLeaveBal(leavetypecode, openingbalance) {
    this.isLoading = false; 
    if(this.empcode!='0' || this.empcode.length>0){ 
    var empren = new LeaveBalance(0, this.empcode, leavetypecode, openingbalance, this.logedInUserID, this.UserSessionID);
    console.log(empren); 
    if(openingbalance>0 && openingbalance<=365){
    this.service.saveEmployeeLeaveBal(empren).then(
      (response) => {
        this.isLoading =true;

          this.getGrid("");
          this.modalReference.close();
          //console.log(response);
         // swal("Record Added!");
        },
        (error) => console.log(error))
      }else
      swal("Balance Always Greater Than 0 And Less Or Equal To 365");
      }else
      swal("Please Select Employee");
  }
  //updateEmployeeLeaveBal
  updateEmployeeLeaveBal(leavetypecode, openingbalance) {
    this.isLoading =true;
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
    if(this.empcode!='0' || this.empcode.length>0){  
    var empren = new LeaveBalance(this.leavebalancecode, this.empcode, leavetypecode, openingbalance, this.logedInUserID, this.UserSessionID);
    console.log(empren); 
    if(openingbalance>0 && openingbalance<=365){
    this.service.updateEmployeeLeaveBal(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //console.log(response);
        //swal("Record Updated!");
      },
      (error) => console.log(error))
    }else
    swal("Balance Always Greater Than 0 And Less Or Equal To 365");
    this.isLoading=false;
    }else
    swal("Please Select Employee");
    this.isLoading=false;
  }
  //getDetailsByID
  getDetailsByID(empselected,leavebalancecode, content) {
    this.isLoading =true;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.leavebalancecode = leavebalancecode;
    this.mode = true;
    this.btnmode = false;
    this.addtextbox = '';
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;

        this.service.getDetailsByID(leavebalancecode)
          .subscribe(response => {
            if (response.json() != null) {
              var leavebalbyid = response.json();

              this.service.getCategory(empselected)
                .subscribe(response => {
                  this.category = (response.json());
                  this.categorycode = this.category[0].categorycode;
                  this.categoryname = this.category[0].categoryname;
                  this.service.getLeaveType(this.empcode)
                    .subscribe(response => {
                      this.leavetype = (response.json());
                      this.leavetypecode = leavebalbyid[0].leavetypecode;
                      this.isLoading = false;
                    });
                  this.isLoading = false;
                });
             
              this.openingbalance = leavebalbyid[0].openingbalance;
              this.leavebalance = leavebalbyid[0].leavebalance;
            }
          });
        this.getDesignation(empselected);
        this.getDepartment(empselected);
        this.getOffice(empselected);

        this.openDetail(content);
      });

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


      if (this.btnmode)
        ar.push({
          id: 0,
          text: ''
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


}
