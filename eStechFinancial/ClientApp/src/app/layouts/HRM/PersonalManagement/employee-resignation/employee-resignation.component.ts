import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeResignationService, LoginService, EmployeeResignation, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'employee-resignation',
  templateUrl: './employee-resignation.component.html',
  styleUrls: ['./employee-resignation.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EmployeeResignationComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  modalReference: NgbModalRef;
 isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
    guid: any;
    id: any;
    submitAdd:any;
    submitUpdate:any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;

  gridlist: any[] = [];
  emplist: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 0;
  designationname: any = '';
  office: any[] = [];
  officecode: any = 1;
  officename: any = '';

  resignation: any[] = [];
  resignationcode: any = 0;

  public resigndate = new cDate();
  public leavingdate = new cDate();
  editmode: any = 0;
  addbutton: any = '';
  addnewrow: any = 'none';

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor( private LoginService: LoginService,private service: EmployeeResignationService, private modalService: NgbModal) {
  
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
    this.getGrid(null);
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(20031);
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
        this.resignation = response.json();

      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getOffice(this.empcode);
  }
  //getDesignation
  getDesignation(empcode) {
    this.isLoading =true;
    this.service.getDesignation(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.designation = (response.json());
          this.designationcode = this.designation[0].designationcode;
          this.designationname = this.designation[0].designationname;
        }

      });
  }
  //getDepartment
  getDepartment(empcode) {
    this.isLoading =true;
    this.service.getDepartment(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
        }
      });
  }
  //getOffice
  getOffice(empcode) {
    this.isLoading =true;
    this.service.getOffice(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.office = (response.json());
          this.officecode = this.office[0].officecode;
          this.officename = this.office[0].officename;
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
    this.office = [];

    this.resigndate = new cDate();
    this.leavingdate = new cDate();
    this.emplist = [];
    this.resignation = [];
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
  //saveEmployeeResignation
  saveEmployeeResignation() {
    var resdate=$("#resdt").val();
    var lvdate=$("#lvdt").val();
    if(resdate=='' || resdate.toString().length<10){
      swal("Resign Date Is Empty Or Invalid");
      return;
    }
    if(lvdate=='' || lvdate.toString().length<10){
      swal("Leave Date Is Empty Or Invalid");
      return;
    }
    if (this.empcode != 0) {
      this.isLoading =true;
      var empren = new EmployeeResignation(0, this.empcode, this.resigndate.getDateFinal(), this.leavingdate.getDateFinal(), this.logedInUserID,this.UserSessionID);
      //console.log(empren);
      if(this.resigndate.getDate() <= this.leavingdate.getDate()){
      this.service.saveEmployeeResignation(empren).then(
        (response) => {
          this.isLoading = false;
          this.getGrid("");
          this.modalReference.close();
          //swal("Record Added!");
        },
        (error) => console.log(error))
    }else
    swal("Leaving Date Must Be Greater Than Resignation Date");
    this.isLoading=false;
  }
    else
      swal('Select Employee!');
      this.isLoading=false;
  }
  //updateEmployeeResignation
  updateEmployeeResignation() {
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
    var resdate=$("#resdt").val();
    var lvdate=$("#lvdt").val();
    if(resdate=='' || resdate.toString().length<10){
      swal("Resign Date Is Empty Or Invalid");
      return;
    }
    if(lvdate=='' || lvdate.toString().length<10){
      swal("Leave Date Is Empty Or Invalid");
      return;
    }
    if (this.empcode != 0) {
      this.isLoading =true;
      var empren = new EmployeeResignation(this.resignationcode, this.empcode, this.resigndate.getDateFinal(), this.leavingdate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      console.log(empren);
      if(this.resigndate.getDate() <= this.leavingdate.getDate()){
      this.service.updateEmployeeResignation(empren).then(
        (response) => {
          this.isLoading = false;
          this.getGrid("");
          this.modalReference.close();
          //swal("Record Updated!");
        },
        (error) => console.log(error))
    }else
    swal("Leaving Date Must Be Greater Than Resignation Date");
    this.isLoading=false;
  }
    else
      swal('Select Employee!');
      this.isLoading=false;
  }
  //getDetailsByID
  getDetailsByID(empselected, resignationcode, content) {
    this.isLoading =true;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.mode = true;
    this.btnmode = false;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {

        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.resignation = response.json();

        this.service.getDetailsByID(resignationcode)
          .subscribe(response => {
            this.isLoading = false;
            var Resignbyid = response.json();
            this.resignationcode = Resignbyid[0].resignationcode;
            this.resigndate.setDate(Resignbyid[0].resigndate);
            this.leavingdate.setDate(Resignbyid[0].leavingdate);

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
