
import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { StockOpeningBalance} from '../../../../models/SupplyChain/Inventory/StockOpeningBalance';
 
import { Observable } from 'rxjs/Observable';
import { ItemSort } from '../../../../../shared';

@Injectable()
export class StockOpeningBalanceService {

  URL = 'api/ItemRegistration';
   
   constructor(private httpRepository: RepositoryHttpService) { }


  //getItem
  getJournalVouchers(voucheR_ID: any, userPrivilegedOffice:any) {
    return this.httpRepository.getData(this.URL + "/getJournalVouchers?voucheR_ID=" + voucheR_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getStockOpeningBalance
  getStockOpeningBalance(voucheR_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + "/getStockOpeningBalance?voucheR_ID=" + voucheR_ID + " &userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  
  //getOffices
  getOffices(userPrivilegedOffice :any) {
    return this.httpRepository.getData(this.URL + "/getOffices?userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  getWarehouses(userPrivilegedOffice :any) {
    return this.httpRepository.getData(this.URL + "/getWarehouses?userPrivilegedOffice=" + userPrivilegedOffice + "");
  }
  //getChangeOffices
  getChangeOffices(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeOffices?officE_CODE=" + officE_CODE + "");
  }
  //getBanks
  //getMeasurementType
  getUnits(itemCode) {
    return this.httpRepository.getData(this.URL + "/getUnits?itemCode=" + itemCode + "")
  }
   //getpackingTypies
   getpackingTypies1() {
    return this.httpRepository.getData(this.URL + "/getpackingTypies")
  }
  //getAccounts
  getAccounts(officE_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getAccounts?officE_CODE=" + officE_CODE + "");
  }
 
  //getChangeAccounts
  getChangeAccounts(accounT_CODE: any) {
    return this.httpRepository.getData(this.URL + "/getChangeAccounts?accounT_CODE=" + accounT_CODE + "");
  }
  
  //saveVoucher
  saveVoucher(voucher: any): Promise<any> {
    let body = JSON.stringify(voucher);
    // alert(body);
     return this.httpRepository.create(this.URL + "/saveStock", voucher )
      .toPromise()
      .then(res => res.json() as StockOpeningBalance)
      .catch()
  }
  //updateVoucher
  updateVoucher(voucher: any): Promise<any> {
    let body = JSON.stringify(voucher);
    //alert(body);
    return this.httpRepository.update(this.URL, voucher )
      .toPromise()
      .then(res => res.json() as StockOpeningBalance)
      .catch()
  }
  //getDetailsByID
  getDetailsByID(voucher_ID: any): Observable<StockOpeningBalance> {
    return this.httpRepository.getData(this.URL + "/getDetailsByID?voucher_ID=" + voucher_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }
  
  //IfExists
  IfExists(fiN_YR: any) {
    return this.httpRepository.getData(this.URL + "/IfExists?fiN_YR=" + fiN_YR + "")
  }
  //getSupplier
  
  //changeVoucherStatus
  changeVoucherStatus(ID: any, Status: any, User: any) {
    return this.httpRepository.getData(this.URL + "/changeVoucherStatus?ID=" + ID + "&Status=" + Status + "&User=" + User);
  }
  //handleError
  private handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');
    var serverError = error.json();
    var modelStateErrors: string = '';

    if (!serverError.type) {
      console.log(serverError);
      for (var key in serverError) {
        if (serverError[key])
          modelStateErrors += serverError[key] + '\n';
      }
    }
    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }



}
