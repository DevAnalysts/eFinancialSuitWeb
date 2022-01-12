import { Component, OnInit } from '@angular/core';
import { DesignationService, Designation, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'designation',
  templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class DesignationComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  designationcode: any = 0;
  designationname: any = '';
  active: any = false;
  mode: any = false;
  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = '';

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
  constructor(private service: DesignationService) { }

  ngOnInit() {
      this.getGrid();    
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(20003);
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
       // alert(1);
    this.isLoading =true;
      //console.log();      
    this.service.getGrid()
      .subscribe(response => {
          this.grid = (response.json());          
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getDepartment
  getDepartment() {
    this.isLoading =true;
    this.service.getDeparment()
      .subscribe(response => {
        this.department = (response.json());
        this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
          //this.mandatoryFields();
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //saveData
  saveData() {
    var Data = new Designation(0, this.designationname, this.departmentcode, this.active);
    console.log(Data);
    var designationname=this.designationname.trim();
    if (designationname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.designationcode = 0;
          this.designationname = '';
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
      if(designationname.replace(/\s/g,"").length<=0)
      this.designationname='';
      swal("Designation Name Must Be defined.");
    }
      
  }
  //updateData
  updateData() {
    var Data = new Designation(this.designationcode, this.designationname, this.departmentcode, this.active);
    console.log(Data);
    var designationname=this.designationname.trim();
    if (designationname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.designationcode = 0;
          this.designationname = '';
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
      if(designationname.replace(/\s/g,"").length<=0)
      this.designationname='';
      swal("Designation Name Must Be defined.");
    }
  }

  //getDetailsByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.designationcode = ID;
        this.designationname = list[0].designationname;
          this.active = list[0].active; 
        this.service.getDeparment()
          .subscribe(response => {
            this.department = (response.json());
            this.departmentcode = list[0].departmentcode;
           });
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
    this.ShowEmp2 = 'none';
    this.designationcode = 0;
    this.designationname = '';
    this.active = true;
    this.getDepartment();
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
    this.designationname = '';
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










