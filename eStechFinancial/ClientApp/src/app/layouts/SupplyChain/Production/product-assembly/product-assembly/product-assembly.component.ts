import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProductAssemblyService, SaleOrderService, ProductAssembly, ProductAssemblyDetails, LoginService, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'product-assembly',
  templateUrl: './product-assembly.component.html',
  styleUrls: ['./product-assembly.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ProductAssemblyComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility:PermissionUtility=new PermissionUtility();    

  p: number = 1;
  modalReference: NgbModalRef;
  assemblies: any[] = [];
  ProductAssemblyDetails: any[];
  userPrivilegedOffice: any;
  guid: any;
  order_ID: any;
  users: any;
  closeResult: string;
  mode: any = 0;
  btnmode: any = 0;
  date = new Date();
  public consume_ID: any;
  public consume_NO: any = "";
  public item_Code: any = 1;
  public order_Envoy: any = 1;
  public item_Name: any;
  public item_Detail: any = '';
  public office_Code: any;
  public remarks: any;
  public consume_Cost: any = 0.00;
  public productionCost: any = 0.00;
  public overheadCost: any = 0.00;
  public materialCost: any = 0.00;
  public totalCost: any = 0.00;
  public unitCost: any = 0.00;
  quantity: any = 1;
  unitPrices: any[];
  materials: any[];
  unit_Price: any = 1;
  stocks: any[];
  offices: any[];
  warehouses: any[];
  stock_Qty: any = "";
  Batch_No:any=0;
  isLoading: boolean;
  item: Array<Select2OptionData>;
  items: Array<Select2OptionData>;
  public consume_Date = new cDate();
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  userOffice: any;
  userCurrentOffice: any; 
  userCurrentWarehouse: any;
  warehouse: any=0;
  Office: any=0;
  unit : any = 0;
  total_Material_Cost:any=0.00;
  unitList: any[] = [];
  unitList1: any[] = [];
  total_Production_Cost: any=0.00;
  total_OverHead_Cost: any=0.00;
  total_Unit_Cost: any=0.00;
  grand_Total:any=0.00;
  constructor(private service: ProductAssemblyService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal, private saleOrderService: SaleOrderService) {
    this.ProductAssemblyDetails = new Array<ProductAssemblyDetails>();
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  }

  ngOnInit() {
    this.getAssembly();
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(120008);  

//////////current office////////////////
this.LoginService.getCurrentOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = (response.json());
        console.log('offices',this.offices)
        if (this.offices != null) {  
          this.Office = this.userCurrentOffice; 
          for (let i = 0; i < this.offices.length; i++)
            if (this.offices[i].officE_CODE == this.userCurrentOffice) {
              var timer = setTimeout(() => this.Office = this.offices[i].officE_CODE, 500);
            }
            else { this.Office = this.offices[0].officE_CODE; }
        }
        else { this.Office = this.offices[0].officE_CODE; }
        //------------------------------------------------------------------------------------
        //-------------------Get Current Warehouses
        //------------------------------------------------------------------------------------
        //alert(this.userOffice);
        this.LoginService.getCurrentWareshouse(this.userOffice)
          .subscribe(response => {
            console.log(response.json());
            this.warehouses = (response.json());
            if (this.warehouses != null) {
              this.warehouse = this.warehouses[0].warehouseID;
            }
          });
          //alert(this.userCurrentOffice)
        this.LoginService.getCurrentWareshouse(this.userCurrentOffice)
          .subscribe(response => {
            this.warehouses = (response.json()); 
            this.warehouse = this.warehouses[0].warehouseID; 
            if (this.warehouses != null) { 
              for (let i = 0; i < this.warehouses.length; i++)
                if (this.warehouses[i].warehouseID == this.userCurrentWarehouse) {
                  console.log(this.warehouses[i].warehouseID);
                  this.warehouse = this.warehouses[i].warehouseID;
                  
                }
                else { this.warehouse = this.warehouses[0].warehouseID; }
            }
            else { this.warehouse = this.warehouses[0].warehouseID; }

          });
          

      });





  }
  //getAssembly
  getAssembly() {
    this.isLoading = true;
    this.service.getAssembly()
      .subscribe(response => {
        this.isLoading = false;
        this.assemblies = (response.json());

        //  console.log(response.json());
      });
  }

  /* getOffices() {
    this.isLoading = true;
    this.service.getOffices()
      .subscribe(response => {
        this.offices = (response.json());
        console.log(this.offices);
        this.Office = this.offices[0].office_Code;
         this.getWarehouses(); 
          this.isLoading=false;
      });
  } */

 /*  getWarehouses(){ 
    this.service.getWarehouse(this.Office)
    .subscribe(response => {
      this.warehouses = (response.json()); 
      this.warehouse = this.warehouses[0].warehouseID; 
       
    });
    
  } */
  getUnit(mood)
  {
    if(mood == 0)
    {
      this.saleOrderService.getUnits(mood).subscribe(response => {
        this.unitList1 = (response.json());
        
      });
    }
    else{
        this.saleOrderService.getUnits(mood).subscribe(response => {
        this.unitList = (response.json());
        if(this.unitList!=null){
        this.unit = this.unitList[0].unitID;
        console.log(this.unitList);
        }
      });
    }
  }
  //getItems  
  getItems() {
    this.isLoading = true;
    //alert(this.Office+'----'+this.warehouse)
    this.service.getItems(this.Office,this.warehouse)
      .subscribe(response => {
        this.isLoading = false;
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        if(this.items.length!=0){
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        }
        this.changeItems(this.item_Code);
        // console.log(response.json());
      });
  }
  getUnitName(id)
  {
    return this.unitList1.filter(f=>f.unitID == id)[0].unit;
  }
  //changeItems
  changeItems(e: any) {
    this.item_Code = e;
    var list = this.items;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].id == this.item_Code) {
          this.item_Name = list[i].text;

        }
    }
    this.isLoading = true;
    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.unitPrices = (response.json());
          this.unit_Price = this.unitPrices[0].unit_Price;
          console.log('unit_Price----------------------' + this.unit_Price);
          // this.item_Name = this.unitPrices[0].item_Name;
           

          this.isLoading = true;
          this.service.getStocks(this.item_Code, this.Office, this.warehouse)
            .subscribe(response => {
              this.isLoading = false;
               
              if (response.json() != null) {
                this.stocks = (response.json());
                if (this.stocks != null) {
                  this.stock_Qty = this.stocks[0].stock_Qty;
                  this.getUnit(this.item_Code);
                  this.calculateMaterialCost();
                }
              }
            });
        }

      });
    //  console.log(response.json());
  }
  //changeQuantity
  changeQuantity(quantity) {
    if (quantity <= 0) {
      this.quantity = 1;
    }
  }
  //changeQuantityEdit
  changeQuantityEdit(i: ProductAssemblyDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //changeProduction
  changeProduction(productionCost) {
    if (productionCost <= 0) {
      this.productionCost = 1;
    }
  }
  //changeProductionEdit
  changeProductionEdit(i: ProductAssemblyDetails, productionCost) {
    if (productionCost <= 0) {
      i.productionCost = 1;
    }
  }
  //changeOverhead
  changeOverhead(overheadCost) {
    if (overheadCost <= 0) {
      this.overheadCost = 1;
    }
  }
  //changeOverheadEdit
  changeOverheadEdit(i: ProductAssemblyDetails, overheadCost) {
    if (overheadCost <= 0) {
      i.overheadCost = 1;
    }
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    //this.isLoading = true; 
    this.service.getPriviledgedOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        //this.isLoading = false;
        this.users = (response.json());
        this.order_Envoy = this.users[0].order_Envoy;
        //  console.log(this.users);
      });
  }
  //Total Cost
  TotalCost() { 
    var total_Cost = 0.00;
    if (this.ProductAssemblyDetails.length > 0) {
      for (var count = 0; count < this.ProductAssemblyDetails.length; count++) {
        total_Cost += this.ProductAssemblyDetails[count].unit_Price * this.ProductAssemblyDetails[count].quantity;
        this.consume_Cost = total_Cost;
      }
    }

    return total_Cost.toFixed(2);
  }
  TotalCostCalculation(){ 
    var currentItemMaterialCost=0.00 ;  
    if (this.ProductAssemblyDetails.length > 0) {
      for (var count = 0; count < this.ProductAssemblyDetails.length; count++) {  
        currentItemMaterialCost = this.ProductAssemblyDetails[count].materialCost;  
        
      }
      

      this.total_Material_Cost = this.total_Material_Cost + currentItemMaterialCost;
      this.total_Production_Cost += this.productionCost;
      this.total_OverHead_Cost += this.overheadCost;  
      this.consume_Cost = this.total_Material_Cost + this.total_Production_Cost + this.total_OverHead_Cost;
      this.grand_Total = this.consume_Cost;
    }

    return this.total_Material_Cost.toFixed(2);
  }
  
  //TotalQty
  TotalQty() {
    var sum = 0.00;
    if (this.ProductAssemblyDetails.length > 0) {
      for (var count = 0; count < this.ProductAssemblyDetails.length; count++) {
        sum += this.ProductAssemblyDetails[count].unitCost;     
        this.consume_Cost = sum;
      }
    }

    return sum;
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {

      //if (this.btnmode)
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
  //clearFields
  clearFields() {
    this.remarks = "";
    this.mode = false;
    this.btnmode = true;
    this.item_Code = 0;
    this.quantity = 1;
    this.unit_Price = 1;

    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.guid = UUID.UUID();
    this.ProductAssemblyDetails = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.getItems();
    //this.getOffices();
    this.getPriviledgedOffices();
  }
  //updateItem 
  updateItem(i: ProductAssemblyDetails, e: any) {
    this.item_Code = e;

    this.isLoading = true;
    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.isLoading = false;
        this.unitPrices = (response.json());
        //  console.log(this.unitPrices);
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
      });

    i.item_Code = this.item_Code;
    i.item_Name = this.item_Name;
  }
  //changeMode
  changeMode(idx: any, i: ProductAssemblyDetails, Mode: any) { 
    var flag = false;
    if (this.item_Code.length > 0) {
      for (var count = 0; count < this.item_Code.length; count++) {
        if (this.item_Code[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {
      if (flag == false) {
        if (i.quantity > 0) {
          i.edit_Mode = false; 
          
          this.service.getMaterialCost(this.userCurrentOffice, this.userCurrentWarehouse, i.item_Code, i.quantity)
            .subscribe(response => {
              if (response.json() != null) {
                this.materials = (response.json());
                this.materialCost = this.materials[0].materialCost;
                this.totalCost = ((i.productionCost + i.overheadCost + this.materials[0].materialCost) / i.quantity).toFixed(2);
                this.unitCost = this.totalCost;
                i.unitCost = this.unitCost;
                i.materialCost = this.materials[0].materialCost;              
                //this.TotalQty();

                this.item_Code = 0;
                this.item_Name = '';
                this.quantity = 1;
                this.item_Detail = '';
                //this.productionCost = 0;
                //this.overheadCost = 0;
                //this.materialCost = 0;
                //this.unitCost = 0;
              }
            }); 
            this.total_Production_Cost += i.productionCost;
            this.total_OverHead_Cost += i.overheadCost;
             


        } else {
          swal("Quantity should be greater then 0");
          return;
        }
      } else {
        swal("Already Exists");
        return;
      }
    
    }
    else if (Mode == 2) {
      this.ProductAssemblyDetails.splice(idx, 1);
      this.TotalQty();
      this.TotalCostCalculation();

    }
    else {
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.item_Code) {
          this.item_Code = this.items[j].id;
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

  }


/*   calculateMaterialCostEdit(i:ProductAssemblyDetails){
             this.service.getMaterialCost(this.userCurrentOffice, this.userCurrentWarehouse, i.item_Code, i.quantity)
            .subscribe(response => {
              if (response.json() != null) {
                this.materials = (response.json());
                this.materialCost = this.materials[0].materialCost;
                this.totalCost = ((i.productionCost + i.overheadCost + this.materials[0].materialCost) / i.quantity).toFixed(2);
                this.unitCost = this.totalCost;
                i.unitCost = this.unitCost;
                i.materialCost = this.materials[0].materialCost;              
                //this.TotalQty();

                this.item_Code = 0;
                this.item_Name = '';
                this.quantity = 1;
                this.item_Detail = '';
                //this.productionCost = 0;
                //this.overheadCost = 0;
                //this.materialCost = 0;
                //this.unitCost = 0;
              }
            }); 
  } */

//calculate material cost
calculateMaterialCost(){
  
    this.service.getMaterialCost(this.Office, this.warehouse, this.item_Code, this.quantity)
    .subscribe(response => {
      if (response.json() != null) {
        this.materials = (response.json());
        this.materialCost = this.materials[0].materialCost; 
        this.totalCost = ((this.productionCost + this.overheadCost + this.materials[0].materialCost) / this.quantity).toFixed(2);
        this.unitCost = this.totalCost;
        
      }
    });
}

  //addGrid
  addGrid(item_Code: any, item_Name: any, item_Detail: any, quantity: any, productionCost: any, overheadCost: any, materialCost: any, unitCost: any) {
    if (this.stocks != null) {
      this.service.getMaterialQtyForProduction(item_Code).subscribe
        (response => {
          var rMQty = (response.json());
              for (let i = 0; i < this.stocks.length; i++) {
                this.stock_Qty = this.stocks[i].stock_Qty;
                let productionQty = rMQty[i].stock_Qty;
                if (this.stock_Qty != null && this.stock_Qty >= quantity * productionQty) {
                    if(i<this.stocks.length -1)
                    continue;
                  $("#submitAdd").prop("disabled", false);
                  if (item_Name != null) {
                    if (quantity > 0) {

                      var flag = false;
                      if (this.ProductAssemblyDetails.length > 0) {
                        for (var count = 0; count < this.ProductAssemblyDetails.length; count++) {
                          if (this.ProductAssemblyDetails[count].item_Code == item_Code) {
                            flag = true;
                            break;
                          }
                        }
                      }
                      if (flag == false) {
                        this.ProductAssemblyDetails.push(new ProductAssemblyDetails(0, 0, item_Code, item_Name,'', quantity, item_Detail, this.unit_Price, this.unitCost, productionCost, overheadCost, this.materials[0].materialCost, this.unitCost, 0, this.unit));
                        this.TotalQty();
                        this.TotalCostCalculation(); 
                        this.item_Code = 0;
                        this.item_Name = '';
                        this.quantity = 1;
                        this.item_Detail = '';
                        this.productionCost = 0;
                        this.overheadCost = 0;
                        this.materialCost = 0;
                        this.unitCost = 0;
                        this.mode = false; 
                        return;
                      }
                      else {
                        //if (this.stocks.length == 1)
                        swal("Already Exists");
                        return;
                      }
                    }
                    else {
                      swal("Qty is required. Qty not be zero and should be numeric");
                      return;
                    }
                  } else {
                    swal("Item is Required.");
                    return;
                  }

                }
                else {

                  $("#submitAdd").prop("disabled", true);
                  swal("Stock is not available.");
                  return;
                }
              }
          
        });
      
    }
    else {
      swal("Stock is not available.");
      return;
    }
    $("#txt").focus();
    //  this.scrollToBottom();
  }
  //saveAssembly
  saveAssembly() { 
    //if (!this.guidExist(this.guid)) {
    //  if (Total_Amount > 0) {

    this.isLoading = true;
     
    var order = new ProductAssembly(0, "", this.consume_Date.getDateFinal(), this.Office, this.order_Envoy, this.remarks, this.consume_Cost, this.consume_Cost, 0, this.logedInUserID, this.UserSessionID,this.guid,this.Batch_No,this.Office,this.warehouse, this.ProductAssemblyDetails);
    if (this.ProductAssemblyDetails.length > 0) {
      $("#submitAdd").prop("disabled", true);
      this.service.saveAssembly(order).then(
        (response) => {
          this.isLoading = false;
          this.getAssembly();
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("Please! Insert at least one record.");
      return;
    }
    //  }
    //  else {
    //    alert("- Order should be greater then 0.");
    //  }
    //}
    //else { alert("- Error: Already exists."); }
  }
  //updateAssembly
  updateAssembly() {
    //if (!this.guidExist(this.guid)) {
    //  if (Total_Amount > 0) {

    this.TotalQty();
    this.isLoading = true;
    var order = new ProductAssembly(this.consume_ID, "", this.consume_Date.getDateFinal(), 1, 1, this.remarks, this.consume_Cost, this.consume_Cost, 0, this.logedInUserID, this.UserSessionID,this.guid,this.Batch_No,this.Office,this.warehouse, this.ProductAssemblyDetails);
    this.service.updateAssembly(order).then(
      (response) => {
        this.isLoading = false;
        this.getAssembly();
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))
    //  }
    //  else {
    //    alert("- Order should be greater then 0.");
    //  }
    //}
    //else { alert("- Error: Already exists."); }
  }
  //getDetailsByID
  getDetailsByID(consume_ID, content) {
    //this.open(content);
    //this.edit();
    //this.IfExists(sale_Order_ID);

    this.isLoading = true;
    this.detailOpen(content);
    this.mode = true;
    this.btnmode = false;
    this.service.getDetailsByID(consume_ID)
      .subscribe((o: ProductAssembly) => {
        console.log(o);
        this.isLoading = false;
        this.consume_ID = o.consume_ID;
        this.consume_Date.setDate(o.consume_Date);
        this.order_Envoy = o.consume_By_ID;
        this.remarks = o.remarks;

        this.ProductAssemblyDetails = o.productAssemblyDetails;
        this.getPriviledgedOffices();
        //this.getItems();

        this.isLoading = true;
        this.service.getItems(this.Office,this.warehouse)
          .subscribe(response => {
            this.isLoading = false;
            this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
            this.item_Code = this.items[0].id;
            this.item_Name = this.items[0].text;

            this.isLoading = true;
            this.service.getUnitPrice(this.item_Code)
              .subscribe(response => {
                this.isLoading = false;
                if (response.json() != null) {
                  this.unitPrices = (response.json());
                  this.unit_Price = this.unitPrices[0].unit_Price;
                  this.item_Name = this.unitPrices[0].item_Name;

                  this.isLoading = true;
                  this.service.getStocks(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
                    .subscribe(response => {
                      this.isLoading = false;
                      if (response.json() != null)
                        this.stocks = (response.json());
                      if (this.stocks != null) {
                        this.stock_Qty = this.stocks[0].stock_Qty;
                      }
                    });
                }
              });

          });


      });
  }
  // open modal
  open(content) {
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
    this.clearFields();
    this.getUnit(0);
    this.total_Material_Cost          = 0.00;
    this.total_Production_Cost        = 0.00;
    this.total_OverHead_Cost          = 0.00;
    this.total_Material_Cost          = 0.00;
    this.totalCost                    = 0.00;
    this.grand_Total                  = 0.00;
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
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#cancelBtn").show();
    this.getUnit(0);
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

}
