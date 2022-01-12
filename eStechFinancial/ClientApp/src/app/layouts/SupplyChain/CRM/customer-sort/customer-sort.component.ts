import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomerSortService, cDate, NgbDateFRParserFormatter, CustomerSort } from '../../../../shared';
import swal from 'sweetalert';
import { TextMaskModule } from 'angular2-text-mask';
import { Router } from '@angular/router';
//import { routerTransition } from '../../router.animations';
@Component({
  selector: 'customer-sort',
  templateUrl: './customer-sort.component.html',
  styleUrls: ['./customer-sort.component.scss'],
  styles: [`
    :host >>> .nav.nav-pills.flex-column{  display:inline-flex;margin-right:0px;width:25.3%;}
    :host >>> .HT2 .tab-content {border: 2px solid #ffc107;box-shadow: -2px 5px 10px 1px rgba(0,0,0,.176);width:74.5%;float: right;overflow-y: auto;overflow-x: hidden}
    :host >>> .dropdown-toggle::after {display: none;}
    :host >>> li:hover {background: #90909038 !important;
}
    `],
  //animations: [routerTransition()],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class CustomerSortComponent implements OnInit {
  p: number = 1;
  modalReference: NgbModalRef;
 isLoading: any = false;
  alerts: Array<any> = [];
  mode: any = false;
  btnmode: any = false;
  logedInUserID: any = 1;
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  ////////////////////////

  listOne: Array<string> = [];
  customer: any[] = [];
  area: any[] = [];
  areaid: any = 1;


  constructor(public router: Router,private service: CustomerSortService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.getArea();

    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    //console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 0) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;
          //console.log(FUNCTIONALITY[i].page_Name)
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getArea
  getArea() {
    this.service.getArea()
      .subscribe(response => {
        this.area = (response.json());
        this.areaid = this.area[0].areacode;
        this.getCustomer(this.areaid);
        //console.log(this.area)

      });
  }
  //changeArea
  changeArea(ID) {
    this.areaid = ID;
    this.getCustomer(ID);
  }
  //getCustomer
  getCustomer(AreaID) {
    this.isLoading =true;
    this.service.getCustomer(AreaID)
      .subscribe(response => {
        this.customer = (response.json());
        this.listOne = [];
        for (let i = 0; i < this.customer.length; i++) {
          this.listOne[i] = this.customer[i].customername + " - " + this.customer[i].address + "  " + this.customer[i].city;
        }

        this.isLoading = false;
        //console.log(this.customer)

      });
  }
  //createArray
  createArray() {
   
    var Array = [];

    for (let i = 0; i < this.listOne.length; i++) {
      let row = {} as SortedCustomer;
      if (this.listOne[i].split(":", 2)) {
        var splitted = this.listOne[i].split(":", 2);
        row.customer = parseInt(splitted[0]);
        row.sort = i + 1;
        //var serial = i + 1;
        //row.sortorder = "A-" + this.areaid + "-S-" + serial;

        Array.push(row);
      }
    }
    //console.log(Array);
    this.saveData(Array);
  }
  //saveData
  saveData(List) {
    this.isLoading =true;
    var data = new CustomerSort(0, List);
    console.log(data);
    this.service.saveData(data).then(
      (response) => {
        this.isLoading = false;
        swal("Saved!");
      },

      (error) => console.log(error)
    )

  }
  //changeCustomerStatus
  changeCustomerStatus(String) {
    swal({
      title: "Do you really want to?",
      text: "Customer Status Will Turn Inactive!",
      icon: "warning",
      buttons: {
        cancel: {
          text: "No",
          value: false,
          visible: true,
          closeModal: true,
        },
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          closeModal: true,
        },
      },
    })
      .then((willCancel) => {
        if (willCancel) {
          swal("Poof! Customer Status Changed To InActive!", {
            icon: "success",
          });
          this.isLoading =true;
          console.log(String);
          if (String.split(":", 2)) {
            var splitted = String.split(":", 2);
            var ID = parseInt(splitted[0]);
            this.service.changeCustomerStatus(ID)
              .subscribe(response => {
                this.getCustomer(this.areaid);
                this.isLoading = false;
              });
          }
        } else {
          
        }
      });

   
  }
  //
  routePage() {
    this.router.navigate(['/customer']);
  }
}

interface SortedCustomer {
  customer: number;
  sort: number;
}

