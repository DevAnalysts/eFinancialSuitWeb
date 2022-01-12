import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
 
import { Observable } from 'rxjs/Observable';
//import { ItemsAdjustment } from '../../../../shared';

@Injectable()
export class SearchFilterService {

  URL = 'api/SearchFilter';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //SearchCustomerDropDown
  SearchCustomerDropDown(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerDropDown?Query=" + Query)
  }
  //SearchCustomerByID
  SearchCustomerByID(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerByID?Query=" + Query)
  }
  //SearchCustomerLookUp
  SearchCustomerLookUp(Name: any, City: any, Cell: any, Phone: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerLookUp?Name=" + Name + "&City=" + City + "&Cell=" + Cell + "&Phone=" + Phone)
  }

  //SearchCustomerDropDownByArea
  SearchCustomerDropDownByArea(Query: any, Area: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerDropDownByArea?Query=" + Query + "&Area=" + Area)
  }
  //SearchCustomerByIDAndArea
  SearchCustomerByIDAndArea(Query: any, Area: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerByIDAndArea?Query=" + Query + "&Area=" + Area)
  }
  //SearchCustomerDropDownByCategory
  SearchCustomerDropDownByCategory(Query: any, Category: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerDropDownByCategory?Query=" + Query + "&Category=" + Category)
  }
  //SearchCustomerByIDAndCategory
  SearchCustomerByIDAndCategory(Query: any, Category: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerByIDAndCategory?Query=" + Query + "&Category=" + Category)
  }
  //SearchCustomerDropDownByCategoryForEmail
  SearchCustomerDropDownByCategoryForEmail(Query: any, Category: any) {
    return this.httpRepository.getData(this.URL + "/SearchCustomerDropDownByCategoryForEmail?Query=" + Query + "&Category=" + Category)
  }
  /////////////////////////////////////////////////////////////////////////
  //SearchItemDropDown
  SearchItemDropDown(Query: any, Status: any, Stock: any, userCurrentOffice: any, userCurrentWarehouse: any) {
    return this.httpRepository.getData(this.URL + "/SearchItemDropDown?Query=" + Query + "&Status=" + Status + "&Stock=" + Stock + "&userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "")
  }

  //SearchItemByID
  SearchItemByID(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchItemByID?Query=" + Query)
  }

  //SearchSupplierDropDown
  SearchSupplierDropDown(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchSupplierDropDown?Query=" + Query)
  }
  //SearchSupplierByID
  SearchSupplierByID(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchSupplierByID?Query=" + Query)
  }

  //SearchRefDropDown
  SearchRefDropDown(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchRefDropDown?Query=" + Query)
  }
  //SearchRefByID
  SearchRefByID(Query: any) {
    return this.httpRepository.getData(this.URL + "/SearchRefByID?Query=" + Query)
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  //SearchSaleInvoiceDropDown
  SearchSaleInvoiceDropDown(Query: any, customer_ID: any, userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/SearchSaleInvoiceDropDown?Query=" + Query + "&customer_ID=" + customer_ID + "&userCurrentOffice=" + userCurrentOffice)
  }
  //SearchSaleInvoiceByID
  SearchSaleInvoiceByID(Query: any, customer_ID: any) {
    return this.httpRepository.getData(this.URL + "/SearchSaleInvoiceByID?Query=" + Query)
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////
  //SearchPurchaseInvoiceDropDown
  SearchPurchaseInvoiceDropDown(Query: any, supplier_ID: any, userCurrentOffice: any) {
    return this.httpRepository.getData(this.URL + "/SearchPurchaseInvoiceDropDown?Query=" + Query + "&supplier_ID=" + supplier_ID + "&userCurrentOffice=" + userCurrentOffice)
  }
  //SearchPurchaseInvoiceByID
  SearchPurchaseInvoiceByID(Query: any, supplier_ID: any) {
    return this.httpRepository.getData(this.URL + "/SearchPurchaseInvoiceByID?Query=" + Query)
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
