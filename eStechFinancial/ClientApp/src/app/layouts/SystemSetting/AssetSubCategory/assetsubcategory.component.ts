import { Component, OnInit} from '@angular/core';
import { AssetSubCategoryService, AssetSubCategory, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'assetsubcategory',
  templateUrl: './assetsubcategory.component.html',
    styleUrls: ['./assetsubcategory.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class AssetSubCategoryComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  assetsubcategorycode: any = 0;
  assetsubcategoryname: any = '';
  
  active: any = false;
  mode: any = false;
  assetcategory: any[] = [];
  assetcategorycode: any = 0;
  assetcategoryname: any = 0;

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
 isLoading: any = false;

  logedInUserID: any = 1;


  //End Member Variables
  constructor(private service: AssetSubCategoryService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110015);
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
   

  //getGrid
  getGrid() {
    this.isLoading =true;
    console.log();
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getAssetCategory
  getAssetCategory() {
    this.isLoading =true;
    console.log();
    this.service.getAssetCategory()
      .subscribe(response => {
        this.assetcategory = (response.json());
        this.assetcategorycode = this.assetcategory[0].assetcategorycode;
        this.assetcategoryname = this.assetcategory[0].assetcategoryname;
        this.isLoading = false;
        console.log(response.json());
      });
  }

  //saveData
  saveData() {
    var Data = new AssetSubCategory(0, this.assetsubcategoryname, this.assetcategorycode, this.active);
    console.log(Data);
    var assetsubcategoryname=this.assetsubcategoryname.trim();
    if (assetsubcategoryname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.assetsubcategorycode = 0;
          this.assetsubcategoryname = '';          
          this.assetcategorycode = 0;
          this.active = true;

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
      if(assetsubcategoryname.replace(/\s/g,"").length<=0)
      this.assetsubcategoryname='';
      swal("Asset Sub Category Name Must Be Defined!");
    }
      
  }
  //updateData
  updateData() {
    var Data = new AssetSubCategory(this.assetsubcategorycode, this.assetsubcategoryname, this.assetcategorycode, this.active);
    console.log(Data);
    var assetsubcategoryname=this.assetsubcategoryname.trim();
    if (assetsubcategoryname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.assetsubcategorycode = 0;
          this.assetsubcategoryname = '';
          this.assetcategorycode = 0;
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(assetsubcategoryname.replace(/\s/g,"").length<=0)
      this.assetsubcategoryname='';
      swal("Asset Sub Category Name Must Be Defined!");
    }
  }

  //getDetailsByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.assetsubcategorycode = ID;
        this.assetsubcategoryname = list[0].assetsubcategoryname;
          this.assetcategorycode = list[0].assetcategorycode;
          this.service.getAssetCategory();
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
        this.isLoading = false;
        console.log(response.json());
      });
  }   
    Add() {
    this.permissionUtility.PermissionAdd = 'none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2 ='none'

    this.assetsubcategorycode = 0;
    this.assetsubcategoryname = '';
    this.assetcategorycode = 0;
    this.active = true;
    this.checkValue(this.active);
    this.getAssetCategory();
    this.HandleGrid();
  }
    Edit() {
    this.permissionUtility.PermissionAdd = 'none';
    this.mode = true;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.checkValue(this.active);
    this.HandleGrid();
  }
  View() {
    this.permissionUtility.PermissionAdd = 'none';
    this.permissionUtility.PermissionEdit='none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none'; 
    this.ShowEmp2 = 'none';
    //this.checkValue(this.active);
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.assetsubcategoryname = '';
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










