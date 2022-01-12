import { Component, OnInit } from '@angular/core';
import { MasterListService, MasterList, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'masterlist',
  templateUrl: './masterlist.component.html',
    styleUrls: ['./masterlist.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class MasterListComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();

  p: number = 1;
  Itemsname: any = "";
  //active: any = false;
  edit: any[] = [];
  ID: any = '';

  category: any[] = [];
  item: any[] = [];
  masteR_List_ID: any = 0;
  typE: any = '';
  statuS: any = false;
  mode: any = false;


  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;
    cell: any='';


  //End Member Variables
  constructor(private service: MasterListService) { }

  ngOnInit() {
    this.getMaster();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110035);
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
   
  ////getMaster
  getMaster() {
    this.isLoading =true;
    console.log();
    this.service.getMasterList()
      .subscribe(response => {
        this.category = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //// save the data on db
  saveDepartment(typE, statuS) {
    var subasset = new MasterList(0, typE, statuS);
    console.log(subasset);
    var typE = this.typE.trim();  
    if (typE!= "") {
      this.service.saveMaster(subasset).then(
        (response) => {
              this.typE = '';
              this.statuS = true;
          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          
        },
        (error) => console.log(error));
      
    }
    else{
      if(typE.replace(/\s/g,"").length<=0)
      this.typE='';
      swal("Master list must be define.");
    }
      
  }


  ////////////  ////getDetailByID
  getDetailsByID(masteR_List_ID) {
    console.log(masteR_List_ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(masteR_List_ID)
      .subscribe(response => {
        this.edit = (response.json());
        this.masteR_List_ID = this.edit[0].masteR_List_ID;
        this.typE = this.edit[0].typE;
          this.statuS = this.edit[0].statuS;
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.statuS);
        this.isLoading = false;
        //console.log(response.json());
      });

      
  }


  //////////////Update the row
  UpdateDepartment(typE, statuS) {
    console.log(typE, statuS);
    var subasset = new MasterList(this.masteR_List_ID, typE, statuS);
    var typE = this.typE.trim();  
    if (typE!= "") {
      this.service.UpdateMaster(subasset).then(
        (response) => {
          this.masteR_List_ID = this.edit[0].masteR_List_ID;
          this.typE = this.edit[0].typE;
          this.statuS = this.edit[0].statuS
          this.card1style = 'card col-sm-12'
          this.addbutton='';
              this.permissionUtility.PermissionAdd = '';
              this.statuS = true;
          this.card2display = 'none'; 
          this.ShowEmp1 = 'none';
              this.ShowEmp2 = 'none';
              this.getMaster();
        },
        (error) => console.log(error));
      
    }
    else{
      if(typE.replace(/\s/g,"").length<=0)
      this.typE='';
      swal("Master list must be define.");
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
    this.typE = '';
    this.statuS = true;
        this.checkValue(this.statuS);
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
        this.checkValue(this.statuS);
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
    //    this.checkValue(this.statuS);
        this.HandleGrid();
  }
  Cancel() {

    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.typE = '';
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










