import { Component, OnInit } from '@angular/core';
import { CurrencyService, Currency } from '../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = false;
  edit: any[] = [];
  ID: any = '';

  category: any[] = [];
  item: any[] = [];
  currencY_CODE: any = 0;
  currencY_DESCR: any = '';
  currencY_SYMBOL: any = '';
  abbR: any = '';
  locaL: any = false;


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
  constructor(private service: CurrencyService) { }

  ngOnInit() {
    this.getcurrency();
    this.logedInUserID = this.service.getSession('user_ID');
  }

  ////getUsers
  getcurrency() {
    this.isLoading =true;
    console.log();
    this.service.getCurrency()
      .subscribe(response => {
        this.category = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }


  //// save the data on db
  saveSubject(currencY_DESCR, currencY_SYMBOL, abbR, locaL ) {
    var money = new Currency(0, currencY_DESCR, currencY_SYMBOL, abbR, locaL );
    console.log(money);
    if (currencY_DESCR!= "") {
      this.service.saveAssetSubCategory(money).then(
        (response) => this.ngOnInit(),
        (error) => console.log(error));
      this.currencY_CODE = '';
      this.currencY_DESCR = '';
      this.currencY_SYMBOL = '';
      this.abbR = 0;
      this.locaL = true;
      this.active = true;

      this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none'
      this.ShowEmp2 = 'none'
      this.ngOnInit();
    }
    else
      swal("Currency name must be define.");
  }


  ////////  ////getDetailByID
  getDetailsByID(currencY_CODE) {
    console.log(currencY_CODE, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(currencY_CODE)
      .subscribe(response => {
        this.edit = (response.json());
        this.currencY_CODE = this.edit[0].currencY_CODE;
        this.currencY_DESCR = this.edit[0].currencY_DESCR;
        this.currencY_SYMBOL = this.edit[0].currencY_SYMBOL;
        this.abbR = this.edit[0].abbR;
        this.locaL = this.edit[0].locaL;
        this.isLoading = false;
        console.log(response.json());
      });
  }

  //////////Update the row
  UpdateSubject(currencY_DESCR, currencY_SYMBOL, abbR, locaL) {
    console.log(currencY_DESCR, currencY_SYMBOL, abbR, locaL);
    var money = new Currency(this.currencY_CODE, currencY_DESCR, currencY_SYMBOL, abbR, locaL);
    if (currencY_DESCR != "") {
      this.service.UpdateAssetSubCategory(money).then(
        (response) => this.ngOnInit(),
        (error) => console.log(error));
      this.currencY_CODE = this.edit[0].currencY_CODE;
      this.currencY_DESCR = this.edit[0].currencY_DESCR;
      this.currencY_SYMBOL = this.edit[0].currencY_SYMBOL;
      this.abbR = this.edit[0].abbR;
      this.locaL = this.edit[0].locaL;

      this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.locaL = true;
      this.active = true;
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none'
      this.ShowEmp2 = 'none'
    }
    else
      swal("Subject must be define.");

  }
   
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.active = true;
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










