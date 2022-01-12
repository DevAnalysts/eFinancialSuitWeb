import { Component, OnInit } from '@angular/core';
import { AssetStatusService, AssetStatus, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'assetstatus',
  templateUrl: './assetstatus.component.html',
    styleUrls: ['./assetstatus.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class AssetStatusComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  Itemsname: any = "";
  active: any = false;
  edit: any[] = [];
  ID: any = '';

  status1: any[] = [];
  item: any[] = [];
  assetstatuS: any = '';
  statuscodE: any = 0;
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
    mode:any= false;


  //End Member Variables
  constructor(private service: AssetStatusService) { }

  ngOnInit() {
      this.getAssetStatus();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110013);
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
  getAssetStatus() {
    this.isLoading =true;
    console.log();
    this.service.getAssetStatus()
      .subscribe(response => {
        this.status1 = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //// save the data on db
  saveStatus(assetstatuS, activE) {
    var subasset = new AssetStatus(0, assetstatuS, activE);
    console.log(subasset);
    var assetstatuS=this.assetstatuS.trim();
    if (assetstatuS!= "") {
      this.service.saveAssetStatus(subasset).then(
        (response) => {
          this.assetstatuS = '';
          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.activE = true;
          this.active = true;
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));
     
    }
    else{
      if(assetstatuS.replace(/\s/g,"").length<=0)
      this.assetstatuS='';
      swal("Status name must be define.");
    }
      
  }


  ////////  ////getDetailByID
  getDetailsByID(statuscodE) {
    console.log(statuscodE, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(statuscodE)
      .subscribe(response => {
        this.edit = (response.json());
        this.statuscodE = this.edit[0].statuscodE;
          this.assetstatuS = this.edit[0].assetstatuS;
          this.activE = this.edit[0].activE;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.activE);
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //////////Update the row
  UpdateStatus(assetstatuS, activE) {
    console.log(assetstatuS);
    var subasset = new AssetStatus(this.statuscodE, assetstatuS, activE);
    var assetstatuS=this.assetstatuS.trim();
    if (assetstatuS!= "") {
      this.service.UpdateAssetStatus(subasset).then(
        (response) => {
          this.statuscodE = this.edit[0].statuscodE;
          this.assetstatuS = this.edit[0].assetstatuS;
          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.activE = true;
          this.active = true;
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else{
      if(assetstatuS.replace(/\s/g,"").length<=0)
      this.assetstatuS='';
      swal("Status name must be define.");
    }

  }
   
  Add() {
    this.permissionUtility.PermissionAdd = 'none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.activE = true;
    this.active = true;
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2 = 'none';
    this.assetstatuS = '';
    this.checkValue(this.activE);
    this.HandleGrid();
  }
    Edit() {
    this.mode = true;
    this.permissionUtility.PermissionAdd = 'none';
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
    this.mode = false;
    this.permissionUtility.PermissionAdd = 'none';
    this.permissionUtility.PermissionEdit='none';
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
      this.assetstatuS = '';
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










