import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AssetRFQService, LoginService, SupplierService, Suppliers, DayEndService, Supplier, AssetRFQ, AssetRFQDetail, cDate, NgbDateFRParserFormatter }
  from '../../../../shared';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import swal from 'sweetalert';

@Component({
  selector: 'asset-rfq',
  host: { '(window:keydown)': 'hotkeys($event)' },
  templateUrl: './asset-rfq.component.html',
  styleUrls: ['./asset-rfq.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class AssetRFQComponent implements OnInit, AfterViewChecked {
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  public exampleData: Array<Select2OptionData>;
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  aaa: number = 1;
  modalReference: NgbModalRef;
  public supp: any;
  closeResult: string;
  grid: any;



  itemsR: any[] = [];
  items: Array<Select2OptionData>;
  public item_CodeM: any = 0;
  public item_Code: any;
  public item_Name: any;





  status: any;
  orders: any[];
  users: any;
  exc: any = 0;
  purchaseOrderDetails: any[];
  purchaseOrderDetail: any;
  selectedItem: Object = {};
  newselectedItem: Object = {};
  selectedSupplier: Supplier = new Supplier(0, 0, '');
  editMode = false;
  hide = true;
  index = 1;
  purchase_Order_ID = 0;
  remarks: any;
  IsUpdate: any;
  Quantity: any = 0;
  guid: any;
  mode: any = 0;
  btnmode: any = 0;
  method_Id: any = 1;

  pO_Detail_ID: any = 0;

  order_ID: any = "";
  foucs: any;
 isLoading: any = false;
  color = '#0094ff';
  guidOrder: boolean;
  public pO_Date = new cDate();

  isView: any = true;
  ID: any = "";
  buttons: any;
  dangerMode: any;
  actionID: any = 1;
  alerts: Array<any> = [];
  isDueDate: any = false;
  DelayCheck: any = true;
  //End Member Variables

  constructor(private service: AssetRFQService,
    private LoginService: LoginService,
    private SupplierService: SupplierService,
    private DayEndService: DayEndService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    this.purchaseOrderDetails = new Array<AssetRFQDetail>();
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }
  //ngOnInit
  ngOnInit() {

    this.logedInUserID = this.LoginService.getSession('user_ID');
    //////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));

    //  console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length > 0) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 970025) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;

          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].usersessionid;
        }
    }
    //////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
    this.getGrid();

  }

  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
       console.log(response.json());
      });
  }
  //searchGrid
  searchGrid(value: string) {
    this.service.searchGrid(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.grid = (response.json());
        }
        else{
          this.grid = [];
        }
        
      });
  }
  //getItems  
  getItems() {
    this.isLoading =true;
    this.service.getItems()
      .subscribe(response => {
        this.isLoading = false;
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        this.itemsR = response.json();
      });
  }
  //changeItem
  changeItem(e: any) {
    this.Quantity = 0;
    this.item_Code = e;
    var list = this.itemsR;
    if (list != null) {
      for (let i = 0; i < list.length; i++)
        if (list[i].item_Code == e.value) {
          this.item_Name = list[i].item_Name;
          this.Quantity = list[i].quantity;
          break;
        }
        else
          this.Quantity = 0;
    }   
    this.DelayCheck = true;

  }
  //updateItem  
  updateItem(i: AssetRFQDetail, e: any) {

    this.item_Code = e;
    var list = this.itemsR;
    if (list != null) {
      for (let i = 0; i < list.length; i++)
        if (list[i].item_Code == e.value) {
          this.item_Name = list[i].item_Name;
          this.Quantity = list[i].quantity;
        }
    }
    this.DelayCheck = true;

  }
  //IfExists
  IfExists(purchase_Order_ID) {
    ////this.isLoading =true;
    ////this.service.IfExists(purchase_Order_ID)
    ////  .subscribe(response => {
    ////    this.status = (response.json());
    ////    if (this.status == true) {
    ////      $("#alertWarning").show();
    ////      $("#submitUpdate").prop("disabled", true);
    ////      $("#cancelBtn").prop("disabled", true);

    ////      $("#AddNewItemRow").hide();
    ////      this.EditItemButton = 'disabled';
    ////      this.RemoveItemButton = 'disabled';

    ////      this.isLoading = false;
    ////    }
    ////    else {
    ////      $("#alertWarning").hide();
    ////      $("#submitUpdate").prop("disabled", false);
    ////      $("#cancelBtn").prop("disabled", false);
    ////      $("#AddNewItemRow").show();
    ////      this.EditItemButton = '';
    ////      this.RemoveItemButton = '';
    ////      this.isLoading = false;
    ////    }
    ////  });
  }
  //clearFields
  clearFields() {


    this.purchase_Order_ID = 0;
    this.method_Id = 1;
    this.remarks = "";
    this.item_Code = 0;
    this.Quantity = 0;

    this.purchaseOrderDetails = [];
    this.ID = "";
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    this.mode = false;
    this.btnmode = true;

    $("#submitAdd").prop("disabled", false);
    $("#submitAddMore").prop("disabled", false);

    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });

  }
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {

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
  //addGrid
  addGrid(item_Code: any, item_Name: any, Unit_Price: any, upp: any, Quantity: any, Discount_Rate: any, Tax_Rate: any) {

    if (this.DelayCheck) {
      this.DelayCheck = false;

      if (Unit_Price != 0) {
        if (item_Name != null) {


          var flag = false;
          if (this.purchaseOrderDetails.length > 0) {
            for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
              if (this.purchaseOrderDetails[count].itemID == item_Code) {
                flag = true;
                break;
              }
            }
          }

          if (flag == false) {
            if (this.hide == false) {
              this.purchaseOrderDetails.push(new AssetRFQDetail(0, 0, item_Code, item_Name, this.Quantity, 0));
            }
            else {
              this.purchaseOrderDetails.push(new AssetRFQDetail(0, 0, item_Code, item_Name, this.Quantity, 0));
            }

            $("#submitAdd").prop("disabled", false);
            $("#submitAddMore").prop("disabled", false);

            if (this.item_CodeM == 0)
              this.item_CodeM = -1;
            else
              this.item_CodeM = 0;

            this.editMode = false;
          } else {
            swal("Already Exists");
            return;
          }




        } else {
          swal("Item is Required");
          return;
        }
      } else {
        this.DelayCheck = true;
        swal("Unit price must be greater then 0");
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }
  }
  //changeMode
  changeMode(idx: any, i: AssetRFQDetail, Mode: any) {
    this.DelayCheck = true;
    var flag = false;
    if (this.purchaseOrderDetails.length > 0) {
      for (var count = 0; count < this.purchaseOrderDetails.length; count++) {
        if (this.purchaseOrderDetails[count].itemID == i.itemID && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {

      if (flag == false) {
        if (i.quantity > 0) {
          i.edit_Mode = false;


          i.quantity = this.Quantity;
          if (this.item_CodeM == 0)
            this.item_CodeM = -1;
          else
            this.item_CodeM = 0;

        }
        else {
          swal("Quantity must be greater then 0");
          return;
        }
      } else {
        swal("Already Exists");
        return;
      }

    }
    else if (Mode == 2) {
      this.purchaseOrderDetails.splice(idx, 1);
    }
    else {
      //alert(i.itemID);
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.itemID) {
          this.item_CodeM = this.items[j].id;
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
    }

    //}
  }
  //onNavifate  
  onNavigate(pth) {
    sessionStorage.setItem('ReportView', "1");

    if (pth == "/po-rpt-excel")
      sessionStorage.setItem('ReportView', "2");
    else
      sessionStorage.setItem('ReportView', "1");

    sessionStorage.setItem('reportID', "1");
    sessionStorage.setItem('ID', this.ID);
    sessionStorage.setItem('exchange', "-1");
    window.open(pth, "_blank");
  }
  //getDetailsByID
  getDetailsByID(ID, content) {
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });


    sessionStorage.setItem('reportID', "1");
    sessionStorage.setItem('ID', ID);
    this.detailOpen(content);

    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.IfExists(ID);

    this.service.getDetailsByID(ID)
      .subscribe((o: AssetRFQ) => {
        this.isLoading = false;
        console.log(o);
        this.purchase_Order_ID = ID;
        this.ID = o.rfQ_ID;
        this.pO_Date.setDate(o.rfq_Date);        
        this.remarks = o.remarks;        
        if (o.cancel == 1) {

            $("#alertWarning").show();
            $("#cancelBtn").prop("disabled", true);
            $("#submitUpdate").prop("disabled", true);
            $("#AddNewItemRow").hide();
            this.EditItemButton = 'disabled';
            this.RemoveItemButton = 'disabled';

            this.alerts = []
            this.alerts.push(
              {
                id: 4,
                type: 'danger',
                message: 'Record is not updatable since it is Cancelled...',
              });

        }




                this.purchaseOrderDetails = o.rfqDetails;
                this.isLoading =true;
                this.service.getItems()
                  .subscribe(response => {
                    this.isLoading = false;
                    this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
                    this.itemsR = response.json();
                    var list = this.itemsR;
                   

                  });


      

      });

  }
  //cancelOrder
  cancelOrder() {
    swal({
      title: "Do you really want to cancel?",
      text: "Once cancelled, you will not be able to recover this order!",
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


          this.service.cancelOrder(this.purchase_Order_ID, this.actionID)
            .subscribe(response => {
              swal("Poof! Your order has been cancelled!", {
                icon: "success",
              });
              //this.cancelReturn = (response.json());
              this.getGrid();
              this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  //saveOrder
  saveOrder() {

    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);

    if (this.purchaseOrderDetails != null) {
    var order = new AssetRFQ(0, this.pO_Date.getDateFinal(), this.remarks, 0, this.guid, this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);

    if (this.mode != 0) {
      this.purchaseOrderDetails[0].edit_Mode = true;
    }

    this.service.saveOrder(order).then(
      (response) => {
        this.ID = response;
        console.log(this.ID);
        sessionStorage.setItem('ID', this.ID);

        this.getGrid();
        this.modalReference.close();
     
        console.log(response);
      },
      (error) => console.log(error))

    }
    else {
      swal("Select 1 Item.");
    }

  }
  //updateOrder
  updateOrder() {



    if (this.purchaseOrderDetails != null) {
    var order = new AssetRFQ(this.purchase_Order_ID, this.pO_Date.getDateFinal(), this.remarks, 0, this.guid, this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);


    this.service.updateOrder(order).then(
      (response) => {
        this.getGrid();
        this.modalReference.close();
       
        console.log(response);
      },
      (error) => console.log(error))
    }
    else {
      swal("Select 1 Item.");
    }

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
  hotkeys(e) {

  }

  //open Model
  open(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitAdd").show();
    $("#submitAddMore").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);

    this.clearFields();

    this.getItems();
    this.scrollToBottom();
    $("#cancelBtn").hide();


  }
  // detailOpen modal
  detailOpen(content) {
    this.isLoading =true;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitAdd").hide();
    $("#submitAddMore").hide();
    $("#submitUpdate").show();
    $("#submitUpdate").prop("disabled", false);
    $("#viewRDLC").prop("disabled", false);
    $("#viewExcel").prop("disabled", false);
    $("#allowExchange").hide();

    this.clearFields();

    $("#cancelBtn").show();
    this.isLoading = false;

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
  EditItemButton: any = '';
  RemoveItemButton: any = '';






}



