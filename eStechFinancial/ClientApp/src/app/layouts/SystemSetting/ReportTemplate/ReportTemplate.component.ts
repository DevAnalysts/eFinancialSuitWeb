import * as $ from 'jquery'; 
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core'; 
import {  ReportService, LoginService, PermissionUtility, ReportTemplateService, HeaderService, ReportTemplateOffice } from '../../../shared';
import swal from 'sweetalert';  
import { ReportTemplate } from '@shared/models/Admin/ReportTemplate';
import { Select2OptionData } from 'ng-select2';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'ReportTemplate',
  templateUrl: './ReportTemplate.component.html',
  styleUrls: ['./ReportTemplate.component.scss'] 
})
export class ReportTemplateComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
 
  ID:any='';

  office: any[]=[];
  officemodel: any; 
  officeId: any = 0;
  officename = '';

  templates:  ReportTemplate[] ;
  edittemplate: ReportTemplate=new ReportTemplate(0,'',null,'','',1,0,0,null,'',0,null,null,null,null,null,null,null,null,null,0,null,null,null,null,null);
  pages: any[] = []; 
  spnames: any[] = []; 
  spnamesfil: any[] = []; 
  reportNames: any[] = []; 
  reportNameFil: any[] = []; 
  
  
  
  logoLeft:any='';
  logoLeftContentType:any='';
  checkImage: string = "assets/images/no-img.png";

  // IMAGE UPLOAD OBJ
  imageUrl1:any = "assets/images/no-img.png";
  imageUrl: any = "assets/images/no-img.png";
  imageType: string='';

  isImageSaved: any = false;
  fileToUpload: File = null;
  @ViewChild("Image") fileInput;
  

  selectall: any = false;

  card1display: any = '';
  card2display: any = 'none';
 
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;

  imageError: any = '';
  lastkeydown1: any = '';
  lastkeydown2:any= '';
  public PermissionUtility: PermissionUtility;

  //End Member Variables
  constructor(private _sanitizer: DomSanitizer, private hservice: HeaderService, private service: ReportTemplateService, private rservice: ReportService, private LoginService: LoginService, ) {
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.PermissionUtility = new PermissionUtility();
  }

  ngOnInit() { 
   // this.PermissionUtility.setPagePermissions(160008);
    this.getReportTemplates();
    //this.getCity();
     this.getOffcie();
    this.logedInUserID = this.service.getSession('user_ID');

    

  }

  getreportNameFirstWay($event) {
    let reportName = (<HTMLInputElement>document.getElementById('reportName')).value;
    this.reportNameFil = [];

    if (reportName.length > 2) {
      if ($event.timeStamp - this.lastkeydown1 > 200) {
        this.reportNameFil = this.searchFromArray(this.reportNames, reportName);
      }
    }
  }  

  getSPNameFirstWay($event) {
    let reportSP = (<HTMLInputElement>document.getElementById('reportSP')).value;
    this.spnamesfil = [];

    if (reportSP.length > 2) {
      if ($event.timeStamp - this.lastkeydown1 > 200) {
        this.spnamesfil = this.searchFromArray(this.spnames, reportSP);
      }
    }
  }  

  searchFromArray(arr, regex) {
    let matches = [], i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches;
  };

  getOffcie() {
    this.isLoading = true;
    this.service.getOffice(this.userPrivilegedOffice)
      .subscribe(response => {
        this.office = response.json();
        this.isLoading = false;
        
        
      });
  }
   
  //getReportTemplates
  getReportTemplates() {
    this.isLoading =true;
     
    this.service.getReportTemplates()
      .subscribe(response => {
        this.templates = (response.json()) as ReportTemplate[] ;
        
        console.log(this.templates);
        this.isLoading = false;
        
      });
  }
//selectAll
  selectAll(selectall:any) {
    this.office.map(function(a) {
      a.isselected =selectall; 
     }) 
    }

 
  
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      arr.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    return ar;
  }

 
  saveTemplate(etemplate:any,office:any){
   
    if (etemplate.templateName!= "") {
      console.log(office);

 var selectedOffices:any[]=[];

for(var i=0;i<this.office.length;i++){ 
   selectedOffices.push(new ReportTemplateOffice(this.office[i].officeTemplateId,this.office[i].officE_CODE,etemplate.templatE_ID,this.office[i].isselected))
      
 } 


var tempalte=new ReportTemplate(etemplate.templatE_ID,etemplate.templatE_NAME,this.imageUrl1,'',etemplate.templatE_URL,etemplate.status,
etemplate.isTaxable,etemplate.taxRate,1,etemplate.reportName,etemplate.isRPReport,
etemplate.sortOrder,etemplate.spName,etemplate.displayName,'',etemplate.companyAddress,etemplate.companyNote,
etemplate.companyName,etemplate.thanksNote,etemplate.companyNote2,etemplate.showsubreport,etemplate.subReportSP,
etemplate.subReportName,etemplate.pageCode,etemplate.tagName,selectedOffices);
   
 
    this.service.saveReportTemplate(tempalte).then(
      (response) => {
        this.getReportTemplates();
        this.getOffcie();
        this.card1style = 'card col-sm-12'
       this.ShowEmp1 = '';
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none'
       this.ShowEmp2 = 'none'
      },
      (error) => console.log(error)); 
    }
    else
      swal("Template name must be define.");
  }

  updateTemplate(etemplate){
    console.log(etemplate);
  }
  
 

  //////  ////getDetailByID
  getDetailsByID(template:any) {
    console.clear();
    console.log(template);
    this.edittemplate=template;
    this.imageUrl1=template.templatE_Logo;
    this.imageUrl=this._sanitizer.bypassSecurityTrustUrl('data:image/(png|jpg);base64,'+template.templatE_Logo);
   
    for(var i=0;i<this.office.length;i++){
      
     if(template.selectedOffices[i]!=null){
       if(template.selectedOffices[i].officeId==this.office[i].officE_CODE)
          this.office[i].isselected=true;
          this.office[i].templatE_ID=template.templatE_ID;
     }
    } 

    console.log( this.office);
  }
/*  ////////Update the row
  UpdateArea(name, citymodel, details, statuS, officeId) {
    console.log(name, citymodel, details, statuS, officeId);
    var asset = new Area(this.areA_CODE, name, citymodel, details, statuS, officeId,0,this.logedInUserID);
    console.log(asset);
    if (name != "") {
      this.service.UpdateArea(asset).then(
        (response) => {
          this.name = this.edit[0].name;
          this.citY_CODE = this.edit[0].citY_CODE;
          this.details = this.edit[0].details;
          this.statuS = this.edit[0].statuS;
          this.officeId = this.edit[0].officeID;
          this.card1style = 'card col-sm-12'
        
          this.card2display = 'none'; 1
     
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else
      swal("Subject must be define.");

  }
   */
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.ShowEmp2 = 'none';
    this.ShowEmp1 = '';
   
  }
  Edit() {
    this.card1style = 'card col-sm-7'
    this.card2display = ''; 
    this.ShowEmp1 = 'none';
    this.ShowEmp2 = ''
  }
  Cancel() {

    this.card1style = 'card col-sm-12'
    this.ShowEmp1 = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
  }

    //EmployeeImagePreview
    fileChangeEvent(file: FileList) {

      this.fileToUpload = file.item(0);
      console.log('-------------------------' + this.fileToUpload.type);
      //Show image preview
      if(this.fileToUpload.type=='image/png' || this.fileToUpload.type=='image/jpeg'){
        this.imageType=this.fileToUpload.type
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.imageUrl1 = event.target.result;
        console.log('-------------------------' +this.imageUrl);
      }
      reader.readAsDataURL(this.fileToUpload);
    }else{
      alert("Not a valid (jpeg/png) file");
    }
  
    }



   
}










