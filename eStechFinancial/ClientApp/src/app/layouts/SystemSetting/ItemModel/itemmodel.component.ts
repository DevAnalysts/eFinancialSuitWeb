import { Component, OnInit } from '@angular/core';
import { ItemModelService, ItemModel, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';
@Component({
  selector: 'ItemModel',
  templateUrl: './itemmodel.component.html',
  styleUrls: ['./itemmodel.component.scss']
  ,
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class ItemModelComponent implements OnInit {


  p: number = 1;
  ID: any = '';
  cell: any = '';
  status: any = false;
  mode: any = false;

  brandnames: any[] = [];

  modelnames: any[] = [];
  modelid: any = 0;
  modelname: any = "";
  brandid: any = 0;
  brandcode: any = 0;
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

  public permissionUtility: PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();



  ////End Member Variables
  constructor(private service: ItemModelService) {

  }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(170005);

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

  getFill() {
    this.getBrands(); 
  }
  //getGrid
  getGrid() {
    this.isLoading = true;
    this.service.getGrid()
      .subscribe(response => {
        this.modelnames = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getBrands
  getBrands() {
    this.service.getBrands()
      .subscribe(response => {
        console.log(response);
        this.brandnames = response.json();
        this.brandid = this.brandnames[0].brandid;
        this.brandname = this.brandnames[0].brandname;
      });
  }
 
  ////getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading = true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var List = (response.json());
        this.modelid = ID;
        this.modelname = List[0].modelname; 
        this.status = List[0].status;
        this.service.getBrands()
          .subscribe(response => {
            this.brandnames = response.json(); 
            this.brandid = this.brandnames[0].brandid;
            this.brandname=this.brandnames[0].brandname;

          });
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
        this.checkValue(this.status);
        this.isLoading = false;

      });
  }
  //saveData
  saveData() { 
    var Data = new ItemModel(0, this.modelname, this.brandid, this.status);
    var modelname=this.modelname.trim();
    if (modelname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.modelid = 0;
          this.modelname = '';
          this.brandid = 0;  
          this.status = true; 


          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(modelname.replace(/\s/g,"").length<=0)
      this.modelname='';
      swal("Modal Name Must Be Defined!");
    }
      
  }
  //updateData
  updateData() {
    var Data = new ItemModel(this.modelid, this.modelname, this.brandid, this.status);
    console.log(Data);
    var modelname=this.modelname.trim();
    if (modelname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.modelid = 0;
          this.modelname = '';
          this.brandid = 0; 
          this.status = true; 

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(modelname.replace(/\s/g,"").length<=0)
      this.modelname='';
      swal("Modal Name Must Be Defined!");
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
    this.ShowEmp2 = 'none';
    this.modelid= 0;
    this.modelname = '';
    this.getFill();
    this.status = true;
    this.checkValue(this.status);
    this.HandleGrid();
  }
  Edit() {
    this.permissionUtility.PermissionAdd = 'none';
    this.mode = true;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionEdit)
      this.ShowEmp2 = '';
    this.ShowEmp1 = 'none';
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
    this.ShowEmp2 = 'none';
    this.ShowEmp1 = 'none'
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView)
    this.permissionUtility.PermissionEdit='none';
    this.permissionUtility.PermissionEdit='';
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.modelname = '';
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










