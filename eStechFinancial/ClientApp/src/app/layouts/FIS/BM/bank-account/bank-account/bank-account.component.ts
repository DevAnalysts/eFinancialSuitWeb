import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankAccountService, bankAccount, coaOffice, Account, FormData, LoginService, PermissionUtility, chequeBook } from '../../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
    selector: 'bank-account',
    templateUrl: './bank-account.component.html',
    styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
    alerts: Array<any> = [];

    
    logedInUserID: any = 1;
    userOffice: any = 2;
    userPrivilegedOffice: any = '';
    UserSessionID: any = 0;
    public permissionUtility:PermissionUtility=new PermissionUtility();
    public valid:Validation=new Validation();
    isLoading: any = true;
    ID: any = "";
    p: number = 1;
    modalReference: NgbModalRef;
    bankAccounts: any[];
    banks: any[];
    branches: any[];
    offices: any[];
    fiS_COA_OFFICE: any[];
    accountInfo: any[];
    banK_ACCOUNT_CODE: any = 0;
    banK_CODE: any = 1;
    banK_NAME: any;
    abbr: any;
    brancH_CODE: any = 1;
    brancH_CODE_NAME: any;
    brancH_NAME: any = "";
    accounT_CODE: any = "";
    accounT_NO: any = "";
    accounT_NAME: any = "";
    active: any = false;
    accounT_TITLE: any = "";
    accT_TYPE_CODE: any;
    typE_CODE: any = 0;
    categorY_CODE: any;
    pL_BALSHEET: any;
    leveL_CODE: any = 4;
    currency: any = true;
    closeResult: string;
    mode: any = false;
    chkAll: any = false;
    chk: any = false;
    selectedAll: any;
    officE_CODE: any = 1;
    coA_GROUP: any;
    accounTTITLE: any;
    order_ID: any = "";
    Default: number = 1;
    max: number = 0;
    totalmax: number = 0;
    page = 0;
    submitAdd:any=false;
    submitUpdate:any=false;
    checkVoucherExist: any ;
    public formdata = FormData;
    public approveVoucher = new Array<Account>();

    showOffice: any = '';
    chequeBookStatus: any ;


    constructor(private service: BankAccountService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private modalService: NgbModal) {
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.officE_CODE = this.LoginService.getSession('userOffice');

        this.fiS_COA_OFFICE = new Array<coaOffice>();
        this.alerts.push(
            {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is being used...',
            });
    }

    ngOnInit() {
          this.getBankAccounts(this.order_ID);
          this.permissionUtility.setPagePermissions(30006);
        if (this.LoginService.getSession('EnableOfficeGridInBankAccount') == "0") {
            this.showOffice = 'none';
        }
        else {
            this.showOffice = '';
        }

    }

 ////////////////////////
 

 checkValue(event:any){

   if(this.mode==false){
   if(event==true && this.permissionUtility.PermissionEdit!='none')
   this.submitAdd=''; 
 } else{
    if(event==true && this.permissionUtility.PermissionEdit!='none')
    this.submitUpdate='';
}
}
    //getBankAccounts
    getBankAccounts(value: string) {
        this.isLoading =true;
        this.service.getBankAccounts(value)
            .subscribe(response => {
                if(response.json() !== null){
                    this.bankAccounts = (response.json());
                    console.log(response.json());
               this.isLoading = false;
                }
                else{
                    this.bankAccounts = [];
                    this.isLoading = false;
                }
               
            });
    }
    //getBanks
    getBanks() {
        this.isLoading =true;
        this.service.getBanks()
            .subscribe(response => {

                this.banks = (response.json());
                this.banK_CODE = this.banks[0].banK_CODE;
                this.abbr = this.banks[0].abbr;
                this.getBankBranches(this.banK_CODE);

            });
    }
    //getBankBranches
    getBankBranches(banK_CODE) {
        this.isLoading =true;
        if(this.mode==false){
        this.accounT_NAME='';
        this.accounT_NO='';        
        this.accounT_TITLE='';
        }
        this.service.getBankBranches(banK_CODE)
            .subscribe(response => {
                this.isLoading = false;
                this.branches = (response.json()); 
                if (this.branches != null) {
                    this.brancH_CODE = this.branches[0].brancH_CODE;
                    this.brancH_NAME = this.branches[0].brancH_NAME;
                    this.abbr = this.branches[0].abbr;
                    this.brancH_CODE_NAME = this.branches[0].brancH_CODE_NAME;


                } 
                //   console.log(response.json());      
            });
    }
    //changeDisplayTitle
    changeDisplayTitle(accounT_NAME) {
  
        if (accounT_NAME != '') {
            var str = this.accounT_NO.toString();
            var lenght = str.length - 4;
            this.accounT_TITLE = this.abbr + '-' + this.brancH_CODE + '-' + accounT_NAME + ' ' + '(' + str.substring(lenght, lenght + 4) + ')';
            this.accounTTITLE = this.abbr + '-' + this.brancH_CODE + '-' + accounT_NAME + ' ' + '(' + str.substring(lenght, lenght + 4) + ')';
            $("#submitAdd").prop("disabled", false);
        }else
        {this.accounT_TITLE='';
        this.accounTTITLE='';}
    }
    //changeDisplayTitles
    changeDisplayTitles(accounT_NO) {
 
        if (this.accounT_NO != '') {
            var str = this.accounT_NO.toString();
            var lenght = str.length - 4;
            this.accounT_TITLE = this.abbr + '-' + this.brancH_CODE + '-' + this.accounT_NAME + ' ' + '(' + str.substring(lenght, lenght + 4) + ')';
            $("#submitAdd").prop("disabled", false);
        }
        else if(this.accounT_NAME!='') {
            this.accounT_TITLE = this.abbr + '-' + this.brancH_CODE + '-' + this.accounT_NAME + ' ' + '()';
        }else
        {this.accounT_TITLE='';
        this.accounTTITLE='';}
    }
    //getOffices
    getOffices() {
        this.service.getOffices()
            .subscribe(response => {
                this.offices = (response.json());
                console.log(response.json());
            });
    }
    
    //clearFields
    clearFields() {
        this.mode = 0;
        this.brancH_CODE = 0;
        this.brancH_NAME = "";
        this.banK_CODE = 1;
        this.brancH_CODE = 1;
        this.accounT_TITLE = "";
        this.accounTTITLE = "";
        this.accounT_NO = "";
        this.accounT_NAME = "";
        this.active = true;
        this.offices = [];
        this.approveVoucher = [];
        this.getBanks();
        //this.getBankBranches(this.banK_CODE);
        this.getOffices();
        //this.getAccountInfo();
        this.checkValue(this.active);
        $("#submitAdd").prop("disabled", false);
        //this.guid = UUID.UUID();

        $("#alertWarning").hide();
        this.alerts = []
        this.alerts.push(
            {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is being used...',
            });

    }
    //selectAll
    selectAll() {
        for (var i = 0; i < this.offices.length; i++) {
            this.offices[i].selected = this.selectedAll;
        }
    }
    //checkIfAllSelected
    checkIfAllSelected() {
        this.selectedAll = this.offices.every(function (item: any) {
            return item.selected == true;
        })
    }
    //saveBankAccounts
    saveBankAccounts() {
        this.active=true;
        this.accT_TYPE_CODE = 3;
        //console.log("Office: " + this.officE_CODE + "logedInUserID:" + this.logedInUserID + "UserSessionID:" + this.UserSessionID);
      //alert(this.accounT_CODE);
        var bank = new bankAccount(this.banK_ACCOUNT_CODE, this.banK_CODE, this.brancH_CODE, this.accounT_CODE, this.accounT_NO, this.accounT_NAME, this.accounT_TITLE, this.officE_CODE, this.active, this.coA_GROUP, this.pL_BALSHEET, this.leveL_CODE, this.categorY_CODE, this.accT_TYPE_CODE, this.currency, this.accounT_TITLE, this.logedInUserID, this.logedInUserID, this.fiS_COA_OFFICE);
        
        var accounT_NAME = this.accounT_NAME.trim();
        var accounT_NO = this.accounT_NO.trim();
        $("#submitAdd").prop("disabled", true); 
        if (accounT_NAME != "") {
            if (accounT_NO != '') {
                this.isLoading =true;
                this.service.saveBankAccounts(bank).then(
                    (response) => {
                        this.isLoading = false;
                        this.modalReference.close();
                        this.coaOffices();
                        this.getBankAccounts(this.order_ID);
                        console.log(response);
                    },
                    (error) => console.log(error))
            }
            else {
                if(accounT_NO.replace(/\s/g, "").length<=0)
                this.accounT_NO='';
                swal("The Account # must be define.");
            }
        }
        else {
            if(accounT_NAME.replace(/\s/g, "").length<=0)
            this.accounT_NAME='';
            swal("The Bank Account name must be define.");
        }
    }
    //getChwqueBookStatus()
    getChequeBookStatus()
    {
        this.service.getChequeBookStatus(this.accounT_NO)
        .subscribe((o) => {
            console.log(o);
             
            this.chequeBookStatus = o.status
            if(this.chequeBookStatus == 200)
            {
                swal("You Can't Change The Status", "There is a active cheque book of this account", "error");
                this.active = true;
            }
        },
        (error) => console.log(error))
    }

    //updateBankAccounts
    updateBankAccounts() {
        
        this.accT_TYPE_CODE = 3;
        this.permissionUtility.PermissionAdd='';
        this.permissionUtility.PermissionEdit='';
        
            // this.service.checkBankVoucherExist(this.banK_ACCOUNT_CODE)
            // .subscribe(response=> {
            //     this.checkVoucherExist = (response.json());
            //     console.log(response.json());
            // });
        
            // if(this.checkVoucherExist != null || this.active == true)
            // {
                var bank = new bankAccount(this.banK_ACCOUNT_CODE, this.banK_CODE, this.brancH_CODE, this.accounT_CODE, this.accounT_NO, this.accounT_NAME, this.accounT_TITLE, this.officE_CODE, this.active, this.coA_GROUP, this.pL_BALSHEET, this.leveL_CODE, this.categorY_CODE, this.accT_TYPE_CODE, this.currency, this.accounT_TITLE, this.logedInUserID, this.UserSessionID, this.fiS_COA_OFFICE);
                var accounT_NAME = this.accounT_NAME.trim();
                var accounT_NO = this.accounT_NO.trim();
                $("#submitAdd").prop("disabled", true); 
                if (accounT_NAME != "") {
                    if (accounT_NO != '') {
                        this.isLoading =true;
                        this.service.updateBankAccounts(bank).then(
                            (response) => {
                                this.isLoading = false;
                                this.modalReference.close();
                                this.coaOffices();
                                this.getBankAccounts(this.order_ID);
                                console.log(response);
                            },
                            (error) => console.log(error))
                    }
                    else {
                        if(accounT_NO.replace(/\s/g, "").length<=0)
                        this.accounT_NO='';
                        swal("The Account # must be define.");
                    }
                }
                else {
                    if(accounT_NAME.replace(/\s/g, "").length<=0)
                    this.accounT_NAME='';
                    swal("The Bank Account name must be define.");
                }
            // }
            // else{
            //     swal("You Can'nt change the status.");
            // }
        
        
    }
    //coaOffices
    coaOffices() {
        for (let i = 0; i < this.offices.length; i++) {
            this.chk = this.offices[i].selected;
            if (this.chk == true) {
                this.officE_CODE = this.offices[i].officE_CODE;
                this.approveVoucher.push(new Account(this.accounT_CODE, this.officE_CODE));
            }
        }
        var json = this.approveVoucher;
        this.service.coaOffices(json).subscribe(
            (response) => {
                console.log(response);
            },
            (error) => console.log(error))
    }
    //getDetailsByID
    getDetailsByID(banK_ACCOUNT_CODE, content) {
        this.alerts = []

        this.alerts.push(
            {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is being used...',
            });


        this.isLoading =true;
        this.open(content);
        this.mode = true;
        this.service.getDetailsByID(banK_ACCOUNT_CODE)
            .subscribe((o: bankAccount) => { 
                console.log(o);

                this.banK_ACCOUNT_CODE = o.banK_ACCOUNT_CODE;
                this.banK_CODE = o.banK_CODE;
                this.brancH_CODE = o.brancH_CODE;
                this.accounT_NAME = o.accounT_NAME;
                this.accounT_NO = o.accounT_NO;
                this.accounT_TITLE = o.accounT_TITLE;
                this.getBankBranches(this.banK_CODE);
                this.active = o.active;
                this.submitAdd='none';
                this.submitUpdate='none';
                this.checkValue(this.active);

                this.service.IfExists(this.accounT_NO)
                    .subscribe(response => {

                        var status = response.json();
                        if (status) {
                            $("#alertWarning").show();
                        }

                    });

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
