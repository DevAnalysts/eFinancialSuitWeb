import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { TaxClaimService,LoginService, TaxClaim, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
@Component({
  selector: 'tax-claim',
  templateUrl: './tax-claim.component.html',
  styleUrls: ['./tax-claim.component.scss'],


  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class TaxClaimComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility()
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
  

  taxclaim: any[] = [];
  taxclaimbyid: any[] = [];
  financialyear: any = '';
  claimamount: any = 0;
  submitAdd:any;
  submitUpdate:any;
  utaxclaim: any[] = [];
  uempcode: any = 0;
  uempname: any = '';
  udepartmentname: any = '';
  udesignationname: any = '';
  uofficename: any = '';
  ucategoryname: any = '';
  ucumamount: any = 0;
  ubalanceamount: any = 0;
  utaxyear: any = '';
  DisabledSaveBtn:any=false;
////////////////////////
userOffice: any;
userPrivilegedOffice: any;
userCurrentOffice: any;
userCurrentWarehouse: any;
priviledged_Offices: any;
constructor(private LoginService: LoginService,private service: TaxClaimService, private modalService: NgbModal) {
     
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
    this.permissionUtility.setPagePermissions(30014);
     }
     
  //getGrid
  getGrid(value) {
    this.isLoading =true;
    this.service.getGrid(value,this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.gridlist = (response.json());
          this.isLoading = false;
          // console.log(response.json())
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
    this.getFinancialYear();

  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(this.userPrivilegedOffice)
      .subscribe(response => {
        //console.log(response.json());
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = this.emplist[0].id;
        this.empname = this.emplist[0].text;
        this.emplistR = response.json();
        this.officename = this.emplistR[0].officename;
        this.departmentname = this.emplistR[0].departmentname;
        this.designationname = this.emplistR[0].designationname;
        this.categoryname = this.emplistR[0].categoryname;
        this.isLoading = false;
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

      }
  }
  //getFinancialYear
  getFinancialYear() {
    this.isLoading =true;
    this.service.getFinancialYear()
      .subscribe(response => {
        console.log(response.json());
        var list = response.json();
        console.log(response.json()); 
        this.financialyear = list[0].taxYear;
        this.isLoading = false;
      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.DisabledSaveBtn=false; 
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
   // $("#submitAdd").prop("disabled", false);
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
    this.taxclaim = [];
    this.taxclaimbyid = [];   
    if(this.claimamount < 1){
     this.DisabledSaveBtn=true;
     swal("Claim amount must be greater than 0") ;
    } 
    this.ubalanceamount = 0;
    this.ucumamount = 0;
    this.utaxyear = '';
    this.uofficename = '';
    this.udepartmentname = '';
    this.udesignationname = '';
    this.ucategoryname = '';



    this.getFills();
  }
  changeClaimAmount(){
    if(this.claimamount<1){
      this.DisabledSaveBtn=true;
      swal("Claim amount must be greater than 0") ;
    }else
    this.DisabledSaveBtn=false;
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
  //saveData
  saveData() {


    var empren = new TaxClaim(0, this.empcode, this.financialyear, this.claimamount, this.logedInUserID, this.UserSessionID);
    console.log();
    this.service.saveData(empren).then(
      (response) => {

        this.getGrid("");
        this.modalReference.close();
        //console.log(response);
        //swal("Record Added!");
      },
      (error) => console.log(error))

  }
  //updateData
  updateData(leavetypecode, leavebalance, halfday, days) {


    var empren = new TaxClaim(0, this.empcode, this.financialyear, this.claimamount, this.logedInUserID, this.UserSessionID);
    console.log(empren);
    this.service.updateData(empren).then(
      (response) => {
        this.getGrid("");
        this.modalReference.close();
        //console.log(response);
        //swal("Record Updated!");
      },
      (error) => console.log(error))


  }
 
  //getDetailsByID
  getDetailsByID(ID, content) {
    //alert(leavecode);
   
    this.mode = true;
    this.btnmode = false;
    
        this.service.getDetailsByID(ID)
          .subscribe(response => {
            if (response.json() != null) {
              this.utaxclaim = response.json();
              this.uempcode = this.utaxclaim[0].empcode;
              this.uempname = this.utaxclaim[0].empname;
              
              this.uofficename = this.utaxclaim[0].officename;
              this.udepartmentname = this.utaxclaim[0].departmentname;
              this.udesignationname = this.utaxclaim[0].designationname;
              this.ucategoryname = this.utaxclaim[0].categoryname;

              //this.utaxyear = this.utaxclaim[0].taxyear;
              this.ucumamount = this.utaxclaim[0].cumamount;
              this.ubalanceamount = this.utaxclaim[0].balanceamount;

     
            }
          });
     if(this.permissionUtility.PermissionView==''){
       this.submitAdd='none';
       this.submitUpdate='none';
     }
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
