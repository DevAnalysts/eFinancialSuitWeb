import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BankReconciliationService, bankReconciliation, bankReconciliationDetails, cDate, NgbDateFRParserFormatter, DayEndService, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';
@Component({
    selector: 'bank-reconciliation',
    templateUrl: './bank-reconciliation.component.html',
    styleUrls: ['./bank-reconciliation.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})

export class BankReconciliationComponent implements OnInit {
     
    UserSessionID: any = 0;
    public permissionUtility:PermissionUtility=new PermissionUtility();

    p: number = 1;
    modalReference: NgbModalRef;
    bankReconciliations: any[];
    offices: any[];
    accounts: any[];
    bankReconciliationDetail: any[];
    bankReconciliationOutstanding: any[];
    bankReconciliationDetails: any[];
    detail: any[];
    reconciliationID: any;
    tranS_ID: any;
    officE_CODE: any = 1;
    officE_NAME: any = "";
    accounT_CODE: any = "";
    accounTTITLE: any = "";
    ledgerBalance: any = 0;
    DifferenceBalance: any = 0;
    NetBalance: any = 0;
    bankBalance: any = 0;
    net: any;
    guid: any;
    mode: any = 0;
    ID: any = "";
    hide: any = false;
    selectedAll: any;
    receivedAll: any;
    receivedAllB: any;
    chk: any = false;
    closeResult: string;
    details: any[] = [];
    dayEndDetail: any[] = [];
    public reconciliationDate = new cDate();
    public paymentDate = new cDate();
    public fiscalOpenDay = new cDate();
    public currentDate = new cDate();
    public startDate = new cDate();
    public endDate = new cDate();
    deposit: any;
    outstanding: any;
    isLoading: any = false;
    logedInUserID: any = 1;
    userOffice: any;
    userPrivilegedOffice: any;
    userCurrentOffice: any;
    userCurrentWarehouse: any;
    status: any = 'Draft';
    constructor(private service: BankReconciliationService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private DayEndService: DayEndService, private modalService: NgbModal) {
        this.bankReconciliationDetails = new Array<bankReconciliationDetails>();
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
        this.deposit=0;
        this.outstanding=0;
    }

    //ngOnInit
    ngOnInit() {
        this.deposit=0;
        this.outstanding=0;
        this.getReconciliations(this.ID);
        this.setReconciliationDate(this.reconciliationDate);
        this.permissionUtility.setPagePermissions(50011);
    }
     ////////////////////////
  
    //getCurrentDay
    getCurrentDay() {
        this.reconciliationDate.setDate(this.LoginService.getSession('currentDate'));
        this.currentDate.setDate(this.LoginService.getSession('currentDate'));
        this.fiscalOpenDay.setDate(this.LoginService.getSession('fiscalOpenDay'));
        this.startDate.setDate(this.LoginService.getSession('startDate'));
        this.endDate.setDate(this.LoginService.getSession('endDate'));
    }
    //changeDate
    changeDate(reconciliationDate) {
        if (this.reconciliationDate.getStandardDate() > this.startDate.getStandardDate())
            this.reconciliationDate.setDate(this.fiscalOpenDay.getDateFinal());
        else if (this.reconciliationDate.getStandardDate() < this.endDate.getStandardDate())
            this.reconciliationDate.setDate(this.fiscalOpenDay.getDateFinal());
        else if (this.reconciliationDate.getStandardDate() < this.currentDate.getStandardDate())
            this.reconciliationDate.setDate(this.fiscalOpenDay.getDateFinal());
    }
    //setReconciliationDate
    setReconciliationDate(reconciliationDate) {
        var date = new Date(this.reconciliationDate.getDateFinal());
        var d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.reconciliationDate.setDate(d);
    }
    //changeVDate
    changeVDate(paymentDate) {
        //if (this.paymentDate.getDateFinal() < this.dayEndDate.getDateFinal())
        //  this.paymentDate.setDate(this.dayEndDate.getDateFinal());
        //if (paymentDate > this.dayEndDate.getDateFinal())
        //  this.reconciliationDate.setDate(this.dayEndDate.getDateFinal());
    }
    //getReconciliations
    getReconciliations(value: string) {
        this.isLoading =true;
        this.service.getReconciliations(value, this.userPrivilegedOffice)
            .subscribe(response => {
                if(response.json() !== null){
                    this.bankReconciliations = (response.json());
                    this.isLoading = false;
                    //   console.log(response.json());
                }
                else
                {
                    this.bankReconciliations = [];
                    this.isLoading = false;
                }
                
            });
    }
    //getOffices
    getOffices() {
        this.isLoading =true;
        this.service.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
                this.offices = (response.json());
                this.officE_CODE = this.offices[0].officE_CODE;
                this.officE_NAME = this.offices[0].officE_NAME;
                this.officE_CODE = this.userCurrentOffice;
                this.isLoading = false;
            });
    }
    //getAccounts
    getAccounts() {
        this.service.getAccounts()
            .subscribe(response => {
                this.accounts = (response.json());
                this.accounT_CODE = this.accounts[0].accounT_CODE;
                this.getVoucherDetails(this.accounT_CODE);

            });
    }
    //getVoucherDetails
    getVoucherDetails(accountCode) {
        if (!this.mode) {
            this.isLoading =true;
            this.getLedgerBalance();
            this.service.getVoucherDetails(accountCode)
                .subscribe(response => {
                    this.isLoading = false;
                    this.bankReconciliationDetail = (response.json());
                    this.CalculateNet();
                    this.getBPVoucherDetails(accountCode);
                });
        }
    }
    //getBPVoucherDetails
    getBPVoucherDetails(accountCode) {
        if (!this.mode) {
            this.isLoading =true;
            this.getLedgerBalance();
            this.service.getBPVoucherDetails(accountCode)
                .subscribe(response => {
                    //  console.log(response.json());
                    this.isLoading = false;
                    this.bankReconciliationOutstanding = (response.json());
                    this.CalculateNetOut();
                });
        }
    }
    //clearFields
    clearFields() {
        this.mode = 0;
        this.getOffices();
        this.getAccounts();
        this.ledgerBalance = 0;
        this.bankBalance = 0;
        this.DifferenceBalance = 0;
        this.deposit=0;
        this.outstanding=0;
        this.NetBalance = 0;
        this.accounT_CODE = "";
        this.accounTTITLE = "";
        this.bankReconciliationDetail = [];
        this.bankReconciliationOutstanding = [];
        //this.getAccounts(this.banK_CODE);
        $("#submitAdd").prop("disabled", false);
        $("#approveBtn").prop("disabled", true);
        //this.guid = UUID.UUID();
    }
    //selectAll
    selectAll() {
        for (var i = 0; i < this.bankReconciliationDetail.length; i++) {
            this.bankReconciliationDetail[i].selected = this.selectedAll;
        }
    }
    //receiveAll
    receiveAll() {
        for (var i = 0; i < this.bankReconciliationDetail.length; i++) {
            this.bankReconciliationDetail[i].received = this.receivedAll;
        }
    }
    //selectAllOut
    selectAllOut() {
        for (var i = 0; i < this.bankReconciliationOutstanding.length; i++) {
            this.bankReconciliationOutstanding[i].selected = this.receivedAllB;
        }
    }
    //receiveAllOut
    receiveAllOut() {
        for (var i = 0; i < this.bankReconciliationOutstanding.length; i++) {
            this.bankReconciliationOutstanding[i].received = this.receivedAllB;
        }
    }
    //checkIfAllSelected
    checkIfAllSelected() {
    }
    //CalculateDifference
    CalculateDifference() {
        var sum = this.ledgerBalance - this.bankBalance;
        if (sum != null) {
            this.DifferenceBalance = sum;
            this.NetBalance = sum;
        }
        this.CalculateNet();
    }
    //TotalDebit
    TotalDebit() {
        var sum = 0;
        if (this.bankReconciliationDetail != null) {
            for (let i = 0; i < this.bankReconciliationDetail.length; i++) {
                if (this.bankReconciliationDetail[i].selected == true) {
                    sum += this.bankReconciliationDetail[i].debit;
                }
                else
                    sum += this.bankReconciliationDetail[i].debit;
            }
        }
        return sum;
    }
    //TotalDebitOut
    TotalDebitOut() {
        var sum = 0;
        if (this.bankReconciliationOutstanding != null) {
            for (let i = 0; i < this.bankReconciliationOutstanding.length; i++) {
                if (this.bankReconciliationOutstanding[i].selected == true) {
                    sum += this.bankReconciliationOutstanding[i].debit;
                }
                else
                    sum += this.bankReconciliationOutstanding[i].debit;
            }
        }
        return sum;
    }
    //TotalCredit
    TotalCredit() {
        var sum = 0;
        if (this.bankReconciliationDetail != null) {
            for (let i = 0; i < this.bankReconciliationDetail.length; i++) {
                this.chk = this.bankReconciliationDetail[i].selected;
                if (this.chk == true) {
                    sum += this.bankReconciliationDetail[i].debit;
                }
            }
        }
        this.deposit = sum.toFixed(2);
        return sum;
    }
    //TotalCreditOut
    TotalCreditOut() {
        var sum = 0;
        if (this.bankReconciliationOutstanding != null) {
            for (let i = 0; i < this.bankReconciliationOutstanding.length; i++) {
                this.chk = this.bankReconciliationOutstanding[i].selected;
                if (this.chk == true) {
                    sum += this.bankReconciliationOutstanding[i].debit;
                }
            }
        }
        this.outstanding = sum.toFixed(2);
        return sum;
    }
    //CalculateNet
    CalculateNet() {
        //$("#receivedCredit").prop("disabled", true);
        if (this.bankReconciliationDetail != null) {
            for (let i = 0; i < this.bankReconciliationDetail.length; i++) {
                this.chk = this.bankReconciliationDetail[i].received;
                if (this.chk == true) {
                    this.bankReconciliationDetail[i].selected = false;
                    this.DifferenceBalance = this.ledgerBalance - this.bankBalance;
                    var net = this.TotalDebit() + this.bankBalance - this.TotalDebitOut();
                    if (net != null) {
                        this.NetBalance = net.toFixed(2);
                    }
                } else {
                    this.bankReconciliationDetail[i].selected = true;
                    this.bankReconciliationDetail[i].received = false;
                }


            }
        }
    }
    //CalculateNetOut
    CalculateNetOut() {
        //$("#receivedCredit").prop("disabled", true);
        if (this.bankReconciliationOutstanding != null) {
            for (let i = 0; i < this.bankReconciliationOutstanding.length; i++) {
                this.chk = this.bankReconciliationOutstanding[i].received;
                if (this.chk == true) {
                    this.bankReconciliationOutstanding[i].selected = false;
                    var net = this.TotalDebit() + this.bankBalance - this.TotalDebitOut();
                    if (net != null) {
                        this.NetBalance = net.toFixed(2);
                    }
                } else {
                    this.bankReconciliationOutstanding[i].selected = true;
                    this.bankReconciliationOutstanding[i].received = false;

                }

            }
        }
    }
    //getLedgerBalance
    getLedgerBalance() {
        this.service.getLedgerBalance(this.officE_CODE, this.accounT_CODE)
            .subscribe(response => {
                var List = (response.json());
                this.ledgerBalance = List[0].balance;
                console.log(this.ledgerBalance);
                this.CalculateDifference();

            });
    }
    //saveBankReconciliation
    saveBankReconciliation() {

        //Deposit
        for (let i = 0; i < this.bankReconciliationDetail.length; i++) {
            this.bankReconciliationDetails.push(new bankReconciliationDetails(0, 0, this.bankReconciliationDetail[i].tranS_ID, this.bankReconciliationDetail[i].debit, this.bankReconciliationDetail[i].selected, this.bankReconciliationDetail[i].received, this.bankReconciliationDetail[i].paymentDate));
            //---------------------------------
        }
        //Outstanding
        for (let i = 0; i < this.bankReconciliationOutstanding.length; i++) {
            this.bankReconciliationDetails.push(new bankReconciliationDetails(0, 0, this.bankReconciliationOutstanding[i].tranS_ID, this.bankReconciliationOutstanding[i].debit, this.bankReconciliationOutstanding[i].selected, this.bankReconciliationOutstanding[i].received, this.bankReconciliationOutstanding[i].paymentDate));
            //---------------------------------
        }


        if (this.ledgerBalance != this.NetBalance) {
            swal({
                title: "Do you really want to save as draft?",
                text: "The Bank Reconsiliation is not completed!",
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
                        $("#submitAdd").prop("disabled", true);
                        if (this.bankReconciliationDetails.length > 0) {
                            var order = new bankReconciliation(0, this.officE_CODE, this.reconciliationDate.getDateFinal(), this.accounT_CODE, this.ledgerBalance, this.bankBalance, this.deposit, this.outstanding, this.NetBalance, this.status, this.logedInUserID, this.UserSessionID, this.bankReconciliationDetails);
                            this.service.saveBankReconciliation(order).then(
                                (response) => {
                                    this.getReconciliations(this.ID);
                                    //  console.log(response);
                                },
                                (error) => console.log(error))
                        } else {
                            alert("Please! Insert at least one record.");
                        }
                    } else {
                        swal("Your Reconsiliation is safe!");
                    }
                });
        }

        else {
            this.status = "Save";
            $("#submitAdd").prop("disabled", true);
            if (this.bankReconciliationDetails.length > 0) {
                var order = new bankReconciliation(0, this.officE_CODE, this.reconciliationDate.getDateFinal(), this.accounT_CODE, this.ledgerBalance, this.bankBalance, this.deposit, this.outstanding, this.NetBalance, this.status, this.logedInUserID, this.UserSessionID, this.bankReconciliationDetails);
                this.service.saveBankReconciliation(order).then(
                    (response) => {
                        this.getReconciliations(this.ID);
                        //  console.log(response);
                    },
                    (error) => console.log(error))
            } else {
                alert("Please! Insert at least one record.");
            }
        }


    }
    //updateBankReconciliation
    updateBankReconciliation() {
        //Deposit
        for (let i = 0; i < this.bankReconciliationDetail.length; i++) {
            this.bankReconciliationDetails.push(new bankReconciliationDetails(0, 0, this.bankReconciliationDetail[i].tranS_ID, this.bankReconciliationDetail[i].debit, this.bankReconciliationDetail[i].selected, this.bankReconciliationDetail[i].received, this.bankReconciliationDetail[i].paymentDate));
            //---------------------------------
        }
        //Outstanding
        for (let i = 0; i < this.bankReconciliationOutstanding.length; i++) {
            this.bankReconciliationDetails.push(new bankReconciliationDetails(0, 0, this.bankReconciliationOutstanding[i].tranS_ID, this.bankReconciliationOutstanding[i].debit, this.bankReconciliationOutstanding[i].selected, this.bankReconciliationOutstanding[i].received, this.bankReconciliationOutstanding[i].paymentDate));
            //---------------------------------
        }

        if (this.bankReconciliationDetails.length > 0) {
            var order = new bankReconciliation(this.reconciliationID, this.officE_CODE, this.reconciliationDate.getDateFinal(), this.accounT_CODE, this.ledgerBalance, this.bankBalance, this.deposit, this.outstanding, this.NetBalance, this.status, this.logedInUserID, this.UserSessionID, this.bankReconciliationDetails);
            this.service.updateBankReconciliation(order).then(
                (response) => {
                    this.getReconciliations(this.ID);
                    //  console.log(response);
                },
                (error) => console.log(error))
        } else {
            alert("Please! Insert at least one record.");
        }
    }
    //getDetailsByID
    getDetailsByID(reconciliationID, content) {
        this.isLoading = true
        this.open(content);
        this.mode = true;
        this.service.getDetailsByID(reconciliationID)
            .subscribe((o: bankReconciliation) => {
                this.reconciliationID = o.reconciliationID;
                this.officE_CODE = o.officE_CODE;
                this.reconciliationDate.setDate(o.reconciliationDate);
                this.accounT_CODE = o.accounT_CODE;
                this.ledgerBalance = o.ledgerBalance;
                this.bankBalance = o.bankBalance;
                this.net = o.net;
                this.status = o.status;
                this.isLoading = false;
                this.detail = o.bankReconciliationDetails;
                if (this.status == "Draft")
                    $("#approveBtn").prop("disabled", true);

                else if (this.status == "Save")
                    $("#approveBtn").prop("disabled", false);



                //Deposit
                this.service.getVoucherDetails(o.accounT_CODE)
                    .subscribe(response => {
                        this.isLoading = false;
                        this.bankReconciliationDetail = (response.json());
                        if (this.detail.length > 0) {
                            for (let i = 0; i < this.detail.length; i++)
                                for (let j = 0; j < this.bankReconciliationDetail.length; j++) {
                                    if (this.detail[i].tranS_ID == this.bankReconciliationDetail[j].tranS_ID) {
                                        this.bankReconciliationDetail[j].debit = this.detail[i].amount;
                                        this.bankReconciliationDetail[j].selected = this.detail[i].selected;
                                        this.bankReconciliationDetail[j].received = this.detail[i].received;
                                        this.bankReconciliationDetail[j].paymentDate = this.paymentDate.setDate(this.detail[i].paymentDate);
                                        break;
                                    }
                                }
                        }
                        this.CalculateNet();
                    });
                //--------------------------------------

                //Outstanding
                this.service.getBPVoucherDetails(o.accounT_CODE)
                    .subscribe(response => {
                        this.isLoading = false;
                        this.bankReconciliationOutstanding = (response.json());
                        if (this.detail.length > 0) {
                            for (let i = 0; i < this.detail.length; i++)
                                for (let j = 0; j < this.bankReconciliationOutstanding.length; j++) {
                                    if (this.detail[i].tranS_ID == this.bankReconciliationOutstanding[j].tranS_ID) {
                                        this.bankReconciliationOutstanding[j].debit = this.detail[i].amount;
                                        this.bankReconciliationOutstanding[j].selected = this.detail[i].selected;
                                        this.bankReconciliationOutstanding[j].received = this.detail[i].received;
                                        this.bankReconciliationOutstanding[j].paymentDate = this.paymentDate.setDate(this.detail[i].paymentDate);
                                        break;
                                    }
                                }
                        }
                        this.CalculateNetOut();
                    });
                //--------------------------------------
            });
    }
    //getVoucherDetailsByID
    getVoucherDetailsByID(accountCode) {
        this.isLoading =true;
        this.service.getVoucherDetail(accountCode)
            .subscribe(response => {
                this.isLoading = false;
                this.bankReconciliationDetail = (response.json());
                this.TotalCredit();
                this.TotalDebit();
            });
    }
    //getBPVoucherDetailsByID
    getBPVoucherDetailsByID(accountCode) {
        this.isLoading =true;
        this.service.getVoucherDetail(accountCode)
            .subscribe(response => {
                this.isLoading = false;
                this.bankReconciliationOutstanding = (response.json());
                this.TotalCreditOut();
                this.TotalDebitOut();
            });
    }
    //changeVoucherStatus
    changeApproveStatus() {
        if (this.status == "Save") {
            swal({
                title: "Do you really want to Approve?",
                text: "Once Approve, you will not be able to change the status!",
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
                        this.status = "Approve";
                        this.service.changeApproveStatus(this.reconciliationID, this.status)
                            .subscribe(response => {

                                var list = (response.json());
                                this.getReconciliations('');
                                this.modalReference.close();
                            });
                    }

                });
        }

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
    // openDetail Modal
    openDetail(content) {
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
