import { Component, OnInit } from '@angular/core';
import { DistrictService, District, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'district',
  templateUrl: './district.component.html',
    styleUrls: ['./district.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class  DistrictComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  region: any[] = [];
  regioncode: any = 0;
  regionname: any = "";

  districtcode: any = 0;
  districtname: any = "";
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
  
  ////End Member Variables
  constructor(private service: DistrictService) { }

  ngOnInit() {
      this.getGrid();    
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110087);
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
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        // console.log(response.json());
      });
  }

  //getRegion
  getRegion() {
    this.isLoading =true;
    this.service.getRegion()
      .subscribe(response => {
        this.region = (response.json());
        this.regioncode = this.region[0].regioncode;
        this.regionname = this.region[0].regionname;
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  saveData() {
    var Data = new District(0, this.districtname, this.regioncode, this.active);
      console.log(Data);
      var districtname=this.districtname.trim();
      if (districtname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.districtcode = 0;
          this.districtname = '';
          this.regioncode = 0;
          this.active = true;


          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error)); 
    }
    else{
      if(districtname.replace(/\s/g,"").length<=0)
      this.districtname='';
      swal("District name must be define.");
    }

   }
  updateData() {
    var Data = new District(this.districtcode, this.districtname, this.regioncode, this.active);
    console.log(Data);
    var districtname=this.districtname.trim();
    if (districtname != "") {
      this.service.updateData(Data).then(
        (response) => {

          this.districtcode = 0;
          this.districtname = '';
          this.regioncode = 0;
          this.active = true;


          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error)); 
    }
    else{
      if(districtname.replace(/\s/g,"").length<=0)
      this.districtname='';
      swal("District name must be define.");
    }
  }
  //getDetailsByID
  getDetailsByID(ID) {
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.districtcode = ID;
          this.districtname = list[0].districtname;
          this.active = list[0].active;
          this.service.getRegion()
              .subscribe(response => {
                  this.region = (response.json());
                  alert(list[0].regioncode);
                  this.regioncode = list[0].regioncode;
              });   
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';      
          this.checkValue(this.active);
          this.isLoading = false;
      });
  }
 
  
    Add() {
    this.mode = false;
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2 = 'none';

    this.districtcode = 0;
    this.districtname = '';
    this.regioncode = 0;
    this.active = true;
    this.checkValue(this.active);
    this.getRegion();
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
    this.districtname = '';
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










