import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EntryRFQService, LoginService, SupplierService, Suppliers, DayEndService, Supplier, SupplierQuotation, SupplierQuotationDetail, cDate, NgbDateFRParserFormatter }
  from '../../../../shared';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import swal from 'sweetalert';

@Component({
  selector: 'entry-rfq',
  host: { '(window:keydown)': 'hotkeys($event)' },
  templateUrl: './entry-rfq.component.html',
  styleUrls: ['./entry-rfq.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EntryRFQComponent implements OnInit, AfterViewChecked {
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

  quotation: any[] = [];
  quotationcode: any = 0;
  quotationname: any = '';

  rfq: any[] = [];
  rfqcode: any = 0;
  rfqname: any = '';

  suppliers: Array<Select2OptionData> = [];
  public supplier_IDM: any;
  public supplier_ID: any;
  public supplier_Name: any;

  items: any[] = [];
  public item_Code: any;
  public item_Name: any;

  specification: any = '';

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

  constructor(private service: EntryRFQService,
    private LoginService: LoginService,
    private SupplierService: SupplierService,
    private DayEndService: DayEndService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    this.purchaseOrderDetails = new Array<SupplierQuotationDetail>();
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
        if (FUNCTIONALITY[i].page_Code == 970026) {
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
  //getRFQ
  getRFQ() {
    this.isLoading =true;
    this.service.getRFQ(0)
      .subscribe(response => {
        this.isLoading = false;
        this.rfq = (response.json());
        this.rfqcode = this.rfq[0].rfqcode;
        console.log(response.json());
        this.getItems(this.rfqcode)

      });
  }
  //changeQuotation
  changeRFQ() {
    this.getItems(this.rfqcode);
  }
  //getItems  
  getItems(ID) {

    this.isLoading =true;
    this.service.getItems(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.items = response.json();
          for (let i = 0; i < this.items.length; i++) {
            this.purchaseOrderDetails.push(new SupplierQuotationDetail(0, 0, this.items[i].item_Code, this.items[i].item_Name, this.items[i].quantity, 0, 0));
          }
        }

      });
  }
  //getSuppliers
  getSuppliers() {
    // this.isLoading =true;
    this.service.getSuppliers()
      .subscribe(response => {
        this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
      });
  }
  //changeSupplier
  changeSupplier(e: any) {
    this.supplier_ID = e;
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
  //getDropdownList
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
  //onNavigate
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

    this.service.getDetailsByID(ID)
      .subscribe((o: SupplierQuotation) => {
        this.isLoading = false;
        console.log(o);
        this.purchase_Order_ID = ID;
        this.quotationcode = o.quotation_ID;
        this.pO_Date.setDate(o.quotation_Date);
        this.specification = o.specification;      
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





       
        this.service.getRFQ(o.rfQ_ID)
          .subscribe(response => {
            this.isLoading = false;
            this.rfq = (response.json());
            this.rfqcode = o.rfQ_ID;

            this.service.getSuppliers()
              .subscribe(response => {
                this.suppliers = this.getDropdownList(response.json(), "supplier_ID", "supplier_Name");
                this.supplier_IDM = o.supplieR_ID;
                this.supplier_ID = o.supplieR_ID;

                this.purchaseOrderDetails = o.quotationDetails;
              });
            
            //console.log(response.json());
            //this.getItems(this.rfqcode)
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
      var order = new SupplierQuotation(0, this.pO_Date.getDateFinal(), this.rfqcode, this.supplier_ID, this.specification, this.remarks, 0, this.guid, this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);

      //if (this.mode != 0) {
      //  this.purchaseOrderDetails[0].edit_Mode = true;
      //}
      console.log(order);
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
      var order = new SupplierQuotation(this.quotationcode, this.pO_Date.getDateFinal(), this.rfqcode, this.supplier_ID, this.specification, this.remarks, 0, this.guid, this.logedInUserID, this.UserSessionID, this.purchaseOrderDetails);
      console.log(order)

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

    this.getRFQ()
    this.getSuppliers();
    this.clearFields();
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



  callcon(value) {
    console.log(value);
  }


}



