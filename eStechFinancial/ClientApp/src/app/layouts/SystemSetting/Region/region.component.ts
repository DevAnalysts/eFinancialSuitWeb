import { Component, OnInit} from '@angular/core';
import { RegionService, Region, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'region',
  templateUrl: './region.component.html',
    styleUrls: ['./region.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class RegionComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  province: any[] = [];
  provincecode: any = 0;
  provincename: any = "";

  regioncode: any = 0;
  regionname: any = "";
  active: any = false;
  mode: any = false;

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  logedInUserID: any = 1;
  ////End Member Variables
  constructor(private service: RegionService) { }

  ngOnInit() {
    this.getGrid();    
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110024);
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

  //getProvince
  getProvince() {
    this.isLoading =true;
    this.service.getProvince()
      .subscribe(response => {
        this.province = (response.json());
        this.provincecode = this.province[0].provincecode;
        this.provincename = this.province[0].provincename;
        this.isLoading = false;
        // console.log(response.json());
      });
  }
  saveData() {
    var Data = new Region(0, this.regionname, this.provincecode, this.active);
    console.log(Data);
    var regionname=this.regionname.trim();
    if (regionname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.regioncode = 0;
          this.regionname = '';
          this.provincecode = 0;
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
      if(regionname.replace(/\s/g,"").length<=0)
      this.regionname='';
      swal("Region name must be define.");
    }
      
   }
  updateData() {
    var Data = new Region(this.regioncode, this.regionname, this.provincecode, this.active);
    console.log(Data);
    var regionname=this.regionname.trim();
    if (regionname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.regioncode = 0;
          this.regionname = '';
          this.provincecode = 0;
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
      if(regionname.replace(/\s/g,"").length<=0)
      this.regionname='';
      swal("Region name must be define.");
    }
  }
  //getDetailsByID
  getDetailsByID(ID) {
    this.service.getDetailsByID(ID)
      .subscribe(response => {        
        var list = (response.json());
        this.regioncode = ID;
        this.regionname = list[0].regionname;        
          this.active = list[0].active;
          this.service.getProvince()
          .subscribe(response=>{
            //console.log('abd'+ response);
            this.province=(response.json());
            //console.log('abd'+ this.province);
            alert(this.province[0].provincename);
            this.provincecode=this.province[0].provincecode;
          });
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);

         
        this.isLoading = false;
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

    this.regioncode = 0;
    this.regionname = '';
    this.provincecode = 0;
    this.active = true;
    this.checkValue(this.active);
    this.getProvince();
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
    this.regionname = '';
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










