import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { VoucherTypeService, VoucherType } from '../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'vouchertype',
  templateUrl: './vouchertype.component.html',
  styleUrls: ['./vouchertype.component.scss']
})
export class VoucherTypeComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  ID: any = '';
  grid: any[] = [];

  card1display: any = '';
  card1style: any = 'card col-sm-12'
 isLoading: any = false;
  logedInUserID: any = 1;


  //End Member Variables
  constructor(private service: VoucherTypeService) { }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
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


}










