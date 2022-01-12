import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PermissionUtility } from '@shared/common/PermissionUtility';
import { Validation } from '@shared/common/validation';
import { cDate } from '@shared/directives/custom-date';
// import { dailyProduction } from '@shared/models/SupplyChain/CRM/dailyProduction'; 
// import { dailyProductionDetails } from '@shared/models/SupplyChain/CRM/dailyProductionDetails';
import { Stitching } from '@shared/models/SupplyChain/CRM/stitching';
import { StitchingDetails } from '@shared/models/SupplyChain/CRM/stitchingDetail';
import { LoginService } from '@shared/services/login-service/login.service';
import { BudgetingService } from '@shared/services/SupplyChain/CRM/budgeting/budgeting.service';
import { StitchingService } from '@shared/services/SupplyChain/CRM/stitching/stitching.service';
import { Select2OptionData } from 'ng-select2';
import swal from 'sweetalert';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.css']
})
export class PackingComponent implements OnInit {


  public PermissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    logedInUserID: any = 1;
    UserSessionID: any = 0;
    dailyProdId:any;
    modalReference: NgbModalRef;
    isLoading: any = false;
    closeResult: string; 
    stitchingDetails: any = [];
    knittingNo : any = '';
    remarks: any= '';
    //deptFrom:any=[];
    //deptTo:any=[];
    departments:any=[];
    hallNo:any;
    //shiftIncharge:any=[];
    contractNo:any = '';
    //contracts:any=[];
    fourmans:any=[];
    //shift:any=[];
    prodNo:any;
    wastage:any=0;
    weight1:any=0;
    weight2:any=0; 
    quantity:any=0;
    size:any= ''; 
    color:any = '';
    item_code:any = 0; 
    operator_code:any = 0; 
    operator:any ='';
    machine:any;
    shift_Id:any = 0;
    shift_Name:any = '';
    machine_code:any;
    rework:any=false;
    mode: any = false;
    btnmode: any = false;
    status: any = false;
    submitAdd:any;
    submitUpdate:any;
    EditItemButton:any=false;
    productions:any[]=[];
    public date = new cDate();
    ////////////////////////
    p: number = 1;
    g: number = 1; 
    modalReferenceMail: NgbModalRef;
    order: any;
    orders: any[];
    users: any[];
    customersR: any[];
    customers: Array<Select2OptionData> = [];
    refCustomers: Array<Select2OptionData> = [];
    contacts: any[] = [];
    items: Array<Select2OptionData> = [];
    itemsR: any[] = [];
    unitPrices: any[];
    unit_Price: any = 0;
    payments: any[];
    dailyProductionDetails: any[];
    itemStockIMEI: any[];
    stocks: any[];
    dailyProductionDetail: any;
    selectedItem: Object = {};
    newselectedItem: Object = {};
    editMode = false;
    index = 1;
    order_Envoy: number;
    emp_Name: any;
    supplier_ID: number;
    public customer_ID: any;
    public customer_Name: any;
    public refCustomerID: any = 0;
    public refCustomerName: any;
    contact_ID: any = 0;
    knittingID = 0;
    Office_Code: any;
    allowOW = false;
    sO_NO: any;
    method_Id: any = 1;
    payment_ID: any = 1;
    freight_Id: any = 1;
    total_Cost: any;
    total_discount: any;
    discount_Amount: any;
    freight_Chrgs: any = 0.00;
    total_Amount: any = 0;
    paid_Amount: any = 0; 
    public item_Code: any = 1;
    public item_Name: any;
    IsUpdate: any;
    Quantity: any = 1;
    Discount_Rate: any = 0;
    Tax_Rate: any = 0;
    guid: any; 
    order_ID: any = "";
    stock_Qty: any = 0;
    pending: any = 0; 
    guidOrder: boolean; 
    IsDirect: any = false;
    frieght_Id: any = 1;
    customerCategoryId: any = 2; 
    isView: any = true;
    isStamp: any = false;
    public sO_Date = new cDate();
    public delivery_Date = new cDate();
    public Shipping_Date = new cDate();
    public paymentDate = new cDate();
    public dayEndDate = new cDate();
    alerts: Array<any> = [];
    hide = true;
    hideStock = true;
    hidePending = true;
    discountEditing = true;
    discountRateOption = true;
    isTaxable: any=0;
    taxRate: any = 0;
    taxable: any=0;
    IsSaleTaxInv: any = 0;
    ID: any = "";
    sD_Rate: any = 0;
    sD_Amount: any = 0;
    cancelReturn: any;
    actionID: any = 9;
    dayEndDetail: any[] = [];
    specialDiscount: any = 0;
    allowPriceList: boolean = false;
    exchange: any = 0;
    exc: any = 0;
    areaenable: any = 0;
    areashow: any = 'none';
    area: any[] = [];
    areacode: any = 1;
    areaname: any = ''
    taxrateList: any[] = [];
    taxratecode: any = 1;
    taxratename: any = '';
    taxrate: any = 0;
    pendingSale: any = false;
    isDueDate: any = false;
    companytemplate: any[] = []; 
    templatename: any = '';
    templateshow: any = '';
    reportName: any = 'Order';
    isRPReport: any = false;
    sortOrder: any = 1;
    DelayCheck: any = true;
    userOffice: any;
    userCurrentOffice: any;
    userPrivilegedOffice: any;
    userCurrentWarehouse: any;
    ShowSendEmail: any = 'none';
    taxcode: any = 1;
    type: any = "";
    offices: any[];
    warehouses: any[];
    officE_CODE: any;
    officE_NAME: any;
    warehouseID: any;
    warehouse: any;
    saleOfficerDesignation: any = '';
    refCustomerShow: any = '';
    //////////////////////// 
    priviledged_Offices: any;
    contractNos: any;
    sessionEnableTextboxItem: number;
    textboxItemIDEdit: any;
    public prod_Date = new cDate();
    production_No: any="";
    contract_No: any ='';
    hall_No: any=0;
    shift_Incharge: any ='';
    deparment_From: any ='';
    department_To: any ='';
    production_ID: any=0;
    created_By: any=0;
    userSessionID: any=0;
    operator_Name: any='';
    fourman_Id: number = 0;;
    fourman_Name: string ='';
    shift_inch_Id: number = 0;
    shift_Inch_Name: string ='';
    dept_Id: number = 0;
    dept_Name: string = '';
    machine_No: any='';
    batch_No: any=0;
    operator_ID: any=0;
    A_Pair: any=0;
    weight_1: any=0;
    B_Pair: any=0;
    weight_2: any=0;
    shiftIncharge: any ='';
    fourman: any = '';
    AllStitchings: any=[];
    shiftIncharges: any=[];
    article: any = 'Crew(Complate)';
    department_From_ID: any = 0;
    department_To_ID: any = 0;
    edit_Mode: any = false;
    RemoveItemButton: any = '';
    isCloseCheckbox: any = false;
    status1: any =0;
  
    constructor(private loginService: LoginService,private modalService: NgbModal, private service:StitchingService,private budgetingService:BudgetingService) {
      this.stitchingDetails = new Array<StitchingDetails>();
      this.userOffice = this.loginService.getSession('userOffice');
      this.userPrivilegedOffice = this.loginService.getSession('userPrivilegedOffice');
      this.userCurrentOffice = this.loginService.getSession('userCurrentOffice');
      this.userCurrentWarehouse = this.loginService.getSession('userCurrentWarehouse');
      this.priviledged_Offices = this.userPrivilegedOffice;
     }
  
    ngOnInit() {
      this.PermissionUtility.setPagePermissions(140058);
  
  
      this.loginService.getCurrentOffices(this.userPrivilegedOffice)
        .subscribe(response => {
          this.offices = (response.json());
          if (this.offices != null) {
            this.userOffice = this.offices[0].officE_NAME;
            for (let i = 0; i < this.offices.length; i++)
              if (this.offices[i].officE_CODE == this.userCurrentOffice) {
                var timer = setTimeout(() => this.officE_CODE = this.offices[i].officE_CODE, 500);
              }
              else { this.officE_CODE = this.offices[0].officE_CODE; }
          }
          else { this.officE_CODE = this.offices[0].officE_CODE; }
          //------------------------------------------------------------------------------------
          //-------------------Get Current Warehouses
          //------------------------------------------------------------------------------------
          this.loginService.getCurrentWareshouse(this.userOffice)
            .subscribe(response => {
              this.warehouses = (response.json());
              if (this.warehouses != null) {
                this.warehouseID = this.warehouses[0].warehouseID;
              }
            });
          this.loginService.getCurrentWareshouse(this.userCurrentOffice)
            .subscribe(response => {
              this.warehouses = (response.json());
  
  
              if (this.warehouses != null) {
                for (let i = 0; i < this.warehouses.length; i++)
                  if (this.warehouses[i].warehouseID == this.userCurrentWarehouse) {
                    var timer = setTimeout(() => this.warehouseID = this.warehouses[i].warehouseID, 500);
                  }
                  else { this.warehouseID = this.warehouses[0].warehouseID; }
              }
              else { this.warehouseID = this.warehouses[0].warehouseID; }
  
            });
  
        });
        this.GetStitchingDetails("");
        this.getAllKnittingNo();
        this.getShiftIncharge();
        this.getFourman(); 
        this.getDepartment();
        this.getOperator();
    }
  
  //FrieghtTermsList
  shift = [
      { "shift_Id": 1, "shift_Name": "A: 7:00 AM TO 3:00 PM" }
    ,{ "shift_Id": 2, "shift_Name": "B: 3:00 PM TO 11:00 PM" } 
    , { "shift_Id": 3, "shift_Name": "C: 11:00 PM TO 7:00 AM"  }
  ]
   
   //GetDailyProductionDetails
   GetStitchingDetails(value: string) {
    this.isLoading = true;
    this.service.GetStitchingDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if(response.json()!==null){
          this.isLoading = false;
          this.AllStitchings = (response.json());
        }else{
          this.AllStitchings = [];
          this.isLoading = false;
        }
      });
  }
   //getAllContractNo
   getAllKnittingNo()
   {
     this.service.getAllKnittingNo()
     .subscribe(response => {
       this.contractNos = (response.json());
       let i =  this.contractNos.length;
       let u = 0;
       for (var count = 0; count < i; count++) {
          
        if (this.contractNos.filter(f=> f.production_No == this.AllStitchings[count].knitting_No)) {
          this.contractNos.splice(count-u, 1);
          u++;
        }
      }
       this.contractNo = this.contractNos[0].production_No;
       this.knittingID = this.contractNos[0].production_ID;
       this.getItems(this.knittingID);
     });
   }
   getKnittingDetail(knittingID)
   {
     
    this.knittingID = this.contractNos.filter(f=>f.production_No == knittingID)[0].production_ID;
      this.getItems(this.knittingID);
      this.getKnittingDetailByID(this.knittingID);
   }
  getKnittingDetailByID(knittingID: any) {
    this.isLoading = true;
    this.service.getKnittingDetailByID(knittingID)
      .subscribe((o: Stitching) => {
        console.log(o);
        this.isLoading = false;  
        this.production_ID = o.stitching_ID;
        sessionStorage.setItem('exchange', "-1");
        // sessionStorage.setItem('ID', this.production_ID.toString()); 
        // this.prod_Date.setDate(o.stitching_Date);
        console.log(o);
        this.remarks = o.remarks; 
  
        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              //this.isLoading = true
              this.users = (response.json()); 
            });
          
        this.stitchingDetails = o.prod_StitchingDetails; 
        console.log(this.stitchingDetails);
        this.production_ID = o.stitching_ID;
        this.production_No = o.stitching_No;
        this.contractNo = o.knitting_No;
        this.shift_Id = o.shift;
        this.hall_No = o.hall_No;
        this.shiftIncharge = o.shift_Incharge;
        this.fourman = o.fourman;
        this.department_To = o.department_To;
        this.deparment_From = o.deparment_From;
        // this.remarks = o.remarks;
        // this.status1 = o.status;
        this.isCloseCheckbox = false;
        this.stitchingDetails = [];
        for (let i = 0; i < o.prod_StitchingDetails.length; i++) {
          this.operator_Name = this.operator.filter(f=> f.id == o.prod_StitchingDetails[i].operator_ID)[0].text;
         
          this.stitchingDetails.push(new StitchingDetails(o.prod_StitchingDetails[i].stitchting_Detail_ID, 
            o.prod_StitchingDetails[i].stitchting_ID, o.prod_StitchingDetails[i].item_Code, o.prod_StitchingDetails[i].item_Name, 
            o.prod_StitchingDetails[i].machine_No, o.prod_StitchingDetails[i].quantity, o.prod_StitchingDetails[i].batch_No,
            o.prod_StitchingDetails[i].operator_ID,this.operator_Name, o.prod_StitchingDetails[i].color, 
            o.prod_StitchingDetails[i].size, o.prod_StitchingDetails[i].a_Pair, o.prod_StitchingDetails[i].weight_1, 
            o.prod_StitchingDetails[i].b_Pair, o.prod_StitchingDetails[i].weight_2, o.prod_StitchingDetails[i].wastage, 
            o.prod_StitchingDetails[i].rework, o.prod_StitchingDetails[i].article, false));
        }
        if(this.status1 == 2 || this.status1 == 1)
        {
          if(this.status1 == 1)
          this.isCloseCheckbox = true;
          else
          this.isCloseCheckbox = false;
  
          $("#submitUpdate").prop("disabled", true);
          $("#AddNewItemRow").hide();
          // $("#remove").prop("disabled", true);
          // $("#edit").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
        }
        this.isLoading = false;
  
      });
  }
   //getItems  
   getItems(knittingID) {
    // this.isLoading = true; 
    this.service.getItems(knittingID)
      .subscribe(response => {
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        this.isLoading = false;
      });
  }
   //getShiftIncharge  
   getShiftIncharge() {
    this.isLoading = true;
    this.service.getShiftIncharge()
      .subscribe(response => {
        this.shiftIncharges = (response.json()); 
        this.shift_inch_Id = this.shiftIncharges[0].shift_inch_Id;
        this.shift_Inch_Name = this.shiftIncharges[0].shift_Inch_Name;
        this.shiftIncharge = this.shiftIncharges[0].shift_inch_Id;
        this.isLoading = false;
      });
  }
  //getFourman  
  getFourman() {
    this.isLoading = true;
    this.service.getFourman()
      .subscribe(response => {
        this.fourmans = (response.json()); 
        this.fourman_Id = this.fourmans[0].fourman_Id;
        this.fourman_Name = this.fourmans[0].fourman_Name;
        this.fourman = this.fourmans[0].fourman_Id;
        this.isLoading = false;
      });
  }
  //getDepartment  
  getDepartment() {
    this.isLoading = true;
    this.service.getDepartment()
      .subscribe(response => {
        this.departments = (response.json()); 
        this.dept_Id = this.departments[0].dept_Id;
        this.dept_Name = this.departments[0].dept_Name;
        this.deparment_From =  this.departments[0].dept_Id;
        this.department_To =  this.departments[0].dept_Id;
        this.department_From_ID = this.departments[0].dept_Id;
        this.department_To_ID = this.departments[0].dept_Id;
        this.isLoading = false;
      });
  }
  //getOperator  
  getOperator() {
    this.isLoading = true;
    this.service.getOperator()
      .subscribe(response => {
         
        this.operator = this.getDropdownList(response.json(), "operator_ID", "operator_Name");
        this.operator_ID = this.operator[0].id;
        this.operator_Name = this.operator[0].text;
        this.isLoading = false;
      });
  }
  //changeItem
    changeItems(e: any) {
      // this.isLoading = true; 
        this.item_Code = e;
        this.item_Name = e.data[0].text;
        this.isLoading = false;
    }
  //changeItem
  changeOperator(e: any) {
    // this.isLoading = true; 
      this.operator_ID = e;
      this.operator_Name = e.data[0].text;
      this.isLoading = false;
  }
    //clear fields
    clearFields(){
      this.getAllKnittingNo();
      this.production_No = '';
      this.contractNo = this.contractNos[0].contract_No;
      this.shift_Id = 1;
      this.hall_No = 0;
      this.shiftIncharge = this.shiftIncharges[0].shift_inch_Id;
      this.fourman = this.fourmans[0].fourman_Id;
      this.deparment_From =  this.departments[0].dept_Id;
      this.department_To =  this.departments[0].dept_Id;
      this.remarks ='';
      this.stitchingDetails = [];
      this.item_Code = 0;
      this.wastage== 0
      // this.changeItems(this.item_Code);
      this.editMode = false;
      this.weight_2=0;
      this.B_Pair== 0;
      this.weight_1=0;
      this.A_Pair=0 ;
      this.quantity=0;
      this.size= '';
      this.color= '';
      this.batch_No= 0 ;
      this.operator_ID= 0;
      this.machine_No  = '';
      this.isCloseCheckbox = false;
  
    }
  //updateItem 
  updateItem(i: StitchingDetails, e: any) {
    if (this.sessionEnableTextboxItem != 1) {
      this.item_Code = e;
      i.item_Code = e;
      i.item_Name = this.items.filter(f=> f.id == this.item_Code)[0].text;
    } else {
      this.item_Code = this.textboxItemIDEdit;
  
    }
    this.isLoading = false;
  }
  updateOperator(i: StitchingDetails, e: any) {
      this.operator_ID = e;
      i.operator_ID = e;
      i.operator_Name = this.operator.filter(f=> f.id == this.operator_ID)[0].text;
   
    this.isLoading = false;
  }
  //changeMode
  changeMode(idx: any, i:  StitchingDetails, Mode: any) {
       
    this.DelayCheck = true;
    $('td.active').removeClass('active');
    console.log("Index : " + idx + "--- Page :" + this.g);
    console.log(i);
   
  
  
  
    var flag = false;
    if (this.stitchingDetails.length > 0) {
      for (var count = 0; count < this.stitchingDetails.length; count++) {
        if (this.stitchingDetails[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }
  
    
  
    if (this.sessionEnableTextboxItem != 1) {
  
          if (Mode == 0) {
             
            // if(this.checkFields(i.uom, i.weight, i.percentage))
            // return;
              i.edit_Mode = false;
                 
                
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
              $("#submitUpdate").prop("disabled", false);
          }
          else if (Mode == 2) {
  
            console.log("Index : " + idx + "--- Page :" + this.g);
            this.stitchingDetails.splice(idx, 1);
          }
          else {
            // for (let j = 0; j <= this.getItems.length; j++) {
            //   if (this.getItems[j].item_Code == i.item_Code) {
            //     this.item_Code = this.getItems[j].id;
  
            //     break;
            //   }
            // }
  
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
  
  
    }
    else {
          if (Mode == 0) {
             
            // if(this.checkFields(i.uom, i.weight, i.percentage))
            // return;
                  i.edit_Mode = false;
                  
                 
              $("#submitAdd").prop("disabled", false);
              $("#submitAddMore").prop("disabled", false);
              $("#submitUpdate").prop("disabled", false);
           
          }
          else if (Mode == 2) {
            console.log("Index : " + idx + "--- Page :" + this.g);
            this.stitchingDetails.splice(idx, 1);
  
          }
          else {
            console.log("Index : " + idx + "--- Page :" + this.g);
            this.textboxItemIDEdit = i.item_Code;
  
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
  
    }
  
    this.isLoading = false;
  }
  //addGrid
  addGrid(item_Code: any, item_Name: any, machine_No: any, quantity: any, batch_No: any,operator_ID: any, operator_Name: any,A_Pair:any,weight_1:any,weight_2:any,B_Pair:any) {
       this.isLoading = true;
        
          if (item_Code != null && item_Code != 0) {
            if (machine_No != ''  &&  this.color!='' && this.size != ''  &&   quantity> 0  &&  this.batch_No> 0  && this.operator_ID> 0  &&  operator_Name> 0  && this.A_Pair>0  && this.weight_1 > 0  &&  this.weight_2 > 0 && this.B_Pair > 0   && this.wastage>0) { 
              var flag = false;
              if (this.stitchingDetails.length > 0) {
                for (var count = 0; count < this.stitchingDetails.length; count++) {
                  if (this.stitchingDetails[count].item_Code == item_Code) {
                    flag = true; 
                    swal("Item already exist","","info");
                    break;
                  }
                }
              }
              if (flag == false) {
                
                  this.stitchingDetails.push(new StitchingDetails(0, 0, item_Code, this.item_Name, this.machine_No, quantity, batch_No,this.operator_ID, this.operator_Name, this.color, this.size, this.A_Pair, this.weight_1, this.B_Pair, this.weight_2, this.wastage, this.rework, this.article, false));
                     this.isLoading=false;
                  this.item_Code = 0;
                  this.wastage== 0
                  // this.changeItems(this.item_Code);
                  this.editMode = false;
                  this.weight_2=0;
                  this.B_Pair== 0;
                  this.weight_1=0;
                  this.A_Pair=0 ;
                  this.quantity=0;
                  this.size= '';
                  this.color= '';
                  this.batch_No= 0 ;
                  this.operator_ID= 0;
                  this.machine_No  = '';
              }
               
            }
            else {
                       if(machine_No == '' || machine_No == null )
                      swal('Machine No. Must Be Enter!','','info')
                      else if(operator_ID== 0 || operator_ID == null )
                      swal('Operator Must Be Define!','','info')
                      else if(this.batch_No== 0 || this.batch_No == null )
                      swal('Batch No Must Be Enter!','','info')
                      if(item_Code== 0 || item_Code== null)
                      swal("Item Must Be Define","","info")
                      else if(this.color== '' || this.color == null )
                      swal('Color Must Be Enter!','','info')
                      else if(this.size== '' || this.size == null )
                      swal('Size Must Be Enter!','','info')
                      else if(quantity== 0 || quantity == null )
                      swal('quantity Must Be Enter!','','info')
                      else if(this.A_Pair== 0 || this.A_Pair == null )
                      swal('A Pair Must Be Enter!','','info')
                      else if(this.weight_1==0 || this.weight_1 == null )
                      swal('Weight 1 Must Be Enter!','','info')
                      else if(this.B_Pair== 0 || this.B_Pair == null )
                      swal('B Pair Must Be Enter!','','info')
                      else if(this.weight_2==0 || this.weight_2 == null )
                      swal('Weight 2 Must Be Enter!','','info')
                      else if(this.wastage== 0 || this.wastage == null )
                      swal('wastage Must Be Enter!','','info')
                     this.isLoading = false;
                    return;
            }
          } else {
            this.isLoading = false;
            swal("Item is Required");
            return;
          }
          $("#submitAdd").prop("disabled", false); 
          $("#txt").focus();
          this.isLoading=false;
  }
  //IfExists
  IfExists(sale_Order_ID) {
    this.service.IfExists(sale_Order_ID)
      .subscribe(response => {
        this.status = (response.json());
         
         
      });
  }
  //guidExist
  guidExist(guid: any) {
    this.service.guidExist(guid)
      .subscribe(response => {
        this.guidOrder = (response.json());
      });
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
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
  
   //saveOrder
   saveOrder() { 
    $("#submitAdd").prop("disabled", true);
    $("#submitAddMore").prop("disabled", true);  
        this.isLoading = true;
        if(this.stitchingDetails.length == 0)
        {
          this.isLoading = false;
          swal("Please Enter Item Details","","info")
          return
        }
        if(this.production_No == '' || this.production_No == null)
        {
          this.isLoading = false;
          swal("Please Enter Stitching No","","info")
          return
        }
        if(this.hall_No == 0 || this.hall_No == null)
        {
          this.isLoading = false;
          swal("Please Enter Hall No","","info")
          return
        }
        var order = new Stitching(0, this.prod_Date.getDateFinal(), this.production_No, this.knittingNo, this.contractNo, this.shift_Id, this.hall_No,
          this.shiftIncharge, this.fourman, this.deparment_From, this.department_To, this.remarks,this.logedInUserID,this.userSessionID, this.stitchingDetails,0);
        console.log(order);
        this.service.saveOrder(order).then(
          (response) => {
  
            this.isLoading = false;
            this.ID = response;  
            this.stitchingDetails = [];
            this.GetStitchingDetails('');
            this.getAllKnittingNo();
            this.modalReference.close();
            console.log(response);
           
          },
          (error) => {
            console.log(error); this.isLoading = false;
          })  
  }
  //updateOrder
  updateOrder() {
     
     if(this.isCloseCheckbox==true)
     {
        this.status1 = 1;
     }
     else{
       this.status1 =0;
     }
        this.isLoading = true;
        var order = new Stitching(this.production_ID, this.prod_Date.getDateFinal(), this.production_No,this.knittingNo, this.contractNo, this.shift_Id, this.hall_No,
          this.shiftIncharge, this.fourman, this.deparment_From, this.department_To, this.remarks,this.logedInUserID,this.userSessionID, this.stitchingDetails, this.status1);
      console.log(order);
        this.service.updateOrder(order).then(
          (response) => { 
            this.isLoading = false; 
            this.stitchingDetails = [];
            this.GetStitchingDetails('');
            this.modalReference.close(); 
            console.log(response);
          },
          (error) => {
            console.log(error); this.isLoading = false;
          }) 
    
  }
  //getDetailsByID
  getDetailsByID(stitching_ID, content) {
    this.alerts = []
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  
    this.stitchingDetails = [];  
    this.mode = true;
    this.btnmode = true;
    this.detailOpen(content);
    //this.edit();
    //this.IfExists(production_ID);
  
    this.isLoading = true;
    this.service.getDetailsByID(stitching_ID)
      .subscribe((o: Stitching) => {
        this.isLoading = false;  
        this.production_ID = o.stitching_ID;
        sessionStorage.setItem('exchange', "-1");
        sessionStorage.setItem('ID', o.stitching_ID.toString()); 
         this.prod_Date.setDate(o.stitching_Date);
        console.log(o);
        this.remarks = o.remarks; 
  
        this.service.getPriviledgedOffices(this.userPrivilegedOffice)
            .subscribe(response => {
              //this.isLoading = true
              this.users = (response.json()); 
            });
         
        this.stitchingDetails = o.prod_StitchingDetails; 
        console.log(this.stitchingDetails);
        this.production_ID = o.stitching_ID;
        this.production_No = o.stitching_No;
        this.contractNo = o.knitting_No;
        this.knittingNo = o.knitting_No;
        this.shift_Id = o.shift;
        this.hall_No = o.hall_No;
        this.shiftIncharge = o.shift_Incharge;
        this.fourman = o.fourman;
        this.department_To = o.department_To;
        this.deparment_From = o.deparment_From;
        this.remarks = o.remarks;
        this.status1 = o.status;
        this.isCloseCheckbox = false;
        this.stitchingDetails = [];
        for (let i = 0; i < o.prod_StitchingDetails.length; i++) {
          this.operator_Name = this.operator.filter(f=> f.id == o.prod_StitchingDetails[i].operator_ID)[0].text;
         
          this.stitchingDetails.push(new StitchingDetails(o.prod_StitchingDetails[i].stitchting_Detail_ID, 
            o.prod_StitchingDetails[i].stitchting_ID, o.prod_StitchingDetails[i].item_Code, o.prod_StitchingDetails[i].item_Name, 
            o.prod_StitchingDetails[i].machine_No, o.prod_StitchingDetails[i].quantity, o.prod_StitchingDetails[i].batch_No,
            o.prod_StitchingDetails[i].operator_ID,this.operator_Name, o.prod_StitchingDetails[i].color, 
            o.prod_StitchingDetails[i].size, o.prod_StitchingDetails[i].a_Pair, o.prod_StitchingDetails[i].weight_1, 
            o.prod_StitchingDetails[i].b_Pair, o.prod_StitchingDetails[i].weight_2, o.prod_StitchingDetails[i].wastage, 
            o.prod_StitchingDetails[i].rework, o.prod_StitchingDetails[i].article, false));
        }
        if(this.status1 == 2 || this.status1 == 1)
        {
          if(this.status1 == 1)
          this.isCloseCheckbox = true;
          else
          this.isCloseCheckbox = false;
  
          $("#submitUpdate").prop("disabled", true);
          $("#AddNewItemRow").hide();
          // $("#remove").prop("disabled", true);
          // $("#edit").prop("disabled", true);
          $("#cancelBtn").prop("disabled", true);
        }
  
      });
  
  }
     // open modal
     open(content) { 
      this.btnmode = false;
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
      };
      // console.log(ngbModalOptions);
      this.modalReference = this.modalService.open(content, { size: 'xlg' }); 
      this.modalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }); 
   
   this.clearFields(); 
  
    }
    detailOpen(content) {
      this.btnmode = true;
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
      $("#file-input").prop("disabled", false);
      $("#submitAdd").hide();
      $("#submitAddMore").hide();
      $("#submitUpdate").show();
      $("#viewRDLC").prop("disabled", false);
      $("#viewExcel").prop("disabled", false);
      $("#cancelBtn").show();
      
      
  
      $("#allowExchange").hide();
      //$("#viewBtn").hide();
      $("#viewStamp").show();
      
  
      this.clearFields(); 
  
      //this.rdlcStatus();
      
      $("#AddItem").prop("disabled", true);
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
          this.service.cancelOrder(this.production_ID, this.actionID)
            .subscribe(response => {
              swal("Poof! Your order has been cancelled!", {
                icon: "success",
              });
              this.cancelReturn = (response.json());
              this.GetStitchingDetails('');
              this.modalReference.close();
            });
        } else {
          swal("Your order is safe!");
        }
      });
  }
  }
