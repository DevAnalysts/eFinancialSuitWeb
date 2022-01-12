import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChartOfAccountService, coa, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.scss']
})
export class ChartOfAccountComponent implements OnInit {
  p: number = 1;
  modalReference: NgbModalRef;
  coas: any[];
  levels: any[];
  categories: any[];
  accountTypies: any[];
  coaDetail: any[];
  accounts: any[];
  accountsByID: any[];
  bsCredit: any[];
  bsDebit: any[];
  profitLose: any[];
  guid: any;
  mode: any = 0;
  accounT_CODE: any = "";
  accounT_TITLE: any = "";
  aaccounT_CODE: any = "";
  aaccounT_TITLE: any = "";
  leveL_CODE: any = 1;
  accT_LEVEL: any = "";
  categorY_CODE: any = 1;
  accT_CATEGORY: any = "";
  accT_TYPE_CODE: any = 1;
  accounT_TYPE: any = "";
  account_Note_ID: any = 1;
  note_Name: any = "";

  caccount_Note_ID: any = 1;
  cnote_Name: any = "";
  daccount_Note_ID: any = 1;
  dnote_Name: any = "";
  paccount_Note_ID: any = 1;
  pnote_Name: any = "";
  mainCode: any;
  controlCode: any;
  subSidaryCode: any;
  subSubSidaryCode: any;
  accounT_CODES: string;


  active: any = true;
  pL_BALSHEET: any = "B";
  pL_BAL: any = "";
  coA_GROUP: any = "";
  currency: any;
  closeResult: string;
  max: string;
  parent: any;
  ID: any = "";
  isLoading: any = false;
  
    logedInUserID: any = 1;
    UserSessionID: any = 0;
    public permissionUtility:PermissionUtility=new PermissionUtility();
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  constructor(private service: ChartOfAccountService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');

  }

  ngOnInit() {
     this.getCOAs(this.ID);
     this.permissionUtility.setPagePermissions(40004);
  }
   ////////////////////////
   
  //getCOAs
  getCOAs(value: string) {
    this.isLoading = true;
    this.service.getCOAs(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.coas = (response.json());
          this.isLoading = false;
          // console.log(response.json());
        }
        else{
          this.coas = [];
          this.isLoading = false;
        }
        
      });
  }
  //getLevels
  getLevels() {
    this.service.getLevels()
      .subscribe(response => {
        this.levels = (response.json());
        this.leveL_CODE = this.levels[0].leveL_CODE;
        this.accT_LEVEL = this.levels[0].accT_LEVEL;
        this.getAccounts(this.leveL_CODE);
        //console.log(response.json());
      });
  }
  //getCategories
  getCategories() {
    this.service.getCategories()
      .subscribe(response => {
        this.categories = (response.json());
      });
  }
  //getAccountTypies
  getAccountTypies() {
    this.service.getAccountTypies()
      .subscribe(response => {
        this.accountTypies = (response.json());
        //   console.log(response.json());
      });
  }
  //getAccounts
  getAccounts(leveL_CODE) {
    this.service.getAccounts(leveL_CODE)
      .subscribe(response => {
        this.accounts = (response.json());
        if (!this.mode) {
          this.aaccounT_CODE = this.accounts[0].aaccounT_CODE;
          this.aaccounT_TITLE = this.accounts[0].aaccounT_TITLE;
          //alert('Add:-----------------' + this.aaccounT_CODE);
        }
        else {
          this.aaccounT_CODE = this.accounT_CODE;
          this.aaccounT_TITLE = this.aaccounT_TITLE = this.accounts[0].aaccounT_TITLE;
          //alert('Edit:-----------------' + this.aaccounT_CODE);
        }

        this.parent = this.accounts[0].accT_LEVEL;
        this.categorY_CODE = this.accounts[0].categorY_CODE;
        this.accT_TYPE_CODE = this.accounts[0].accT_TYPE_CODE;
        this.coA_GROUP = this.accounts[0].coA_GROUP;
        this.currency = this.accounts[0].currency;
        this.pL_BALSHEET = this.accounts[0].pL_BALSHEET;

        if (this.mode != true) {
          if (leveL_CODE == 1) {
            this.getMaxAccountCode(leveL_CODE);
          }
          else {
            this.accounT_CODES = this.accounT_CODE;

            this.getMaxAccountCodes(leveL_CODE, this.accounT_CODE);


          }
        }
      });
  }
  //getAccountByID
  getAccountByID(aaccounT_CODE) {
    this.service.getAccountByID(aaccounT_CODE)
      .subscribe(response => {
        this.accountsByID = (response.json());
        if(this.accountsByID!=null){
        this.aaccounT_CODE = this.accountsByID[0].aaccounT_CODE;
        this.aaccounT_TITLE = this.accountsByID[0].aaccounT_TITLE;
        this.parent = this.accountsByID[0].accT_LEVEL;
        this.categorY_CODE = this.accountsByID[0].categorY_CODE;
        this.accT_TYPE_CODE = this.accountsByID[0].accT_TYPE_CODE;
        this.coA_GROUP = this.accountsByID[0].coA_GROUP;
        this.currency = this.accountsByID[0].currency;
        this.pL_BALSHEET = this.accountsByID[0].pL_BALSHEET;

        if (this.pL_BALSHEET == 'B') {
          $("#daccount_Note_ID").prop("disabled", false);
          $("#caccount_Note_ID").prop("disabled", false);
          $("#account_Note_ID").prop("disabled", true);
        }
        else {
          $("#daccount_Note_ID").prop("disabled", true);
          $("#caccount_Note_ID").prop("disabled", true);
          $("#account_Note_ID").prop("disabled", false);
        }
      }
      });
  }
  //changeLevel
  changeLevel(leveL_CODE) { 
    if (leveL_CODE == 1) {
      $("#parent").hide();
      $("#type").hide();
      $("#bs").hide();
      $("#category").show();
      $("#bsCredit").hide();
      $("#bsDebit").hide();
      $("#proftLose").hide();
    }
    else if (leveL_CODE == 2) {
      $("#parent").show();
      $("#type").hide();
      $("#category").hide();
      $("#bs").hide();
      $("#bsCredit").hide();
      $("#bsDebit").hide();
      $("#proftLose").hide();
    }
    else if (leveL_CODE == 3) {
      $("#parent").show();
      $("#type").show();
      $("#category").hide();
      $("#bs").hide();
      $("#bsCredit").show();
      $("#bsDebit").show();
      $("#proftLose").show();
    }
    else if (leveL_CODE == 4) {
      $("#parent").show();
      $("#type").hide();
      $("#category").hide();
      $("#bs").hide();
      $("#bsCredit").hide();
      $("#bsDebit").hide();
      $("#proftLose").hide();
    }
    this.getAccounts(leveL_CODE);

  }
  //getBSDe
  getBSDe() {
    this.service.getBS()
      .subscribe(response => {
        this.bsDebit = (response.json());
        this.daccount_Note_ID = this.bsDebit[1].daccount_Note_ID;
        this.dnote_Name = this.bsDebit[1].dnote_Name;
      });
  }
  //getBSCr
  getBSCr() {
    this.service.getBS()
      .subscribe(response => {
        this.bsCredit = (response.json());
        this.caccount_Note_ID = this.bsCredit[1].caccount_Note_ID;
        this.cnote_Name = this.bsCredit[1].cnote_Name;
      });
  }
  //changeDebit
  changeDebit(daccount_Note_ID) {
    this.service.getBS()
      .subscribe(response => {
        this.bsDebit = (response.json());
        this.caccount_Note_ID = daccount_Note_ID;
      });
  }
  //getProfitLose
  getProfitLose() {
    this.service.getProfitLose()
      .subscribe(response => {
        this.profitLose = (response.json());
        this.paccount_Note_ID = this.profitLose[0].account_Note_ID;
        this.pnote_Name = this.profitLose[0].note_Name;
        //     console.log(response.json());
      });
  }
  //getMaxAccountCode
  getMaxAccountCode(leveL_CODE) {
    this.service.getMaxAccountCode(leveL_CODE)
      .subscribe(response => {
        this.max = (response.json());
        if (this.max.toString().length == 1) {
          this.accounT_CODE = "" + this.max + "0000";
        }
        else { this.accounT_CODE = "" + this.max + "0000"; }
        //   console.log(response.json());
      });
  }
  //getMaxAccountCodes
  getMaxAccountCodes(leveL_CODE, accounT_CODE) {
    //alert('leveL_CODE:--------' + leveL_CODE + '--------' + 'accounT_CODE:----------' + accounT_CODE);
    this.accounT_CODES = accounT_CODE;

    this.service.getMaxAccountCodes(leveL_CODE, accounT_CODE)
      .subscribe(response => {
        this.coaDetail = (response.json());

        this.accounT_CODE = this.coaDetail[0].maX_CODE;

       // alert('leveL_CODE:--------' + leveL_CODE + '--accounT_CODE:----------' + this.accounT_CODE);
      });

    this.getAccountByID(accounT_CODE);
  }
  //balanceSheets
  balanceSheets = [
    { "pL_BALSHEET": "BS", "pL_BAL": "Balance Sheet" }
    , { "pL_BALSHEET": "PL", "pL_BAL": "Profit &amp; Loss" }
  ]
  //clearFields
  clearFields() {
    this.mode = 0;
    this.leveL_CODE = 1;
    this.accounT_TITLE = "";
    this.guid = UUID.UUID();
    this.getLevels();
    this.getCategories();
    this.getAccountTypies();
    this.getBSCr();
    this.getBSDe();
    this.getProfitLose();
    this.changeLevel(this.leveL_CODE);

    if (this.leveL_CODE == 1) {
      $("#parent").hide();
      $("#type").hide();
      $("#bs").hide();
      $("#bsCredit").hide();
      $("#bsDebit").hide();
      $("#proftLose").hide();
      this.getMaxAccountCode(this.leveL_CODE);
    }
    this.getAccounts(this.leveL_CODE);
    $("#submitAdd").prop("disabled", false);
  }
  //saveCOA
  saveCOA() {

    if($('#account_Note_ID').is(':disabled')){
      this.account_Note_ID='';
 }
 if($('#pL_BALSHEET').is(':disabled')){
  this.pL_BALSHEET='';
}
    var c = new coa(this.accounT_CODE, this.accounT_TITLE, this.coA_GROUP, this.pL_BALSHEET, this.leveL_CODE, this.categorY_CODE, this.accT_TYPE_CODE, this.currency, this.active, this.accounT_CODE, this.logedInUserID);
    
    if (this.accounT_TITLE != "") {
      this.service.saveCOA(c).then(
        (response) => {
          this.getCOAs(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("The Account Title must be define.");
    }
  }
  //updateCOA
  updateCOA() {
    var c = new coa(this.accounT_CODE, this.accounT_TITLE, this.coA_GROUP, this.pL_BALSHEET, this.leveL_CODE, this.categorY_CODE, this.accT_TYPE_CODE, this.currency, this.active, this.accounT_CODE, this.logedInUserID);
    if (this.accounT_TITLE != "") {
      this.service.updateCOA(c).then(
        (response) => {
          this.getCOAs(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("The Account Title must be define.");
    }
  }
  //getDetailsByID
  getDetailsByID(accounT_CODE, content) {
    this.open(content); 
    this.mode = true;
    this.service.getDetailsByID(accounT_CODE)
      .subscribe((o: coa) => {
        console.log(o);
        this.leveL_CODE = o.leveL_CODE;  
          this.accounT_CODE = o.accounT_CODE; 
          this.accT_TYPE_CODE = o.accT_TYPE_CODE;
          this.categorY_CODE = o.categorY_CODE; 
          this.accounT_TITLE = o.accounT_TITLE; 
          this.pL_BALSHEET = o.pL_BALSHEET;
          this.coA_GROUP = o.coA_GROUP;
          this.currency = o.currency;
          
          if (this.accounT_CODE == "11100")
            $("#submitUpdate").prop("disabled", true);
          else
            $("#submitUpdate").prop("disabled", false); 
         
            this.changeLevel(this.leveL_CODE);
        
      });
  }
  // open Modal
  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();

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
}
