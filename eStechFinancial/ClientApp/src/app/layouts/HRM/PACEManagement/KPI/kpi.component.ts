import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { KPIService, KPI } from '../../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KPIComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  grid: any[] = [];
  kpicode: any = 0;
  kpiname: any = "";
  weight: any = 0;
  sortorder: any = 0;
  isdefault: any = 0;
  active: any = 0;
    id: any = "";
  mtype: any[] = [];
  mtypecode: any = 0;
  mtypename: any = "";

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
  constructor(private service: KPIService) { }

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
        this.isLoading = false;
        if (response.json() != null) {
          this.grid = (response.json());

          console.log(response.json());
        }
      });
  }
  //getMeasurementType
  getMeasurementType() {
    this.isLoading =true;
    console.log();
    this.service.getMeasurementType()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.mtype = (response.json());
          this.mtypecode = this.mtype[0].mtypecode;
          this.mtypename = this.mtype[0].mtypename;
          this.isLoading = false;
          console.log(response.json());
        }
      });
  }
  //saveData
  saveData() {
    var Data = new KPI(0, this.kpiname, this.weight, this.sortorder, this.mtypecode, this.isdefault, this.active);
    console.log(Data);
    if (this.kpiname != "") {
      this.service.saveData(Data).then(
        (response) => {

          this.kpicode = 0;
          this.kpiname = "";
          this.weight = 0;
          this.sortorder = 0;
          this.isdefault = 0;
          this.active = 0;
          this.mtypecode = 0;

          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else
      swal("KPI Must Be Defined.");
  }
  //updateData
  updateData() {
    var Data = new KPI(this.kpicode, this.kpiname, this.weight, this.sortorder, this.mtypecode, this.isdefault, this.active);
    console.log(Data);
    if (this.kpiname != "") {
      this.service.updateData(Data).then(
        (response) => {

          this.kpicode = 0;
          this.kpiname = "";
          this.weight = 0;
          this.sortorder = 0;
          this.isdefault = 0;
          this.active = 0;
          this.mtypecode = 0;


          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else
      swal("KPI  Must Be Defined.");
  }

  //getDetailsByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          var list = (response.json());
          this.kpicode = ID;
          this.kpiname = list[0].kpiname;
          this.weight = list[0].weight;
          this.sortorder = list[0].sortorder;
          this.isdefault = list[0].isdefault;
          this.active = list[0].active;

          this.isLoading =true;
          this.service.getMeasurementType()
            .subscribe(response => {
              this.isLoading = false;
              if (response.json() != null) {
                this.mtype = (response.json());
                this.mtypecode = list[0].mtypecode;
              }
            });
        }
      });
  }


  Add() {
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
    this.kpicode = 0;
    this.kpiname = "";
    this.weight = 0;
    this.sortorder = 0;
    this.isdefault = 0;
    this.active = 0;
    this.mtypecode = 0;
    this.mtypename = "";
    this.getMeasurementType();
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










