
import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DailyVehicleRoutService, LoginService, DayEndService, customer, DailyVehicleRout, DailyVehicleRoutDetail, cDate, NgbDateFRParserFormatter, FileAttachmentService, PermissionUtility, SaleOrderService } from '../../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'app-daily-vahicle-rout',
  templateUrl: './daily-vahicle-rout.component.html',
  styleUrls: ['./daily-vahicle-rout.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DailyVahicleRoutComponent implements OnInit {
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility:PermissionUtility=new PermissionUtility(); 
  public valid:Validation=new Validation();
  //Member Variables
  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  order: any;
  status: any;
  orders: any[] = [];
  users: any[];
  customers: Array<Select2OptionData> = [];
  contacts: any[];
  items: Array<Select2OptionData>;
  unitPrices: any[];
  DailyVehicleRoutDetails: any[];
  DailyVehicleRoutDetail: any;
  TempReceiveDetails: any[];
  editMode = false;
  index = 1;
  public date = new cDate();
  public dayEndDate = new cDate();
  order_Envoy: any = 1;
  sale_Order_ID = 0;
  Office_Code: any;
  public customer_ID: any;
  public customer_Name: any;
  remarks: any;
  public officer_ID: any;
  public officer_Name: any;
  IsUpdate: any;
  Quantity: any = 1;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  hideStock = true;
  allowOW = false;
  hidePending = true;
  unit_Price: any = 0;
  foucs: any;
  isLoading: boolean;
  color = '#0094ff';
  guidOrder: boolean;
  stocks: any[];
  stock_Qty: any = 0;
  pending: any = 0;
  priviledged_Offices: any = '';
  good_Receive_ID: any = 0;
  order_Qty: any = 1;
  quantity: any = 1;
  daily_Vehicle_Rout_ID: any = 0;
  challan_NO: any = "";
  closeResult: string;
  grnID: any = 0;
  id: any = "";
  isStamp: any = false;
  beforeInvoice: any = true;
  dayEndDetail: any[] = [];
  alerts: Array<any> = [];
  cancelReturn: any;
  actionID: any = 5;
  cancelStock: any[] = [];
  cancelStockStatus: any = false;
  gdnStatus: any;
  driver: any = '';
  vehicle: any = '';
  dispatchFrom: any = '';
  isView: any = true;
  //End Member Variables
  
  companytemplate: any[] = [];
  templatecode: any = this.LoginService.getSession('DefaultCompanyTemplate');
  templatename: any = '';
  templateshow: any = '';
  reportName: any = '';
  isRPReport: any = false;
  sortOrder: any = 1;

  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  officE_CODE: any;
  officE_NAME: any = "";
  warehouseID: any;
  warehouse: any = "";
  unit: any = 0;
  unitList: any[] = [];
  area_ID: any = 0;
  area_Name: any = "";
  vehicle_ID: any = 0;
  vehicles: any[] = [];
  areas: any[] = [];
  drivers: any[] = [];
  helpers: any[] = [];
  selectedAll: any= false;
  chk: any = false;
  detail: any[] = [];
  ID: any = "";
  readonly: any = false;
  Emps: any = [];
  driver_ID: any=0;
  helper_ID: any=0;
  constructor(
    private service: DailyVehicleRoutService,
    private LoginService: LoginService,
    private fileservice: FileAttachmentService,
    private DayEndService: DayEndService,
    private orderService: SaleOrderService,
    private modalService: NgbModal) {
    this.DailyVehicleRoutDetails = new Array<DailyVehicleRoutDetail>();

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');


    this.priviledged_Offices = this.userPrivilegedOffice;
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
    this.searchVehicleRout(this.id);
    this.getvehicles();
    this.getDrivers();
    this.getHelpers();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    if (this.LoginService.getSession('AllowAttachmentSale') == '1')
      this.ShowAttachment = '';
    ////////////////////////Set Name From Session Storage///////////////////////////
      this.permissomUtility.setPagePermissions(140016);
      this.getUnit();
      this.getEmp();
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
    this.date.setDate(this.LoginService.getSession('currentOpenDay'));
    this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
    //});
  }

  //getCompanyTemplate
  getCompanyTemplate() {
    if (this.LoginService.getSession('ShowCompanyTemplate') != '1') {
      this.templateshow = 'none';
    }
    else {
      this.templateshow = '';
      this.isLoading = true;
      this.service.getCompanyTemplate(this.userCurrentOffice, 140007, false)
        .subscribe(response => {
          this.companytemplate = (response.json());
          this.templatecode = this.companytemplate[0].templatecode;
          this.isLoading = false;
        });
    }

  }
   getUnit()
   {
     this.service.getUnits().subscribe(response => {
       this.unitList = (response.json());
     })
   }
  //changeGDDate
  changeGDDate(pO_Date) {
    if (this.date.getStandardDate() < this.dayEndDate.getStandardDate())
      this.date.setDate(this.dayEndDate.getDateFinal());
  }
  //orderDetails 
  searchVehicleRout(value: string) {
    this.isLoading = true;
    this.service.searchVehicleRout(value)
      .subscribe(response => {
          this.order = (response.json());
          this.isLoading = false;
            console.log(response.json());
        
      });
  }
  //orderDetails 
  orderDetails(value: string) {
    this.isLoading = true;
    this.service.orderDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json() !== null){
          this.order = (response.json());
          this.isLoading = false;
          //   console.log(response.json());
        }
        else{
          this.order = [];
          this.isLoading = false;
        }
      });
  }
  //IfExists
  IfExists(sale_Order_ID) {
    this.service.IfExists(sale_Order_ID, this.daily_Vehicle_Rout_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);

        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.users = (response.json());
        console.log(this.users);
        if (this.users != null) {
          for (let i = 0; i < this.users.length; i++)
            if (this.users[i].order_Envoy == this.logedInUserID) {

              //alert(this.logedInUserID);
              var timer = setTimeout(() => this.order_Envoy = this.users[i].emP_CODE, 500);
            }
            else { this.order_Envoy = this.users[0].emP_CODE; }
        }
        else { this.order_Envoy = this.users[0].emP_CODE; }
      });
  }
  getName(id)
  {
    return this.Emps.filter(f=>f.emP_CODE == id)[0].emp_Name;
  }
  //getAreas
  getAreas() {
    this.orders = [];
    this.isLoading = true;
    this.service.getAreas(0, this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.areas = this.getDropdownList(response.json(), "area_ID", "area_Name");
          this.area_ID = this.areas[0].area_ID;
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }

      });
  }
  getvehicles() {
    this.orders = [];
    this.isLoading = true;
    this.service.getvehicles(0, this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.vehicles = this.getDropdownList(response.json(), "vehicle_ID", "vehicle_Name");
          console.log(this.vehicles)
          this.vehicle_ID = this.vehicles[0].vehicle_ID;
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }

      });
  }

  getDrivers() {
    this.orders = [];
    this.isLoading = true;
    this.service.getDrivers()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.drivers = this.getDropdownList(response.json(), "driver_ID", "driver_Name");
          console.log(this.drivers)
          this.driver_ID = this.vehicles[0].driver_ID;
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }

      });
  }
  getHelpers() {
    this.orders = [];
    this.isLoading = true;
    this.service.getHelpers()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.helpers = this.getDropdownList(response.json(), "helper_ID", "helper_Name");
          console.log(this.helpers)
          this.helper_ID = this.helpers[0].helper_ID;
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
        }

      });
  }
  getOfficers()
  {
    this.service.getOfficers(this.area_ID, this.date.getDateFinal(), this.vehicle_ID)
        .subscribe(response => {
          this.isLoading = false;
          if (response.json() != null) {
            if (response.json()[0].officer_ID != 0) {
              this.DailyVehicleRoutDetails = (response.json());
              console.log(this.DailyVehicleRoutDetails);
              //this.officer_ID = this.DailyVehicleRoutDetails[0].officer_ID;
              this.officer_Name = this.DailyVehicleRoutDetails[0].officer_ID + '-' + this.DailyVehicleRoutDetails[0].officer_Name;
              $("#submitAdd").prop("disabled", false);
            }
            else
            {
              this.DailyVehicleRoutDetails = [];
              //swal("There is no Record on selected date","","info");
            }
          }
          else
          {
            this.DailyVehicleRoutDetails = [];
            //swal("There is no Record on selected date","","info");
          }
        });
  }
  //changeCustomer
  changeArea(e: any) {
    if (this.mode != true) {
      this.isLoading = true;
      this.area_ID = e;
      this.getOfficers();
    }
  }
  changeVehicle(e: any) {
    if (this.mode != true) {
      this.isLoading = true;
      this.vehicle_ID = e;
    }
  }
  changeDrivers(e: any) {
    if (this.mode != true) {
      this.isLoading = true;
      this.driver_ID = e;
    }
  }
  changeHelpers(e: any) {
    if (this.mode != true) {
      this.isLoading = true;
      this.helper_ID = e;
    }
  }
  //allowOfficeWarehouse
  allowOfficeWarehouse() {
    if (sessionStorage.getItem('AllowOfficeWarehouse') != "1") {
      this.allowOW = false;
    }
    else {
      this.allowOW = true;
      //this.userCurrentOffice = this.officE_CODE;
      //this.userCurrentWarehouse = this.warehouseID;
    }
  }

   //selectAll
   selectAll() {
    // this.selectedAll = true;
    for (var i = 0; i < this.DailyVehicleRoutDetails.length; i++) {
       
          this.DailyVehicleRoutDetails[i].status = this.selectedAll;
    }
  }
  //checkIfAllSelected
  checkIfAllSelected() {
    for (let i = 0; i < this.DailyVehicleRoutDetails.length; i++) {
       
      this.chk = this.DailyVehicleRoutDetails[i].status;
      if (this.chk == true) {
        this.daily_Vehicle_Rout_ID = this.DailyVehicleRoutDetails[i].daily_Vehicle_Rout_ID;
        this.detail.push(this.daily_Vehicle_Rout_ID);
      }
    }
  }
  getEmp()
  {
    this.service.getEmp()
      .subscribe(response => {
        this.isLoading = false;
          if (response.json() != null) {
            this.Emps = (response.json());
           
          }
        

      });
  }
  //clearFields
  clearFields() {
    this.order_Envoy = this.logedInUserID;
    this.remarks = "";
    this.officer_ID = 0;
    this.Quantity = 1;
    //this.order = [];
    this.customers = [];
    this.DailyVehicleRoutDetails = [];
    this.guid = UUID.UUID();
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.mode = false;
    this.btnmode = true;
    this.driver = '';
    this.vehicle = '';
    this.dispatchFrom = '';
    this.officE_CODE = 0;
    this.officE_NAME = "";
    this.warehouseID = 0;
    this.warehouse = "";
    $("#alertWarning").hide();
    $("#sale_Order_ID").prop("disabled", false);
  }
  //orderChange
  changeOrder(customer_ID, sale_Order_ID) {
    this.DailyVehicleRoutDetails = [];
    this.isLoading = true;
    this.service.getPendingOrderDetails(this.userCurrentOffice, this.userCurrentWarehouse, customer_ID, sale_Order_ID, this.daily_Vehicle_Rout_ID, this.mode, this.beforeInvoice)
      .subscribe(response => {
        this.isLoading = false;

        if (this.customer_ID == 0 && this.btnmode == true)
          this.orders = [];
        else {
          if (response.json() != null) {
            this.DailyVehicleRoutDetails = (response.json());
            if (this.mode)
              this.TempReceiveDetails = (response.json());
            $("#submitAdd").prop("disabled", false);
          }
        }

      });
  }
  //changeQty
  changeQty(quantity) {
    if (quantity <= 0) {
      this.quantity = 1;
    }
  }
  //changeQuantity
  
  //getDetailsByID
  getDetailsByID(daily_Vehicle_Rout_ID, content) {
    this.mode = true;
    this.btnmode = false;
    //this.getPriviledgedOffices();
    this.scrollToBottom();
    this.getDetailsView(daily_Vehicle_Rout_ID);
    this.detailOpen(content);
  }
  //getDetailsView
  getDetailsView(daily_Vehicle_Rout_ID) {
    this.isLoading = true;
    this.service.getDetailsByID(daily_Vehicle_Rout_ID)
      .subscribe((o: DailyVehicleRout) => {
        this.isLoading = false;
        console.clear();
        console.log(o);
        setTimeout(() => {
        //this.daily_Vehicle_Rout_ID = o.daily_Vehicle_Rout_ID;
        this.date.setDate(o.date);
        //this.id = o.daily_Vehicle_Rout_ID;
        this.vehicle_ID = o.vehicle_ID;
        this.area_ID = o.area_ID; 
        this.driver_ID = o.driver_ID;
        this.helper_ID = o.helper_ID;
        this.DailyVehicleRoutDetails = o.dailyVehicleRoutDetail;
        }, 150);
        
        

        console.log('lid', o);
        if (o.cancel == 1) {
          $("#alertWarning").show();
          $("#cancelBtn").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);

        }
        else {
          this.isLoading = true;
          this.service.IfExists(this.sale_Order_ID, this.daily_Vehicle_Rout_ID)
            .subscribe(response => {
              this.isLoading = false;
              this.status = (response.json());
              if (this.status == true) {
                $("#alertWarning").show();
                $("#submitUpdate").prop("disabled", true);
                $("#cancelBtn").prop("disabled", true);


              }
              else {
                $("#alertWarning").hide();
                $("#submitUpdate").prop("disabled", false);
                $("#cancelBtn").prop("disabled", false);
                this.IfGDNExists(this.daily_Vehicle_Rout_ID, this.customer_ID, this.sale_Order_ID);
              }
            });
        }
        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            this.users = [];
            if (response.json() != null) {
              this.users = (response.json());
              console.log('usr', this.users);
            }
          });

        this.isLoading = true;
        

        this.guid = o.gSGUID;
        this.getFiles(this.guid);
      });

  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      if (this.btnmode)
        ar.push({
          id: 0,
          text: ''
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
  //IfExists
  guidExist(guid: any) {
    this.service.guidExist(guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
      });
  }
  //IfGDNExists
  IfGDNExists(daily_Vehicle_Rout_ID, customer_ID, sale_Order_ID) {
    this.service.IfGDNExists(daily_Vehicle_Rout_ID, customer_ID, sale_Order_ID)
      .subscribe(response => {
        var statusList = (response.json());
        console.log(response.json());
        this.gdnStatus = statusList[0].status;
        if (this.gdnStatus == 1) {
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
  //addGrid
  addGrid(item_Code: any, officer_Name: any, Unit_Price: any, supply_Qty: any) {
    //if (this.stock_Qty != null && this.stock_Qty >= receive_Qty) {
    if (officer_Name != null) {
      if (supply_Qty > 0) {
        var flag = false;
        if (this.DailyVehicleRoutDetails.length > 0) {
          for (var count = 0; count < this.DailyVehicleRoutDetails.length; count++) {
            if (this.DailyVehicleRoutDetails[count].item_Code == item_Code) {
              flag = true;
              break;
            }
          }
        }

        if (flag == false) {
          this.DailyVehicleRoutDetails.push(new DailyVehicleRoutDetail(0, 0, item_Code, officer_Name, 0,0));
          this.editMode = false;
        } else {
          swal("Already Exists");
        }
      }
      else {
        swal("- Qty is required. Qty not be zero and should be numeric.");
      }
    } else {
      swal("Item is Required.");
    }
    //} else {
    //  alert("Stock is not available." + this.stock_Qty + "");
    //  $("#submitAdd").prop("disabled", true);
    //}
    $("#submitAdd").prop("disabled", false);
    $("#txt").focus();
    this.scrollToBottom();
  }
  //changeMode
  changeMode(idx: any, i: DailyVehicleRoutDetail, Mode: any) {
    var flag = false;
    if (this.DailyVehicleRoutDetails.length > 0) {
      for (var count = 0; count < this.DailyVehicleRoutDetails.length; count++) {
        if (this.DailyVehicleRoutDetails[count].item_Code == i.officer_ID && idx != count) {
          flag = true;
          break;
        }
      }
    }
    if (Mode == 0) {
      
    }
    else if (Mode == 2) {
      this.DailyVehicleRoutDetails.splice(idx, 1);
    }
    else {
      console.log(i);
      i.edit_Mode = true;
    }

  }
  ////updateItem  
  updateItem(i: DailyVehicleRoutDetail, item_Code: any, officer_Name: any, unit_Price: any) {
    // this.changeItem(i.item_Code);
    i.officer_ID = item_Code;
    i.officer_Name = officer_Name;
    i.status = unit_Price;
  }
    //onNavigate
    onNavigate(pth) {

    sessionStorage.setItem('IsOrder', '0');
    sessionStorage.setItem('ID', this.id);
    sessionStorage.setItem('daily_Vehicle_Rout_ID', this.id)
    sessionStorage.setItem('reportName', this.reportName);
    sessionStorage.setItem('ReportSave', "0");
    sessionStorage.setItem('SendingMedium', "0");
    sessionStorage.setItem('templatecode', '0');
    sessionStorage.setItem('isStamp', this.isStamp);
    sessionStorage.setItem('ReportView', "1");
    sessionStorage.setItem('reportID', "12");
    sessionStorage.setItem('exchange', "-1");
    sessionStorage.setItem('ReportParentType', "2");//SaleInvoiceEmail
    if (this.LoginService.getSession('ShowCompanyTemplate') != '0') {
      sessionStorage.setItem('templatecode', this.templatecode);
    }
    if (pth == "/si-rpt-excel") {
      sessionStorage.setItem('ReportView', "2");
      window.open(pth, "_blank");
    }
    else if (pth == "/si-rpt-mail") {
      sessionStorage.setItem('ReportSave', "1");
      sessionStorage.setItem('ReportID', this.id);
      sessionStorage.setItem('SendingMedium', "1");
    }
    else {
      sessionStorage.setItem('ReportView', "1");
      window.open(pth, "_blank");
    }
      // sessionStorage.setItem('daily_Vehicle_Rout_ID', this.id);
      // sessionStorage.setItem('reportName', '');
      // sessionStorage.setItem('ReportView', "1");
      // sessionStorage.setItem('templatecode', "0");
    
      // if (pth == "/gdn-rpt-excel") {
      //   sessionStorage.setItem('ReportView', "2");
      //   sessionStorage.setItem('reportID', "11");
      //   window.open(pth, "_blank");
      // }
      // else {
      //   sessionStorage.setItem('reportID', "11");
      //   window.open(pth, "_blank");
      // }
    }
  //cancelGDN
  cancelGDN() {
    this.service.cancelCheck(this.daily_Vehicle_Rout_ID, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        this.cancelStock = (response.json());
        console.log(this.cancelStock);
        if (this.cancelStock != null) {
          for (let i = 0; i < this.cancelStock.length; i++) {
            if (this.cancelStock[i].quantity > this.cancelStock[i].stockQuantity) {
              this.cancelStockStatus = true;
              swal("Record is not cancelled since it is being used!");
              break;
            }
          }
        }
        if (this.cancelStockStatus != true) {
          swal({
            title: "Do you really want to cancel?",
            text: "Once cancelled, you will not be able to recover this GDN!",
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


                this.service.cancelGDN(this.daily_Vehicle_Rout_ID)
                  .subscribe(response => {
                    swal("Poof! Your GDN has been cancelled!", {
                      icon: "success",
                    });
                    this.cancelReturn = (response.json());
                    this.orderDetails(this.id);
                    this.modalReference.close();
                  });
              }
            });
        }
      });
  }
  //saveOrder
  saveOrder(daily_Vehicle_Rout_ID: any, area_ID: any, date: any, vehicle_ID: any) {

    if (this.area_ID > 0) {
      if (this.vehicle_ID > 0) {
    var goodsReceive = new DailyVehicleRout(daily_Vehicle_Rout_ID, this.area_ID, this.area_Name, this.date.getDateFinal(), this.vehicle_ID, this.vehicle,this.guid, 0, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, 28,  this.DailyVehicleRoutDetails,this.driver_ID,this.helper_ID);
    if (this.mode != 0) {
      this.DailyVehicleRoutDetails[0].flag = true;
    }
    var flag = true;
    if (this.DailyVehicleRoutDetails != null) {
      for (let i = 0; i < this.DailyVehicleRoutDetails.length; i++)
        if (this.DailyVehicleRoutDetails[i].stock_Qty <= 0) {
          flag = false
          swal("Stock Not Available For Item : " + this.DailyVehicleRoutDetails[i].item_Code)
        }
    }
    if (flag) { 
      $("#submitAdd").prop("disabled", true);
      this.service.saveOrder(goodsReceive).then(
        (response) => {
           
          // this.id = response;
          // sessionStorage.setItem('daily_Vehicle_Rout_ID', this.id);
          // if (this.isView == true) {
          //   this.onNavigate('/grn-rpt-rdlc');
          // }
          this.modalReference.close();
          this.searchVehicleRout("");
          console.log(response);
        },
        (error) => console.log(error))
    }
  }
  else{
    swal("Select Vehicle!");
  }
  }
    else{
      swal("Select Area!");
    }


  }
  //updateOrder  
  updateOrder(daily_Vehicle_Rout_ID: any, area_ID: any, date: any, vehicle_ID: any) {

    var goodsReceive = new DailyVehicleRout(daily_Vehicle_Rout_ID, this.area_ID, this.area_Name, this.date.getDateFinal(), this.vehicle_ID, this.vehicle,this.guid, 0, this.logedInUserID, this.UserSessionID, this.userCurrentWarehouse, 28,  this.DailyVehicleRoutDetails,this.driver_ID,this.helper_ID);
    if (this.mode != 0) {
      this.DailyVehicleRoutDetails[0].flag = true;
    }
    this.service.updateOrder(goodsReceive).then(
      (response) => {
        // this.id = response;
        // sessionStorage.setItem('daily_Vehicle_Rout_ID', this.id);
        // if (this.isView == true) {
        //   this.onNavigate('/gdn-rpt-rdlc');
        // }
        this.searchVehicleRout("");
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))

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
  //hotkeys
  hotkeys(event) {
    //alert(event.keyCode);
    //if (event.keyCode == 65) {
    //    alert("A pressed");
    //    this.showCreate();
    // }
  }
  //stockField
  stockField() {
    if (sessionStorage.getItem('settingShowStock') != "1") {
      this.hideStock = false;
    }
    else {
      this.hideStock = true;

    }
  }
  //pendingField
  pendingField() {
    if (sessionStorage.getItem('settingShowPending') != "1") {
      this.hidePending = false;
    }
    else {
      this.hidePending = true;
    }
  }
  //invoiceBeforeGDN
  invoiceBeforeGDN() {
    if (sessionStorage.getItem('settingGDNBeforeInvoice') != "1") {
      this.beforeInvoice = false;
    }
    else {
      this.beforeInvoice = true;
    }
  }
    //rdlcStatus
    rdlcStatus() {
      if (sessionStorage.getItem('settingInvoiceReports') != "1") {
        this.isView = false;
      }
      else {
        this.isView = true;
      }
    }
  // open modal
  open(content) {
    this.getCurrentDay();
    this.getCompanyTemplate();
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
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#cancelBtn").hide();
    $("#submitAdd").prop("disabled", true);
    $("#viewRDLC").prop("disabled", true);
    $("#viewExcel").prop("disabled", true);
    this.clearFields();
    this.scrollToBottom();
    this.stockField();
    this.pendingField();
    this.invoiceBeforeGDN();
    this.getPriviledgedOffices();
    /* this.getvehicles();
    this.getDrivers();
    this.getHelpers(); */
    this.getAreas();
    this.rdlcStatus();
    //this.service.getPendingOrder(this.priviledged_Offices, this.customer_ID, this.mode, this.beforeInvoice)
    //  .subscribe(response => {
    //    this.orders = (response.json());
    //    if (this.orders != null) {
    //      this.sale_Order_ID = this.orders[0].sale_Order_ID;
    //      this.changeOrder(this.customer_ID, this.sale_Order_ID);
    //      this.isLoading = false;
    //      $("#submitAdd").prop("disabled", false);
    //    }
    //    else {
    //      this.isLoading = false;
    //    }
    //  });


  }
  //detailOpen modal
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
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#cancelBtn").show();
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    this.stockField();
    this.pendingField();
    /* this.getvehicles();
    this.getDrivers();
    this.getHelpers(); */
    this.getPriviledgedOffices();
    this.getAreas();
    this.invoiceBeforeGDN();
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
  // end of modal

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
