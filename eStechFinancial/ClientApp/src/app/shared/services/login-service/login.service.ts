import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Subject } from 'rxjs/Subject';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '../../../shared';

@Injectable()
export class LoginService {

  URL = 'api/Login';
  loggedIn = false;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  
  constructor(private httpRepository: RepositoryHttpService) { }
  //getsystemSettings
  getsystemSettings(id: any) {
    if (id == -1) {
      return this.httpRepository.getData(this.URL + '/allSystemSettings');
    } else {
      return this.httpRepository.getData(this.URL + '/systemSettings?id=' + id + '');
    }
  }
  //getJournalAccounts
  getJournalAccounts() {
    return this.httpRepository.getData(this.URL + '/getJournalAccounts');
  }
  // login
  login(login: string, password_Value: string): Observable<User> {

    // alert(login+','+password_Value);
    return this.httpRepository.getData(this.URL + '/getLogin?login=' + login + '&password_Value=' + password_Value + '')
      .map(res => {
         //console.log(res.json());
        if (res.json() != null) {

          this.setLoggedIn(true);
        } else {
          this.setLoggedIn(false);
        }
        return res.json();


      })
      .catch(this.handleError);
  }
//getLoginInfo
  getLoginInfo(login: string, password_Value: string): Observable<User> {

    // alert(login+','+password_Value);
    return this.httpRepository.getData(this.URL + '/getLoginInfo?login=' + login + '&password_Value=' + password_Value + '')
      .map(res => {
         console.log(res.json());
        if (res.json() != null) {

          this.setLoggedIn(true);
        } else {
          this.setLoggedIn(false);
        }
        return res.json();


      })
      .catch(this.handleError);
  }
  // UserPrivilegedOffice
  UserPrivilegedOffice(userID: any) {
    return this.httpRepository.getData(this.URL + "/UserPrivilegedOffice?userID=" + userID + "");
  }
  // setLoggedIn
  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }
  // logout
  logout() {
    // remove user from local storage to log user outk
    localStorage.removeItem('currentUser');
  }
  // isLogged
  isLogged(value: any): Promise<boolean> {
    if (typeof (Storage) !== 'undefined') {
      if (sessionStorage.getItem(value)) {
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }
  //getSession
  getSession(value: any): string {
    if (typeof (Storage) !== 'undefined') {

      if (sessionStorage.getItem(value)) {
        return sessionStorage.getItem(value);
      }

      return 'undefined';
    }
  }
  // getReportURL
  getReportURL() {
    return this.httpRepository.getData(this.URL + '/getReportURL');
  }
  // getViewerPaths
  getViewerPath() {
    return this.httpRepository.getData(this.URL + '/getViewerPath');
  }
  // getCompanyData
  getCompanyData() {
    return this.httpRepository.getData(this.URL + '/getCompanyData');
  }
  // setSessions
  setSessions(AuthKey: any) {
    //AuthKey = "ab43659f55e7e4f763f33a2dd4f5f98f";
    return this.httpRepository.getData(this.URL + "/setSessions?AuthKey=" + AuthKey + "");
  }
  // setSessions
  setAuthKey(userID: any, authKey: string) {
    return this.httpRepository.getData(this.URL + "/recordAuthKey?userID=" + userID + "&authKey=" + authKey + "");
  }
  // setSessions
  changePassword(userID: any, newpassword: string, oldpassword: string) {
    return this.httpRepository.getData(this.URL + "/changePassword?userID=" + userID + "&password=" + newpassword + "&oldpassword=" + oldpassword + "");
  }
  // setSessions
  changePassword1(userID: any, newpassword: string) {
    return this.httpRepository.getData(this.URL + "/changePassword1?userID=" + userID + "&password=" + newpassword + "");
  }
  //setFavourites
  setFavourites(userid: any, pageid: any, favouriteName: any, sortorder: any) {
    return this.httpRepository.getData(this.URL + "/setFavourites?userID=" + userid + "&pageid=" + pageid + "&favouriteName=" + favouriteName + "&sortorder=" + sortorder);
  }
  //getFavourites
  getFavourites(userid: any) {
    return this.httpRepository.getData(this.URL + "/getFavourites?userID=" + userid);
  }
  //setHomepage
  setHomepage(userid: any, homepage: any) {
    return this.httpRepository.getData(this.URL + "/setHomepage?userID=" + userid + "&homepage=" + homepage);
  }
  //getUserDashboardCards
  getUserDashboardCards(logedInUserID, cardType) {
    return this.httpRepository.getData(this.URL + '?logedInUserID=' + logedInUserID + '&cardType=' + cardType);
  }
  //getTotalSales
  getTotalSales(year: any) {
    return this.httpRepository.getData(this.URL + "/getTotalSales?year=" + year);
  }
  //getTotalPurchase
  getTotalPurchase(year: any) {
    return this.httpRepository.getData(this.URL + "/getTotalPurchase?year=" + year);
  }
  //getTotalSalePurchasePerYear
  getTotalSalePurchasePerYear() {
    return this.httpRepository.getData(this.URL + "/getTotalSalePurchasePerYear");
  }
  //getTotalCustomerPayment
  getTotalCustomerPayment(year: any) {
    return this.httpRepository.getData(this.URL + "/getTotalCustomerPayment?year=" + year);
  }
  //getTotalSupplierPayment
  getTotalSupplierPayment(year: any) {
    return this.httpRepository.getData(this.URL + "/getTotalSupplierPayment?year=" + year);
  }
  //getTotalCustomerSupplierPaymentPerYear
  getTotalCustomerSupplierPaymentPerYear() {
    return this.httpRepository.getData(this.URL + "/getTotalCustomerSupplierPaymentPerYear");
  }
  //getTotalSaleInvoices
  getTotalSaleInvoices() {
    return this.httpRepository.getData(this.URL + "/getTotalSaleInvoices");
  }
  //getTotalPurchaseInvoices
  getTotalPurchaseInvoices() {
    return this.httpRepository.getData(this.URL + "/getTotalPurchaseInvoices");
  }
  //getFavouriteSaleItem
  getFavouriteSaleItem() {
    return this.httpRepository.getData(this.URL + "/getFavouriteSaleItem");
  }
  //getFavouritePurchaseItem
  getFavouritePurchaseItem() {
    return this.httpRepository.getData(this.URL + "/getFavouritePurchaseItem");
  }
  //getFavouriteSaleCustomer
  getFavouriteSaleCustomer() {
    return this.httpRepository.getData(this.URL + "/getFavouriteSaleCustomer");
  }
  //getFavouritePurchaseSupplier
  getFavouritePurchaseSupplier() {
    return this.httpRepository.getData(this.URL + "/getFavouritePurchaseSupplier");
  }
  //getCurrentDay
  getCurrentDay(userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/getCurrentDay?userCurrentOffice=" + userCurrentOffice + "")
  }
  // getUserWarehouse
  getUserWarehouse(officeID: any) {
    return this.httpRepository.getData(this.URL + "/getUserWarehouse?officeID=" + officeID + "");
  }
  //getCurrentOffices
  getCurrentOffices(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.URL + '/getCurrentOffices?userPrivilegedOffice=' + userPrivilegedOffice + '');
  }
  //getCurrentWareshouse
  getCurrentWareshouse(userOffice: any) {
    return this.httpRepository.getData(this.URL + '/getCurrentWareshouse?userOffice=' + userOffice + '');
    }
  //getCurrentFiscalYearInfo
  getCurrentFiscalYearInfo() {
        return this.httpRepository.getData(this.URL + '/getCurrentFiscalYearInfo');
    }
  //getCurrentOpenDay
  getCurrentOpenDay() {
        return this.httpRepository.getData(this.URL + '/getCurrentOpenDay');
    }
  //createLog
  createLog() {
    return this.httpRepository.getData(this.URL + "/createLog");
  }
  // handleError
  private handleError(error: any) {
    const applicationError = error.headers.get('Application-Error');
    const serverError = error.json();
    let modelStateErrors = '';

    if (!serverError.type) {
      console.log(serverError);
      for (const key in serverError) {
        if (key != null) {
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return Observable.throw(applicationError || modelStateErrors || 'Server error');
  }
}
