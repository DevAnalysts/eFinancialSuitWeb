import { Component, OnInit, ViewChild} from '@angular/core';
import { CompanySetupService, CompanySetup, CompanyImageService, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import * as $ from 'jquery';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'companysetup',
  templateUrl: './companysetup.component.html',
    styleUrls: ['./companysetup.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class CompanySetupComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
    mode:any=false;
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  companycode: any = 0;
  companyname: any = '';
  slogan: any = '';
  contactno: any = '';
  active: any = false;  
    cell: any = '';
  Image: any;
  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
  isLoading: any = false;
  logedInUserID: any = 1;
  logoLeft:any='';
  logoLeftContentType:any='';
  checkImage: string = "assets/images/no-img.png";

  // IMAGE UPLOAD OBJ
  imageUrl: string = "assets/images/no-img.png";
  fileToUpload: File = null;
  @ViewChild("Image") fileInput;
    

  
  //End Member Variables
  constructor(private service: CompanySetupService, private ImageService: CompanyImageService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110085);
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
        console.log(response.json());
        this.grid = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }

 
   
  getDetailsByID(ID) {
    this.isLoading =true;
    console.log(ID);
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.companycode = ID;
        this.companyname= list[0].companyname; 
        this.contactno= list[0].contactno; 
          this.active = list[0].active;
          this.slogan=list[0].slogan;
          this.logoLeft = list[0].logoLeft;
          this.logoLeftContentType = list[0].logoLeftContentType;

          if(this.logoLeft!=null)
             this.imageUrl=this.logoLeftContentType+this.logoLeft;
        
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.checkValue(this.active); 
         
        this.isLoading = false;
        console.log(response.json());
      });
  }
 

  //saveData
  saveData() {   
    if(this.contactno.toString().length>0 && this.contactno.toString().length<11){
      swal("invalid contact number");
      return;
    }
    var companyname = this.companyname.trim();  
    if (companyname != "") {

      var Data = new CompanySetup(0, this.companyname, this.slogan, this.contactno, this.active);
      console.log(Data);

      if (this.fileToUpload != null) {

        this.ImageService.postFile('', this.fileToUpload).subscribe(
          data => {
            this.service.saveData(Data).then(
              (response) => this.ngOnInit(),
              (error) => console.log(error));
            this.companycode = 0;
            this.companyname = '';
            this.slogan = '';
            this.contactno = '';
            this.active = true;

            this.card1style = 'card col-sm-12'
            this.addbutton = '';
            this.permissionUtility.PermissionAdd = '';
            this.card2display = 'none'; 1
            this.ShowEmp1 = 'none'
            this.ShowEmp2 = 'none'
            this.ngOnInit();
            this.Image = null;

          }
        );

      }
      else {

        this.service.saveData(Data).then(
          (response) => this.ngOnInit(),
          (error) => console.log(error));
        this.companycode = 0;
        this.companyname = '';
        this.slogan = '';
        this.contactno = '';
        this.active = true;

        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.permissionUtility.PermissionAdd = '';
        this.card2display = 'none'; 1
        this.ShowEmp1 = 'none'
        this.ShowEmp2 = 'none'
        this.ngOnInit();
        this.Image = null;
      }
    }
    else{
      if(companyname.replace(/\s/g,"").length<=0)
      this.companyname='';
      swal("Company Name Must Be Defined!");
    }
  
  }

  //saveData
  updateData() {
    if(this.contactno.toString().length>0 && this.contactno.toString().length<11){
      swal("invalid contact number");
      return;
    }
    var companyname = this.companyname.trim();  
    if (companyname != "") {

      var Data = new CompanySetup(this.companycode, this.companyname, this.slogan, this.contactno, this.active);
      console.log(this.fileToUpload);

      if (this.fileToUpload != null) {

        this.ImageService.postFile('', this.fileToUpload).subscribe(
          data => {
            this.service.updateData(Data).then(
              (response) => this.ngOnInit(),
              (error) => console.log(error));
            this.companycode = 0;
            this.companyname = '';
            this.slogan = '';
            this.contactno = '';
            this.active = true;

            this.card1style = 'card col-sm-12'
            this.addbutton = '';
            this.permissionUtility.PermissionAdd = '';
            this.card2display = 'none'; 1
            this.ShowEmp1 = 'none'
            this.ShowEmp2 = 'none'
            this.ngOnInit();
            this.Image = null;

          }
        );

      }
      else {

        this.service.updateData(Data).then(
          (response) => this.ngOnInit(),
          (error) => console.log(error));
        this.companycode = 0;
        this.companyname = '';
        this.slogan = '';
        this.contactno = '';
        this.active = true;

        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.permissionUtility.PermissionAdd = '';
        this.card2display = 'none'; 1
        this.ShowEmp1 = 'none'
        this.ShowEmp2 = 'none'
        this.ngOnInit();
        this.Image = null;
      }
    }
    else{
      if(companyname.replace(/\s/g,"").length<=0)
      this.companyname='';
      swal("Company Name Must Be Defined!");
    }
  
  }


  Add() {
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp2 = 'none';
    this.mode=false;
    if (this.permissionUtility.PermissionAdd)
          this.ShowEmp1 = '';
     
      this.HandleGrid();

    this.companycode = 0;
    this.companyname = '';
    this.slogan = '';
    this.contactno = '';
    this.active = true;
    this.logoLeft='';
    this.logoLeftContentType='';
      this.checkValue(this.active);
  }
    Edit() {
    this.permissionUtility.PermissionAdd = 'none';
    this.permissionUtility.PermissionEdit= '';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.mode=true;
    this.ShowEmp1= 'none';    
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.checkValue(this.active);
    this.HandleGrid();
  }
  Cancel() {
    this.permissionUtility.PermissionAdd = '';
    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.mode=false;
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

 

  ////////////////////////

  //EmployeeImagePreview
  handleFileInput(file: FileList) {

    this.fileToUpload = file.item(0);
    console.log('-------------------------' + this.fileToUpload);
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);

  }
}










