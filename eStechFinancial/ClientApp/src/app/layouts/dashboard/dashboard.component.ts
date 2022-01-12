import { Component, OnInit, HostListener } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { CardService, LoginService } from '../../shared';
import { Router, NavigationEnd } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  host: { 'window:keydown': 'hotkeys($event)' },
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  styles: [`
    :host >>> .alert-custom {
    background-color: #f1f1f1;
    height:80px;
    //padding-top: 2px;
    padding-left: 4px;
    padding-right: 10px;
    margin-bottom: -10px;
}
    :host >>> .alert-dismissible .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0px 3px 0px 0px;
    color: #33313170;
}
  :host >>> .alert-custom:hover {border: 1px solid #0094ff}
  `],
  animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
  public alerts: Array<any> = [];
  public sliders: Array<any> = [];
  logedInUserID: any;
  isLoading: any = false;
  page: any;
  pageIcon: any;
  cardType: any = 1;
  cards: any[];
  toggle: boolean = true;
  colors = ['#ff0000', '#00ff00', '#0000ff', '#00FFFF', '#5F9EA0', '#6495ED', '#696969', '#CD853F', '#CD853F'];
  cardColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  mPageID: any = 0;
  mFavName: any = 'Favourite';
  mSortOrder: any = 1;

  constructor(public _DomSanitizer: DomSanitizer, private service: CardService, private loginService: LoginService, public router: Router) {
    this.logedInUserID = sessionStorage.getItem('user_ID');

    //alert(this.logedInUserID);
    this.service.getCards(this.logedInUserID, this.cardType)
      .subscribe(res => {
        this.cards = res.json();
        //   console.log(res.json());
      });
    this.sliders.push(
      {
        imagePath: 'assets/images/slider1.jpg',
        label: 'First slide label',
        text:
          'Nulla vitae elit libero, a pharetra augue mollis interdum.'
      },
      {
        imagePath: 'assets/images/slider2.jpg',
        label: 'Second slide label',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
      },
      {
        imagePath: 'assets/images/slider3.jpg',
        label: 'Third slide label',
        text:
          'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
      }
    );

    this.alerts.push(
      {
        id: 1,
        type: 'success',
        message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
      },
      {
        id: 2,
        type: 'warning',
        message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
      }
    );
  }

  ngOnInit() {
    if (this.logedInUserID < 1) {
      this.router.navigate(['/newlogin']);
    }
    this.showGraphs();
  }
  onToggle() {
    if (this.toggle) {
      this.router.navigate(['/charts']);
    } else {
      this.router.navigate(['/dashboard']);

    }
    this.toggle = !this.toggle;
  }
  changePages(page_Name) {
    this.page = page_Name;

    this.router.navigateByUrl(this.page);
  }
  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }
  setFavourites(mID) {
    this.isLoading =true;
    this.mPageID = mID;
    this.loginService.setFavourites(this.logedInUserID, this.mPageID, this.mFavName, this.mSortOrder)
      .subscribe(response => {
        this.service.getCards(this.logedInUserID, this.cardType)
          .subscribe(res => {
            this.isLoading = false;
            this.cards = res.json();

          });
      });

  }
  //////////////////////////////////////////////////////////////
  ///////////////////////////////GRAPHS////////////////////////

  fillGraphs() {
    //BARCHART
    this.getTotalSales();
    this.getTotalPurchases();
  }
  showGraphs() {
    if (this.loginService.getSession('ShowGraphs') != '1') {
      this.showTotalSale = '';
      this.showTotalPurchase = '';
    }
    else {
      this.fillGraphs();
    }
  }
  //==>barchart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    //animation: false,
    scales: {
      yAxes: [{
        ticks: {
          callback: function (value, index, values) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
           // return value.toLocaleString("en-US", { style: "currency", currency: "", minimumFractionDigits: 0, maximumFractionDigits: 0 });
          }
        }
      }]
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var value = data.datasets[0].data[tooltipItem.index];
          //if (parseInt(value) >= 1000) {
            return  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         // } else {
           // return '$' + value;
          //}
        }
      } 
    },  
  };
  public barChartLabels: string[] = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }


  //TotalSale
  showTotalSale: any = 'show';
  yearTotalSale: any = 2018;
  public TotalSale: any[12] = [];
  public TotalSaleData: any[] = [{ data: this.TotalSale, label: 'Total Sales' }];
  public TotalSaleColors: Array<any> = [{ backgroundColor: 'rgba(255, 51, 153,0.2)', borderColor: 'rgba(255, 51, 153)', borderWidth: 2, }];
  getTotalSales() {
    this.loginService.getTotalSales(this.yearTotalSale)
      .subscribe(response => {
        this.TotalSale = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalSale[x] = list[i].amount;
          }
        }
        this.TotalSaleData = [{ data: this.TotalSale, label: 'Total Sales' }];
      });
  }

  //TotalPurchase
  showTotalPurchase: any = 'show';
  yearTotalPurchase: any = 2018;
  public TotalPurchase: any[12] = [];
  public TotalPurchaseData: any[] = [{ data: this.TotalSale, label: 'Total Purchase' }];
  public TotalPurchaseColors: Array<any> = [{ backgroundColor: 'rgba(0, 255, 255,1)', borderColor: 'rgba(0, 255, 255)', borderWidth: 2, }];
  getTotalPurchases() {
    this.loginService.getTotalPurchase(this.yearTotalPurchase)
      .subscribe(response => {
        this.TotalPurchase = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalPurchase[x] = list[i].amount;
          }
        }
        this.TotalPurchaseData = [{ data: this.TotalPurchase, label: 'Total Purchase' }];
      });
  }

 

}
