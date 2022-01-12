import { Component, OnInit } from '@angular/core';
import { ItemBrandService, ItemBrand, PermissionUtility } from '../../../shared';
import swal from 'sweetalert'; 
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'ItemBrand',
  templateUrl: './ItemBrand.component.html',
  styleUrls: ['./ItemBrand.component.scss']
  ,
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ItemBrandComponent implements OnInit {
  ////Member Variables


  p: number = 1;
  ID: any = '';
  cell: any = '';
  status: any = false;
  mode: any = false;

  brandnames: any[] = [];
  brandid: any = 0;
  brandname: any = "";

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  isLoading: any = false;
  logedInUserID: any = 1;

  public permissionUtility: PermissionUtility= new PermissionUtility(); 
  public valid:Validation=new Validation();

  constructor(private service: ItemBrandService) {
   
  }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(170004);

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
        this.brandnames = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }

  //saveData
  saveData() {
    var Data = new ItemBrand(0, this.brandname, this.status);
    // console.log(Data);
    var brandname = this.brandname.trim();
    if (brandname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.brandid = 0;
          this.brandname = '';
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
      if(brandname.replace(/\s/g,"").length<=0)
      this.brandname='';
      swal("Brand name must be define.");
    }
  }

  //getDetailByID
  getDetailsByID(ID) {
    this.isLoading = true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.brandid = ID;
        this.brandname = list[0].brandname;
        this.status = list[0].status;
        this.ShowEmp1 = 'none';
        this.ShowEmp2 = 'none';
        this.checkValue(this.status);
        this.isLoading = false;
        //console.log(response.json());
      });




  }

  //updateData
  updateData() {
    var Data = new ItemBrand(this.brandid, this.brandname, this.status);
    // console.log(Data);
    if (this.brandname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.brandid = 0;
          this.brandname = '';
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
    else
      swal("Color must be define.");
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

    this.brandid = 0;
    this.brandname = '';
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
    this.permissionUtility.PermissionEdit = 'none';
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
    this.brandid = 0;
    this.brandname = '';
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










