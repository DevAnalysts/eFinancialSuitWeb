import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RecipeCardService, RecipeCard, RecipeCardDetails, LoginService, SaleOrderService } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss']
})
export class RecipeCardComponent implements OnInit {
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
  recipes: any[] = [];
  recipeCardDetails: any[];
  guid: any;
  closeResult: string;
  mode: any = false;
  btnmode: any = 0;
  date = new Date();
  public rC_ID: any;
  public rC_NO: any = "";
  public item_ID: any = "";
  public item_Names: any = "";
  public item_Code: any = "";
  public item_Name: any = "";
  public office_Code: any;
  public remarks: any;
  public cRGUID: any;
  quantity: any = 1;
  isLoading: boolean;
  unitPrices: any[];
  unit_Price: any = 0;
  materialfor: any = 0;
  maxbatchsize: any = 0;
  status: any;
  unit : any = '';
  prod_unit_ID: any = 0;
  unit_id : any = 0;
  item_Detail: any ='';
  prod_unit:any='';
  unitList: any[] = [];
  unitList1: any[] = [];
  alerts: Array<any> = [];
  item: Array<Select2OptionData> = [];
  items: Array<Select2OptionData> = [];
  public rC_Date: any = this.date.getFullYear() + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + ('0' + this.date.getDate()).slice(-2);
  ID: any = "";
  constructor(private service: RecipeCardService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal, private saleOrderService: SaleOrderService) {
    this.recipeCardDetails = new Array<RecipeCardDetails>();
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getRecipeCard(this.ID);
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 120007) {
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
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getRecipeCard
  getRecipeCard(value: string) {
    this.isLoading = true;
    this.service.getRecipeCard(value)
      .subscribe(response => {
        if(response.json()!=null){
        this.recipes = (response.json());
        }
        else{
          this.recipes=[];
        }
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getItem
  getItem(mode, item_Code) {
    this.service.getItem(mode, item_Code)
      .subscribe(response => {
        this.item = this.getDropdownList(response.json(), "item_Code", "item_Name");
        console.log(this.item); 
        this.item_ID = this.item[0].id;
        this.item_Name = this.item[0].text;
        console.log(response.json());
        
      });
  }
  //getItems  
  getItems() {
    this.service.getItems()
      .subscribe(response => {
        this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        console.log(response.json());
      });
  }
  //changeItems
  changeI(e: any) {
    this.item_ID = e;
    this.service.getUnitPrice(this.item_ID)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.item_ID = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.getProdUnit(this.item_ID);
        //  console.log(response.json());
      });
  }

getProdUnit(item_ID){
   
  if(item_ID == 0)
  {
    this.saleOrderService.getUnits(item_ID).subscribe(response => {
      this.unitList1 = (response.json());
      
    });
  }
  else{
      this.saleOrderService.getUnits(item_ID).subscribe(response => {
      this.unitList = (response.json());
 
      if(this.unitList!=null){ 
      this.prod_unit = this.unitList[0].unit;
      this.prod_unit_ID = this.unitList[0].unitID;
      //console.log(this.unitList);
      }
    });
  }
}

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
//console.clear();
//console.log(this.unitList);
        if(this.unitList!=null){
        this.unit = this.unitList[0].unit; 
        this.unit_id = this.unitList[0].unitID;
        console.log(this.unitList);
        }
      });
    }
  }
  getUnitName(id)
  {
    return this.unitList1.filter(f=>f.unitID == id)[0].unit;
  }
  //changeItems
  changeItems(e: any) {
    this.item_Code = e;
    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
        this.getUnit(this.item_Code); 

        //  console.log(response.json());
      });
  }
  //changeQuantity
  changeQuantity(quantity) {
    if (quantity <= 0) {
      this.quantity = 1;
    }
  }
  //changeQuantityEdit
  changeQuantityEdit(i: RecipeCardDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
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
  //clearFields
  clearFields() {
    this.remarks = "";
    this.item_Code = "";
    this.quantity = 1;
    this.recipeCardDetails = [];
    this.guid = UUID.UUID();
    this.item = [];
    this.items = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.mode = false;
    this.btnmode = true;
    this.materialfor = 0;
    this.maxbatchsize = 0;

  }
  //IfExists
  IfExists() {
    this.service.IfExists(this.item_ID)
      .subscribe(response => {
        this.status = (response.json());

        if (this.status == true) {
          //   $("#alertWarning").show();
          $("#submitAdd").prop("disabled", true);
          swal("Already Exists");
        }
        else {
          //  $("#alertWarning").hide();
          $("#submitAdd").prop("disabled", false);
        }
      });
  }
  //updateItem 
  updateItem(i: RecipeCardDetails, e: any) {
    //alert(e.value);
    this.item_Code = e;
    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.unitPrices = (response.json());
        this.unit_Price = this.unitPrices[0].unit_Price;
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;

        i.item_Code = this.item_Code;
        i.item_Name = this.item_Name;

      });


  }
  //changeMode
  changeMode(idx: any, i: RecipeCardDetails, Mode: any) {
    this.item_Code = i.item_Code;
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
        } else {
          swal("Quantity should be greater then 0");
        }
      } else {
        swal("Already Exists");
      }
    }
    else if (Mode == 2) {
      this.recipeCardDetails.splice(idx, 1);

    }
    else {
      console.log(i);
      i.edit_Mode = true;
    }
  }
  //addGrid
  addGrid(item_Code: any, item_Name: any, item_Detail: any, quantity: any, Discount_Rate: any) {
    if (item_Name != null) {
      if (quantity > 0) {
        var flag = false;
        if (this.recipeCardDetails.length > 0) {
          for (var count = 0; count < this.recipeCardDetails.length; count++) {
            if (this.recipeCardDetails[count].item_Code == item_Code) {
              flag = true;
              break;
            }
          }
        }
        if (flag == false) { 
          //alert(item_Code+'--'+this.item_ID)
            this.recipeCardDetails.push(new RecipeCardDetails(0, 0, this.item_Code, item_Name, this.item_Detail, quantity, 0, this.unit_id));
            //this.mode = false;
        }
        else {
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
    $("#submitAdd").prop("disabled", false);
    $("#txt").focus();
    //  this.scrollToBottom();
  }
  //saveRecipe
  saveRecipe(item_ID: any) {
    //if (!this.guidExist(this.guid)) {
    //  if (Total_Amount > 0) {
    $("#submitAdd").prop("disabled", true);
    this.service.IfExists(this.item_ID)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#submitAdd").prop("disabled", false);
          swal("Already Exists");
        }
        else {  
          var order = new RecipeCard(0, this.rC_Date, "", item_ID, 1, this.remarks, this.guid, this.logedInUserID, 1, this.materialfor, this.maxbatchsize, this.recipeCardDetails,this.prod_unit_ID);
          if (this.recipeCardDetails.length > 0) {
            if (this.item_ID > 0) {
              this.service.saveRecipe(order).then(
                (response) => {
                  this.getRecipeCard(this.ID);
                  this.modalReference.close();
                  //console.log(response);
                },
                (error) => console.log(error))
            }
            else
              swal("Please! Insert at least one Item");
          }
          else
            swal("Please! Insert at least one record");
        }
      });
    //  }
    //  else {
    //    alert("- Order should be greater then 0.");
    //  }
    //}
    //else { alert("- Error: Already exists."); }
  }
  //updateRecipe
  updateRecipe(item_ID: any) {
    //if (!this.guidExist(this.guid)) {
    //  if (Total_Amount > 0) {
    var order = new RecipeCard(this.rC_ID, this.rC_Date, "", this.item_ID, 1, this.remarks, this.guid, this.logedInUserID, this.UserSessionID, this.materialfor, this.maxbatchsize, this.recipeCardDetails,0);
    this.service.updateRecipe(order).then(
      (response) => {
        this.getRecipeCard(this.ID);
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
  getDetailsByID(rC_ID, content) {
    this.detailOpen(content);
    this.mode = true;
    this.service.getDetailsByID(rC_ID)
      .subscribe((o: RecipeCard) => {
        this.rC_ID = o.rC_ID;
        this.rC_Date = o.rC_Date;
        this.remarks = o.remarks;
        this.materialfor = o.materialfor;
        this.maxbatchsize = o.maxbatchsize;
        this.unit = o.unitID;

        this.recipeCardDetails = o.recipeCardDetails;
        this.service.getItem(this.mode, o.item_Code)
          .subscribe(response => {
            this.item = this.getDropdownList(response.json(), "item_Code", "item_Name");
            console.log(this.item);
            for (let i = 0; i < this.item.length; i++) {
              if (this.item[i].id == o.item_Code) {
                this.item_ID = this.item[i].id;
                this.item_Names = this.item[i].text;
                break;
              }
            }
          });

        this.service.getItems()
          .subscribe(response => {
            this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
            this.item_Code = this.items[0].id;
            this.item_Name = this.items[0].text;
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
    this.clearFields();
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#cancelBtn").hide();
    $("#submitAdd").prop("disabled", true);
    this.getItem(this.mode, this.item_Code);
    this.getItems();
    this.getUnit(0);
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
    this.clearFields();
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
