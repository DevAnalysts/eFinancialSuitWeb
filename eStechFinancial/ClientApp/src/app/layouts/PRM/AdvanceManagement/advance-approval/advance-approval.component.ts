import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AdvanceApprovalService,LoginService, Advance, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
@Component({
  selector: 'advance-approval',
  templateUrl: './advance-approval.component.html',
  styleUrls: ['./advance-approval.component.scss'],
  

  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AdvanceApprovalComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility()
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

  public applicationdate = new cDate();
  public paymentstartdate = new cDate();
  public approvaldate = new cDate();

  gridlist: any[] = [];
  emplist: Array<Select2OptionData>;
  emplistR: any[] = [];
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  departmentcode: any = 1;
  departmentname: any = '';
  designationcode: any = 1;
  designationname: any = '';

  officecode: any = 1;
  officename: any = '';
  categorycode: any = 1;
  categoryname: any = '';


  advance: any[] = [];
  advancebyid: any[] = [];
  financialyear: any = '';

  advancetype: any[] = [];
  advancetypecode: any = 0;
  advancetypename: any = '';
  advancelimit: any = 0;

  maxinstallment: any = 0;
  appliedamount: any = 0;

  approvalno: any = 0;
  approvedby: any[] = [];
  approvedbycode: any = 0;
  approvedbyname: any = '';

  amountapproved: any = 0;
  noofinstallment: any = 0;
  installmentamount: any = 0;
  remarks: any = '';

  advstatus: any = '';

////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
constructor(private LoginService: LoginService, private service: AdvanceApprovalService, private modalService: NgbModal) {
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
    this.permissionUtility.setPagePermissions(30026);
    }
    
  //getGrid
  getGrid(value:any) {
    this.isLoading =true;
    this.service.getGrid(value,this.userPrivilegedOffice)
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
    this.getApprovalBy();

  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
          //this.empcode = this.emplist[0].id;
          //this.empname = this.emplist[0].text;
          this.emplistR = response.json();
          //this.officename = this.emplistR[0].officename;
          //this.departmentname = this.emplistR[0].departmentname;
          //this.designationname = this.emplistR[0].designationname;
          //this.categoryname = this.emplistR[0].categoryname;
          //this.categorycode = this.emplistR[0].categorycode;
        }
        //this.getAdvanceType(this.categorycode);

      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;
    for (let i = 0; i < this.emplistR.length; i++)
      if (this.emplistR[i].empcode == this.empcode) {
        this.designationname = this.emplistR[i].designationname;
        this.departmentname = this.emplistR[i].departmentname;
        this.officename = this.emplistR[i].officename;
        this.categoryname = this.emplistR[i].categoryname;
        this.categorycode = this.emplistR[i].categorycode;
        this.getAdvanceType(this.categorycode);

      }
  }
  //getAdvanceType
  getAdvanceType(code) {
    this.isLoading =true;
    this.service.getAdvanceType(code)
      .subscribe(response => {
        if (response.json() != null) {
          this.isLoading = false;
          this.advancetype = response.json();
          console.log(response.json());
          this.advancetypecode = this.advancetype[0].advancetypecode;
          this.advancetypename = this.advancetype[0].advancetypename;
          this.advancelimit = this.advancetype[0].maxlimit;
          this.maxinstallment = this.advancetype[0].maxinstallment;
        }
      });
  }
  //getApprovalBy
  getApprovalBy() {
    this.isLoading =true;
    this.service.getApprovalBy()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.approvedby = response.json();
          console.log(response.json());
          this.approvedbycode = this.approvedby[0].approvedbycode;
          this.approvedbyname = this.approvedby[0].approvedbyname;
        }
      });
  }


  //changeAdvanceType
  changeAdvanceType() {

    for (let i = 0; i < this.advancetype.length; i++)
      if (this.advancetype[i].advancetypecode == this.advancetypecode) {
        this.advancetypename = this.advancetype[i].advancetypename;
        this.advancelimit = this.advancetype[i].maxlimit;
        this.maxinstallment = this.advancetype[i].maxinstallment;

      }
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
    this.officename = '';
    this.departmentcode = 1;
    this.departmentname = '';
    this.designationcode = 1;
    this.designationname = ''
    this.categorycode = 1;
    this.categoryname = '';
    this.emplist = [];
    this.advance = [];
    this.advancebyid = [];

    this.applicationdate = new cDate();
    this.approvaldate = new cDate();
    this.paymentstartdate = new cDate();

    this.appliedamount = 0;
    this.approvalno = '';
    this.approvedbycode = 0;

    this.amountapproved = 0;
    this.noofinstallment = 0;
    this.installmentamount = 0;

    this.advstatus = 0;




    this.getFills();
  }
  //IfExists
  IfExists(bookcode) {
    this.service.IfExists(bookcode)
      .subscribe(response => {
        if (response.json() != null) {
          this.status = (response.json());
          if (this.status == true) {
            $("#alertWarning").show();
            $("#submitUpdate").prop("disabled", true);
          }
          else {
            $("#alertWarning").hide();
            $("#submitUpdate").prop("disabled", false);
          }
        }
      });

  }
  //saveData
  saveData() {

    this.isLoading =true;

    var empren = new Advance(0, this.applicationdate.getDateFinal(), this.empcode, this.advancetypecode, this.appliedamount, this.approvaldate.getDateFinal(), this.approvalno, this.approvedbycode, this.amountapproved, this.noofinstallment, this.installmentamount, this.paymentstartdate.getDateFinal(), this.remarks, this.logedInUserID, this.UserSessionID);
    console.log(empren);
    this.service.saveData(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //console.log(response);
        //swal("Record Added!");
      },
      (error) => console.log(error))

  }
  //updateData
  updateData() {

    this.isLoading =true;
    var empren = new Advance(this.advancebyid, this.applicationdate.getDateFinal(), this.empcode, this.advancetypecode, this.appliedamount, this.approvaldate.getDateFinal(), this.approvalno, this.approvedbycode, this.amountapproved, this.noofinstallment, this.installmentamount, this.paymentstartdate.getDateFinal(), this.remarks, this.logedInUserID, this.UserSessionID);
    console.log(empren);
    this.service.updateData(empren).then(
      (response) => {
        this.isLoading = false;
        this.getGrid("");
        this.modalReference.close();
        //console.log(response);
        //swal("Record Updated!");
      },
      (error) => console.log(error))


  }

  //getDetailsByID
  getDetailsByID(ID, content) {
    this.isLoading =true;
    this.advancebyid = ID;
    this.mode = true;
    this.btnmode = false;
if(this.permissionUtility.PermissionView==''){
  this.submitAdd='none';
  this.submitUpdate='none';
}
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.advance = response.json();
          this.applicationdate.setDate(this.advance[0].applicationdate);

          this.empcode = this.advance[0].empcode;
          this.empname = this.advance[0].empname;
          this.designationname = this.advance[0].designationname;
          this.departmentname = this.advance[0].departmentname;
          this.officename = this.advance[0].officename;
          this.categoryname = this.advance[0].categoryname;
          this.categorycode = this.advance[0].categorycode;

          this.isLoading =true;
            this.service.getAdvanceType(this.categorycode)
              .subscribe(response => {
                this.isLoading = false;
                this.advancetype = response.json();
                this.advancetypecode = this.advance[0].advancetypecode;

                for (let i = 0; i < this.advancetype.length; i++)
                  if (this.advancetype[i].advancetypecode == this.advancetypecode) {
                    this.advancelimit = this.advancetype[i].maxlimit;
                    this.maxinstallment = this.advancetype[i].maxinstallment;

                  }
              });

          this.appliedamount = this.advance[0].appliedamount;

          this.approvaldate.setDate(this.advance[0].approvaldate);
          this.approvalno = this.advance[0].approvalno;

          this.service.getApprovalBy()
            .subscribe(response => {
              this.approvedby = response.json();
              console.log(response.json());
              this.approvedbycode = this.advance[0].approvedby;
            });

          this.amountapproved = this.advance[0].approvedamount;
          this.noofinstallment = this.advance[0].noofinstallments;
          this.installmentamount = this.advance[0].installmentamount;
          this.paymentstartdate.setDate(this.advance[0].paymentstartdate);
          this.remarks = this.advance[0].remarks;
          this.advstatus = this.advance[0].status;

        }
      });

    this.openDetail(content);

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

  calculateInstallment() {
    if (this.amountapproved > 0) {
      if (this.noofinstallment > 0) {
        this.installmentamount = (parseFloat(this.amountapproved) / parseFloat(this.noofinstallment)).toFixed(2);
      }
    }
  }

}
