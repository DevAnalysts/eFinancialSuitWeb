import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { JournalVoucherService, voucher, voucherDetails, cDate, NgbDateFRParserFormatter, DayEndService, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
    selector: 'bank-payment-voucher',
    templateUrl: './bank-payment-voucher.component.html',
    styleUrls: ['./bank-payment-voucher.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class BankPaymentVoucherComponent implements OnInit {
    
    logedInUserID: any = 1;
    UserSessionID: any = 0;
     
    p: number = 1;
    modalReference: NgbModalRef;
    vouchers: any[];
    offices: any[];
    chequeNos: any[];
    costCenter: any[];
    closeResult: string;
    officE_CODE: any = 1;
    officE_NAME: any;
    abbr: any;
    cosT_CENTER_CODE: any = 1;
    mode: any = 0;
    voucheR_ID: any = "";
    voucheRID: any = "";
    remarks: any;
    public accounT_CODE: any = 1;
    public accounT_TITLE: any;
    public bank_Acct_No: any = 1;
    public bank_Acct_TITLE: any;
    voucheR_TYPE_CODE: any = 2;
    pay_Method: any = 1;
    debit: any = 0;
    credit: any = 0;
    accounts: Array<Select2OptionData>;
    accounts1: Array<Select2OptionData>;
    bankAccounts: any[];
    voucherDetails: any[];
    editMode = false;
    Page_Code: any = 50003;
    guid: any = "";
    ID: any = "";
    chequE_NO: any;
    particulars: any = "";
    cosT_CENTER_TYPE = "O";
    currencY_CODE = 1;
    voucher_GUID: any;
    date = new Date();
    dayEndDetail: any[] = [];

    isLoading: any = false;
    EditItemButton: any = '';
    RemoveItemButton: any = '';
    isView: any = false;

    amount: any = 0;
    payto: any = '';
    submitAdd:any;
    submitUpdate:any;
    dp:any;

    public voucheR_DATE = new cDate();
    public fiscalOpenDay = new cDate();
    public currentDate = new cDate();
    public startDate = new cDate();
    public endDate = new cDate();
    public chequE_DATE: any = new cDate();
    userOffice: any;
    userPrivilegedOffice: any;
    userCurrentOffice: any;
    userCurrentWarehouse: any;
    public permissionUtility:PermissionUtility=new PermissionUtility();


    constructor(private service: JournalVoucherService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private DayEndService: DayEndService, private modalService: NgbModal) {
        this.voucherDetails = new Array<voucherDetails>();
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    }

    ngOnInit() {
        this.geBankPaymentVouchers(this.ID);
        this.getCurrentDay();
        this.permissionUtility.setPagePermissions(50003);
    }
     ////////////////////////
  
    //getCurrentDay
    getCurrentDay() {
        this.voucheR_DATE.setDate(this.LoginService.getSession('currentDate'));
        this.currentDate.setDate(this.LoginService.getSession('currentDate'));
        this.fiscalOpenDay.setDate(this.LoginService.getSession('fiscalOpenDay'));
        this.startDate.setDate(this.LoginService.getSession('startDate'));
        this.endDate.setDate(this.LoginService.getSession('endDate'));
    }
    //changeVDate
    changeVDate(voucheR_DATE) {
        if (this.voucheR_DATE.getStandardDate() > this.startDate.getStandardDate())
            this.voucheR_DATE.setDate(this.fiscalOpenDay.getDateFinal());
        else if (this.voucheR_DATE.getStandardDate() < this.endDate.getStandardDate())
            this.voucheR_DATE.setDate(this.fiscalOpenDay.getDateFinal());
        else if (this.voucheR_DATE.getStandardDate() < this.currentDate.getStandardDate())
            this.voucheR_DATE.setDate(this.fiscalOpenDay.getDateFinal());

    }
    //geBankPaymentVouchers
    geBankPaymentVouchers(value: string) {
        this.isLoading =true;
        this.service.geBankPaymentVouchers(value, this.userPrivilegedOffice)
            .subscribe(response => {
                if(response.json() !== null){
                    this.vouchers = (response.json());
                    // console.log(this.vouchers);
                    this.isLoading = false;
                    //     console.log(response.json());
                }
                else{
                    this.vouchers = [];
                    this.isLoading = false;
                }
                
            });
    }
    //getOffices
    getOffices() {
        this.isLoading =true;
        this.service.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
                if (response.json() != null) {
                    this.offices = (response.json());
                    this.officE_CODE = this.offices[0].officE_CODE;
                    this.officE_NAME = this.offices[0].officE_NAME;
                    this.cosT_CENTER_CODE = this.offices[0].cosT_CENTER_CODE;
                    this.abbr = this.offices[0].abbr;
                    this.cosT_CENTER_CODE = this.userCurrentOffice;
                    this.officE_CODE = this.userCurrentOffice;
                    this.getAccounts(this.officE_CODE);
                    this.getBankAccounts(this.officE_CODE);
                }
                else {
                    this.isLoading = false;
                    swal("No Office Exist!")
                    $("#submitAdd").prop("disabled", true);
                }
            });
    }
    //getChangeOffices
    getChangeOffices(officE_CODE) {
        this.service.getChangeOffices(officE_CODE)
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                    this.costCenter = (response.json());
                    this.cosT_CENTER_CODE = this.costCenter[0].cosT_CENTER_CODE;
                    this.abbr = this.costCenter[0].abbr;
                    this.getAccounts(this.officE_CODE);
                    this.getBankAccounts(this.officE_CODE);
                }
                else {

                    swal("No Office Exist!")
                    $("#submitAdd").prop("disabled", true);
                }
            });
    }
    //getAccounts
    getAccounts(officE_CODE) {
        this.isLoading =true;
        this.service.getAccounts(officE_CODE)
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {

                    this.accounts = this.getDropdownList(response.json(), "accounT_CODE", "accounT_TITLE");
                    this.accounT_CODE = this.accounts[0].id;
                    this.accounT_TITLE = this.accounts[0].text;
                }
                else
                    this.isLoading = false;
            });
    }
    //getChangeAccounts
    getChangeAccounts(e: any) {
        this.accounT_CODE = e;
        if (this.accounts.length >= 1) {
            for (let i = 0; i < this.accounts.length; i++)
                if (this.accounts[i].id == this.accounT_CODE) {
                    this.accounT_TITLE = this.accounts[i].text;
                }
        }


        //this.service.getChangeAccounts(this.accounT_CODE)
        //  .subscribe(response => {
        //    if (response.json() != null) {
        //      this.accounts = this.getDropdownList(response.json(), "accounT_CODE", "accounT_TITLE");
        //      this.accounT_CODE = this.accounts1[0].id;
        //      this.accounT_TITLE = this.accounts1[0].text;
        //    }

        //  });
    }
    //getBankAccounts
    getBankAccounts(officE_CODE) {
        this.isLoading =true;
        this.bankAccounts = [];
        this.service.getBankAccounts(officE_CODE)
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                    this.bankAccounts = (response.json());
                    if (!this.mode) {
                        this.bank_Acct_No = this.bankAccounts[0].bank_Acct_No;
                        this.bank_Acct_TITLE = this.bankAccounts[0].bank_Acct_TITLE;
                    }
                    this.chequeNos = [];
                    this.isLoading =true;
                    this.service.getChequeNo(this.bankAccounts[0].bank_Acct_No, "Open", true)
                        .subscribe(response => {
                            this.isLoading = false;
                            if (response.json() != null) {
                                this.chequeNos = (response.json());
                                this.chequE_NO = this.chequeNos[0].chequE_NO;
                                $("#AddNewItemRow").show();
                                $("#submitAdd").prop("disabled", false);
                            }
                            else if (!this.mode) {
                                $("#AddNewItemRow").hide();
                                $("#submitAdd").prop("disabled", true);
                                //swal("No Cheque Book Exist!")
                            }


                        });


                }
                else {
                    swal("No Bank Account Exist!")
                    $("#submitAdd").prop("disabled", true);
                }
            });
    }
    //changeChequeNo
    changeChequeNo(bank_Acct_No) {
        this.chequeNos = [];
        this.isLoading =true;
        this.service.getChequeNo(bank_Acct_No, "Open", true)
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {

                    this.chequeNos = (response.json());
                    this.chequE_NO = this.chequeNos[0].chequE_NO;
                    $("#AddNewItemRow").show();
                    $("#submitAdd").prop("disabled", false);
                }
                else if (!this.mode) {
                    $("#AddNewItemRow").hide();
                    $("#submitAdd").prop("disabled", true);
                    //   swal("No Cheque Book Exist!")
                }
            });

    }
    //FrieghtTermsList
    paymentMethod = [
        { "pay_Method": 1, "payment_Method": "Cross" }
        , { "pay_Method": 2, "payment_Method": "Cash" }
    ]
    //clearFields
    clearFields() {
        this.mode = 0;
        this.remarks = "";
        $("#AddNewItemRow").show();
        this.EditItemButton = '';
        this.RemoveItemButton = '';
        this.amount = 0;
        this.payto = '';
        this.getOffices();
        this.voucheR_DATE = new cDate();
        this.voucher_GUID = UUID.UUID();
        this.voucherDetails = [];
        //this.getAccounts(this.banK_CODE);
        $("#submitAdd").prop("disabled", false);
        $("#lblCheque").hide();
        $("#ddlCheque").show();
        //this.guid = UUID.UUID();
    }
    //TotalDebit
    TotalDebit() {
        var totalDebit = 0;
        if (this.voucherDetails.length > 0) {
            for (var count = 0; count < this.voucherDetails.length; count++) {
                totalDebit += this.voucherDetails[count].debit;
            }
        }
        return totalDebit.toFixed(2);
    }
    //TotalCredit
    TotalCredit() {
        var totalCredit = 0;
        if (this.voucherDetails.length > 0) {
            for (var count = 0; count < this.voucherDetails.length; count++) {
                totalCredit += this.voucherDetails[count].credit;
            }
        }

        return totalCredit.toFixed(2);
    }
    //changeDebit
    changeDebit(debit) {
        if (debit <= 0) {
            this.debit = 0;
            $("#Credit").prop("disabled", false);
        }
        else {
            $("#Credit").prop("disabled", true);
        }
    }
    //changeCredit
    changeCredit(credit) {
        if (credit <= 0) {
            this.credit = 0;
            $("#Debit").prop("disabled", false);
        }
        else {
            $("#Debit").prop("disabled", true);
        }
    }
    //changeMode
    changeMode(idx: any, i: voucherDetails, Mode: any) {

        var flag = false;
        if (this.voucherDetails.length > 0) {
            for (var count = 0; count < this.voucherDetails.length; count++) {
                if (this.voucherDetails[count].accounT_CODE == i.accounT_CODE && idx != count) {
                    flag = true;
                    break;
                }
            }
        }

        if (Mode == 0) {
            if (flag == false) {
                i.accounT_CODE = this.accounT_CODE;
                i.accounT_TITLE = this.accounT_TITLE;
                i.cosT_CENTER_TYPE = "O";
                i.edit_Mode = false;

                this.accounT_CODE = 0;
                this.accounT_TITLE = '';
                if (this.TotalDebit() != "0.00" && this.TotalDebit() != "0") {
                    $("#submitAdd").prop("disabled", false);
                    this.checkamount();
                }
                else
                    $("#submitAdd").prop("disabled", true);

            } else {
                swal("Already Exists");
            }
        }
        else if (Mode == 2) {
            this.voucherDetails.splice(idx, 1);
            this.checkamount();
        }
        else {

            for (let j = 0; j <= this.accounts.length; j++) {
                if (this.accounts[j].id == i.accounT_CODE) {
                    this.accounT_CODE = this.accounts[j].id;
                    break;
                }
            }
            console.log(i);
            i.edit_Mode = true;
        }

        if (Mode == 1) {
            $("#AddNewItemRow").hide();
            this.EditItemButton = 'disabled';
            this.RemoveItemButton = 'disabled';

        }
        else {
            $("#AddNewItemRow").show();
            this.EditItemButton = '';
            this.RemoveItemButton = '';
            //this.textboxItemEditFlag = false;

        }
    }
    //updateItem 
    updateItem(i: voucherDetails, accounT_CODE: any, accounT_TITLE: any) {
        i.accounT_CODE = accounT_CODE;
        i.accounT_TITLE = accounT_TITLE;
    }
    //addGrid
    addGrid(accounT_CODE: any, accounT_TITLE: any, particulars: any, cosT_CENTER_CODE: any, debit: any, credit: any) {
        if (this.accounT_CODE > 0) {
            if (debit > 0 || credit > 0) {
                var flag = false;
                if (this.voucherDetails.length > 0) {
                    for (var count = 0; count < this.voucherDetails.length; count++) {

                        if (this.voucherDetails[count].accounT_CODE == accounT_CODE) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag == false) {
                    this.voucherDetails.push(new voucherDetails(0, accounT_CODE, accounT_TITLE, debit, credit, particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, this.cosT_CENTER_TYPE, this.currencY_CODE, '', '', '', '', 0,'',0));
                    this.editMode = false;
                    this.accounT_CODE = 0;
                    this.accounT_TITLE = '';
                    this.particulars = '';
                }
                else {
                    swal("Already Exists");
                }
                $("#submitAdd").prop("disabled", false);
                $("#txt").focus();
                this.debit = 0;
                this.credit = 0;
                $("#Credit").prop("disabled", false);
                $("#Debit").prop("disabled", false);
                //this.scrollToBottom();


                if (this.TotalDebit() != "0.00" && this.TotalDebit() != "0") {
                    $("#submitAdd").prop("disabled", false);
                    this.checkamount();
                }
                else
                    $("#submitAdd").prop("disabled", true);




            }
            else {
                swal("Voucher must be greater then 0.");
            }
        }
        else
            swal('Select Account Code!')

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
    //getDetailsByID
    getDetailsByID(voucher_ID, content) {
        this.open(content);
        if(this.permissionUtility.PermissionView=='')
        {
            this.submitAdd='none';
            this.submitUpdate='none';
        }
        $("#viewRDLC").prop("disabled", false);
        this.service.getBPDetailsByID(voucher_ID)
            .subscribe((o: voucher) => {
                console.log(o);
                this.voucheR_ID = o.voucher_ID;
                this.voucheR_DATE.setDate(o.voucheR_DATE);
                this.chequE_DATE.setDate(o.chequE_DATE);
                this.officE_CODE = o.officE_CODE;
                this.remarks = o.remarks;
                this.chequE_NO = o.chequE_NO;
                this.amount = o.net_Paied;
                this.payto = o.pay_To;
                this.voucherDetails = o.voucherDetails;
              sessionStorage.setItem('ID', this.voucheR_ID);
                //Set Account NO
                if(!(this.accounts=== undefined))
                {
                    if (this.accounts.length > 0) {
                        for (let i = 0; i < this.accounts.length; i++)
                            if (this.accounts[i].id == o.voucherDetails[0].accounT_CODE) {
                                this.accounT_TITLE = this.accounts[i].text;
                                break;
                            }
                    }
                }

                this.bankAccounts = [];
                this.service.getBankAccounts(this.officE_CODE)
                    .subscribe(response => {
                        this.isLoading = false;
                        if (response.json() != null) {
                            this.bankAccounts = (response.json());
                            //if (!this.mode) {

                                var bankac=this.bankAccounts.filter(f=>f.bank_Acct_No==o.bank_Acct_No);
                                if(bankac.length>0){
                                this.bank_Acct_No = bankac[0].bank_Acct_No;
                                this.bank_Acct_TITLE = bankac[0].bank_Acct_TITLE;
                                } 
                            //}
                            this.chequeNos = [];
                            this.isLoading =true;
                            this.service.getChequeNo( this.bank_Acct_No, "Open", true)
                                .subscribe(response => {
                                    this.isLoading = false;
                                    if (response.json() != null) {
                                        this.chequeNos = (response.json()); 
                                        this.chequE_NO =  o.chequE_NO;
                                        $("#AddNewItemRow").show();
                                        $("#submitAdd").prop("disabled", false);
                                    }
                                    else if (!this.mode) {
                                        $("#AddNewItemRow").hide();
                                        $("#submitAdd").prop("disabled", true);
                                        //swal("No Cheque Book Exist!")
                                    }
        
        
                                });
        
        
                        }
                        else {
                            swal("No Bank Account Exist!")
                            $("#submitAdd").prop("disabled", true);
                        }
                    });


              sessionStorage.setItem('provisional', "0");
              sessionStorage.setItem('cancelled', "0");

                this.service.getOffices(o.officE_CODE)
                    .subscribe(response => {
                        this.offices = (response.json());
                        this.officE_CODE = o.officE_CODE;
                        this.bank_Acct_No = o.bank_Acct_No;
                    });
 
                var SystemGeneratedBit = o.customer;
                localStorage.setItem('SystemGeneratedBit',JSON.stringify(SystemGeneratedBit));
                var VoucherStatus = o.vendor;
 
                if (SystemGeneratedBit==true) { //System Generated VOUCHER Not Editabled
                    $("#AddNewItemRow").hide();
                    this.EditItemButton = 'none';
                    this.RemoveItemButton = 'none';
                    $("#submitUpdate").hide();
                    $("#cancelBtn").prop('disabled',true);
                }
                else { //FIS GENERATED VOUCHER Editabled
                    $("#AddNewItemRow").show();
                    this.EditItemButton = '';
                    this.RemoveItemButton = '';
                    if(this.permissionUtility.PermissionEdit=='')
                    $("#submitUpdate").show();
                }
                if (VoucherStatus == 1) { //Voucher Saved      
          
                    if(this.permissionUtility.PermissionEdit=='' || this.permissionUtility.PermissionEdit==" "){            
                      $("#cancelBtn").show();
                      $("#approveBtn").show();
                    }
                      sessionStorage.setItem('provisional', "1");
                    }      
                    else if (VoucherStatus == 3) {//Voucher Approved
                      $("#AddNewItemRow").hide();
                      this.EditItemButton = 'none';
                      this.RemoveItemButton = 'none';
                      $("#submitUpdate").hide();
                      if(this.permissionUtility.PermissionEdit=='' || this.permissionUtility.PermissionEdit==" ")
                     { $("#cancelBtn").show();
                      $("#postBtn").show();
                     }
                    }
            
                    else if (VoucherStatus == 2) {//Voucher Cancelled
                      $("#AddNewItemRow").hide();
                      this.EditItemButton = 'none';
                      this.RemoveItemButton = 'none';
                      $("#submitUpdate").hide();
                      sessionStorage.setItem('cancelled', "1");
                    }
                    else if (VoucherStatus == 4) {//Voucher Posted
                      $("#AddNewItemRow").hide();
                      this.EditItemButton = 'none';
                      this.RemoveItemButton = 'none';
                      $("#submitUpdate").hide();
            
                    } 
            });

        $("#lblCheque").show();
        $("#ddlCheque").hide();
        this.mode = true;

    }
    //onNavigate
    onNavigate(pth) {
        sessionStorage.setItem('ReportView', "1");
        if (pth == "/bpv-rpt-rdlc")
            sessionStorage.setItem('reportID', "2");
       // sessionStorage.setItem('ID', this.voucheR_ID);
        window.open(pth, "_blank");
    }
    //saveVoucher
    saveVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any) {
        if(this.voucheR_DATE.model===null  ){
            swal("Payment Date Is Empty");
           return;
         }
         else if(this.voucheR_DATE.model!=null ){ 
           if(this.voucheR_DATE.model.day==undefined || this.voucheR_DATE.model.month==undefined || this.voucheR_DATE.model.year==undefined)
         {  swal("Payment Date Is Invalid");
           return;
         }
         }
        this.isLoading =true;
        if (debit > 0 || credit > 0) {
            if(this.payto.trim()!=""){
              
            if (this.amount == this.TotalDebit()) {
                this.accounT_CODE = this.bank_Acct_No;
                this.accounT_TITLE = this.bank_Acct_TITLE;
                debit = 0;
                this.voucherDetails.push(new voucherDetails(0, this.accounT_CODE, this.accounT_TITLE, debit, credit, this.particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, this.cosT_CENTER_TYPE, 1, '', '', '', '', 0,'',0));

                $("#submitAdd").prop("disabled", true);
                var order = new voucher(0, 0, this.voucheR_DATE.getDateFinal(), this.officE_CODE, "", "", this.chequE_NO, this.chequE_DATE.getDateFinal(), this.payto, 0, this.voucheR_TYPE_CODE, credit, credit, 1, this.bank_Acct_No, this.Page_Code, this.voucher_GUID, this.pay_Method, "", "", this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.voucherDetails);
                this.service.saveVoucher(order).then(
                    (response) => {
                        this.isLoading = false;
                        this.voucheRID = response;
                        console.log(this.voucheRID);
                        if (this.isView == true) {
                            sessionStorage.setItem('ID', this.voucheRID);
                            this.onNavigate('/bpv-rpt-rdlc');
                        }

                        this.geBankPaymentVouchers(this.ID);
                        this.modalReference.close();
                        console.log(response);
                    },
                    (error) => console.log(error))
            }
            else {
                swal('Paid Amount Not Equal TO Voucher Total')
            }
         
        }else
        {
            swal("payto must be defined");
            this.payto = "";
        }
        
        this.isLoading=false;
        }
        else {
            this.isLoading = false;
            swal("Voucher must be greater then 0.");
        }
    }
    //updateVoucher
    updateVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any) {
        if (debit > 0 || credit > 0) {
            this.accounT_CODE = this.bank_Acct_No;
            this.accounT_TITLE = this.bank_Acct_TITLE;
            debit = 0;

            this.voucherDetails.push(new voucherDetails(0, this.accounT_CODE, this.accounT_TITLE, 0, credit, this.particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, 'O', 1, '', '', '', '', 0,'',0));

            var order = new voucher(this.voucheR_ID, 0, this.voucheR_DATE.getDateFinal(), this.officE_CODE, "", "", this.chequE_NO, this.chequE_DATE.getDateFinal(), this.payto, 0, this.voucheR_TYPE_CODE, credit, credit, 1, this.bank_Acct_No, this.Page_Code, this.voucher_GUID, this.pay_Method, "", "", this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.voucherDetails);
            this.service.updateVoucher(order).then(
                (response) => {
                    this.geBankPaymentVouchers(this.ID);
                    this.modalReference.close();
                    console.log(response);
                },
                (error) => console.log(error))
        }
        else {
            swal("Voucher must be greater then 0.");
        }
    }
    //open Modal
    open(content) {
        this.modalReference = this.modalService.open(content, { size: 'xlg' });
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        this.clearFields();
        $("#viewRDLC").prop("disabled", true);

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
    //changeVoucherStatus
    changeVoucherStatus(Status) {
        if (Status == 2) {
            swal({
                title: "Do you really want to Cancel?",
                text: "Once cancelled, you will not be able to recover this Voucher!",
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

                        if(!JSON.stringify(localStorage.getItem('SystemGeneratedBit'))){
                        this.service.changeVoucherStatus(this.voucheR_ID, Status, this.logedInUserID)
                            .subscribe(response => {

                                var list = (response.json());
                                this.geBankPaymentVouchers('');
                                this.modalReference.close();
                            });
                        }else
                        swal("System generated voucher can not be canceld")
                    }

                });
        }
        else if (Status == 3) {
            swal({
                title: "Do you really want to Approve?",
                text: "Once Approved, you will not be able to edit this Voucher!",
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


                        this.service.changeVoucherStatus(this.voucheR_ID, Status, this.logedInUserID)
                            .subscribe(response => {

                                var list = (response.json());
                                this.geBankPaymentVouchers('');
                                this.modalReference.close();
                            });
                    }

                });
        }
        else if (Status == 4) {
            swal({
                title: "Do you really want to Post?",
                text: "Once Posted, you will not be able to cancel this Voucher!",
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


                        this.service.changeVoucherStatus(this.voucheR_ID, Status, this.logedInUserID)
                            .subscribe(response => {

                                var list = (response.json());
                                this.geBankPaymentVouchers('');
                                this.modalReference.close();
                            });
                    }

                });
        }

    }
    //checkamount
    checkamount() {
        if (this.amount > 0 && this.amount == this.TotalDebit()) {
            $("#submitAdd").prop("disabled", false);
            $("#submitUpdate").prop("disabled", false);
        }
        else {
            $("#submitAdd").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
        }
    }

}
