import * as $ from 'jquery';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit} from '@angular/core';
import { AssetCategoryService, AssetCategory, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'assetcategory',
  templateUrl: './assetcategory.component.html',
    styleUrls: ['./assetcategory.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class AssetCategoryComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;

  grid: any[] = [];
  assetcategorycode = 0;
  assetcategoryname = '';
  abbr = '';
  depreciationrate = 0;
  active: any = false;
  mode: any = false;
  ID: any = '';

  account: Array<Select2OptionData>;
  accountcodeM: any = 0;
  accountcode: any = 0;
  accountname: any = '';

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
  constructor(private service: AssetCategoryService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110008);        
  
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
  //getAccounts
  getAccounts() {
    this.isLoading =true;
    console.log();
    this.service.getAccounts()
      .subscribe(response => {
        this.account = this.getDropdownList(response.json(), "accountcode", "accountname");
        this.accountcode = this.account[0].id;
        this.accountname = this.account[0].text;
        this.isLoading = false;
        //console.log(response.json());
      })

  }
  //changeAccount
  changeAccount(e) {
    this.accountcode = e;
  }
  //getDropdownList
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

  //saveData
  saveData() {
    
    var Data = new AssetCategory(0, this.assetcategoryname, this.abbr, this.accountcode, this.depreciationrate, this.active);
    console.log(Data);
    $("#btnSubmitAdd").prop("disable", false);
    var assetcategoryname=this.assetcategoryname.trim();
    var abbr=this.abbr.trim();
    if (assetcategoryname != "") {
      if(abbr!=""){
      this.service.saveData(Data).then(
        (response) => {
          this.assetcategorycode = 0;
          this.assetcategoryname = '';
          this.abbr = '';
          this.depreciationrate = 0;
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

      }else{
        if(abbr.replace(/\s/g,"").length<=0)
        this.abbr='';
        swal("Abbrivation Is Required");
      }
      
    }
    else{
      if(assetcategoryname.replace(/\s/g,"").length<=0)
      this.assetcategoryname='';
      swal("Asset Category Name Must Be Defined!");
    }
      
  }
  //updateData
  updateData() {    
    var Data = new AssetCategory(this.assetcategorycode, this.assetcategoryname, this.abbr, this.accountcode, this.depreciationrate, this.active);
    console.log(Data);
    $("#btnSubmitAdd").prop("disable", false);
    var assetcategoryname=this.assetcategoryname.trim();
    var abbr=this.abbr.trim();
    if (assetcategoryname != "") {
      if(abbr!=""){
      this.service.updateData(Data).then(
        (response) => {
          this.assetcategorycode = 0;
          this.assetcategoryname = '';
          this.abbr = '';
          this.depreciationrate = 0;
          this.active = true;
          this.addbutton='';
          this.card1style = 'card col-sm-12'
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

      }else{
        if(abbr.replace(/\s/g,"").length<=0)
        this.abbr='';
        swal("Abbrivation Is Required");
      }
      
    }
    else{
      if(assetcategoryname.replace(/\s/g,"").length<=0)
      this.assetcategoryname='';
      swal("Asset Category Name Must Be Defined!");
    }
  }
  //getDetailsByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.assetcategorycode = ID;
        this.assetcategoryname = list[0].assetcategoryname;
        this.abbr = list[0].abbr;

        this.service.getAccounts()
          .subscribe(response => {
            this.account = this.getDropdownList(response.json(), "accountcode", "accountname");
            this.accountcodeM = list[0].accountcode;
            this.accountcode = list[0].accountcode;
          })

        this.depreciationrate = list[0].depreciationrate;
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
    this.ShowEmp2='none'

    this.assetcategorycode = 0;
    this.assetcategoryname = '';
    this.abbr = '';
    this.depreciationrate = 0;
    this.active = true;
    this.checkValue(this.active); 
    this.getAccounts();
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
    this.permissionUtility.PermissionEdit=='none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.assetcategoryname = '';
      this.abbr = '';
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










