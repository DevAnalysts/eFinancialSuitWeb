import { Component, OnInit} from '@angular/core';
import { CountryService, Country, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'country',
  templateUrl: './country.component.html',
    styleUrls: ['./country.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class CountryComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    cell: any = '';
  p: number = 1;
  ID: any = '';

  grid: any[] = [];
  countrycode: any = 0;
  countryname: any = '';
  active: any = 0;


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
  constructor(private service: CountryService) { }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(110086);
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

  //getDetailByID
  getDetailsByID(ID) {
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.countrycode = ID;
        this.countryname = list[0].countryname;        
          this.active = list[0].active;  
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';        
          this.checkValue(this.active);
        this.isLoading = false;
      });
  }
  //saveData
  saveData() {

    var Data = new Country(0, this.countryname, this.active);
    console.log(Data);
    var countryname=this.countryname.trim();  
    if (countryname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.countrycode = 0;
          this.countryname = '';          
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
      if(countryname.replace(/\s/g,"").length<=0)
      this.countryname='';
      swal("Country Name must be defined.");
    }
      
  }
  //updateData
  updateData() {

    var Data = new Country(this.countrycode, this.countryname, this.active);
    console.log(Data);
    var countryname=this.countryname.trim();  
    if (countryname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.countrycode = 0;
          this.countryname = '';
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
      if(countryname.replace(/\s/g,"").length<=0)
      this.countryname='';
      swal("Country Name must be defined.");
    }
      
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

    this.countrycode = 0;
    this.countryname = '';
    this.active = true;
    this.checkValue(this.active);
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
   // this.checkValue(this.active);
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.countryname = '';
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










