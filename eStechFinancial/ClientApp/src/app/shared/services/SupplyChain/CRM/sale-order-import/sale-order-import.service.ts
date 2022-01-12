import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { saleInvoice } from '../../../../../shared';


@Injectable()
export class SaleOrderImportService {

  url = 'api/SaleOrderImport';
   
   constructor(private httpRepository: RepositoryHttpService) { }

  //getInvoives
  getInvoives() {
    return this.httpRepository.getData(this.url + "/getSaleInvoices")
  }
  //searchSaleInvoices
  searchSaleInvoices(sale_Invoice_ID: any) {
    return this.httpRepository.getData(this.url + "/searchSaleInvoices?sale_Invoice_ID=" + sale_Invoice_ID + "")
  }
  //getInvoiceDetailsByID
  getInvoiceDetailsByID(sale_Invoice_ID: Number): Observable<saleInvoice> {
    return this.httpRepository.getData(this.url + "/getInvoiceDetailsByID?invoice_ID=" + sale_Invoice_ID + "")
      .map((res) => {
        return res.json()[0];
      })
      .catch(this.handleError);
  }

  //getArea
  getArea() {
    return this.httpRepository.getData(this.url + "/getArea")
  }
  //getPendingCustomer
  getPendingCustomer(Area: any, orderdate: any, mode: any) {
    return this.httpRepository.getData(this.url + "/getPendingCustomer?Area=" + Area + "&orderdate=" + orderdate + "&mode=" + mode + "")
  }
  //getPendingOrder
  getPendingOrder(priviledged_Offices: any, customer_ID: any, sale_Order_ID: any, mode: any, allowInvoice: any, invoicedate: any) {
    console.log(invoicedate);
    return this.httpRepository.getData(this.url + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "&invoicedate=" + invoicedate + "")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any, sale_Order_ID: any, sale_Invoice_ID: any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrderDetails?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "&sale_Invoice_ID=" + sale_Invoice_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //IfPaymentExists
  IfPaymentExists(sale_Invoice_ID: any) {
    return this.httpRepository.getData(this.url + "/IfPaymentExists?sale_Invoice_ID=" + sale_Invoice_ID + "")
  }
  //IfExists
  IfExists(sale_Order_ID: any) {
    return this.httpRepository.getData(this.url + "/IfExists?sale_Order_ID=" + sale_Order_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.url + "/guidExist?guid=" + guid + "")
  }
  //cancelInvoice
  cancelInvoice(ID: any, actionID: any) {
    return this.httpRepository.getData(this.url + "/cancelInvoice?ID=" + ID + "&actionID=" + actionID + "")
  }
  //getCompanyTemplate
  getCompanyTemplate() {
    return this.httpRepository.getData(this.url + "/getCompanyTemplate")
  }
  //saveInvoice
  saveInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    //  alert(body);
   return this.httpRepository.create(this.url, invoice )
      .toPromise()
      .then(res => res.json() as saleInvoice)
      .catch()
  }
  //updateInvoice
  updateInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    // alert(body);
    return this.httpRepository.update(this.url, invoice )
      .toPromise()
      .then(res => res.json() as saleInvoice)
      .catch()
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


  //-----------------------//
  //getPendingSaleOrder
  getPendingSaleOrder(AreaID: any, OrderDate: any, userCurrentOffice:any) {
    return this.httpRepository.getData(this.url + "/getPendingSaleOrder?AreaID=" + AreaID + "&OrderDate=" + OrderDate + "&userCurrentOffice=" + userCurrentOffice + "")
  }
  //getPendingSaleOrderDetail
  getPendingSaleOrderDetail(customer_ID: any, sale_Order_ID: any, userCurrentOffice:any) {
    return this.httpRepository.getData(this.url + "/getPendingSaleOrderDetail?customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "&userCurrentOffice=" + userCurrentOffice + "")
  }
}


