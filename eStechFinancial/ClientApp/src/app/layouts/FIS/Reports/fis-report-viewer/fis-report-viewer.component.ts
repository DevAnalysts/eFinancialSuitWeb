import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportParam, ReportViewerService, DataService, ReportMaster, HeaderService, LoginService, SharedParams } from '../../../../shared/index';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'fis-report-viewer',
  templateUrl: './fis-report-viewer.component.html',

})

export class FISReportViewerComponent implements OnInit {
    baseURL = '';
    showPW: string = "none";
    showER: string = "none";
  url: any = '';
  reportserver: any = '';
  detail: any[] = [];
  isLoading: any = true;
  guid: any;
  constructor(public _DomSanitizer: DomSanitizer, private dataserv: DataService, private rptservice: ReportViewerService, private hservice: HeaderService, private lservice: LoginService) {
    this.baseURL = sessionStorage.getItem('BaseUrl');
    this.guid = UUID.UUID();
  }
  ngOnInit(): void {
    $("#mydiv").html("<iframe id='myFrame' src='' width='100%'   scrolling='no' style='display: block;height:800px; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
    this.baseURL = sessionStorage.getItem('BaseUrl');
    this.dataserv.currentreportServer.subscribe(ser => { this.reportserver = ser; });
    this.dataserv.currentreportMaster.subscribe(parm => {
      console.log(this.baseURL + 'ReportViewer.aspx?uuid=' + this.guid);

      if (parm != null) {
        console.log(parm);
        this.rptservice.setReportParams(new SharedParams(this.guid, parm)).then(
          (response) => {
            if (response != null) {
              console.log(response);
              var mediaType = 'application/pdf';
              var blob = new Blob([response._body], { type: mediaType });
              this.url = URL.createObjectURL(blob);
              $("#mydiv").html("<iframe id='myFrame' src='" + this.url + "' width='100%'   scrolling='no' style='display: block;height: 100vh; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
            }
          },
          (error) => {
            console.log(error);
            this.isLoading = false;
            this.showPW = "none";
            this.showER = "";
          })
        //this.rptservice.setReportParams(new SharedParams(this.guid, parm)).then(
        //  (response) => {
        //    console.log(response);
        //    if (response != null) {
        //      console.log(response);
        //     //alert(response);
        //      if (response != '') {
        //        this.url = this.baseURL + 'ReportViewer.aspx?uuid=' + response + '';
        //        $("#mydiv").html("<iframe id='myFrame' src='" + this.url + "' width='100%'   scrolling='no' style='display: block;height:800px; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
        //      }
        //    }
        //  },
        //  (error) => console.log(error))

      }
      else {
        if (sessionStorage.getItem('reportID') == "1" || sessionStorage.getItem('reportID') == "2" || sessionStorage.getItem('reportID') == "3" || sessionStorage.getItem('reportID') == "4" || sessionStorage.getItem('reportID') == "5") {

          let rMaster = new ReportMaster();
          rMaster.ModuleCode = sessionStorage.getItem('header');
          rMaster.CompanyName = sessionStorage.getItem('CompanyName');
          rMaster.CompanyNote = sessionStorage.getItem('CompanyNote');
          rMaster.UserName = sessionStorage.getItem('employeeName');
          rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');
          rMaster.DateParam = '';
          rMaster.WaterMarkText = '';
          rMaster.PageCode = sessionStorage.getItem('reportID');          
          let rparam = new Array<ReportParam>();

          let cancel = sessionStorage.getItem('cancelled');
          let provisional = sessionStorage.getItem('provisional');
          if (cancel=="1")
            rMaster.WaterMarkText = 'Cancelled';
          

          if (provisional == "1")
            rMaster.WaterMarkText = sessionStorage.getItem('FMSProvisionalWaterMark');

          //General Voucher
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "1") {

            rMaster.PageName = 'Journal Voucher';
            rMaster.ReportName = 'Reports\\FISReports\\FMSGeneralJournal.repx';
            rMaster.ReportSP = 'FMS_GeneralVoucher_rpt';
            rparam.push(new ReportParam('@Voucher_No', sessionStorage.getItem('ID')));
          }
          
          //Bank & Cash Payment
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "2" || sessionStorage.getItem('reportID') == "3" ) {
            if (sessionStorage.getItem('reportID') == "2")

              rMaster.PageName = 'Bank Payment Voucher';
            else
              rMaster.PageName = 'Cash Payment Voucher';

            rMaster.ReportName = 'Reports\\FISReports\\FMSBankCashPaymentJournal.repx';
            rMaster.ReportSP = 'FMS_BankCashPaymentVoucher_rpt';      
            rparam.push(new ReportParam('@Voucher_No', sessionStorage.getItem('ID')));
          //  console.log(sessionStorage.getItem('ID'));
          }

          //Bank & Cash Receipts
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "4" || sessionStorage.getItem('reportID') == "5" ) {

            if (sessionStorage.getItem('reportID') == "4")

              rMaster.PageName = 'Bank Receipt Voucher';
            else
              rMaster.PageName = 'Cash Receipt Voucher';
            
            rMaster.ReportName = 'Reports\\FISReports\\FMSBankCashReceiptJournal.repx';
            rMaster.ReportSP = 'FMS_BankCashReceiptVoucher_rpt';
            rparam.push(new ReportParam('@Voucher_No', sessionStorage.getItem('ID')));
          }


          rMaster.ReportSetting = sessionStorage.getItem('ReportView');
          rMaster.ReportParam = rparam;
          this.baseURL = sessionStorage.getItem('BaseUrl');
          rMaster.BlankReport = "0";
          console.log(JSON.stringify(rMaster));

          this.rptservice.setReportParams(new SharedParams(this.guid, rMaster)).then(
            (response) => {
              if (response != null) {
                console.log(response);
                var mediaType

                if (rMaster.ReportSetting == "1")
                  mediaType = 'application/pdf';
                else
                  mediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';


                var blob = new Blob([response._body], { type: mediaType });
                this.url = URL.createObjectURL(blob);
                $("#mydiv").html("<iframe id='myFrame' src='" + this.url + "' width='100%'   scrolling='no' style='display: block;height: 100vh; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
              }
            },
            (error) => {
              console.log(error);
              this.isLoading = false;
              this.showPW = "none";
              this.showER = "";
            })


          //this.rptservice.setReportParams(new SharedParams(this.guid, rMaster)).then(
          //  (response) => {
          //    if (response != null) {
          //      console.log(this.baseURL + 'ReportViewer.aspx?uuid = ' + response + '');
          //      this.url = this.baseURL + 'ReportViewer.aspx?uuid=' + response + '';
          //      $("#mydiv").html("<iframe id='myFrame' src='" + this.url + "' width='100%'   scrolling='no' style='display: block;height:800px; border: none; padding: 0px; margin: 0px; '> Browser unable to load ...   </iframe>");
          //    }
          //  },
          //  (error) => console.log(error))

        }
      }
      this.isLoading = false;
    });
  }
}
