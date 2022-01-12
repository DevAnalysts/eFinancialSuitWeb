import { Component, OnInit } from '@angular/core';  
import { ModalDismissReasons, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PermissionUtility } from '@shared/common/PermissionUtility';
import { Validation } from '@shared/common/validation';
import { cDate } from '@shared/directives/custom-date';
import { dailyProduction } from '@shared/models/SupplyChain/CRM/dailyProduction'; 
import { dailyProductionDetails } from '@shared/models/SupplyChain/CRM/dailyProductionDetails';
import { LoginService } from '@shared/services/login-service/login.service';
import { BudgetingService } from '@shared/services/SupplyChain/CRM/budgeting/budgeting.service';
import { DailyProductionService } from '@shared/services/SupplyChain/CRM/daily-production/daily-production.service';
import { Select2OptionData } from 'ng-select2';
import swal from 'sweetalert';

@Component({
  selector: 'app-sample-request',
  templateUrl: './sample-request.component.html',
  styleUrls: ['./sample-request.component.css']
})
export class SampleRequestComponent implements OnInit {

public permissionUtility:PermissionUtility=new PermissionUtility();
public valid:Validation=new Validation();
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  //customer_ID:any;
  modalReference: NgbModalRef;
  isLoading: any = false;
  closeResult: string; 
  mKT_remarks:any='';
  pD_remarks:any='';
  remarks:any='';
  imageUrl: string = "../../../../assets/images/user-thumbnail.png";
  fileToUpload: File = null;
  referenceNo:any;
  style:any;
  fabricType:any;
  heelType:any;
  needle:any;
  customerReg:any;
  baseColor:any;
  yarnAvail:any;
  custSize:any;
  requiredQty:any;
  cycleTime:any;
  departments:any=[];
  hallNo:any;
  
  contractNo:any = '';
  
  fourmans:any=[];
   
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
  sale_Order_ID = 0;
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
  actionID: any = 4;
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
  AllProductions: any=[];
  shiftIncharges: any=[];
  article: any = 'Crew(Complate)';
  department_From_ID: any = 0;
  department_To_ID: any = 0;
  edit_Mode: any = false;
  RemoveItemButton: any = '';

  constructor(private loginService: LoginService,private modalService: NgbModal, private service:DailyProductionService,private budgetingService:BudgetingService) {
    this.dailyProductionDetails = new Array<dailyProductionDetails>();
    this.userOffice = this.loginService.getSession('userOffice');
    this.userPrivilegedOffice = this.loginService.getSession('userPrivilegedOffice'); 
    this.userCurrentOffice = this.loginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.loginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
   }

  ngOnInit() {
    this.permissionUtility.setPagePermissions(140055);


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
      this.GetDailyProductionDetails("");
      this.getAllContractNo();
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
 GetDailyProductionDetails(value: string) {
  this.isLoading = true;
  this.service.GetDailyProductionDetails(value, this.userPrivilegedOffice)
    .subscribe(response => {
      if(response.json()!==null){
        this.isLoading = false;
        this.AllProductions = (response.json());
      }else{
        this.AllProductions = [];
        this.isLoading = false;
      }
      
    });
}

 //EmployeeImagePreview
 handleFileInput(file: FileList) {

  this.fileToUpload = file.item(0);
  console.log('-------------------------' + this.fileToUpload);
  //Show image preview
  var reader = new FileReader();
  reader.onload = (event: any) => {
    this.imageUrl = event.target.result;
  }
  reader.readAsDataURL(this.fileToUpload);

}
 //getAllContractNo
 getAllContractNo()
 {
   this.service.getAllContractNo()
   .subscribe(response => {
     this.contractNos = (response.json());
     this.contractNo = this.contractNos[0].contract_No;
     //alert(this.contractNos[0].saleOrderid);
     this.sale_Order_ID = this.contractNos[0].saleOrderid;
     this.getItems(this.sale_Order_ID);
   });
 }
 getContractDetail(contract)
 {
    
    this.sale_Order_ID = this.contractNos.filter(f=>f.contract_No == contract)[0].saleOrderid;
    this.getItems(this.sale_Order_ID);
 }
 //getItems  
 getItems(sale_Order_ID) {
  // this.isLoading = true; 
  this.budgetingService.getItems(sale_Order_ID)
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
    this.production_No = '';
    this.contractNo = this.contractNos[0].contract_No;
    this.shift_Id = 1;
    this.hall_No = 0;
    this.shiftIncharge = this.shiftIncharges[0].shift_inch_Id;
    this.fourman = this.fourmans[0].fourman_Id;
    this.deparment_From =  this.departments[0].dept_Id;
    this.department_To =  this.departments[0].dept_Id;
    this.remarks ='';
    this.dailyProductionDetails = [];
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
//updateItem 
updateItem(i: dailyProductionDetails, e: any) {
  if (this.sessionEnableTextboxItem != 1) {
    this.item_Code = e;
    i.item_Code = e;
    i.item_Name = this.items.filter(f=> f.id == this.item_Code)[0].text;
  } else {
    this.item_Code = this.textboxItemIDEdit;

  }
  this.isLoading = false;
}
updateOperator(i: dailyProductionDetails, e: any) {
    this.operator_ID = e;
    i.operator_ID = e;
    i.operator_Name = this.operator.filter(f=> f.id == this.operator_ID)[0].text;
 
  this.isLoading = false;
}
//changeMode
changeMode(idx: any, i:  dailyProductionDetails, Mode: any) {
     
  this.DelayCheck = true;
  $('td.active').removeClass('active');
  console.log("Index : " + idx + "--- Page :" + this.g);
  console.log(i);
 



  var flag = false;
  if (this.dailyProductionDetails.length > 0) {
    for (var count = 0; count < this.dailyProductionDetails.length; count++) {
      if (this.dailyProductionDetails[count].item_Code == i.item_Code && idx != count) {
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
          this.dailyProductionDetails.splice(idx, 1);
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
          this.dailyProductionDetails.splice(idx, 1);

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
            if (this.dailyProductionDetails.length > 0) {
              for (var count = 0; count < this.dailyProductionDetails.length; count++) {
                if (this.dailyProductionDetails[count].item_Code == item_Code) {
                  flag = true; 
                  swal("Item already exist","","info");
                  break;
                }
              }
            }
            if (flag == false) {
              
                this.dailyProductionDetails.push(new dailyProductionDetails(0, 0, item_Code, this.item_Name, this.machine_No, quantity, batch_No,this.operator_ID, this.operator_Name, this.color, this.size, this.A_Pair, this.weight_1, this.B_Pair, this.weight_2, this.wastage, this.rework, this.article, false));
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
      if(this.dailyProductionDetails.length == 0)
      {
        this.isLoading = false;
        swal("Please Enter Item Details","","info")
        return
      }
      var order = new dailyProduction(0, this.prod_Date.getDateFinal(), this.production_No, this.contractNo, this.shift_Id, this.hall_No,
        this.shiftIncharge, this.fourman, this.deparment_From, this.department_To, this.remarks,this.created_By,this.userSessionID, this.dailyProductionDetails,0);

      this.service.saveOrder(order).then(
        (response) => {

          this.isLoading = false;
          this.ID = response;  
          this.dailyProductionDetails = [];
          this.GetDailyProductionDetails('');
          this.modalReference.close();
          console.log(response);
         
        },
        (error) => {
          console.log(error); this.isLoading = false;
        })  
}
//updateOrder
updateOrder() {
   
   
      this.isLoading = true;
      var order = new dailyProduction(this.production_ID, this.prod_Date.getDateFinal(), this.production_No, this.contractNo, this.shift_Id, this.hall_No,
        this.shiftIncharge, this.fourman, this.deparment_From, this.department_To, this.remarks,this.created_By,this.userSessionID, this.dailyProductionDetails,0);

      this.service.updateOrder(order).then(
        (response) => { 
          this.isLoading = false; 
          this.dailyProductionDetails = [];
          this.GetDailyProductionDetails('');
          this.modalReference.close(); 
          console.log(response);
        },
        (error) => {
          console.log(error); this.isLoading = false;
        }) 
  
}
//getDetailsByID
getDetailsByID(production_ID, content) {
  this.alerts = []
  this.alerts.push(
    {
      id: 4,
      type: 'danger',
      message: 'Record is not updatable since it is being used...',
    });

  this.dailyProductionDetails = [];  
  this.mode = true;
  this.btnmode = true;
  this.detailOpen(content);
  //this.edit();
  //this.IfExists(production_ID);

  this.isLoading = true;
  this.service.getDetailsByID(production_ID)
    .subscribe((o: dailyProduction) => {
      this.isLoading = false;  
      this.production_ID = o.production_ID;
      sessionStorage.setItem('exchange', "-1");
      sessionStorage.setItem('ID', this.production_ID.toString()); 
      this.prod_Date.setDate(o.prod_Date);
      console.log(o);
      this.remarks = o.remarks; 

      this.service.getPriviledgedOffices(this.userPrivilegedOffice)
          .subscribe(response => {
            //this.isLoading = true
            this.users = (response.json()); 
          });
       
      this.dailyProductionDetails = o.prod_KnittingDetails; 
      console.log(this.dailyProductionDetails);
      this.production_ID = o.production_ID;
      this.production_No = o.production_No;
      this.contractNo = o.contract_No;
      this.shift_Id = o.shift;
      this.hall_No = o.hall_No;
      this.shiftIncharge = o.shift_Incharge;
      this.fourman = o.fourman;
      this.department_To = o.department_To;
      this.deparment_From = o.deparment_From;
      this.remarks = o.remarks;
      this.dailyProductionDetails = [];
      for (let i = 0; i < o.prod_KnittingDetails.length; i++) {
        this.operator_Name = this.operator.filter(f=> f.id == o.prod_KnittingDetails[i].operator_ID)[0].text;
       
        this.dailyProductionDetails.push(new dailyProductionDetails(o.prod_KnittingDetails[i].prod_Detail_ID, 
          o.prod_KnittingDetails[i].production_ID, o.prod_KnittingDetails[i].item_Code, o.prod_KnittingDetails[i].item_Name, 
          o.prod_KnittingDetails[i].machine_No, o.prod_KnittingDetails[i].quantity, o.prod_KnittingDetails[i].batch_No,
          o.prod_KnittingDetails[i].operator_ID,this.operator_Name, o.prod_KnittingDetails[i].color, 
          o.prod_KnittingDetails[i].size, o.prod_KnittingDetails[i].a_Pair, o.prod_KnittingDetails[i].weight_1, 
          o.prod_KnittingDetails[i].b_Pair, o.prod_KnittingDetails[i].weight_2, o.prod_KnittingDetails[i].wastage, 
          o.prod_KnittingDetails[i].rework, o.prod_KnittingDetails[i].article, false));
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

}
