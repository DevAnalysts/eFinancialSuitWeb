import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { TrainingTypeService, TrainingType } from '../../../shared';
import swal from 'sweetalert';

import { log } from 'util';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'trainingtype',
  templateUrl: './trainingtype.component.html',
  styleUrls: ['./trainingtype.component.scss']
})
export class TrainingTypeComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
  ID: any = '';

  category: any[] = [];
  item: any[] = [];
  traininG_Type_ID: any = '';
  traininG_Catagory: any = '';
  traininG_Name: any = '';
  duratioN: any = 0;
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
  constructor(private service: TrainingTypeService) { }

  ngOnInit() {
    this.getTrainingType();
    this.logedInUserID = this.service.getSession('user_ID');
  }

  ////getTrainingType
  getTrainingType() {
    this.isLoading =true;
    console.log();
    this.service.getTrainingType()
      .subscribe(response => {
        if(response.json() !== null){
          this.category = (response.json());
          this.isLoading = false;
          //console.log(response.json());
        }
        else{
          this.category = [];
          this.isLoading = false;
        }
        
      });
  }


  //// save the data on db
  Savetrain(traininG_Catagory, traininG_Name, duratioN, activE) {
    var TrainingT = new TrainingType(0, traininG_Catagory, traininG_Name, duratioN, activE );
    console.log(TrainingT);
    if (traininG_Name!= "") {
      this.service.savetrain(TrainingT).then(
        (response) => {
          this.traininG_Name = '';
          this.traininG_Catagory = '';
          this.duratioN = 0;
          this.card1style = 'card col-sm-12'
          this.addbutton = '';
          this.activE = 0;
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));
      
    }
    else
      swal("Training Type name must be define.");
  }


  ////////////  ////getDetailByID
  getDetailsByID(traininG_Type_ID) {
    console.log(traininG_Type_ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(traininG_Type_ID)
      .subscribe(response => {
        this.edit = (response.json());
        this.traininG_Type_ID = this.edit[0].traininG_Type_ID;
        this.traininG_Catagory = this.edit[0].traininG_Catagory;
        this.traininG_Name = this.edit[0].traininG_Name;
        this.duratioN = this.edit[0].duratioN;
        this.activE = this.edit[0].activE;
        this.isLoading = false;
        console.log(response.json());
      });
  }


  ////////////Update the row
  UpdateDepartment(traininG_Catagory, traininG_Name, duratioN, activE) {
    console.log(traininG_Catagory, traininG_Name, duratioN);
    var subasset = new TrainingType(this.traininG_Type_ID, traininG_Catagory, traininG_Name, duratioN, activE);
    if (traininG_Name != "") {
      this.service.Updatetrain(subasset).then(
        (response) => {
          this.traininG_Type_ID = this.edit[0].traininG_Type_ID;
          this.traininG_Catagory = this.edit[0].traininG_Catagory;
          this.traininG_Name = this.edit[0].traininG_Name;
          this.duratioN = this.edit[0].duratioN;
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
      swal("Designation must be define.");
  }
   
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
    this.traininG_Name = '';
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










