import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router, NavigationEnd } from '@angular/router';
import {  LoginService } from '../../shared';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
  toggle: boolean = true;
  logedInUserID: any;
  public alerts: Array<any> = [];
  constructor(public router: Router, private loginService: LoginService) {
    this.logedInUserID = sessionStorage.getItem('user_ID');
  }

  ngOnInit() {
    if (this.logedInUserID < 1) {
      this.router.navigate(['/login']);
    }
    this.showGraphs();
  }
  onToggle() {
    if (this.toggle) {
      this.router.navigate(['/dashboard']);

    } else {
      this.router.navigate(['/charts']);
    }
    this.toggle = !this.toggle;
  }
  fillGraphs() {
    //BARCHART
    this.getTotalSalePurchasePerYear();
    this.getTotalCustomerPayment();
    //LINECHART
    this.getTotalSupplierPayment();
    this.getTotalCustomerSupplierPaymentPerYear();
    //PIE
    this.getTotalSaleInvoices();
    this.getTotalPurchaseInvoices();
    //DOUGHNOT
    this.getFavouriteSaleItem();
    this.getFavouritePurchaseItem();
    this.getFavouriteSaleCustomer();
    this.getFavouritePurchaseSupplier();

  }
  showGraphs() {
    if (this.loginService.getSession('ShowGraphs') != '1') {
      this.showTotalCustomerPayment = '';
      this.showTotalSupplierPayment = '';
      this.showTotalSalePurchasePerYear = '';
      this.showTotalCustomerSupplierPaymentPerYear = '';
      this.showTotalSaleInvoices = '';
      this.showFavouriteSaleItemLabels = '';
      this.showFavouritePurchaseItemLabels = '';
      this.showFavouritePurchaseSupplierLabels = '';
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
          return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  yearTotalSale: any = 2020;
  yearTotalPurchase: any = 2020;

  //TotalCustomerPayment
  showTotalCustomerPayment: any = 'show';
  yearTotalCustomerPayment: any = 2020;
  public TotalCustomerPayment: any[12] = [];
  public TotalCustomerPaymentData: any[] = [{ data: this.TotalCustomerPayment, label: 'Total Customer Reciept' }];
  public TotalCustomerPaymentColors: Array<any> = [{ backgroundColor: 'rgba(255, 204, 0,1)', borderColor: 'rgba(255, 204, 0)', borderWidth: 2, }];
  getTotalCustomerPayment() {
    this.loginService.getTotalCustomerPayment(this.yearTotalSale)
      .subscribe(response => {
        this.TotalCustomerPayment = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalCustomerPayment[x] = list[i].amount;
          }
        }
        this.TotalCustomerPaymentData = [{ data: this.TotalCustomerPayment, label: 'Total Customer Reciept' }];
      });
  }

  //TotalSupplierPayment
  showTotalSupplierPayment: any = 'show';
  yearTotalSupplierPayment: any = 2020;
  public TotalSupplierPayment: any[12] = [];
  public TotalSupplierPaymentData: any[] = [{ data: this.TotalSupplierPayment, label: 'Total Supplier Payment' }];
  public TotalSupplierPaymentColors: Array<any> = [{ backgroundColor: 'rgba(153, 255, 102,0.2)', borderColor: 'rgba(153, 255, 102)', borderWidth: 2, }];
  getTotalSupplierPayment() {
    this.loginService.getTotalSupplierPayment(this.yearTotalPurchase)
      .subscribe(response => {
        this.TotalSupplierPayment = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalSupplierPayment[x] = list[i].amount;
          }
        }
        this.TotalSupplierPaymentData = [{ data: this.TotalSupplierPayment, label: 'Total Supplier Payment' }];
      });
  }



  //==>LineChart
  public lineChartLabels: Array<any> = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          callback: function (value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
      }]
    },
    //tooltips: {
    //  callbacks: {
    //    label: function (tooltipItem, data) {
    //      var value = data.datasets[0].data[tooltipItem.index];        
    //      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //    }
    //  }
    //},  
  };
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  //TotalSalePurchasePerYear
  showTotalSalePurchasePerYear: any = 'show';
  public TotalSalePerYear: any[11] = [];
  public TotalPurchasePerYear: any[11] = [];
  public TotalSalePurchasePerYearColors: Array<any> = [
    {
      backgroundColor: 'rgba(102, 0, 204,0.2)',
      borderColor: 'rgba(102, 0, 204,1)',
      pointBackgroundColor: 'rgba(102, 0, 204,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(102, 204, 255,0.2)',
      borderColor: 'rgba(102, 204, 255,1)',
      pointBackgroundColor: 'rgba(102, 204, 255,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }

  ];
  public TotalSalePurchasePerYear: Array<any> = [
    { data: this.TotalSalePerYear, label: 'Total Sale' },
    { data: this.TotalPurchasePerYear, label: 'Total Purchase' },
  ];
  getTotalSalePurchasePerYear() { //For Year 2010 - 2020 only
    this.loginService.getTotalSalePurchasePerYear()
      .subscribe(response => {
        this.TotalSalePerYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.TotalPurchasePerYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalSalePerYear[x] = list[i].saleAmount;
            this.TotalPurchasePerYear[x] = list[i].purchaseAmount;
          }
        }
        this.TotalSalePurchasePerYear = [
          { data: this.TotalSalePerYear, label: 'Total Sale' },
          { data: this.TotalPurchasePerYear, label: 'Total Purchase' },
        ];
      });
  }

  //TotalCustomerSupplierPaymentPerYear
  showTotalCustomerSupplierPaymentPerYear: any = 'show';
  public TotalCustomerPaymentPerYear: any[11] = [];
  public TotalSupplierPaymentPerYear: any[11] = [];
  public TotalCustomerSupplierPaymentPerYearColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(0, 153, 153,0.2)',
      borderColor: 'rgba(0, 153, 153,1)',
      pointBackgroundColor: 'rgba(0, 153, 153,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // dark grey
      backgroundColor: 'rgba(255, 153, 0,0.2)',
      borderColor: 'rgba(255, 153, 0,1)',
      pointBackgroundColor: 'rgba(255, 153, 0,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }

  ];
  public TotalCustomerSupplierPaymentPerYear: Array<any> = [
    { data: this.TotalCustomerPaymentPerYear, label: 'Total Customer Reciept' },
    { data: this.TotalSupplierPaymentPerYear, label: 'Total Supplier Payment' },
  ];
  getTotalCustomerSupplierPaymentPerYear() { //For Year 2010 - 2020 only
    this.loginService.getTotalCustomerSupplierPaymentPerYear()
      .subscribe(response => {
        this.TotalCustomerPaymentPerYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.TotalSupplierPaymentPerYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalCustomerPaymentPerYear[x] = list[i].customerAmount;
            this.TotalSupplierPaymentPerYear[x] = list[i].supplierAmount;
          }
        }
        this.TotalCustomerSupplierPaymentPerYear = [
          { data: this.TotalCustomerPaymentPerYear, label: 'Total Customer Reciept' },
          { data: this.TotalSupplierPaymentPerYear, label: 'Total Supplier Payment' },
        ];
      });
  }

  //==>PieChart
  public pieChartOptions: any = {
    //responsive: true,
    //scales: {
    //  yAxes: [{
    //    ticks: {
    //      callback: function (value) {
    //        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //      }
    //    }
    //  }]
    //},
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var value = data.datasets[0].data[tooltipItem.index];
          console.log(data.labels[tooltipItem.index]);
          return data.labels[tooltipItem.index] + " : " + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
      }
    },
  };
  public pieChartLabels: string[] = ['Pending', 'Cancelled', 'Partial', 'Completed'];
  public pieChartType: string = 'pie';

  //TotalSaleInvoices
  showTotalSaleInvoices: any = 'show';
  public TotalSaleInvoicesData: any[4] = [];
  //public pieChartData: number[] = [500, 300, 50];  
  public TotalSaleInvoicesColors: Array<any> = [{
    backgroundColor: ['rgba(0, 153, 204,0.8)', 'rgba(255, 0, 102,0.8)', 'rgba(255, 153, 0,0.8)', 'rgba(0, 204, 102,0.8)'],
    hoverBackgroundColor: ['rgba(0, 153, 204,1)', 'rgba(255, 0, 102,1)', 'rgba(255, 153, 0,1)', 'rgba(0, 204, 102,1)']
  }];
  getTotalSaleInvoices() {
    this.loginService.getTotalSaleInvoices()
      .subscribe(response => {
        this.TotalSaleInvoicesData = [0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalSaleInvoicesData[x - 1] = list[i].qty;
          }
        }
      });
  }
  //TotalPurchaseInvoices
  showTotalPurchaseInvoices: any = 'show';
  public TotalPurchaseInvoicesData: any[4] = [];
  public TotalPurchaseInvoicesColors: Array<any> = [{
    backgroundColor: ['rgba(51, 102, 255,0.8)', 'rgba(255, 0, 0,0.8)', 'rgba(255, 102, 0,0.8)', 'rgba(153, 255, 51,0.8)'],
    hoverBackgroundColor: ['rgba(51, 102, 255,1)', 'rgba(255, 0, 0,1)', 'rgba(255, 102, 0,1)', 'rgba(153, 255, 51,1)']
  }];
  getTotalPurchaseInvoices() {
    this.loginService.getTotalPurchaseInvoices()
      .subscribe(response => {
        this.TotalPurchaseInvoicesData = [0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            var x = list[i].id;
            this.TotalPurchaseInvoicesData[x - 1] = list[i].qty;
          }
        }
      });

  }

  //==>DoughnutChart
  public doughnutChartType: string = 'doughnut';

  showFavouriteSaleItemLabels: any = 'show';
  public FavouriteSaleItemLabels: any[5] = [];
  public FavouriteSaleItemData: any[5] = [];
  public FavouriteSaleItemColors: Array<any> = [{
    backgroundColor: ['rgba(0, 0, 153,0.2)', 'rgba(0, 0, 255,0.2)', 'rgba(51, 102, 255,0.2)', 'rgba(102, 153, 255,0.2)', 'rgba(51, 204, 255,0.2)',],
    borderColor: ['rgba(0, 0, 153,1)', 'rgba(0, 0, 255,1)', 'rgba(51, 102, 255,1)', 'rgba(102, 153, 255,1)', 'rgba(51, 204, 255,1)',],
    hoverBackgroundColor: ['rgba(0, 0, 153,0.8)', 'rgba(0, 0, 255,0.8)', 'rgba(51, 102, 255,0.8)', 'rgba(102, 153, 255,0.8)', 'rgba(51, 204, 255,0.8)',]
  }];
  getFavouriteSaleItem() {
    this.loginService.getFavouriteSaleItem()
      .subscribe(response => {
        //this.FavouriteSaleItemLabels = ['', '', '', '', ''];
        this.FavouriteSaleItemData = [0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            this.FavouriteSaleItemLabels[i] = list[i].label;
            this.FavouriteSaleItemData[i] = list[i].qty;
          }
        }
      });

  }

  showFavouritePurchaseItemLabels: any = 'show';
  public FavouritePurchaseItemLabels: any[5] = [];
  public FavouritePurchaseItemData: any[5] = [];
  public FavouritePurchaseItemColors: Array<any> = [{
    backgroundColor: ['rgba(153, 0, 204,0.2)', 'rgba(102, 0, 255,0.2)', 'rgba(204, 0, 255,0.2)', 'rgba(255, 51, 204,0.2)', 'rgba(255, 0, 102,0.2)',],
    //borderColor:          ['rgba(153, 0, 204,1)'  , 'rgba(102, 0, 255,1)'  , 'rgba(204, 0, 255,1)'  , 'rgba(255, 51, 204,1)'    , 'rgba(255, 0, 102,1)' ,],
    hoverBackgroundColor: ['rgba(153, 0, 204,0.8)', 'rgba(102, 0, 255,0.8)', 'rgba(204, 0, 255,0.8)', 'rgba(255, 51, 204,0.8)', 'rgba(255, 0, 102,0.8)',]
  }];
  getFavouritePurchaseItem() {
    this.loginService.getFavouritePurchaseItem()
      .subscribe(response => {
        //this.FavouritePurchaseItemLabels = ['', '', '', '', ''];
        this.FavouritePurchaseItemData = [0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            this.FavouritePurchaseItemLabels[i] = list[i].label;
            this.FavouritePurchaseItemData[i] = list[i].qty;
          }
        }
      });

  }

  showFavouriteSaleCustomerLabels: any = 'show';
  public FavouriteSaleCustomerLabels: any[5] = [];
  public FavouriteSaleCustomerData: any[5] = [];
  public FavouriteSaleCustomerColors: Array<any> = [{
    backgroundColor: ['rgba(51, 204, 204,0.2)', 'rgba(255, 153, 0,0.2)', 'rgba(0, 204, 102,0.2)', 'rgba(0, 51, 204,0.2)', 'rgba(255, 0, 102,0.2)',],
    borderColor: ['rgba(51, 204, 204,1)', 'rgba(255, 153, 0,1)', 'rgba(0, 204, 102,1)', 'rgba(0, 51, 204,1)', 'rgba(255, 0, 102,1)',],
    hoverBackgroundColor: ['rgba(51, 204, 204,0.8)', 'rgba(255, 153, 0,0.8)', 'rgba(0, 204, 102,0.8)', 'rgba(0, 51, 204,0.8)', 'rgba(255, 0, 102,0.8)',]
  }];
  getFavouriteSaleCustomer() {
    this.loginService.getFavouriteSaleCustomer()
      .subscribe(response => {
        //this.FavouriteSaleCustomerLabels = ['', '', '', '', ''];
        this.FavouriteSaleCustomerData = [0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            this.FavouriteSaleCustomerLabels[i] = list[i].label;
            this.FavouriteSaleCustomerData[i] = list[i].qty;
          }
        }
      });

  }

  showFavouritePurchaseSupplierLabels: any = 'show';
  public FavouritePurchaseSupplierLabels: any[5] = [];
  public FavouritePurchaseSupplierData: any[5] = [];
  public FavouritePurchaseSupplierColors: Array<any> = [{
    backgroundColor: ['rgba(255, 255, 0,0.2)', 'rgba(255, 153, 0,0.2)', 'rgba(0, 204, 102,0.2)', 'rgba(0, 51, 204,0.2)', 'rgba(255, 0, 102,0.2)',],
    borderColor: ['rgba(255, 255, 0,1)', 'rgba(255, 153, 0,1)', 'rgba(0, 204, 102,1)', 'rgba(0, 51, 204, 1)', 'rgba(255, 0, 102,1)',],
    hoverBackgroundColor: ['rgba(255, 255, 0,0.8)', 'rgba(255, 153, 0,0.8)', 'rgba(0, 204, 102,0.8)', 'rgba(0, 51, 204,0.8)', 'rgba(255, 0, 102,0.8)',]
  }];
  getFavouritePurchaseSupplier() {
    this.loginService.getFavouritePurchaseSupplier()
      .subscribe(response => {
        //this.FavouritePurchaseSupplierLabels = ['', '', '', '', ''];
        this.FavouritePurchaseSupplierData = [0, 0, 0, 0, 0];
        if (response.json() != null) {
          var list = response.json();
          for (let i = 0; i < list.length; i++) {
            this.FavouritePurchaseSupplierLabels[i] = list[i].label;
            this.FavouritePurchaseSupplierData[i] = list[i].qty;
          }
        }
      });

  }

  // bar chart
  //////public barChartOptions: any = {
  //////    scaleShowVerticalLines: false,
  //////    responsive: true
  //////};
  //////public barChartLabels: string[] = [
  //////    '2006',
  //////    '2007',
  //////    '2008',
  //////    '2009',
  //////    '2010',
  //////    '2011',
  //////    '2012'
  //////];
  //////public barChartType: string = 'bar';
  //////public barChartLegend: boolean = true;

  //////public barChartData: any[] = [
  //////    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //////    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  //////];

  //////// Doughnut
  //////public doughnutChartLabels: string[] = [
  //////    'Download Sales',
  //////    'In-Store Sales',
  //////    'Mail-Order Sales'
  //////];
  //////public doughnutChartData: number[] = [350, 450, 100];
  //////public doughnutChartType: string = 'doughnut';

  //////// Radar
  //////public radarChartLabels: string[] = [
  //////    'Eating',
  //////    'Drinking',
  //////    'Sleeping',
  //////    'Designing',
  //////    'Coding',
  //////    'Cycling',
  //////    'Running'
  //////];
  //////public radarChartData: any = [
  //////    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
  //////    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  //////];
  //////public radarChartType: string = 'radar';

  //////// Pie
  //////public pieChartLabels: string[] = [
  //////    'Download Sales',
  //////    'In-Store Sales',
  //////    'Mail Sales'
  //////];
  //////public pieChartData: number[] = [300, 500, 100];
  //////public pieChartType: string = 'pie';

  //////// PolarArea
  //////public polarAreaChartLabels: string[] = [
  //////    'Download Sales',
  //////    'In-Store Sales',
  //////    'Mail Sales',
  //////    'Telesales',
  //////    'Corporate Sales'
  //////];
  //////public polarAreaChartData: number[] = [300, 500, 100, 40, 120];
  //////public polarAreaLegend: boolean = true;

  //////public polarAreaChartType: string = 'polarArea';

  //////// lineChart
  //////public lineChartData: Array<any> = [
  //////    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //////    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  //////    { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
  //////];
  //////public lineChartLabels: Array<any> = [
  //////    'January',
  //////    'February',
  //////    'March',
  //////    'April',
  //////    'May',
  //////    'June',
  //////    'July'
  //////];
  //////public lineChartOptions: any = {
  //////    responsive: true
  //////};
  //////public lineChartColors: Array<any> = [
  //////    {
  //////        // grey
  //////        backgroundColor: 'rgba(148,159,177,0.2)',
  //////        borderColor: 'rgba(148,159,177,1)',
  //////        pointBackgroundColor: 'rgba(148,159,177,1)',
  //////        pointBorderColor: '#fff',
  //////        pointHoverBackgroundColor: '#fff',
  //////        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //////    },
  //////    {
  //////        // dark grey
  //////        backgroundColor: 'rgba(77,83,96,0.2)',
  //////        borderColor: 'rgba(77,83,96,1)',
  //////        pointBackgroundColor: 'rgba(77,83,96,1)',
  //////        pointBorderColor: '#fff',
  //////        pointHoverBackgroundColor: '#fff',
  //////        pointHoverBorderColor: 'rgba(77,83,96,1)'
  //////    },
  //////    {
  //////        // grey
  //////        backgroundColor: 'rgba(148,159,177,0.2)',
  //////        borderColor: 'rgba(148,159,177,1)',
  //////        pointBackgroundColor: 'rgba(148,159,177,1)',
  //////        pointBorderColor: '#fff',
  //////        pointHoverBackgroundColor: '#fff',
  //////        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //////    }
  //////];
  //////public lineChartLegend: boolean = true;
  //////public lineChartType: string = 'line';

  //////// events
  //////public chartClicked(e: any): void {
  //////    // console.log(e);
  //////}

  //////public chartHovered(e: any): void {
  //////    // console.log(e);
  //////}

  //////public randomize(): void {
  //////    // Only Change 3 values
  //////    const data = [
  //////        Math.round(Math.random() * 100),
  //////        59,
  //////        80,
  //////        Math.random() * 100,
  //////        56,
  //////        Math.random() * 100,
  //////        40
  //////    ];
  //////    const clone = JSON.parse(JSON.stringify(this.barChartData));
  //////    clone[0].data = data;
  //////    this.barChartData = clone;
  //////    /**
  //////     * (My guess), for Angular to recognize the change in the dataset
  //////     * it has to change the dataset variable directly,
  //////     * so one way around it, is to clone the data, change it and then
  //////     * assign it;
  //////     */
  //////}


}
