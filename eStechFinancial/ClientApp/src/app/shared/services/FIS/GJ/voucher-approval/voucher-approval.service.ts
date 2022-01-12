import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { voucher } from '../../../../../shared';

@Injectable()
export class VoucherApprovalService {

  URL = 'api/VoucherApproval';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getVoucherApproval
  getVoucherApproval(voucher_ID: any, userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getVoucherApproval?voucher_ID=" + voucher_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //voucherApproval
  voucherApproval(json: any) {
    let body = JSON.stringify(json);
    return this.httpRepository.getData(this.URL + "/voucherApproval?json=" + body + "");
  }
}
