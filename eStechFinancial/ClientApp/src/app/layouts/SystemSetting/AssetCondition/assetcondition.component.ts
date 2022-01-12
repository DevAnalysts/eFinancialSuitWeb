import { Component, OnInit } from '@angular/core';
import { AssetConditionService, AssetCondition, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'assetcondition',
  templateUrl: './assetcondition.component.html',
    styleUrls: ['./assetcondition.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class AssetConditionComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
  ID: any = '';

  status1: any[] = [];
  item: any[] = [];
  assetconditioN: any = '';
  conditioncodE: any = 0;
  activE: any = false;

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;
    mode: any=false;


  //End Member Variables
  constructor(private service: AssetConditionService) { }

  ngOnInit() {
      this.getAssetCondition();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110010);
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

   
  ////getUsers
  getAssetCondition() {
    this.isLoading =true;
    this.service.getAssetCondition()
        .subscribe(response => {
        this.status1 = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //// save the data on db
  save(assetconditioN, activE) {
    var conasset = new AssetCondition(0, assetconditioN, activE);
    console.log(conasset);
    var assetconditioN=this.assetconditioN.trim();
    if (assetconditioN!= "") {
      this.service.saveAssetCondition(conasset).then(
          (response) => {
              console.log(response);
          this.assetconditioN = '';
          this.activE = true;
          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else{
      if(assetconditioN.replace(/\s/g,"").length<=0)
      this.assetconditioN='';
      swal("Condition name must be define.");
    }
      
  }


  ////////  ////getDetailByID
  getDetailsByID(statuscodE) {
    console.log(statuscodE, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(statuscodE)
      .subscribe(response => {
        this.edit = (response.json());
        this.conditioncodE = this.edit[0].conditioncodE;
        this.assetconditioN = this.edit[0].assetconditioN;
          this.activE = this.edit[0].activE;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.activE);
        this.isLoading = false;
        console.log(response.json(), this.conditioncodE);
      });
  }
  //////////Update the row
  Update(assetconditioN, activE) {
    console.log(assetconditioN, activE);
    var conasset = new AssetCondition(this.conditioncodE, assetconditioN, activE);
    if (assetconditioN != "") {
      this.service.UpdateAssetCondition(conasset).then(
        (response) => {
          this.conditioncodE = this.edit[0].conditioncodE;
          this.assetconditioN = this.edit[0].assetconditioN;
          this.activE = this.edit[0].activE;
          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.activE = true;
          this.card2display = 'none'; 
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else{
      if(assetconditioN.replace(/\s/g,"").length<=0)
      this.assetconditioN='';
      swal("Condition name must be define.");
    }

  }
   
  Add() {
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.activE = true;
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.assetconditioN = '';
    this.checkValue(this.activE);
    this.HandleGrid();
  }
    Edit() {
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.HandleGrid();
  }
  View() {
    this.permissionUtility.PermissionAdd = 'none';
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none'; 
    this.ShowEmp2 = 'none';
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.assetconditioN = '';
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










