import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { UUID } from 'angular2-uuid';
import { LoginService, User, CompanySetupService } from '../shared';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  submitted = false;
  isLoading: any = false;
  returnUrl: string;
  user_ID: any;
  login: any; 
  password_Value: any;
  active: any;
  value = '';
  url: any;
  URL: any;
  URL1: any;
  company: any;
  AuthKey: any = "0";
  GUID: any = "0";
  ViewerPath: any;
  viewerPath: any;
  employeeName: any;
  homepage: any;

  constructor(private service: LoginService, private companyService: CompanySetupService, private router: Router) { }

  ngOnInit() {
    ///////////////////// Clea the Local & Session Storage on Login //////////
    localStorage.clear();
    sessionStorage.clear();
    /////////////////////////////////

    this.service.isLogged('user_ID').then((result: boolean) => {
      this.service.isLogged('login').then((res: boolean) => {
        if (result && res) {
          this.router.navigate(['/login']);
        }
      });
    });
    document.getElementById('error').style.display = 'none';
    localStorage.setItem("isLoggedIn", "False");
    localStorage.setItem("userAuthToken", "");
    sessionStorage.setItem('ShowIMEI','0')
  }

  Login(login, password_Value) {   
    this.submitted = true;
    this.isLoading = true;
    this.AuthKey = UUID.UUID();
    this.service.login(login, password_Value)
      .subscribe((o: User) => {
        //console.log(o);
        this.isLoading = false;
        if (o != null) {
          if (typeof (Storage) !== 'undefined') {
            //
            this.setAuthKey(o[0].user_ID);
            /////////
            //Set Sesion Keys
            this.setSessionStorage(o);
            
            //console.log(this.submitted);
            if (this.submitted == true) {
              //console.log('Last');
              if (this.homepage == 'Charts') {
                this.router.navigate(['/charts']);
              }
              else {
                this.router.navigate(['/dashboard']);
              }
            }
            else {
              document.getElementById('error').style.display = 'block';
            }
          }
        } else {
          document.getElementById('error').style.display = 'block';
        }
      });
  }

  setSessionStorage(o: any) {    
    /////////
    this.user_ID = o[0].user_ID;
    this.login = o[0].login;
    this.password_Value = o[0].password_Value;
    this.active = o[0].active;
    this.employeeName = o[0].employeeName;
    this.homepage = o[0].homepage;
    ///
    sessionStorage.setItem('user_ID', o[0].user_ID);
    sessionStorage.setItem('password_Value', o[0].password_Value);
    sessionStorage.setItem('login', o[0].login);
    sessionStorage.setItem('URL', this.URL);
    sessionStorage.setItem('AuthKey', this.AuthKey);
    
    sessionStorage.setItem('employeeName', o[0].employeeName);
    sessionStorage.setItem('user_ID', o[0].user_ID);
    sessionStorage.setItem('userOffice', o[0].userOffice);
    sessionStorage.setItem('userCurrentOffice', o[0].userOffice);
    sessionStorage.setItem('userCurrentOfficeName', o[0].userOfficeName);

    //alert('UserOffice:' + o[0].userOffice);
    sessionStorage.setItem('homepage', o[0].homepage);
    sessionStorage.setItem('defaultModuleId', o[0].defaultModuleId);
    sessionStorage.setItem('userimage', o[0].userimage);
    sessionStorage.setItem('designation', o[0].designation);
    sessionStorage.setItem('f1', '/supplier');
    sessionStorage.setItem('AreaID', '1');
    ///////
    ////Auth Token is a JWT Token issued at the time of Login and used in header of each request to authenticate
    localStorage.setItem("userAuthToken", o[0].authtoken);
    localStorage.setItem("isLoggedin", "True");
    //////////////
    let token = localStorage.getItem("userAuthToken");
    //console.log(token);
    
    //////////////
    //console.log('one');
    //Get UserPrivilegedOffice
    this.setOfficeAndWarehouse(o);
    //console.log('2');
    //Set Current Open Day
    this.setCurrentDay(o);
    //console.log('3');
    //Set Current Finscal Year 
    this.setCurrentFiscalYearInfo(o);

    /// Set Company Settings
    this.getCompanyData(o);
    //console.log('company');
  }

  setOfficeAndWarehouse(o: any) {
    //Set Office
    this.service.UserPrivilegedOffice(o[0].user_ID)
  .subscribe(response => {
    if (response.json() !== null) {
      var list = response.json();
      sessionStorage.setItem('userPrivilegedOffice', list[0].userPrivilegedOffice);
    }
    else {
      sessionStorage.setItem('userPrivilegedOffice', '1');
    }
  });

//Set Current WarehouseID
this.service.getUserWarehouse(o[0].userOffice)
  .subscribe(response => {
    if (response.json() !== null) {
    var warehouse = (response.json());
    sessionStorage.setItem('userWarehouse', warehouse[0].warehouseID);
    sessionStorage.setItem('userCurrentWarehouse', warehouse[0].warehouseID);
    }
  });

  }

  setCurrentDay(o:any) {
    this.service.getCurrentDay(o[0].userOffice)
      .subscribe(response => {
        if (response.json() !== null) {
        var dayEndDetail = (response.json());
        sessionStorage.setItem('openDay', dayEndDetail[0].poS_Day);
        sessionStorage.setItem('currentOpenDay', dayEndDetail[0].poS_Day);
        }
      });
  }

  setCurrentFiscalYearInfo(o: any) {
    this.service.getCurrentFiscalYearInfo()
      .subscribe(response => {
        if (response.json() !== null) {
        var fiscalYearDetail = (response.json());
        if (fiscalYearDetail != null) {
          //console.log(response.json());
          sessionStorage.setItem('fiscalYear', fiscalYearDetail[0].fiscalYear);
          sessionStorage.setItem('startDate', fiscalYearDetail[0].startDate);
          sessionStorage.setItem('endDate', fiscalYearDetail[0].endDate);
          sessionStorage.setItem('fiscalOpenDay', fiscalYearDetail[0].openDay);
          sessionStorage.setItem('currentDate', fiscalYearDetail[0].currentDate);
        }
      }
      });
  }

  getCompanyData(o: any) {   
    this.service.getCompanyData()
      .subscribe(response => {
        if (response.json() !== null) {
        this.company = (response.json());
        sessionStorage.setItem('isTaxable', this.company[0].isTaxable);
        sessionStorage.setItem('taxRate', this.company[0].taxRate);
        }
      });
        //  console.log(response);
        //getDefaultCompany
        this.companyService.getDefaultCompany().subscribe(c => {
          if (c.json() !== null) {
          let CompanySetting = c.json();
          if (CompanySetting != null) {
            sessionStorage.setItem('CompanyName', CompanySetting[0].companY_Name);
            sessionStorage.setItem('CompanyAddress', CompanySetting[0].address);
            sessionStorage.setItem('CompanyNote', CompanySetting[0].companY_Note);
          }
        }
        });
            //getsystemSettings
            this.service.getsystemSettings(-1).subscribe(r => {
              if (r.json() !== null) {
              let localSetting = r.json();
              if (localSetting != null) {
                //Set All Settings Sessions
                for (let i = 0; i < localSetting.length; i++) {
                  sessionStorage.setItem(localSetting[i]['setting_Name'], localSetting[i].setting_Value); 0
                }
                //showpdf
                sessionStorage.setItem('ReportView', sessionStorage.getItem("ShowPDF"));
                //ShowPendingSale
                sessionStorage.setItem('settingShowPending', sessionStorage.getItem("ShowPendingSale"));
                //ShowStock
                sessionStorage.setItem('settingShowStock', sessionStorage.getItem("ShowStock"));
                //AllowGRNonPInvoice
                sessionStorage.setItem('settingGRNonInvoice', sessionStorage.getItem("AllowGRNonInvoice"));
                //RestrictPaymentInvoiceWise
                sessionStorage.setItem('settingPaymentInvoiceWise', sessionStorage.getItem("RestrictPaymentInvoiceWise"));
                //RestrictReceiptInvoiceWise
                sessionStorage.setItem('settingReceiptInvoiceWise', sessionStorage.getItem("RestrictReceiptInvoiceWise"));
                //AllowSaleInvoiceBeforeGDN
                sessionStorage.setItem('settingInvoiceBeforeGDN', sessionStorage.getItem("AllowSaleInvoiceBeforeGDN"));
                //AllowPurchaseInvoiceBeforeGRN
                sessionStorage.setItem('settingInvoiceBeforeGRN', sessionStorage.getItem("AllowPurchaseInvoiceBeforeGRN"));
                //AllowGRNBeforeInvoice
                sessionStorage.setItem('settingGRNBeforeInvoice', sessionStorage.getItem("AllowGRNBeforeInvoice"));
                //AllowGDNBeforeInvoice
                sessionStorage.setItem('settingGDNBeforeInvoice', sessionStorage.getItem("AllowGDNBeforeInvoice"));
                //AllowGDNonInvoice
                sessionStorage.setItem('settingGDNonInvoice', sessionStorage.getItem("AllowGDNonInvoice"));
                //AllowExchange
                sessionStorage.setItem('settingAllowExchange', sessionStorage.getItem("AllowExchange"));
                //ShowExchangeForReports
                sessionStorage.setItem('ShowExchangeOnReports', sessionStorage.getItem("AllowExchange"));
                //AllowAdvancePayment
                sessionStorage.setItem('settingAllowAdvancePayment', sessionStorage.getItem("AllowAdvancePayment"));
                //AllowAdvanceReceipt
                sessionStorage.setItem('settingAllowAdvanceReceipt', sessionStorage.getItem("AllowAdvanceReceipt"));
                //AllowPriceList
                sessionStorage.setItem('settingAllowPriceList', sessionStorage.getItem("AllowPriceList"));
                //AllowTaxOnPurchase
                sessionStorage.setItem('settingTaxOnPurchase', sessionStorage.getItem("AllowTaxOnPurchase"));
                //AllowTaxOnSale
                sessionStorage.setItem('settingTaxOnSale', sessionStorage.getItem("AllowTaxOnSale"));
                //AllowInvoiceReports
                sessionStorage.setItem('settingInvoiceReports', sessionStorage.getItem("AllowInvoiceReports"));
                //AllowInvoiceWithReceipt
                sessionStorage.setItem('settingInvoiceWithReceipt', sessionStorage.getItem("AllowInvoiceWithReceipt"));

                if (sessionStorage.getItem("ShowLiveReports") == "1") {
                  sessionStorage.setItem('BaseUrl', sessionStorage.getItem("LiveReportUrl"));
                } else {
                  sessionStorage.setItem('BaseUrl', sessionStorage.getItem("LocalReportUrl"));
                }

                this.submitted = true;
                //getJournalAccounts
                this.service.getJournalAccounts().subscribe(r => {
                  let accounts = r.json();
                  if (accounts != null) {
                    for (let i = 0; i < accounts.length; i++) {
                      sessionStorage.setItem(accounts[i]['account_Title'], accounts[i].account_Code);
                    }
                    this.isLoading = false;
                    this.submitted = true;
                  }
                  
                });
              }
            }
            });
    this.submitted = true;

  }

  setAuthKey(userid:any) {
    //////////////////////
    //this.service.setSessions(this.AuthKey)
    //  .subscribe(response => {
    //    //  console.log(response);
    //    this.URL1 = (response.toString());
    //  });
    ////////////////////////
    this.service.setAuthKey(userid, this.AuthKey)
      .subscribe(response => {
       

      });
    this.submitted = true;

  }

}
