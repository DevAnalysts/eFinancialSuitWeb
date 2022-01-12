import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FiscalYearService, fiscalYear, cDate, NgbDateFRParserFormatter, DayEndService, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';
@Component({
  selector: 'fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class FiscalYearComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
   public permissionUtility:PermissionUtility=new PermissionUtility();
  p: number = 1;
  submitAdd:any;
  submitUpdate:any;
  modalReference: NgbModalRef;
  fiscalYear: any[];
  detail: any[];
  dayClose: any[];
  nextFiscalYear: any[];
  fiN_YR: any = 0;
  fiN_YRC: any = 0;
  fiN_DAY: any = "";
  isCurrent: any = 0;
  isClosed: any = 0;
  isClosedCheck: any = 0;
  adj_Period_Closed: any = 0;
  isActive: any = 0;
  isActiveCheck: any = 0;
  isActiveNY: any = 0;
  isJune_Closed: any = 0;
  isProv_Balance: any = 0;
  isP_Transfer: any = 0;
 isLoading: any = false;
  closeResult: string;
  mode: any = 0;
  date = new Date();
  nextStart: any;
  nextEnd: any;
  status: any;
  dayEndDetail: any[] = [];
  public starT_DT = new cDate();
  public enD_DT = new cDate();
  public starT_DTA = new cDate();
  public enD_DTA = new cDate();
  public dayEndDate = new cDate();
  ID: any = 1;
  id: any = "";

  constructor(private service: FiscalYearService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter, private DayEndService: DayEndService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.getFiscalYear(this.id);
    this.permissionUtility.setPagePermissions(40001);
  }
   ////////////////////////
   
  //getCurrentDay
  getCurrentDay() {
    this.DayEndService.getCurrentCloseDay()
      .subscribe(response => {
        this.dayEndDetail = (response.json());
        this.starT_DT.setDate(this.dayEndDetail[0].date);
        this.starT_DTA.setDate(this.dayEndDetail[0].date);
        this.enD_DT.setDate(this.dayEndDetail[0].endDate);
        this.enD_DTA.setDate(this.dayEndDetail[0].endDate);
        this.dayEndDate.setDate(this.dayEndDetail[0].currentDate);

      });
  }
  //getFiscalYear
  getFiscalYear(value: string) {
    this.isLoading =true;
    this.service.getFiscalYear(value)
      .subscribe(response => {
        if(response.json() !== null){
          this.fiscalYear = (response.json());
          //  console.log(response.json());
          this.isLoading = false;
        }
        else{
          this.fiscalYear = [];
          this.isLoading = false;
        }
       
      });
  }
  //getNextFiscalYear
  getNextFiscalYear() {
    this.service.getNextFiscalYear()
      .subscribe(response => {
        this.nextFiscalYear = (response.json());
        console.log(response.json());
        this.starT_DT.setDate(this.nextFiscalYear[0].starT_DT);
        this.enD_DT.setDate(this.nextFiscalYear[0].enD_DT);
        this.fiN_YR = this.nextFiscalYear[0].fiN_YRStart + '-' + this.nextFiscalYear[0].fiN_YREnd;

      });
  }
  //IfExists
  IfExists(starT_DT, enD_DT) {
    this.service.IfExists(starT_DT, enD_DT)
      .subscribe(response => {
        this.status = (response.json());

        if (this.status == false) {

          var year = new fiscalYear(this.fiN_YR, this.starT_DT.getDateFinal(), this.enD_DT.getDateFinal(), this.isCurrent, this.isClosed, this.adj_Period_Closed, this.isActive, this.isProv_Balance, 0, this.logedInUserID, this.UserSessionID);
          this.service.saveFiscalYear(year).then(
            (response) => {
              this.getFiscalYear("");
              console.log(response);
            },
            (error) => console.log(error))
        }
        else {
          swal("Financial year start and end date is overlapping with existing Financial Year.");
        }
      });
  }
  //clearFields
  clearFields() {
    this.mode = 0;
    this.isCurrent = 0;
    this.isClosed = 0;
    this.adj_Period_Closed = 0;
    this.isActive = 0;
    this.isJune_Closed = 0;
    this.isProv_Balance = 0;
    this.getNextFiscalYear();
    $("#submitAdd").prop("disabled", false);

    $("#submitNewYear").hide();
    $("#submitCloseYear").hide();
    $("#transferProvBalance").hide();
    $("#submitCloseAdjustment").hide();

    $("#isCurrent").prop("disabled", true);
    $("#isActive").prop("disabled", true);
    $("#isClosed").prop("disabled", true);
    //this.guid = UUID.UUID();
  }
  //getDetailsByID
  getDetailsByID(fiN_YR, content) {
    this.openDetail(content);
    this.mode = true;
    this.service.getDetailsByID(fiN_YR)
      .subscribe((o: fiscalYear) => {
        this.fiN_YR = o.fiN_YR;
        this.starT_DT.setDate(o.starT_DT);
        this.enD_DT.setDate(o.enD_DT);
        this.isCurrent = o.isCurrent;
        this.isActive = o.isActive;
        this.isClosed = o.isClosed;
        this.isP_Transfer = o.isP_Transfer;
 
        if (this.isCurrent == true) {
          $("#submitUpdate").prop("disabled", true);

         
        
            this.service.getFiscalYearDetail(this.fiN_YR, 1)
              .subscribe(response => {
                this.detail = (response.json());
                if (this.detail != null) {
                  this.isActiveCheck = this.detail[0].isActive;
                  if (this.isActiveCheck == true) {
                    $("#submitNewYear").show();
                    $("#submitCloseAdjustment").show();
                  }
                }
              });
        


          this.service.getFiscalYearDetail(this.fiN_YR, 2)
            .subscribe(response => {
              this.detail = (response.json());
              //  console.log(response.json());
              this.adj_Period_Closed = this.detail[0].adj_Period_Closed;
              this.fiN_YRC = this.detail[0].fiN_YR;
              if (this.adj_Period_Closed == false) {
                $("#submitNewYear").show();
                if (this.isActiveCheck == true)
                  $("#submitNewYear").hide();
                else
                  $("#submitNewYear").show();
              }
              else {
                $("#submitCloseYear").show();
                $("#submitCloseAdjustment").hide();
              }
            });
        }

      });

  }
  //getFiscalYearDetail
  getFiscalYearDetail(fiN_YR, ID) {
    this.service.getFiscalYearDetail(fiN_YR, ID)
      .subscribe(response => {
        this.detail = (response.json());
      });
  }
  //submitNewYear
  submitNewYear() {
    this.service.getFiscalYearDetail(this.fiN_YR, this.ID)
      .subscribe(response => {
        this.detail = (response.json());
        if (this.detail != null) {
          this.isActiveNY = this.detail[0].isActive;
          this.fiN_YR = this.detail[0].fiN_YR;

          if (this.isActiveNY == false) {
            this.service.getFiscalYearDetail(this.fiN_YR, 4)
              .subscribe(response => {
                this.detail = (response.json());
              });
            $("#submitNewYear").hide();
            $("#transferProvBalance").show();
          }
          else {
            swal("Next Financial Year is already Active.");
          }
        }
        else {
          swal("Please Create next Financial Year for its Activation.");
        }
      });
  }
  //transferProvBalance
  transferProvBalance() {
    this.service.getFiscalYearDetail(this.fiN_YR, 6)
      .subscribe(response => {
        this.detail = (response.json());
        this.isJune_Closed = this.detail[0].isJune_Closed;
        this.fiN_YR = this.detail[0].fiN_YR;

        if (this.isJune_Closed == true) {

          this.service.transferProvBalance(this.fiN_YR)
            .subscribe(response => {
              var p = (response.json());
            });

          $("#transferProvBalance").hide();
          $("#submitCloseAdjustment").show();
        }
        else {
          swal("Please Close the 30th June of Current Financial Year");
        }

      });
  }
  //submitCloseAdjustment
  submitCloseAdjustment(starT_DT, enD_DT) {
    this.service.getDayCloseStatus(starT_DT, enD_DT, false)
      .subscribe(response => {
        this.dayClose = (response.json());
        if (this.dayClose == null) {

          this.service.getFiscalYearDetail(this.fiN_YRC, 2)
            .subscribe(response => {
              this.detail = (response.json());
              if (this.detail != null) {
                this.isActiveNY = this.detail[0].isActive;
                this.fiN_YR = this.detail[0].fiN_YR;
                if (this.isActiveNY == true) {
                  this.service.getFiscalYearDetail(this.fiN_YR, 5)
                    .subscribe(response => {
                      this.detail = (response.json());
                    });
                  $("#submitCloseYear").show();
                  $("#submitCloseAdjustment").hide();
                }
                else {
                  swal("Please Activate next Financial Year before closing current financial year.");

                }
              }
              else {
                swal("Please Create next Financial Year before closing current financial year.");
              }
            });
        }
        else {
          swal("Please Create next Financial Year before closing current financial year.");
        }

      });
  }

  //submitCloseYear
  submitCloseYear() {
    this.service.getFiscalYearDetail(this.fiN_YR, 2)
      .subscribe(response => {
        this.detail = (response.json());
        // console.log(response.json());
        if (this.detail != null) {
          this.isActiveNY = this.detail[0].isActive;
          this.fiN_YR = this.detail[0].fiN_YR;
          this.adj_Period_Closed = this.detail[0].adj_Period_Closed;
          if (this.isActiveNY == true) {
            if (this.adj_Period_Closed == true) {
              this.service.closeCurrentFisYear(this.fiN_YR, 1)
                .subscribe(response => {
                  this.detail = (response.json());
                  this.isCurrent = this.detail[0].isCurrent;
                  this.isActive = this.detail[0].isActive;
                  this.isClosed = this.detail[0].isClosed;
                  $("#submitCloseYear").hide();
                });
            }
            else {
              swal("Please close adjustment period before closing current financial year.");
            }
          }
          else {
            swal("Please Activate next Financial Year before closing current financial year.");
          }
        }
        else {
          swal("Please Create next Financial Year before closing current financial year.");
        }
      });
  }
  //saveFiscalYear  
  saveFiscalYear() {


    this.IfExists(this.starT_DT.getDateFinal(), this.enD_DT.getDateFinal());

  }
  //updateFiscalYear
  updateFiscalYear() {
    var order = new fiscalYear(this.fiN_YR, this.starT_DT.getDateFinal(), this.enD_DT.getDateFinal(), this.isCurrent, this.isClosed, this.adj_Period_Closed, this.isActive, this.isProv_Balance, 0, this.logedInUserID, this.UserSessionID);
    this.service.updateFiscalYear(order).then(
      (response) => {
        this.submitAdd='';
        this.permissionUtility.PermissionAdd='';
        this.getFiscalYear(this.id);
        console.log(response);
      },
      (error) => console.log(error))
  }
  // open Modal
  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();

  }
  // open Modal
  openDetail(content) {
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitUpdate").hide();
    this.mode = 0;
    this.isCurrent = 0;
    this.isClosed = 0;
    this.adj_Period_Closed = 0;
    this.isActive = 0;
    this.isProv_Balance = 0;
    $("#submitNewYear").hide();
    $("#submitCloseYear").hide();
    $("#submitCloseAdjustment").hide();

    $("#isCurrent").prop("disabled", true);
    $("#isActive").prop("disabled", true);
    $("#isClosed").prop("disabled", true);

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

}
