import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { OpeningBalanceService} from '../../../../../shared/services/FIS/AFM/opening-balance/opening-balance.service';
import { openingBalance} from '../../../../../shared/models/FIS/AFM/openingbalance';
import { openingBalanceDetails} from '../../../../../shared/models/FIS/AFM/openingbalanceDetails';
import { cDate, NgbDateFRParserFormatter, DayEndService, FiscalYearService, LoginService, voucherDetails, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]

})
export class OpeningBalanceComponent implements OnInit {
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
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
  supplier: any[];
  customer: any[];
  accountt: any[];
  item: any[];
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
  customerCode: any =0;
  supplierCode: any =0;
  itemCode: any =0;
  isLoading: any = false;
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  isView: any = true;
  showEye: any = false;
  isUpdateable: any = false;
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  creditDisable: any = false;
  debitDisable: any = false;
  public permissionUtility: PermissionUtility = new PermissionUtility();
  constructor(public router: Router,private service: OpeningBalanceService, private ngbDateParserFormatter: NgbDateParserFormatter, private LoginService: LoginService,
      private DayEndService: DayEndService, private FiscalYearService: FiscalYearService, private modalService: NgbModal) {
      this.voucherDetails = new Array<openingBalanceDetails>();
      this.logedInUserID = this.LoginService.getSession('user_ID');
      this.userOffice = this.LoginService.getSession('userOffice');
      this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
      this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
      this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  }
  ngOnInit() {
      this.getOpeningBalance(this.ID);
      this.getCurrentDay();
      this.setPageInfo(40016);
      this.voucheR_DATE = new cDate();
      this.getAccountCode("supplier", 0);
      this.permissionUtility.setPagePermissions(140001);
      this.permissionUtility.setPermissionItem1(140011);
      this.permissionUtility.setPermissionItem2(140104);
      this.permissionUtility.setPermissionItem3(140104);
  }
   ////////////////////////
setPageInfo(value) {
  var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
  if (FUNCTIONALITY.length >= 1) {
    var arr = FUNCTIONALITY.filter(f => f.page_Code == value);
    //console.log(arr);
    if (arr.length > 0) {
      this.FUNCTIONALITYNAME = arr[0].page_Name;
      //console.log( arr[0].page_Name);
      this.FUNCTIONALITYDETAILNAME = arr[0].pd;
      //console.log('C' +arr[0].pd);
      //RolePermissions
      if (arr[0].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
      if (arr[0].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
      if (arr[0].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
      if (arr[0].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
      if (arr[0].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

      //AuditTrail
      this.UserSessionID = arr[0].userSessionID;
    }
  }
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
              //this.voucheR_DATE.setDate(this.fiscalYear[0].enD_DT);
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
  getOpeningBalance(value: string) {
      this.isLoading =true;
      this.service.getOpeningBalance(value, this.userPrivilegedOffice)
          .subscribe(response => {
              if(response.json() !== null){
                this.vouchers = (response.json());
                //console.log(this.vouchers);
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
  //getSupplier
  getSupplier()
  {
      this.service.getSupplier().
      subscribe(response => {
          this.supplier = (response.json());
          let ar: Array<voucherDetails> = [];
          if (this.accountt  != null) 
          {
                let payableCode =  this.accountt[1].account_Code;
                let receiveableCode = this.accountt[0].account_Code;
                let payableTitle =  this.accountt[1].account_Title;
                let receiveableTitle =  this.accountt[0].account_Title;
                if(this.supplier != null)
                {

                    this.supplier.forEach
                        (
                            function (obj1) 
                            {
                                if(obj1["balanceType"]==1)
                                ar.push(new voucherDetails(0, payableCode, payableTitle, obj1["openingBalance"], 0, obj1["supplier_ID"] + " : " + obj1["supplier_Name"], 1, 1, 1,'', 'O', 1, '', obj1["supplier_ID"],'' , '', 0, null,0));
                                if(obj1["balanceType"]==2)
                                ar.push(new voucherDetails(0, receiveableCode, receiveableTitle, 0, obj1["openingBalance"], obj1["supplier_ID"] + " : " + obj1["supplier_Name"], 1, 1, 1, '', 'O', 1, '', obj1["supplier_ID"],'' , '', 0, null,0));
                            }
                        );
                    this.voucherDetails = ar;
                    if(this.voucherDetails.length < 1)
                    {
                        $("#submitAdd").prop("disabled", true);
                    }
                }
                else
                {
                    $("#submitAdd").prop("disabled", true);
                    swal("No Record Found","", "info" )
                }
          }
      })
  }
   //getCustomer
  getCustomer()
  {
      this.service.getCustomer().
      subscribe(response => {
          this.customer = (response.json());
          //console.log(this.customer);
          let ar: Array<voucherDetails> = [];
          if (this.accountt  != null) 
          {
                let payableCode =  this.accountt[1].account_Code;
                let receiveableCode = this.accountt[0].account_Code;
                let payableTitle =  this.accountt[1].account_Title;
                let receiveableTitle =  this.accountt[0].account_Title;
                if(this.customer != null)
                {

                    this.customer.forEach
                        (
                            function (obj1) 
                            {
                                if(obj1["balanceType"]==1)
                                ar.push(new voucherDetails(0, receiveableCode, receiveableTitle, obj1["openingBalance"], 0, obj1["customer_ID"] + " : " + obj1["customer_Name"], 1, 1, 1,'', 'O', 1, '', null,'' , '', 0, obj1["customer_ID"],0));
                                if(obj1["balanceType"]==2)
                                ar.push(new voucherDetails(0, payableCode, payableTitle, 0, obj1["openingBalance"], obj1["customer_ID"] + " : " + obj1["customer_Name"], 1, 1, 1, '', 'O', 1, '', null,'' , '', 0, obj1["customer_ID"],0));
                            }
                        );
                    this.voucherDetails = [];
                    this.voucherDetails = ar;
                    if(this.voucherDetails.length < 1)
                    {
                        $("#submitAdd").prop("disabled", true);
                    }
                }
                else
                {
                    $("#submitAdd").prop("disabled", true);
                    swal("No Record Found","", "info" )
                }
          }
      })
  }
  //getItem
  getItem(){
    this.service.getItem().
    subscribe
    (response => 
      {
          this.item = (response.json());
          let ar: Array<voucherDetails> = [];
          if (this.accountt  != null) 
          {
                let payableCode =  this.accountt[0].accounT_CODE;
                let payableTitle =  "Stock on Hand";
                if(this.item != null)
                {

                    this.item.forEach
                        (
                            function (obj1) 
                            {
                                
                                ar.push(new voucherDetails(0, payableCode, payableTitle, obj1["openingBalance"], 0, obj1["itemName"], 1, 1, 1,'', 'O', 1, '', null,'' , '', 0, '', obj1["itemCode"]));
                                
                                
                            }
                        );
                    this.voucherDetails = [];
                    this.voucherDetails = ar;
                    if(this.voucherDetails.length < 1)
                    {
                        $("#submitAdd").prop("disabled", true);
                    }
                }
                else
                {
                    $("#submitAdd").prop("disabled", true);
                    swal("No Record Found","", "info" )
                }
          }
      }
    )
  }
   //getAccountCode
  getAccountCode(account:any, su:any)
  {
      this.service.getAccountCode(account).
      subscribe
      (response => 
        {
            this.accountt   = (response.json());
            if(su == 1)
            {
                if(account=="customer"){
                    this.getCustomer();
                }
                else if(account=="item"){
                    this.getItem();
                }
                else{
                    this.getSupplier();
                }
            }
            
        }
      )
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
      this.customerCode =0;
      this.supplierCode =0;
      this.itemCode =0;
      this.credit = 0;
      this.debit = 0;
      this.particulars = '';


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
  changeMode(idx: any, i: openingBalanceDetails, Mode: any) {

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
        if(!this.mode)
        {
          this.accounT_CODE = 0;
          this.accounT_TITLE = '';
        }
        //   if (this.TotalDebit() == this.TotalCredit())
        //       $("#submitAdd").prop("disabled", false);
        //   else
        //       $("#submitAdd").prop("disabled", true);
          //} else {
          //  alert("Already Exists");
          //}
      }
      else if (Mode == 2) 
      {
          this.voucherDetails.splice(idx, 1);
          if (this.voucherDetails.length > 0) 
          {

              $("#submitAdd").prop("disabled", false);
              $("#submitUpdate").prop("disabled", false);
          }
          else 
          {

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
  updateItem(i: openingBalanceDetails, accounT_CODE: any, accounT_TITLE: any) {
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

                  $("#submitAdd").prop("disabled", false);
                  $("#submitUpdate").prop("disabled", false);
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
          .subscribe((o: openingBalance) => {
              console.log('--------'+ o);
              this.voucheR_ID = o.voucher_ID;
              this.voucheR_DATE.setDate(o.voucheR_DATE);
              this.officE_CODE = o.officE_CODE;
              this.credit = o.credit;
              this.accounT_CODE = o.accounT_CODE;
              this.accounT_TITLE = o.accounT_TITLE;
              this.debit = o.debit;
              this.customerCode =o.itemCode;
              this.supplierCode =o.supplierCode;
              this.itemCode =o.itemCode;
              this.isUpdateable = o.isUpdateable;

              this.voucherDetails.push(new voucherDetails(this.voucheR_ID, o.accounT_CODE, o.accounT_TITLE, o.debit, o.credit, o.particulars, 1, 1, o.cosT_CENTER_CODE, o.abbr, 'O', 1, '', '', '', '', 0,'',0));
            


              this.service.getOffices(this.userPrivilegedOffice)
                  .subscribe(response => {
                      this.offices = (response.json());
                  });
                  
             if((this.itemCode == 0 || this.itemCode == null) && (this.supplierCode == 0 || this.supplierCode == null) && (this.customerCode==0 || this.customerCode == null))
             {
                $("#AddNewItemRow").hide();
                this.EditItemButton = '';
                this.RemoveItemButton = '';
                this.showEye = true;
                $("#submitAdd").hide(); 
                if(this.PermissionEdit==" " || this.PermissionEdit==''){
                $("#submitUpdate").show();
                $("#submitUpdate").prop("disabled", false);}
             }
             else
             {
                
                $("#AddNewItemRow").hide();
                this.EditItemButton = 'none';
                this.RemoveItemButton = 'none';
                $("#submitAdd").hide(); 
                if(this.PermissionEdit==" " || this.PermissionEdit==''){
                $("#submitUpdate").show();
                $("#submitUpdate").prop("disabled", true);}
                 
             }

          });

  }
  //saveVoucher
  saveVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any, isUpdateable:any) {
      this.isLoading =true;
      var order = new openingBalance(0, 0, this.voucheR_DATE.getDateFinal(),this.voucheR_DATE.getDateFinal(), this.officE_CODE, "", "", "", "", null, 0, 5, debit, credit, 1, "", this.Page_Code, this.voucher_GUID, "", "", "", this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.accounT_CODE,this.accounT_TITLE,this.debit,this.credit,this.particulars,"","",this.cosT_CENTER_CODE,this.abbr, "",1,"","","","",1,this.voucherDetails, this.fiN_YR, 0, isUpdateable);


      if (debit > 0 || credit > 0) {
          this.service.saveVoucher(order).then(
              (response) => {
                  this.isLoading = false;
                  this.getOpeningBalance(this.ID);
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
  updateVoucher(voucheR_DATE: any, officE_CODE: any, debit: any, credit: any, isUpdateable:any) {
      this.isLoading =true;
      var order = new openingBalance(this.voucheR_ID, 0, this.voucheR_DATE.getDateFinal(), this.voucheR_DATE.getDateFinal(),this.officE_CODE, "", "", "", "", null, 0, 5, debit, credit, 1, "", this.Page_Code, this.voucher_GUID, "", "", "", this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.accounT_CODE,this.accounT_TITLE,this.debit,this.credit,this.particulars,"","",this.cosT_CENTER_CODE,this.abbr, "",1,"","","","",1,this.voucherDetails, this.fiN_YR,0, isUpdateable);

      if (debit > 0 || credit > 0) {
          this.service.updateVoucher(order).then(
              (response) => {
                  this.isLoading = false;
                  this.getOpeningBalance(this.ID);
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
      $("#submitUpdate").prop("disabled", false);
  }
  openSupplierContent(supplierContent) {
      
    this.modalReference = this.modalService.open(supplierContent, { size: 'xlg' });
    this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();
    this.getAccountCode("supplier", 1);
    
    $("#submitAdd").show();
    $("#submitUpdate").hide();
}

openCustomerContent(customerContent)
{
    this.modalReference = this.modalService.open(customerContent, { size: 'xlg' });
    this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();
    this.getAccountCode("customer", 1);
    
    $("#submitAdd").show();
    $("#submitUpdate").hide();
}
openStockContent(stockContent)
{
    this.modalReference = this.modalService.open(stockContent, { size: 'xlg' });
    this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();
    this.getAccountCode("item", 1);
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
   //routePage
   routePage(value) {
    if (value == 1)
      this.router.navigate(['/supplier-opening-balance']);
    else if(value ==3)
        this.router.navigate(['/item-opening-balance']);
    else
      this.router.navigate(['/customer-opening-balance']);
  }
}
