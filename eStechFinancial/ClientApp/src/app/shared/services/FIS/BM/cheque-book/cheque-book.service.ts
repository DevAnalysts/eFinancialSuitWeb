import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { chequeBook } from '../../../../../shared';

@Injectable()
export class ChequeBookService {

    URL = 'api/chequeBook';
    
    constructor(private httpRepository: RepositoryHttpService) { }


    //ifexists
    ifexists(chequeBookID){
        return this.httpRepository.getData(this.URL + "/ifexists?chequeBookID=" + chequeBookID + "");
    }
    //getChequeBooks
    getChequeBooks(chequeBookID) {
        return this.httpRepository.getData(this.URL + "/getChequeBooks?chequeBookID=" + chequeBookID + "");
    }
    //getChequeCancel
    getChequeCancel(chequeBookID) {
        return this.httpRepository.getData(this.URL + "/getChequeCancel?chequeBookID=" + chequeBookID + "");
    }
    //getDetails
    getDetails(banK_CODE: any, brancH_CODE: any, accounT_CODE: any) {
        return this.httpRepository.getData(this.URL + "/getDetails?banK_CODE=" + banK_CODE + "&brancH_CODE=" + brancH_CODE + "&accounT_CODE=" + accounT_CODE + "");
    }
    //getBanks
    getBanks() {
        return this.httpRepository.getData(this.URL + "/getBanks");
    }
    //getBankBranches
    getBankBranches(banK_CODE: any) {
        return this.httpRepository.getData(this.URL + "/getBankBranches?banK_CODE=" + banK_CODE + "");
    }
    //getAccounts
    getAccounts(brancH_CODE) {
        return this.httpRepository.getData(this.URL + "/getAccounts?brancH_CODE=" + brancH_CODE + "");
    }
    //getOffices
    getOffices() {
        return this.httpRepository.getData(this.URL + "/getOffices");
    }
    //getAccountInfo
    getAccountInfo(coA_GROUP: any, accounT_CODE: any) {
        return this.httpRepository.getData(this.URL + "/getAccountInfo?coA_GROUP=" + coA_GROUP + "&accounT_CODE=" + accounT_CODE + "");
    }
    //finishChequeBooks
    finishChequeBooks(){
        return this.httpRepository.getData(this.URL + "/finishChequeBooks");
    }
    //getAccountsForChequeBookCancel
    getAccountsForChequeBookCancel(brancH_CODE){
        return this.httpRepository.getData(this.URL + "/getAccountsForChequeBookCancel?brancH_CODE=" + brancH_CODE + "");
    }
    //saveChequeBooks
    saveChequeBooks(chequeBook: any): Promise<any> {
        let body = JSON.stringify(chequeBook);
        // alert(body);
         return this.httpRepository.create(this.URL, chequeBook )
            .toPromise()
            .then(res => res.json() as chequeBook)
            .catch()
    }
    //updateChequeBooks
    updateChequeBooks(chequeBook: any): Promise<any> {
        let body = JSON.stringify(chequeBook);
        // alert(body);
        return this.httpRepository.update(this.URL, chequeBook )
            .toPromise()
            .then(res => res.json() as chequeBook)
            .catch()
    }
    //getDetailsByID
    getDetailsByID(chequeBookID: Number): Observable<chequeBook> {
        return this.httpRepository.getData(this.URL + "/getDetailsByID?chequeBookID=" + chequeBookID + "")
            .map((res) => {
                return res.json()[0];
            })
            .catch(this.handleError);
    }
    //getCancelDetailsByID
    getCancelDetailsByID(chequeBookID: Number): Observable<chequeBook> {
        return this.httpRepository.getData(this.URL + "/getCancelDetailsByID?chequeBookID=" + chequeBookID + "")
            .map((res) => {
                return res.json()[0];
            })
            .catch(this.handleError);
    }
    //updateCancel
    updateCancel(json: any) {
        let body = JSON.stringify(json);
        return this.httpRepository.getData(this.URL + "/updateCancel?json=" + body + "");
    }
    //cancelChequeBooks
    cancelChequeBooks(ID: any, actionID: any) {
        return this.httpRepository.getData(this.URL + "/cancelChequeBooks?ID=" + ID + "&actionID=" + actionID + "")
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
