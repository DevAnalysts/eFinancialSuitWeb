import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { IAngularMyDpOptions, IMyOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FiscalPeriodService, fiscalPeriod, cDate, NgbDateFRParserFormatter, DayEndService, LoginService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
    selector: 'fiscal-period',
    templateUrl: './fiscal-period.component.html',
    styleUrls: ['./fiscal-period.component.scss'],
    providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class FiscalPeriodComponent implements OnInit {
     
    logedInUserID: any = 1;
    UserSessionID: any = 0;
    public permissionUtility:PermissionUtility=new PermissionUtility();
    p: number = 1;
    modalReference: NgbModalRef;
    fiscalPeriod: any[];
    fiscalYear: any[];
    dayClose: any = 0;
    fiN_YR: any = 0;
    iS_CLOSE: any = 0;
   isLoading: any = false;
    closeResult: string;
    mode: any = 0;

    dayEndDetail: any[] = [];
    public starT_DT = new cDate();
    public enD_DT = new cDate();
    public starT_DTA = new cDate();
    public enD_DTA = new cDate();
    public dayEndDate = new cDate();
    status: any;
    id: any = "";

    constructor(private service: FiscalPeriodService, private ngbDateParserFormatter: NgbDateParserFormatter, private DayEndService: DayEndService, private modalService: NgbModal) { }

    ngOnInit() {
        this.getFiscalPeriod(this.id);
        this.getCurrentDay();
        this.permissionUtility.setPagePermissions(40003);
    }
     ////////////////////////
   
    //getCurrentDay
    getCurrentDay() {
        this.DayEndService.getCurrentCloseDay()
            .subscribe(response => {
                this.dayEndDetail = (response.json());
                console.log(response.json());
                this.starT_DT.setDate(this.dayEndDetail[0].date);
                this.starT_DTA.setDate(this.dayEndDetail[0].date);
                this.enD_DT.setDate(this.dayEndDetail[0].endDate);
                this.enD_DTA.setDate(this.dayEndDetail[0].endDate);
                this.dayEndDate.setDate(this.dayEndDetail[0].currentDate);
            });
    }
    //changeSDate
    changeSDate(starT_DT) {
        // if (this.starT_DT.getStandardDate() < this.starT_DTA.getStandardDate()) {
        //     this.starT_DT.setDate(this.starT_DTA.getDateFinal());
        // }
    }
    //changeEDate
    changeEDate(enD_DT) {
      //  alert(this.enD_DT.getDateFinal());
        // if (this.enD_DT.getStandardDate() < this.starT_DT.getStandardDate())
        //     this.enD_DT.setDate(this.starT_DT.getDateFinal());
        // else if (this.enD_DT.getStandardDate() > this.enD_DTA.getStandardDate())
        //     this.enD_DT.setDate(this.enD_DTA.getDateFinal());       
    }
    //getFiscalPeriod
    getFiscalPeriod(value: string) {
        this.isLoading =true;
        this.service.getFiscalPeriod(value)
            .subscribe(response => {
                if(response.json() !== null){
                    this.fiscalPeriod = (response.json());
                    //   console.log(response.json());
                    this.isLoading = false;
                }
                else{
                    this.fiscalPeriod = [];
                    this.isLoading = false;
                }
                
            });
    }
    //getFiscalYear
    getFiscalYear() {
        this.isLoading =true;
        this.service.getFiscalYear(this.starT_DT.getDateFinal(), this.enD_DT.getDateFinal())
            .subscribe(response => {
                this.fiscalYear = (response.json());
                this.isLoading = false;
            });
    }
    //getDayClose
    getDayClose() {
        this.service.getDayClose(this.enD_DT.getDateFinal())
            .subscribe(response   => {
                var list=(response.json());
                this.dayClose = list[0].day;
                
            });
            return this.dayClose;
    }
    //clearFields
    clearFields() {
        this.mode = 0;
        this.iS_CLOSE = 0;
        $("#submitAdd").prop("disabled", false);

        //$("#submitNewYear").hide();
        //$("#submitCloseYear").hide();
        //$("#submitCloseAdjustment").hide();

        //$("#isCurrent").prop("disabled", true);
        //$("#isActive").prop("disabled", true);
        //$("#isClosed").prop("disabled", true);
        //this.guid = UUID.UUID();
    }
    //saveFiscalPeriod
    saveFiscalPeriod() {
       
        if( this.dayClose == 0)
        {
            this.service.getDayClose(this.enD_DT.getDateFinal())
            .subscribe(response   => {
                var list=(response.json());
                this.dayClose = list[0].day;
                if(this.dayClose == " Some Voucher are Un-Posted ")
                {
                    swal("Some Voucher are Un-Posted","","error");
                    return;
                }
                else
                {
                    var year = new fiscalPeriod(this.fiN_YR, this.starT_DT.getDateFinal(), this.iS_CLOSE, this.starT_DT.getDateFinal(), this.enD_DT.getDateFinal(), this.logedInUserID, this.UserSessionID);
                    this.service.saveFiscalPeriod(year).then(
                    (response) => {
                        this.getFiscalYear();
                        swal("Selected Period is Closed!", "","success")
                    },
                    (error) => console.log(error))
                }
                this.dayClose = 0;
                this.getFiscalPeriod("");
            });
        }
        
        
        
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
    //CloseDay
    CloseDay(fiN_YR, fiN_DAY) {
        if(this.dayClose==0)
        {
            
            this.service.getDayClose(fiN_DAY)
            .subscribe(response   => {
                var list=(response.json());
                this.dayClose = list[0].day;
                if(this.dayClose == " Some Voucher are Un-Posted ")
                {
                    swal("Some Vouchers are not Posted","Please post are pending vouchers","error");
                }
                else
                {
                    this.fiN_YR = fiN_YR;
                    this.starT_DT.setDate(fiN_DAY);
                    this.enD_DT.setDate(fiN_DAY);
                    var year = new fiscalPeriod(this.fiN_YR, this.starT_DT.getDateFinal(), this.iS_CLOSE, this.starT_DT.getDateFinal(), this.enD_DT.getDateFinal(), this.logedInUserID, this.UserSessionID);
                    this.service.saveFiscalPeriod(year).then(
                        (response) => {
                            this.getFiscalYear();
                            swal("Selected Period is Closed!", "","success");
                            this.dayClose = 0;
                            this.getFiscalPeriod("");
                        },
                        (error) => console.log(error))
                }

            });
        }
        
    }

}
