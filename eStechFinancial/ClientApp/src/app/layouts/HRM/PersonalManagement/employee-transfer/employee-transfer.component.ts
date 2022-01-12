import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeTransferService, LoginService, EmployeeTransfer, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'employee-transfer',
  templateUrl: './employee-transfer.component.html',
  styleUrls: ['./employee-transfer.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EmployeeTransferComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
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
  submitAdd:any;
  submitUpdate:any;

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

  noffice: any[] = [];
  nofficecode: any = 1;
  nofficename: any = '';
  ndepartment: any[] = [];
  ndepartmentcode: any = 1;
  ndepartmentname: any = '';

  transfer: any[] = [];
  transfercode: any = 0;
  transfertype: any = 1;

  interoffice: any = 1;
  interdept: any = 0;
  letterno: any = '';
  showOfficeOn: any = '';
  showOfficeOff: any = 'none';


  public letterdate = new cDate();
  public joiningdate = new cDate();
  editmode: any = 0;
  addbutton: any = '';
  addnewrow: any = 'none';

  ////////////////////////

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor( private LoginService: LoginService,private service: EmployeeTransferService, private modalService: NgbModal) {
   
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
    this.permissionUtility.setPagePermissions(20020);
    }
     ////////////////////////
  
  //getGrid
  getGrid(value:any) {
    this.isLoading =true;  
      this.service.getGrid(value,this.priviledged_Offices)
      .subscribe(response => { 
        if(response.json() !== null){
          this.gridlist = (response.json());
          this.isLoading = false;  
        }
        else{
          this.gridlist = [];
        this.isLoading = false;  
        }
        
      });
    
  }
  //getFills
  getFills() {
    this.getEmployees();
    //this.getOfficeNew();
    this.getDepartmentNew();
  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        console.log(response.json());
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = this.emplist[0].id;
        this.empname = this.emplist[0].text;
        this.transfer = response.json();
        this.isLoading = false;
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
        this.designation = (response.json());
        this.designationcode = this.designation[0].designationcode;
        this.designationname = this.designation[0].designationname;
        this.isLoading = false;
      });
  }
  //getDepartment
  getDepartment(empcode) {
    this.isLoading =true;
    this.service.getDepartment(empcode)
      .subscribe(response => {
        this.department = (response.json());
        this.departmentcode = this.department[0].departmentcode;
        this.departmentname = this.department[0].departmentname;
        this.isLoading = false;
      });
  }
  //getOffice
  getOffice(empcode) {
    this.isLoading =true;
    this.service.getOffice(empcode)
      .subscribe(response => {
        this.office = (response.json());
        this.officecode = this.office[0].officecode;
        this.officename = this.office[0].officename;
        this.getOfficeNew(this.officecode);
        this.isLoading = false;
      });
  }
  //getOfficeNew
  getOfficeNew(officecode) {
    this.isLoading =true;
    this.service.getOfficeNew(officecode)
      .subscribe(response => {
        this.noffice = (response.json());
        if (this.noffice != null) {
          this.nofficecode = this.noffice[0].officecode;
          this.nofficename = this.noffice[0].officename;
        }
        else {
          this.changeID();
          swal('No Other Office Found!')
   
        }
        this.isLoading = false;
        // console.log(response.json())
      });
  }
  //getDepartmentNew
  getDepartmentNew() {
    this.isLoading =true;
    this.service.getDepartmentNew()
      .subscribe(response => {
        this.ndepartment = (response.json());
        this.ndepartmentcode = this.ndepartment[0].departmentcode;
        this.ndepartmentname = this.ndepartment[0].departmentname;
        this.isLoading = false;
        // console.log(response.json())
      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.empcode = '';
    this.empmodel = 1;
    this.departmentcode = 1;
    this.designationcode = 1;
    this.letterno = '';
    this.letterdate = new cDate();
    this.joiningdate = new cDate();
    this.emplist = [];
    this.transfer = [];
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
  //saveEmployeeTransfer
  saveEmployeeTransfer(transfertype, officecode, nofficecode, departmentcode, ndepartmentcode, letterno) {    
    var letterdate=$("#ltdt").val();
    var joinddate=$("#joindt").val();
    if(letterdate=='' || letterdate.toString().length<10){
      swal("Letter Date Is Empty Or Invalid"); 
      return;
    }
    if(joinddate=='' || joinddate.toString().length<10){
      swal("Joining Date Is Empty Or Invalid"); 
      return;
    }
    if (letterno != '') {
      if (transfertype != 1) {
        var empren = new EmployeeTransfer(0, this.empcode, transfertype, officecode, officecode, departmentcode, ndepartmentcode, letterno, this.letterdate.getDateFinal(), this.joiningdate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      }
      else {
        var empren = new EmployeeTransfer(0, this.empcode, transfertype, officecode, nofficecode, departmentcode, ndepartmentcode, letterno, this.letterdate.getDateFinal(), this.joiningdate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      }

     
      this.service.saveEmployeeTransfer(empren).then(
        (response) => {

          this.getGrid("");
          this.modalReference.close();
          //swal("Record Added!");
        },
        (error) => console.log(error))
    }
    else { swal("Enter Letter No!"); }



  }
  //updateEmployeeTransfer
  updateEmployeeTransfer(transfertype, officecode, nofficecode, departmentcode, ndepartmentcode, letterno) {
  this.submitAdd='';
  this.permissionUtility.PermissionAdd='';
  var letterdate=$("#ltdt").val();
    var joinddate=$("#joindt").val();
    if(letterdate=='' || letterdate.toString().length<10){
      swal("Letter Date Is Empty Or Invalid"); 
      return;
    }
    if(joinddate=='' || joinddate.toString().length<10){
      swal("Joining Date Is Empty Or Invalid"); 
      return;
    }
    if (letterno != '') {
      if (transfertype != 1) {
        var empren = new EmployeeTransfer(this.transfercode, this.empcode, transfertype, officecode, officecode, departmentcode, ndepartmentcode, letterno, this.letterdate.getDateFinal(), this.joiningdate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      }
      else {
        var empren = new EmployeeTransfer(this.transfercode, this.empcode, transfertype, officecode, nofficecode, departmentcode, ndepartmentcode, letterno, this.letterdate.getDateFinal(), this.joiningdate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      }
      
      this.service.updateEmployeeTransfer(empren).then(
        (response) => {
          this.getGrid("");
          this.modalReference.close();
          //swal("Record Updated!");
        },
        (error) => console.log(error))
    }
    else { swal("Enter Letter No!"); }

  }
  //getDetailsByID
  getDetailsByID(empselected, transfercode, content) {
    //alert(empselected);
    this.mode = true;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.btnmode = false;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.transfer = response.json();

        this.service.getDetailsByID(transfercode)
          .subscribe(response => {


            var transferbyid = response.json();
            this.transfercode = transferbyid[0].transfercode;
            this.letterno = transferbyid[0].letterno;
            this.transfertype = transferbyid[0].transfertype;

            if (this.transfertype != 1) {
              this.interoffice = 0; this.interdept = 1;
            }
            else {
              this.interoffice = 1; this.interdept = 0;
            }
            this.service.getOfficeNew(0)
              .subscribe(response => {

                this.office = (response.json());
                this.officecode = transferbyid[0].officecode;

                this.service.getOfficeNew(this.officecode)
                  .subscribe(response => {
                    this.noffice = []
                    this.noffice = response.json();
                    if (this.noffice != null) {
                      this.nofficecode = this.noffice[0].officecode;
                      
                    }
                    // alert(transferbyid[0].nofficecode);
                  });

              });

            this.service.getDepartmentNew()
              .subscribe(response => {
                this.department = (response.json());
                this.departmentcode = transferbyid[0].departmentcode;
                this.ndepartment = []
                this.ndepartment = (response.json());
                this.ndepartmentcode = transferbyid[0].ndepartmentcode;
              });

            this.letterdate.setDate(transferbyid[0].letterdate);
            this.joiningdate.setDate(transferbyid[0].joiningdate);

          });
        this.getDesignation(empselected);
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
  onDateSelection(e: any) {
    console.log(e);
  }
  changeIO() {
    this.interoffice = 1;
    this.interdept = 0;
    this.transfertype = 1;
    this.showOfficeOn = '';
    this.showOfficeOff = 'none';
  }
  changeID() {
    this.interoffice = 0;
    this.interdept = 1;
    this.transfertype = 2;
    this.showOfficeOn = 'none';
    this.showOfficeOff = '';

  }
}
