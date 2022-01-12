
import { Component, OnInit, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { NgbModal,  NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ItemModelService, PermissionUtility, CustomerDiscountService, cDate, NgbDateFRParserFormatter,  LoginService } from '../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';

//import { routerTransition } from '../../router.animations';
@Component({
  selector: 'customer-discount',
  templateUrl: './customer-discount.component.html',
  styleUrls: ['./customer-discount.component.scss'],
  //  styles: [`
  //    :host >>> .nav.nav-pills.flex-column{  display: -webkit-inline-box;margin-right:0px;width:25.3%;}
  //    :host >>> .HT2 .tab-content {border: 2px solid #ffc107;box-shadow: -2px 5px 10px 1px rgba(0,0,0,.176);width:74.5%;float: right;overflow-y: auto;overflow-x: hidden}
  //    :host >>> .dropdown-toggle::after {display: none;}
  //    :host >>> li:hover {background: #90909038 !important;
  //}
  //    `],
  //animations: [routerTransition()],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CustomerDiscountComponent implements OnInit {
     
   p: number = 1; 
  isLoading: any = false;
  // alerts: Array<any> = [];
  // mode: any = false;
  // btnmode: any = false;
       
  @Input()
  modeldata: any[] = [];

  @Input()    
  customerid: any = 0;
  @Input()
  customername: any = '';

 
  //////////////////////// 
  models: any[] = [];
  filtermodels: any[] = [];

  brandnames: any[] = [];
  
  brandid: any = 0; 
  brandname: any = "";
   
  selectedAll: any;
  chk: any = false;

  logedInUserID: any = 0;

  @Output() newItemEvent = new EventEmitter<any[]>();

  //addNewItem(value: any[] ) {
  //  this.newItemEvent.emit(this.models);
  //}

  public commonUtility: PermissionUtility;



  constructor(public router: Router, private modelservice: ItemModelService, private LoginService: LoginService, private service: CustomerDiscountService, private modalService: NgbModal) {
    this.commonUtility = new PermissionUtility();
    this.models = [];
    this.brandid = 0;
    this.brandname = '';
  }

  ngOnInit() {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    //this.customerid = sessionStorage.getItem('mcustomer_ID');
    //this.customername = sessionStorage.getItem('mcustomer_Name');
    this.getBrands();

    ////////////////////////Set Name From Session Storage///////////////////////////
    this.commonUtility.setPagePermissions(110088);

  }



  //selectAll
  selectAll() {
    //for (var i = 0; i < this.models.length; i++) { 
    //  this.models[i].status = this.selectedAll;
    //  //if (this.models[i].status == true) {
    //  //  this.modelid = this.models[i].modelid;
    //  //  this.dicsountedmodels.push(this.modelid);
    //  //}
    //}
  }
  //checkIfAllSelected
  updateValues(i: any) {
    var idx = this.models.findIndex(m => m.modelid == i.modelid);
    this.models[idx].discountrate = i.discountrate;
    this.models[idx].customerrid = this.customerid;
    this.models[idx].createdby = this.logedInUserID;
     
  }


  //getBrands
  getBrands() {
    this.brandnames = [];
    this.brandid = 0;
    this.brandname = '';
    this.modelservice.getBrands()
      .subscribe(response => {
        this.brandnames = response.json();
        if(this.brandnames!==null){
        this.brandid = this.brandnames[0].brandid;
        this.brandname = this.brandnames[0].brandname;
        this.getModels();
        }
      });
  }
  getModels() {
    this.service.getModels(this.customerid)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() !== null) {
          this.models = (response.json());

          this.filtermodels = this.models.filter(m => m.brandid == this.brandid);

          this.models[0].customerid = this.customerid;

          // if (this.models[0].brandid == 0)
          this.models[0].brandid = this.brandid;

          this.models[0].createdby = this.logedInUserID;
        }
        else {
          this.models = [];
        }
      //  this.newItemEvent.emit(this.models);

      });
  }     

  emitValue(i: any) {
  // this.id = brandid;
    this.filtermodels = this.models.filter(m => m.brandid == this.brandid);
   
  }

  changeRate(i: any) {

    var idx = this.models.findIndex(m => m.modelid == i.modelid);
    this.models[idx].discountrate = i.discountrate;
    this.models[idx].brandid = this.brandid;
    this.models[idx].customerid = this.customerid;
    this.models[idx].createdby = this.logedInUserID;
    this.models[idx].status = i.status;

    this.newItemEvent.emit(this.models);
  }
  //saveData
  saveData() {
    this.isLoading = true;


    //var data = new customerrDiscount(0, this.pricelistcode, this.item);
    console.log(this.models);
    this.service.saveData(this.models, this.customerid).then(
      (response) => {
        this.isLoading = false;
        swal('Saved!'); 
        
        this.getBrands();

      },

      (error) => console.log(error)
    )

  }

}


