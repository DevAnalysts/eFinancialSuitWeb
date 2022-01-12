import { ReportParam } from "../index";

export class ReportMaster
{
  public ModuleCode: any=0;
  public PageCode: any=0;
  public PageName: any='';
  public CompanyName: any = '';
  public CompanyAddress: any = '';
  public CompanyNote: any = '';
  
  public  PoweredBy : any='';
  public  DateParam : any='';
  public  UserName : any='';
  public ReportName: any = '';
  public BlankReport: any = '1';
  public ReportType: any = '1';
  public ReportSetting: any = false;

  public isStamp: any = false;
  public ReportSP: any='';
  public ReportPath: any = '';
  public DspParam: any = '';

  public SendingMedium: any = '0';
  public ReportID: any = '0';
  public ReportSave: any = '0';
  public ReportParentType: any = '0';
  public TemplateCode: any = '';
  public WaterMarkText: any = '';
 
  public ReportParam: Array<ReportParam>;

  public SubReportParam: Array<ReportParam>;
  
  //constructor(_PageCode?: any,_PageName?: any, _CompanyName?: any, _PoweredBy?: any, _DateParam?: any, _UserName?: any, _ReportName?: any, _ReportSP?: any, _ReportPath?: any, _ReportSetting?: any, _ReportParam?: Array<ReportParam>)
  //{
  //  this.PageCode = _PageCode;
  //          this.PageName = _PageName;
  //          this.CompanyName = _CompanyName;
  //          this.PoweredBy = _PoweredBy;
  //          this.DateParam = _DateParam;
  //          this.UserName = _UserName;
  //          this.ReportName = _ReportName;
  //          this.ReportParam = _ReportParam;
  //          this.ReportSetting = _ReportSetting;
  //          this.ReportSP = _ReportSP;
  //          this.ReportPath = _ReportPath;
  //      }



    }
