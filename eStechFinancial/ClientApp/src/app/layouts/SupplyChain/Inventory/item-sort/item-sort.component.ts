import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ItemSortService, cDate, NgbDateFRParserFormatter, ItemSort, PermissionUtility } from '../../../../shared';

import { TextMaskModule } from 'angular2-text-mask';
import { Router } from '@angular/router';
import swal from 'sweetalert';
//import { routerTransition } from '../../router.animations';
@Component({
  selector: 'item-sort',
  templateUrl: './item-sort.component.html',
  styleUrls: ['./item-sort.component.scss'],
  styles: [`
    :host >>> .nav.nav-pills.flex-column{  display: -webkit-inline-box;margin-right:0px;width:25.3%;}
    :host >>> .HT2 .tab-content {border: 2px solid #ffc107;box-shadow: -2px 5px 10px 1px rgba(0,0,0,.176);width:74.5%;float: right;overflow-y: auto;overflow-x: hidden}
    :host >>> .dropdown-toggle::after {display: none;}
    :host >>> li:hover {background: #90909038 !important;
}
    `],
  //animations: [routerTransition()],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ItemSortComponent implements OnInit {
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  
  p: number = 1;
  modalReference: NgbModalRef;
 isLoading: any = false;
  alerts: Array<any> = [];
  mode: any = false;
  btnmode: any = false;
  
  ////////////////////////

  listOne: Array<string> = [];
  item: any[] = [];
  public permissionUtility:PermissionUtility=new PermissionUtility();


  constructor(public router: Router,private service: ItemSortService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.getItem();

    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissionUtility.setPagePermissions(0); 
  }


  //getItem
  getItem() {
    this.isLoading =true;
    this.service.getItem()
      .subscribe(response => {
        this.item = (response.json());
        this.listOne = [];
        for (let i = 0; i < this.item.length; i++) {
          this.listOne[i] = this.item[i].itemname;
        }

        this.isLoading = false;
        //console.log(this.customer)

      });
  }
  //createArray
  createArray() {
   
    var Array = [];

    for (let i = 0; i < this.listOne.length; i++) {
      let row = {} as SortedItem;
      if (this.listOne[i].split(":", 2)) {
        var splitted = this.listOne[i].split(":", 2);
        row.item = parseInt(splitted[0]);
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
    var data = new ItemSort(0, List);
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
            //this.service.changeCustomerStatus(ID)
            //  .subscribe(response => {
            //    this.getCustomer(this.areaid);
            //    this.isLoading = false;
            //  });
          }
        } else {
          
        }
      });

   
  }
  //
  routePage() {
    this.router.navigate(['/item-registration']);
  }
}

interface SortedItem {
  item: number;
  sort: number;
}

