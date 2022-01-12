import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChequeBookService, chequeBook, chequeBookLeafes, PermissionUtility } from '../../../../../shared';

@Component({
  selector: 'cheque-cancel',
  templateUrl: './cheque-cancel.component.html',
  styleUrls: ['./cheque-cancel.component.scss']
})
export class ChequeCancelComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();

  p: number = 1;
  modalReference: NgbModalRef;
  chequeBooks: any[];
  banks: any[];
  branches: any[];
  accounts: any[];
  chequeBookID: any;
  banK_CODE: any = 0;
  banK_NAME: any;
  brancH_CODE: any = 0;
  brancH_NAME: any = "";
  accounT_NO: any = "";
  chequeBookName: any = "";
  chequeFrom: any;
  noOfCheques: any;
  chequeLeafId: any;
  active: any = 1;
  status: any = "Open";
  mode: any = 0;
  submitAdd:any;
  submitUpdate:any;
  closeResult: string;
  chequeBookLeafes: any[];
  selectedAll: any= false;
  chk: any = false;
  detail: any[] = [];
  ID: any = "";
  isLoading: any = false;
  readonly: any = false;
  constructor(private service: ChequeBookService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
    this.chequeBookLeafes = new Array<chequeBookLeafes>();
  }

  ngOnInit() {
    this.getChequeCancel(this.ID);
    this.permissionUtility.setPagePermissions(50010);
  }
   ////////////////////////
   
  //getChequeBooks
  getChequeCancel(value: string) {
    this.isLoading =true;
    this.service.getChequeCancel(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.chequeBooks = (response.json());
          this.isLoading = false;
        }
        else{
          this.chequeBooks = [];
          this.isLoading = false;
        }
        
      });
  }
  //getBanks
  getBanks() {
    this.isLoading =true;
    this.banks = [];
    this.branches = [];
    this.accounts = [];
    this.chequeBookLeafes = [];

    this.service.getBanks()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
        this.banks = (response.json());        
          this.banK_CODE = this.banks[0].banK_CODE;
          this.banK_NAME = this.banks[0].banK_NAME;
          $("#submitAdd").prop("disabled", false);
          this.getBankBranches(this.banks[0].banK_CODE);
        }
        else {
          $("#submitAdd").prop("disabled", true);
        }
      });
  }
  //getBankBranches
  getBankBranches(banK_CODE) {
    this.isLoading =true;
    this.branches = [];
    this.accounts = [];
    this.chequeBookLeafes = [];

    this.service.getBankBranches(banK_CODE)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
        this.branches = (response.json());       
          this.brancH_CODE = this.branches[0].brancH_CODE;
          this.brancH_NAME = this.branches[0].brancH_NAME;
        
          $("#submitAdd").prop("disabled", false);
          this.getAccounts(this.brancH_CODE);
        }
        else {
          $("#submitAdd").prop("disabled", true);

        }
      });
  }
  //getAccounts
  getAccounts(brancH_CODE) {
    this.isLoading =true;
    this.accounts = [];
    this.chequeBookLeafes = [];

    this.service.getAccountsForChequeBookCancel(brancH_CODE)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
        this.accounts = (response.json());        
          this.accounT_NO = this.accounts[0].accounT_NO;
        
          this.getDetails();
        }
        else {
          $("#submitAdd").prop("disabled", true);

        }
      });
  }
  //getDetails
  getDetails() {
    this.isLoading =true;
    this.chequeBookLeafes = [];
    this.service.getDetails(this.banK_CODE, this.brancH_CODE, this.accounT_NO)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          $("#submitAdd").prop("disabled", false);
          this.chequeBookLeafes = (response.json());
        }
        else {
          $("#submitAdd").prop("disabled", true);
        }
 
        //console.log(response.json());
      });
  }
  //clearFields
  clearFields() {
    this.mode = 0;
    this.banks = [];
    this.banK_CODE = 0;
    this.branches = [];
    this.brancH_CODE = 0;
    this.accounts = [];
    this.accounT_NO = 0;
    this.detail = [];
    this.chequeBookLeafes = [];
    this.getBanks();

    $("#submitAdd").prop("disabled", false);
    //this.guid = UUID.UUID();
  }
  //selectAll
  selectAll() {
    this.selectedAll = true;
    for (var i = 0; i < this.chequeBookLeafes.length; i++) {
      if(this.chequeBookLeafes[i].disable==false)
          this.chequeBookLeafes[i].status = this.selectedAll;
    }
  }
  //checkIfAllSelected
  checkIfAllSelected() {
    for (let i = 0; i < this.chequeBookLeafes.length; i++) {
      this.chk = this.chequeBookLeafes[i].status;
      if (this.chk == true) {
        this.chequeLeafId = this.chequeBookLeafes[i].chequeLeafId;
        this.detail.push(this.chequeLeafId);
        
      }
    }
  }
  //saveChequeBooks
  saveChequeBooks() {
    this.isLoading =true;
    this.checkIfAllSelected();
    var bank = new chequeBook(0, this.chequeBookName, this.chequeFrom, this.chequeFrom + this.noOfCheques, this.accounT_NO, this.banK_CODE, this.brancH_CODE, this.noOfCheques, this.active, this.status, this.logedInUserID, this.UserSessionID, this.chequeBookLeafes);
    $("#submitAdd").prop("disabled", true);
    this.service.saveChequeBooks(bank).then(
      (response) => {
        this.isLoading = false;
        this.getChequeCancel(this.ID);
        console.log(response);
      },
      (error) => console.log(error))
  }
  //updateChequeBooks
  updateChequeBooks() {
    this.isLoading =true;
    var bank = new chequeBook(this.chequeBookID, this.chequeBookName, this.chequeFrom, this.chequeFrom + this.noOfCheques, this.accounT_NO, this.banK_CODE, this.brancH_CODE, this.noOfCheques, this.active, this.status, this.logedInUserID, this.UserSessionID, this.chequeBookLeafes);
    this.service.updateChequeBooks(bank).then(
      (response) => {
        this.isLoading = false;
        this.getChequeCancel(this.ID);
        console.log(response);
      },
      (error) => console.log(error))
  }
  //updateCancel
  updateCancel() {
    for (let i = 0; i < this.chequeBookLeafes.length; i++) {
      this.chk = this.chequeBookLeafes[i].status;
      if (this.chk == true) {
        this.chequeLeafId = this.chequeBookLeafes[i].chequeLeafId;
        this.chequeBookLeafes[i].status = true;
      }
    }
    this.submitAdd=''; 
    this.permissionUtility.PermissionAdd='';
    this.selectedAll = false;
    var json = this.detail;
    this.service.updateCancel(json).subscribe(
      (response) => {
        this.getChequeCancel(this.ID);
        console.log(response);
      },
      (error) => console.log(error))
  }
  //getCancelDetailsByID
  getCancelDetailsByID(chequeBookID, content) {
    this.isLoading =true;
    this.openDetail(content);

    this.banks = [];
    this.banK_CODE = 0;

    this.branches = [];
    this.brancH_CODE = 0;

    this.accounts = [];
    this.accounT_NO = 0;

    this.chequeBookLeafes = [];

    this.mode = true;
    this.service.getCancelDetailsByID(chequeBookID)
      .subscribe((o: chequeBook) => {
        this.chequeBookID = o.chequeBookID;
        this.chequeBookName = o.chequeBookName;
        this.accounT_NO = o.accountNo;
        this.chequeFrom = o.chequeFrom;
        this.noOfCheques = o.noOfCheques;
        this.banK_CODE = o.bankId;
        this.brancH_CODE = o.branchId;

        this.service.getBanks()
          .subscribe(response => {
            this.banks = (response.json());
            this.banK_CODE = o.bankId;

            this.service.getBankBranches(this.banK_CODE)
              .subscribe(response => {
                this.branches = (response.json());
                this.brancH_CODE = o.branchId;

                this.service.getAccounts(this.brancH_CODE)
                  .subscribe(response => {
                    this.accounts = (response.json());
                    this.accounT_NO = o.accountNo;
                    this.isLoading = false;
                  });
              });
          });

        this.chequeBookLeafes = o.chequeBookLeafes;
        if(this.permissionUtility.PermissionView==''){
          this.submitAdd='none';
          this.submitUpdate='none';
        }
      });
      this.readonly=true;
  }
  //open
  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();
  }
  //openDetail
  openDetail(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
