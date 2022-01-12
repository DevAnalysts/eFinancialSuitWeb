import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AssetRegistrationService, AssetRegistration, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'asset-registration',
  templateUrl: './asset-registration.component.html',
  styleUrls: ['./asset-registration.component.scss'] ,
  host: {
      '(window:resize)': 'onResize($event)'
  }
})
export class AssetRegistrationComponent implements OnInit {
 public permissionUtility:PermissionUtility=new PermissionUtility();
 public valid:Validation=new Validation();
  logedInUserID: any = 1;
  UserSessionID: any = 0;
   
  ////Member Variables
  p: number = 1;

  grid: any[] = [];
  itemcode: any = '';
  itemname: any = '';
  
  status: any = false;
  mode:any=false;
  subcategory: any[] = [];
  subcategorycode: any = 0;
  subcategoryname: any = 0;

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
 isLoading: any = false;



  //End Member Variables
  constructor(private service: AssetRegistrationService) {
    
   }

  ngOnInit() {
    this.getGrid();
    this.permissionUtility.setPagePermissions(70006);
    this.logedInUserID = this.service.getSession('user_ID');
    }

  //getGrid
  getGrid() {
    this.isLoading =true;
    console.log();
    this.service.getGrid()
      .subscribe(response => {
        if(response.json() !==null){
          this.grid = (response.json());
          this.isLoading = false;
          //console.log(response.json());
        }
        else{
          this.grid = [];
        this.isLoading = false;
        
        }
        
      });
  }
  checkValue(event: any) {
    if (this.mode == false) {
        if (event == true && this.permissionUtility.PermissionEdit!='none')
            this.ShowEmp1 = '';
    } else {
        if (event == true && this.permissionUtility.PermissionEdit!='none')
            this.ShowEmp2 = '';
    }
}
  //getSubCategory
  getSubCategory() {
    this.isLoading =true;
    console.log();
    this.service.getSubCategory()
      .subscribe(response => {
        this.isLoading = false;
        this.subcategory = (response.json());
        this.subcategorycode = this.subcategory[0].subcategorycode;
        this.subcategoryname = this.subcategory[0].subcategoryname;
        console.log(response.json());
      });
  }

  //saveData
  saveData() {
    var Data = new AssetRegistration(0, this.itemname, this.subcategorycode, this.status,this.logedInUserID, this.UserSessionID);
    console.log(Data);
    var itemname=this.itemname.trim(); 
    if (itemname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.itemcode = '';
          this.itemname = '';
          this.subcategorycode = 0;
          this.status = true;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';  
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));
   
    }
    else{
      if(itemname.replace(/\s/g,"").length<=0)
      this.itemname='';
      swal("Item Name Must Be Defined!");
    }
      
  }
  //updateData
  updateData() {
    var Data = new AssetRegistration(this.itemcode, this.itemname, this.subcategorycode, this.status,this.logedInUserID, this.UserSessionID);
    console.log(Data);
    var itemname=this.itemname.trim(); 
    if (itemname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.itemcode = '';
          this.itemname = '';
          this.subcategorycode = 0;
          this.status = true;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(itemname.replace(/\s/g,"").length<=0)
      this.itemname='';
      swal("Item Name Must Be Defined!");
    }
      
  }

  //getDetailsByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.itemcode = this.itemcode;
        this.itemname = list[0].itemname;
        this.service.getSubCategory()
          .subscribe(response => {
            this.isLoading = false;
            this.subcategory = (response.json());
            this.subcategorycode = list[0].subcategorycode;
            console.log(response.json());
          });
        
        this.status = list[0].status;
        this.ShowEmp1 = 'none';
        this.ShowEmp2 = 'none';
        this.checkValue(this.status);
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
    this.ShowEmp2 = 'none';
    this.itemcode = '';
    this.itemname = '';
    this.subcategorycode = 0;
    this.status = true;
    this.checkValue(this.status);
    this.getSubCategory();
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
    this.checkValue(this.status);
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
    this.ShowEmp2 = 'none'
     //this.checkValue(this.active);
     this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
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










