import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbDateParserFormatter,NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CustomerCategoryService, CustomerCategory, NgbDateFRParserFormatter, cDate } from '../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';

const now = new Date();
@Component({
  selector: 'taxtype',
  templateUrl: './taxtype.component.html',
  styleUrls: ['./taxtype.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class TaxTypeComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  customercategorycode: any = 0;
  customercategoryname: any = "";
  active: any = 0;
  taxtermname: any = '';
  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
 isLoading: any = false;

  logedInUserID: any = 1; 

  ////End Member Variables
  constructor(private service: CustomerCategoryService) { }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');

  
  }
   
  //getUsers
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json()); 
        this.isLoading = false;
      });
  }

  
 
    ////getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        this.customercategorycode = ID;
        this.customercategoryname = list[0].customercategoryname;
        this.active = list[0].active;
        
      });
  }

  //saveData
  saveData() {

    var Data = new CustomerCategory(0, this.customercategoryname, this.active);
    if (this.customercategoryname != "") {
      this.service.saveData(Data).then(
        (response) => {
          this.customercategorycode = 0;
          this.customercategoryname = '';
          this.active = 0;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));
      
    }
    else
      swal("Customer Category Name Must Be Defined!");
  }
  //updateData
  updateData() {

    var Data = new CustomerCategory(this.customercategorycode, this.customercategoryname, this.active);
    if (this.customercategoryname != "") {
      this.service.updateData(Data).then(
        (response) => {
          this.customercategorycode = 0;
          this.customercategoryname = '';
          this.active = 0;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none';
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else
      swal("Customer Category Name Must Be Defined!");
  }

  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';

    this.customercategorycode = 0;
    this.customercategoryname = '';
    this.active  = 0;
  }
  Edit() {
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp2 = ''
  }
  Cancel() {

    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
  }

}










