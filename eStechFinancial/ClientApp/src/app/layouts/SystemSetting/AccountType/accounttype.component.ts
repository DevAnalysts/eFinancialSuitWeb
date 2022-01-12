import { Component, OnInit } from '@angular/core';
import { AccountTypeService} from '../../../shared';

@Component({
  selector: 'accounttype',
  templateUrl: './accounttype.component.html',
  styleUrls: ['./accounttype.component.scss']
})
export class AccountTypeComponent implements OnInit {
  ////Member Variables
  p: number = 1;
  ID: any = '';
  grid: any[] = [];

  card1display: any = '';
  card1style: any = 'card col-sm-12'

 isLoading: any = false;
  logedInUserID: any = 1;


  //End Member Variables
  constructor(private service: AccountTypeService) { }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
  }

  ////getGrid
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










