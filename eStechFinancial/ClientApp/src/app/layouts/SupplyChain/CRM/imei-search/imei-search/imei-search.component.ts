import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { IMEISearchService, LoginService,  PermissionUtility } from '../../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';

import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'imei-search',
  templateUrl: './imei-search.component.html',
  styleUrls: ['./imei-search.component.scss']
})
export class IMEISearchComponent implements OnInit {
  ////////////////////////////////////////

  logedInUserID: any = 1;
  userPrivilegedOffice: any = '1';
  PermissionSpecial: any = 'none';
  PermissionDropdown: any = 'none';
  
  
  modalReference: NgbModalRef;
  ImeiSearch: any='';
  ImeiSearchResult: any[] = []; 
  
  ShowSearchResult: any='none';
  ShowSearchResult0: any='none';
  
  constructor(public router: Router,  private service: IMEISearchService, private LoginService: LoginService, private modalService: NgbModal) { }

  ngOnInit() {
    this.ShowSearchResult='none';
    this.ShowSearchResult0='none';
  } 

  getImeiSearch(ImeiSearch:any){

    this.ShowSearchResult='none';
    this.ShowSearchResult0='none';
    this.service.searchIMEI(ImeiSearch).subscribe(r=>{
      console.log(r.json());
      if(r.json()!=null){
        this.ShowSearchResult='';
        this.ShowSearchResult0='none';
        
        this.ImeiSearchResult=r.json();
      }else{
        this.ShowSearchResult='none';
        this.ShowSearchResult0='';
      }

    });

  }
 
} 








