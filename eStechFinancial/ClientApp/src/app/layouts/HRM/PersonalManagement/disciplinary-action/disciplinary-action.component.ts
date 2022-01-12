import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DisciplinaryActionService, LoginService,DisciplinaryAction, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import swal from 'sweetalert';
import { TextMaskModule } from 'angular2-text-mask';
@Component({
  selector: 'disciplinary-action',
  templateUrl: './disciplinary-action.component.html',
  styleUrls: ['./disciplinary-action.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DisciplinaryActionComponent implements OnInit {
////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
    PermissionSpecial: any = 'none';
    id: any;
  ////////////////////////////////////////
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
  officecode: any = 0;
  officename: any = '';



  discipline: any[] = [];
  disciplinecode: any = 0;
  public complaintdate = new cDate();
  public chargesdate = new cDate();
  public decisiondate = new cDate();
  complaint: any = '';
  charges: any = '';
  decision: any = '';
  active: any = 0;

  editmode: any = 0;
  addbutton: any = '';
  addnewrow: any = 'none';

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor(private LoginService: LoginService,private service: DisciplinaryActionService, private modalService: NgbModal) {
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
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    //console.log(FUNCTIONALITY)
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 20007) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;

//RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit= "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete  = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial= "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].usersessionid;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.gridlist = (response.json());

        // console.log(response.json())

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
        this.discipline = response.json();
        
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

    this.office= [];
    this.department = [];
    this.designation = [];

    this.complaintdate = new cDate();
    this.chargesdate = new cDate();
    this.chargesdate = new cDate();
    this.emplist = [];
    this.discipline = [];
    this.complaint = '';
    this.charges = '';
    this.decision = '';
    this.active = 0;
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
  //saveEmployeeDiscipline
  saveEmployeeDiscipline(complaint, charges, decision, active) {
    if (this.empcode != 0) {
    this.isLoading =true;

      var empren = new DisciplinaryAction(0, this.empcode, this.complaintdate.getDateFinal(), complaint, this.chargesdate.getDateFinal(), charges, this.decisiondate.getDateFinal(), decision, active, this.logedInUserID, this.UserSessionID);
      this.service.saveEmployeeDiscipline(empren).then(
        (response) => {
          this.isLoading = false;
          this.getGrid();
          this.modalReference.close();
        },
        (error) => console.log(error))
    }
    else
      swal('Select Employee!')
  }
  //updateEmployeeDiscipline
  updateEmployeeDiscipline(complaint, charges, decision, active) {
    if (this.empcode != 0) {
    this.isLoading =true;
      var empren = new DisciplinaryAction(this.disciplinecode, this.empcode, this.complaintdate.getDateFinal(), complaint, this.chargesdate.getDateFinal(), charges, this.decisiondate.getDateFinal(), decision, active, this.logedInUserID, this.UserSessionID);
    console.log(empren);
    this.service.updateEmployeeDiscipline(empren).then(
      (response) => { this.isLoading = false;
        this.getGrid();
        this.modalReference.close();
      },
      (error) => console.log(error))

    }
    else
      swal('Select Employee!')
  }
  //getDetailsByID
  getDetailsByID(empselected,disciplinecode, content) {
    //alert(empselected);
    this.isLoading =true;
    this.mode = true;
    this.btnmode = false;
    this.service.getEmployees(this.priviledged_Offices)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.discipline = response.json();

        this.service.getDetailsByID(disciplinecode)
          .subscribe(response => {
            var Disciplinebyid = response.json();
            this.disciplinecode = Disciplinebyid[0].disciplinecode;
            this.complaintdate.setDate(Disciplinebyid[0].complaindate);
            this.complaint = Disciplinebyid[0].complain;
            this.chargesdate.setDate(Disciplinebyid[0].chargesdate);
            this.charges = Disciplinebyid[0].charges;
            this.decisiondate.setDate(Disciplinebyid[0].decisiondate);
            this.decision = Disciplinebyid[0].decision;
            this.active = Disciplinebyid[0].active;

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
