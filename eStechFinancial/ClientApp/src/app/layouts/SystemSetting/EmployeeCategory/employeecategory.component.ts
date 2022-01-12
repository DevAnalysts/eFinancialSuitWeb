import { Component, OnInit } from '@angular/core';
import { EmployeeCategoryService, EmployeeCategory, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';


@Component({
  selector: 'employeecategory',
  templateUrl: './employeecategory.component.html',
    styleUrls: ['./employeecategory.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class EmployeeCategoryComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  Itemsname: any = "";
  //active: any = 0;
  edit: any[] = [];
  ID: any = '';

  category: any[] = [];
  item: any[] = [];
  categorycode = 0;
  categoryname = '';
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


  //End Member Variables
  constructor(private service: EmployeeCategoryService) { }

  ngOnInit() {
      this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110030); 
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
    console.log();
    this.service.getGrid()
      .subscribe(response => {
        this.category = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getDetailByID
  getDetailsByID(ID) {
    //alert(ID);
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var List = (response.json());
        this.categorycode = ID;
        this.categoryname = List[0].categoryname;
          this.active = List[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
        this.isLoading = false;
        //console.log(response.json());
      });

      
      
  }
  //saveData
  saveData() {

    var Data = new EmployeeCategory(0, this.categoryname, this.active);
    console.log(Data);
    var categoryname=this.categoryname.trim();
    if (categoryname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.categoryname = '';
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
      if(categoryname.replace(/\s/g,"").length<=0)
      this.categoryname='';
      swal("Category Name Must Be Defined!");
    }
      
  }

  //updateData
  updateData() {

    var Data = new EmployeeCategory(this.categorycode, this.categoryname, this.active);
    console.log(Data);
    var categoryname=this.categoryname.trim();
    if (categoryname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.categorycode = 0;
          this.categoryname = '';
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
      if(categoryname.replace(/\s/g,"").length<=0)
      this.categoryname='';
      swal("Category Name Must Be Defined!");
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
    this.ShowEmp2='none'
    this.categorycode = 0;
    this.categoryname = '';
    this.active = true;
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










