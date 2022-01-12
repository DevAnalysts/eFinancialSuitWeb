import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from '@shared/guards/auth.guard';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'starter', loadChildren: './starter/starter.module#StarterModule' }, 
      { path: 'redirect', loadChildren: './layouts/redirect/redirect.module#RedirectModule' },
      /////////Dashboard//////////
      { path: 'dashboard', loadChildren: './layouts/dashboard/dashboard.module#DashboardModule' },
      { path: 'dashsetting', loadChildren: './layouts/dashsetting/dashsetting.module#DashSettingModule' },
      { path: 'charts', loadChildren: './layouts/charts/charts.module#ChartsModule' },
      { path: 'download', loadChildren: './layouts/download/download.module#DownloadModule' },
      /////////BI//////////      
      { path: 'sms-alert', loadChildren: './layouts/BI/sms-alert/sms-alert.module#SmsAlertModule' },
      { path: 'email-alert', loadChildren: './layouts/BI/email-alert/email-alert.module#EmailAlertModule' },
      { path: 'message', loadChildren: './layouts/BI/message/message.module#MessageModule'},
      //////////////////////////////////////////////////////////////////////////////////////////////////////
      /////////SCM//////////
      { path: 'supplier', loadChildren: './layouts/SupplyChain/SRM/supplier/supplier.module#SupplierModule' },
      { path: 'supplier-contact', loadChildren: './layouts/SupplyChain/SRM/supplier-contact/supplier-contact.module#SupplierContactModule' },
      { path: 'purchase-order', loadChildren: './layouts/SupplyChain/SRM/purchase-order/purchase-order.module#PurchaseOrderModule' },
      { path: 'purchase-return-note', loadChildren: './layouts/SupplyChain/SRM/purchase-return-note/purchase-return-note.module#PurchaseReturnNoteModule' },
      { path: 'purchase-return-invoice', loadChildren: './layouts/SupplyChain/SRM/purchase-return-invoice/purchase-return-invoice.module#PurchaseReturnInvoiceModule' },
      { path: 'purchase-invoice', loadChildren: './layouts/SupplyChain/SRM/purchase-invoice/purchase-invoice.module#PurchaseInvoiceModule' },
      { path: 'supplier-payment', loadChildren: './layouts/SupplyChain/SRM/supplier-payment/supplier-payment.module#SupplierPaymentModule' },
      { path: 'booking-sheet', loadChildren: './layouts/SupplyChain/CRM/booking-sheet/booking-sheet.module#BookingSheetModule' },
      { path: 'daily-sale-load', loadChildren: './layouts/SupplyChain/CRM/daily-sale-load/daily-sale-load.module#DailySaleLoadModule' },
      { path: 'customer', loadChildren: './layouts/SupplyChain/CRM/customer/customer.module#CustomerModule' },
      { path: 'imei-search', loadChildren: './layouts/SupplyChain/CRM/imei-search/imei-search.module#IMEISearchModule' },    
      { path: 'customer-contact', loadChildren: './layouts/SupplyChain/CRM/customer-contact/customer-contact.module#CustomerContactModule' },
      { path: 'customer-log', loadChildren: './layouts/SupplyChain/CRM/customer-log/customer-log.module#CustomerLogModule' },
      { path: 'customer-receipt', loadChildren: './layouts/SupplyChain/CRM/customer-receipt/customer-receipt.module#CustomerReceiptModule' },
      { path: 'customer-receipt-import', loadChildren: './layouts/SupplyChain/CRM/customer-receipt-import/customer-receipt-import.module#CustomerReceiptImportModule' },
      { path: 'customer-sort', loadChildren: './layouts/SupplyChain/CRM/customer-sort/customer-sort.module#CustomerSortModule' },
      { path: 'daily-expense', loadChildren: './layouts/SupplyChain/CRM/daily-expense/daily-expense.module#DailyExpenseModule' },
      { path: 'daily-production', loadChildren: './layouts/SupplyChain/CRM/daily-production/daily-production.module#DailyProductionModule' },
      { path: 'sample-request', loadChildren: './layouts/SupplyChain/CRM/sample-request/sample-request.module#SampleRequestModule' },
      { path: 'daily-expense-voucher', loadChildren: './layouts/SupplyChain/CRM/daily-expense-voucher/daily-expense-voucher.module#DailyExpenseVoucherModule' },
      { path: 'order-scheme', loadChildren: './layouts/SupplyChain/CRM/order-scheme/order-scheme.module#OrderSchemeModule' },
      { path: 'order-schemes', loadChildren: './layouts/SupplyChain/CRM/order-schemes/order-schemes.module#OrderSchemesModule' },
      { path: 'sale-invoice', loadChildren: './layouts/SupplyChain/CRM/sale-invoice/sale-invoice.module#SaleInvoiceModule' },
      { path: 'sale-invoice-day', loadChildren: './layouts/SupplyChain/CRM/sale-invoice-day/sale-invoice-day.module#SaleInvoiceDayWiseModule' },
      { path: 'sale-order', loadChildren: './layouts/SupplyChain/CRM/sale-order/sale-order.module#SaleOrderModule' },  
      { path: 'stock-transfer', loadChildren: './layouts/SupplyChain/CRM/stock-transfer/stock-transfer.module#StockTransferModule' },  

      { path: 'sale-quotation', loadChildren: './layouts/SupplyChain/CRM/sale-quotation/sale-quotation.module#SaleQuotationModule' },  
      { path: 'sale-order-contract', loadChildren: './layouts/SupplyChain/CRM/sale-order-contract/sale-order-contract.module#SaleOrderContractModule' },   
      { path: 'budgeting', loadChildren: './layouts/SupplyChain/CRM/budgeting/budgeting.module#BudgetingModule' },   
      { path: 'stitching', loadChildren: './layouts/SupplyChain/CRM/stitching/stitching.module#StitchingModule' },
      { path: 'sale-order-import', loadChildren: './layouts/SupplyChain/CRM/sale-order-import/sale-order-import.module#SaleOrderImportModule' },
      { path: 'sale-return-invoice', loadChildren: './layouts/SupplyChain/CRM/sale-return-invoice/sale-return-invoice.module#SaleReturnInvoiceModule' },
      { path: 'sale-return-note', loadChildren: './layouts/SupplyChain/CRM/sale-return-note/sale-return-note.module#SaleReturnNoteModule' },   
      { path: 'sale-replacement', loadChildren: './layouts/SupplyChain/CRM/sale-replacement/sale-replacement.module#SaleReplacementModule' },
      { path: 'retail-invoice', loadChildren: './layouts/SupplyChain/POS/retail-invoice/retail-invoice.module#RetailInvoiceModule' },
      { path: 'sale-retail-invoice', loadChildren: './layouts/SupplyChain/POS/sale-retail-invoice/sale-retail-invoice.module#SaleRetailInvoiceModule' },
      { path: 'sale-retail-invoice-list', loadChildren: './layouts/SupplyChain/POS/sale-retail-invoice-list/sale-retail-invoice-list.module#SaleRetailInvoiceListModule' },
      { path: 'sale-retail-invoice-edit', loadChildren: './layouts/SupplyChain/POS/sale-retail-invoice-edit/sale-retail-invoice-edit.module#SaleRetailInvoiceEditModule' },
      { path: 'purchase-retail-invoice', loadChildren: './layouts/SupplyChain/POS/purchase-retail-invoice/purchase-retail-invoice.module#PurchaseRetialInvoiceModule' },
      { path: 'purchase-retail-invoice-list', loadChildren: './layouts/SupplyChain/POS/purchase-retail-invoice-list/purchase-retail-invoice-list.module#PurchaseRetialInvoiceListModule' },
      { path: 'purchase-retail-invoice-edit', loadChildren: './layouts/SupplyChain/POS/purchase-retail-invoice-edit/purchase-retail-invoice-edit.module#PurchaseRetialInvoiceEditModule' },
      { path: 'goods-receipts-note', loadChildren: './layouts/SupplyChain/Inventory/goods-receipts-note/goods-receipts-note.module#GoodsReceiptsNoteModule' },
      { path: 'goods-dispatch-note', loadChildren: './layouts/SupplyChain/Inventory/goods-dispatch-note/goods-dispatch-note.module#GoodsDispatchNoteModule' },
      { path: 'item-registration', loadChildren: './layouts/SupplyChain/Inventory/item-registration/item-registration.module#ItemRegistrationModule' },
      { path: 'book-registration', loadChildren: './layouts/SupplyChain/Inventory/book-registration/book-registration.module#BookRegistrationModule' },
      { path: 'item-adjustment', loadChildren: './layouts/SupplyChain/Inventory/item-adjustment/item-adjustment.module#ItemAdjustmentModule' },
      { path: 'item-sort', loadChildren: './layouts/SupplyChain/Inventory/item-sort/item-sort.module#ItemSortModule' },
      { path: 'stock-opening-balance', loadChildren: './layouts/SupplyChain/Inventory/stock-opening-balance/stock-opening-balance.module#StockOpeningBalanceModule' },
      { path: 'vehicle-registration', loadChildren: './layouts/SupplyChain/Inventory/vehical-registration/vehical-registration.module#VehicalRegistrationModule' },
      { path: 'item-price', loadChildren: './layouts/SupplyChain/Inventory/item-price/item-price.module#ItemPriceModule' },
      { path: 'recipe-card', loadChildren: './layouts/SupplyChain/Production/recipe-card/recipe-card.module#RecipeCardModule' },
      { path: 'product-assembly', loadChildren: './layouts/SupplyChain/Production/product-assembly/product-assembly.module#ProductAssemblyModule' },
      { path: 'product-disassembly', loadChildren: './layouts/SupplyChain/Production/product-disassembly/product-disassembly.module#ProductDisassemblyModule' },
      { path: 'packing', loadChildren: './layouts/SupplyChain/Production/packing/packing.module#PackingModule' },
      { path: 'finishing', loadChildren: './layouts/SupplyChain/Production/finishing/finishing.module#FinishingModule' },
      { path: 'reversing', loadChildren: './layouts/SupplyChain/Production/reversing/reversing.module#ReversingModule' },
      { path: 'pressing', loadChildren: './layouts/SupplyChain/Production/pressing/pressing.module#PressingModule' },
      { path: 'daily-vahicle-rout', loadChildren: './layouts/SupplyChain/Inventory/daily-vehicle-rout/daily-vehicle-rout.module#DailyVehicleRoutModule' },



      /////////End SCM////////////////////////////////////////////////////////////////////////////////////

      /////////FIS//////////
      { path: 'fiscal-year', loadChildren: './layouts/FIS/AFM/fiscal-year/fiscal-year.module#FiscalYearModule' },
      { path: 'fiscal-period', loadChildren: './layouts/FIS/AFM/fiscal-period/fiscal-period.module#FiscalPeriodModule' },
      { path: 'bank-branch', loadChildren: './layouts/FIS/AFM/bank-branch/bank-branch.module#BankBranchModule' },
      { path: 'opening-balance', loadChildren: './layouts/FIS/AFM/opening-balance/opening-balance.module#OpeningBalanceModule'},
      { path: 'bank-account', loadChildren: './layouts/FIS/BM/bank-account/bank-account.module#BankAccountModule' },
      { path: 'journal-voucher', loadChildren: './layouts/FIS/GJ/journal-voucher/journal-voucher.module#JournalVoucherModule' },
      { path: 'adjustment-voucher', loadChildren: './layouts/FIS/GJ/adjustment-voucher/adjustment-voucher.module#AdjustmentVoucherModule' },
      { path: 'bank-payment-voucher', loadChildren: './layouts/FIS/AP/bank-payment-voucher/bank-payment-voucher.module#BankPaymentVoucherModule' },
      { path: 'cash-payment-voucher', loadChildren: './layouts/FIS/AP/cash-payment-voucher/cash-payment-voucher.module#CashPaymentVoucherModule' },
      { path: 'bank-receipt-voucher', loadChildren: './layouts/FIS/AR/bank-receipt-voucher/bank-receipt-voucher.module#BankReceiptVoucherModule' },
      { path: 'cash-receipt-voucher', loadChildren: './layouts/FIS/AR/cash-receipt-voucher/cash-receipt-voucher.module#CashReceiptVoucherModule' },
      { path: 'chart-of-account', loadChildren: './layouts/FIS/AFM/chart-of-account/chart-of-account.module#ChartOfAccountModule' },
      { path: 'chartofaccount', loadChildren: './layouts/FIS/AFM/chartofaccount/chartofaccount.module#ChartOfAccountsModule' },
      { path: 'voucher-approval', loadChildren: './layouts/FIS/GJ/voucher-approval/voucher-approval.module#VoucherApprovalModule' },
      { path: 'voucher-posting', loadChildren: './layouts/FIS/GJ/voucher-posting/voucher-posting.module#VoucherPostingModule' },
      { path: 'cheque-book', loadChildren: './layouts/FIS/BM/cheque-book/cheque-book.module#ChequeBookModule' },
      { path: 'cheque-cancel', loadChildren: './layouts/FIS/BM/cheque-cancel/cheque-cancel.module#ChequeCancelModule' },
      { path: 'bank-reconciliation', loadChildren: './layouts/FIS/BM/bank-reconciliation/bank-reconciliation.module#BankReconciliationModule' },
      { path: 'voucher-history', loadChildren: './layouts/FIS/GJ/voucher-history/voucher-history.module#VoucherHistoryModule' },
      { path: 'day-end', loadChildren: './layouts/FIS/MD/day-end/day-end.module#DayEndModule' },
      /////////End FIS ////////////////////////////////////////////////////////////////////////////////////

      /////////HRM//////////
      { path: 'employee-registration', loadChildren: './layouts/HRM/PersonalManagement/employee-registration/employee-registration.module#EmployeeRegistrationModule' },
      { path: 'family-information', loadChildren: './layouts/HRM/PersonalManagement/family-information/family-information.module#FamilyInformationModule' },
      { path: 'academic-qualification', loadChildren: './layouts/HRM/PersonalManagement/academic-qualification/academic-qualification.module#AcademicQualificationModule' },
      { path: 'professional-qualification', loadChildren: './layouts/HRM/PersonalManagement/professional-qualification/professional-qualification.module#ProfessionalQualificationModule' },
      { path: 'professional-experience', loadChildren: './layouts/HRM/PersonalManagement/professional-experience/professional-experience.module#ProfessionalExperienceModule' },
      { path: 'contract-renewal', loadChildren: './layouts/HRM/PersonalManagement/employee-renewal/employee-renewal.module#EmployeeRenewalModule' },
      { path: 'employee-rejoin', loadChildren: './layouts/HRM/PersonalManagement/employee-rejoin/employee-rejoin.module#EmployeeRejoinModule' },
      { path: 'employee-promotion', loadChildren: './layouts/HRM/PersonalManagement/employee-promotion/employee-promotion.module#EmployeePromotionModule' },
      { path: 'employee-transfer', loadChildren: './layouts/HRM/PersonalManagement/employee-transfer/employee-transfer.module#EmployeeTransferModule' },
      { path: 'employee-resignation', loadChildren: './layouts/HRM/PersonalManagement/employee-resignation/employee-resignation.module#EmployeeResignationModule' },
      { path: 'employee-termination', loadChildren: './layouts/HRM/PersonalManagement/employee-termination/employee-termination.module#EmployeeTerminationModule' },
      { path: 'leave-balance', loadChildren: './layouts/HRM/PersonalManagement/leave-balance/leave-balance.module#LeaveBalanceModule' },
      { path: 'leave-entry', loadChildren: './layouts/HRM/PersonalManagement/leave-entry/leave-entry.module#LeaveEntryModule' },
      { path: 'disciplinary-action', loadChildren: './layouts/HRM/PersonalManagement/disciplinary-action/disciplinary-action.module#DisciplinaryActionModule' },
      { path: 'salary-account', loadChildren: './layouts/HRM/PersonalManagement/salary-account/salary-account.module#SalaryAccountModule' },
      ////////////////////////////////////////////////////////////////////////////////////

      ///////PMS//////////      
      { path: 'pay-bankbranch', loadChildren: './layouts/PRM/PackageManagement/bank-branch/bank-branch.module#BankBranchModule' },
      { path: 'salary-package', loadChildren: './layouts/PRM/PackageManagement/salary-package/salary-package.module#SalaryPackageModule' },
      { path: 'overtime', loadChildren: './layouts/PRM/PackageManagement/overtime/overtime.module#OvertimeModule' },
      { path: 'bio-attendance', loadChildren: './layouts/PRM/PackageManagement/bio-attendance/bio-attendance.module#BioAttendanceModule' },
      { path: 'attendance-sheet', loadChildren: './layouts/PRM/PackageManagement/attendance-sheet/attendance-sheet.module#AttendanceSheetModule' },
      { path: 'salary-increment', loadChildren: './layouts/PRM/PackageManagement/salary-increment/salary-increment.module#SalaryIncrementModule' },
      { path: 'salary-month', loadChildren: './layouts/PRM/PackageManagement/salary-month/salary-month.module#SalaryMonthModule' },
      { path: 'monthly-leave', loadChildren: './layouts/PRM/PackageManagement/monthly-leave/monthly-leave.module#MonthlyLeaveModule' },
      { path: 'monthly-salary', loadChildren: './layouts/PRM/PackageManagement/monthly-salary/monthly-salary.module#MonthlySalaryModule' },
      { path: 'monthly-salary-cancel', loadChildren: './layouts/PRM/PackageManagement/monthly-salarycancel/monthly-salarycancel.module#MonthlySalaryCancelModule' },
      { path: 'salary-review', loadChildren: './layouts/PRM/PackageManagement/salary-review/salary-review.module#SalaryReviewModule' },
      { path: 'monthly-salary-stop', loadChildren: './layouts/PRM/PackageManagement/monthly-salarystop/monthly-salarystop.module#MonthlySalaryStopModule' },
      { path: 'salary-journal-voucher', loadChildren: './layouts/PRM/PackageManagement/salary-journalvoucher/salary-journalvoucher.module#SalaryJournalVoucherModule' },
      { path: 'salary-payment-voucher', loadChildren: './layouts/PRM/PackageManagement/salary-paymentvoucher/salary-paymentvoucher.module#SalaryPaymentVoucherModule' },
      { path: 'tax-claim', loadChildren: './layouts/PRM/TaxManagement/tax-claim/tax-claim.module#TaxClaimModule' },
      { path: 'incometax-year', loadChildren: './layouts/PRM/TaxManagement/incometax-year/incometax-year.module#IncomeTaxYearModule' },
      { path: 'incometax-rate', loadChildren: './layouts/PRM/TaxManagement/incometax-rate/incometax-rate.module#IncomeTaxRateModule' },
      { path: 'advance-approval', loadChildren: './layouts/PRM/AdvanceManagement/advance-approval/advance-approval.module#AdvanceApprovalModule' },
      { path: 'advance-payment', loadChildren: './layouts/PRM/AdvanceManagement/advance-payment/advance-payment.module#AdvancePaymentModule' },
      ////////////////////////////////////////////////////////////////////////////////////


      /////////Security And Licensing//////////
      { path: 'user', loadChildren: './layouts/SecurityLicensing/Security/user/user.module#UserModule' },
      { path: 'roles', loadChildren: './layouts/SecurityLicensing/Security/roles/roles.module#RolesModule' },
      { path: 'user-role', loadChildren: './layouts/SecurityLicensing/Security/user-role/user-role.module#UserRoleModule' },
      
      { path: 'pageregistration', loadChildren: './pageregistration/pageregistration.module#PageRegistrationModule' },
      ////////////////////////////////////////////////////////////////////////////////////



      /////////Setting//////////
      { path: 'reporttemplates', loadChildren: './layouts/SystemSetting/ReportTemplate/ReportTemplate.module#ReportTemplateModule' },
      { path: 'color', loadChildren: './layouts/SystemSetting/ItemColor/ItemColor.module#ItemColorModule' },
      { path: 'warranty', loadChildren: './layouts/SystemSetting/ItemWarranty/ItemWarranty.module#ItemWarrantyModule' },
      { path: 'brand', loadChildren: './layouts/SystemSetting/ItemBrand/ItemBrand.module#ItemBrandModule' },
      { path: 'model', loadChildren: './layouts/SystemSetting/ItemModel/itemmodel.module#ItemModelModule' },

      { path: 'province', loadChildren: './layouts/SystemSetting/province/province.module#ProvinceModule' },
      { path: 'region', loadChildren: './layouts/SystemSetting/Region/region.module#RegionModule' },
      { path: 'city', loadChildren: './layouts/SystemSetting/City/city.module#CityModule' },
      { path: 'packingtype', loadChildren: './layouts/SystemSetting/Items/items.module#ItemsModule' },
      { path: 'itemsubcategory', loadChildren: './layouts/SystemSetting/ItemSubCategory/itemsubcategory.module#ItemSubCategoryModule' },
      { path: 'measurementtype', loadChildren: './layouts/SystemSetting/ItemsMType/itemsMtype.module#ItemsMTypeModule' },
      { path: 'customercategory', loadChildren: './layouts/SystemSetting/CustomerCategory/customercategory.module#CustomerCategoryModule' },
      { path: 'suppliercategory', loadChildren: './layouts/SystemSetting/suppliercategory/suppliercategory.module#SupplierCategoryModule' },

      { path: 'subject', loadChildren: './layouts/SystemSetting/Subject/subject.module#SubjectModule' },
      { path: 'assetcategory', loadChildren: './layouts/SystemSetting/AssetCategory/assetcategory.module#AssetCategoryModule' },
      { path: 'assetsubcategory', loadChildren: './layouts/SystemSetting/AssetSubCategory/assetsubcategory.module#AssetSubCategoryModule' },
      { path: 'assetstatus', loadChildren: './layouts/SystemSetting/AssetStatus/assetstatus.module#AssetStatusModule' },
      { path: 'assetcondition', loadChildren: './layouts/SystemSetting/AssetCondition/assetcondition.module#AssetConditionModule' },
      { path: 'currency', loadChildren: './layouts/SystemSetting/Currency/currency.module#CurrencyModule' },
      { path: 'costcenter', loadChildren: './layouts/SystemSetting/CostCenter/costcenter.module#CostCenterModule' },
      { path: 'expensetype', loadChildren: './layouts/SystemSetting/ExpenseType/expensetype.module#ExpenseTypeModule' },
      { path: 'vouchertype', loadChildren: './layouts/SystemSetting/VoucherType/vouchertype.module#VoucherTypeModule' },
      { path: 'area', loadChildren: './layouts/SystemSetting/Area/area.module#AreaModule' },
      { path: 'bank', loadChildren: './layouts/SystemSetting/Bank/bank.module#BankModule' },
      { path: 'accounttype', loadChildren: './layouts/SystemSetting/AccountType/accounttype.module#AccountTypeModule' },
      { path: 'accountlevel', loadChildren: './layouts/SystemSetting/AccountLevel/accountlevel.module#AccountLevelModule' },
      { path: 'accountcategory', loadChildren: './layouts/SystemSetting/AccountCategory/accountcategory.module#AccountCategoryModule' },
      { path: 'itemcategory', loadChildren: './layouts/SystemSetting/ItemCategory/itemcategory.module#ItemCategoryModule' },
      { path: 'designation', loadChildren: './layouts/SystemSetting/Designation/designation.module#DesignationModule' },
      { path: 'department', loadChildren: './layouts/SystemSetting/Department/department.module#DepartmentModule' },
      { path: 'trainingtype', loadChildren: './layouts/SystemSetting/TrainingType/trainingtype.module#TrainingTypeModule' },
      { path: 'employmenttype', loadChildren: './layouts/SystemSetting/EmploymentType/employmenttype.module#EmploymentTypeModule' },
      { path: 'hsubcategory', loadChildren: './layouts/SystemSetting/HSubCategory/hsubcategory.module#HSubCategoryModule' },
      { path: 'leavetype', loadChildren: './layouts/SystemSetting/LeaveType/leavetype.module#LeaveTypeModule' },
      { path: 'advancetype', loadChildren: './layouts/SystemSetting/AdvanceType/advancetype.module#AdvanceTypeModule' },
      { path: 'employercontribution', loadChildren: './layouts/SystemSetting/EmployerContribution/employercontribution.module#EmployerContributionModule' },
      { path: 'packageallowance', loadChildren: './layouts/SystemSetting/PackageAllowance/packageallowance.module#PackageAllowanceModule' },
      { path: 'deduction', loadChildren: './layouts/SystemSetting/Deduction/deduction.module#DeductionModule' },
      { path: 'banksalary', loadChildren: './layouts/SystemSetting/BankSalary/banksalary.module#BankSalaryModule' },
      { path: 'leavesetting', loadChildren: './layouts/SystemSetting/LeaveSetting/leavesetting.module#LeaveSettingModule' },
      { path: 'systemconfiguration', loadChildren: './layouts/SystemSetting/SystemConfiguration/systemconfiguration.module#SystemConfigurationModule' },
      { path: 'masterlist', loadChildren: './layouts/SystemSetting/MasterList/masterlist.module#MasterListModule' },
      { path: 'office', loadChildren: './layouts/SystemSetting/Office/office.module#OfficeModule' },
      { path: 'companysetup', loadChildren: './layouts/SystemSetting/CompanySetup/companysetup.module#CompanySetupModule' },
      { path: 'imgupload', loadChildren: './layouts/SystemSetting/ImgUpload/imgupload.module#ImgUploadModule' },
      { path: 'employeecategory', loadChildren: './layouts/SystemSetting/EmployeeCategory/employeecategory.module#EmployeeCategoryModule' },
      { path: 'officelevel', loadChildren: './layouts/SystemSetting/OfficeLevel/officelevel.module#OfficeLevelModule' },
      { path: 'country', loadChildren: './layouts/SystemSetting/Country/country.module#CountryModule' },
      { path: 'district', loadChildren: './layouts/SystemSetting/District/district.module#DistrictModule' },
      { path: 'kpi', loadChildren: './layouts/HRM/PACEManagement/KPI/kpi.module#KPIModule' },
      { path: 'evaluation-group', loadChildren: './layouts/HRM/PACEManagement/evaluation-group/evaluation-group.module#EvaluationGroupModule' },
      { path: 'evaluation-emp', loadChildren: './layouts/HRM/PACEManagement/evaluation-emp/evaluation-emp.module#EvaluationEmpModule' },
      { path: 'taxtype', loadChildren: './layouts/SystemSetting/TaxType/taxtype.module#TaxTypeModule' },
      { path: 'journalaccount', loadChildren: './layouts/SystemSetting/journalaccount/journalaccount.module#JournalAccountModule' },

      ////////////////////////////////////////////////////////////////////////////////////



      /////////FAM//////////
      { path: 'asset-registration', loadChildren: './layouts/FAM/AM/asset-registration/asset-registration.module#AssetRegistrationModule' },
      { path: 'asset-supplier', loadChildren: './layouts/FAM/AM/asset-supplier/asset-supplier.module#AssetSupplierModule' },
      { path: 'asset-requisition', loadChildren: './layouts/FAM/AM/asset-requisition/asset-requisition.module#AssetRequisitionModule' },
      { path: 'asset-approval', loadChildren: './layouts/FAM/AM/asset-approval/asset-approval.module#AssetApprovalModule' },
      { path: 'asset-manage', loadChildren: './layouts/FAM/AM/asset-manage/asset-manage.module#AssetManageModule' },

      { path: 'asset-po', loadChildren: './layouts/FAM/AP/asset-po/asset-po.module#AssetPOModule' },
      { path: 'asset-pi', loadChildren: './layouts/FAM/AP/asset-pi/asset-pi.module#AssetPIModule' },
      { path: 'asset-grn', loadChildren: './layouts/FAM/AP/asset-grn/asset-grn.module#AssetGRNModule' },
      { path: 'asset-rfq', loadChildren: './layouts/FAM/AP/asset-rfq/asset-rfq.module#AssetRFQModule' },
      { path: 'entry-rfq', loadChildren: './layouts/FAM/AP/entry-rfq/entry-rfq.module#EntryRFQModule' },

      { path: 'asset-depreciate', loadChildren: './layouts/FAM/AD/asset-depreciate/asset-depreciate.module#AssetDepreciateModule' },

      { path: 'asset-dispose', loadChildren: './layouts/FAM/AD/asset-dispose/asset-dispose.module#AssetDisposeModule' },
      { path: 'asset-writeoff', loadChildren: './layouts/FAM/AD/asset-writeoff/asset-writeoff.module#AssetWriteoffModule' },
      { path: 'asset-transfer', loadChildren: './layouts/FAM/AD/asset-transfer/asset-transfer.module#AssetTransferModule' },


      { path: 'disposal-voucher', loadChildren: './layouts/FAM/AV/disposal-voucher/disposal-voucher.module#DisposalVoucherModule' },
      { path: 'writeoff-voucher', loadChildren: './layouts/FAM/AV/writeoff-voucher/writeoff-voucher.module#WriteOffVoucherModule' },
      { path: 'depreciation-voucher', loadChildren: './layouts/FAM/AV/depreciation-voucher/depreciation-voucher.module#DepreciationVoucherModule' },
      { path: 'tax-rate', loadChildren: './layouts/FIS/TM/taxrate/taxrate.module#TaxRateModule' },
      ////////////////////////////////////////////////////////////////////////////////////


      /////////Report Criteria////////
      { path: 'crm-report-viewer', loadChildren: './layouts/SupplyChain/Reports/crm-report-viewer/crm-report-viewer.module#CRMReportViewerModule' },
      { path: 'srm-report-viewer', loadChildren: './layouts/SupplyChain/Reports/srm-report-viewer/srm-report-viewer.module#SRMReportViewerModule' },
      { path: 'inventory-report-viewer', loadChildren: './layouts/SupplyChain/Reports/inventory-report-viewer/inventory-report-viewer.module#InventoryReportViewerModule' },
      { path: 'misc-report-viewer', loadChildren: './layouts/SupplyChain/Reports/misc-report-viewer/misc-report-viewer.module#MiscReportViewerModule' },
      { path: 'fis-report-criteria', loadChildren: './layouts/FIS/Reports/fis-report-criteria/fis-report-criteria.module#FISReportCriteriaModule' },  
      { path: 'hrmreport-viewer', loadChildren: './layouts/HRM/Reports/hrmreport-viewer/hrmreport-viewer.module#HRMReportViewerModule' },
      { path: 'prmreport-viewer', loadChildren: './layouts/PRM/Reports/prmreport-viewer/prmreport-viewer.module#PRMReportViewerModule' },
      
      { path: 'fam-report-criteria', loadChildren: './layouts/FAM/Reports/fam-report-criteria/fam-report-criteria.module#FAMReportCriteriaModule' },
      { path: 'fam-report-viewer', loadChildren: './layouts/FAM/Reports/fam-report-viewer/fam-report-viewer.module#FAMReportViewerModule' },
      /////////End Report Criteria////////
    ]
  },
  /////////SCM Reports//////////   
  { path: 'grn-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'grn-rpt-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'so-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'so-rpt-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'so-rpt-mail', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'so-rpt-whatsapp', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'si-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'si-rpt-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'si-rpt-mail', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'po-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'po-rpt-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'po-rpt-mail', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'gdn-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'gdn-rpt-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'duplicate-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'daysummary-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'bs-so-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'booking-sheet-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'dsl-rpt-rdlc', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },
  { path: 'dsl-rpt-excel', loadChildren: './layouts/SupplyChain/Reports/view-report/view-report.module#ViewReportModule', canActivate: [AuthGuard] },

  /////////FIS Reports//////////
  { path: 'gv-rpt-rdlc', loadChildren: './layouts/FIS/Reports/fis-report-viewer/fis-report-viewer.module#FISReportViewerModule', canActivate: [AuthGuard] },
  { path: 'bpv-rpt-rdlc', loadChildren: './layouts/FIS/Reports/fis-report-viewer/fis-report-viewer.module#FISReportViewerModule', canActivate: [AuthGuard] },
  { path: 'cpv-rpt-rdlc', loadChildren: './layouts/FIS/Reports/fis-report-viewer/fis-report-viewer.module#FISReportViewerModule', canActivate: [AuthGuard] },
  { path: 'brv-rpt-rdlc', loadChildren: './layouts/FIS/Reports/fis-report-viewer/fis-report-viewer.module#FISReportViewerModule', canActivate: [AuthGuard] },
  { path: 'crv-rpt-rdlc', loadChildren: './layouts/FIS/Reports/fis-report-viewer/fis-report-viewer.module#FISReportViewerModule', canActivate: [AuthGuard] },
  //{ path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'newlogin', loadChildren: './new-login/new-login.module#LoginModule' },

  { path: '**', redirectTo: '/dashboard' }
];

