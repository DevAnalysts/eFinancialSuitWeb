import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalExperienceService, LoginService, EmployeeProfessionalExperience, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'professional-experience',
  templateUrl: './professional-experience.component.html',
  styleUrls: ['./professional-experience.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ProfessionalExperienceComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();

  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
    p: number = 1;
    id: any;
    submitAdd:any;
    submitUpdate:any;
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
  departmentcode: any = 0;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 0;
  designationname: any = '';

  proexperience: any[] = [];
  employer: any = '';
  desig: any = '';
  salary: any = 0;
  country: any = 1;
  empadd: any = '';
  contact: any = '';
  public fromdate = new cDate();
  public todate = new cDate();

  addbutton: any = '';
  addnewrow: any = 'none';
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor(private LoginService: LoginService,private service: ProfessionalExperienceService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20044);
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
  
          //console.log(response.json())
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
    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getProExperience(this.empcode);
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
        if (response.json() !=null) {

          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
        }
        
      });
  }
  //getProExperience
  getProExperience(empcode) {
    this.isLoading =true;
    this.service.getProExperience(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null){
          this.proexperience = (response.json());
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
    
    this.departmentname = '';
    this.designationname = '';

    this.proexperience = [];
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
changeMode(i: any, e: EmployeeProfessionalExperience, Mode: any) {
  var flag = false;
  if (this.proexperience!=null ) {

    let qualificationexists= this.proexperience.filter(q=>q.employeR_NAME==this.employer);
     if(qualificationexists.length>0){
           flag=true;
     }
   
  }
 
 if (Mode == 2) {
   
    this.service.deleteQualification(e).then(
      (response) => {
        this.isLoading = false; 
        this.proexperience.splice(i, 1);

        //swal("Academic Qualification Added!");
      },
      (error) => console.log(error))
  }
  
}

  //saveProQualification
  saveProExperience(employer, desig, salary, country, empadd, contact) {
    this.isLoading =true;
    employer=employer.trim();
    desig=desig.trim();
    empadd=empadd.trim();
    contact=contact.trim();
      if(desig==''){this.desig='';}else{this.desig=desig;}
   
      if(empadd==''){this.empadd='';}else{this.empadd=empadd;}
    
      if(contact==''){this.contact='';}else{this.contact=contact;}
    if (employer != '') {
      var empExp = new EmployeeProfessionalExperience(0, this.empcode, employer, desig, salary, this.fromdate.getDateFinal(), this.todate.getDateFinal(), country, empadd, contact, this.logedInUserID, '', '', this.UserSessionID);
      console.log(empExp);  
      
      this.service.saveProExperience(empExp).then(
        (response) => {
          this.isLoading = false;
          this.getProExperience(this.empcode);
          this.getGrid("");
          //this.modalReference.close();
          this.cancel();
          //swal("Professional Experience Added!");
        },
        (error) => console.log(error))
       
    }
    else {
      if(employer.replace(/\s/g,"").length<=0){
      swal("Enter Employer Name!");
      this.employer='';
      this.isLoading=false;
      }
    }
  }
  //updateProExperience
  updateProExperience() {
    this.isLoading =true;
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
    var explist = [];
    explist = this.proexperience;
    console.log(explist, this.proexperience);
    if(this.empcode!='0' && this.proexperience.length>0){
    this.service.updateProExperience(explist).then(
      (response) => {
        this.isLoading = false;
        this.getProExperience(this.empcode); this.getGrid("");
        this.modalReference.close();
        //swal("Professional Experience  Updated!")
      },
      (error) => console.log(error))
    }else
    if (this.empcode =='0' )
    swal("Employee Name Must Be Defined");
    if (this.empcode !='0' && this.proexperience.length==0)
      swal("Enter Empty Fields!");
    this.isLoading=false;
  }
  //getDetailsByID
  getDetailsByID(empselected, content) {
    //alert(empselected);
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.service.getEmployees(empselected,this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        //this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        var list = response.json();
        for (let i = 0; i < list.length; i++)
          if (list[i].empcode == empselected) {
            this.empname = list[i].empname;
          }
        this.empcode = empselected;
       // this.empmodel = empselected;
        this.getDepartment(empselected);
        this.getDesignation(empselected);
        this.getProExperience(empselected);
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
  add() {
    this.addbutton = 'none';
    this.addnewrow = '';
  }
  cancel() {
    this.addbutton = '';
    this.addnewrow = 'none';
    this.employer= '';
    this.desig= '';
    this.salary= '';
    this.country= '';
    this.empadd= '';
    this.contact= '';
    this.fromdate = new cDate();
    this.todate = new cDate();
  }

}
