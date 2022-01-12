import { Component, OnInit } from '@angular/core';
import { ProvinceService, Province, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'province',
  templateUrl: './province.component.html',
    styleUrls: ['./province.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class ProvinceComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  p: number = 1;
  ID: any = '';
    cell: any = '';
  grid: any[] = [];
  
  country: any[] = [];
  countrycode: any = 0;
  countryname: any = '';

  provincecode: any = 0;
  provincename: any = '';
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
  constructor(private service: ProvinceService) { }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(110058);  
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
         //console.log(response.json());
      });
  }
  //getCountry
  getCountry() {
    this.isLoading =true;
    this.service.getCountry()
      .subscribe(response => {
        this.country = (response.json());
        this.countrycode = this.country[0].countrycode;
        this.countryname= this.country[0].countryname;
        this.isLoading = false;
        
      });
  }


  ////getDetailByID
  getDetailsByID(ID) {
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.provincecode = ID;
        this.provincename = list[0].provincename;
        
        this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);

        this.service.getCountry()
          .subscribe(response => {
            this.country = (response.json());
            //alert(this.country[0].countrycode);
            this.countrycode = this.country[0].countrycode;
            

          });
          
          this.isLoading = false;
      });
  }
  //saveData
  saveData() {

    var Data = new Province(0, this.provincename, this.countrycode, this.active);
    console.log(Data);
    var provincename=this.provincename.trim(); 
    if (provincename != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.provincecode = 0;
          this.provincename = '';
          this.countrycode = 0;
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
      if(provincename.replace(/\s/g,"").length<=0)
      this.provincename='';
      swal("Province Name must be defined.");
    }
      
  }
  //updateData
  updateData() {

    var Data = new Province(this.provincecode, this.provincename, this.countrycode, this.active);
    console.log(Data);
    var provincename=this.provincename.trim(); 
    if (provincename != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.provincecode = 0;
          this.provincename = '';
          this.countrycode = 0;
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
      if(provincename.replace(/\s/g,"").length<=0)
      this.provincename='';
      swal("Province Name must be defined.");
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

    this.provincecode = 0;
    this.provincename = '';
    this.countrycode = 0;
    this.active = true;
    this.getCountry();
    this.checkValue(this.active);
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
    this.provincename = '';
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










