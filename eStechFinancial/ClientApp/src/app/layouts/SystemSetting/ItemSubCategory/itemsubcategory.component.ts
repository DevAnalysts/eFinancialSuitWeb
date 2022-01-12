import { Component, OnInit } from '@angular/core';
import { ItemSubCategoryService, ItemSubCategory, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'itemsubcategory',
  templateUrl: './itemsubcategory.component.html',
    styleUrls: ['./itemsubcategory.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class ItemSubCategoryComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  p: number = 1;
  Itemsname: any = "";
  ID: any = '';
  subcategory: any[] = [];
  subcategorycode: any = 0;
  subcategoryname = '';
  mode: any = false;

  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = '';
  
  inventory: any[] = [];
  inventoryaccountcode: any = 0;
  inventoryaccountname: any = '';
  sale: any[] = [];
  saleaccountcode: any = 0;
  saleaccountname: any = '';

  cogs: any[] = [];
  cogsaccountcode: any = 0;
  cogsaccountname: any = '';



  active: any = false;
  
  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;

  logedInUserID: any = 1;
    cell: any='';

  ////End Member Variables
  constructor(private service: ItemSubCategoryService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
       this.permissionUtility.setPagePermissions(110602);
    }
     ////////////////////////
  

    checkValue(event: any) {
        if (this.mode == false) {
            if (event == true && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp1 = '';
        } else {
            if (event == true && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp2 = '';
        }
    }
   
  getFill() {
    this.getCategory();
    //this.getInventoryAccounts();
    //this.getSaleAccounts();
    //this.getCogsAccounts();
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        this.subcategory = (response.json());
        this.isLoading = false;
         console.log(response.json());
      });
  }
  //getCategory
  getCategory() {
    this.service.getCategory()
      .subscribe(response => {
        this.category = response.json();
        this.categorycode = this.category[0].categorycode;
        this.categoryname = this.category[0].categoryname;
      });
  }
  //getInventoryAccounts
  getInventoryAccounts() {
    this.service.getinvt()
      .subscribe(response => {
        this.inventory = response.json();
        this.inventoryaccountcode = this.inventory[0].inventoryaccountcode;
        this.inventoryaccountname = this.inventory[0].inventoryaccountname;
      });
  }
  //getSaleAccounts
  getSaleAccounts() {
    this.service.getsale()
      .subscribe(response => {
        this.sale = response.json();
        this.saleaccountcode = this.sale[0].saleaccountcode;
        this.saleaccountname = this.sale[0].saleaccountname;
      });
  }
  //getCogsAccounts
  getCogsAccounts() {
    this.service.getcos()
      .subscribe(response => {
        this.cogs = response.json();
        this.cogsaccountcode = this.cogs[0].cogsaccountcode;
        this.cogsaccountname = this.cogs[0].cogsaccountname;
      });
  }
  ////getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var List = (response.json());
        this.subcategorycode = ID;
        this.subcategoryname = List[0].subcategoryname;
        this.active = List[0].active;
        this.service.getCategory()
          .subscribe(response => {
            this.category = response.json();
            this.categorycode = List[0].categorycode;

          });
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
        this.isLoading = false;

      });
  }
 //saveData
  saveData() {
    var Data = new ItemSubCategory(0, this.subcategoryname, this.categorycode, this.active);
    console.log(Data);
    var subcategoryname = this.subcategoryname.trim();   
    if (subcategoryname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.subcategorycode = 0;
          this.subcategoryname = '';
          //this.inventoryaccountcode = 0;
          //this.saleaccountcode = 0;
          //this.cogsaccountcode = 0;
          this.active = 0;
          

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));
    
    }
    else{
      if(subcategoryname.replace(/\s/g,"").length<=0)
      this.subcategoryname='';
      swal("Sub Category Name Must Be Defined!");
    }
      
  }
  //updateData
  updateData() {
    var Data = new ItemSubCategory(this.subcategorycode, this.subcategoryname, this.categorycode, this.active);
    console.log(Data);
    var subcategoryname = this.subcategoryname.trim();   
    if (subcategoryname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.subcategorycode = 0;
          this.subcategoryname = '';
          //this.inventoryaccountcode = 0;
          //this.saleaccountcode = 0;
          //this.cogsaccountcode = 0;
          this.active = 0;



          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(subcategoryname.replace(/\s/g,"").length<=0)
      this.subcategoryname='';
      swal("Sub Category Name Must Be Defined!");
    }
  }

    Add() {
    this.permissionUtility.PermissionAdd = 'none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2 = 'none';
    this.subcategorycode = 0;
    this.subcategoryname = '';
    this.getFill();
    this.active = true;
    this.HandleGrid();
  }
    Edit() {
    this.permissionUtility.PermissionAdd = 'none';
    this.mode = true;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.ShowEmp1 = 'none'
    this.HandleGrid();    
  }
  View() {
    this.permissionUtility.PermissionAdd = 'none';
    this.permissionUtility.PermissionEdit='none'
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none'; 
    this.ShowEmp2 = 'none';
    this.ShowEmp1 = 'none'
    this.HandleGrid();    
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.subcategoryname = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = 'none';

        //handles default visibility 
        $('#PageGrid').show();
    }
    //handles visibility onresize window
    onResize(event) {
        if ($('#frm').is(":visible") && $(document).width() <= 767)
            $('#PageGrid').hide();
        else
            $('#PageGrid').show();
    }
    //handles visibility on button add click
    HandleGrid() {
        if ($(document).width() <= 767) {
            $('#PageGrid').hide();
        } else {
            $('#PageGrid').show();
        }
    }

}










