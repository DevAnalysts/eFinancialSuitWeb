import { Component, OnInit } from '@angular/core';
import { ItemWarrantyService, ItemWarranty, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'ItemWarranty',
  templateUrl: './ItemWarranty.component.html',
  styleUrls: ['./ItemWarranty.component.scss']
  ,
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ItemWarrantyComponent implements OnInit {
  ////Member Variables


  p: number = 1;
  ID: any = '';
  cell: any = '';
  status: any = false;
  mode: any = false;

  warrantynames: any[] = [];
  warrantyid: any = 0;
  warrantyname: any = "";

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  isLoading: any = false;
  logedInUserID: any = 1;
  public permissionUtility: PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();

  constructor(private service: ItemWarrantyService) {}

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(170003);

  }

  checkValue(event: any) {
    if (this.mode == false) {
      if (event == true && this.permissionUtility.PermissionEdit!='none')
        this.ShowEmp1 = ''

    } else {
      if (event == true && this.permissionUtility.PermissionEdit!='none')
        this.ShowEmp2 = ''

    }
  }

  //getGrid
  getGrid() {
    this.isLoading = true;
    this.service.getGrid()
      .subscribe(response => {
        this.warrantynames = (response.json());
        this.isLoading = false;
        // console.log(response.json());
      });
  }

  //saveData
  saveData() {
    var Data = new ItemWarranty(0, this.warrantyname, this.status);
    // console.log(Data);
    var warrantyname = this.warrantyname.trim();
    if (warrantyname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.warrantyid = 0;
          this.warrantyname = '';
          this.status = true;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(warrantyname.replace(/\s/g,"").length<=0)
      this.warrantyname='';
      swal("Warranty name must be define.");
    }
      
  }

  //getDetailByID
  getDetailsByID(ID) {
    this.isLoading = true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.warrantyid = ID;
        this.warrantyname = list[0].warrantyname;
        this.status = list[0].status;
        this.ShowEmp1='none';
        this.ShowEmp2='none';
        this.checkValue(this.status);
        this.isLoading = false;
        //console.log(response.json());
      });




  }

  //updateData
  updateData() {
    var Data = new ItemWarranty(this.warrantyid, this.warrantyname, this.status);
    // console.log(Data);
    var warrantyname = this.warrantyname.trim();
    if (warrantyname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.warrantyid = 0;
          this.warrantyname = '';
          this.status = true;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(warrantyname.replace(/\s/g,"").length<=0)
      this.warrantyname='';
      swal("Warranty name must be define.");
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
    this.ShowEmp2 = 'none'

    this.warrantyid = 0;
    this.warrantyname = '';
    this.status = true
    this.checkValue(this.status);
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
    this.checkValue(this.status);
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
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView)
    this.permissionUtility.PermissionEdit='none';
    this.permissionUtility.PermissionEdit='';
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.warrantyid = 0;
    this.warrantyname = '';
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










