import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StockOpeningBalanceService} from '../../../../shared/services/SupplyChain/Inventory/stock-opening-balance/stock-opening-balance.service';
import { StockOpeningBalance} from '../../../../shared/models/SupplyChain/Inventory/StockOpeningBalance';
import { StockOpeningBalanceDetail} from '../../../../shared/models/SupplyChain/Inventory/StockOpeningBalanceDetail';
import { cDate, SaleOrderService, NgbDateFRParserFormatter, DayEndService, FiscalYearService, LoginService, voucherDetails, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-opening-balance',
  templateUrl: './stock-opening-balance.component.html',
  styleUrls: ['./stock-opening-balance.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class StockOpeningBalanceComponent implements OnInit {
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
  warehouses:any[] = [];
  costCenter: any[];
  unitofMeasurements: any[] = [];
  packingTypes: any[] = [];
  closeResult: string;
  officE_CODE: any = 1;
  officE_NAME: any;
  warehouseID: any =0;
  warehouseName: any = '';
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
  stockOpeningBalanceDetail: any[];
  supplier: any[];
  customer: any[];
  accountt: any[];
  item: any[];
  editMode = false;
  itemCode: any = 0;
  itemName: any = "";
  qty: any = 0;
  openingUnitCost: any = 0;
  openingBalance: any = 0;
  openingStock: any = 0;
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

  openingBalanceDisable: any = false;
  openingUnitCostDisable: any = false;
  packing_Type_ID: any = 0 ;
  uoM: any = '';
  packingQuantity: any = 0.00;
  unit: any = '';
  openingLooseStock: any = 0;
  public permissionUtility: PermissionUtility = new PermissionUtility();
  constructor(public router: Router,private service: StockOpeningBalanceService, private ngbDateParserFormatter: NgbDateParserFormatter, private LoginService: LoginService,
      private DayEndService: DayEndService, private FiscalYearService: FiscalYearService, private modalService: NgbModal, private SOService: SaleOrderService) {
      this.stockOpeningBalanceDetail = new Array<StockOpeningBalanceDetail>();
      this.logedInUserID = this.LoginService.getSession('user_ID');
      this.userOffice = this.LoginService.getSession('userOffice');
      this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
      this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
      this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');

      

  }
  ngOnInit() {
      this.getStockOpeningBalance(this.ID);
      this.getCurrentDay();
      //this.setPageInfo(40016);
      this.voucheR_DATE = new cDate();
      this.permissionUtility.setPagePermissions(140063); 
      //this.permissionUtility.setPagePermissions(140001);
      //this.permissionUtility.setPermissionItem1(140011);
      //this.permissionUtility.setPermissionItem2(140104); 


      this.LoginService.getCurrentWareshouse(this.officE_CODE)
      .subscribe(response => {
        this.warehouses = (response.json());
        if (this.warehouses != null) {
          this.warehouseID = this.warehouses[0].warehouseID;
        }
      });
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
              this.voucheR_DATE.setDate(this.currentDate.getDateFinal());
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
  getStockOpeningBalance(value: string) {
      this.isLoading =true;
      this.service.getStockOpeningBalance(value, this.userPrivilegedOffice)
          .subscribe(response => {
              this.vouchers = (response.json());
              console.log(this.vouchers);
              this.isLoading = false;
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
              this.accounts = this.getDropdownList(response.json(), "item_Code", "item_Name");
              this.itemCode = this.accounts[0].id;
              this.itemName = this.accounts[0].text;
              
                console.log(response.json());
                this.isLoading =true;
                this.service.getUnits(this.itemCode)
                    .subscribe(response => {
                    var Units = (response.json());
                    this.unit = Units[0].packingType;
                    this.uoM = Units[0].measurementUnit;
                    this.packingQuantity = Units[0].packingQuantity;
                        this.isLoading = false;
                    });
          });
  }
  

  //getChangeAccounts
  getChangeAccounts(e: any) {
      this.itemCode = e;
      if (this.accounts.length >= 1) {
          for (let i = 0; i < this.accounts.length; i++)
              if (this.accounts[i].id == this.itemCode) {
                  this.itemName = this.accounts[i].text;
              }
      }
      this.service.getUnits(this.itemCode)
                    .subscribe(response => {
                    var Units = (response.json());
                    this.unit = Units[0].packingType;
                    this.uoM = Units[0].measurementUnit;
                    this.packingQuantity = Units[0].packingQuantity;
                        this.isLoading = false;
                    });
  }
  
  //clearFields
  clearFields() {
      this.mode = 0;
      this.remarks = "";
      $("#AddNewItemRow").show();
      this.EditItemButton = '';
      this.RemoveItemButton = '';
     this.voucheR_DATE = new cDate();
      this.getOffices();
      this.voucher_GUID = UUID.UUID();
      this.stockOpeningBalanceDetail = [];
      this.getCurrentFiscalYear();

  }
  //TotalopeningUnitCost
  TotalopeningUnitCost() {
      var totalopeningUnitCost = 0;
      if (this.stockOpeningBalanceDetail.length > 0) {
          for (var count = 0; count < this.stockOpeningBalanceDetail.length; count++) {
              totalopeningUnitCost += this.stockOpeningBalanceDetail[count].openingUnitCost;
          }
      }

      return totalopeningUnitCost.toFixed(2);
  }
  //TotalopeningBalance
  TotalopeningBalance() {
      var totalopeningBalance = 0;
      if (this.stockOpeningBalanceDetail.length > 0) {
          for (var count = 0; count < this.stockOpeningBalanceDetail.length; count++) {
              totalopeningBalance += this.stockOpeningBalanceDetail[count].openingBalance;
          }
      }

      return totalopeningBalance.toFixed(2);
  }
  //changeopeningUnitCost
  changeOpeningUnitCost(openingStock, OpeningUnitCost,openingLooseStock) {
      if (OpeningUnitCost > 0 && openingStock > 0) {
          this.openingBalance = (OpeningUnitCost * openingStock) + ((OpeningUnitCost/this.packingQuantity) * openingLooseStock);
      }
      else {
          
      }
  }
  //changeopeningBalance
  changeOpeningStock(openingStock, OpeningUnitCost,openingLooseStock) {
       
    if (OpeningUnitCost > 0 && openingStock > 0) {
        this.openingBalance = (OpeningUnitCost * openingStock) + ((OpeningUnitCost/this.packingQuantity) * openingLooseStock);
    }
    else {
        
    }
  }
  //changeDC
  changeDC(i:StockOpeningBalanceDetail)
  {
      
      i.openingBalance = i.openingStock * i.openingUnitCost;
     

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
  changeMode(idx: any, i: StockOpeningBalanceDetail, Mode: any) {

      var flag = false;
      if (this.stockOpeningBalanceDetail.length > 0) {
          for (var count = 0; count < this.stockOpeningBalanceDetail.length; count++) {
              if (this.stockOpeningBalanceDetail[count].itemCode == i.itemCode && idx != count) {
                  
                  flag = true;
                  break;
              }
          }
      }
      if (Mode == 0) {

          //if (flag == false) {      
          i.itemCode = this.itemCode;
          i.itemName = this.itemName;
          //i.cosT_CENTER_TYPE = "O";
          i.edit_Mode = false;
          this.itemCode = 0;
          this.itemName = '';
         
      }
      else if (Mode == 2) 
      {
          this.stockOpeningBalanceDetail.splice(idx, 1);
          if (this.stockOpeningBalanceDetail.length > 0) 
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
              if (this.accounts[j].id == i.itemCode) {
                  this.itemCode = this.accounts[j].id;
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
          $("#openingBalance").prop("disabled", false);
          $("#openingUnitCost").prop("disabled", false);
          //this.textboxItemEditFlag = false;

      }
  }
  //updateItem 
  updateItem(i: StockOpeningBalanceDetail, itemCode: any, itemName: any) {
      i.itemCode = itemCode;
      i.itemName = itemName;
  }
  //addGrid
  addGrid(itemCode: any, itemName: any, openingStock: any, cosT_CENTER_CODE: any, OpeningUnitCost: any, OpeningBalance: any) {
      
      if (this.itemCode != 0) {
          if (OpeningUnitCost > 0 && openingStock > 0) {
              var flag = false;
              if (this.stockOpeningBalanceDetail.length > 0) {
                  for (var count = 0; count < this.stockOpeningBalanceDetail.length; count++) {

                      if (this.stockOpeningBalanceDetail[count].itemCode == itemCode) {
                          flag = true;
                          break;
                      }
                  }
              }
              //if (flag == false) {
              this.stockOpeningBalanceDetail.push(new StockOpeningBalanceDetail(0,0,null,null,this.officE_CODE,this.remarks,null,null,this.logedInUserID,this.UserSessionID, this.itemCode, this.itemName, this.openingUnitCost, this.openingBalance, this.openingStock, 0,this.warehouseID, this.openingLooseStock, this.uoM, this.unit));
              this.editMode = false;
              this.itemCode = 0;
              this.itemName = '';
              this.openingStock = 0;
              this.openingLooseStock = 0;
              this.uoM = '';
              this.unit = '';
              //}
              //else {
              //  alert("Already Exists");
              //}
              $("#submitAdd").prop("disabled", false);
              $("#txt").focus();
              this.openingUnitCost = 0;
              this.openingBalance = 0;
              $("#openingBalance").prop("disabled", false);
              $("#openingUnitCost").prop("disabled", false);
              //this.scrollToBottom();


            //   if (this.TotalopeningUnitCost() == this.TotalopeningBalance()) {

            //       $("#submitAdd").prop("disabled", false);
            //       $("#submitUpdate").prop("disabled", false);
            //   }
            //   else {

            //       $("#submitAdd").prop("disabled", false);
            //       $("#submitUpdate").prop("disabled", false);
            //   }
          }
          else {
              swal("Qty And Unit Cost  must be greater then 0.","","warning");
          }
      }
      else
          swal("Select Item!","","warning");
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
          .subscribe((o: StockOpeningBalance) => {
              console.log('--------'+ o);
              this.voucheR_ID = o.voucher_ID;
              this.voucheR_DATE.setDate(o.voucheR_DATE);
              this.officE_CODE = o.officE_CODE;
              this.openingBalance = o.openingBalance;
              this.itemCode = o.itemCode;
              this.itemName = o.itemName;
              this.openingUnitCost = o.openingUnitCost;
              this.stockOpeningBalanceDetail.push(new StockOpeningBalanceDetail(0,0,'','',o.officE_CODE,o.remarks,'','',o.created_By,o.userSessionID, o.itemCode, o.itemName, o.openingUnitCost, o.openingBalance, o.openingStock, 0,this.userCurrentWarehouse, 0));
            


              this.service.getOffices(this.userPrivilegedOffice)
                  .subscribe(response => {
                      this.offices = (response.json());
                  });

             
              $("#AddNewItemRow").hide();
              this.EditItemButton = 'none';
              this.RemoveItemButton = 'none';
              $("#submitAdd").hide(); 
              if(this.PermissionEdit==" " || this.PermissionEdit==''){
              $("#submitUpdate").show();
              $("#submitUpdate").prop("disabled", true);}

          });

  }
  //saveVoucher
  saveVoucher(voucheR_DATE: any, officE_CODE: any, openingUnitCost: any, openingBalance: any) {
      this.isLoading =true; 
      var order = new StockOpeningBalance(0, 0, this.voucheR_DATE.getDateFinal(), this.voucheR_DATE.getDateFinal(),this.officE_CODE, 0, this.Page_Code, this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.itemCode,this.itemName,this.openingUnitCost,this.openingBalance,this.openingStock,0,this.stockOpeningBalanceDetail, this.fiN_YR);


      if (openingUnitCost > 0 && openingBalance > 0) {
          this.service.saveVoucher(order).then(
              (response) => {
                  this.isLoading = false;
                  this.getStockOpeningBalance(this.ID);
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
  updateVoucher(voucheR_DATE: any, officE_CODE: any, openingUnitCost: any, openingBalance: any) {
      this.isLoading =true;
      var order = new StockOpeningBalance(0, 0, this.voucheR_DATE.getDateFinal(), this.voucheR_DATE.getDateFinal(),this.officE_CODE, 0, this.Page_Code, this.remarks, null, null, this.logedInUserID, this.UserSessionID, this.itemCode,this.itemName,this.openingUnitCost,this.openingBalance,this.openingStock,0,this.stockOpeningBalanceDetail, this.fiN_YR);

      if (openingUnitCost > 0 || openingBalance > 0) {
          this.service.updateVoucher(order).then(
              (response) => {
                  this.isLoading = false;
                  this.getStockOpeningBalance(this.ID);
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
