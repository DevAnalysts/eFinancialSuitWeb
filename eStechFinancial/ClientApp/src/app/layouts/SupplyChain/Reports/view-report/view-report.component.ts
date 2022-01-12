import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportParam, ReportViewerService, DataService, ReportMaster, HeaderService, LoginService, SharedParams, ReportsList } from '../../../../shared/index';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'view-report',
  templateUrl: './view-report.component.html',
})


export class ViewReportComponent implements OnInit {
  baseURL = '';
  url: any = '';
  reportserver: any = '';
  detail: any[] = [];
  isLoading = true;
  guid: any;
  date = new Date();
  reportType: any = 3;
  rMaster = new ReportMaster();
  public dspparams: any;
  reports: ReportsList[];
  userCurrentOffice: any;
  userCurrentWarehouse: any;

  constructor(public sanitizer: DomSanitizer, private dataserv: DataService, private rptservice: ReportViewerService, private hservice: HeaderService, private lservice: LoginService) {
    this.baseURL = sessionStorage.getItem('BaseUrl');
    this.guid = UUID.UUID();
    this.userCurrentOffice = this.lservice.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.lservice.getSession('userCurrentWarehouse');
  }

  ngOnInit(): void { 
    
    this.baseURL = sessionStorage.getItem('BaseUrl');
    this.dataserv.currentreportServer.subscribe(ser => { this.reportserver = ser; });
    this.dataserv.currentreportMaster.subscribe(parm => {
      
      if (parm != null) {
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
          (error) => console.log(error))
      }
      else {
        if (sessionStorage.getItem('reportID') == "11" || sessionStorage.getItem('reportID') == "10" || sessionStorage.getItem('reportID') == "9" || sessionStorage.getItem('reportID') == "8" || sessionStorage.getItem('reportID') == "7" || sessionStorage.getItem('reportID') == "6" || sessionStorage.getItem('reportID') == "5" || sessionStorage.getItem('reportID') == "4" || sessionStorage.getItem('reportID') == "2" || sessionStorage.getItem('reportID') == "1"|| sessionStorage.getItem('reportID') == "12" || sessionStorage.getItem('reportID') == "13" || sessionStorage.getItem('reportID') == "14" || sessionStorage.getItem('reportID') == "18"|| sessionStorage.getItem('reportID') == "19") 
        {
          
          let rMaster = new ReportMaster();
          rMaster.ModuleCode = sessionStorage.getItem('header');
          rMaster.CompanyName = sessionStorage.getItem('CompanyName');
          rMaster.ReportName = sessionStorage.getItem('reportName');
          rMaster.CompanyNote = sessionStorage.getItem('CompanyNote');
          rMaster.UserName = sessionStorage.getItem('employeeName');
          rMaster.PoweredBy = sessionStorage.getItem('PoweredBy');
          rMaster.DateParam = '';
          rMaster.PageCode = sessionStorage.getItem('reportID');
          rMaster.isStamp = sessionStorage.getItem('isStamp');
          rMaster.SendingMedium = sessionStorage.getItem('SendingMedium');
          rMaster.ReportSave = sessionStorage.getItem('ReportSave');
          rMaster.ReportParentType = sessionStorage.getItem('ReportParentType');
          rMaster.ReportID = sessionStorage.getItem('ID');
          let rparam = new Array<ReportParam>();

          if (sessionStorage.getItem('reportID') == "1" || sessionStorage.getItem('reportID') == "2" || sessionStorage.getItem('reportID') == "3" || sessionStorage.getItem('reportID') == "4"|| sessionStorage.getItem('reportID') == "12" || sessionStorage.getItem('reportID') == "13"  ) {
            //template param added          
            rMaster.TemplateCode = sessionStorage.getItem('templatecode');

            let subparam = new Array<ReportParam>();

            if (rMaster.TemplateCode == 20) {

              subparam.push(new ReportParam('@Sale_Order_ID', 0));
              subparam.push(new ReportParam('@Purchase_Order_ID', sessionStorage.getItem('ID')));

              rMaster.SubReportParam = subparam;
            }
          }
          /////////////////////////////////////////////////////////
          //Purchase Order Preview
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "1") {
            rMaster.ReportType = 3;
            rMaster.PageName = 'Purchase Order';
            /* if (sessionStorage.getItem('BookReports') != "1") {
               if (sessionStorage.getItem('AllowTaxOnPurchase') == "1") {
                 rMaster.ReportName = 'Reports\\SCMReports\\PurchaseOrderWithTax.repx';
               }
               else {
                 rMaster.ReportName = 'Reports\\SCMReports\\PurchaseOrderWithOutTax.repx';
               }
             }
             else {
               if (sessionStorage.getItem('AllowTaxOnPurchase') == "1") {
                 rMaster.ReportName = 'Reports\\SCMReports\\PurchaseOrderWithTax.repx';
               }
               else {
                 rMaster.ReportName = 'Reports\\SCMReports\\PurchaseOrderWithOutTaxBooks.repx';
               }
             }*/
            rMaster.ReportSP = 'SCM_PurchaseOrderDetail_Preview';

            rparam.push(new ReportParam('@OrderID', sessionStorage.getItem('ID')));

          }
          //Sale Invoice Preview
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "2") {
            rMaster.ReportType = 3;
            /* if (sessionStorage.getItem('BookReports') != "1") {
                 rMaster.PageName = 'Sale Invoice';
                   if (sessionStorage.getItem('AllowTaxOnSale') == "1") {
                   rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithTax.repx';
                 }
                 else {
                   rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax.repx';
                 }
    
               }
               else {
                 //ClientApp\\src\\app\\layouts\\SupplyChain\\Reports\\SCMReports\\SaleInvoiceWithTax.repx
                 rMaster.PageName = 'Bill';
                 if (sessionStorage.getItem('AllowTaxOnSale') == "1") {
                   rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithTax.repx';
                 }
                 else {
   
                   rMaster.TemplateCode = sessionStorage.getItem('templatecode');
   
                   if (sessionStorage.getItem('templatecode') == "0")
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTaxBooks.repx';
                   if (sessionStorage.getItem('templatecode') == "1")
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTaxBooks.repx';
                   else if (sessionStorage.getItem('templatecode') == "2")
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax1.repx';
                   else if (sessionStorage.getItem('templatecode') == "3")
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax2.repx';
                   else if (sessionStorage.getItem('templatecode') == "4")
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax3.repx';
                   else if (sessionStorage.getItem('templatecode') == "5")
                     rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrderWithOutTax.repx';
   
                 }
   
               }*/
           
               rMaster.ReportSP = 'SCM_SaleInvoiceDetail_Preview';
            rparam.push(new ReportParam('@InvoiceID', sessionStorage.getItem('ID')));
            rparam.push(new ReportParam('@IsOrder', sessionStorage.getItem('IsOrder')));
            rparam.push(new ReportParam('@ShowIMEI', sessionStorage.getItem('ShowIMEI')));
          }
          //Sale Order Preview
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "4") {
           
            if (rMaster.TemplateCode == 17 || rMaster.TemplateCode == 15 || rMaster.TemplateCode <= 5) {
              rMaster.ReportSP = 'SCM_SaleInvoiceDetail_Preview';
              rparam.push(new ReportParam('@InvoiceID', sessionStorage.getItem('ID')));
              rparam.push(new ReportParam('@IsOrder', sessionStorage.getItem('IsOrder')));
            } 
            else {
              rMaster.ReportSP = 'SCM_SaleOrderDetail_Preview';
             
              rparam.push(new ReportParam('@OrderID', sessionStorage.getItem('ID')));
              rparam.push(new ReportParam('@Exchange', -1));
            

            /*   rMaster.ReportType = 3;
              if (sessionStorage.getItem('BookReports') != "1") {
                 rMaster.PageName = 'Sale Order';
                  if (sessionStorage.getItem('AllowTaxOnSale') == "1") {
   
                   if (sessionStorage.getItem('AllowPOSReciptOnSaleOrder') == "1") {
   
                     rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrder.repx';
                   } else {
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoicePreview.repx';
                   }
   
                 }
                 else {
                   rMaster.PageName = 'Sale Order';
                   if (sessionStorage.getItem('AllowPOSReciptOnSaleOrder') == "1") {
   
                     rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrderWithOutTax.repx';
                   } else {
   
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax.repx';
                   }
   
                 } 
                 rMaster.ReportSP = 'SCM_SaleInvoiceDetail_Preview';
                 rparam.push(new ReportParam('@InvoiceID', sessionStorage.getItem('ID')));
                 rparam.push(new ReportParam('@IsOrder', sessionStorage.getItem('IsOrder')));
               }
               else {
                 rMaster.PageName = 'Bill';
                 if (sessionStorage.getItem('AllowTaxOnSale') == "1") {
   
                   if (sessionStorage.getItem('AllowPOSReciptOnSaleOrder') == "1") {
   
                     rMaster.ReportName = 'Reports\\SCMReports\\SaleOrderWithTax.repx';
                   } else {
                     rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrder.repx';
                   }
                   rMaster.ReportSP = 'SCM_SaleOrderDetail_Preview';
                   rparam.push(new ReportParam('@OrderID', sessionStorage.getItem('ID')));
                   rparam.push(new ReportParam('@Exchange', -1));
   
                 }
                 else {
                   if (sessionStorage.getItem('AllowPOSReciptOnSaleOrder') == "1") {
                     rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrderWithOutTax.repx';
                   } else {
                     if (sessionStorage.getItem('templatecode') == "0")
                       rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTaxBooks.repx';
                     if (sessionStorage.getItem('templatecode') == "1")
                       rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTaxBooks.repx';
                     else if (sessionStorage.getItem('templatecode') == "2")
                       rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax1.repx';
                     else if (sessionStorage.getItem('templatecode') == "3")
                       rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax2.repx';
                     else if (sessionStorage.getItem('templatecode') == "4")
                       rMaster.ReportName = 'Reports\\SCMReports\\SaleInvoiceWithOutTax3.repx';
                     else if (sessionStorage.getItem('templatecode') == "5")
                       rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrderWithOutTax.repx';
   
                   } 
                   rMaster.ReportSP = 'SCM_SaleInvoiceDetail_Preview';
                   rparam.push(new ReportParam('@InvoiceID', sessionStorage.getItem('ID')));
                   rparam.push(new ReportParam('@IsOrder', sessionStorage.getItem('IsOrder')));
                 }
               }*/
          }
        }
          //Item Duplicate
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "5") {
            rMaster.ReportType = 1;
            rMaster.PageName = 'Sale Item Duplicate';
            rMaster.ReportName = 'Reports\\SCMReports\\SaleItemDetailDuplicate.repx';
            rMaster.ReportSP = 'SCM_SaleItemDetailDuplicate';
            rparam.push(new ReportParam('@CustomerID', sessionStorage.getItem('customerID')));
            rparam.push(new ReportParam('@OrderID', sessionStorage.getItem('ID')));
          }
          //POS Summary
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "6") {
            rMaster.ReportType = 6;
            rMaster.DateParam = 'As of ' + sessionStorage.getItem('dateParam');
            rMaster.DspParam = sessionStorage.getItem('userCurrentOfficeName');
            if (sessionStorage.getItem('ShowDaySummaryPOS') == "1") {
              rMaster.PageName = 'Day Summary';
              rMaster.ReportName = 'Reports\\SCMReports\\RPDailySaleRegister.repx';
            }
            else {
              rMaster.ReportType = 1;
              rMaster.PageName = 'Day Summary';
              rMaster.ReportName = 'Reports\\SCMReports\\DailySaleRegister.repx';
            }
            rMaster.ReportSP = 'SCM_POSDailySummaryReport';
            rparam.push(new ReportParam('@Date', sessionStorage.getItem('dateDaySummary')));
            rparam.push(new ReportParam('@office_code', this.userCurrentOffice));
          }
          //POS SO Booking Sheet
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "7") {
            rMaster.ReportType = 7;
            rMaster.DateParam = 'As of ' + sessionStorage.getItem('dateParam');

            rMaster.PageName = 'Sale Order';
            rMaster.ReportName = 'Reports\\SCMReports\\POSSaleOrderWithOutTaxBookingSheet.repx';

            rMaster.ReportSP = 'SCM_BookingSheetSO_Preview';
            rparam.push(new ReportParam('@OrderFrom', sessionStorage.getItem('OrderFrom')));
            rparam.push(new ReportParam('@OrderTo', sessionStorage.getItem('OrderTo')));
            console.log(Date.now().toString());
          }
          //Booking Sheet
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "8") {
            rMaster.ReportType = 7;
            rMaster.PageName = 'Booking Sheet Report';
            rMaster.ReportName = 'Reports\\SCMReports\\GetBookingSheet.repx';
            rMaster.ReportSP = 'SCM_GetBookSheet_rpt';
            rparam.push(new ReportParam('@AreaID', sessionStorage.getItem('areacode')));
            rparam.push(new ReportParam('@userCurrentOffice', this.userCurrentOffice));
            rparam.push(new ReportParam('@userCurrentWarehouse', this.userCurrentWarehouse));
            rMaster.DspParam = sessionStorage.getItem('areaname')
          }
          //Daily Sale Load Preview
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "9") {
            rMaster.ReportType = 3;
            rMaster.PageName = 'Daily Sale Load Detail';
            rMaster.ReportName = 'Reports\\SCMReports\\DailySaleLoadDetail.repx';
            rMaster.ReportSP = 'SCM_DailySaleLoadDetailPreview';
            rparam.push(new ReportParam('@DailySaleLoadID', sessionStorage.getItem('DailySaleLoadID')));

          }
          //Goods Receive NotePreview
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "10") {
            rMaster.ReportType = 3;
            rMaster.PageName = 'Goods Receive Note';
            rMaster.ReportName = 'Reports\\SCMReports\\GoodsReceiveNote.repx';
            rMaster.ReportSP = 'SCM_GoodsReceiveNotePreview';
            rparam.push(new ReportParam('@Goods_Receive_ID', sessionStorage.getItem('Goods_Receive_ID')));


          }
          //Goods Dispatach hNote Preview
          //////////////////////////////////////////////////////////
          if (sessionStorage.getItem('reportID') == "11") {
            rMaster.ReportType = 3;
            rMaster.PageName = 'Goods Dispatch Note';
            rMaster.ReportName = 'Reports\\SCMReports\\GoodsDispatchNote.repx';
            rMaster.ReportSP = 'SCM_GoodsDispatchNotePreview';
            rparam.push(new ReportParam('@Goods_Supply_ID', sessionStorage.getItem('Goods_Supply_ID')));

          }
          if (sessionStorage.getItem('reportID') == "12") {
            rMaster.ReportType = 3;
            //rMaster.PageName = 'Goods Dispatch Note';
            //rMaster.ReportName = 'Reports\\SCMReports\\invoices\\DeliveryChallan1.repx';
            rMaster.ReportSP = 'SCM_GoodsDispatchNotePreview';
            rparam.push(new ReportParam('@Goods_Supply_ID', sessionStorage.getItem('Goods_Supply_ID')));

          }
          if (sessionStorage.getItem('reportID') == "13") {
            rMaster.ReportType = 3;
            //rMaster.PageName = 'Goods Dispatch Note';
            //rMaster.ReportName = 'Reports\\SCMReports\\invoices\\DeliveryChallan1.repx';
            rMaster.ReportSP = 'SCM_GoodsReceiveNotePreview';
            rparam.push(new ReportParam('@Goods_Receive_ID', sessionStorage.getItem('Goods_Receive_ID')));

          }
          if (sessionStorage.getItem('reportID') == "14") {
            rMaster.ReportType = 3;
            rMaster.PageName = 'Sale Order Contract';
            rMaster.ReportName = 'Reports\\SCMReports\\SaleOrderContractPreview.repx';
            rMaster.ReportSP = 'SCM_SaleOrderContractDetail_Preview';
            rparam.push(new ReportParam('@OrderID', sessionStorage.getItem('ID')));
            rparam.push(new ReportParam('@Exchange', -1));


          }
          if (sessionStorage.getItem('reportID') == "18") {
            rMaster.ReportType = 3;
            rMaster.TemplateCode = 43
            rMaster.PageName = 'Stock Transfer Note';
            rMaster.ReportName = 'Reports\\SCMReports\\Notes\\StockTransferNote.repx';
            rMaster.ReportSP = 'SCM_StockTransferNotePreview';
            rparam.push(new ReportParam('@Stock_Trans_ID', sessionStorage.getItem('Stock_Trans_ID')));

          }
          if (sessionStorage.getItem('reportID') == "19") {
            rMaster.ReportSP = 'SCM_SaleQuotationDetail_Preview';
            rMaster.TemplateCode = 46
            rMaster.PageName = 'Sale Quotation';
            rMaster.ReportName = 'Reports\\SCMReports\\invoices\\SaleQuotation.repx';
              rparam.push(new ReportParam('@OrderID', parseInt(sessionStorage.getItem('ID'))));
              rparam.push(new ReportParam('@Exchange', -1));
          }
          rMaster.ReportSetting = sessionStorage.getItem('ReportView');
          rMaster.ReportParam = rparam;
          this.baseURL = sessionStorage.getItem('BaseUrl');
          rMaster.CompanyAddress = sessionStorage.getItem('CompanyAddress');
          rMaster.isStamp = sessionStorage.getItem('isStamp');
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
            (error) => console.log(error))
        }
      }

    });
  }

  chunkReports(arr, condition) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].header_ID == condition && arr[i].page_Type_Code == 2) {
        //  newArr.push(arr[i]);
      }
    }
    return newArr;
  }
  sethtml() {
  }
}
