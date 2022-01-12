import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SupplierCategoryService, SupplierCategory, NgbDateFRParserFormatter, PermissionUtility} from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';


const now = new Date();
@Component({
  selector: 'app-suppliercategory',
  templateUrl: './suppliercategory.component.html',
  styleUrls: ['./suppliercategory.component.css'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class SupplierCategoryComponent implements OnInit {
  
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  suppliercategorycode: any = 0;
  suppliercategoryname: any = "";
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
  constructor(private service:SupplierCategoryService) { }

  ngOnInit() {
    
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(110612);
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

  //getUsers
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json()); 
        this.isLoading = false;
      });
  }

  
 
    ////getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.suppliercategorycode = ID;
        this.suppliercategoryname = list[0].suppliercategoryname;
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);

          this.isLoading = false;
      });

    
      
  }

  //saveData
  saveData() {

    var Data = new SupplierCategory(0, this.suppliercategoryname, this.active);
    var suppliercategoryname = this.suppliercategoryname.trim(); 
    if (suppliercategoryname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.suppliercategorycode = 0;
          this.suppliercategoryname = '';
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));
      
    }
    else{
      if(suppliercategoryname.replace(/\s/g,"").length<=0)
      this.suppliercategoryname='';
      swal("supplier Category Name Must Be Defined!");
    } 
  }
  //updateData
  updateData() {

    var Data = new SupplierCategory(this.suppliercategorycode, this.suppliercategoryname, this.active);
    var suppliercategoryname = this.suppliercategoryname.trim(); 
    if (suppliercategoryname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.suppliercategorycode = 0;
          this.suppliercategoryname = '';
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(suppliercategoryname.replace(/\s/g,"").length<=0)
      this.suppliercategoryname='';
      swal("supplier Category Name Must Be Defined!");
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

    this.suppliercategorycode = 0;
    this.suppliercategoryname = '';
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
    this.permissionUtility.PermissionEdit='none'
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
    this.suppliercategoryname = '';
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
