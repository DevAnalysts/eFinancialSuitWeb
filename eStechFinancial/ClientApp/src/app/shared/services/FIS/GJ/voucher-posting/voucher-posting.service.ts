import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { voucher } from '../../../../../shared';

@Injectable()
export class VoucherPostingService {

  URL = 'api/VoucherPosting';
  
  constructor(private httpRepository: RepositoryHttpService) { }

  //getVoucherPosting
  getVoucherPosting(voucher_ID:any, userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getVoucherPosting?voucher_ID=" + voucher_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //voucherPosting
  voucherPosting(json: any) {
    let body = JSON.stringify(json);
    return this.httpRepository.getData(this.URL + "/voucherPosting?json=" + body + "");

  }

}
