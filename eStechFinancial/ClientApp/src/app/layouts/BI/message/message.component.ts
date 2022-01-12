import { PageRegistrationComponent } from './../../../pageregistration/pageregistration.component';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { SmsAlertService,SmsAlert,PermissionUtility, AlertSMSTemplate} from '../../../shared';
import swal from 'sweetalert';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import {PageRegistration} from '../../../shared/models/Admin/PageRegistration'

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public exampleData: Array<Select2OptionData>;
  public data: Array<Select2OptionData>;
  modalReference: NgbModalRef;
  closeResult: string;
  gridlist:any[]=[];
  title: any = '';
  type: any = '';
  message: any = '';
  active: any='';
  pagename:any=[];
  pagecode:any=[];
  list : any = [] ; 
  logedInUserID: string;
  btnmode: any = true;
  mode: any = false;
  PermissionDelete: any = 'none';
  isLoading: any = false;
  ID: any = 0;
  status: any = false;
  code: any = 0;
  isDefault: Boolean=false;
  
  constructor(private service: SmsAlertService, private modalService: NgbModal) { }

  ngOnInit() {
    
    this.permissionUtility.setPagePermissions(140202);
    this.logedInUserID = this.service.getSession('user_ID');
     this.getMessage();
  }


  getMessageType(pageCode:any){
this.service.getMessageType().subscribe((o:PageRegistration) => {
   let valuetxt:any = "pageid";
   this.list = o;
   
  let displaytxt : any = "pagename";
  let ar: Array<any> = [];
    if (this.list != null) {

      
      this.list.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    this.data= ar;
    if(pageCode==0)
     this.type = this.data[0].id;
     else
     this.type =pageCode;

 
})
  }


  saveMessage(){
  var data =new AlertSMSTemplate(0,this.title,this.type,this.message,this.isDefault,this.logedInUserID);
  console.log(data);
  this.service.saveMessage(data).then(
    (response) => {
      
      swal("Done!", "Message saved successfully...", "success");
      this.clearFields();
      this.getMessage();
      

this.modalReference.close();
    },

    (error) => console.log(error)
  )

}
  changeType(e)
  {
    this.type = e;
  }
 
  
  //updateMessage
  updateMessage(reason) {
    console.log();
    this.isLoading =true;
   
    var data = new AlertSMSTemplate(this.ID,this.title,this.type,this.message,this.isDefault,this.logedInUserID);
   
    this.service.updateMessage(data).then(
      (response) => {
        this.isLoading = false;
        this.getMessage();
        this.modalReference.close();
       swal("Record Updated!");
      },
      (error) => console.log(error))
     
  }



  open(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    }; 
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
     
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }); 
    this.clearFields();

  }
    //openDetail modal
  openDetail(contentdetail) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
  
    this.modalReference = this.modalService.open(contentdetail, { size: 'xlg' });
 
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
  

  }
    //getDetailsByID
  getDetailByID(ID, contentdetail) {
   
    this.mode = true; 
    this.btnmode = false;
    this.isLoading =true;
  
    this.service.getDetailByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response ) {
          var list = (response as any[]) ;
          this.ID = list[0].templateID;
          this.title = list[0].title;
          this.message = list[0].message;
          this.isDefault=list[0].isDefault;
          this.getMessageType( list[0].pageCode);
          this.isLoading = false;

        }
      });

      this.openDetail(contentdetail);
      
  }
    
  
   
//getDismissReason
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
  } else {
      return `with: ${reason}`;
  }
}
//getMessage
getMessage() {
  this.isLoading =true;
  this.service.getMessage()
    .subscribe(response => {

      this.gridlist = (response as any[]);
      this.isLoading = false;
      
    });
}
//cancelAlertNotification
cancelAlertNotification(ID) {
  this.isLoading =true;

  this.service.cancelAlertNotification(this.ID)
    .subscribe(response => {
      this.getMessage();
      this.isLoading = false;
      this.modalReference.close();
    });
    
this.clearFields();


}
//clearFields
clearFields() {
    this.ID=0;
    this.mode = false; 
    this.btnmode = true;
    this.title='';
    this.message='';
    this.isDefault=false;
    this.getMessageType(0);  
    
  $("#alertWarning").hide();
  $("#submitAdd").prop("disabled", false);
 
}

  
}
