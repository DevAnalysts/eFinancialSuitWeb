import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeRejoinService,LoginService, EmployeeRejoin, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'employee-rejoin',
  templateUrl: './employee-rejoin.component.html',
  styleUrls: ['./employee-rejoin.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EmployeeRejoinComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation()
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
  departmentcode: any = 1;
  departmentname: any = '';
  designation: any[] = [];
  designationcode: any = 1;
  designationname: any = '';
  poffice: any[] = [];
  pofficecode: any = 1;
  pofficename: any = '';
  category: any[] = [];
  categorycode: any = 1;
  categoryname: any = '';

  office: any[] = [];
  officecode: any = 1;
  officename: any = '';
  ndepartment: any[] = [];
  ndepartmentcode: any = 1;
  ndepartmentname: any = '';
  ndesignation: any[] = [];
  ndesignationcode: any = 1;
  ndesignationname: any = '';
  ncategory: any[] = [];
  ncategorycode: any = 1;
  ncategoryname: any = '';


  contrenewal: any[] = [];
  renewal: any[] = [];
  renewalcode: any = 0;

  certificate: any = '';
  subject: any = '';
  institute: any = '';
  public startdate = new cDate();
  public enddate = new cDate();
  editmode: any = 0;
  addbutton: any = '';
  addnewrow: any = 'none';
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor( private LoginService: LoginService,private service: EmployeeRejoinService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20016);
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
  //getFills
  getFills() {
    this.getEmployees();
    this.getOfficeNew();
    this.getDesignationNew();
    this.getDepartmentNew();
    this.getCategoryNew();
  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        console.log(response.json());
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        //this.empcode = this.emplist[0].id;
        //this.empname = this.emplist[0].text;
        this.renewal = response.json();
        this.startdate.setDate(this.renewal[0].startdate);
        this.enddate.setDate(this.renewal[0].enddate);


      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
    for (let i = 0; i < this.renewal.length; i++)
      if (this.renewal[i].empcode == this.empcode) {
        this.startdate.setDate(this.renewal[i].startdate);
        this.enddate.setDate(this.renewal[i].enddate);
      }
    this.getDepartment(this.empcode);
    this.getDesignation(this.empcode);
    this.getPrevOffice(this.empcode);
    this.getCategory(this.empcode);
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
  //getPrevOffice
  getPrevOffice(empcode) {
    this.isLoading =true;
    this.service.getPrevOffice(empcode)
      .subscribe(response => {

        this.isLoading = false;
        if (response.json() != null) {
          this.poffice = (response.json());
          this.pofficecode = this.poffice[0].officecode;
          this.pofficename = this.poffice[0].officename;
        }
      });
  }
  //getCategory
  getCategory(empcode) {
    this.isLoading =true;
    this.service.getCategory(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.category = (response.json());
          this.categorycode = this.category[0].categorycode;
          this.categoryname = this.category[0].categoryname;
        }
      });
  }
  //getOfficeNew
  getOfficeNew() {
    this.isLoading =true;
    this.service.getOfficeNew()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.office = (response.json());
          this.officecode = this.office[0].officecode;
          this.officename = this.office[0].officename;
        }
       // console.log(response.json())

      });
  }
  //getDesignationNew
  getDesignationNew() {
    this.isLoading =true;
    this.service.getDesignationNew()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.ndesignation = (response.json());
          this.ndesignationcode = this.ndesignation[0].designationcode;
          this.ndesignationname = this.ndesignation[0].designationname;
        }
       // console.log(response.json())
      });
  }
  //getDepartmentNew
  getDepartmentNew() {
    this.isLoading =true;
    this.service.getDepartmentNew()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.ndepartment = (response.json());
          this.ndepartmentcode = this.ndepartment[0].departmentcode;
          this.ndepartmentname = this.ndepartment[0].departmentname;
        }
      });
  }
  //getCategoryNew
  getCategoryNew() {
    this.isLoading =true;
    this.service.getCategoryNew()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.ncategory = (response.json());
          this.ncategorycode = this.ncategory[0].categorycode;
          this.ncategoryname = this.ncategory[0].categoryname;
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
    this.designation= [];
    this.emplist = [];
    this.renewal = [];
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
  //saveEmployeeRejoin
  saveEmployeeRejoin(officecode, ndepartmentcode, ndesignationcode, pofficecode, departmentcode, designationcode, ncategorycode, categorycode) {
    console.log(officecode, ndepartmentcode, ndesignationcode, pofficecode, departmentcode, designationcode, ncategorycode, categorycode);
    var enddate=$("#enddt").val();
    if(enddate=='' || enddate.toString().length<10){
      swal("End Date Is Empty Or Invalid");
      return;
    }
    if (this.empcode != 0) {
      this.isLoading =true;
      var empren = new EmployeeRejoin(0, this.empcode, officecode, ndepartmentcode, ndesignationcode, pofficecode, departmentcode, designationcode, ncategorycode, categorycode, this.startdate.getDateFinal(), this.enddate.getDateFinal(), this.logedInUserID, this.UserSessionID);
    //console.log(empren);
    this.service.saveEmployeeRejoin(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //swal("Record Added!");
      },
      (error) => console.log(error))
  }
  else
  swal('Select Employee!')

  }
  //updateEmployeeRejoin
  updateEmployeeRejoin(officecode, ndepartmentcode, ndesignationcode, pofficecode, departmentcode, designationcode, ncategorycode, categorycode) {
   this.submitAdd='';
   this.permissionUtility.PermissionAdd='';
   var enddate=$("#enddt").val();
    if(enddate=='' || enddate.toString().length<10){
      swal("End Date Is Empty Or Invalid");
      return;
    }
    if (this.empcode != 0) {
      this.isLoading =true;
      var empren = new EmployeeRejoin(this.renewalcode, this.empcode, officecode, ndepartmentcode, ndesignationcode, pofficecode, departmentcode, designationcode, ncategorycode, categorycode, this.startdate.getDateFinal(), this.enddate.getDateFinal(), this.logedInUserID, this.UserSessionID);
    console.log(empren);
    this.service.updateEmployeeRejoin(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //swal("Record Added!");
      },
      (error) => console.log(error))
    }
    else
      swal('Select Employee!')

  }
  //getDetailsByID
  getDetailsByID(empselected,rejoincode, content) {
    //alert(empselected);
    this.mode = true;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.btnmode = false;

    this.isLoading =true;

    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.renewal = response.json();

        this.service.getDetailsByID(rejoincode)
          .subscribe(response => {
            this.isLoading = false;
              var renewalbyid = response.json();
            this.renewalcode = renewalbyid[0].rejoincode;

              this.service.getOfficeNew()
                .subscribe(response => {
                  this.poffice = [];
                  this.poffice = (response.json());
                  this.pofficecode = renewalbyid[0].prE_OFFICE_CODE;
                  this.office = (response.json());
                  this.officecode = renewalbyid[0].officE_CODE;

              
                  console.log(this.pofficecode)

                });

              this.service.getDepartmentNew()
                .subscribe(response => {
                  this.department = [];
                  this.department = (response.json());
                  this.departmentcode = renewalbyid[0].prE_DEPARTMENT_CODE;
                  this.ndepartment = (response.json());
                  this.ndepartmentcode = renewalbyid[0].departmenT_CODE;

                });

              this.service.getDesignationNew()
                .subscribe(response => {
                  this.designation = [];
                  this.designation = (response.json());
                  this.designationcode = renewalbyid[0].prE_DESIGNATION_CODE;
                  this.ndesignation = (response.json());
                  this.ndesignationcode = renewalbyid[0].designatioN_CODE;

                  // console.log(response.json())
                });

              this.service.getCategoryNew()
                .subscribe(response => {
                  this.category = [];
                  this.category = (response.json());
                  this.categorycode = renewalbyid[0].prE_CATEGORY_CODE;
                  this.ncategory = (response.json());
                  this.ncategorycode = renewalbyid[0].categorY_CODE;

                  // console.log(response.json())
                });

              this.startdate.setDate(renewalbyid[0].startdate);
              this.enddate.setDate(renewalbyid[0].enddate);
              console.log('renewal', renewalbyid, this.pofficecode)
 
          });
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
  onDateSelection(e: any) {
    console.log(e);
  }

}
