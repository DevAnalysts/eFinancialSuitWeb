import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ChequeBookService, chequeBook, chequeBookLeafes, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';
//test
@Component({
    selector: 'cheque-book',
    templateUrl: './cheque-book.component.html',
    styleUrls: ['./cheque-book.component.scss']
})
export class ChequeBookComponent implements OnInit {
     
    logedInUserID: any = 1;
    UserSessionID: any = 0;
    public permissionUtility:PermissionUtility=new PermissionUtility();
    p: number = 1;
    modalReference: NgbModalRef;
    chequeBooks: any[];
    chequeleafexists:any=false;
    banks: any[];
    branches: any[];
    accounts: any[];
    chequeBookID: any;
    banK_CODE: any = 0;
    banK_NAME: any;
    brancH_CODE: any = 0;
    brancH_NAME: any = "";
    accounT_NO: any = "";
    accounT_TITLE: any = "";
    chequeBookName: any = "";
    chequeFrom: any = "";
    chequeTo: any = "";
    noOfCheques: any;
    mode: any = 0;
    submitAdd:any;
    submitUpdate:any;
    closeResult: string;
    active: any = 1;
    status: any = "Open";
    ID: any = "";
    chequeBookLeafes: any[];
    actionID: any = 7;
    cancelReturn: any;
    isLoading: any = true;
    chequeBookStatus: any = "";
    cancelDisable: any = false;
    saveDisable: any = false;
    constructor(private service: ChequeBookService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
        this.chequeBookLeafes = new Array<chequeBookLeafes>();
    }

    ngOnInit() {
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.getChequeBooks(this.ID);
        this.finishChequeBooks();
        this.permissionUtility.setPagePermissions(50009);
    }
     ////////////////////////
    //finishChequeBooks
    finishChequeBooks(){
        this.service.finishChequeBooks()
        .subscribe(response => {

        })
    }

    //getChequeBooks
    getChequeBooks(value: string) {
        this.isLoading =true;
        this.service.getChequeBooks(value)
            .subscribe(response => {
                this.chequeBooks = (response.json());
                console.log(response.json());
                this.isLoading = false;
            });
            
    }
    //getBanks
    getBanks() {
        this.isLoading =true;
        this.service.getBanks()
            .subscribe(response => {
                this.banks = (response.json());
                this.banK_CODE = this.banks[0].banK_CODE;
                this.banK_NAME = this.banks[0].banK_NAME;
                this.branches=[];
                this.getBankBranches(this.banks[0].banK_CODE);
            });
    }
    //getBankBranches
    getBankBranches(banK_CODE) {
        this.service.getBankBranches(banK_CODE)
            .subscribe(response => {
                this.accounts=[];
                this.branches = (response.json());
                this.brancH_CODE = this.branches[0].brancH_CODE;
                this.brancH_NAME = this.branches[0].brancH_NAME;
                this.isLoading = false;
                this.getAccounts(this.branches[0].brancH_CODE);

            });
    }
    //getAccounts
    getAccounts(brancH_CODE) {
        this.isLoading =true;
        this.service.getAccounts(brancH_CODE)
            .subscribe(response => {
                this.accounts = (response.json());
                if (this.accounts != null) {
                    this.accounT_NO = this.accounts[0].accounT_NO;

                }
                this.isLoading = false;

            });
    }
    //changeChequeNo
    changeChequeNo() {
        
        if (this.noOfCheques != null) {
            if (this.noOfCheques > 1000) {
                this.noOfCheques = 1000;
                this.chequeTo = (parseInt(this.chequeFrom) + parseInt(this.noOfCheques) - 1).toString();
            }
            else if (this.noOfCheques > 0) {
                this.chequeTo = (parseInt(this.chequeFrom) + parseInt(this.noOfCheques) - 1).toString();
            }
            if(this.chequeTo == "NaN")
            {
                this.chequeTo = "";
            }
        }
        else
            this.chequeTo = "";
        if(this.chequeFrom != null)
        {
            $("#submitAdd").prop("disabled", false);
        }
        
    }
    //clearFields
    clearFields() {
        this.mode = 0;
        this.brancH_CODE = 0;
        this.brancH_NAME = "";
        this.banK_CODE = 0;
        this.chequeFrom = "";
        this.chequeTo = "";
        this.noOfCheques = "";
        this.accounT_NO = "";
        this.accounT_TITLE = "";
        this.chequeleafexists=false;
        this.getBanks();
        $("#submitAdd").prop("disabled", false);
        //this.guid = UUID.UUID();
    }
    //saveChequeBooks
    saveChequeBooks() {
        if(this.noOfCheques != null && this.noOfCheques != "")
        {
            this.isLoading =true;
            var checqueTo = parseInt(this.chequeFrom) + parseInt(this.noOfCheques) - 1;
            
            var bank = new chequeBook(0, this.chequeBookName, this.chequeFrom , checqueTo, this.accounT_NO, this.banK_CODE, this.brancH_CODE, this.noOfCheques, this.active, this.status, this.logedInUserID, this.UserSessionID, this.chequeBookLeafes);
            console.log(bank)

            $("#submitAdd").prop("disabled", true);
            if (this.chequeFrom != "") {

                this.service.saveChequeBooks(bank).then(
                    (response) => {
                        this.isLoading = false;
                        this.getChequeBooks(this.ID);
                        this.modalReference.close();
                        console.log(response);
                    },
                    (error) => console.log(error))
            } else {
                swal("The Cheque From must be define.");
            }
        }
        else
        {
            swal("The No of Cheque must be Defined.");
        }
    }
    //updateChequeBooks
    updateChequeBooks() {
        this.isLoading =true;
        var bank = new chequeBook(this.chequeBookID, this.chequeBookName, this.chequeFrom, this.chequeFrom + this.noOfCheques, this.accounT_NO, this.banK_CODE, this.brancH_CODE, this.noOfCheques, this.active, this.status, this.logedInUserID, this.UserSessionID, this.chequeBookLeafes);
        if (this.chequeFrom != "") {
            if(this.chequeleafexists)
               {
                   swal("Can not update cheque book.");
                   return;
        }
            this.service.updateChequeBooks(bank).then(
                (response) => {
                    this.isLoading = false;
                    this.getChequeBooks(this.ID);
                    this.modalReference.close();
                    console.log(response);
                },
                (error) => console.log(error))
        } else {
            
            swal("The Cheque From must be define.");
        }
    }
    ////getDetailsByID
    getDetailsByID(chequeBookID, content) {
        this.saveDisable = false;
        this.isLoading =true;
        this.openDetail(content);
        this.mode = true;
        this.service.getDetailsByID(chequeBookID)
            .subscribe((o: chequeBook) => {
                this.chequeBookID = o.chequeBookID;
                this.chequeBookName = o.chequeBookName;
                this.chequeBookStatus = o.status;

                this.chequeFrom = parseInt(o.chequeFrom);
                this.noOfCheques = o.noOfCheques;
                this.chequeTo = o.lastLeaf;


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
                                    });
                            });
                    });


                    this.service.ifexists(o.chequeBookID)
                    .subscribe(response => {
                       
                        this.chequeleafexists= (response.json());
                        
                        if(this.chequeleafexists)
                        {
                            $("#submitUpdate").prop("disabled", true);
                           
                        }else{
                            if(this.permissionUtility.PermissionView==''){
                                $("#submitUpdate").prop("disabled", false);
                                
                             }
                        }
                        
                    });
                    
                    if(this.chequeBookStatus == "Closed" || this.chequeBookStatus == "Finished")
                    {
                        this.cancelDisable = true;
                        this.saveDisable = true;
                    }
                    else
                    {
                        this.cancelDisable = false;
                    }
                this.isLoading = false;
            });
           
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
    //cancelChequeBooks
    cancelChequeBooks() {
        swal({
            title: "Do you really want to close?",
            text: "Once Closed, you will not be able to recover this Cheque Book!",
            icon: "warning",
            buttons: {
                cancel: {
                    text: "No",
                    value: false,
                    visible: true,
                    closeModal: true,
                },
                confirm: {
                    text: "Yes",
                    value: true,
                    visible: true,
                    closeModal: true,
                },
            },
        })
            .then((willCancel) => {
                if (willCancel) {


                    this.service.cancelChequeBooks(this.chequeBookID, this.actionID)
                        .subscribe(response => {
                            swal("Poof! Your Cheque Books has been Closed!", {
                                icon: "success",
                            });
                            this.cancelReturn = (response.json());
                            this.getChequeBooks('');
                            this.modalReference.close();
                        });
                } else {
                    swal("Your Cheque Book is safe!");
                }
            });
    }
    //getDismissReason0
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
