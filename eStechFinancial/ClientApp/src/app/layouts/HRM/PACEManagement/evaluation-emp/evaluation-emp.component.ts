import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationEmpService, LoginService, DayEndService, customer, EvaluationEmp, EvaluationEmpDetail, EvaluationEmpDetails, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'evaluation-emp',
  templateUrl: './evaluation-emp.component.html',
  styleUrls: ['./evaluation-emp.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EvaluationEmpComponent implements OnInit {
  ////////////////////////////////////////
  
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  ////////////////////////////////////////
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  modalReference: NgbModalRef;
    order: any;
    id: any;

  grid: any[];

  emplist: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';

  department: any[] = [];
  departmentcode: any = 0;
  departmentname: any = '';

  designation: any[] = [];
  designationcode: any = 0;
  designationname: any = '';

  officecode: any = 0;
  evaluationgroupcode: any = 0;

  status: any;
  evaluationemp: any[];
  evaluationempdetails: any[];
  evaluationempcode: any;
  evaluationempname: any = '';

  supervisorA: any = 0;
  supervisorB: any = 0;
  supervisorC: any = 0;
  public startdate = new cDate();
  public enddate = new cDate();

  kpi: any[];
  kpicode: any = 0;
  kpiname: any = '';
  weight: any = 0;
  goal: any = '';
  totalscore: any = 0;
  //=================================

  editMode = false;
  index = 1;

  guid: any;
  mode: any = 0;
  btnMode: any = 0;

 isLoading: any = false;

  closeResult: string;
  alerts: Array<any> = [];

  editdisabled: any = '';
  removedisabled: any = '';

  DelayCheck: any = true;
  period: any = 1;
  constructor(private service: EvaluationEmpService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    //this.evaluationempdetails = new Array<EvaluationEmpDetails>();
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  //ngOnInit
  ngOnInit() {
    this.getGrid();
    this.permissionUtility.setPagePermissions(20048);
    this.logedInUserID = this.LoginService.getSession('user_ID');
    }
  //onFill
  onFill() {
    this.getEmployees();
    this.getDates(1);
  }
  //getGrid
  getGrid() {
    this.isLoading =true;
    this.service.getGrid()
      .subscribe(response => {
        this.order = (response.json());
        this.isLoading = false;
        console.log(response.json());
      });
  }
  //getEmployees
  getEmployees() {
    this.isLoading =true;
    this.service.getEmployees(0)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        //this.empcode = this.emplist[0].id;
        //this.empname = this.emplist[0].text;

      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;

    if (!this.mode) {
      this.getDepartment(this.empcode);
      this.getDesignation(this.empcode);
    }

  }
  //getDesignation
  getDesignation(empcode) {
    this.isLoading =true;
    this.designation = [];
    this.service.getDesignation(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          this.designation = (response.json());
          this.designationcode = this.designation[0].designationcode;
          this.designationname = this.designation[0].designationname;
          if (this.designationcode != null)
            this.getKPI(this.designationcode);
        }

      });
  }
  //getDepartment
  getDepartment(empcode) {
    this.isLoading =true;
    this.department = [];
    this.service.getDepartment(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json()) {
          this.department = (response.json());
          this.departmentcode = this.department[0].departmentcode;
          this.departmentname = this.department[0].departmentname;
          this.officecode = this.department[0].officecode;
        }
      });
  }
  //getDates
  getDates(Mode) {
    console.log(Mode, this.period);

    var value = new Date(this.startdate.getDateFinal())
    if (Mode == 1) {
      this.enddate.setDate(this.enddate.getNextQuarter(value).EndDate);
    }
    else if (Mode == 2) //Monthly
    {
      console.log(value);
      this.enddate.getNextMonth(value);
    }
    else if (Mode == 3)//Weekly
    {
      console.log(value);
      this.enddate.getNextWeek(value);
    }



  }
  //getGridSearch
  getGridSearch(query: string) {
    this.service.getGridSearch(query)
      .subscribe(response => {
        this.order = (response.json());
      });
  }
  //getKPI
  getKPI(ID) {
    this.isLoading =true;
    this.service.getKPI(ID)
      .subscribe(response => {
      
        if (response.json() != null) {
          this.evaluationempdetails = (response.json());
          this.evaluationgroupcode = this.evaluationempdetails[0].evaluatioN_GROUP_EMP_ID;
          this.supervisorA = this.evaluationempdetails[0].supervisoR_SCORE_A;
          this.supervisorB = this.evaluationempdetails[0].supervisoR_SCORE_B;
          this.supervisorC = this.evaluationempdetails[0].grouP_HEAD_SCORE;
          console.log(this.evaluationgroupcode, this.supervisorA, this.supervisorB, this.supervisorC)

          for (let i = 0; i < this.evaluationempdetails.length; i++) {
            this.evaluationempdetails[i].evaluatioN_GROUP_EMP_ID = 0;
            this.evaluationempdetails[i].supervisoR_SCORE_A = 0;
            this.evaluationempdetails[i].supervisoR_SCORE_B = 0;
            this.evaluationempdetails[i].grouP_HEAD_SCORE = 0;
          }
        }
        this.isLoading = false;
      });
  }
  //sumScore
  sumScore(index, sA, sB, sH) {
    this.evaluationempdetails[index].totaL_SCORE = parseInt(sA) + parseInt(sB) + parseInt(sH);
    this.totalscore = 0;

    for (let i = 0; i < this.evaluationempdetails.length; i++) {
      if (this.evaluationempdetails[i].totaL_SCORE >= 0)
        this.totalscore = this.totalscore + parseInt(this.evaluationempdetails[i].totaL_SCORE);
    }

  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {

      if (this.mode)
        ar.push({
          id: 0,
          text: ''
        });

      arr.forEach(
        function (obj) {

          ar.push({
            id: obj[valuetxt],
            text: obj[displaytxt]
          });

        });
    }
    return ar;
  }
  //open
  open(content) {
    //this.getCurrentDay();
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#submitAdd").prop("disabled", true);


    this.onFill();
    this.clearFields();

  }
  //detailOpen
  detailOpen(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    $("#submitAdd").hide();
    $("#submitUpdate").show();
    //this.clearFields();

  }
  //clearFields
  clearFields() {




    //this.empmodel;
    this.empcode = 0;
    this.empname = '';

    this.department = [];
    this.departmentcode = 0;
    this.departmentname = '';

    this.designation = [];
    this.designationcode = 0;
    this.designationname = '';

    this.officecode = 0;
    this.evaluationgroupcode = 0;

    //this.status: any;
    this.evaluationemp = [];
    this.evaluationempdetails = [];
    this.evaluationempcode = 0;
    //this.evaluationempname: any = '';

    this.supervisorA = 0;
    this.supervisorB = 0;
    this.supervisorC = 0;
    this.startdate = new cDate();
    this.enddate = new cDate();

    //this.kpi = [];
    //this.kpicode = 0;
    //this.kpiname = '';
    //this.weight= 0;
    //this.goal = '';
    this.totalscore = 0;


    this.guid = UUID.UUID();
    this.mode = false;
    this.btnMode = true;
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);

  }
  //getDetailsByID
  getDetailsByID(ID, content) {
    this.detailOpen(content);
    this.mode = true;
    this.btnMode = false;

    this.service.getDetailsByID(ID)
      .subscribe((o: EvaluationEmp) => {
        console.log(o);
        this.evaluationempcode = ID;
        this.period = o.quarteR_ID;
        this.getDates(o.quarteR_ID);
        this.totalscore = o.finaL_SCORE;
        this.supervisorA = o.suP_A_ID;
        this.supervisorB = o.suP_B_ID;
        this.supervisorC = o.gH_ID;
        this.evaluationgroupcode = o.evaluatioN_GROUP_ID;

        this.isLoading =true;
        this.service.getEmployees(o.emP_ID)
          .subscribe(response => {
            this.isLoading = false;
            this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
            this.empmodel = o.emP_ID;
            //this.empname = this.emplist[0].text;
            this.isLoading =true;
            this.designation = [];
            this.service.getDesignation(o.emP_ID)
              .subscribe(response => {
                this.isLoading = false;
                if (response.json()) {
                  this.designation = (response.json());
                  this.designationcode = o.designatioN_ID;


                  this.isLoading =true;
                  this.department = [];
                  this.service.getDepartment(o.emP_ID)
                    .subscribe(response => {
                      this.isLoading = false;
                      if (response.json()) {
                        this.department = (response.json());
                        this.departmentcode = o.designatioN_ID;
                        this.officecode = this.department[0].officecode;

                        this.evaluationempdetails = o.evaluationEmpDetails;
                        this.service.getKPIList()
                          .subscribe(response => {
                            for (let i = 0; i < this.evaluationempdetails.length; i++) {

                              if (response.json() != null) {
                                this.kpi = (response.json());

                                for (let j = 0; j < this.kpi.length; j++) {
                                  if (this.evaluationempdetails[i].kpI_ID == this.kpi[j].kpicode) {
                                    this.evaluationempdetails[i].kpI_NAME = this.kpi[j].kpiname;
                                    break;
                                  }
                                }


                              }

                            }
                          });

                      }
                    });

                }
              });

          });

      });
  }
  //saveData
  saveData() {
    var strtdate=$("#strtdt").val();
    var enddate=$("#enddt").val();
    if(strtdate=='' || strtdate.toString().length<10){
      swal("Start Date Is Empty Or Invalid");
      return;
    }
    if(enddate=='' || enddate.toString().length<10){
      swal("End Date Is Empty Or Invalid");
      return;
    }
    this.isLoading =true; 
    if (this.evaluationempdetails.length > 0) {
      var data = new EvaluationEmp(0, this.period, this.designationcode, this.evaluationgroupcode, this.officecode, this.empcode, this.supervisorA, this.supervisorB, this.supervisorC, this.totalscore, this.logedInUserID, this.evaluationempdetails);

      console.log(data);
      this.service.saveData(data).then(
        (response) => {
          this.isLoading = false;
          this.getGrid();
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
      //this.hideGrid();
    }
    else {
      this.isLoading = false;
      swal("Detail is Required.");
    }


  }
  //updateData
  updateData() {
    var strtdate=$("#strtdt").val();
    var enddate=$("#enddt").val();
    if(strtdate=='' || strtdate.toString().length<10){
      swal("Start Date Is Empty Or Invalid");
      return;
    }
    if(enddate=='' || enddate.toString().length<10){
      swal("End Date Is Empty Or Invalid");
      return;
    }
    if (this.evaluationempdetails.length > 0) {
      var data = new EvaluationEmp(this.evaluationempcode, this.period, this.designationcode, this.evaluationgroupcode, this.officecode, this.empcode, this.supervisorA, this.supervisorB, this.supervisorC, this.totalscore, this.logedInUserID, this.evaluationempdetails);

      this.service.updateData(data).then(
        (response) => {
          this.getGrid();
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
  }
  //getDismissReason
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  // end of modal
}

