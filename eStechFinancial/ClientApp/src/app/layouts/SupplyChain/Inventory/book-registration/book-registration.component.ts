import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BookRegistrationService, SearchFilterService, Items, Books, priceList, SupplierService, Suppliers,  LoginService, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'book-registration',
  templateUrl: './book-registration.component.html',
  styleUrls: ['./book-registration.component.scss'],

})
export class BookRegistrationComponent implements OnInit {
  ////////////////////////////////////////
  public permissionUtility:PermissionUtility=new PermissionUtility()
  
  logedInUserID: any = 1;
  UserSessionID: any = 0; 

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  p: number = 1;
  modalReference: NgbModalRef;
  modalReference2: NgbModalRef;
  books: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  measurementTypies: any[] = [];
  packingTypies: any[] = [];
 isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;

  bookcode: any;
  bookname: any = "";
  barcode: any = "";
  categorycode: any = 0;
  categoryname: any = '';
  subcategorycode: any = 0;
  subcategoryname: any = '';
  subject: any[] = [];
  selectedsubjects = [];
  subjectid: any = 0;
  subjectname: any = '';
  item_Code: any = '';

  isbn: any = '';
  writer: any = '';
  noofpages: any = 0;
  publishers: Array<Select2OptionData>;
  publishercode: any = 0;
  publishername: any = '';
  yearpublished: any = 2018;
  country: any[] = [];
  countrycode: any = 0;
  countryname: any = '';
  edition: any = 1;
  requantity: any = 0;
  remarks: any = "";
  cost: any = 0;
  saleprice: any = 0;
  discount: any = 0;
  taxable: any = 0;
  taxtype: any[] = [];
  taxtypeid: any = 1;
  taxtypename: any = '';
  statuscheckbox: any = 1;
  disabletaxtype: any = '';

  settings = {
    enableCheckAll: 'false',
    limitSelection: '10',
    enableSearchFilter: true,
    // text: 'Select Subject',
    //classes: 'custom-class',
  };
  temparr = [];

  priceList: any[] = [];
  priceListID: any = 1;
  priceListName: any = '';
  //salePrice: any = '';

  constructor(
    private service: BookRegistrationService,
    private LoginService: LoginService,
    private searchfilter: SearchFilterService,
    private SupplierService: SupplierService,
    private modalService: NgbModal) {
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getBooks();
    this.getTaxTypes();
    this.permissionUtility.setPagePermissions(110609);
    this.logedInUserID = this.service.getSession('user_ID'); 
    }
  //getBooks
  getBooks() {
    this.isLoading =true;
    this.service.getBooks()
      .subscribe(response => {
        if (response.json() != null) {
          this.books = (response.json());
          console.log(this.books);
          this.isLoading = false;
        }
        //  console.log(response.json());
      });
  }
  //searchBookDetails
  searchBookDetails(value: string) {
    this.service.searchBookDetails(value)
      .subscribe(response => {
        this.books = (response.json());
      });
  }
  //getFills
  getFills() {
    this.getCategories();
    this.enableSupplierDropDown();
    this.getCountry();
    this.getSubject();
  }
  //getCategories
  getCategories() {
    this.isLoading =true;
    this.service.getCategories()
      .subscribe(response => {
        if (response.json() != null) {
          this.categories = (response.json());
          this.categorycode = this.categories[0].categorycode;
          this.categoryname = this.categories[0].categorycode;
          this.changeCategories(this.categorycode);
          this.isLoading = false;
        }
        //  console.log(response.json());
      });
  }
  //getSubCategories
  changeCategories(categorycode) {
    this.service.getSubCategories(categorycode)
      .subscribe(response => {
        if (response.json() != null) {
          this.subcategories = (response.json());
          this.subcategorycode = this.subcategories[0].subcategorycode;
          this.subcategoryname = this.subcategories[0].subcategoryname;
          // console.log(response.json());
        }
      });
  }
  //getSubject
  getSubject() {
    this.service.getSubject()
      .subscribe(response => {
        if (response.json() != null) {
          this.subject = this.getDropdownMultiSelectList(response.json(), 'subjectcode', 'subjectname');
        }
        //console.log(response.json());
      });
  }
  //getPublisher
  getPublisher() {
    this.isLoading =true;
    this.service.getPublisher()
      .subscribe(response => {
        if (response.json() != null) {
          this.publishers = this.getDropdownList(response.json(), "publishercode", "publishername");
          this.publishercode = this.publishers[0].id;
          this.publishername = this.publishers[0].text;
        }
      });
  }
  //getPublisherChange
  getPublisherChange(e: any) {
    if (this.sessionEnableTextboxSupplier != 1) {
      this.publishercode = e;
    }
    //alert(this.customerid);   
  }
  //getCountry
  getCountry() {
    this.isLoading =true;
    this.service.getCountry()
      .subscribe(response => {
        if (response.json() != null) {
          this.country = (response.json());
          this.countrycode = this.country[0].countrycode;
          this.countryname = this.country[0].countryname;
          this.isLoading = false;
        }
      });
  }
  //getTaxTypes
  getTaxTypes() {
    this.service.getTaxTypes()
      .subscribe(response => {
        if (response.json() != null) {
          this.taxtype = (response.json());
          this.taxtypeid = this.taxtype[0].taxtypeid;
          this.taxtypename = this.taxtype[0].taxtypename;
        }
    /*     console.log('taxtypes',response.json())*/;
      });
  }
  //multiPriceList
  multiPriceList() {
    if (this.LoginService.getSession('settingAllowPriceList') != '1')
      $("#allowPriceList").hide();
    else {
      $("#allowPriceList").show();
      this.getPriceList();
    }
  }
  //getPriceList
  getPriceList() {
    this.service.getPriceList(this.bookcode, this.mode)
      .subscribe(response => {
        if (response.json() != null) {
          this.priceList = (response.json());
        
          if (this.priceList != null) {
          this.priceListID = this.priceList[0].priceListID;
          this.priceListName = this.priceList[0].priceListName;
          if (this.mode == false) {
            for (let i = 0; i < this.priceList.length; i++) {
              this.priceList[i].sale_Price = this.saleprice;
            }
          }
          //else
          //  //this.salePrice = this.priceList[0].sale_Price;
          }
        }
      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);



    this.bookname = '';
    this.barcode = '';
    this.selectedsubjects = [];
    this.subjectid = 0;
    this.isbn = '';
    this.writer = '';
    this.noofpages = 0;
    this.yearpublished = 2018;
    this.edition = 1;
    this.requantity = 0;
    this.remarks = '';
    this.cost = 0;
    this.saleprice = 0;
    this.discount = 0;
    this.taxable = 0;
    this.statuscheckbox = 1;
    this.getTaxTypes();
    this.getFills();
    this.multiPriceList();
  }
  //IfExists
  IfExists(bookcode) {
    this.service.IfExists(bookcode)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //saveItem
  saveBook(bookname, barcode, categorycode, subcategorycode, subjectcode, isbn, writer, noofpages, publishercode, yearpublished, countrycode, edition, requantity, remarks, statuscheckbox, cost, saleprice, discount, taxable, taxtypeid) {

    if (bookname != '') {
      if (this.publishercode > 0) {
        if (this.selectedsubjects.length >= 1) {
          this.subjectid = this.selectedsubjects[0].id;
          var item = new Books(0, bookname, barcode, categorycode, subcategorycode, this.subjectid, isbn, writer, noofpages, publishercode, yearpublished, countrycode, edition, requantity, remarks, statuscheckbox, cost, saleprice, discount, taxable, taxtypeid, this.logedInUserID, this.UserSessionID,this.guid,  this.selectedsubjects, this.priceList);
          console.log('object', item);
          this.service.saveItem(item).then(
            (response) => { this.getBooks(); this.modalReference.close(); this.clearFields(); },//swal("Saved!") },
            (error) => console.log(error))
        }
        else {
          swal("Select 1 Subject!")
        }
      }
      else {
        swal('Please Select Publisher!')
      }
    }
    else {
      swal("Enter Book Name!")
    }
  }
  //updateItem
  updateItem(bookname, barcode, categorycode, subcategorycode, subjectcode, isbn, writer, noofpages, publishercode, yearpublished, countrycode, edition, requantity, remarks, statuscheckbox, cost, saleprice, discount, taxable, taxtypeid) {
    if (bookname != '') {
      if (this.publishercode > 0) {
        if (this.selectedsubjects.length > 0) { //Updating Subjects With Changes In Subjects Control via selectedsubjects
          this.subjectid = this.selectedsubjects[0].id;
          var item = new Books(this.bookcode, bookname, barcode, categorycode, subcategorycode, this.subjectid, isbn, writer, noofpages, publishercode, yearpublished, countrycode, edition, requantity, remarks, statuscheckbox, cost, saleprice, discount, taxable, taxtypeid, this.logedInUserID, this.UserSessionID,this.guid,  this.selectedsubjects, this.priceList);
          console.log('selectedsubjects', item, this.selectedsubjects);
          this.service.updateItem(item).then(
            (response) => { this.getBooks(); this.modalReference.close(); },// swal("Updated!") },
            (error) => console.log(error))
        }
        else if (this.temparr.length > 0) { //Updating Subjects Without Changes In Subjects Control via Temparr
          this.subjectid = this.temparr[0].id;
          var item = new Books(this.bookcode, bookname, barcode, categorycode, subcategorycode, this.subjectid, isbn, writer, noofpages, publishercode, yearpublished, countrycode, edition, requantity, remarks, statuscheckbox, cost, saleprice, discount, taxable, taxtypeid, this.logedInUserID, this.UserSessionID,this.guid, this.temparr, this.priceList);
          console.log('temparr', item, this.temparr);
          this.service.updateItem(item).then(
            (response) => {
              this.getBooks(); this.modalReference.close();
            }, // swal("Updated!") },
            (error) => console.log(error))
        }
        else {
          swal("Enter 1 Subject")
        }
      }
      else {
        swal("Please Select Publisher!")
      }
    }
    else {
      swal("Enter Book Name!")
    }



  }
  //getDetailsByID
  getDetailsByID(bookcode, content) {

    if (this.LoginService.getSession('EnableSupplierSearchDropDown') != '1') {
      $("#DropDownSupplierSearch").hide();
      this.sessionEnableTextboxSupplier = 0;
    }
    else {
      $("#DropDownSupplierSelect2").hide();
      this.sessionEnableTextboxSupplier = 1;
      this.SearchSupplierDropDown('');
    }

    this.mode = true;
    this.btnmode = false;
    this.service.getDetailsByID(bookcode)
      .subscribe((o: Books) => {
        this.getFills();
        this.bookcode = o.item_Code;
        this.bookname = o.item_Name;
        this.barcode = o.barcode;
        this.service.getCategories()
          .subscribe(response => {
            this.categories = (response.json());
            this.categorycode = o.categorY_CODE;
            this.service.getSubCategories(this.categorycode)
              .subscribe(response => {
                this.subcategories = (response.json());
                this.subcategorycode = o.subcategorY_CODE;
              });
          });
        this.isbn = o.isbn;
        this.writer = o.writer;
        this.noofpages = o.noofpages;
        this.service.getPublisher()
          .subscribe(response => {
            this.publishers = this.getDropdownList(response.json(), "publishercode", "publishername");
            if (this.sessionEnableTextboxSupplier != 1) {
              this.publishercode = o.supplieR_ID;
            }
            else {
              for (let i = 0; i < this.publishers.length; i++) {
                if (this.publishers[i].id == o.supplieR_ID) {
                  this.textboxSupplierID = this.publishers[i].id;
                  this.publishercode = this.publishers[i].id;
                  this.textboxSupplierName = this.publishers[i].text;

                }
              }
            }

          });
        this.yearpublished = o.yearPublished;
        this.countrycode = o.country_Id;
        this.edition = o.edition
        this.requantity = o.reorder_Quantity;
        this.remarks = o.remarks;
        this.cost = o.cost;
        this.saleprice = o.uniT_PRICE;
        this.discount = o.costDiscount;
        this.taxable = o.taxable;
        this.taxtypeid = o.taxtypeid;
        this.statuscheckbox = o.status;
        this.disableTaxType(this.taxable);
        this.getSubjectByID(this.bookcode);
        this.getPriceList();
      });

    this.openDetail(content);
  }
  //getSubjectByID
  getSubjectByID(bookcode) {
    this.service.getSubjectByID(bookcode)
      .subscribe(response => {
        if (response != null) {
          this.temparr = response.json();
          this.selectedsubjects = response.json();
          //console.log(this.selectedsubjects, this.temparr)
        }
      });

  }
  //diasbletaxtypedropdown
  disableTaxType(taxable) {

    if (taxable != 0) {
    }
    else {
      this.taxtypeid = 1;
    }
  }
  // open modal
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
  //openDetail modal
  openDetail(content) {
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
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
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
  getDropdownMultiSelectList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      arr.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            itemName: obj[displaytxt]
          });

        });
    }
    return ar;
  }
  onSubjectSelect(subject: any) {
    //console.log(subject, this.selectedsubjects);
  }
  OnSubjectDeSelect(subject: any) {
    this.temparr = [];
    console.log('cleared',this.temparr)
  }

  sessionEnableTextboxSupplier = 0;
  textboxSupplierID: any = 0;
  textboxSupplierName: any = '';
  textboxSupplierSearch: any = '';
  searchGridSupplier: any[] = [];
  searchGridSupplierTemp: any[] = [];

  enableSupplierDropDown() {
    //alert(this.LoginService.getSession('EnableSupplierSearchDropDown'));
    if (this.LoginService.getSession('EnableSupplierSearchDropDown') != '1') {
      $("#DropDownSupplierSearch").hide();
      this.sessionEnableTextboxSupplier = 0;
      this.getPublisher();
    }
    else {
      $("#DropDownSupplierSelect2").hide();
      this.sessionEnableTextboxSupplier = 1;
      this.SearchSupplierDropDown('');
    }
  }
  SearchSupplierByID(Query) {
    this.textboxSupplierSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchSupplierByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedSupplier(List[0].id, List[0].name)
        }
        else {
          //alert('Here');
          this.publishercode = 0;
          this.textboxSupplierID = 0;
          this.textboxSupplierName = '';
          //this.contacts = [];
          //this.contact_ID = 0;

        }
        this.isLoading = false;
      });

  }
  SearchSupplierDropDown(Query) {

    this.searchGridSupplier = [];
    console.log('Query', Query);
    this.isLoading =true;
    this.searchfilter.SearchSupplierDropDown(Query)
      .subscribe(response => {
        if (this.searchGridSupplier != null) {
          this.searchGridSupplier = (response.json());

          if (this.searchGridSupplierTemp.length <= 0) {
            this.searchGridSupplierTemp = this.searchGridSupplier;
          }
        }
        this.isLoading = false;
      });

  }
  setSupplierSearchFocus() {
    var timer = setTimeout(() => $("#textboxSupplierSearch").focus(), 500);

  }
  setSelectedSupplier(ID, Name) {
    console.log(ID, Name);
    this.textboxSupplierID = ID;
    this.publishercode = ID;
    this.textboxSupplierName = Name;

    this.textboxSupplierSearch = '';
    this.searchGridSupplier = this.searchGridSupplierTemp;



  }

  addSupplierName: any = '';
  addSupplierCell: any = '';
  addSupplierEmail: any = '';
  addSupplierPhone: any = '';
  addSupplierAddress: any = '';
  addSupplierStatus: any = 1;

  city: any[] = [];
  citycode: any = 0;
  cityname: any = '';


  //getCity
  getCity() {
    this.isLoading =true;
    this.SupplierService.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        this.citycode = this.city[0].id;
        this.cityname = this.city[0].text;
        this.isLoading = false;
      });
  }
  //getCustomerChange
  getCityChange(e: any) {
    this.citycode = e;
  }
  //SupplierAddNew
  SupplierAddNew(content) {
    this.addSupplierName = '';
    this.addSupplierCell = '';
    this.addSupplierPhone = '';
    this.addSupplierAddress = '';
    this.addSupplierEmail = '';
    this.addSupplierStatus = 1;

    this.checkEmail = true;
    this.checkPhone = true;
    this.checkContactCell = true;
    this.checkContactPhone = true;

    this.city = [];
    this.citycode = 0;
    this.cityname = '';

    this.getCity();
    //this.getCategory();
    this.openSupplierAddNew(content);

  }
  //openSupplierAddNew
  openSupplierAddNew(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, size: 'sm', windowClass: 'my-modal'
    };

    this.modalReference2 = this.modalService.open(content, { size: 'xlg' });
    this.modalReference2.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    $("#SaveNewSupplier").prop("disabled", true);
    var timer = setTimeout(() => $("#addSupplierName").focus(), 500);

  }
  //saveSupplier
  saveSupplier() {

    if (this.addSupplierName != "") {

      if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.addSupplierCell == '') {
        swal("Cell number must be defined.")
      }
      else {

        var supplier = new Suppliers(0, this.addSupplierName, null, 0, this.addSupplierName, this.addSupplierPhone, this.addSupplierCell, this.addSupplierCell, this.addSupplierPhone, '', '', this.addSupplierEmail, '', 0, 1, 1, 1, 1, 1, 0, 1, '', 0, 0, this.guid, 0, this.addSupplierAddress, '' , '', this.citycode, 1, 1, this.addSupplierStatus, this.logedInUserID, this.UserSessionID);
        console.log(supplier);
        this.isLoading = true
        this.SupplierService.saveSupplier(supplier).then(
          (response) => {
            var list = response;
            this.service.getPublisher()
              .subscribe(response => {
                this.publishers = this.getDropdownList(response.json(), "publishercode", "publishername");
                this.setSelectedSupplier(list[0].supplier_ID, list[0].supplier_ID + ' : ' + list[0].supplier_Name);
              });       

            this.modalReference2.close();
            console.log(response);
          },
          (error) => console.log(error))

      }

    }
    else {
      swal("Supplier name must be define.");
    }

  }
  checkEmail: any = true;
  checkPhone: any = true;
  checkContactCell: any = true;
  checkContactPhone: any = true;
  checkDisableStatus() {

    if (this.addSupplierName != ''
      && this.checkEmail != false
      && this.checkContactCell != false
      && this.checkContactPhone != false) {
      $("#SaveNewSupplier").prop("disabled", false);
    }
    else {
      $("#SaveNewSupplier").prop("disabled", true);
    }

  }
  checkSupplierCell(cell) {
    if (cell != '') {
      this.isLoading =true;
      this.SupplierService.contactCellExists(cell)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactCell = false;
            this.checkDisableStatus();
            swal('Cell Already Exist');
          }
          else {
            this.checkContactCell = true;
            this.checkDisableStatus();
          }


        });
    }
    else {

      if (this.LoginService.getSession('MandatoryCellNo') != '1') {
        this.checkContactCell = true;
        this.checkDisableStatus();
      }
      else {
        this.checkContactCell = false;
        this.checkDisableStatus();
        swal('Enter Cell No');
      }
    }
  }
  checkSupplierPhone(phone) {
    if (phone != '') {
      this.isLoading =true;
      this.SupplierService.contactCellExists(phone)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactPhone = false;
            this.checkDisableStatus();
            swal('Phone Already Exist');

          }
          else {
            this.checkContactPhone = true;
            this.checkDisableStatus();
          }

        });
    }
    else {
      this.checkContactPhone = true;
      this.checkDisableStatus();
    }
  }
  checkSupplierEmail(email) {
    if (email != '') {
      this.isLoading =true;
      this.SupplierService.emailExists(email)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkEmail = false;
            this.checkDisableStatus();
            swal('Email Already Exist');
          }
          else {
            this.checkEmail = true;
            this.checkDisableStatus();
          }
        });
    }
    else {
      this.checkEmail = true;
      this.checkDisableStatus();
    }
  }
}
