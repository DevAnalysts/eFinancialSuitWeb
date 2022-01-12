import { Component, OnInit} from '@angular/core';
import { ItemsMTypeService, ItemsMType, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'itemsMtype',
  templateUrl: './itemsMtype.component.html',
    styleUrls: ['./itemsMtype.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class ItemsMTypeComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();

  p: number = 1;
  ID: any = '';
  cell: any = '';
  active: any = false;
  mode: any = false;

  measurementunit: any[] = [];
  munitcode: any = 0;
  munitname: any = "";
  abbr:any = "";

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
 isLoading: any = false;
  logedInUserID: any = 1;


  constructor(private service: ItemsMTypeService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110603);
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
        this.measurementunit = (response.json());
        this.isLoading = false;
        // console.log(response.json());
      });
  }

  //saveData
  saveData() {
    var Data = new ItemsMType(0, this.munitname, this.abbr, this.active);
    // console.log(Data);
    var munitname = this.munitname.trim(); 
    var abbr = this.abbr.trim(); 
    if (munitname != "") {
      if(abbr!=""){
      this.service.saveData(Data).then(
        (response) => {
          this.munitcode = 0;
          this.munitname = '';
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
      }else{
        if(abbr.replace(/\s/g,"").length<=0)
        this.abbr='';
        swal("Abbreviation Must Be Define.");
      }
      
    }
    else{
      if(munitname.replace(/\s/g,"").length<=0)
      this.munitname='';
      swal("Units name must be define.");
    }
  }

    //getDetailByID
  getDetailsByID(ID) {
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.munitcode = ID;
        this.munitname = list[0].munitname;
        this.abbr = list[0].abbr;
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
        this.isLoading = false;
        //console.log(response.json());
      });



      
  }

  //updateData
  updateData() {
    var Data = new ItemsMType(this.munitcode, this.munitname, this.abbr, this.active);
    // console.log(Data);
    var munitname = this.munitname.trim(); 
    var abbr = this.abbr.trim(); 
    if (munitname != "") {
      if(abbr!=""){
      this.service.updateData(Data).then(
        (response) => {
          this.munitcode = 0;
          this.munitname = '';
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
      }else{
        if(abbr.replace(/\s/g,"").length<=0)
        this.abbr='';
        swal("Abbreviation Must Be Define.");
      }
      
    }
    else{
      if(munitname.replace(/\s/g,"").length<=0)
      this.munitname='';
      swal("Units name must be define.");
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

    this.munitcode = 0;
    this.munitname = '';
    this.abbr = '';
    this.active = true
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
    this.munitname = '';
    this.abbr = '';
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










