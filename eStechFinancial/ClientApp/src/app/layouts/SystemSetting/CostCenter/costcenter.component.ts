import { Component, OnInit } from '@angular/core';
import { CostCenterService } from '../../../shared';

@Component({
  selector: 'costcenter',
  templateUrl: './costcenter.component.html',
  styleUrls: ['./costcenter.component.scss']
})
export class CostCenterComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
  ID: any = '';

  category: any[] = [];
  item: any[] = [];
  currencY_CODE: any = 0;
  currencY_DESCR: any = '';
  currencY_SYMBOL: any = '';
  abbR: any = '';
  locaL: any = 0;
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
  constructor(private service: CostCenterService) { }

  ngOnInit() {
    this.getCostCenter();
    this.logedInUserID = this.service.getSession('user_ID');
  }

  ////getUsers
  getCostCenter() {
    this.isLoading =true;
    console.log();
    this.service.getCostCenter()
      .subscribe(response => {
        //console.log(response);
        this.category = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


 
   
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
    this.currencY_CODE = '';
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










