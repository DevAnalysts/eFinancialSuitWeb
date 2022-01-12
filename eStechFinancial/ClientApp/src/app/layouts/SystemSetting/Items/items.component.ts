import { Component, OnInit } from '@angular/core';
import { ItemPackingService, ItemPacking, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'items',
  templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class ItemsComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  Itemsname: any = "";
  active: any = false;
  mode: any = false;
  edit: any[] = [];
  ID: any = '';

  grid: any[] = [];

  packingtype: any[] =[];
  packingtypecode: any = 0;
  packingtypename: any = "";

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
  constructor(private service: ItemPackingService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110604);
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


  //saveData
  saveData() {

    var Data = new ItemPacking(0, this.packingtypename, this.active);
    var packingtypename = this.packingtypename.trim(); 
    if (packingtypename != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.packingtypecode = 0;
          this.packingtypename = '';
          this.active = 0;
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
      if(packingtypename.replace(/\s/g,"").length<=0)
      this.packingtypename='';
      swal("Packing Type Name Must Be Defined!");
    }
      
  }
  //updateData
  updateData() {

    var Data = new ItemPacking(this.packingtypecode, this.packingtypename, this.active);
    var packingtypename = this.packingtypename.trim(); 
    if (packingtypename != "")   {
      this.service.updateData(Data).then(
        (response) => {
          this.packingtypecode = 0;
          this.packingtypename = '';
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
      if(packingtypename.replace(/\s/g,"").length<=0)
      this.packingtypename='';
      swal("Packing Type Name Must Be Defined!");
    }
  }


    ////getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.packingtypecode = ID;
        this.packingtypename = list[0].packingtypename;
          this.active = list[0].active;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active);
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
    this.ShowEmp2='none'

    this.packingtypecode = 0;
    this.packingtypename = '';
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
    this.permissionUtility.PermissionEdit='none'
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.packingtypename = '';
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










