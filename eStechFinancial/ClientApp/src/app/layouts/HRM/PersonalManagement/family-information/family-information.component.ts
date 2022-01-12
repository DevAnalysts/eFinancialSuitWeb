import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { FamilyInformationService, LoginService, EmployeeFamily, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'family-information',
  templateUrl: './family-information.component.html',
  styleUrls: ['./family-information.component.scss'],


})
export class FamilyInformationComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
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
  office: any[] = [];
  officecode: any = 1;
  officename: any = '';
  department: any[] = [];
  departmentcode: any = 1;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 1;
  designationname: any = '';
  family: any[] = [];
  dependentname: any = '';
  dependentrelation: any = 1;
  isdependent: any = 0;

  addbutton: any = '';
  addnewrow: any = 'none';

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;

  ////////////////////////

  constructor(private LoginService: LoginService,private service: FamilyInformationService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20040);
    }
   
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
  
           // console.log(response.json());
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
    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getFamily(this.empcode);
  }
  //getDesignation
  getDesignation(empcode) {
    this.isLoading =true;
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
  //getFamily
  getFamily(empcode) {
    this.isLoading =true;
    if (empcode != '0')
    this.service.getFamily(empcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.family = (response.json());
        }
        this.isLoading = false;
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
    this.empcode = 0;
    
    this.departmentname = '';
    this.designationname = '';

    this.family = [];
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
changeMode(i: any, e: EmployeeFamily, Mode: any) {
  var flag = false;
  if (this.family!=null ) {

    let qualificationexists= this.family.filter(q=>q.name==this.dependentname);
     if(qualificationexists.length>0){
           flag=true;
     }
   
  }
 
 if (Mode == 2) {
   
    this.service.deleteQualification(e).then(
      (response) => {
        this.isLoading = false; 
        this.family.splice(i, 1);

        //swal("Academic Qualification Added!");
      },
      (error) => console.log(error))
  }
  
}

  //saveFamily
  saveFamily(dependentname, dependentrelation, isdependent) { 
    console.log(dependentname, dependentrelation, isdependent);
    var dependentname=this.dependentname.trim();
    if (dependentname != '') {
      this.isLoading =true;
      var empfamily = new EmployeeFamily(0, this.empcode, dependentname, dependentrelation, isdependent, this.logedInUserID, this.UserSessionID);
      console.log(empfamily);
      this.service.saveFamily(empfamily).then(
        (response) => {
          this.isLoading = false;
          this.getFamily(this.empcode);
          this.getGrid("");
          console.log(response);
       //   this.modalReference.close();
          this.cancel();
          //swal("Name Added!");
        },
        (error) => console.log(error))
    }
    else {
      if(this.dependentname.replace(/\s/g,"").length<=0)
        this.dependentname=''; 
      swal("Enter Dependent Name!")
    }
  }
  //updateFamily
  updateFamily(dependentname, dependentrelation, isdependent) {
    
    this.isLoading =true;
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
    if(this.empcode!='0' && this.family.length>0){
       var familylist = [];
    familylist = this.family;
    this.service.updateFamily(familylist).then(
      (response) => { this.modalReference.close(); this.getGrid(""); this.isLoading = false; },
        //  swal("Relations Updated!")
      
        (error) => console.log(error))
    }else
    if (this.empcode =='0' )
    swal("Employee Name Must Be Defined");
    if (this.empcode !='0' && this.family.length==0)
      swal("Enter Empty Fields!");
    this.isLoading=false;
  }
  //getDetailsByID
  getDetailsByID(empselected, content) {
    this.isLoading =true;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.mode = true;
    this.btnmode = false;
    this.service.getEmployees(empselected,this.priviledged_Offices)
      .subscribe(response => {

        this.isLoading = false;
          var list = response.json();
          for (let i = 0; i < list.length; i++)
            if (list[i].empcode == empselected) {
              this.empname = list[i].empname;
            }
          this.empcode = empselected;
          //this.empmodel = empselected;
          this.getDepartment(empselected);
          this.getDesignation(empselected);
          this.getFamily(empselected);
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
    this.dependentname = '';
    this.dependentrelation = 1;
    this.isdependent = 0;
  }

}
