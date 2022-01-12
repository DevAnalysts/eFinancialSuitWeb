import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import {  PermissionUtility, systemConfiguration, SystemconfigurationService } from '../../../shared';


@Component({
  selector: 'systemconfiguration',
  templateUrl: './systemconfiguration.component.html',
    styleUrls: ['./systemconfiguration.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class SystemConfigurationComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();

  p: number = 1;
  ID: any = '';
  

  
  grid: any[] = [];
  settingcode: any = 0;
  settingname: any = '';
  settingtype: any = '';
  settingvalue: any = '';
  remarks: any = '';
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
    mode: any=false;
    cell: any='';


  //End Member Variables
  constructor(private service: SystemconfigurationService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110060);
    }
 ////////////////////////
 
    checkValue(event: any) {
        if (this.mode == false) {
            if (event == true && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp1 = '';
          
        } else {
            if (event == true  && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp2 = '';
        }
    }
   
  //getGrid
  getGrid() {
    this.isLoading =true;
   // console.log();
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        //console.log(response.json());
      });
  }

  //updateData
  updateData() {
    var Data = new systemConfiguration(this.settingcode, this.settingvalue, this.remarks, this.active);
    
    if (this.settingvalue!= "") {
      this.service.updateData(Data).then(
        (response) => this.ngOnInit(),
        (error) => console.log(error));
      this.settingcode = 0
      this.settingname = '';
      this.settingtype = '';
      this.settingvalue = '';
      this.active = true;

      this.card1style = 'card col-sm-12'
      this.addbutton='';
      this.permissionUtility.PermissionAdd = '';
      this.card2display = 'none'; 
      this.ShowEmp1 = 'none'
      this.ShowEmp2 = 'none'
      this.getGrid();
    }
    else
      swal("Value must be defined.");
  }


  //getDetailsByID
  getDetailsByID(ID) {
    //console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.settingcode = ID;
        this.settingname = list[0].settingname;
        this.settingtype = list[0].settingtype;
        this.settingvalue = list[0].settingvalue;
        this.remarks = list[0].remarks;
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
        this.isLoading = false;
       // console.log(response.json());
      });
  }

 
   
  //Add() {
  //  this.mode=false;
  //  this.card1style = 'card col-sm-7'
  //  this.card2display = '';
  //  this.addbutton = 'none';
  //  this.ShowEmp1 = '';

  //  this.settingcode = 0
  //  this.settingname = '';
  //  this.settingtype = '';
  //  this.settingvalue = '';
  //  this.active = 0;
  //}
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
    this.permissionUtility.PermissionEdit = 'none';
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
    this.card2display = 'none'; 
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










