import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {HSubCategoryService, HSubCategory } from '../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'hsubcategory',
  templateUrl: './hsubcategory.component.html',
  styleUrls: ['./hsubcategory.component.scss']
})
export class HSubCategoryComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
  ID: any = '';

  category: any[] = [];
  item: any[] = [];
  subcategorY_CODE: any = 0;
  subcategorY: any = '';
  categorY_CODE: any = 0;
  activE: any = 0;


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


  //End Member Variables
  constructor(private service: HSubCategoryService) { }

  ngOnInit() {
    this.getHSubCategory();
    this.logedInUserID = this.service.getSession('user_ID');
  }

  ////getHSubCategory
  getHSubCategory() {
    this.isLoading =true;
    console.log();
    this.service.getHSubCategory()
      .subscribe(response => {
        this.category = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //// save the data on db
  saveSubject(subcategorY, categorY_CODE, activE) {
    var subasset = new HSubCategory(0, subcategorY, categorY_CODE, activE );
    console.log(subasset);
    if (subcategorY!= "") {
      this.service.saveHSubCategory(subasset).then(
        (response) => {
          this.subcategorY_CODE = '';
          this.subcategorY = '';
          this.categorY_CODE = '';
          this.activE = 0;
          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));
     
    }
    else
      swal("Subject name must be define.");
  }


  ////////  ////getDetailByID
  getDetailsByID(subcategorY_CODE) {
    console.log(subcategorY_CODE, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(subcategorY_CODE)
      .subscribe(response => {
        this.edit = (response.json());
        this.subcategorY_CODE = this.edit[0].subcategorY_CODE;
        this.subcategorY = this.edit[0].subcategorY;
        this.categorY_CODE = this.edit[0].categorY_CODE;
        this.activE = this.edit[0].activE;
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //////////Update the row
  UpdateSubject(subcategorY, categorY_CODE, activE) {
    console.log(subcategorY, categorY_CODE);
    var subasset = new HSubCategory(this.subcategorY_CODE, subcategorY, categorY_CODE, activE);
    if (subcategorY != "") {
      this.service.UpdatHSubCategory(subasset).then(
        (response) => {
          this.subcategorY_CODE = this.edit[0].subcategorY_CODE;
          this.subcategorY = this.edit[0].subcategorY;
          this.categorY_CODE = this.edit[0].categorY_CODE;
          this.activE = this.edit[0].activE;
          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none'; 
          this.ShowEmp1 = 'none';
          this.ShowEmp2 = 'none';
          this.ngOnInit();
        },
        (error) => console.log(error));
     
    }
    else
      swal("Subject must be define.");

  }
   
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
    this.subcategorY = '';
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










