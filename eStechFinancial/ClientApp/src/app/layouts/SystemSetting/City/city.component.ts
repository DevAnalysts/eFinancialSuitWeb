import { Component, OnInit } from '@angular/core';
import { CityService, City, LoginService, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'city',
  templateUrl: './city.component.html',
    styleUrls: ['./city.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class CityComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  citycode: any = 0;
  cityname: any = "";
  active: any = false;
  mode: any = false;

  district: any[] = [];
  districtcode: any = 0;
  districtname: any = "";

  region: any[] = [];
  regioncode: any = 0;
  regionname: any = "";

  showDistrict: any = true;

  
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
  constructor(private service: CityService, private LoginService: LoginService) { }

  ngOnInit() {
    this.getGrid();
    this.showDistrictSetting();
    this.logedInUserID = this.service.getSession('user_ID'); 
    this.permissionUtility.setPagePermissions(110061);
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
  //getDistrict
  getDistrict() {
    this.isLoading =true;
    this.service.getDistrict()
      .subscribe(response => {
        this.district = (response.json());
        this.districtcode = this.district[0].districtcode;
        this.districtname = this.district[0].districtname;
        this.isLoading = false;
        // console.log(response.json());
      })

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
      })

  }
  //showDistrictSetting
  showDistrictSetting() {
   
    if (this.LoginService.getSession('EnableDistrictSetting') == "1")
      this.showDistrict = true;
    else
      this.showDistrict = false;
    
  }
  //saveData
  saveData() {
    var Data = new City(0, this.cityname, this.districtcode, this.regioncode, this.active);
    console.log(Data);
    var cityname=this.cityname.trim();
    if (cityname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.citycode = 0;
          this.cityname = '';
          this.regioncode = 0;
          this.districtcode = 0;
          this.active = true;


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
      if(cityname.replace(/\s/g,"").length<=0)
      this.cityname='';
      swal("City name must be defined.");
    }
      
  }
  //updateData
  updateData() {
    var Data = new City(this.citycode, this.cityname, this.districtcode, this.regioncode, this.active);
    console.log(Data);
    var cityname=this.cityname.trim();
    if (cityname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.citycode = 0;
          this.cityname = '';
          this.regioncode = 0;
          this.districtcode = 0;
              this.active = true;


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
      if(cityname.replace(/\s/g,"").length<=0)
      this.cityname='';
      swal("City name must be defined.");
    }
  }
  //getDetailByID
  getDetailsByID(ID) {
    this.isLoading =true;
    console.log(ID);
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.citycode = ID;
        this.cityname = list[0].cityname;
        this.regioncode = list[0].regioncode;
        this.districtcode = list[0].districtcode;
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);

          this.isLoading = true;
          this.service.getDistrict()
              .subscribe(response => {
                  this.district = (response.json());
                  this.districtcode = list[0].districtcode;
                  this.isLoading = false;
                  // console.log(response.json());
              })
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
        this.citycode = 0;
        this.cityname = '';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2='none'
    this.active = true;
    this.checkValue(this.active);
    this.HandleGrid();
    if (this.showDistrict) {
    this.getDistrict();
    this.regioncode = 0;
    }
    else {
      this.getRegion();
      this.districtcode = 0;
    }
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
      this.cityname = '';
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










