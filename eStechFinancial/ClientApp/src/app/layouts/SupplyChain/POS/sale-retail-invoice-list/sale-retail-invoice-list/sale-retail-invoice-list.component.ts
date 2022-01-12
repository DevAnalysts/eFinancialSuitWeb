
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { SaleOrderService, LoginService, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'sale-retail-invoice-list',
  templateUrl: './sale-retail-invoice-list.component.html',
  styleUrls: ['./sale-retail-invoice-list.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SaleRetailInvoiceListComponent implements OnInit {

  ////////////////////////////////////////
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;
  order_ID: any = "";
  order: any;
  orders: any[];
  p: number = 1;
  g: number = 1;
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;
  isLoading: boolean;
  public PermissionUtility: PermissionUtility = new PermissionUtility();

  constructor(
    public router: Router,
    private service: SaleOrderService,
    private LoginService: LoginService
  ) {
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  }
  //ngOnInit
  ngOnInit() {
    this.searchSaleOrders('');
    this.PermissionUtility.setPagePermissions(140051);
    this.PermissionUtility.setPermissionItem1(140105);
    this.PermissionUtility.setPermissionItem2(140014);
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //searchOrderDetails
  searchSaleOrders(value: string) {
    this.isLoading = true;
    this.service.searchDirectSaleOrders(value, this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        this.order = (response.json());
        console.clear();
        console.log(this.order);
      });
  }
  //routeInvoice
  routeInvoice(sale_Invoice_ID, value) { 
    if (value == 0) {
      sessionStorage.setItem('sale_Order_ID', sale_Invoice_ID);
      this.router.navigate(['/sale-retail-invoice-edit']);
    }
    else {
      if (value == 1)
        if (sessionStorage.getItem('AllowSchemeScreen') != "0")
          this.router.navigate(['/order-schemes']);
        else
          this.router.navigate(['/order-scheme']);
      else if (value == 3) {
        this.router.navigate(['/sale-retail-invoice']);
      }
      else
        this.router.navigate(['/sale-order-import']);
    }
  }

}
