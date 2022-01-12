import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EmployeePromotionService, LoginService,EmployeePromotion, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'employee-promotion',
  templateUrl: './employee-promotion.component.html',
  styleUrls: ['./employee-promotion.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EmployeePromotionComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  modalReference: NgbModalRef;
    id: any;
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
  category: any[] = [];
  categorycode: any = 1;
  categoryname: any = '';

  ndesignation: any[] = [];
  ndesignationcode: any = 1;
  ndesignationname: any = '';
  ndepartment: any[] = [];
  ndepartmentcode: any = 1;
  ndepartmentname: any = '';
  ncategory: any[] = [];
  ncategorycode: any = 1;
  ncategoryname: any = '';


  promotion: any[] = [];
  promotioncode: any = 0;

  letterno: any='';
  public letterdate = new cDate();
  public promotiondate = new cDate();
  editmode: any = 0;
  addbutton: any = '';
  addnewrow: any = 'none';
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor(private LoginService: LoginService,private service: EmployeePromotionService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(20014);
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

  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees( this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        //this.empcode = this.emplist[0].id;
        //this.empname = this.emplist[0].text;
        this.promotion = response.json();
        
        
      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.ndesignation = [];
    this.ndepartment = [];
    this.ncategory = [];
    this.empcode = e;
    
    if (this.empcode != 0) {
      this.getDepartmentNew();
      this.getCategoryNew();
      this.getDepartment(this.empcode);
      this.getDesignation(this.empcode);
      this.getOffice(this.empcode);
      this.getCategory(this.empcode);
    }
    
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
            this.getDesignationNew(this.designationcode);
          }

        });    
  }
  //getDepartment
  getDepartment(empcode) {
    this.isLoading =true;

    this.service.getDepartment(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null){
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
        if (response.json() != null){
          this.office = (response.json());
          this.officecode = this.office[0].officecode;
          this.officename = this.office[0].officename;
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

  //getDesignationNew
  getDesignationNew(designationcode) {
    this.isLoading =true;
    this.service.getDesignationNew(designationcode)
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
        if (response.json() != null){
          this.ndepartment = (response.json());
          this.ndepartmentcode = this.ndepartment[0].departmentcode;
          this.ndepartmentname = this.ndepartment[0].departmentname;
        }
        // console.log(response.json())
      });
  }
  //getCategoryNew
  getCategoryNew() {
    this.isLoading =true;
    this.service.getCategoryNew()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null){
          this.ncategory = (response.json());
          this.ncategorycode = this.ncategory[0].categorycode;
          this.ncategoryname = this.ncategory[0].categoryname;
        }
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
    this.empcode = 0;
    
    this.departmentcode = 0;
    this.designationcode = 0;
    this.categorycode = 0;

    this.departmentname = '';
    this.designationname = '';
    this.categoryname = '';


    this.letterno = '';
    this.letterdate = new cDate();
    this.promotiondate = new cDate();
    this.emplist = [];
    this.promotion = [];
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
  //saveEmployeePromotion
  saveEmployeePromotion(designationcode, ndesignationcode, departmentcode, ndepartmentcode, categorycode, ncategorycode, letterno) {
    console.log(designationcode, ndesignationcode, departmentcode, ndepartmentcode, categorycode, ncategorycode, letterno);
        
        var ltdate=$("#dt1").val();
        var effectform=$("#dt2").val();
        if(ltdate=='' || ltdate.toString().length<10){
          swal("Letter Date Is Empty Or Invalid"); 
          return;
        }
        if(effectform=='' || effectform.toString().length<10){
          swal("Effective Form Date Is Empty Or Invalid"); 
          return;
        } 
    if (letterno != '') {
      this.isLoading =true;
      if(this.empcode!=0){ 
      var empren = new EmployeePromotion(0, this.empcode, designationcode, ndesignationcode, departmentcode, ndepartmentcode, categorycode, ncategorycode, letterno, this.letterdate.getDateFinal(), this.promotiondate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      //console.log(empren);
      this.service.saveEmployeePromotion(empren).then(
        (response) => {
          this.isLoading = false;

          this.getGrid("");
          this.modalReference.close();
         // swal("Record Added!");
        },
        (error) => console.log(error))
    }else
    swal("Please Select Employee");
    this.isLoading=false;
  }
    else { swal("Enter Letter No!"); }
   


  }
  //updateEmployeePromotion
  updateEmployeePromotion(designationcode, ndesignationcode, departmentcode, ndepartmentcode, categorycode, ncategorycode, letterno) {
    console.log(designationcode, ndesignationcode, departmentcode, ndepartmentcode, categorycode, ncategorycode, letterno);
    this.submitAdd='';
    this.permissionUtility.PermissionAdd='';
        var letterdate=$("#dt1").val();
        var effectiveform=$("#dt2").val();
        if(letterdate=='' || letterdate.toString().length<10){
          swal("Letter Date Is Empty Or Invalid");
          this.isLoading=false;
          return;
        }
        if(effectiveform=='' || effectiveform.toString().length<10){
          swal("Effective Form Date Is Empty Or Invalid");
          this.isLoading=false;
          return;
        }
    if (letterno != '') {
      this.isLoading =true;
      if(this.empcode!=0){ 
      var empren = new EmployeePromotion(this.promotioncode, this.empcode, designationcode, ndesignationcode, departmentcode, ndepartmentcode, categorycode, ncategorycode, letterno, this.letterdate.getDateFinal(), this.promotiondate.getDateFinal(), this.logedInUserID, this.UserSessionID);
      console.log(empren);
      this.service.updateEmployeePromotion(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //swal("Record Updated!");
      },
      (error) => console.log(error))
    }else
    swal("Please Select Employee");
    this.isLoading=false;
  }
    else { swal("Enter Letter No!"); }

  }
  //getDetailsByID
  getDetailsByID(empselected,promotioncode, content) {
    //alert(empselected);
    this.mode = true;
    if(this.permissionUtility.PermissionView==''){
      this.submitAdd='none';
      this.submitUpdate='none';
    }
    this.btnmode = false;
    this.isLoading =true;
    this.service.getEmployees( this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.promotion = response.json();

        this.service.getDetailsByID(promotioncode)
          .subscribe(response => {

            if (response.json() != null) {
              var promotionbyid = response.json();
              this.promotioncode = promotionbyid[0].promtioncode;
              this.letterno = promotionbyid[0].letterno;
              this.service.getDesignationNew(0)
                .subscribe(response => {
                  this.designation = [];
                  this.designation = (response.json());
                  this.designationcode = promotionbyid[0].designationcode;

                  this.service.getDesignationNew(this.designationcode)
                    .subscribe(response => {
                  this.ndesignation = (response.json());
                      this.ndesignationcode = promotionbyid[0].ndesignationcode;
                    });

                });

              this.service.getDepartmentNew()
                .subscribe(response => {
                  this.department = [];
                  this.department = (response.json());
                  this.departmentcode = promotionbyid[0].departmentcode;
                  this.ndepartment = (response.json());
                  this.ndepartmentcode = promotionbyid[0].ndepartmentcode;
                });

              this.service.getCategoryNew()
                .subscribe(response => {
                  this.category = [];
                  this.category = (response.json());
                  this.categorycode = promotionbyid[0].categorycode;
                  this.ncategory = (response.json());
                  this.ncategorycode = promotionbyid[0].ncategorycode;
                });
              this.letterdate.setDate(promotionbyid[0].startdate);
              this.promotiondate.setDate(promotionbyid[0].enddate);

            }
            else {
              for (let i = 0; i < this.promotion.length; i++)
                if (this.promotion[i].empcode == empselected) {
                  this.letterdate.setDate(this.promotion[i].startdate);
                  this.promotiondate.setDate(this.promotion[i].enddate);
                }
            }
          });
        this.getDepartment(empselected);
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
