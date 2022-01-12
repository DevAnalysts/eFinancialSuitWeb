import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DailyExpenseService, LoginService, DayEndService, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'daily-expense-voucher',
  templateUrl: './daily-expense-voucher.component.html',
  styleUrls: ['./daily-expense-voucher.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class DailyExpenseVoucherComponent implements OnInit, AfterViewChecked {
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  modalReference: NgbModalRef;
  expense: any[] = [];
  approveVoucher: any[] = [];
  index = 1;
  dailyID: any;
  id: any = "";
  public calenderDate = new cDate();
  public dayEndDate = new cDate();
  guid: any;
  mode: any = 0;
 isLoading: any = false;
  alerts: Array<any> = [];
  dayEndDetail: any[] = [];
  guidOrder: boolean;
  closeResult: string;
  chk: any = false;
  selectedAll: any;
  btnmode: any = true;
  
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  //End Member Variables
  public permissomUtility:PermissionUtility=new PermissionUtility(); 

  constructor(private service: DailyExpenseService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
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
    this.expenseVoucherDetails(this.id);
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(110077);  
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
  //expenseVoucherDetails
  expenseVoucherDetails(value: string) {
    this.isLoading =true;
    this.service.expenseVoucherDetails(value)
      .subscribe(response => {
        this.expense = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //selectAll
  selectAll() {
    for (var i = 0; i < this.expense.length; i++) {
      this.expense[i].voucherId = this.selectedAll;
    }
  }
  //checkIfAllSelected
  checkIfAllSelected() {
    for (let i = 0; i < this.expense.length; i++) {
      this.chk = this.expense[i].voucherId;
      if (this.chk == true) {
        this.dailyID = this.expense[i].dailyID;
        this.approveVoucher.push(this.dailyID);
      }
    }
  }
  //voucherApprove
  voucherApprove() {
    $("#submitAdd").prop("disabled", true);
    for (let i = 0; i < this.expense.length; i++) {
      this.chk = this.expense[i].voucherId;
      if (this.chk == true) {
        this.dailyID = this.expense[i].dailyID;
        this.expense[i].voucherId = true;
      }
    }
    var json = this.approveVoucher;
    if (json.length > 0) {
      this.service.voucherApproval(json).subscribe(
        (response) => {
          this.expenseVoucherDetails(this.id);
          $("#submitAdd").prop("disabled", false);
          console.log(response);
        },
        (error) => console.log(error))
    }
    else {
      swal("Daily expense voucher must be greater then 0");
      $("#submitAdd").prop("disabled", false);
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
  // open modal
  open(content) {
    this.getCurrentDay();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);

    this.scrollToBottom();
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

