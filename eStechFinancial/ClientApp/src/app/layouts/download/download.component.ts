import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SaleOrderService, LoginService, SearchFilterService, DayEndService, customer, saleOrder, saleOrderDetails, CustomerService, Customers, cDate, NgbDateFRParserFormatter, FileAttachmentService, EmailAlertService } from '../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { Router } from '@angular/router';

@Component({
  selector: 'download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  styles: [`
@media screen {
        .modal-sm {
           max-width: 500px !important;
            height: 250px !important;

       }
 .modal-custom {
           max-width: 800px !important;
            height: 250px !important;

       }
}
     .hide-page-numbers /deep/ .ngx-pagination li:not(.pagination-previous):not(.pagination-next) {
  display: none;
}

td.active {
  background: #5897FA;
}


        `],
  host: { '(window:keydown)': 'hotkeys($event)' },
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DownloadComponent implements OnInit {
  public mask1 = ['0', /[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/] //Mobile Nos
  ////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';

  PermissionDropdown: any = 'none';
  PermissionItem1: any = 'none';
  PermissionItem2: any = 'none';
  ////////////////////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  alerts: any = [];
  isLoading: any = false;
  constructor(
    public router: Router,
    private service: SaleOrderService,
    private LoginService: LoginService,
   
    private modalService: NgbModal) {
    
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  //ngOnInit
  ngOnInit() {

    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    var ItemCount = 0;
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 140004) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;
          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].userSessionID;
        }

    }

    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }

  download() {

    //var a = document.createElement("a");
    //// ... set a.href and a.download
    //a.href = 'Files/file.txt';
    //a['download'] = 'ok.txt';
    //// Then click the link:
    //var clickEvent = new MouseEvent("click", {
    //  "view": window,
    //  "bubbles": true,
    //  "cancelable": false
    //});
    //a.dispatchEvent(clickEvent);
    
    
  }
}
