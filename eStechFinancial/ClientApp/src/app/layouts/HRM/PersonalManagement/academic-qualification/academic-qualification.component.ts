import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AcademicQualificationService,LoginService, EmployeeAcademicQualification, PermissionUtility } from '../../../../shared';

import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'academic-qualification',
  templateUrl: './academic-qualification.component.html',
  styleUrls: ['./academic-qualification.component.scss'],


})
export class AcademicQualificationComponent implements OnInit {
  ////////////////////////////////////////
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  ////////////////////////////////////////
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
  emplist: Array<Select2OptionData>;
  empmodel: any;
  empcode: number = 0;
  empname: any = '';

  public valid:Validation=new Validation()
  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = '';

  designation: any[] = [];
  designationcode: any = 0;
  designationname: any = '';

  qualification: any[] = [];
  educationlvl: any = 1;
  result: any = 1;
  year: any = 0;
  resulttype: any = 1;
  markstotal: any = 0;
  marksobtained: any = 0;
  division: any = 1;
  board: any = '';
  institute: any = '';
  submitAdd:any;
  submitUpdate:any;

  addbutton: any = '';
  addnewrow: any = 'none';

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;

  constructor(private LoginService: LoginService,private service: AcademicQualificationService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20042);
    }
 ////////////////////////
 
    
  //getFills
  getFills() {
    this.getEmployees();
  }
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
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(0,this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        //this.empcode = this.emplist[0].id;
        //this.empname = this.emplist[0].text;

      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
if(this.empcode>0){
    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getQualification(this.empcode);
}
  }
  //getDesignation
  getDesignation(empcode) {
    this.isLoading =true;
    this.designation = [];
    this.service.getDesignation(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          this.designation = (response.json());
          this.designationcode = this.designation[0].designationcode;
          this.designationname = this.designation[0].designationname;
        }

      });
  }
  //getDepartment
  getDepartment(empcode) {
    this.isLoading =true;
    this.department = [];
    this.service.getDepartment(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
        }
      });
  }
  //getQualification
  getQualification(empcode:number) {
    this.isLoading =true;
    this.qualification = [];
    if (empcode!=0)
    this.service.getQualification(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          this.qualification = (response.json());
        }
        
        });
    else
      this.isLoading = false;
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.empmodel = 0;
    this.departmentname = '';
    this.designationname = '';
    this.qualification = [];
    this.empcode=0;
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
  //changeMode
  changeMode(i: any, e: EmployeeAcademicQualification, Mode: any) {
    var flag = false;
    if (this.qualification!=null ) {

      let qualificationexists= this.qualification.filter(q=>q.educatioN_LEVEL_ID==this.educationlvl);
       if(qualificationexists.length>0){
             flag=true;
       }
     
    }
   
   if (Mode == 2) {
     
      this.service.deleteQualification(e).then(
        (response) => {
          this.isLoading = false; 
          this.qualification.splice(i, 1);

          //swal("Academic Qualification Added!");
        },
        (error) => console.log(error))
    }
    
  }
  //saveQualification
  saveQualification(educationlvl, result, year, resulttype, markstotal, marksobtained, division, board, institute) {
    ///console.log(educationlvl, result, year, resulttype, markstotal, marksobtained, division, board, institute);
    var exist = 0;
    this.isLoading =true;
    if (this.qualification!=null ) {
      for (let i = 0; i < this.qualification.length; i++) {
        if (this.qualification[i].educatioN_LEVEL_ID == this.educationlvl) {
          this.isLoading = false;
          //swal('Education Level Already Exist');
          exist = 1;
        }
      } 
    }
    if (exist != 0) { }
    else {
      if (year != '' && year >= 1950) {
        if(this.board!=''){
          if(this.institute!=''){
              if (markstotal < marksobtained) { swal('Total Marks Cannot Be Less Than Marks Obtained') }
              else {
                var empQualification = new EmployeeAcademicQualification(0, this.empcode, educationlvl, result, year, resulttype, markstotal, marksobtained, division, board, institute, this.logedInUserID, this.UserSessionID);
                console.log(empQualification);
                
                this.service.saveQualification(empQualification).then(
                  (response) => {
                    this.isLoading = false;
                    this.getQualification(this.empcode);
                    this.getGrid("");
                    //this.modalReference.close();
                    this.cancel();

                    //swal("Academic Qualification Added!");
                  },
                  (error) => console.log(error))
              
            }
          }else{
            this.isLoading = false;
            swal("Institute name must be defined");
          }
        }
        else{
          this.isLoading = false;
          swal("Board name must be defined");
        }
        
      }
      else {
        this.isLoading = false;
        swal("Enter Year Greater Than 1950!")
      }
    }
  }
 
  //updateQualification
  updateQualification() {
    this.isLoading =true;
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
    var qualificationlist = [];
    qualificationlist = this.qualification;
    if(this.empcode!=0 && this.qualification.length>0){
           this.service.updateQualification(qualificationlist).then(
              (response) => {
                this.isLoading = false;
                this.getQualification(this.empcode); this.getGrid("");
                this.modalReference.close();
                //swal("Academic Qualification  Updated!")
              },
              (error) => console.log(error))
       
    }
    else
    if (this.empcode ==0 )
    swal("Employee Name Must Be Defined");
    if (this.empcode !=0 && this.qualification.length==0)
      swal("Enter Empty Fields!");
    this.isLoading=false;

  }
  //getDetailsByID
  getDetailsByID(empselected, content) {
    //alert(empselected);
    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.service.getEmployees(empselected,this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        //this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
if(this.permissionUtility.PermissionView=='')
{
  this.submitAdd='none';
  this.submitUpdate='none';
}
        var list = response.json();
        for (let i = 0; i < list.length; i++)
          if (list[i].empcode == empselected) {
            this.empname = list[i].empname;
          }

        this.empcode = empselected;
        //this.empmodel = empselected;
        this.getDepartment(empselected);
        this.getDesignation(empselected);
        this.getQualification(empselected);
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
  //getDiploma
  getDiploma(d): any {
    let Res = '';
    if (d.length > 0) {

      switch (d[0].education_Level_ID) {
        case 1:
          Res = "Matric";
          break;
        case 2:
          Res = "Intermediate";
          break;
        case 3:
          Res = "Diploma";
          break;
        case 4:
          Res = "Bachelors";
          break;
        case 5:
          Res = "Masters";
          break;
        case 6:
          Res = "Phd";
          break;
        default:
      }

    }
    return Res;

  }
  add() {
    this.addbutton = 'none';
    this.addnewrow = '';
  }
  cancel() {
    this.addbutton = '';
    this.addnewrow = 'none';
    this.educationlvl = 1;
    this.result = 1;
    this.year = 0;
    this.resulttype = 1;
    this.markstotal = 0;
    this.marksobtained = 0;
    this.division = 1;
    this.board = '';
    this.institute = '';
  }

}
