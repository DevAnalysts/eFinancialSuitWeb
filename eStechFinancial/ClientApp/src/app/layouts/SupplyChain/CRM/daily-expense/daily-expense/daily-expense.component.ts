import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DailyExpenseService, LoginService, DayEndService, DailyExpense, dailyExpenseDetail, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'daily-expense',
  templateUrl: './daily-expense.component.html',
  styleUrls: ['./daily-expense.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DailyExpenseComponent implements OnInit, AfterViewChecked {
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  modalReference: NgbModalRef;
  expense: any[] = [];
  expenseType: any[] = [];
  expenseTypeDrop: any[] = [];
  changeType: any[] = [];
  dailyExpenseDetail: any[];
  editMode = false;
  index = 1;
  dailyID: any;
  typeID: any = "";
  name: any = "";
  totalAmount: any = 0;
  amount: any = 0;
  id: any = "";
  public calenderDate = new cDate();
  public dayEndDate = new cDate();
  remarks: any = "";
  decription: any = "";
  guid: any;
  mode: any = 0;
 isLoading: any = false;
  alerts: Array<any> = [];
  dayEndDetail: any[] = [];
  guidOrder: boolean;
  closeResult: string;

  editdisable: any = ''
  removedisable: any = ''
  
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  public permissomUtility:PermissionUtility=new PermissionUtility();  
  //End Member Variables
  //public alerts: Array<IAlert> = [];
  //private backup: Array<IAlert>;


  constructor(private service: DailyExpenseService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.dailyExpenseDetail = new Array<dailyExpenseDetail>();
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  //ngOnInit
  ngOnInit() {
    this.getCurrentDay();
    this.expenseDetails(this.id);
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(110076);  
  }
  //getCurrentDay
  getCurrentDay() {
    //this.DayEndService.getCurrentDay(this.userCurrentOffice)
    //  .subscribe(response => {
    //    this.dayEndDetail = (response.json());
        this.calenderDate.setDate(this.LoginService.getSession('currentOpenDay'));
        this.dayEndDate.setDate(this.LoginService.getSession('currentOpenDay'));
      //});
  }
  //changeReturnDate
  changeCalenderDate(calenderDate) {
    if (this.calenderDate.getStandardDate() < this.dayEndDate.getStandardDate())
      this.calenderDate.setDate(this.dayEndDate.getDateFinal());
  }
  //expenseDetails
  expenseDetails(value: string) {
    this.isLoading =true;
    this.service.expenseDetails(value)
      .subscribe(response => {
        this.expense = (response.json());
        this.isLoading = false;
        //  console.log(response.json());
      });
  }

  //getExpenseType
  getExpenseType() {
    this.isLoading =true;
    this.service.getExpenseType()
      .subscribe(response => {
        this.expenseType = response.json();
        this.expenseTypeDrop = this.getDropdownList(response.json(), "typeID", "name");
        this.typeID = 0//this.expenseTypeDrop[0].id;
        this.name = this.expenseType[0].text;
        this.isLoading = false;
        console.log(response.json());
      });

  }
  //changeExpenseType
  changeExpenseType(e: any) {

    this.typeID = e;

    if (this.expenseType.length >= 1) {
      for (let i = 0; i < this.expenseType.length; i++)
        if (this.expenseType[i].typeID == this.typeID ) {
          this.name = this.expenseType[i].name;
        }
    }
  }
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    ar.push({
      id: 0,
      text: ''
    });
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

  //clearFields
  clearFields() {
    this.dailyID = 0;
    this.name = "";
    this.totalAmount = 0;
    this.amount = 0;
    this.decription = "";
    this.remarks = "";
    this.guid = UUID.UUID();
    this.mode = false;
    this.dailyExpenseDetail = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
  }
  //getDetailsByID
  getDetailsByID(dailyID, content) {
    this.detailOpen(content);
    this.mode = true;

    this.service.getDetailsByID(dailyID)
      .subscribe((o: DailyExpense) => {
        this.dailyID = o.dailyID;
        this.amount = 0;
        ////IfExists
        //IfExists(sale_Return_ID) {
        //  this.service.IfExists(sale_Return_ID)
        //    .subscribe(response => {
        //      this.status = (response.json());
        this.calenderDate.setDate(o.calenderDate);
        this.totalAmount = o.totalAmount;
        this.remarks = o.remarks
        this.dailyExpenseDetail = o.dailyExpenseDetail;
        this.getExpenseType();

      });
  }
  //      if (this.status == true) {
  //        $("#alertWarning").show();
  //        $("#submitUpdate").prop("disabled", true);
  //      }
  //      else {
  //        $("#alertWarning").hide();
  //        $("#submitUpdate").prop("disabled", false);
  //      }
  //    });
  //}
  ////IfExists
  //guidExist(guid: any) {
  //  this.service.guidExist(guid)
  //    .subscribe(response => {
  //      this.guidOrder = (response.json());
  //    });
  //}
  //changeUnitPrice
  changeAmount(amount) {
    if (amount <= 0) {
      this.amount = 1;
    }
  }
  //changeUnitPriceEdit
  changeAmountEdit(i: dailyExpenseDetail, amount) {
    if (amount <= 0) {
      i.amount = 1;
    }
  }
  //addGrid
  addGrid(typeID: any, name: any, decription: any, amount: any) { 
    if(this.typeID==0 || this.typeID==undefined){
      swal("Please Select Expense Type");
      return;
    }
    var flag = false;
    if (this.dailyExpenseDetail.length > 0) {
      for (var count = 0; count < this.dailyExpenseDetail.length; count++) {
        if (this.dailyExpenseDetail[count].typeID == typeID) {
          flag = true;
          break;
        }
      }
    }
    if (amount != 0) {
      if (flag == false) {
        this.dailyExpenseDetail.push(new dailyExpenseDetail(0, 0, typeID, name, amount, 1, decription, 0));
        console.log(this.dailyExpenseDetail);
        this.editMode = false;
      } else {
        swal("Already Exists");
      }
      $("#submitAdd").prop("disabled", false);
      $("#txt").focus();
      this.scrollToBottom();

      this.typeID = 0;
      this.decription = '';
      this.amount = 0;

    } else {
      swal("amount should be greater then 0.");
    }
  }
  //changeMode
  changeMode(idx: any, i: dailyExpenseDetail, Mode: any) {
    $("#submitAdd").prop("disabled", false);
    var duplicate = 0;
    if (this.dailyExpenseDetail.length > 0) {
      for (var count = 0; count < this.dailyExpenseDetail.length; count++) {
        if (this.dailyExpenseDetail[count].typeID == i.typeID) {
          duplicate = duplicate + 1;
          if (duplicate > 1)
            break;
        }
      }
    }
    if (duplicate < 2) {
      if (Mode == 1) {
        this.editdisable = 'disabled'
        this.removedisable = 'disabled'
        $("#addnewrow").hide();
        this.typeID = i.typeID;
      }
      else {
        this.editdisable = ''
        this.removedisable = ''
        $("#addnewrow").show();
        this.changeExpenseType(this.dailyID);
      }

      if (Mode == 0) {

        if (i.amount != 0) {
          i.edit_Mode = false;
          this.typeID = 0;
          this.decription = '';
          this.amount = 0;
        }
        else {
          swal("amount should be greater then 0.");
        }
        $("#submitAdd").prop("disabled", false);
        $("#submitUpdate").prop("disabled", false);


      }
      else if (Mode == 2) {
        this.dailyExpenseDetail.splice(idx, 1);
        this.TotalAmount();
      }
      else {
        console.log(i);
        i.edit_Mode = true;
      }
    }
    else {
      $("#submitAdd").prop("disabled", true);
      swal('Already Exist!')
    }

  }
  //updateItem 
  updateItem(i: dailyExpenseDetail, e: any) {

    this.typeID = e;

    if (this.expenseType.length >= 1) {
      for (let i = 0; i < this.expenseType.length; i++)
        if (this.expenseType[i].typeID == this.typeID) {
          this.name = this.expenseType[i].name;
        }
    }
    i.typeID = this.typeID;
    i.name = this.name;

  }
  //Total Amount
  TotalAmount() {
    var total_Amount = 0;
    if (this.dailyExpenseDetail.length > 0) {
      for (var count = 0; count < this.dailyExpenseDetail.length; count++) {
        total_Amount += this.dailyExpenseDetail[count].amount;
        this.totalAmount = total_Amount;
      }
    }
    else {
      this.totalAmount = 0;
    }
    return total_Amount.toFixed(2);;
  }
  //saveExpense
  saveExpense(calenderDate: any) {
    
    $("#submitAdd").prop("disabled", true);
    if (this.totalAmount > 0) {
      var dailyExpense = new DailyExpense(0, this.calenderDate.getDateFinal(), this.totalAmount, this.userCurrentOffice,1, this.remarks, this.dailyExpenseDetail);
      this.service.saveExpense(dailyExpense).then(
        (response) => {
          this.expenseDetails(this.id);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("Expense should be greater then 0.");
      $("#submitAdd").prop("disabled", false);
    }
  }
  //updateExpense
  updateExpense(calenderDate: any) {
    $("#submitUpdate").prop("disabled", true);
    if (this.totalAmount > 0) {
      console.log(this.dailyExpenseDetail);
      var dailyExpense = new DailyExpense(this.dailyID, this.calenderDate.getDateFinal(), this.totalAmount, this.userCurrentOffice, 1, this.remarks, this.dailyExpenseDetail);
      this.service.updateExpense(dailyExpense).then(
        (response) => {
          this.expenseDetails(this.id);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("Expense should be greater then 0.");
    }
  }
  //ngAfterViewChecked
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  //scrollToBottom
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  //hotkeys
  hotkeys(event) {
    //alert(event.keyCode);
    //if (event.keyCode == 65) {
    //    alert("A pressed");
    //    this.showCreate();
    // }
  }
  // open modal
  open(content) {
    this.getCurrentDay();
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
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);
    this.clearFields();
    this.getExpenseType();
    this.scrollToBottom();
  }
  // detailOpen
  detailOpen(content) {
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
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    //  this.clearFields();
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
  // end of modal
}

