import { ReportTemplateOffice } from "./ReportTemplateOffice";
  
 
export class ReportTemplate {
  constructor(
    public  templatE_ID	   :any,
    public  templatE_NAME  :any,
    public  templatE_Logo  :any,
    public  templatE_ABBR  :any,
    public  templatE_URL   :any,
    public  status		   :any,
    public  isTaxable	   :any,
    public  taxRate		   :any, 
    public  companyID	   :any,
    public  reportName	   :any,
    public  isRPReport	   :any,
    public  sortOrder	   :any,
    public  spName		   :any,
    public  displayName	   :any,
    public  logoName	   :any,
    public  companyAddress :any,
    public  companyNote	   :any,
    public  companyName	   :any,
    public  thanksNote	   :any,
    public  companyNote2   :any,
    public  showsubreport	   :any,
    public  subReportSP	   :any,
    public  subReportName   :any,
    public   pageCode   :any,
    public   tagName   :any,
    public   selectedOffices : ReportTemplateOffice[]
  ) { }
}
  
      