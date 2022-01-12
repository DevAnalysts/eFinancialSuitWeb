import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TaxRateService, LoginService, Suppliers, taxRate, taxRateDetail } from '../../../../../shared';
import { TextMaskModule } from 'angular2-text-mask';
import swal from 'sweetalert';
import { TemplateBinding } from '@angular/compiler';

@Component({
  selector: 'tax-rate',
  templateUrl: './taxrate.component.html',
  styleUrls: ['./taxrate.component.scss']
})
export class TaxRateComponent implements OnInit {
  ////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  ////////////////////////////////////////

  p: number = 1;
  g: number = 1;
  modalReference: NgbModalRef;
  guid: any;
 isLoading: any = false;
  closeResult: string;
  mode: any = false;
  btnMode: any = false;
  DelayCheck: any = true;

  grid: any[] = [];

  ID: any = 0;
  taxRateDetails: any[] = [];
  titleDG: any = '';
  taxrateDG: any = 0.00;
  taxagencycodeDG: any = '';
  taxagencynameDG: any = '';
  remarksDG: any;

  taxtypeid: any = 1;
  taxrate: any = 0.00;
  title: any = '';
  remarks: any = '';
  status: any = 1;

  taxagencyList: Array<Select2OptionData> = [];
  taxagencyListR: any[] = [];
  taxagencycode: any = 0;
  taxagencyname: any = '';


  taxrateList: Array<Select2OptionData> = [];
  taxrateListR: any[] = [];
  taxratecode: any = 0;
  taxratename: any = '';

  showGroupGrid: any = 'none';
  showTaxAgency: any = '';
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  constructor(private service: TaxRateService, private LoginService: LoginService, private modalService: NgbModal) {
    this.taxRateDetails = new Array<taxRateDetail>();
  }

  ngOnInit() {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 80001) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;

          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].userSessionID;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
    this.getGrid('');
    //this.getCity();
  }
  //getGrid
  getGrid(value: string) {
    this.isLoading =true;
    this.service.getGrid(value)
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }

  //ChangeTaxType
  ChangeTaxType() {
    //alert(this.taxtypeid);
    if (this.taxtypeid == 2) {
      this.showGroupGrid = '';
      this.showTaxAgency = 'none';
      $("#taxrate").prop("disabled", true);
    }
    else {
      this.showGroupGrid = 'none';
      this.showTaxAgency = '';
      $("#taxrate").prop("disabled", false);

      this.taxrate = 0;
      this.taxratecode = 0;
      this.taxagencycode = 0;
      this.taxRateDetails = [];

    }
  }
  //getTaxAgency
  getTaxAgency() {
    this.isLoading =true;
    this.service.getTaxAgency()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.taxagencyList = this.getDropdownList(response.json(), "taxagencycode", "taxagencyname");
          this.taxagencyListR = response.json();
        }

      });
  }
  //getTaxAgencyChange
  getTaxAgencyChange(e: any) {
    this.taxagencycode = e;

  }
  //getTaxRate
  getTaxRate() {

    this.isLoading =true;
    this.service.getTaxRate()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.taxrateList = this.getDropdownListGrid(response.json(), "taxratecode", "title");
          this.taxrateListR = response.json();
        }

      });
  }
  //getTaxRateChange
  getTaxRateChange(e: any) {
    this.taxratecode = e;
    //alert(this.taxratecode);
    if (this.taxrateListR != null && this.taxratecode != 0 && this.taxtypeid == 2) {

      for (let i = 0; i < this.taxrateListR.length; i++)
        if (this.taxrateListR[i].taxratecode == this.taxratecode) {

          this.taxrateDG = this.taxrateListR[i].taxrate;
          this.titleDG = this.taxrateListR[i].title;
          this.remarksDG = this.taxrateListR[i].remarks;

          for (let j = 0; j < this.taxagencyListR.length; j++)
            if (this.taxagencyListR[j].taxagencycode == this.taxrateListR[i].taxagencycode) {
              this.taxagencycodeDG = this.taxagencyListR[j].taxagencycode;
              this.taxagencynameDG = this.taxagencyListR[j].taxagencyname;

            }
        }
    }
    else {
      this.titleDG = '';
      this.taxagencynameDG = '';
      this.taxrateDG = 0;
      this.remarksDG = '';
    }

  }
  //addGrid
  addGrid(ID) {


    if (ID > 0) {
      var serialNo = 0;
      var flag = false;
      if (this.taxRateDetails.length > 0) {
        for (var count = 0; count < this.taxRateDetails.length; count++) {
          if (this.taxRateDetails[count].taxRateID == ID) {
            flag = true;
            serialNo = count + 1;
            break;
          }
        }
      }
      if (flag == false) {
        this.taxRateDetails.push(new taxRateDetail(0, 0, ID, this.titleDG, this.taxrateDG, this.taxagencycodeDG, this.taxagencynameDG, this.remarksDG, 0));
        this.sumGridDetailTaxRate();
        this.taxratecode = 0;
      }
      else {
        swal("Already Exists At Sr # " + serialNo);
        return;
      }
    }
    else {
      $("#submitAdd").prop("disabled", true);
      swal("Select Tax Rate!");
      return;
    }

  }
  //changeMode
  changeMode(idx: any, i: taxRateDetail, Mode: any) {
    console.log(i);
    var flag = false;
    if (this.taxRateDetails.length > 0) {
      for (var count = 0; count < this.taxRateDetails.length; count++) {
        if (this.taxRateDetails[count].taxRateID == i.taxRateID && idx != count) {
          flag = true;

          break;
        }
      }
    }


    //if (!flag) {
    if (Mode == 0) {

      i.edit_Mode = false;
      i.taxRateID = this.taxratecode;
      i.taxRateNAME = this.taxratename;
      i.taxRate = this.taxrateDG;
      i.taxAgencyID = this.taxagencycodeDG;
      i.taxAgencyNAME = this.taxagencynameDG;
      i.remarks = this.remarksDG;


      this.taxratecode = 0;

      this.sumGridDetailTaxRate();
      $("#AddNewItemRow").show();
      this.EditItemButton = '';
      this.RemoveItemButton = '';
      return;
    }
    else if (Mode == 2) {
      console.log("Index : " + idx + "--- Page :" + this.g);
      this.taxRateDetails.splice(idx, 1);
      this.taxratecode = 0;

    }
    else {
      i.edit_Mode = true;
      this.taxratecode = i.taxRateID;

      if (this.taxrateListR != null && this.taxratecode != 0 && this.taxtypeid == 2) {

        for (let i = 0; i < this.taxrateListR.length; i++)
          if (this.taxrateListR[i].taxratecode == this.taxratecode) {

            this.taxrateDG = this.taxrateListR[i].taxrate;
            this.titleDG = this.taxrateListR[i].title;
            this.remarksDG = this.taxrateListR[i].remarks;

            for (let j = 0; j < this.taxagencyListR.length; j++)
              if (this.taxagencyListR[j].taxagencycode == this.taxrateListR[i].taxagencycode) {
                this.taxagencycodeDG = this.taxagencyListR[j].taxagencycode;
                this.taxagencynameDG = this.taxagencyListR[j].taxagencyname;

              }
          }
      }
    }

    if (Mode == 1) {
      $("#AddNewItemRow").hide();
      this.EditItemButton = 'disabled';
      this.RemoveItemButton = 'disabled';
    }
    else {
      $("#AddNewItemRow").show();
      this.EditItemButton = '';
      this.RemoveItemButton = '';
    }

    //}






  }

  //clearFields
  clearFields() {
    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;
    this.taxtypeid = 1;
    this.taxrate = 0.00;
    this.title = '';
    this.taxagencycode = 1;
    this.remarks = '';


    this.ChangeTaxType();
    this.getTaxAgency();
    this.getTaxRate();

  }
  //saveData
  saveData() {

    if (this.title != "") {

      if (this.taxrate > 0) {

        if (this.taxtypeid == 1) {
          this.taxRateDetails = [];
          this.taxRateDetails.push(new taxRateDetail(0, 0, 0, '', this.taxrate, this.taxagencycode, '', this.remarks, 0));
        }

        if (this.taxRateDetails != null) {
          var data = new taxRate(0, this.title, this.taxrate, this.taxtypeid, this.remarks, this.status, this.guid, this.logedInUserID, this.taxRateDetails);
          console.log(data);

          this.service.saveData(data).then(
            (response) => {
              this.getGrid('');
              this.modalReference.close();
              console.log(response);
            },
            (error) => console.log(error))
        }
        else {
          swal("Insert Tax Rate Detail.");
        }
      }
      else
        swal("Tax Rate must be Greater than Zero.");
    }
    else
      swal("Title must be defined.");
  }
  //updateData
  updateData() {

    if (this.taxtypeid == 1) {
      this.taxRateDetails = [];
      this.taxRateDetails.push(new taxRateDetail(0, 0, 0, '', this.taxrate, this.taxagencycode, '', this.remarks, 0));
    }

    var data = new taxRate(this.ID, this.title, this.taxrate, this.taxtypeid, this.remarks, this.status, this.guid, this.logedInUserID, this.taxRateDetails);
    console.log(data);


    if (this.title != "") {

      this.service.updateData(data).then(
        (response) => {
          this.getGrid('');
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))

    }
    else
      swal("Supplier name must be define.");


  }
  //getDetailsByID
  getDetailsByID(ID, content) {

    this.open(content);
    this.mode = true;
    this.btnMode = false;

    this.getTaxAgency();
    this.getTaxRate();

    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe((o: taxRate) => {

        this.ID = ID;
        this.title = o.title;
        this.taxrate = o.taxRate;
        this.status = o.status;
        this.remarks = o.remarks
        this.taxtypeid = o.taxTypeID;
        this.isLoading = false;

        if (this.taxtypeid == 2) {
          this.showGroupGrid = '';
          this.showTaxAgency = 'none';
          $("#taxrate").prop("disabled", true);

          this.isLoading =true;
          this.service.getGroupGridDetailsByID(ID)
            .subscribe(response => {
              this.isLoading = false;
              this.taxRateDetails = (response.json());
            });
        }
        else {
          this.showGroupGrid = 'none';
          this.showTaxAgency = '';
          $("#taxrate").prop("disabled", false);

        }


      });

  }

  //open Model
  open(content) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.clearFields();
  }
  //getDismissReason
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      arr.forEach(
        function (obj) {
          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    return ar;
  }
  // convert dropdown lables
  getDropdownListGrid(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      ar.push({
        id: 0,
        text: ''
      });
      arr.forEach(
        function (obj) {
          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    return ar;
  }
  //getTaxType
  getTaxType(d): any {
    let Res = '';
    if (d != null) {
      switch (d) {
        case 1:
          Res = "Individual Sales Tax";
          break;
        case 2:
          Res = "Group Sales Tax";
          break;

        default:
      }

    }
    return Res;

  }
  //sumGridDetailTaxRate
  sumGridDetailTaxRate() {
    if (this.taxRateDetails != null) {
      var sum = 0;
      for (let i = 0; i < this.taxRateDetails.length; i++)
        sum += this.taxRateDetails[i].taxRate;
    }
    this.taxrate = sum.toFixed(2);
  }
  //changeTaxRate
  changeTaxRate() {
    if (this.taxrate < 0)
      this.taxrate = 0;
  }
}










