import { Component, OnInit } from '@angular/core';
import { AccountLevelService } from '../../../shared';

@Component({
  selector: 'accountlevel',
  templateUrl: './accountlevel.component.html',
  styleUrls: ['./accountlevel.component.scss']
})
export class AccountLevelComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  Itemsname: any = "";
  active: any = 1;
  edit: any[] = [];
  ID: any = '';

  subject: any[] = [];
  item: any[] = [];
  banK_CODE = 0;
  banK_NAME = '';
  abbR = '';

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
  constructor(private service: AccountLevelService) { }

  ngOnInit() {
    this.getAccountLevel();
    this.logedInUserID = this.service.getSession('user_ID');
  }

  ////getAccountLevel
  getAccountLevel() {
    this.isLoading =true;
    console.log();
    this.service.getAccountLevel()
      .subscribe(response => {
        this.subject = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = '';
      this.banK_NAME = '';
      this.active = 1;
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










