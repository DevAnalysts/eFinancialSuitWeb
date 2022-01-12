import { Select2OptionData } from 'ng-select2';
import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { PurchaseOrderService, LoginService,  NgbDateFRParserFormatter,  PermissionUtility } from '../../../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'purchase-retail-invoice-list',
  templateUrl: './purchase-retail-invoice-list.component.html',
  styleUrls: ['./purchase-retail-invoice-list.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class PurchaseRetailInvoiceListComponent implements OnInit {
  ////////////////////////////////////////

  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility: PermissionUtility = new PermissionUtility();
  ////////////////////////////////////////
  public exampleData: Array<Select2OptionData>;
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

  constructor(private service: PurchaseOrderService,
    public router: Router,
    private LoginService: LoginService  ) {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
  }
  //ngOnInit
  ngOnInit() {   
    this.searchOrderDetails('');
    this.permissomUtility.setPagePermissions(80012);
  }
  //searchOrderDetails
  searchOrderDetails(value: string) {
    this.service.searchOrderDetails(value, this.userPrivilegedOffice)
      .subscribe(response => {
        this.order = (response.json());
      });
  }
    //routeInvoice
    routeInvoice(purchase_Order_ID) {   
        sessionStorage.setItem('purchase_Order_ID', purchase_Order_ID);
        this.router.navigate(['/purchase-retail-invoice-edit']);
    }

}



