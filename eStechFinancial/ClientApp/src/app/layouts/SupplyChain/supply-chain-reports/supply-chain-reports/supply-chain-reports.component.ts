import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { LoginService } from '../../../../shared/index';
@Component({
  selector: 'supply-chain-reports',
  templateUrl: './supply-chain-reports.component.html',
  styleUrls: ['./supply-chain-reports.component.scss']
})
export class SupplyChainReportsComponent implements OnInit {
  ID;
  url;
  AuthKey;
  reportID;
  constructor(private sanitizer: DomSanitizer, private service: LoginService) {
    this.reportID = this.service.getSession('reportID');
    this.ID = this.service.getSession('ID');
    this.AuthKey = this.service.getSession('AuthKey');

  }
  ngOnInit() {
    if (this.ID != 0 && this.reportID != 0)
      this.url = this.service.getSession('URL') + '' + "SupplyChainReports/Pages/RdlcReportViewer.aspx?PageId=" + this.reportID + "&ID=" + this.ID + "&AuthKey=" + this.AuthKey + "";
    else
      this.url = this.service.getSession('rptURL');
    $('iframe').attr('src', this.url)
  }
  ngAfterViewInit() {
    if (this.ID != 0 && this.reportID != 0)
      this.url = this.service.getSession('URL') + '' + "SupplyChainReports/Pages/RdlcReportViewer.aspx?PageId=" + this.reportID + "&ID=" + this.ID + "&AuthKey=" + this.AuthKey + "";
    else
      this.url = this.service.getSession('rptURL');
    $('iframe').attr('src', this.url)
  }
}
