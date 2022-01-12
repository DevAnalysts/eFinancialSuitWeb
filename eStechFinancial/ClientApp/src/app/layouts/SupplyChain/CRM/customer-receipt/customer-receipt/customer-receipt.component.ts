import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomerReceiptService, LoginService, DayEndService, customer, FileAttachmentService, salePayment, customerPaymentDetails, cDate, NgbDateFRParserFormatter, PermissionUtility, SaleOrderService, SmsAlertService, SMSMessage, CommonUtility } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router'; 
import { Validation } from '@shared/common/validation';

@Component({
    selector: 'customer-receipt',
    templateUrl: './customer-receipt.component.html',
    styleUrls: ['./customer-receipt.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CustomerReceiptComponent implements OnInit {
    ////////////////////////////////////////
    public commonUtility: CommonUtility = new CommonUtility();

    logedInUserID: any = 1;
    UserSessionID: any = 0;

    ////////////////////////////////////////
    @ViewChild('dvScroll') private myScrollContainer: ElementRef;
    //Member Variables
    sms: SMSMessage;

    p: number = 1;
    modalReference: NgbModalRef;
    getPaymentDetails: any[] = [];
    customers: Array<Select2OptionData> = [];
    getContacts: any[] = [];
    getPaymentMethods: any[] = [];
    bankAccounts: any;
    banks: any;
    paymentDetailValues: any[] = [];
    paymentDetailsByID: any;
    customer_ID: any;
    sale_Payment_ID: any = 0;
    priviledged_Offices: any = '';
    mode: any = 0;
    btnmode: any = 0;
    total_Cost: any = 0;
    total_Discount: any = 0;
    freight_Chrgs: any = 0;
    total_Amount: any = 0;
    balance_Amount: any = 0;
    hidden_Balance: any = 0;
    prepaid: any = 0;
    paid_Amount: any = 0;
    customerPaymentDetail: any[] = [];
    customerPaymentDetails: any[] = [];
    remarks: any;
    guid: any;
    reference_No:any;
    public payment_Date = new cDate();
    public dayEndDate = new cDate();
    public chequeDate = new cDate();
    showchequedate: any = 'none';
    isLoading: any = false;
    color = '#0094ff';
    ID: any;
    accounT_NO: any;
    bank: any;
    bankCode: any;
    getChequeNumbers: any;
    method_ID: any = 1;
    chequeNo: any;
    openingBalance: any = 0.00;
    totalSales: any = 0.00;
    totalReturns: any = 0.00;
    totalReceipts: any = 0.00;
    paymentTax: any = 0.00;
    paymentDiscount: any = 0.00;
    totalPaymentTax: any = 0.00;
    totalPaymentDiscount: any = 0.00;
    totalTPaymentTax: any = 0.00;
    totalTPaymentDiscount: any = 0.00;
    netPayable: any = 0.00;
    advanceAmount: any = 0.00;
    //End Member Variables
    payment_ID: any = "";
    closeResult: string;
    selectedAll: any;
    chk: any = false;
    paymentStatus: any[] = [];
    status: any;
    alerts: Array<any> = [];
    //End Member Variables
    paid: any = 0;
    cancelReturn: any;
    actionID: any = 6;
    dayEndDetail: any[] = [];
    guidOrder: boolean;
    settingReceiptInvoiceWise: any;
    allowAvancePayment: any;
    allowAvance: any = false;
    allowAvanceAdjustment: any = false;
    adjust: boolean =false;

    allowTax: any;
    allowDiscount: any;
    areaenable: any = 0;
    areashow: any = 'none';
    area: any[] = [];
    areacode: any = 1;
    areaname: any = ''
    return_Amount: any = 0.00;
    showRA: any = '';
    savemoreFlag: any = false;
    userOffice: any;
    userPrivilegedOffice: any;
    userCurrentOffice: any;
    userCurrentWarehouse: any;
    PermissionDropdown: any = 'none';
    PermissionItem1: any = 'none';
    public permissionUtility: PermissionUtility = new PermissionUtility();
    public valid:Validation=new Validation();

    constructor(
        private oservice: SaleOrderService,
        private smsService: SmsAlertService,
        private service: CustomerReceiptService, private fileservice: FileAttachmentService, private DayEndService: DayEndService, private modalService: NgbModal, private LoginService: LoginService, public router: Router) {
        this.customerPaymentDetails = new Array<customerPaymentDetails>();
        this.userOffice = this.LoginService.getSession('userOffice');
        this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
        this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
        this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');

        this.alerts.push(
            {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is being used...',
            });
    }
    //ngOnInit
    ngOnInit() {
        this.getCurrentDay();
        this.logedInUserID = this.LoginService.getSession('user_ID');
        ////////////////////////Set Name From Session Storage///////////////////////////
        this.permissionUtility.setPagePermissions(140006);
        this.permissionUtility.setPermissionItem1(140015);
        ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
        this.settingReceiptInvoiceWise = sessionStorage.getItem('settingReceiptInvoiceWise');
        this.searchPaymentDetails('');
        this.getAreaEnableStatus();
        this.showReturnAmount();
    }
    //getCurrentDay
    getCurrentDay() {
        this.payment_Date.setDate(this.LoginService.getSession('currentOpenDay'));
        this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    }
    //changePaymentDate
    changePaymentDate(pO_payment_DateDate) {
        if (this.payment_Date.getStandardDate() < this.dayEndDate.getStandardDate())
            this.payment_Date.setDate(this.dayEndDate.getDateFinal());
        this.customerPaymentDetail = [];
        if (this.mode == false) {
            this.getInvoiceDetails(this.customer_ID, 0, this.mode);
        }
    }
    //searchPaymentDetails
    searchPaymentDetails(value: string) {
        this.service.searchPaymentDetails(value, this.userPrivilegedOffice)
            .subscribe(response => {
                if (response.json() !== null) {
                    this.getPaymentDetails = (response.json());
                } else {
                    this.getPaymentDetails = [];
                    this.isLoading = false;
                }

            });
    }
    //getAreaEnableStatus
    getAreaEnableStatus() {
        if (this.LoginService.getSession('EnableAreaonSO') != '1') {
            this.areaenable = 0;
        }
        else {
            this.areaenable = 1;
        }
    }
    getBanks() {
        this.isLoading = true;
        this.service.getBanks()
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null && !this.mode) {
                    this.banks = (response.json());
                    this.bank = this.banks[0].banK_CODE;
                    this.bankCode = this.banks[0].banK_CODE;
                    //console.log(this.banks);
                }
            });
    }
    //setAreaEnableStatus
    setAreaEnableStatus() {
        this.areashow = 'none';
        //alert(this.areaenable);
        if (this.areaenable != 1) {
            this.getCustomers(0);
            this.areacode = 1;
        }
        else {
            this.getArea();
            this.areashow = '';
        }
    }
    //getArea 
    getArea() {
        this.isLoading = true;
        this.service.getArea()
            .subscribe(response => {
                this.area = (response.json());
                if (this.area != null) {
                    if (sessionStorage.getItem("AreaID") != '') {
                        this.areacode = sessionStorage.getItem("AreaID");
                    }
                    else {
                        this.areacode = this.area[0].areacode;
                        this.areaname = this.area[0].areaname;
                    }
                    this.getCustomers(this.areacode);
                }

            });

    }
    //getCustomers
    getCustomers(AreaID) {
        //alert(AreaID);

        if (!this.savemoreFlag) {

            this.customer_ID = 0;
            this.customers = [];
            this.getContacts = [];
            this.customerPaymentDetail = [];
            this.openingBalance = 0;
            this.totalSales = 0;
            this.totalReturns = 0;
            this.totalReceipts = 0;
            this.netPayable = 0;
            this.totalTPaymentTax = 0;
            this.totalTPaymentDiscount = 0;
        }
        this.isLoading = true;
        this.service.getCustomers(AreaID, this.userCurrentOffice, this.sale_Payment_ID, this.allowAvance, this.mode)
            .subscribe(response => {
                if (response.json() != null) {
                    this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
                    this.customer_ID = this.customers[0].id;
                    this.savemoreFlag = false;
                    this.service.getContacts(this.customer_ID)
                        .subscribe(response => {
                            if (response.json() != null) {
                                this.getContacts = (response.json());

                                this.openingBalance = parseFloat(this.getContacts[0].openingBalance);
                                this.totalSales = parseFloat(this.getContacts[0].totalSales);
                                this.totalReturns = parseFloat(this.getContacts[0].totalReturns);
                                this.totalReceipts = parseFloat(this.getContacts[0].totalReceipts);
                                //if (this.mode == true) {
                                this.totalTPaymentTax = parseFloat(this.getContacts[0].totalPaymentTax);
                                this.totalTPaymentDiscount = parseFloat(this.getContacts[0].totalPaymentDiscount);
                                //}
                                //else {
                                //  this.totalTPaymentTax = 0;
                                //  this.totalTPaymentDiscount = 0;
                                //}
                                this.netPayable = parseFloat(this.getContacts[0].netPayable);
                                this.advanceAmount = 0;
                                //this.netPayable = (parseFloat(this.getContacts[0].openingBalance) + parseFloat(this.getContacts[0].totalSales) - parseFloat(this.getContacts[0].totalReturns) - parseFloat(this.getContacts[0].totalReceipts) - parseFloat(this.getContacts[0].totalPaymentTax) - parseFloat(this.getContacts[0].totalPaymentDiscount)).toFixed(2);
                                if (this.netPayable < 0) {
                                    this.advanceAmount = -(this.netPayable);
                                    this.netPayable = 0;
                                }
                                if (this.mode == false) {
                                    this.getInvoiceDetails(this.customer_ID, 0, this.mode);
                                }
                                this.isLoading = false;
                            }
                            else {
                                $("#submitAdd").prop("disabled", false);
                                $("#submitAddMore").prop("disabled", false);
                                this.isLoading = false;
                            }
                        });
                }
                else {
                    $("#submitAdd").prop("disabled", true);
                    $("#submitAddMore").prop("disabled", true);
                }
                this.isLoading = false;

            });
    }
    //getDropdownList
    getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
        let ar: Array<any> = [];

        if (sessionStorage.getItem("EnableEmptyRow") == '1' && this.btnmode == true && this.savemoreFlag == false) {
            ar.push({
                id: '0',
                text: ''
            });
        }

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
    //changeContacts
    changeContacts(e: any) {
        //this.paymentTax = 0;
        //this.paymentDiscount = 0;
        if (this.mode == false) {
            this.customerPaymentDetail = [];
            this.customer_ID = e;
        }
        else {

        }

        this.service.getContacts(this.customer_ID)
            .subscribe(response => {

                //this.paid_Amount = 0;
                if (response.json() != null) {
                    this.getContacts = (response.json());

                    this.openingBalance = parseFloat(this.getContacts[0].openingBalance);
                    this.totalSales = parseFloat(this.getContacts[0].totalSales);
                    this.totalReturns = parseFloat(this.getContacts[0].totalReturns);
                    this.totalReceipts = parseFloat(this.getContacts[0].totalReceipts);
                    //if (this.mode == true) {
                    this.totalTPaymentTax = parseFloat(this.getContacts[0].totalPaymentTax);
                    this.totalTPaymentDiscount = parseFloat(this.getContacts[0].totalPaymentDiscount);
                    //}
                    //else {
                    //  this.totalTPaymentTax = 0;
                    //  this.totalTPaymentDiscount = 0;
                    //}
                    this.netPayable = parseFloat(this.getContacts[0].netPayable);
                    this.advanceAmount = 0;
                    //this.netPayable = (parseFloat(this.getContacts[0].openingBalance) + parseFloat(this.getContacts[0].totalSales) - parseFloat(this.getContacts[0].totalReturns) - parseFloat(this.getContacts[0].totalReceipts) - parseFloat(this.getContacts[0].totalPaymentTax) - parseFloat(this.getContacts[0].totalPaymentDiscount)).toFixed(2);
                    if (this.netPayable < 0) {
                        this.advanceAmount = -(this.netPayable);
                        this.netPayable = 0;
                    }
                    if (this.mode == false) {
                        this.getInvoiceDetails(this.customer_ID, 0, this.mode);
                        $("#submitAdd").prop("disabled", false);
                        $("#submitAddMore").prop("disabled", false);
                    }
                }
            });
    }
    //paymentMethod
    paymentMethod() {
        //getPaymentMethods
        this.service.getPaymentMethods()
            .subscribe(response => {
                if (response.json() != null) {
                    this.getPaymentMethods = (response.json());
                    this.method_ID = this.getPaymentMethods[0].method_ID;
                    this.changePaymentMethod(this.method_ID);
                }
            });
    }
    //changePaymentMethod
    changePaymentMethod(method_ID) {
        this.getBankAccounts();
        if (method_ID == 1) {
            $("#lblAccount").show();
            $("#lblAccountTitle").show();
            $("#lblCheque").hide();
            $("#lblChequeTitle").hide();
            $("#lblBank").hide();
            $("#lblBankTitle").hide();

            this.showchequedate = 'none';
            this.bankCode = 0;
        }
        else {
            $("#lblAccount").show();
            $("#lblAccountTitle").show();
            $("#lblBank").show();
            $("#lblBankTitle").show();
            $("#lblCheque").show();
            $("#lblChequeTitle").show();
            this.getBanks();
            this.showchequedate = '';
        }
    }
    //getBankAccounts
    getBankAccounts() {
        this.isLoading = true;
        this.service.getBankAccounts(this.method_ID)
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null && !this.mode) {
                    this.bankAccounts = (response.json());
                    this.accounT_NO = this.bankAccounts[0].accounT_NO;
                    this.changeAccountNo(this.accounT_NO);
                    // console.log(response.json());
                }
            });
    }
    //changeAccountNo
    changeAccountNo(accountCode) {
        if (this.method_ID != 1) {
            this.isLoading = true;
            this.service.getChequeNumbers(accountCode)
                .subscribe(response => {
                    this.isLoading = false;
                    if (response.json() != null) {
                        this.getChequeNumbers = (response.json());
                        if (this.getChequeNumbers != null) {
                            //this.chequeNo = this.getChequeNumbers[0].chequE_NO;
                        }
                        // console.log(response.json());
                    }
                });
        }
    }
    //getInvoiceDetails
    getInvoiceDetails(customer_ID, sale_Payment_ID, mode) {
        this.isLoading = true;
        this.service.getInvoiceDetails(this.customer_ID, sale_Payment_ID, this.payment_Date.getDateFinal(), this.priviledged_Offices, mode)
            .subscribe(response => {
                if (response.json() != null) {
                    console.log(response.json());
                    this.customerPaymentDetail = (response.json());
                    console.log(response.json());

                    for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                        this.paymentTax += this.customerPaymentDetail[i].paymentTax;
                        this.paymentDiscount += this.customerPaymentDetail[i].paymentDiscount;
                    }

                    if (this.mode == true) {
                        if (this.ReturnAmountFlag && !this.btnmode) {
                            this.paid = this.paid_Amount;
                            //this.paymentTax = this.totalTPaymentTax
                            //this.paymentDiscount = this.totalTPaymentDiscount
                        }
                        else {
                            //this.paid = this.purchasePaymentDetail[0].invoice_Amount;
                            for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                                this.paid += (this.customerPaymentDetail[i].invoice_Amount);
                                this.totalPaymentTax += this.customerPaymentDetail[i].paymentTax;
                                this.totalPaymentDiscount += this.customerPaymentDetail[i].paymentDiscount;
                            }
                        }
                    }
                }
                this.isLoading = false;
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
            });
    }
    //getPaymentDetailValues
    getPaymentDetailValues(sale_Payment_ID) {
        this.editMode();
        this.service.getPaymentDetailValues(this.sale_Payment_ID)
            .subscribe(response => {
                if (response.json() != null) {
                    this.paymentDetailValues = (response.json());
                    //   console.log(response.json());
                }

            });
    }
    //getPaymentDetailsByID
    getPaymentDetailsByID(sale_Payment_ID) {
        this.editMode();
        this.ID = sale_Payment_ID;
        this.service.getPaymentDetailsByID(sale_Payment_ID)
            .subscribe(response => {
                if (response.json() != null) {
                    this.getPaymentDetailsByID = (response.json());
                    this.customer_ID = this.getPaymentDetailsByID[0].customer_ID;
                    this.remarks = this.getPaymentDetailsByID[0].remarks;

                    this.service.getCustomers(this.areacode, this.priviledged_Offices, this.sale_Payment_ID, this.allowAvance, this.mode)
                        .subscribe(response => {
                            if (response.json() != null) {
                                this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
                                this.customer_ID = this.getPaymentDetailsByID[0].customer_ID;
                                this.changeContacts(this.customer_ID);
                                this.getInvoiceDetails(this.customer_ID, 0, this.mode)
                            }
                        });
                }
                //   console.log(response.json());
            });
    }
    //ClearValues
    clearFields() {
        //Member Varialbes 
        this.mode = false;
        this.savemoreFlag = false;
        this.priviledged_Offices = this.userPrivilegedOffice;
        this.btnmode = true;
        this.total_Cost = 0;
        this.total_Discount = 0;
        this.freight_Chrgs = 0;
        this.total_Amount = 0;
        this.balance_Amount = 0;
        this.hidden_Balance = 0;
        this.prepaid = 0;
        this.paid_Amount = 0;
        this.adjust = false;
        this.allowAvance = false;
        this.allowAvanceAdjustment = false;
        this.paid = 0;
        this.reference_No='';
        this.openingBalance = 0.00;
        this.totalSales = 0.00;
        this.totalReturns = 0.00;
        this.totalReceipts = 0.00;
        this.paymentTax = 0.00;
        this.paymentDiscount = 0.00;
        this.totalPaymentTax = 0.00;
        this.totalPaymentDiscount = 0.00;
        this.totalTPaymentTax = 0.00;
        this.totalTPaymentDiscount = 0.00;
        this.netPayable = 0.00;
        this.advanceAmount = 0.00;
        this.chequeNo = '';
        this.remarks = "";

        // this.getPaymentDetails = [];
        this.paymentDetailValues = [];
        this.customerPaymentDetail = [];
        this.customerPaymentDetails = [];
    }
    //editMode
    editMode() {
        this.mode = true;
        $("#pnlAdd").show();
        $("#pnlDetail").hide();
        $("#submitAdd").hide();
        $("#submitAddMore").hide();
        $("#submitUpdate").show();

    }
    //getTotals
    getTotals() {
        this.total_Cost = 0;
        this.total_Discount = 0;
        this.freight_Chrgs = 0;
        this.total_Amount = 0;
        this.balance_Amount = 0;
        // this.paid_Amount = 0;
        for (var count = 0; count < this.customerPaymentDetails.length; count++) {
            if (this.customerPaymentDetails[count].paid_Amount > 0) {
                this.total_Cost += this.customerPaymentDetails[count].total_Cost;
                this.total_Discount += this.customerPaymentDetails[count].total_Discount;
                this.freight_Chrgs += this.customerPaymentDetails[count].freight_Chrgs;
                this.total_Amount += this.customerPaymentDetails[count].total_Amount;
                this.balance_Amount += this.customerPaymentDetails[count].total_Amount - this.customerPaymentDetails[count].paid_Amount;

            }
            //$scope.Paid_Amount= $scope.InvoiceDetails[count].Paid_Amount
        }

    }
    //selectAll
    selectAll() {
        for (var i = 0; i < this.customerPaymentDetail.length; i++) {
            this.customerPaymentDetail[i].selected = this.selectedAll;

            var selectedAmount = 0;
            for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                this.chk = this.customerPaymentDetail[i].selected;
                if (this.chk == true) {

                    if (this.customerPaymentDetail[i].invoice_Amount != 0)
                        selectedAmount += (this.customerPaymentDetail[i].invoice_Amount);
                    else {
                        selectedAmount += (this.customerPaymentDetail[i].balance_Amount);
                        this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount;
                    }
                }
            }
        }
        this.paid = selectedAmount.toFixed(2);
        this.paidStatus(this.paid_Amount);
    }
    //checkIfAllSelected
    checkIfAllSelected() {
        var selectedAmount = 0;
        for (let i = 0; i < this.customerPaymentDetail.length; i++) {
            this.chk = this.customerPaymentDetail[i].selected;
            if (this.chk == true) {
                if (this.paid > 0)
                    this.adjust = true;
                if (this.customerPaymentDetail[i].invoice_Amount != 0)
                    selectedAmount += (this.customerPaymentDetail[i].invoice_Amount);
                else {
                    selectedAmount += (this.customerPaymentDetail[i].balance_Amount);
                    this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount;
                }
            }
            else {
                this.customerPaymentDetail[i].invoice_Amount = 0;
                this.customerPaymentDetail[i].paymentTax = 0;
                this.customerPaymentDetail[i].paymentDiscount = 0;
                this.changeDiscount(this.customerPaymentDetail[i], 0);
                this.changeTax(this.customerPaymentDetail[i]);
            }
        }
        this.paid = selectedAmount.toFixed(2);
        this.paidStatus(this.paid_Amount);
    }
    //changePaid
    changePaid(paid_Amount) {
        if (paid_Amount <= 0) {
            this.paid_Amount = 0;
        }
        var selectedAmount = 0, selecteBalance = 0, pd = 0, ia = 0;
        // Again Commit
        if (this.allowAvancePayment == 1 && this.allowAvance == 1) {
            if (paid_Amount >= this.paid) {
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
                $("#submitUpdate").prop("disabled", false);
            }
            else {
                $("#submitAdd").prop("disabled", true);
                $("#submitAddMore").prop("disabled", true);
                $("#submitUpdate").prop("disabled", true);
                swal("Paid Amount should be equal to or greather then total amount.");
            }
        }
        else {

            if (paid_Amount == this.paid && this.allowAvance == 0) {
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
                $("#submitUpdate").prop("disabled", false);
            }

            else {

                if (this.returninvoiceFlag != true) {
                    //if (this.checkBoxStatus == true) {
                    var Flag = true;
                    for (let i = 0; i < this.customerPaymentDetail.length; i++) { //Check Amount In Marked Invoice Amount If Greater Than Zero :: Allow/Not Allow Adjustment
                        if (this.customerPaymentDetail[i].selected == true && this.customerPaymentDetail[i].invoice_Amount > 0) {
                            Flag = false;
                        }
                    }

                    if (Flag && paid_Amount > 0) {
                        pd = paid_Amount;
                        var sum = 0, carryreturn = 0;
                        for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                            if (this.customerPaymentDetail[i].balance_Amount > 0 && this.customerPaymentDetail[i].type == 0) {
                                //alert(carryreturn + " CARRY " + pd + " PD");
                                if (carryreturn > 0) {
                                    pd += carryreturn;
                                    //alert(carryreturn + " CARRY2 " + pd + " PD2");
                                    carryreturn = 0;
                                }

                                var Value = this.customerPaymentDetail[i].balance_Amount - pd;
                                if (Value >= 0) {

                                    this.customerPaymentDetail[i].invoice_Amount = pd;
                                    this.customerPaymentDetail[i].selected = true;
                                    sum += pd;
                                    break;
                                }
                                else {

                                    this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount;
                                    this.customerPaymentDetail[i].selected = true;
                                    pd = pd - this.customerPaymentDetail[i].balance_Amount;
                                    sum += this.customerPaymentDetail[i].balance_Amount;
                                }

                            }
                            else {
                                this.customerPaymentDetail[i].selected = false;
                            }

                            if (this.customerPaymentDetail[i].balance_Amount < 0 && this.customerPaymentDetail[i].type == 1) {
                                sum += this.customerPaymentDetail[i].balance_Amount;
                                carryreturn += (-1) * this.customerPaymentDetail[i].balance_Amount;
                                //alert(carryreturn);
                                this.customerPaymentDetail[i].selected = true;
                            }

                            if (this.customerPaymentDetail[i].type == 2) {
                                //alert(carryreturn + " CARRY " + pd + " PD");
                                if (carryreturn > 0) {
                                    pd += carryreturn;
                                    //alert(carryreturn + " CARRY2 " + pd + " PD2");
                                    carryreturn = 0;
                                }

                                var Value = this.customerPaymentDetail[i].balance_Amount - pd;
                                if (Value >= 0) {

                                    this.customerPaymentDetail[i].invoice_Amount = pd;
                                    this.customerPaymentDetail[i].selected = true;
                                    sum += pd;
                                    break;
                                }
                                else {

                                    this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount;
                                    this.customerPaymentDetail[i].selected = true;
                                    pd = pd - this.customerPaymentDetail[i].balance_Amount;
                                    sum += this.customerPaymentDetail[i].balance_Amount;
                                }
                            }
                        }

                        this.ReturnAmountFlag();
                        this.paid = sum.toFixed(2);

                        if (paid_Amount == this.paid && this.allowAvance == 0) {
                            $("#submitAdd").prop("disabled", false);
                            $("#submitAddMore").prop("disabled", false);
                            $("#submitUpdate").prop("disabled", false);
                        }
                    }

                }
            }
        }

    }
    //changeTax
    changeTax(j: customerPaymentDetails) {
        var selectedAmount = 0, selectedTax = 0, selectedDiscount = 0;
        for (let i = 0; i < this.customerPaymentDetail.length; i++) {
            this.chk = this.customerPaymentDetail[i].selected;
            if (this.chk == true) {
                if (this.customerPaymentDetail[i].invoice_Amount != 0) {
                    if (this.customerPaymentDetail[i].invoice_Amount <= this.customerPaymentDetail[i].balance_Amount) {
                        if (this.customerPaymentDetail[i].sale_Invoice_ID == j.sale_Invoice_ID) {
                            this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount - (j.paymentTax + j.paymentDiscount);
                        }

                        selectedAmount += (this.customerPaymentDetail[i].invoice_Amount);
                        selectedTax += (this.customerPaymentDetail[i].paymentTax);
                        selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                        this.paid = selectedAmount;

                    }

                    else {
                        selectedTax += (this.customerPaymentDetail[i].paymentTax);
                        selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                    }
                }
            }
        }

        this.paymentTax = selectedTax;
        this.totalPaymentTax = selectedTax;

        this.paymentDiscount = selectedDiscount;
        this.totalPaymentDiscount = selectedDiscount;

        this.adjustReturnAmount();
        this.paidStatus(this.paid_Amount);

        //  this.paid_Amount = selectedAmount;
    }
    //changeDiscount
    changeDiscount(j: customerPaymentDetails, paymentDiscount) {
        var selectedAmount = 0, selectedTax = 0, selectedDiscount = 0;

        for (let i = 0; i < this.customerPaymentDetail.length; i++) {
            this.chk = this.customerPaymentDetail[i].selected;
            if (this.chk == true) {


                if (this.customerPaymentDetail[i].invoice_Amount != 0) {
                    if (this.customerPaymentDetail[i].invoice_Amount <= this.customerPaymentDetail[i].balance_Amount) {
                        if (this.customerPaymentDetail[i].sale_Invoice_ID == j.sale_Invoice_ID) {
                            this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].invoice_Amount - (this.customerPaymentDetail[i].paymentDiscount)
                        }
                        selectedAmount += (this.customerPaymentDetail[i].invoice_Amount);
                        selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                        this.paid = selectedAmount;

                    }
                    else {
                        selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                    }
                }

            }
        }

        this.paymentDiscount = selectedDiscount;

        this.totalPaymentDiscount = selectedDiscount;
        this.paidStatus(this.paid_Amount);
    }
    //paidStatus
    paidStatus(paid_Amount) {
        if (this.allowAvancePayment == 1) {
            if (paid_Amount >= this.paid) {
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);

                $("#submitUpdate").prop("disabled", false);
            }
            else {
                $("#submitAdd").prop("disabled", true);
                $("#submitAddMore").prop("disabled", true);
                $("#submitUpdate").prop("disabled", true);
                //   swal("Customer Receipt should be greather then total amount.");
            }
        }
        else {
            if (paid_Amount == this.paid) {
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
                $("#submitUpdate").prop("disabled", false);
            }
            else {
                $("#submitAdd").prop("disabled", true);
                $("#submitAddMore").prop("disabled", true);
                $("#submitUpdate").prop("disabled", true);
                //  swal("Customer Receipt should be equal to invoice amount.");
            }
        }

    }
    //changeAllowStatus
    /*  changeAllowStatus(allowAvance) {
           if (allowAvance == true) {
               this.allowAvance = true;
               $("#lblAdvanceAmount").show();
               $("#lblAdvanceAmounts").show();
               this.getCustomers(this.areacode);
           }
           else {
               this.allowAvance = false;
               $("#lblAdvanceAmount").hide();
               $("#lblAdvanceAmounts").hide();
               this.getCustomers(this.areacode);
           }
       }*/
    //changeAllowStatus
    changeAllowStatus(allowAvance) {
        if (allowAvance == true) {
            this.allowAvance = true;
            this.allowAvanceAdjustment = false;
            this.adjust = false;
        }
    }
    //changeAllowAdjustmentStatus
    changeAllowAdjustmentStatus(allowAvanceAdjustment) {
        if (allowAvanceAdjustment == true) {
            this.allowAvanceAdjustment = true;
            this.allowAvance = false;
            this.adjust = true;
        }
    }
    //advanceStatus
    advanceStatus() {
        this.allowAvancePayment = sessionStorage.getItem('settingAllowAdvanceReceipt');
        if (this.allowAvancePayment == 1) {
            this.allowAvance = false;
            $("#lblAllow").show();
            $("#lblAllowPayment").show();
            $("#lblAllowPaymentAdjustment").show();
            $("#lblAdvanceAmount").hide();
            $("#lblAdvanceAmounts").hide();
        }
        else {
            this.allowAvance = false;
            $("#lblAllow").hide();
            $("#lblAllowPayment").hide();
            $("#lblAllowPaymentAdjustment").hide();
            $("#lblAdvanceAmount").hide();
            $("#lblAdvanceAmounts").hide();
        }
    }
    //changeInvoiceAmount
    changeInvoiceAmount(i: customerPaymentDetails, invoice_Amount) {
        var selectedAmount = 0, selectedTax = 0, selectedDiscount = 0, tempTotal = 0;
        for (let i = 0; i < this.customerPaymentDetail.length; i++) {
            this.chk = this.customerPaymentDetail[i].selected;
            if (this.chk == true) {
                if (this.customerPaymentDetail[i].invoice_Amount != 0) {
                    if (this.customerPaymentDetail[i].invoice_Amount <= this.customerPaymentDetail[i].balance_Amount) {
                        tempTotal = invoice_Amount - (this.customerPaymentDetail[i].paymentTax + this.customerPaymentDetail[i].paymentDiscount)
                        //this.customerPaymentDetail[i].invoice_Amount = invoice_Amount;
                        selectedAmount += (this.customerPaymentDetail[i].invoice_Amount);
                        selectedTax += (this.customerPaymentDetail[i].paymentTax);
                        selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                    }
                    else {
                        //alert(2);
                        //if (this.mode == true) {
                        //  if (invoice_Amount <= this.customerPaymentDetail[i].invoice_Amount) {
                        //    this.customerPaymentDetail[i].invoice_Amount = invoice_Amount;
                        //    selectedAmount += (this.customerPaymentDetail[i].invoice_Amount);
                        //    selectedTax += (this.customerPaymentDetail[i].paymentTax);
                        //    selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                        //  }
                        //}
                        //else {
                        this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount;
                        selectedAmount += (this.customerPaymentDetail[i].balance_Amount);
                        selectedTax += (this.customerPaymentDetail[i].paymentTax);
                        selectedDiscount += (this.customerPaymentDetail[i].paymentDiscount);
                        //}
                    }
                }
                else {
                    //alert(3);
                    this.customerPaymentDetail[i].invoice_Amount = this.customerPaymentDetail[i].balance_Amount
                    selectedAmount += (this.customerPaymentDetail[i].balance_Amount);
                }
            }
        }

        this.adjustReturnAmount();
        this.paid = selectedAmount;
        this.totalPaymentTax = selectedTax;
        this.totalPaymentDiscount = selectedDiscount;
        this.paidStatus(this.paid_Amount);
        //  this.paid_Amount = selectedAmount;
    }
    //IfExists
    IfExists(sale_Payment_ID, customer_ID, payment_Date) {
        this.service.IfExists(sale_Payment_ID, customer_ID, payment_Date)
            .subscribe(response => {
                this.paymentStatus = (response.json());
                //console.log(response.json());
                this.status = this.paymentStatus[0].status;
                if (this.status == 1) {
                    $("#alertWarning").show();
                    $("#submitUpdate").prop("disabled", true);
                    $("#cancelBtn").prop("disabled", true);
                }
                else {
                    $("#alertWarning").hide();
                    $("#submitUpdate").prop("disabled", false);
                    $("#cancelBtn").prop("disabled", false);
                }
            });
    }
    //getDetailsByID
    getDetailsByID(sale_Payment_ID, payment_Date, customer_ID, content) {
        this.detailOpen(content);
        this.ID = sale_Payment_ID;
        this.mode = true;
        this.btnmode = false;
        this.paymentTax = 0;
        this.paymentDiscount = 0;
        this.IfExists(sale_Payment_ID, customer_ID, payment_Date);
        this.service.getDetailsByID(sale_Payment_ID)
            .subscribe((o: salePayment) => {
                console.log(o);
                this.sale_Payment_ID = o.sale_Payment_ID;
                this.customer_ID = o.customer_ID;
                this.chequeNo = o.chequeNo;
                this.reference_No=o.refrence_No;
                this.chequeDate.setDate(o.modifieD_DATE);
                //this.method_ID = o.methodID;
                this.remarks = o.remarks;

                if (o.cancel == 1) {
                    if (this.status != true) {
                        $("#alertWarning").show();
                        $("#cancelBtn").prop("disabled", true);
                        $("#submitUpdate").prop("disabled", true);
                    }
                }
                if (o.return_Amount > 0) {
                    $("#cancelBtn").prop("disabled", true);
                }

                this.payment_Date.setDate(o.payment_Date);
                //getPaymentMethods
                this.paymentMethod();
                //this.changePaymentMethod(this.method_ID);
                //this.service.getBankAccounts(this.method_ID)
                //  .subscribe(response => {
                //    this.bankAccounts = (response.json());
                //    this.accounT_NO = o.accountCode;
                //    //  this.changeAccountNo(this.account_Code);
                //  });
                //if (this.method_ID != 0)
                //this.changePaymentMethod(this.method_ID);

                this.service.getPaymentMethods()
                    .subscribe(response => {
                        this.getPaymentMethods = (response.json());
                        this.method_ID = o.methodID;
                        if (this.method_ID == 1) {
                            $("#lblAccount").show();
                            $("#lblAccountTitle").show();
                            $("#lblCheque").hide();
                            $("#lblChequeTitle").hide();
                            this.showchequedate = 'none';
                        }
                        else {
                            $("#lblAccount").show();
                            $("#lblAccountTitle").show();
                            $("#lblCheque").show();
                            $("#lblChequeTitle").show();
                            this.showchequedate = '';
                        }
                        if (this.method_ID != 0) {
                            //getBankAccounts
                            this.service.getBankAccounts(o.methodID)
                                .subscribe(response => {
                                    this.bankAccounts = (response.json());
                                    if (this.bankAccounts != null) {
                                        this.accounT_NO = o.accountCode;
                                        //this.changeAccountNo(this.accounT_NO);
                                    }
                                });
                        }
                    });


                this.paid_Amount = o.paid_Amount;
                //this.paid = o.paid_Amount;

                //getCustomers
                this.service.getCustomers(0, this.priviledged_Offices, this.sale_Payment_ID, this.allowAvance, this.mode)
                    .subscribe(response => {
                        if (response.json() != null)
                            this.customers = this.getDropdownList(response.json(), "customer_ID", "customer_Name");
                        this.customer_ID = this.customers[0].id;
                        this.changeContacts(this.customer_ID);
                        var customlist = response.json();

                        if (this.areaenable != 1) { }
                        else {
                            this.areashow = '';
                            this.service.getArea()
                                .subscribe(response => {
                                    this.area = (response.json());
                                    for (let i = 0; i < customlist.length; i++)
                                        if (customlist[i].customer_ID == this.customer_ID) {
                                            //alert(customlist[i].areacode);
                                            this.areacode = customlist[i].areacode;
                                            $("#areacode").prop("disabled", true);
                                            $("#customer_ID").prop("disabled", true);
                                        }
                                });
                        }

                    });

                this.getInvoiceDetails(this.customer_ID, this.sale_Payment_ID, this.mode);

                this.attachments = [];
                this.guid = o.sPGUID;
                this.getFiles(this.guid);
            });

    }
    //cancelPayment
    cancelPayment() {
        swal({
            title: "Do you really want to cancel?",
            text: "Once cancelled, you will not be able to recover this recipts!",
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
                    swal("Poof! Your recipts has been cancelled!", {
                        icon: "success",
                    });

                    this.service.cancelPayment(this.sale_Payment_ID, this.actionID)
                        .subscribe(response => {
                            this.cancelReturn = (response.json());
                            this.searchPaymentDetails('');
                            this.modalReference.close();
                        });
                } else {
                    swal("Your recipts is safe!");
                }
            });
    }

    sendMessage(ID: any, customer_ID: any, total_Amount: any) {

        this.oservice.getCustomerNo(customer_ID)
            .subscribe(response => {
                this.isLoading = false;

                var list = response.json();

                let CustomerName = list[0].name;

                let message = 'Mr./Mrs. ' + CustomerName + ' Your Invoice # ' + ID + ' of Rs. ' + total_Amount + ' has been issued.';
                let CustomerCell = list[0].cell;

                if (CustomerCell != null) {
                    if (CustomerCell.length > 0) {
                        if (sessionStorage.getItem('SendSmsNotification') == '1') {


                            if (CustomerCell.charAt(0) === '0')
                                CustomerCell = CustomerCell.slice(1);

                            let no = '92' + CustomerCell


                            this.sms = new SMSMessage(0, CustomerName, total_Amount, 140006, no, 0, this.logedInUserID);

                            this.smsService.sendSms(this.sms).then(r => {
                                console.log('Message Status:' + this.sms.result);
                            });

                        }
                    }

                }
            }
            );
    }
    //savePaymentMore
    savePaymentMore(sale_Payment_ID: any, payment_Date: any, payment_NO: any, office_Code: any,
        customer_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
        freight_Chrgs: any, total_Amount: any, balance_Amount: any, paid_Amount: any, remarks: any, bankCode: any) {
        this.isLoading = true;

        if (this.method_ID != 1) {
            if (this.chequeNo != '')
                console.log('ok')
            else {
                this.isLoading = false;
                swal('Select Cheque')
                return;
            }
        }

        var selectedAmount = 0;
        if (this.customerPaymentDetail != null) {
            for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                this.chk = this.customerPaymentDetail[i].selected;
                if (this.chk == true) {
                    if (this.returninvoiceFlag)
                        this.customerPaymentDetails.push(new customerPaymentDetails(0, this.customerPaymentDetail[i].sale_Invoice_ID, 0, this.customerPaymentDetail[i].adjusted, this.customerPaymentDetail[i].paymentTax, this.customerPaymentDetail[i].paymentDiscount, this.customerPaymentDetail[i].returned, this.customerPaymentDetail[i].type));
                    else
                        this.customerPaymentDetails.push(new customerPaymentDetails(0, this.customerPaymentDetail[i].sale_Invoice_ID, 0, this.customerPaymentDetail[i].invoice_Amount, this.customerPaymentDetail[i].paymentTax, this.customerPaymentDetail[i].paymentDiscount, 0, this.customerPaymentDetail[i].type));
                }
            }
        }

        $("#submitAdd").prop("disabled", true);
        $("#submitAddMore").prop("disabled", true);
        if (this.returninvoiceFlag)
            var payment = new salePayment(sale_Payment_ID, this.payment_Date.getDateFinal(), 0, this.userCurrentOffice, customer_ID, total_Cost, total_Discount, total_Tax, freight_Chrgs, total_Amount, balance_Amount, paid_Amount, this.return_Amount, remarks, this.guid, this.method_ID, bankCode, this.accounT_NO, this.chequeNo, this.chequeDate.getDateFinal(), 0, this.totalPaymentTax, this.totalPaymentDiscount, this.logedInUserID, this.UserSessionID, this.allowAvance, this.adjust, this.customerPaymentDetails,this.reference_No,);
        else
            var payment = new salePayment(sale_Payment_ID, this.payment_Date.getDateFinal(), 0, this.userCurrentOffice, customer_ID, total_Cost, total_Discount, total_Tax, freight_Chrgs, total_Amount, balance_Amount, paid_Amount, 0.00, remarks, this.guid, this.method_ID, bankCode, this.accounT_NO, this.chequeNo, this.chequeDate.getDateFinal(), 0, this.totalPaymentTax, this.totalPaymentDiscount, this.logedInUserID, this.UserSessionID, this.allowAvance, this.adjust, this.customerPaymentDetails,this.reference_No,);
        console.log(payment);
debugger
        if (paid_Amount > 0) {
            //If Allow Advance Payment is true 
            if (this.allowAvancePayment == 1 && this.allowAvance == 1) {
                if (this.paid_Amount >= this.paid) {

                    this.service.savePayment(payment).then(
                        (response) => {
                            this.savemoreFlag = true;
                            this.isLoading = false;
                            sessionStorage.setItem('AreaID', this.areacode);

                            this.sendMessage(0, customer_ID, paid_Amount);

                            this.searchPaymentDetails('');
                            //this.modalReference.close();
                            this.clearFields();
                            this.mode = false;
                            this.priviledged_Offices = this.LoginService.getSession('userPrivilegedOffice');
                            this.btnmode = true;
                            this.total_Cost = 0;
                            this.total_Discount = 0;
                            this.freight_Chrgs = 0;
                            this.total_Amount = 0;
                            this.balance_Amount = 0;
                            this.hidden_Balance = 0;
                            this.prepaid = 0;
                            this.paid_Amount = 0;
                            this.paid = 0;
                            this.openingBalance = 0.00;
                            this.totalSales = 0.00;
                            this.totalReturns = 0.00;
                            this.totalReceipts = 0.00;
                            this.paymentTax = 0.00;
                            this.paymentDiscount = 0.00;
                            this.totalPaymentTax = 0.00;
                            this.totalPaymentDiscount = 0.00;
                            this.totalTPaymentTax = 0.00;
                            this.totalTPaymentDiscount = 0.00;
                            this.netPayable = 0.00;
                            this.advanceAmount = 0.00;
                            // this.getPaymentDetails = [];
                            this.paymentDetailValues = [];
                            this.customerPaymentDetail = [];
                            this.customerPaymentDetails = [];
                            this.getCurrentDay();
                            this.advanceStatus();
                            $("#submitAdd").show();
                            $("#submitAddMore").show();
                            $("#submitUpdate").hide();
                            $("#submitAdd").prop("disabled", true);
                            $("#submitAddMore").prop("disabled", true);
                            $("#cancelBtn").hide();


                            this.guid = UUID.UUID();
                            this.paymentMethod();
                            this.setAreaEnableStatus();
                            this.getBankAccounts();
                            this.allowPaymentTax();
                            this.allowPaymentDiscount();
                            console.log(response);
                        },
                        (error) => { 
                            //console.log(error);
                            this.isLoading = false;
                            this.commonUtility.handleError(error);
                          
                          })
                }
                else {
                    this.isLoading = false;
                    swal("Customer Receipt should be equal to or greater then total amount.");
                    $("#submitAdd").prop("disabled", false);
                    $("#submitAddMore").prop("disabled", false);
                }

            }
            //If Allow Advance Payment is false
            else {
                //If Allow Payment Invoice Wise is true
                if (this.settingReceiptInvoiceWise == 1 && this.allowAvance == 0) {
                    if (paid_Amount > 0) {

                        if (this.paid_Amount == this.paid) {
                            //    alert("Insert 2");
                            this.service.savePayment(payment).then(
                                (response) => {
                                    sessionStorage.setItem('AreaID', this.areacode);
                                    this.sendMessage(0, customer_ID, paid_Amount);
                                    this.searchPaymentDetails('');
                                    this.isLoading = false;
                                    this.savemoreFlag = true;
                                    this.mode = false;
                                    this.priviledged_Offices = this.LoginService.getSession('userPrivilegedOffice');
                                    this.btnmode = true;
                                    this.total_Cost = 0;
                                    this.total_Discount = 0;
                                    this.freight_Chrgs = 0;
                                    this.total_Amount = 0;
                                    this.balance_Amount = 0;
                                    this.hidden_Balance = 0;
                                    this.prepaid = 0;
                                    this.paid_Amount = 0;
                                    this.paid = 0;
                                    this.openingBalance = 0.00;
                                    this.totalSales = 0.00;
                                    this.totalReturns = 0.00;
                                    this.totalReceipts = 0.00;
                                    this.paymentTax = 0.00;
                                    this.paymentDiscount = 0.00;
                                    this.totalPaymentTax = 0.00;
                                    this.totalPaymentDiscount = 0.00;
                                    this.totalTPaymentTax = 0.00;
                                    this.totalTPaymentDiscount = 0.00;
                                    this.netPayable = 0.00;
                                    this.advanceAmount = 0.00;
                                    // this.getPaymentDetails = [];
                                    this.paymentDetailValues = [];
                                    this.customerPaymentDetail = [];
                                    this.customerPaymentDetails = [];

                                    this.getCurrentDay();
                                    this.advanceStatus();
                                    $("#submitAdd").show();
                                    $("#submitAddMore").show();
                                    $("#submitUpdate").hide();
                                    $("#submitAdd").prop("disabled", true);
                                    $("#submitAddMore").prop("disabled", true);
                                    $("#cancelBtn").hide();


                                    this.guid = UUID.UUID();
                                    this.paymentMethod();
                                    this.setAreaEnableStatus();
                                    this.getBankAccounts();
                                    this.allowPaymentTax();
                                    this.allowPaymentDiscount();
                                    console.log(response);
                                },
                                (error) => { 
                                    //console.log(error);
                                    this.isLoading = false;
                                    this.commonUtility.handleError(error);
                                  
                                  })

                        }
                        else {
                            this.isLoading = false;
                            swal("Customer Receipt should be equal to invoice amount.");
                            $("#submitAdd").prop("disabled", false);
                            $("#submitAddMore").prop("disabled", false);
                        }
                    }
                    else {
                        this.isLoading = false;
                        swal("Customer Receipt should be greater then 0.");
                        $("#submitAdd").prop("disabled", false);
                        $("#submitAddMore").prop("disabled", false);
                    }
                }
                //If Allow Payment Invoice Wise is false
                else {
                    if (paid_Amount > 0) {
                        //     alert("Insert 3");
                        this.service.savePayment(payment).then(
                            (response) => {
                                sessionStorage.setItem('AreaID', this.areacode);
                                this.sendMessage(0, customer_ID, paid_Amount);
                                this.searchPaymentDetails('');
                                this.savemoreFlag = true;
                                this.isLoading = false;
                                this.mode = false;
                                this.priviledged_Offices = this.LoginService.getSession('userPrivilegedOffice');
                                this.btnmode = true;
                                this.total_Cost = 0;
                                this.total_Discount = 0;
                                this.freight_Chrgs = 0;
                                this.total_Amount = 0;
                                this.balance_Amount = 0;
                                this.hidden_Balance = 0;
                                this.prepaid = 0;
                                this.paid_Amount = 0;
                                this.paid = 0;
                                this.openingBalance = 0.00;
                                this.totalSales = 0.00;
                                this.totalReturns = 0.00;
                                this.totalReceipts = 0.00;
                                this.paymentTax = 0.00;
                                this.paymentDiscount = 0.00;
                                this.totalPaymentTax = 0.00;
                                this.totalPaymentDiscount = 0.00;
                                this.totalTPaymentTax = 0.00;
                                this.totalTPaymentDiscount = 0.00;
                                this.netPayable = 0.00;
                                this.advanceAmount = 0.00;
                                // this.getPaymentDetails = [];
                                this.paymentDetailValues = [];
                                this.customerPaymentDetail = [];
                                this.customerPaymentDetails = [];

                                this.getCurrentDay();
                                this.advanceStatus();
                                $("#submitAdd").show();
                                $("#submitAddMore").show();
                                $("#submitUpdate").hide();
                                $("#submitAdd").prop("disabled", true);
                                $("#submitAddMore").prop("disabled", true);
                                $("#cancelBtn").hide();


                                this.guid = UUID.UUID();
                                this.paymentMethod();
                                this.setAreaEnableStatus();
                                this.getBankAccounts();
                                this.allowPaymentTax();
                                this.allowPaymentDiscount();

                                console.log(response);
                            },
                            (error) => { 
                                //console.log(error);
                                this.isLoading = false;
                                this.commonUtility.handleError(error);
                              
                              })

                    }
                    else {
                        this.isLoading = false;
                        swal("Customer Receipt should be greater then 0.");
                        $("#submitAdd").prop("disabled", false);
                        $("#submitAddMore").prop("disabled", false);
                    }
                }


            }
        }
        else {
            this.isLoading = false;
            swal("Customer Receipt should be greater then 0.");
        }

    }
    //savePayment
    savePayment(sale_Payment_ID: any, payment_Date: any, payment_NO: any, office_Code: any,
        customer_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
        freight_Chrgs: any, total_Amount: any, balance_Amount: any, paid_Amount: any, remarks: any, bankCode: any) {
        this.isLoading = true;
        if (this.method_ID != 1) {
            if (this.chequeNo != '') { }
            else {
                this.isLoading = false;
                swal('Select Cheque')
                return;
            }
        }
        var selectedAmount = 0;
        if (this.customerPaymentDetail != null) {
            for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                this.chk = this.customerPaymentDetail[i].selected;
                if (this.chk == true) {
                    //this.customerPaymentDetails.push(new customerPaymentDetails(0, this.customerPaymentDetail[i].sale_Invoice_ID, 0, this.customerPaymentDetail[i].invoice_Amount, this.customerPaymentDetail[i].paymentTax, this.customerPaymentDetail[i].paymentDiscount));
                    if (this.returninvoiceFlag)
                        this.customerPaymentDetails.push(new customerPaymentDetails(0, this.customerPaymentDetail[i].sale_Invoice_ID, 0, this.customerPaymentDetail[i].adjusted, this.customerPaymentDetail[i].paymentTax, this.customerPaymentDetail[i].paymentDiscount, this.customerPaymentDetail[i].returned, this.customerPaymentDetail[i].type));
                    else
                        this.customerPaymentDetails.push(new customerPaymentDetails(0, this.customerPaymentDetail[i].sale_Invoice_ID, 0, this.customerPaymentDetail[i].invoice_Amount, this.customerPaymentDetail[i].paymentTax, this.customerPaymentDetail[i].paymentDiscount, 0, this.customerPaymentDetail[i].type));

                }
            }
        }

        $("#submitAdd").prop("disabled", true);
        $("#submitAddMore").prop("disabled", true);
        //var payment = new salePayment(sale_Payment_ID, this.payment_Date.getDateFinal(), 0, 1,customer_ID, total_Cost, total_Discount, total_Tax,freight_Chrgs, total_Amount, balance_Amount, paid_Amount, remarks, this.guid, this.method_ID, this.accounT_NO, this.chequeNo, 0, this.totalPaymentTax, this.totalPaymentDiscount, this.customerPaymentDetails);
        if (this.returninvoiceFlag)
            var payment = new salePayment(sale_Payment_ID, this.payment_Date.getDateFinal(), 0, this.userCurrentOffice, customer_ID, total_Cost, total_Discount, total_Tax, freight_Chrgs, total_Amount, balance_Amount, paid_Amount, this.return_Amount, remarks, this.guid, this.method_ID, bankCode, this.accounT_NO, this.chequeNo, this.chequeDate.getDateFinal(), 0, this.totalPaymentTax, this.totalPaymentDiscount, this.logedInUserID, this.UserSessionID, this.allowAvance, this.adjust, this.customerPaymentDetails,this.reference_No,);
        else
            var payment = new salePayment(sale_Payment_ID, this.payment_Date.getDateFinal(), 0, this.userCurrentOffice, customer_ID, total_Cost, total_Discount, total_Tax, freight_Chrgs, total_Amount, balance_Amount, paid_Amount, 0.00, remarks, this.guid, this.method_ID, bankCode, this.accounT_NO, this.chequeNo, this.chequeDate.getDateFinal(), 0, this.totalPaymentTax, this.totalPaymentDiscount, this.logedInUserID, this.UserSessionID, this.allowAvance, this.adjust, this.customerPaymentDetails,this.reference_No,);


        console.log(payment);
debugger
        if (paid_Amount > 0) {
            //If Allow Advance Payment is true 
            if (this.allowAvancePayment == 1 && this.allowAvance == 1) {
                if (this.paid_Amount >= this.paid) {
                    //  alert("Insert 1");
                    this.service.savePayment(payment).then(
                        (response) => {
                            sessionStorage.setItem('AreaID', this.areacode);
                            this.sendMessage(0, customer_ID, paid_Amount);
                            this.searchPaymentDetails('');
                            this.clearFields();
                            this.modalReference.close();
                            //console.log(response);
                        },
                        (error) => {
                            console.log(error);
                        });
                    this.isLoading = false;
                }
                else {
                    this.isLoading = false;
                    swal("Customer Receipt should be equal to or greater then total amount.");
                    $("#submitAdd").prop("disabled", false);
                    $("#submitAddMore").prop("disabled", false);
                }
            }
            //If Allow Advance Payment is false
            else {
                //If Allow Payment Invoice Wise is true
                if (this.settingReceiptInvoiceWise == 1 && this.allowAvance == 0) {
                    if (paid_Amount > 0) {
                        console.log(this.paid_Amount + ',' + this.paid);
                        if (this.paid_Amount == this.paid) {
                            //    alert("Insert 2");
                            this.service.savePayment(payment).then(
                                (response) => {
                                    this.sendMessage(0, customer_ID, paid_Amount);
                                    this.searchPaymentDetails('');
                                    this.modalReference.close();
                                    console.log(response);
                                },
                                (error) => { 
                                    //console.log(error);
                                    this.isLoading = false;
                                    this.commonUtility.handleError(error);
                                  
                                  })

                        }
                        else {
                            this.isLoading = false;
                            swal("Customer Receipt should be equal to invoice amount.");
                            $("#submitAdd").prop("disabled", false);
                            $("#submitAddMore").prop("disabled", false);
                        }
                    }
                    else {
                        this.isLoading = false;
                        swal("Customer Receipt should be greater then 0.");
                        $("#submitAdd").prop("disabled", false);
                        $("#submitAddMore").prop("disabled", false);
                    }
                }
                //If Allow Payment Invoice Wise is false
                else {
                    if (paid_Amount > 0) {
                        //     alert("Insert 3");
                        this.service.savePayment(payment).then(
                            (response) => {
                                this.sendMessage(0, customer_ID, paid_Amount);
                                this.searchPaymentDetails('');
                                this.modalReference.close();
                                console.log(response);
                            },
                            (error) => { 
                                //console.log(error);
                                this.isLoading = false;
                                this.commonUtility.handleError(error);
                              
                              })

                    }
                    else {
                        this.isLoading = false;
                        swal("Customer Receipt should be greater then 0.");
                        $("#submitAdd").prop("disabled", false);
                        $("#submitAddMore").prop("disabled", false);
                    }
                }
                this.isLoading = false;
            }
        }
        else {
            this.isLoading = false;
            swal("Customer Receipt should be greater then 0.");
        }

    }
    //updatePayment
    updatePayment(sale_Payment_ID: any, payment_Date: any, payment_NO: any, office_Code: any,
        customer_ID: any, total_Cost: any, total_Discount: any, total_Tax: any,
        freight_Chrgs: any, total_Amount: any, balance_Amount: any, paid_Amount: any, remarks: any) {
        /*
        this.isLoading =true;
        var selectedAmount = 0;
        if (this.customerPaymentDetail != null) {
          for (let i = 0; i < this.customerPaymentDetail.length; i++) {
            this.chk = this.customerPaymentDetail[i].selected;
       
            if (this.chk == true) {
              this.customerPaymentDetails.push(new customerPaymentDetails(0, this.customerPaymentDetail[i].sale_Invoice_ID, 0, this.customerPaymentDetail[i].invoice_Amount, this.customerPaymentDetail[i].paymentTax, this.customerPaymentDetail[i].paymentDiscount));
            }
          }
        }
        var payment = new salePayment(sale_Payment_ID, this.payment_Date.getDateFinal(), 0, 1,
          customer_ID, total_Cost, total_Discount, total_Tax,
          freight_Chrgs, total_Amount, balance_Amount, paid_Amount, remarks, this.guid, this.method_ID, this.accounT_NO, this.chequeNo, 0, this.totalPaymentTax, this.totalPaymentDiscount, this.customerPaymentDetails);
        console.log(payment);
       
        //If Allow Advance Payment is true 
        if (this.allowAvancePayment == 1) {
          if (this.paid_Amount > this.paid) {
            //alert("Insert 1");
            this.service.updatePayment(payment).then(
              (response) => {
                this.paymentDetails();
                this.modalReference.close();
                console.log(response);
              },
              (error) => {
                console.log(error);
              });
          }
          else {
            swal("Customer Receipt should be greater then total amount.");
            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);
          }
          this.isLoading = false;
        }
        //If Allow Advance Payment is false
        else {
          //If Allow Payment Invoice Wise is true
          if (this.settingReceiptInvoiceWise == 1) {
            if (paid_Amount > 0) {
              if (this.paid_Amount == this.paid) {
                //alert("Insert 2");
                this.service.updatePayment(payment).then(
                  (response) => {
                    this.paymentDetails();
                    this.modalReference.close();
                    console.log(response);
                  },
                  (error) => {
                    console.log(error);
                  });
       
              }
              else {
                swal("Customer Receipt should be equal to invoice amount.");
                $("#submitAdd").prop("disabled", false);
                $("#submitAddMore").prop("disabled", false);
              }
       
            }
            else {
              swal("Customer Receipt should be greater then 0.");
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
            }
          }
          //If Allow Payment Invoice Wise is false
          else {
            if (paid_Amount > 0) {
              //alert("Insert 3");
              this.service.updatePayment(payment).then(
                (response) => {
                  this.paymentDetails();
                  this.modalReference.close();
                  console.log(response);
                },
                (error) => { 
              //console.log(error);
              this.isLoading = false;
              this.commonUtility.handleError(error);
            
            })
       
            }
            else {
              swal("Customer Receipt should be greater then 0.");
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
            }
       
          }
          this.isLoading = false;
        }
        */
    }
    //ngAfterViewChecked
    ngAfterViewChecked() {
        this.scrollToBottom();
    }
    //scrollToBottom
    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
    //allowPaymentTax
    allowPaymentTax() {
        if (sessionStorage.getItem('AllowTaxOnPayment') != "1") {
            this.allowTax = false;
            $("#lbltotalPaymentTax").hide();
            //$("#lbltotalPaymentDiscount").hide();
        }
        else {
            this.allowTax = true;
            $("#lbltotalPaymentTax").show();
            //$("#lbltotalPaymentDiscount").show();
        }
    }
    //allowPaymentDiscount
    allowPaymentDiscount() {

        if (sessionStorage.getItem('AllowPaymenetDiscount') != "1")
            this.allowDiscount = false;
        else
            this.allowDiscount = true;
    }
    // open modal
    open(content) {
        this.getCurrentDay();
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

        this.advanceStatus();
        $("#submitAdd").show();
        $("#submitAddMore").show();
        $("#submitUpdate").hide();
        $("#submitAdd").prop("disabled", true);
        $("#submitAddMore").prop("disabled", true);
        $("#cancelBtn").hide();

        this.clearFields();
        this.guid = UUID.UUID();
        this.paymentMethod();
        this.setAreaEnableStatus();
        this.getBankAccounts();
        this.allowPaymentTax();
        this.allowPaymentDiscount();
    }
    // detailOpen modal
    detailOpen(content) {
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

        this.advanceStatus();
        this.allowPaymentTax();
        this.allowPaymentDiscount();
        $("#submitAdd").hide();
        $("#submitAddMore").hide();
        $("#submitUpdate").show();
        $("#submitUpdate").prop("disabled", false);
        $("#cancelBtn").show();
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
    //routeReceipt
    routeReceipt(value) {
        if (value == 1)
            this.router.navigate(['/customer-receipt-import']);
    }
    // end of modal
    returninvoiceFlag: any = false;
    returnamountsum: any = 0;
    ReturnAmountFlag() {
        //  console.log('ReturnAmountFlag Start')
        var count = 0;
        if (this.customerPaymentDetail != null) {
            for (let i = 0; i < this.customerPaymentDetail.length; i++) {
                //console.log('for Start :: ReturnAmountFlag')

                if (this.customerPaymentDetail[i].selected == 1 && this.customerPaymentDetail[i].type == 1) {
                    count++;
                    break;
                }
            }
            // console.log('count :: ReturnAmountFlag', count)
            if (count > 0)
                this.returninvoiceFlag = true;
            else
                this.returninvoiceFlag = false;
            console.log('returninvoiceFlag :: ReturnAmountFlag', this.returninvoiceFlag)
            this.adjustReturnAmount();
        }
    }
    adjustReturnAmount() {
        var returnsum = 0;

        //Clear Unmarked AV RA
        for (let i = 0; i < this.customerPaymentDetail.length; i++) {

            if (this.customerPaymentDetail[i].selected != 1) {
                this.customerPaymentDetail[i].adjusted = 0;
                this.customerPaymentDetail[i].returned = 0;
            }
        }

        if (this.returninvoiceFlag) {

            //Return Invoice Amount Sum
            for (let i = 0; i < this.customerPaymentDetail.length; i++) {

                if (this.customerPaymentDetail[i].selected == 1 && this.customerPaymentDetail[i].type == 1) {
                    var value = this.customerPaymentDetail[i].invoice_Amount;
                    returnsum = returnsum + (value * (-1));
                    //console.log('returnsum ', returnsum);
                }
            }

            this.return_Amount = returnsum;
            //Effect
            for (let i = 0; i < this.customerPaymentDetail.length; i++) {

                if (this.customerPaymentDetail[i].selected == 1 && this.customerPaymentDetail[i].type == 0) {

                    var amount = 0;
                    amount = this.customerPaymentDetail[i].invoice_Amount;
                    console.log(this.customerPaymentDetail[i].invoice_Amount, "TEST")
                    if (returnsum >= amount) {

                        this.customerPaymentDetail[i].adjusted = 0;
                        this.customerPaymentDetail[i].returned = this.customerPaymentDetail[i].invoice_Amount;
                        returnsum = returnsum - amount;
                    }
                    else {

                        amount = amount - returnsum;
                        this.customerPaymentDetail[i].adjusted = amount;
                        this.customerPaymentDetail[i].returned = returnsum;
                        returnsum = 0;
                    }

                }

                if (this.customerPaymentDetail[i].selected == 1 && this.customerPaymentDetail[i].type == 1) {

                    var amount = 0;
                    amount = this.customerPaymentDetail[i].invoice_Amount;
                    this.customerPaymentDetail[i].adjusted = -amount;

                }

            }


        }
        else {
            this.return_Amount = 0.00;
        }

        //alert(this.return_Amount);

    }
    showReturnAmount() {
        if (sessionStorage.getItem('ShowReturnAdjustments') == '1') {
            this.showRA = ''
        }
        else {
            this.showRA = 'none'
        }
    }
    //-----------FILE ATTACHMENT----------//
    ShowAttachment: any = 'none';
    imageUrl: string = "../../../../assets/img/bill.png";
    fileToUpload: File = null;
    filename: any = '';
    attachments: any[] = [];
    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        this.filename = this.fileToUpload.name;
        this.uploadFile();
        ////Show image preview
        //var reader = new FileReader();
        //reader.onload = (event: any) => {
        //  this.imageUrl = event.target.result;
        //}
        //reader.readAsDataURL(this.fileToUpload);

    }
    uploadFile() {
        if (this.fileToUpload != null) {
            this.isLoading = true;
            this.fileservice.postFile(this.guid, 3, this.filename, this.fileToUpload)
                .subscribe(data => {
                    this.getFiles(this.guid);
                }

                );

        }
    }
    getFiles(ID) {
        this.fileservice.getFileAttachments(ID)
            .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                    this.attachments = (response.json());
                }

            });
    }
    cancelFile(ID) {
        this.isLoading = true;
        this.fileservice.cancelFileAttachments(ID)
            .subscribe(response => {
                this.isLoading = false;
                console.log(response);
                this.attachments = [];
                this.getFiles(this.guid);
            });
    }
    getAttachmentByID(ID) {

        this.isLoading = true
        this.fileservice.getAttachmentByID(ID)
            .subscribe(response => {

                if (response.json()) {
                    var list = response.json()
                    var name = list[0].filename;

                    if (name != "") {
                        let pdf: any;
                        this.fileservice.viewFile().subscribe(response => {

                            pdf = response.text();
                            this.isLoading = false;
                            var iframe = "<iframe width='100%' height='100%' src='" + pdf + "'></iframe>"
                            var x = window.open();
                            x.document.open();
                            x.document.write(iframe);
                            x.document.close();

                        });
                    }

                }
                else {
                    this.isLoading = false;
                }

            });
    }
}

