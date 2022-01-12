import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { Observable } from 'rxjs/Observable';
import { saleInvoice } from '../../../../../shared';


@Injectable()
export class SaleInvoiceService {

  url = 'api/SaleInvoice';

  constructor(private httpRepository: RepositoryHttpService) { }

  //getInvoives
  getInvoives() {
    return this.httpRepository.getData(this.url + "/getSaleInvoices")
  }
  //searchSaleInvoices
  searchSaleInvoices(sale_Invoice_ID: any, userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/searchSaleInvoices?sale_Invoice_ID=" + sale_Invoice_ID + "&userPrivilegedOffice=" + userPrivilegedOffice + "")
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
  //getTaxRates
  getTaxRates() {
    return this.httpRepository.getData(this.url + "/getTaxRates")
  }
  //getPendingCustomer
  getPendingCustomer(Area: any, priviledged_Offices: any, sale_Order_ID: any, mode: any, allowInvoice: any, invoicedate: any) {
    return this.httpRepository.getData(this.url + "/getPendingCustomer?Area=" + Area + "&priviledged_Offices=" + priviledged_Offices + "&sale_Order_ID=" + sale_Order_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "&invoicedate=" + invoicedate + "")
  }
  //getContacts
  getContacts(customer_ID: Number) {
    return this.httpRepository.getData(this.url + "/getContacts?customer_ID=" + customer_ID + "")
  }
  //getRefCustomers
  getRefCustomers(customer_ID: Number, sale_Order_ID) {
    return this.httpRepository.getData(this.url + "/getRefCustomers?customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "")
  }
  //getPendingOrder
  getPendingOrder(priviledged_Offices: any, customer_ID: any, sale_Order_ID: any, goods_Supply_ID: any, mode: any, allowInvoice: any, invoicedate: any) {
    console.log(invoicedate);
    return this.httpRepository.getData(this.url + "/getPendingOrder?priviledged_Offices=" + priviledged_Offices + "&customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "&goods_Supply_ID=" + goods_Supply_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "&invoicedate=" + invoicedate + "")
  }
  getCustomers() {
    return this.httpRepository.getData(this.url + "/getCustomers")
  }
  //getPendingOrderDetails
  getPendingOrderDetails(userCurrentOffice: any, userCurrentWarehouse: any, customer_ID: any, sale_Order_ID: any, sale_Invoice_ID: any, goods_Supply_ID: any, mode: any, allowInvoice: any) {
    return this.httpRepository.getData(this.url + "/getPendingOrderDetails?userCurrentOffice=" + userCurrentOffice + "&userCurrentWarehouse=" + userCurrentWarehouse + "&customer_ID=" + customer_ID + "&sale_Order_ID=" + sale_Order_ID + "&sale_Invoice_ID=" + sale_Invoice_ID + "&goods_Supply_ID=" + goods_Supply_ID + "&mode=" + mode + "&allowInvoice=" + allowInvoice + "")
  }
  //IfPaymentExists
  IfPaymentExists(sale_Invoice_ID: any) {
    return this.httpRepository.getData(this.url + "/IfPaymentExists?sale_Invoice_ID=" + sale_Invoice_ID + "")
  }
  //IfVoucherExists
  IfVoucherExists(voucher_ID: any) {
    return this.httpRepository.getData(this.url + "/IfVoucherExists?voucher_ID=" + voucher_ID + "")
  }
  //IfExists
  IfExists(sale_Order_ID: any) {
    return this.httpRepository.getData(this.url + "/IfExists?sale_Order_ID=" + sale_Order_ID + "")
  }
  //guidExist
  guidExist(guid: any) {
    return this.httpRepository.getData(this.url + "/guidExist?guid=" + guid + "")
  }
  getUnits() {
    return this.httpRepository.getData(this.url + "/getUnits")
  }
  //cancelInvoice
  cancelInvoice(ID: any, actionID: any) {
    return this.httpRepository.getData(this.url + "/cancelInvoice?ID=" + ID + "&actionID=" + actionID + "")
  }
  //getCompanyTemplate 
  getCompanyTemplate(OfficeId: any, PageCode: any, IsSaleTaxInv: any) {
    return this.httpRepository.getData(this.url + "/getCompanyTemplate?OfficeId=" + OfficeId + "&PageCode=" + PageCode + "&IsSaleTaxInv=" + IsSaleTaxInv)
  }

 

  //saveInvoice
  saveInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    //  alert(body);
    return this.httpRepository.create(this.url, invoice)
      .toPromise()
      .then(res => res.json() as saleInvoice)
      .catch()
  }
  //updateInvoice
  updateInvoice(invoice: any): Promise<any> {
    let body = JSON.stringify(invoice);
    // alert(body);
    return this.httpRepository.update(this.url, invoice)
      .toPromise()
      .then(res => res.json() as saleInvoice)
      .catch()
  }
  //GetCompanyTemplateForViewReport
  getCompanyTemplateForViewReport(id)
  {
    return this.httpRepository.getData(this.url + "/getCompanyTemplateForViewReport?InvoiceId=" + id + "")
  }
  //getCustomerEmail
  getCustomerEmail(ID: any) {
    return this.httpRepository.getData(this.url + "/getCustomerEmail?ID=" + ID + "")
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


