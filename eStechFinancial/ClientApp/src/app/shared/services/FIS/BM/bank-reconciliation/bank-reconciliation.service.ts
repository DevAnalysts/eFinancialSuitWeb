import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { bankReconciliation } from '../../../../../shared';

@Injectable()
export class BankReconciliationService {

    URL = 'api/bankReconciliation';
    

    constructor(private httpRepository: RepositoryHttpService) { }
    //getReconciliations
    getReconciliations(reconciliationID: any, userPrivilegedOffice: any) {
        return this.httpRepository.getData(this.URL + "/getReconciliations?reconciliationID=" + reconciliationID + "&userPrivilegedOffice=" + userPrivilegedOffice + "");
    }
    //getOffices
    getOffices(userPrivilegedOffice: any) {
        return this.httpRepository.getData(this.URL + "/getOffices?userPrivilegedOffice=" + userPrivilegedOffice + "");
    }
    //getAccounts
    getAccounts() {
        return this.httpRepository.getData(this.URL + "/getAccounts");
    }
    //getVoucherDetails
    getVoucherDetails(accounT_CODE: any) {
        return this.httpRepository.getData(this.URL + "/getVoucherDetails?accounT_CODE=" + accounT_CODE + "");
    }
    //getBPVoucherDetails
    getBPVoucherDetails(accounT_CODE: any) {
        return this.httpRepository.getData(this.URL + "/getBPVoucherDetails?accounT_CODE=" + accounT_CODE + "");
    }
    //getVoucherDetail
    getVoucherDetail(accounT_CODE: any) {
        return this.httpRepository.getData(this.URL + "/getVoucherDetail?accounT_CODE=" + accounT_CODE + "");
    }
    //saveBankReconciliation
    saveBankReconciliation(bankReconciliation: any): Promise<any> {
        let body = JSON.stringify(bankReconciliation);
        // alert(body);
         return this.httpRepository.create(this.URL, bankReconciliation )
            .toPromise()
            .then(res => res.json() as bankReconciliation)
            .catch()
    }
    //updateBankReconciliation
    updateBankReconciliation(bankReconciliation: any): Promise<any> {
        let body = JSON.stringify(bankReconciliation);
        // alert(body);
        return this.httpRepository.update(this.URL, bankReconciliation )
            .toPromise()
            .then(res => res.json() as bankReconciliation)
            .catch()
    }
    //changeVoucherStatus
    changeApproveStatus(ID: any, Status: any) {
        return this.httpRepository.getData(this.URL + "/changeApproveStatus?ID=" + ID + "&Status=" + Status);
    }
    //getDetailsByID
    getDetailsByID(reconciliationID: Number): Observable<bankReconciliation> {
        return this.httpRepository.getData(this.URL + "/getDetailsByID?reconciliationID=" + reconciliationID + "")
            .map((res) => {
                return res.json()[0];
            })
            .catch(this.handleError);
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
    //getLedgerBalance
    getLedgerBalance(office: any, account: any) {
        return this.httpRepository.getData(this.URL + "/getLedgerBalance?office=" + office + "&account=" + account);
    }
}
