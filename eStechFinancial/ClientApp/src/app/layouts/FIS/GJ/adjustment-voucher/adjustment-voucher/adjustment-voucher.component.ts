import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { JournalVoucherService, voucher, voucherDetails, cDate, NgbDateFRParserFormatter, DayEndService, FiscalYearService, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
    selector: 'adjustment-voucher',
    templateUrl: './adjustment-voucher.component.html',
    styleUrls: ['./adjustment-voucher.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AdjustmentVoucherComponent implements OnInit {
     
    logedInUserID: any = 1;
    UserSessionID: any = 0;
    public permissionUtility:PermissionUtility=new PermissionUtility();
    p: number = 1;
    modalReference: NgbModalRef;
    vouchers: any[];
    offices: any[];
    costCenter: any[];
    closeResult: string;
    officE_CODE: any = 1;
    officE_NAME: any;
    abbr: any;
    cosT_CENTER_CODE: any = 1;
    mode: any = 0;
    voucheR_ID: any = "";
    dayEndDetail: any[] = [];
    public voucheR_DATE = new cDate();
    public fiscalOpenDay = new cDate();
    public currentDate = new cDate();
    public startDate = new cDate();
    public endDate = new cDate();
    remarks: any;
    public accounT_CODE: any = 1;
    public accounT_TITLE: any;
    debit: any = 0;
    credit: any = 0;
    accounts: Array<Select2OptionData>;
    accounts1: Array<Select2OptionData>;
    voucherDetails: any[];
    editMode = false;
    guid: any = "";
    Page_Code: any = 940013;
    voucher_GUID: any;
    ID: any = "";
    particulars: any = "";
    fiscalYear: any[] = [];
    public enD_DT = new cDate();
    fiN_YR: any;
    status: any;

    isLoading: any = false;
    EditItemButton: any = '';
    RemoveItemButton: any = '';
    isView: any = true;

    userOffice: any;
    userPrivilegedOffice: any;
    userCurrentOffice: any;
    userCurrentWarehouse: any;

    creditDisable: any = false;
    debitDisable: any = false;

    constructor(private service: JournalVoucherService, private ngbDateParserFormatter: NgbDateParserFormatter, private LoginService: LoginService,
        private DayEndService: DayEndService, private FiscalYearService: FiscalYearService, private modalService: NgbModal) {
        this.voucherDetails = new Array<voucherDetails>();
        this.logedInUserID = this.LoginService.getSession('user_ID');
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    }
    ngOnInit() {
        this.getAdjustmentVouchers(this.ID);
        this.getCurrentDay();
        this.permissionUtility.setPagePermissions(940013);
         
    }
     
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

    if (this.voucheR_DATE.getStandardDate() < this.startDate.getStandardDate()
      || this.voucheR_DATE.getStandardDate() < this.fiscalOpenDay.getStandardDate()
      || this.voucheR_DATE.getStandardDate() > this.currentDate.getStandardDate()
    )
      this.voucheR_DATE.setDate(this.currentDate.getDateFinal());
  }
    //getCurrentFiscalYear
    getCurrentFiscalYear() {
        this.FiscalYearService.getCurrentFiscalYear()
            .subscribe(response => {
                this.fiscalYear = (response.json());              
                this.fiN_YR = this.fiscalYear[0].fiN_YR;
                this.enD_DT.setDate(this.fiscalYear[0].enD_DT);
                this.voucheR_DATE.setDate(this.fiscalYear[0].enD_DT);
                this.service.IfExists(this.fiN_YR)
                    .subscribe(response => {
                        this.status = (response.json());
                        if (this.status == true) {
                            $("#submitAdd").prop("disabled", false);
                        }
                        else {
                            $("#submitAdd").prop("disabled", true);
                        }
                    });
            });
    }
    //getAdjustmentVouchers
    getAdjustmentVouchers(value: string) {
        this.isLoading =true;
        this.service.getAdjustmentVouchers(value, this.userPrivilegedOffice)
            .subscribe(response => {
                if(response.json() !== null){
                    this.vouchers = (response.json());
                    this.isLoading = false;
                }
                else{
                    this.vouchers = [];
                    this.isLoading = false;
                }
                
            });
    }
    //getOffices
    getOffices() {
        this.service.getOffices(this.userPrivilegedOffice)
            .subscribe(response => {
                this.isLoading =true;
                if (response.json() != null) {
                    this.offices = (response.json());
                    this.officE_CODE = this.offices[0].officE_CODE;
                    this.officE_NAME = this.offices[0].officE_NAME;
                    this.cosT_CENTER_CODE = this.offices[0].cosT_CENTER_CODE;
                    this.abbr = this.offices[0].abbr;
                    this.isLoading = false;
                    this.cosT_CENTER_CODE = this.userCurrentOffice;
                    this.officE_CODE = this.userCurrentOffice;
                    this.getAccounts(this.officE_CODE);
                }
                else {
                    swal("No Office Exist!")
                    $("#submitAdd").prop("disabled", true);
                }
            });
    }
    //getChangeOffices
    getChangeOffices(officE_CODE) {
        this.service.getChangeOffices(officE_CODE)
            .subscribe(response => {
                if (response.json() != null) {
                    this.costCenter = (response.json());
                    this.cosT_CENTER_CODE = this.costCenter[0].cosT_CENTER_CODE;                    
                    this.abbr = this.costCenter[0].abbr;
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
                this.accounts = this.getDropdownList(response.json(), "accounT_CODE", "accounT_TITLE");
                this.accounT_CODE = this.accounts[0].id;
                this.accounT_TITLE = this.accounts[0].text;
                this.isLoading = false;
                //    console.log(response.json());
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
    }
    //clearFields
    clearFields() {
        this.mode = 0;
        this.remarks = "";
        $("#AddNewItemRow").show();
        this.EditItemButton = '';
        this.RemoveItemButton = '';

        this.getOffices();
        this.voucher_GUID = UUID.UUID();
        this.voucherDetails = [];
        this.getCurrentFiscalYear();

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
            $("#Debit").prop("disabled", false);
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
            $("#Credit").prop("disabled", false);
            $("#Debit").prop("disabled", true);
        }
    }
    //changeDC
    changeDC(credit, debit)
    {
        
        if(credit>0)
        {
            this.debitDisable = true;
            this.creditDisable = false;
        }
        else
        {
            this.debitDisable = false;
            this.creditDisable = true;
        }
       

    }
    //IfExists
    IfExists() {
        this.service.IfExists(this.fiN_YR)
            .subscribe(response => {
                this.status = (response.json());
                if (this.status == true) {
                    $("#submitAdd").prop("disabled", false);
                }
                else {
                    alert("1");
                    $("#submitAdd").prop("disabled", true);
                }
            });
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

            //if (flag == false) {      
            i.accounT_CODE = this.accounT_CODE;
            i.accounT_TITLE = this.accounT_TITLE;
            i.cosT_CENTER_TYPE = "O";
            i.edit_Mode = false;

            this.accounT_CODE = 0;
            this.accounT_TITLE = '';
            if (this.TotalDebit() == this.TotalCredit())
                $("#submitAdd").prop("disabled", false);
            else
                $("#submitAdd").prop("disabled", true);
            //} else {
            //  alert("Already Exists");
            //}
        }
        else if (Mode == 2) {

            this.voucherDetails.splice(idx, 1);
            if (this.TotalDebit() == this.TotalCredit()) {

                $("#submitAdd").prop("disabled", false);
                $("#submitUpdate").prop("disabled", false);
            }
            else {

                $("#submitAdd").prop("disabled", true);
                $("#submitUpdate").prop("disabled", true);
            }
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
            $("#Credit").prop("disabled", false);
            $("#Debit").prop("disabled", false);
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
        if (this.accounT_CODE != 0) {
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
                //if (flag == false) {
                this.voucherDetails.push(new voucherDetails(0, accounT_CODE, accounT_TITLE, debit, credit, particulars, 1, 1, this.cosT_CENTER_CODE, this.abbr, 'O', 1, '', '', '', '', 0,'',0));
                this.editMode = false;
                this.accounT_CODE = 0;
                this.accounT_TITLE = '';
                this.particulars = '';
                //}
                //else {
                //  alert("Already Exists");
                //}
                $("#submitAdd").prop("disabled", false);
                $("#txt").focus();
                this.debit = 0;
                this.credit = 0;
                $("#Credit").prop("disabled", false);
                $("#Debit").prop("disabled", false);
                //this.scrollToBottom();


                if (this.TotalDebit() == this.TotalCredit()) {

                    $("#submitAdd").prop("disabled", false);
                    $("#submitUpdate").prop("disabled", false);
                }
                else {

                    $("#submitAdd").prop("disabled", true);
                    $("#submitUpdate").prop("disabled", true);
                }
            }
            else {
                swal("Voucher must be greater then 0.");
            }
        }
        else
            swal("Select Account.");
    }
    // convert dropdown lables
    getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
        let ar: Array<any> = [];
        if (arr != null) {
            ar.push({
                id: 0,
                text: ""
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
    //getDetailsByID
    getDetailsByID(voucher_ID, content) {
        this.open(content);       
        this.mode = true;
        this.service.getDetailsByID(voucher_ID)
            .subscribe((o: voucher) => {
                console.log('--------'+ o);
                this.voucheR_ID = o.voucher_ID;
                this.voucheR_DATE.setDate(o.voucheR_DATE);
                this.officE_CODE = o.officE_CODE;
                this.remarks = o.remarks;
                this.voucherDetails = o.voucherDetails;

                this.service.getOffices(this.userPrivilegedOffice)
                    .subscribe(response => {
                        this.offices = (response.json());
                    });

               
                $("#AddNewItemRow").hide();
                this.EditItemButton = 'none';
                this.RemoveItemButton = 'none';
                $("#submitAdd").hide(); 
                if(this.permissionUtility.PermissionEdit==" " || this.permissionUtility.PermissionEdit==''){
                $("#submitUpdate").show();}

            });

    }
    //saveVoucher
    saveVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any) {
        this.isLoading =true;
        var order = new voucher(0, 0, this.voucheR_DATE.getDateFinal(), this.officE_CODE, "", "", "", "", null, 0, 5, debit, credit, 1, "", this.Page_Code, this.voucher_GUID, "", "", "", this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.voucherDetails);


        if (debit > 0 || credit > 0) {
            this.service.saveVoucher(order).then(
                (response) => {
                    this.isLoading = false;
                    this.getAdjustmentVouchers(this.ID);
                    this.modalReference.close();
                    console.log(response);
                },
                (error) => console.log(error))
        }
        else {
            swal("Voucher must be greater then 0.");
        }
    }
    //updateVoucher
    updateVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any) {
        this.isLoading =true;
        var order = new voucher(this.voucheR_ID, 0, this.voucheR_DATE.getDateFinal(), this.officE_CODE, "", "", "", "", null, 0, 5, debit, credit, 1, "", this.Page_Code, this.voucher_GUID, "", "", "", this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.voucherDetails);

        if (debit > 0 || credit > 0) {
            this.service.updateVoucher(order).then(
                (response) => {
                    this.isLoading = false;
                    this.getAdjustmentVouchers(this.ID);
                    this.modalReference.close();
                    console.log(response);
                },
                (error) => console.log(error))
        }
        else {
            swal("Voucher must be greater then 0.");
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
        $("#submitAdd").show();
        $("#submitUpdate").hide();
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
