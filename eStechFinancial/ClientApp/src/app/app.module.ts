import { JournalAccount } from './shared/models/Admin/JournalAccount';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgSelect2Module } from 'ng-select2';
import { AngularMyDatePickerModule  } from 'angular-mydatepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { FullComponent } from './layouts/full/full.component';
import { NavigationComponent } from './shared/header-navigation/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { JwtModule } from "@auth0/angular-jwt";
import {
  HeaderService, LoginService, SCMReportService, ReportService, SCMReportViewerService, ReportViewerService, CardService, PurchaseOrderService, SaleOrderService, PurchaseInvoiceService, PurchaseReturnNoteService, PurchaseReturnInvoiceService, SupplierPaymentService, SaleReturnNoteService, SaleReturnInvoiceService, SaleInvoiceService, CustomerReceiptService, GoodsReceiptsNoteService, GoodsDispatchNoteService, ItemRegistrationService, SupplierService, CustomerService, RecipeCardService, ProductAssemblyService, ProductDisassemblyService, FiscalYearService, FiscalPeriodService, BankBranchService, BankAccountService, JournalVoucherService, ChartOfAccountService, VoucherApprovalService, VoucherPostingService, ChequeBookService, BankReconciliationService, UserService, RoleService, UserRoleService, ReportSettingService, CustomerContactService, DataService, SupplierContactService, CustomerLogService, BookRegistrationService, DayEndService, EmployeeRegistrationService, FamilyInformationService, AcademicQualificationService, ProfessionalQualificationService, ProfessionalExperienceService, EmployeeRenewalService, EmployeeRejoinService, EmployeePromotionService, EmployeeTransferService, EmployeeResignationService, EmployeeTerminationService, LeaveBalanceService, LeaveEntryService, DisciplinaryActionService, PRMBankBranchService, SalaryPackageService, SalaryAccountService, SalaryMonthService, MonthlyLeaveService, DailyExpenseService, MonthlySalaryService, MonthlySalaryCancelService, OfficeService, CityService, ItemPackingService, ItemSubCategoryService, ItemPackingTypeService, ItemsMTypeService, CustomerCategoryService, SubjectService, AssetCategoryService, AssetSubCategoryService, AssetStatusService,
  AssetConditionService, CurrencyService, CostCenterService, ExpenseTypeService, VoucherTypeService, AreaService, BankService, AccountTypeService, AccountLevelService,
  AccountCategoryService, ItemCategoryService, DesignationService, DepartmentService, TrainingTypeService, EmploymentTypeService, HSubCategoryService, LeaveTypeService,
  AdvanceTypeService, EmployerContributionService, PackageAllowanceService, DeductionService, BankSalaryService, LeaveSettingService,
  MasterListService, CompanySetupService, ImgUploadService, RegionService, ProvinceService, SystemconfigurationService, SalaryReviewService, MonthlySalaryStopService, SalaryJournalVoucherService, SalaryPaymentVoucherService, BookingSheetService,
  TaxClaimService, IncomeTaxYearService, IncomeTaxRateService, AdvanceApprovalService, AdvancePaymentService, EmployeeImageService, ItemAdjustmentService,
  SearchFilterService, SmsAlertService, CustomerSortService, EmployeeCategoryService, OfficeLevelService, CountryService, DistrictService, VoucherHistoryService, EmailAlertService, EmailAttachmentService,
  OrderSchemeService, ItemSortService,ReportTemplateService, AssetRegistrationService, CompanyImageService, AssetSupplierService, AssetRequisitionService, AssetApprovalService, AssetGRNService, AssetPIService, AssetPOService, AssetManageService, AssetDepreciateService, AssetDisposeService, AssetWriteoffService, AssetTransferService, DepreciationVoucherService, DisposalVoucherService, WriteoffVoucherService, ItemPriceService, KPIService, EvaluationGroupService, EvaluationEmpService, AssetRFQService, EntryRFQService, SalaryIncrementService, FileAttachmentService, SaleInvoiceDayWiseService, SaleOrderImportService, CustomerReceiptImportService, TaxRateService, ItemImageService, SaleReplacementService, DailySaleLoadService, PurchaseOrderInvoiceService, ItemColorService, ItemWarrantyService, ItemBrandService, ItemModelService, CustomerDiscountService, IMEISearchService, ChartOfAccountsService, VehicleRegistrationService
 } from './shared/services';
import { JournalAccountService} from './shared/services/Admin/JournalAccount.service';
import { RepositoryService } from '@services/repository.service';
import { SearchFilter1Service } from '@shared/services/SearchFilter/search-filter1.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { RepositoryHttpService } from '@services/repositoryHttp.service';
import { EnvServiceProvider } from '@services/env.service.provider';
import { FAMReportService } from './shared/services/fam-report-service/fam-report.service';
import { OvertimeService } from './shared/services/PRM/PackageManagement/overtime.service'; 
 import {NgxMaskModule} from 'ngx-mask'
import { AttendanceService } from '@shared/services/PRM/PackageManagement/attendance.service';
import { OpeningBalanceService } from '@shared/services/FIS/AFM/opening-balance/opening-balance.service';
import { StockOpeningBalanceService } from '@shared/services/SupplyChain/Inventory/stock-opening-balance/stock-opening-balance.service';
import { ErrorInterceptor } from '@services/errorinterceptor';
import { SaleOrderContractService } from '@shared/services/SupplyChain/CRM/sale-order-contract/sale-order-contract.service';
import { SaleQuotationService } from '@shared/services/SupplyChain/CRM/sale-quotation/sale-quotation.service';

import { BudgetingService } from '@shared/services/SupplyChain/CRM/budgeting/budgeting.service';
import { DailyProductionService } from '@shared/services/SupplyChain/CRM/daily-production/daily-production.service';
import { StitchingService } from '@shared/services/SupplyChain/CRM/stitching/stitching.service';
import { ReversingService } from '@shared/services/SupplyChain/Production/reversing/reversing.service';
import { StockTransferService } from '@shared/services/SupplyChain/CRM/stock-transfer/stock-transfer.service';
import { DailyVehicleRoutService } from '@shared/services/SupplyChain/Inventory/daily-vahicle-rout/daily-vehicle-rout.service';
export function tokenGetter() {
  return localStorage.getItem("userAuthToken");
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent
    
  ],

  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    NgbModule, 
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(Approutes),
    PerfectScrollbarModule,
    NgSelect2Module, 
    AngularMyDatePickerModule,
    NgxPaginationModule, 
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["*"],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    HeaderService,
    LoginService,
    ReportService,
    SCMReportService,
    SCMReportViewerService,
    ReportViewerService,
    CardService,
    ReportTemplateService,
    CompanyImageService,
    PurchaseOrderService,
    PurchaseReturnNoteService,
    PurchaseReturnInvoiceService,
    PurchaseInvoiceService,
    SupplierPaymentService,
    SaleOrderService,
    SaleQuotationService,
    SaleReturnNoteService,
    SaleReturnInvoiceService,
    SaleInvoiceService,
    CustomerReceiptService,
    GoodsReceiptsNoteService,
    GoodsDispatchNoteService,
    ItemRegistrationService,
    SupplierService,
    CustomerService,
    RecipeCardService,
    ProductAssemblyService,
    ProductDisassemblyService,
    FiscalYearService,
    FiscalPeriodService,
    BankBranchService,
    BankAccountService,
    StockOpeningBalanceService,
    JournalVoucherService,
    ChartOfAccountService,
    ChartOfAccountsService,
    VoucherApprovalService,
    VoucherPostingService,
    ChequeBookService,
    JournalAccountService,
    IMEISearchService,
    UserService,
    RoleService,
    UserRoleService,
    ReportSettingService,
    CustomerContactService,
    BankReconciliationService,
    DataService,
    SupplierContactService,
    BankReconciliationService,
    CustomerLogService,
    BookRegistrationService,
    DataService, DayEndService,
    EmployeeRegistrationService,
    FamilyInformationService,
    AcademicQualificationService,
    ProfessionalExperienceService,
    ProfessionalQualificationService,
    EmployeeRenewalService,
    EmployeeRejoinService,
    EmployeePromotionService,
    EmployeeTransferService,
    EmployeeResignationService,
    EmployeeTerminationService,
    LeaveBalanceService,
    LeaveEntryService,
    DisciplinaryActionService,
    PRMBankBranchService,
    SalaryPackageService,
    SalaryAccountService,
    SalaryMonthService,
    MonthlyLeaveService,
    DailyExpenseService,
    MonthlySalaryService,
    MonthlySalaryCancelService,
    OfficeService,
    ItemColorService,
    ItemWarrantyService,
    ItemBrandService,
    ItemModelService,
    CustomerDiscountService,
    CityService, ItemPackingService, ItemSubCategoryService,
    ItemPackingTypeService, ItemsMTypeService, CustomerCategoryService, SubjectService, AssetCategoryService, AssetSubCategoryService, AssetStatusService,
    AssetConditionService, CurrencyService, CostCenterService, ExpenseTypeService, VoucherTypeService, AreaService, BankService, AccountTypeService, AccountLevelService,
    AccountCategoryService, ItemCategoryService, DesignationService, DepartmentService, TrainingTypeService, EmploymentTypeService, HSubCategoryService, LeaveTypeService,
    AdvanceTypeService, EmployerContributionService, PackageAllowanceService, DeductionService, BankSalaryService, LeaveSettingService,
    MasterListService, CompanySetupService, ImgUploadService,
    RegionService, ProvinceService, SystemconfigurationService,
    SalaryReviewService,
    MonthlySalaryStopService,
    SalaryJournalVoucherService,
    SalaryPaymentVoucherService,
    TaxClaimService,
    IncomeTaxYearService,
    IncomeTaxRateService,
    AdvanceApprovalService,
    AdvancePaymentService,
    EmployeeImageService,
    ItemAdjustmentService,
    BookingSheetService,
    SearchFilterService,
    SmsAlertService,
    CustomerSortService,
    EmployeeCategoryService,
    OfficeLevelService,
    CountryService,
    DistrictService,
    VoucherHistoryService,
    EmailAlertService,
    EmailAttachmentService,
    OrderSchemeService,
    ItemSortService,
    AssetRegistrationService,
    AssetSupplierService,
    AssetRequisitionService,
    AssetApprovalService,
    AssetGRNService,
    AssetPIService,
    AssetPOService,
    AssetManageService,
    AssetDepreciateService,
    AssetDisposeService,
    AssetWriteoffService,
    AssetTransferService,
    DepreciationVoucherService,
    DisposalVoucherService,
    WriteoffVoucherService,
    ItemPriceService,
    KPIService,
    EvaluationGroupService,
    EvaluationEmpService,
    AssetRFQService,
    EntryRFQService,
    SalaryIncrementService,
    FileAttachmentService,
    SaleInvoiceDayWiseService,
    SaleOrderImportService,
    CustomerReceiptImportService,
    TaxRateService,
    ItemImageService,
    SearchFilter1Service,
    EnvServiceProvider,
    ErrorHandlerService,
    RepositoryService,
    RepositoryHttpService,
    SaleReplacementService,
    FAMReportService,
    DailySaleLoadService,  
    OvertimeService,
    AttendanceService,
    PurchaseOrderInvoiceService,
    OpeningBalanceService,
    SaleOrderContractService,
    DailyProductionService,
    BudgetingService,
    StitchingService,
    ReversingService,
    StockTransferService,
    DailyVehicleRoutService,
    VehicleRegistrationService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
