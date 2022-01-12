import { Component, OnInit } from '@angular/core';
import { LeaveSettingService, LeaveSetting, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'leavesetting',
  templateUrl: './leavesetting.component.html',
    styleUrls: ['./leavesetting.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class LeaveSettingComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();

  p: number = 1;
  grid: any[] = [];
  ID: any = '';
  leavetype: any[] = [];
  leavetypecode: any = 0;
  leavetypename: any = '';

  category: any[] = [];
  categorycode: any = 0;
  categoryname: any = '';
  
  leavetypedetailcode: any = 0;

 
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
  constructor(private service: LeaveSettingService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110052);
  }
   ////////////////////////
    
  //getGrid
  getGrid() {
    this.isLoading =true;
    console.log();
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getLeaveType
  getLeaveType() {
    this.service.getLeaveType()
      .subscribe(response => {
        this.leavetype = response.json();
        this.leavetypecode = this.leavetype[0].leavetypecode ;
        this.leavetypename = this.leavetype[0].leavetypename;
      });
  }
  //getCategory
  getCategory() {
    this.service.getCategory()
      .subscribe(response => {
        this.category = response.json();
        this.categorycode = this.category[0].categorycode;
        this.categoryname = this.category[0].categoryname;
      });
  }
  //saveData
  saveData() {
    var Data = new LeaveSetting(0, this.leavetypecode, this.categorycode);
    console.log(Data);
    if (this.leavetypecode != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.leavetypedetailcode = 0,
          this.leavetypecode = 0;
          this.categorycode = 0;


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
    else
      swal("Leave Setting Must be defined.");
  }
  //updateData
  updateData() {
    var Data = new LeaveSetting(this.leavetypedetailcode, this.leavetypecode, this.categorycode);
    console.log(Data);
    if (this.leavetypecode != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.leavetypedetailcode = 0,
            this.leavetypecode = 0;
          this.categorycode = 0;


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
    else
      swal("Leave Setting Must be defined.");
  }
  //getDetailsByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.leavetypedetailcode = ID;

        this.service.getLeaveType()
          .subscribe(response => {
            this.leavetype = response.json();
            this.leavetypecode = list[0].leavetypecode;    
          });

        this.service.getCategory()
          .subscribe(response => {
            this.category = response.json();
            this.categorycode = list[0].categorycode;
          });
       

        this.isLoading = false;
        console.log(response.json());
      });
  } 
  Add() {
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';

    this.leavetypedetailcode = 0,
    this.leavetypecode = 0;
    this.categorycode = 0;

    this.getCategory();
    this.getLeaveType();
    this.HandleGrid();
  }
    Edit() {
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.HandleGrid();
    }
    View() {
      this.permissionUtility.PermissionAdd = 'none';
      this.permissionUtility.PermissionEdit='none';
      this.card1style = 'card col-sm-7'
      this.card2display = '';
      this.addbutton = 'none'; 
      this.ShowEmp2 = 'none';
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










