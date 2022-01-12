import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChartOfAccountsService, coas, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'chartofaccount',
  templateUrl: './chartofaccount.component.html',
  styleUrls: ['./chartofaccount.component.scss']
})
export class ChartOfAccountsComponent implements OnInit {
  p: number = 1;
  modalReference: NgbModalRef;
  coas: any[];
  note: any;
  levels: any[];
  categories: any[];
  accountTypies: any[];
  coaDetail: any[];
  accounts: any[];
  accountsByID: any[];
  Notes: any[];
  isBS: boolean = false;
  btype: any = '';
  guid: any;
  mode: boolean = false;
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

  mainCode: any;
  controlCode: any;
  subSidaryCode: any;
  subSubSidaryCode: any;
  accounT_CODES: string;


  active: any = true;

  coA_GROUP: any = "";
  currency: any;
  closeResult: string;
  max: string;
  parent: any;
  ID: any = "";
  isLoading: any = false;

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility: PermissionUtility = new PermissionUtility();
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  constructor(private service: ChartOfAccountsService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
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
        this.coas = (response.json());
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  //getLevels
  getLevels() {
    this.service.getLevels()
      .subscribe(response => {
        this.levels = (response.json());
        if (this.mode == false) {
          this.leveL_CODE = this.levels[0].leveL_CODE;
          this.accT_LEVEL = this.levels[0].accT_LEVEL;
          this.getParentAccounts(this.leveL_CODE, 0);
        }

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

      });
  }
  //getAccounts
  getParentAccounts(leveL_CODE, parnet_Code) {

    this.service.getAccounts(leveL_CODE)
      .subscribe(response => {
        this.accounts = (response.json());
       // console.log('----1-----');
      //  console.log(this.accounts);
        if (this.mode == false) {
          this.aaccounT_CODE = this.accounts[0].aaccounT_CODE;
          this.aaccounT_TITLE = this.accounts[0].aaccounT_TITLE;

          this.parent = this.accounts[0].accT_LEVEL;
          this.categorY_CODE = this.accounts[0].categorY_CODE;
          this.accT_TYPE_CODE = this.accounts[0].accT_TYPE_CODE;
          this.coA_GROUP = this.accounts[0].coA_GROUP;
          this.currency = this.accounts[0].currency;


          if (leveL_CODE == 1) {
            this.getMaxAccountCode(leveL_CODE);
          }
          else {
            this.getMaxAccountCodes(leveL_CODE, this.aaccounT_CODE);
          }
        } else {

          this.aaccounT_CODE = parnet_Code;

          var ar = this.accounts.filter(p => p.aaccounT_CODE == parnet_Code);
          if (ar.length > 0)
            this.parent = ar[0].accT_LEVEL;

        }
      });
  }
  //getAccountByID
  getAccountByID(aaccounT_CODE) {


    this.service.getAccountByID(aaccounT_CODE)
      .subscribe(response => {
        this.accountsByID = (response.json());
        if (this.mode == false) {
          if (this.accountsByID != null) {
            this.aaccounT_CODE = this.accountsByID[0].aaccounT_CODE;
            this.aaccounT_TITLE = this.accountsByID[0].aaccounT_TITLE;
            this.parent = this.accountsByID[0].accT_LEVEL;

            this.categorY_CODE = this.accountsByID[0].categorY_CODE;
            this.accT_TYPE_CODE = this.accountsByID[0].accT_TYPE_CODE;
            this.coA_GROUP = this.accountsByID[0].coA_GROUP;
            this.currency = this.accountsByID[0].currency;



            this.getNotes(this.accountsByID[0].note_Id);
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
    }
    else if (leveL_CODE == 2) {
      $("#parent").show();
      $("#type").hide();
      $("#category").hide();
      $("#bs").hide();

    }
    else if (leveL_CODE == 3) {
      $("#parent").show();
      $("#type").show();
      $("#category").hide();
      $("#bs").show();

    }
    else if (leveL_CODE == 4) {
      $("#parent").show();
      $("#type").hide();
      $("#category").hide();
      $("#bs").show();

    }
    if (this.mode == false) {
      this.getParentAccounts(leveL_CODE, 0);
    }

  }

  getNotes(accountNoteID: any) {

    if (this.categorY_CODE == 1 || this.categorY_CODE == 2 || this.categorY_CODE == 3) {
      this.btype = 'BS';
    } else if (this.categorY_CODE == 4 || this.categorY_CODE == 5) {
      this.btype = 'PL';
    }

    this.service.getNotes(this.btype)
      .subscribe(response => {
        this.Notes = (response.json());
        // console.log(this.Notes);

        if (accountNoteID > 0)
          this.account_Note_ID = accountNoteID;
        else
          this.account_Note_ID = this.Notes[0].account_Note_ID;

        this.btype = '';
        //this.note_Name = this.Notes[0].note_Name; 
      });

  }

  //getMaxAccountCode
  getMaxAccountCode(leveL_CODE) {
    //  this.accounT_CODE='';
    this.service.getMaxAccountCode(leveL_CODE)
      .subscribe(response => {
        this.max = (response.json());
        if (this.max.toString().length == 1) {
          this.accounT_CODE = "" + this.max + "0000";
        }
        else { this.accounT_CODE = "" + this.max + "0000"; }
      });
  }
  //getMaxAccountCodes
  getMaxAccountCodes(leveL_CODE, accounT_CODE) {


    this.coaDetail = [];
    // this.accounT_CODE='';
    this.accounT_CODES = accounT_CODE;
    this.service.getMaxAccountCodes(leveL_CODE, accounT_CODE)
      .subscribe(response => {
        this.coaDetail = (response.json());
        if (this.mode == false) {
          this.accounT_CODE = this.coaDetail[0].maX_CODE;
        }
      });
    if (this.mode == false) {
      this.getAccountByID(accounT_CODE);
    }

  }
  //balanceSheets
  balanceSheets = [
    { "pL_BALSHEET": "BS", "pL_BAL": "Balance Sheet" }
    , { "pL_BALSHEET": "PL", "pL_BAL": "Profit &amp; Loss" }
  ]
  //clearFields
  clearFields() {

    this.leveL_CODE = 1;
    this.accounT_TITLE = "";
    this.guid = UUID.UUID();
    this.getLevels();
    this.getCategories();
    this.getAccountTypies();

    this.changeLevel(this.leveL_CODE);

    if (this.leveL_CODE == 1) {
      $("#parent").hide();
      $("#type").hide();
      $("#bs").hide();

      this.getMaxAccountCode(this.leveL_CODE);

    }

    this.getParentAccounts(this.leveL_CODE, 0);


    $("#submitAdd").prop("disabled", false);
  }
  //saveCOA
  saveCOA() {

    if ($('#account_Note_ID').is(':disabled')) {
      this.account_Note_ID = '';
    }

    var c = new coas(this.accounT_CODE, this.accounT_TITLE, this.coA_GROUP, this.account_Note_ID, this.leveL_CODE, this.categorY_CODE, this.accT_TYPE_CODE, this.currency, this.active, this.accounT_CODE, this.logedInUserID, this.aaccounT_CODE);
    console.log(c);
    if (this.accounT_TITLE != "") {
      this.service.saveCOA(c).then(
        (response) => {
          this.getCOAs(this.ID);
          this.modalReference.close();
          this.mode = false;
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
    var c = new coas(this.accounT_CODE, this.accounT_TITLE, this.coA_GROUP, this.account_Note_ID, this.leveL_CODE, this.categorY_CODE, this.accT_TYPE_CODE, this.currency, this.active, this.accounT_CODE, this.logedInUserID, this.accounT_CODE);
    if (this.accounT_TITLE != "") {
      this.service.updateCOA(c).then(
        (response) => {
          this.getCOAs(this.ID);
          this.mode = false;
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
    this.mode = true;
    this.open(content);
    this.getLevels();

    this.service.getDetailsByID(accounT_CODE)
      .subscribe((o: coas) => {
        //console.log(o);
        this.changeLevel(o.leveL_CODE);

        this.leveL_CODE = o.leveL_CODE;

        if (o.leveL_CODE == 1) {
          this.getCategories();
         
        } else if (o.leveL_CODE == 3) {
          this.getAccountTypies();
         

        }

        this.getParentAccounts(o.leveL_CODE, o.parnet_Code);


        this.accounT_CODE = o.accounT_CODE;
        this.categorY_CODE = o.categorY_CODE;
        this.accT_TYPE_CODE = o.accT_TYPE_CODE;
        this.accounT_TITLE = o.accounT_TITLE;
        this.coA_GROUP = o.coA_GROUP;
        this.currency = o.currency;
       // console.log(o);
        if (this.accounT_CODE == "11100")
          $("#submitUpdate").prop("disabled", true);
        else
          $("#submitUpdate").prop("disabled", false);

        this.getNotes(o.note_Id);

      });
  }
  // open Modal
  open(content) {

    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.mode = false;
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.mode = false;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    if (this.mode == false) {
      this.clearFields();
    }

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
