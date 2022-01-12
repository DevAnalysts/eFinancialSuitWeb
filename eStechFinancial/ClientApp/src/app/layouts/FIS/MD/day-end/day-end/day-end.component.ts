import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DayEndService, dayEnd, cDate, NgbDateFRParserFormatter, JournalVoucherService, LoginService, PermissionUtility } from '../../../../../shared';
import { Select2OptionData } from 'ng-select2';
import swal from 'sweetalert';

@Component({
    selector: 'day-end',
    templateUrl: './day-end.component.html',
    styleUrls: ['./day-end.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DayEndComponent implements OnInit {
    
    logedInUserID: any = 1;
    UserSessionID: any = 0;
    public permissomUtility:PermissionUtility=new PermissionUtility(); 
    btnMode: any = 1;
    p: number = 1;
   isLoading: any = false;
    closeResult: string;
    details: any[] = [];
    balanaceDetails: any[] = [];
    poS_DayFormat: any;
    isClose: any;
    openingCash: any = 0.00;
    ownerCash: any = 0.00;
    borrowCash: any = 0.00;
    sales: any = 0.00;
    netCash: any = 0.00;
    expense: any = 0.00;
    payments: any = 0.00;
    bankDeposit: any = 0.00;
    closingCash: any = 0.00;
    bankAccounts: any[];
    borrowRemarks: any = "";
    public poS_Day = new cDate();
    public nextDay = new cDate();
    public nextDays = new cDate();
    accounts: Array<Select2OptionData>;
    creditsale: any = 0.00;
    creditrecieptcash: any = 0.00;
    creditrecieptbank: any = 0.00;
    bankpayment: any = 0.00;
    public bank_Acct_No: any = 1;
    public bank_Acct_TITLE: any;
    remarks: any = "";
    modalReference: NgbModalRef;
    guid: any;
    guidd: any;
    grid: any[] = [];
    ShowNextDay: any = '';

    id: any = '';

    userOffice: any;
    userCurrentOffice: any;
    userCurrentOfficeName: any;
    userPrivilegedOffice: any;
    userCurrentWarehouse: any;
    enableOpenDay: any;

    constructor(private service: DayEndService, private LoginService: LoginService, private services: JournalVoucherService, private modalService: NgbModal) {
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentOfficeName = this.LoginService.getSession('userCurrentOfficeName');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');

    }
    //ngOnInit
    ngOnInit() {
        ////////////////////////Set Name From Session Storage///////////////////////////
        this.getGrid('');
        $("#myInput").click();
        this.permissomUtility.setPagePermissions(110078);
    }
    //getGrid
    getGrid(value: string) {
        this.isLoading =true;
        this.service.getGrid(value, this.userPrivilegedOffice)
            .subscribe(response => {
                this.grid = (response.json());
                this.isLoading = false;
                //console.log(response.json());
            });
    }
    //getCurrentDay
    getCurrentDay() {
        var cb = 0;
        this.service.getCurrentDay(this.userCurrentOffice)
            .subscribe(response => {
                this.details = (response.json());
                // console.log(response.json());
                this.poS_Day.setDate(this.details[0].poS_Day);
                sessionStorage.setItem('currentOpenDay', this.details[0].poS_Day);
                this.isClose = this.details[0].isClose;
                this.openingCash = this.details[0].openingCash;
                this.closingCash = this.details[0].closingCash;
                this.nextDay.setDate(this.details[0].nextDay);
                this.poS_DayFormat = this.details[0].dayName + "," + this.details[0].month + "," + this.details[0].day + "," + this.details[0].year;
                //If closeAble is equal to 0 then save button disable else enable
                if (this.details[0].closeAble == 0)
                    $("#submitAdd").prop("disabled", true);
                else
                    $("#submitAdd").prop("disabled", false);
                //If enableOpenDay is equal to 0 then open day is disable else enable
                if (this.details[0].enableOpenDay == 0)
                    this.enableOpenDay = true;
                else
                    this.enableOpenDay = false;

                if (this.isClose == false) {
                    this.service.getBalance(this.poS_Day.getDateFinal(), this.userCurrentOffice)
                        .subscribe(response => {
                            //  console.log(response.json());
                            this.balanaceDetails = (response.json());
                            this.openingCash = this.balanaceDetails[0].openingCash;
                            this.sales = this.balanaceDetails[0].cashSales;
                            this.creditsale = this.balanaceDetails[0].creditSales;
                            this.creditrecieptcash = this.balanaceDetails[0].creditReceiptsCash;
                            this.creditrecieptbank = this.balanaceDetails[0].creditReceiptsBank;
                            this.expense = this.balanaceDetails[0].expense;
                            this.payments = this.balanaceDetails[0].cashPayments;
                            this.bankpayment = this.balanaceDetails[0].bankPayments;

                            this.netCash = this.balanaceDetails[0].openingCash + this.balanaceDetails[0].cashSales + this.balanaceDetails[0].creditReceiptsCash + this.ownerCash;
                            cb = this.netCash - (this.expense + this.payments) - this.bankDeposit;
                            this.closingCash = cb.toFixed(2);
                        });
                }
                //console.log(response.json());
            });
    }
    //changeOwner
    changeOwner(ownerCash) {
        var nc = 0, cc = 0
        if (ownerCash <= 0) {
            this.ownerCash = 0;
        }
        nc = this.openingCash + this.sales + this.ownerCash + this.borrowCash + this.creditrecieptcash;
        this.netCash = nc.toFixed(2);
        cc = this.netCash - (this.expense + this.payments) - this.bankDeposit;
        this.closingCash = cc.toFixed(2);
    }
    //changeBorrowCash
    changeBorrowCash(borrowCash) {
        var nc = 0, cc = 0
        if (borrowCash <= 0) {
            this.borrowCash = 0;
        }

        nc = this.openingCash + this.sales + this.ownerCash + this.borrowCash + this.creditrecieptcash;
        this.netCash = nc.toFixed(2);
        cc = this.netCash - (this.expense + this.payments) - this.bankDeposit;
        this.closingCash = cc.toFixed(2);
    }
    //changeBankDeposit
    changeBankDeposit(bankDeposit) {
        var nc = 0, cc = 0
        if (bankDeposit <= 0) {
            this.bankDeposit = 0;
        }
        if (bankDeposit != 0) {
            $("#lblBankAccount").show();
            $("#lblBankAccountTitle").show();
        }
        else {
            $("#lblBankAccount").hide();
            $("#lblBankAccountTitle").hide();
        }
        nc = this.openingCash + this.sales + this.ownerCash + this.borrowCash + this.creditrecieptcash;
        this.netCash = nc.toFixed(2);
        cc = this.netCash - (this.expense + this.payments) - this.bankDeposit;
        this.closingCash = cc.toFixed(2);
    }
    //getBankAccounts
    getBankAccounts() {
        this.bankAccounts = [];
        this.services.getBankAccountsDayEnd(1)
            .subscribe(response => {
                if (response.json() != null) {
                    this.bankAccounts = (response.json());
                    this.bank_Acct_No = this.bankAccounts[0].bank_Acct_No;
                    this.bank_Acct_TITLE = this.bankAccounts[0].bank_Acct_TITLE;
                    //this.isLoading = false;
                }
                else {
                    swal("No Bank Account Exist!")
                    $("#submitAdd").prop("disabled", true);
                }
            });
    }
    //getDropdownList
    getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
        let ar: Array<any> = [];
        if (arr != null) {
            //if (!this.mode) {
            ar.push({
                id: 0,
                text: ""
            });
            //}
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
    //clearFields
    clearFields() {
        this.ShowNextDay = '';
        this.btnMode = true;
        this.ownerCash = 0;
        this.borrowCash = 0;
        this.borrowRemarks = "";
        this.bankDeposit = 0;
        this.userCurrentOfficeName = this.LoginService.getSession('userCurrentOfficeName');
        this.guid = UUID.UUID();
        this.guidd = "";
        this.getCurrentDay();
        this.getBankAccounts();
        $("#lblBankAccount").hide();
        $("#lblBankAccountTitle").hide();
    }
    //cancelOrder
    cancelOrder() {

    }
    //saveDayEnd
    saveDayEnd(isClose) {
        $("#submitAdd").prop("disabled", true);
        if (this.closingCash >= 0) {
            swal({
                title: "Do you really want to day end?",
                text: "Once day end, you will not be able to recover this day!",
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

                        this.isLoading =true;
                        var day = new dayEnd(this.openingCash, this.ownerCash, this.borrowCash, this.borrowRemarks, this.sales, this.expense, this.payments, this.bankDeposit, this.closingCash, this.nextDay.getDateFinal(), this.remarks, this.bank_Acct_No, this.guid, this.guidd, this.logedInUserID, this.UserSessionID, this.userCurrentOffice, 0, 0);
                        this.service.saveDayEnd(day).then(
                            (response) => {
                                this.isLoading = false;
                                this.getGrid('');
                                this.modalReference.close();
                                $("#submitAdd").prop("disabled", false);
                                swal("Poof! Your day has been ended!", {
                                    icon: "success",
                                });

                                this.clearFields();
                                this.getCurrentDay();
                                console.log(response);
                            },
                            (error) => console.log(error))

                    } else {
                        $("#submitAdd").prop("disabled", false);
                        swal("Your day end is safe!");
                    }
                });
        }
        else {
            $("#submitAdd").prop("disabled", false);
            swal("Closing Cash should be greater then or equal to zero!");
        }
    }
    //onNavigate
    onNavigate(pth) {
        //console.log('Nav', pth);
        if (pth == "/daysummary-rpt-rdlc") {
            sessionStorage.setItem('reportID', "6");
            sessionStorage.setItem('dateDaySummary', this.poS_Day.getDateFinal());
            sessionStorage.setItem('dateParam', this.poS_Day.getDate());
        }
        window.open(pth, "_blank");
    }
    //open Model
    open(content) {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        // console.log(ngbModalOptions);
        this.modalReference = this.modalService.open(content, { size: 'xlg' });
        //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

        this.clearFields();
    }
    //open Model
    opendetail(content) {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        // console.log(ngbModalOptions);
        this.modalReference = this.modalService.open(content, { size: 'xlg' });
        //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

        // this.clearFields();
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
    //getDetailsByID
    getDetailsByID(ID, branchid, officeName, content) {
        this.opendetail(content);
        this.btnMode = false;
        this.ShowNextDay = 'none';
        this.service.getDetailsByID(ID, branchid)
            .subscribe(response => {
                var list = (response.json());
                console.log(list);

                this.poS_Day.setDate(list[0].posday);
                this.openingCash = list[0].openingcash;
                this.ownerCash = list[0].ownerCash;
                this.borrowCash = list[0].borrowCash;


                this.borrowRemarks = list[0].borrowRemarks;
                this.sales = list[0].sales;
                this.creditsale = 0;
                this.creditrecieptcash = 0;
                this.creditrecieptbank = 0;
                this.userCurrentOfficeName = officeName;
                this.expense = list[0].expense;
                this.payments = list[0].payments;
                this.bankpayment = 0;
                this.bankDeposit = list[0].bankDeposit;

                this.closingCash = list[0].closingCash;
                this.remarks = list[0].remarks;

                this.services.getBankAccountsDayEnd(1)
                    .subscribe(response => {
                        if (response.json() != null) {
                            this.bankAccounts = (response.json());
                            this.bank_Acct_No = list[0].bank_Acct_No;
                        }

                    });

                if (this.bankDeposit > 0) {
                    $("#lblBankAccount").show();
                    $("#lblBankAccountTitle").show();
                }
                else {
                    $("#lblBankAccount").hide();
                    $("#lblBankAccountTitle").hide();
                }

                this.netCash = this.openingCash + this.sales + this.borrowCash + this.ownerCash;
            });
    }
}
