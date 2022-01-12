import { Component, OnInit} from '@angular/core';
import { OfficeLevelService, OfficeLevel, PermissionUtility} from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'officelevel',
  templateUrl: './officelevel.component.html',
    styleUrls: ['./officelevel.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class OfficeLevelComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();

  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  officelevelcode = 0;
  officelevelname= '';
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
    cell: any='';


  //End Member Variables
  constructor(private service: OfficeLevelService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110080);     
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

    var Data = new OfficeLevel(0, this.officelevelname, this.active);
    console.log(Data);
    var officelevelname = this.officelevelname.trim();  
    if (officelevelname!= "") {
      this.service.saveData(Data).then(
        (response) => {
          this.officelevelname= '';
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
      if(officelevelname.replace(/\s/g,"").length<=0)
      this.officelevelname='';
      swal("Name Must Be Defined!");
    }
     
  }
  //updateData
  updateData() {

    var Data = new OfficeLevel(this.officelevelcode, this.officelevelname, this.active);
    console.log(Data);
    var officelevelname = this.officelevelname.trim();  
    if (officelevelname!= ""){
      this.service.updateData(Data).then(
        (response) => {
          this.officelevelcode = 0;
          this.officelevelname = '';
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
      if(officelevelname.replace(/\s/g,"").length<=0)
      this.officelevelname='';
      swal("Name Must Be Defined!");
    }
  }
  //getDetailByID
  getDetailsByID(ID) {
    //alert(ID);
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var List = (response.json());
        this.officelevelcode = ID;
        this.officelevelname = List[0].officelevelname;
          this.active = List[0].active;
          this.ShowEmp1='none';
          this.ShowEmp2='none';
          this.checkValue(this.active);

        this.isLoading = false;
        //console.log(response.json());
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
    this.officelevelcode = 0;
    this.officelevelname = '';
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
    this.permissionUtility.PermissionEdit= 'none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = 'none';
      //  this.checkValue(this.active);
        this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit= 'none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.officelevelname = '';
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










