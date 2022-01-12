import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SmsAlertService, SmsAlert, LoginService, SearchFilterService, cDate, NgbDateFRParserFormatter, CommonUtility } from '../../../shared';
import { SearchFilter1Service } from '@shared/services/SearchFilter/search-filter1.service';
@Component({
  selector: 'sms-alert',
  templateUrl: './sms-alert.component.html',
  styleUrls: ['./sms-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { '(window:keydown)': 'hotkeys($event)' },
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SmsAlertComponent implements OnInit {
  public commonUtility: CommonUtility = new CommonUtility();

  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  public mask = [/[0-3]/, /\d/, '/', /[0-1]/, /[1-9]/, '/', /[1-2]/, /\d/, /\d/, /\d/] //Date
  p: number = 1;
  a: number = 1;
  modalReference: NgbModalRef;
 isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;


  gridlist: any[] = [];
  ID: any = 0;
  category: Array<Select2OptionData> = [];
  categorycodeM: any = 0;
  categorycode: any = 0;
  categoryname: any = '';

  template: Array<Select2OptionData> = [];
  templatecodeM: any = 0;
  templatecode: any = 0;
  templatename: any = '';

  templateR: any[] = [];
  templatebody: any = '';

  customercode: any = 0;
  charactercount: any = 0;

  BookingSheetDetailList: any[] = [];



  constructor(private service: SmsAlertService, private LoginService: LoginService, private searchfilter: SearchFilter1Service, private modalService: NgbModal) {
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getGrid();
    this.logedInUserID = this.service.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    //console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 140101) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;
          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].usersessionid;
          //console.log(FUNCTIONALITY[i].page_Name)
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {

        this.gridlist = (response as any[]);
        this.isLoading = false;
        //console.log(response )

      });
  }
  //getFills
  getFills() {
    this.getCategory();
    this.getTemplate();
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();

    this.ID = 0;
    this.categorycode = 0;
    this.templatecode = 0;
    this.templatebody = '';

    this.customercode = 0;
    this.textboxCustomerID = 0;
    this.textboxCustomerName = '';

    this.charactercount = 0

    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);

    this.getFills();
  }

  //getCategory
  getCategory() {
    this.isLoading =true;
    this.service.getCategory()
      .subscribe(response => {
        this.isLoading = false;

        if (response  != null) {

          this.category = this.getDropdownList(response as any[], "categorycode", "categoryname");
          this.categorycodeM = this.category[0].id;
          this.categorycode = this.category[0].id;
          this.SearchCustomerDropDownByCategory('');
        }

      });
  }
  //changeCategory
  changeCategory(e) {
    this.categorycode = e;
    this.searchGridCustomerTemp = [];
    this.SearchCustomerDropDownByCategory('');

  }
  //getTemplate
  getTemplate() {

    this.service.getTemplate()
      .subscribe(response => {
        this.template = (response as any[] );
        if (response  != null) {


          this.template = this.getDropdownList(response as any[], "templatecode", "templatename");
          this.templatecodeM = this.template[0].id;
          this.templatecode = this.template[0].id;

          this.templateR = response as any[] ;
          if (this.templateR.length >= 1) {
            for (let i = 0; i < this.templateR.length; i++)
              if (this.templateR[i].templatecode == this.template[0].id) {
                this.templatebody = this.templateR[0].templatebody;

                this.characterCount();
              }
          }

        }

      });
  }
  //changeTemplate
  changeTemplate(e) {
    this.templatecode = e;

    for (let i = 0; i < this.templateR.length; i++) {
      if (this.templateR[i].templatecode == this.templatecode) {
        this.templatebody = this.templateR[i].templatebody;
        this.characterCount();
      }
    }
  }
  //changeTemplate
  characterCount() {
    var Length = this.templatebody.length;
    this.charactercount = Length;
  }
  //saveData
  saveData() {
    this.isLoading =true;


    var data = new SmsAlert(0, this.templatebody, this.customercode, this.categorycode, this.logedInUserID, this.UserSessionID,'','','' );
    console.log(data);
    this.service.saveData(data).then(
      (response) => {
        this.getGrid();
        this.isLoading = false;
        this.modalReference.close();
      },

      (error) => {
        // console.log(error)
        this.isLoading = false;
        this.commonUtility.handleError(error);
      })


  }
  //getDetailsByID
  getDetailsByID(ID, contentdetail) {
    //this.bookingcode = ID;
    this.mode = true;
    this.btnmode = false;
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        this.isLoading = false;
        if (response ) {
          var list = response ;
          this.ID = ID;

          this.service.getCategory()
            .subscribe(response => {
              if (response  != null) {
                this.category = this.getDropdownList(response as any[], "categorycode", "categoryname");
                this.categorycodeM = list[0].categorycode;
                this.categorycode = list[0].categorycode;
                //this.SearchCustomerDropDownByCategory('');
              }
            });

          this.templatebody = list[0].smsbody;
          this.characterCount()

          this.searchfilter.SearchCustomerByIDAndCategory(list[0].smsreceiver, list[0].categorycode)
            .subscribe(response => {
              if (response  != null) {
                var List = (response );
                this.setSelectedCustomer(List[0].id, List[0].name)
              }
              else {
                this.customercode = 0;
                this.textboxCustomerID = 0;
                this.textboxCustomerName = '';

              }
              this.isLoading = false;
            });
        }
      });

    this.openDetail(contentdetail);

  }
  //openAddModel
  open(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();

  }
  //openDetail modal
  openDetail(contentdetail) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(contentdetail, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();

  }
  //cancelAlertNotification
  cancelAlertNotification(ID) {
    this.isLoading =true;

    this.service.cancelAlertNotification(this.ID)
      .subscribe(response => {
        this.getGrid();
        this.isLoading = false;
        this.modalReference.close();
      });



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
  //hotkeys
  hotkeys(e) {

    var TRowID = $('td.active').parent().attr("id");

    if (TRowID) {
      // alert(e.keyCode);
      if (TRowID.split("-", 2)) {
        var splitted = TRowID.split("-", 2);
        if (e.keyCode == 38 && parseInt(splitted[1]) > 1) { //UP
          $('td.active').removeClass('active');
          TRowID = "#" + splitted[0] + "-" + (parseInt(splitted[1]) - 1)
          $(TRowID).eq(0).find('td').addClass('active');

        }
        if (e.keyCode == 40) { //DOWN
          $('td.active').removeClass('active');
          TRowID = "#" + splitted[0] + "-" + (parseInt(splitted[1]) + 1)
          $(TRowID).eq(0).find('td').addClass('active');

        }
        if (e.keyCode == 13) {
          //alert('here')
          TRowID = "#" + TRowID;
          var timer = setTimeout(() => $(TRowID).click(), 1000);

        }
        $("div,table").animate({
          // get the proper position of the active tr
          scrollTop: (parseInt(splitted[1]) + 1) * 25
        }, 35);

      }

    }
  }

  //////////CustomizedCustomerDropDown/////////
  textboxCustomerID: any = 0;
  textboxCustomerName: any = '';
  textboxCustomerSearch: any = '';
  searchGridCustomer: any[] = [];
  searchGridCustomerTemp: any[] = [];

  SearchCustomerByIDAndCategory(Query) {
    this.textboxCustomerSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchCustomerByIDAndCategory(Query, this.categorycode)
      .subscribe(response => {
        this.isLoading = false;
        if (response  != null) {
          var List = (response );
          this.setSelectedCustomer(List[0].id, List[0].name)
        }
        else {
          this.customercode = 0;
          this.textboxCustomerID = 0;
          this.textboxCustomerName = '';

        }

      });

  }
  SearchCustomerDropDownByCategory(Query) {

    this.searchGridCustomer = [];
    console.log('Query', Query);
    this.searchfilter.SearchCustomerDropDownByCategory(Query, this.categorycode)
      .subscribe(response => {
        if (this.searchGridCustomer != null) {
          this.searchGridCustomer = (response as any[] );
          $('td.active').removeClass('active');
          var TRowID = "#CROW-1";
          var timer = setTimeout(() => $(TRowID).eq(0).find('td').addClass('active'), 500);
          if (this.searchGridCustomerTemp.length <= 0) {
            this.searchGridCustomerTemp = this.searchGridCustomer;
            this.isLoading = false;
            //this.setSelectedCustomer(this.searchGridCustomer[0].customer_ID, this.searchGridCustomer[0].customer_Name);
          }

        }

      });

  }
  setCustomerSearchFocus() {
    var timer = setTimeout(() => $("#textboxCustomerSearch").focus(), 500);
    $('td.active').removeClass('active');
    $("#CROW-1").eq(0).find('td').addClass('active');
  }
  setSelectedCustomer(ID, Name) {

    console.log(ID, Name);
    this.textboxCustomerID = ID;
    this.customercode = ID;
    this.textboxCustomerName = Name;

    this.textboxCustomerSearch = '';
    this.searchGridCustomer = this.searchGridCustomerTemp;
    var timer = setTimeout(() => $("#templatebody").focus(), 500);
    this.isLoading = false;
  }
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

}




