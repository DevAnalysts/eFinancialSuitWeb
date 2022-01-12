import { Component, Input, OnInit } from '@angular/core';
import { CardService } from '../../../../shared';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  styles: [`
:host >>> .alert-custom2 {
    //background-color: LightCoral ;
    height:50px;
    padding: 2px 25px 0px 5px;
}
:host >>> .list-group-item {
    position: relative;
    display: block;
    padding: 0px 2px 0px 0px;
    margin-bottom:5px;
    background-color: #fff;    
}

  `]
})
export class NotificationComponent implements OnInit {

  favourites: any[];
  userId: any;
  cardType: any = 2;
  pageIcon: any;
  constructor(private service: CardService) {
    this.userId = sessionStorage.getItem('user_ID');
    this.service.getCards(this.userId, this.cardType)
      .subscribe(res => {
        this.favourites = res.json();
      });
  }
  ngOnInit() { }


  public closeMenus(favourites: any) {
    const index: number = this.favourites.indexOf(favourites);
    this.favourites.splice(index, 1);
  }
}
