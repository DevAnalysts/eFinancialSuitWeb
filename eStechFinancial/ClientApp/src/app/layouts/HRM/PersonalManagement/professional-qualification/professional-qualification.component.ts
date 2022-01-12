import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalQualificationService,LoginService, EmployeeProfessionalQualification, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'professional-qualification',
  templateUrl: './professional-qualification.component.html',
  styleUrls: ['./professional-qualification.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ProfessionalQualificationComponent implements OnInit {
   
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
  submitAdd:any;
  submitUpdate:any;

  gridlist: any[] = [];
  emplist: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';

  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = '';
  public valid:Validation=new Validation()

  designation: any[] = [];
  designationcode: any = 0;
  designationname: any = '';

  proqualification: any[] = [];
  certificate: any = '';
  subject: any = '';
  institute: any = '';
  public fromdate = new cDate();
  public todate = new cDate();

  addbutton: any = '';
  addnewrow: any = 'none';

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;

  constructor(private LoginService: LoginService,private service: ProfessionalQualificationService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20043);
    }
     
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
    this.getProQualification(this.empcode);
  }
  //getDesignation
  getDesignation(empcode) {
    this.isLoading =true;
    this.designation = [];
    this.service.getDesignation(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.designation = (response.json());
          this.designationcode = this.designation[0].designationcode;
          this.designationname = this.designation[0].designationname;
        }
        this.isLoading = false;
      });
  }
  //getDepartment
  getDepartment(empcode) {
    this.isLoading =true;
    this.department = [];
    this.service.getDepartment(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
        }
        this.isLoading = false;
      });
  }
  //getProQualification
  getProQualification(empcode) {
    this.isLoading =true;
    this.proqualification = [];
    if (this.empcode !='0')
    this.service.getProQualification(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.proqualification = (response.json());
        }
        this.isLoading = false;
        //console.log(this.proqualification);
      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.empmodel = 0;
    this.departmentname = 0;
    this.designationname = 0;
    this.proqualification = [];
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
  changeMode(i: any, e: EmployeeProfessionalQualification, Mode: any) {
    var flag = false;
    if (this.proqualification!=null ) {

      let qualificationexists= this.proqualification.filter(q=>q.certificatE_NAME==this.certificate);
       if(qualificationexists.length>0){
             flag=true;
       }
     
    }
   
   if (Mode == 2) {
     
      this.service.deleteQualification(e).then(
        (response) => {
          this.isLoading = false; 
          this.proqualification.splice(i, 1);

          //swal("Academic Qualification Added!");
        },
        (error) => console.log(error))
    }
    
  }
  //saveProQualification
  saveProQualification(empcode,certificate, subject, institute) {
    var exist = 0;
    certificate=certificate.trim();
    subject=subject.trim();
    institute=institute.trim();
    if (empcode !='0' && certificate != '' && subject!='' && institute!='') {
      if (this.proqualification!= null) {
        for (let i = 0; i < this.proqualification.length; i++) {
          if (this.proqualification[i].certificatE_NAME == this.certificate) {
            swal('Course Already Exist');
            exist = 1;
          }
        }
      }
      if (exist != 0) { }
      else {

        var empQualification = new EmployeeProfessionalQualification(0, empcode, certificate, subject, institute, this.fromdate.getDateFinal(), this.todate.getDateFinal(), this.logedInUserID, '', '',this.UserSessionID);
      
       
        this.service.saveProQualification(empQualification).then(
          (response) => {
            this.getProQualification(this.empcode);
            this.getGrid("");
            //this.modalReference.close();
            this.cancel();
            //swal("Professional Qualification Added!");
          },
          (error) => console.log(error))
        }
    }
    else {
      if (empcode =='0') 
         swal("Employee Name Must Be Defined");
       else {
        
         swal("Enter Empty Fields!");
         
       } 
         
      this.isLoading=false;
    }
  }
  //updateProQualification
  updateProQualification() {
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
    var qualificationlist = [];
    qualificationlist = this.proqualification;
    console.log(qualificationlist, this.proqualification);
    if (this.empcode !='0' && this.proqualification.length>0){
    this.service.updateProQualification(qualificationlist).then(
      (response) => {
        this.getProQualification(this.empcode); this.getGrid(""); this.modalReference.close();
        //swal("Professional Qualification  Updated!")
      },
      (error) => console.log(error))
    }else
    if (this.empcode =='0' )
    swal("Employee Name Must Be Defined");
    if (this.empcode !='0' && this.proqualification.length==0)
      swal("Enter Empty Fields!");
    this.isLoading=false;

  }
  //getDetailsByID
  getDetailsByID(empselected, content) {
    //alert(empselected);
    this.mode = true;
    this.btnmode = false;
    if(this.permissionUtility.PermissionView=='')
    {
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.service.getEmployees(empselected,this.priviledged_Offices)
      .subscribe(response => {
        //this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        var list = response.json();
        for (let i = 0; i < list.length; i++)
          if (list[i].empcode == empselected) {
            this.empname = list[i].empname;
          }

        this.empcode = empselected;
        //this.empmodel = empselected;
        this.getDepartment(empselected);
        this.getDesignation(empselected);
        this.getProQualification(empselected);
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
  onDateSelection(e: any) {
    console.log(e);
  }

  add() {
    this.addbutton = 'none';
    this.addnewrow = '';
  }
  cancel() {
    this.addbutton = '';
    this.addnewrow = 'none';
    this.certificate = '';
    this.subject = '';
    this.institute = '';
    this.fromdate = new cDate();
    this.todate = new cDate();
  }

}
