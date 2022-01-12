import { Injectable } from '@angular/core';
import { RepositoryHttpService } from '@services/repositoryHttp.service';

@Injectable()
export class SCMReportService {

  url = 'api/DropDowns';
  url1 = 'api/Reports';
  constructor(private httpRepository: RepositoryHttpService) { }

  getOffice(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + '/office?userPrivilegedOffice=' + userPrivilegedOffice + '');
  }

  getOfficers(userPrivilegedOffice: any) {
    return this.httpRepository.getData(this.url + "/getOfficers?userPrivilegedOffice=" + userPrivilegedOffice + "")
  }

  GetWarehouse(OfficeId: any) {
    return this.httpRepository.getData(this.url + '/GetWarehouse?OfficeId=' + OfficeId + '');
  }

  getCustomer() {
    return this.httpRepository.getData(this.url + '/customer');
  }
  getCustomerCategory() {
    return this.httpRepository.getData(this.url + '/customercategory');
  }
  getSubject() {
    return this.httpRepository.getData(this.url + '/subject');
  }
  getSupplier() {
    return this.httpRepository.getData(this.url + '/supplier');
  }
  getCity() {
    return this.httpRepository.getData(this.url + '/city');
  }
  toDatabase(body) {
   return this.httpRepository.create(this.url1, body);
  }
  getPage() {
    return this.httpRepository.getData(this.url + '/page');
  }
  getRegions() {
    return this.httpRepository.getData(this.url + '/regions');
  }
  loadRegions(ProvinceId: any) {
    return this.httpRepository.getData(this.url + '/regions?ProvinceId=' + ProvinceId);
  }
  getProvinces() {
    return this.httpRepository.getData(this.url + '/provinces');
  }
  GetProvinceCity(pid: any) {
    return this.httpRepository.getData(this.url + '/provincecity?id=' + pid);
  }

  getArea(rid: any) {
    if (rid == -1) {

      return this.httpRepository.getData(this.url + '/areas');
    } else {
      return this.httpRepository.getData(this.url + '/areas?rid=' + rid);
    }
  }

  getDistricts() {
    return this.httpRepository.getData(this.url + '/district');
  }
  getItem() {
    return this.httpRepository.getData(this.url + '/item');
  }
  getItemCategory() {
    return this.httpRepository.getData(this.url + '/itemcategory');
  }
  getItemSubCategory() {
    return this.httpRepository.getData(this.url + '/itemsubcategory');
  }
  // FIS DROPDOWNS
  getLevels() {
    return this.httpRepository.getData(this.url + '/accountlevels');
  }
  getAccounts(leveL_CODE: any) {
    return this.httpRepository.getData(this.url + '/accounts?leveL_CODE=' + leveL_CODE + '');
  }
  getBankAccounts(accT_TYPE_CODE: any) {
    return this.httpRepository.getData(this.url + '/getBankAccounts?accT_TYPE_CODE=' + accT_TYPE_CODE + '');
  }
  getVoucherTypes() {
    return this.httpRepository.getData(this.url + '/voucherTypes');
  }
  getledgerStatus() {
    return this.httpRepository.getData(this.url + '/ledgerStatus');
  }
  getvoucherStatuses() {
    return this.httpRepository.getData(this.url + '/voucherStatuses');
  }
  getVouchers() {
    return this.httpRepository.getData(this.url + '/vouchers');
  }
  getFiscalYear() {
    return this.httpRepository.getData(this.url + '/fiscalYear');
  }

  getCompany() {
    return this.httpRepository.getData(this.url + "/getCompany")
  }
  getDepartments() {
    return this.httpRepository.getData(this.url + '/getDepartments');
  }
  getDesignations() {
    return this.httpRepository.getData(this.url + '/getDesignations');
  }
  getCategories() {
    return this.httpRepository.getData(this.url + '/getCategories');
  }
  getEmployees() {
    return this.httpRepository.getData(this.url + '/getEmployees');
  }
  getEmploymentTypies() {
    return this.httpRepository.getData(this.url + '/getEmploymentTypies');
  }
  getGenders() {
    return this.httpRepository.getData(this.url + '/getGenders');
  }
  getFiscalDates(FY: string) {
    return this.httpRepository.getData(this.url + '/getFiscalDates?FY=' + FY + '');
  }

}
