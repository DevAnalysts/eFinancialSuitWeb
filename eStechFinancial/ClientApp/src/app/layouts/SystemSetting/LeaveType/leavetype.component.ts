import { Component, OnInit } from '@angular/core';
import { LeaveTypeService, LeaveType, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'leavetype',
  templateUrl: './leavetype.component.html',
    styleUrls: ['./leavetype.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class LeaveTypeComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  item: any[] = [];
  leavecode: any = 0;
  leavename: any = '';
  unpaid: any = 0;
  nooftimes: any ;
  maxbalance: any ;
  allowperyear: any = 0;
  allowpermonth: any ;
  encashable: any=0;
  carryforward: any = 0;
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
  ///////Details Show/Hide All/GRS/FNL////
  albtn: any = '';
  grsbtn: any = 'none';
  fnlbtn: any = 'none';
  a1: any = 1;
  a2: any = 0;
  a3: any = 0;

  //End Member Variables
  constructor(private service: LeaveTypeService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
       this.permissionUtility.setPagePermissions(110051);
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
        this.grid = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //saveData
  saveData() {
    var Data = new LeaveType(0, this.leavename, this.nooftimes, this.maxbalance, this.allowperyear, this.allowpermonth, this.encashable, this.carryforward, this.unpaid, this.active);
    console.log(Data);
    var leavename=this.leavename.trim();
    var nooftimes=this.nooftimes.trim(); 
    if (leavename!= "") {
      if(nooftimes!=""){
        if(this.allowpermonth!=""){
          if(this.maxbalance!=""){
      this.service.saveData(Data).then(
        (response) => {
          this.leavecode = 0;
          this.leavename = '';
          this.unpaid = 0;
          this.nooftimes = '';
          this.maxbalance = '';
          this.allowperyear = 0;
          this.allowpermonth = '';
          this.encashable = 0;
          this.carryforward = 0;
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
      }else{ 
        swal("Max. Balance is Required");
      } 
      }else{ 
        swal("Monthly is Required");
      } 
      }else{
        if(nooftimes.replace(/\s/g,"").length<=0)
        this.nooftimes='';
        swal("No. Of Times Are Required");
      } 
    }
    else{
      if(leavename.replace(/\s/g,"").length<=0)
      this.leavename='';
      swal("Leave Type Must Be Defined.");
    } 
  }
  //updateData
  updateData() {
    var Data = new LeaveType(this.leavecode, this.leavename, this.nooftimes, this.maxbalance, this.allowperyear, this.allowpermonth, this.encashable, this.carryforward, this.unpaid, this.active);
    console.log(Data);
    var leavename=this.leavename.trim();
    var nooftimes=this.nooftimes.trim(); 
    if (leavename!= "") {
      if(nooftimes!=""){
        if(this.allowpermonth!=""){
          if(this.maxbalance!=""){
      this.service.updateData(Data).then(
        (response) => {
          this.leavecode = 0;
          this.leavename = '';
          this.unpaid = 0;
          this.nooftimes = '';
          this.maxbalance = '';
          this.allowperyear = 0;
          this.allowpermonth = '';
          this.encashable = 0;
          this.carryforward = 0;
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
      }else{ 
        swal("Max. Balance is Required");
      } 
      }else{ 
        swal("Monthly is Required");
      } 
      }else{
        if(nooftimes.replace(/\s/g,"").length<=0)
        this.nooftimes='';
        swal("No. Of Times Are Required");
      } 
    }
    else{
      if(leavename.replace(/\s/g,"").length<=0)
      this.leavename='';
      swal("Leave Type Must Be Defined.");
    } 
  }


  ////////////  ////getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.leavecode = list[0].leavecode;
        this.leavename = list[0].leavename;
        this.unpaid = list[0].unpaid;
        this.nooftimes = list[0].nooftimes;
        this.maxbalance = list[0].maxbalance;
        
        this.allowpermonth = list[0].allowpermonth;
        this.allowperyear = list[0].allowperyear;

        if (list[0].allowperyear > 0)
          this.changefl();
        else
          this.changeal();

        this.encashable = list[0].encashable;
        this.carryforward = list[0].carryforward;
          this.active = list[0].active;
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

    this.leavecode = 0;
    this.leavename = '';
    this.unpaid = 0;
    this.nooftimes = '';
    this.maxbalance = '';
    this.allowperyear = 0;
    this.allowpermonth = '';
    this.encashable = 0;
    this.carryforward = 0;
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
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp1 = 'none';
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
    this.leavename = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = 'none';

      //handles default visibility 
      $('#PageGrid').show();
  }
  changeal() {
    this.albtn = '';
    this.fnlbtn = 'none';
    this.a1 = 1; this.a3 = 0;
    this.allowperyear = 0;
  }

  changefl() {
    this.albtn = 'none';
    this.fnlbtn = '';
    this.a1 = 0; this.a3 = 1;
    this.allowpermonth = 0;
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










