import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { EvaluationGroupService, LoginService, DayEndService, customer, EvaluationGroup, EvaluationGroupDetail, EvaluationGroupDetails, cDate, NgbDateFRParserFormatter } from '../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'evaluation-group',
  templateUrl: './evaluation-group.component.html',
  styleUrls: ['./evaluation-group.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class EvaluationGroupComponent implements OnInit {
  ////////////////////////////////////////
  FUNCTIONALITYNAME: any = '';
  FUNCTIONALITYDETAILNAME: any = '';
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  PermissionAdd: any = 'none';
  PermissionEdit: any = 'none';
  PermissionView: any = 'none';
  PermissionDelete: any = 'none';
  PermissionSpecial: any = 'none';
  ////////////////////////////////////////
  @ViewChild('dvScroll') private myScrollContainer: ElementRef;

  //Member Variables
  p: number = 1;
  modalReference: NgbModalRef;
    order: any;
    id: any;

  grid: any[];

  designation: any[];
  designationcode: any = 0;
  designationname: any = '';

  supervisor: any[];
  supervisorcode1: any = 0;
  supervisorname1: any = '';

  supervisorcode2: any = 0;
  supervisorname2: any = '';

  supervisorcode3: any = 0;
  supervisorname3: any = '';

  headcode: any = 0;
  headname: any = '';
  status: any;
  evaluationgroup: any[];
  evaluationgroupdetail: any[];
  evaluationgroupdetails: any[];

  evaluationgroupcode: any;
  evaluationgroupname: any = '';

  kpi: any[];

  kpicode: any = 0;
  kpiname: any = '';
  weight: any = 0;
  goal: any = '';
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

  constructor(private service: EvaluationGroupService, private LoginService: LoginService, private DayEndService: DayEndService, private modalService: NgbModal) {
    this.evaluationgroupdetails = new Array<EvaluationGroupDetails>();
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
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    // console.log(FUNCTIONALITY);
    if (FUNCTIONALITY.length >= 1) {
      for (let i = 0; i < FUNCTIONALITY.length; i++)
        if (FUNCTIONALITY[i].page_Code == 20047) {
          this.FUNCTIONALITYNAME = FUNCTIONALITY[i].page_Name;
          this.FUNCTIONALITYDETAILNAME = FUNCTIONALITY[i].pd;

          //RolePermissions
          if (FUNCTIONALITY[i].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
          if (FUNCTIONALITY[i].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
          if (FUNCTIONALITY[i].edit == 1) { this.PermissionEdit = " " } else { this.PermissionEdit = "none" };
          if (FUNCTIONALITY[i].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
          if (FUNCTIONALITY[i].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

          //AuditTrail
          this.UserSessionID = FUNCTIONALITY[i].userSessionID;
        }
    }
    ////////////////////////^^^^^^^^^^^^^^^^^^^^^^^^^^^^///////////////////////////
  }
  //onFill
  onFill() {
    this.getDesignation();
    this.getSupervisor();
    this.getKPI();
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
  //getGridSearch
  getGridSearch(query: string) {
    this.service.getGridSearch(query)
      .subscribe(response => {
        this.order = (response.json());
      });
  }
  //getDesignation
  getDesignation() {
    this.service.getDesignation()
      .subscribe(response => {

        this.designation = (response.json());

      });
  }
  //getSupervisior
  getSupervisor() {
    this.service.getSupervisor()
      .subscribe(response => {

        this.supervisor = (response.json());

      });
  }
  //getKPI
  getKPI() {
    this.isLoading =true;
    this.service.getKPI()
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.kpi = (response.json());

        }
      });
  }
  //changeKPI
  changeKPI() {
    var list = this.kpi;
    if (list != null) {
      for (let i = 0; i < list.length; i++)
        if (list[i].kpicode == this.kpicode) {
          this.weight = list[i].weight;
          this.kpiname = list[i].kpiname;
          this.DelayCheck = true;
        }
    }
  }
  //changeKPIEdit
  changeKPIEdit(ID) {

    if (this.kpi != null) {
      for (let j = 0; j < this.kpi.length; j++)
        if (this.kpi[j].kpicode == ID) {
          this.weight = this.kpi[j].weight;
        }
    }

  }
  //addGrid
  addGrid(kpicode: any, kpiname: any, weight: any, goal: any) {
    if (this.DelayCheck) {
      this.DelayCheck = false;
      if (goal != 0) {

        if (kpicode != null) {

          var flag = false;
          if (this.evaluationgroupdetails.length > 0) {
            for (var count = 0; count < this.evaluationgroupdetails.length; count++) {
              if (this.evaluationgroupdetails[count].kpI_ID == kpicode) {
                flag = true;
                break;
              }
            }
          }
          if (flag == false) {
            this.evaluationgroupdetails.push(new EvaluationGroupDetail(0, 0, kpicode, kpiname, weight, goal, 0));
            console.log(this.evaluationgroupdetails);
            this.editMode = false;
            this.kpicode = 0;
            this.weight = 0;
            this.goal = '';
          } else {
            swal("Already Exists");
            return;

          }
        }
        else {
          this.DelayCheck = true;
          swal("KPI is Required.");
          return;
        }

      }
      else {
        this.DelayCheck = true;
        swal('Enter Goal')
        return;
      }
      $("#txt").focus();
      this.scrollToBottom();
    }

  }
  //changeMode
  changeMode(idx: any, i: EvaluationGroupDetail, Mode: any) {
    this.DelayCheck = true;
    if (Mode == 1) {
      $("#addnewrow").hide();
      this.editdisabled = 'disabled';
      this.removedisabled = 'disabled';

    }
    else {
      $("#addnewrow").show();
      this.editdisabled = '';
      this.removedisabled = '';

    }

    this.kpicode = this.evaluationgroupdetails[idx].kpI_ID;
    var flag = false;
    if (this.evaluationgroupdetails.length > 0) {
      for (var count = 0; count < this.evaluationgroupdetails.length; count++) {
        if (this.evaluationgroupdetails[count].kpI_ID == i.kpI_ID && idx != count) {
          flag = true;
          break;
        }
      }
    }
    if (Mode == 0) {


      if (flag == false) {
        if (i.goaL_TARGET != '') {
          i.edit_Mode = false;
        }
        else {
          $("#submitAdd").prop("disabled", true);
          $("#submitUpdate").prop("disabled", true);
          swal("Enter Goal!");
          return;
        }
      }
      else {
        $("#submitUpdate").prop("disabled", false);
        $("#submitAdd").prop("disabled", false);
        swal("Already Exists");
        return;
      }





    }
    else if (Mode == 2) {
      this.evaluationgroupdetails.splice(idx, 1);
    }
    else {
      for (let j = 0; j <= this.kpi.length; j++) {
        if (this.kpi[j].kpicode == i.kpI_ID) {
          this.kpicode = this.kpi[j].kpicode;
          this.kpiname = this.kpi[j].kpiname;
          this.weight = this.kpi[j].weight;
          this.goal = 0;
          break;
        }
      }
      console.log(i);
      i.edit_Mode = true;
    }
  }
  //clearFields
  clearFields() {

    this.designation = [];
    this.designationcode = 0;
    this.supervisor = [];
    this.supervisorcode1 = 0;
    this.supervisorcode2 = 0;
    this.supervisorcode3 = 0;
    this.headcode = 0;

    this.kpi = [];
    this.kpicode = 0;
    this.kpiname = '';
    this.weight = 0;
    this.goal = '';

    this.evaluationgroup = [];
    this.evaluationgroupdetail = [];
    this.evaluationgroupdetails = [];
    this.evaluationgroupname = '';
    this.evaluationgroupcode = 0;

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
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe((o: EvaluationGroup) => {
        this.isLoading = false;
        this.evaluationgroupcode = ID;
        this.evaluationgroupname = o.evaluatioN_GROUP;
        this.status = o.status;
        this.isLoading =true;
        this.service.getDesignation()
          .subscribe(response => {
            this.isLoading = false;
            this.designation = (response.json());
            this.designationcode = o.designatioN_ID;

            this.isLoading =true;
            this.service.getSupervisor()
              .subscribe(response => {
                this.isLoading = false;
                this.supervisor = (response.json());
                this.supervisorcode1 = o.supervisoR_A_ID
                this.supervisorcode2 = o.supervisoR_B_ID;
                this.headcode = o.grouP_HEAD_ID;

                this.evaluationgroupdetails = o.evaluationGroupDetails;

                this.isLoading =true;
                this.service.getKPI()
                  .subscribe(response => {
                    for (let i = 0; i < this.evaluationgroupdetails.length; i++) {

                      this.isLoading = false;
                      if (response.json() != null) {
                        this.kpi = (response.json());
                        this.kpicode = this.kpi[0].kpicode;
                        this.kpiname = this.kpi[0].kpiname;
                        this.weight = this.kpi[0].weight;
                        this.goal = '';

                        for (let j = 0; j < this.kpi.length; j++) {
                          if (this.evaluationgroupdetails[i].kpI_ID == this.kpi[j].kpicode) {
                            this.evaluationgroupdetails[i].kpI_NAME = this.kpi[j].kpiname;
                            this.evaluationgroupdetails[i].weightage = this.kpi[j].weight;
                            break;
                          }
                        }


                      }

                    }
                  });

              });
          });











      });
  }

  //saveData
  saveData() {
    this.isLoading =true;


    if (this.evaluationgroupdetails.length > 0) {
      var data = new EvaluationGroup(0, this.evaluationgroupname, this.designationcode, this.supervisorcode1, this.supervisorcode2, this.headcode, this.status, this.logedInUserID, this.evaluationgroupdetails);

      console.log(data);
      //if (this.mode != 0) {
      //  this.evaluationgroupdetails[0].edit_Mode = true;
      //}
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

    if (this.evaluationgroupdetails.length > 0) {
      var data = new EvaluationGroup(this.evaluationgroupcode, this.evaluationgroupname, this.designationcode, this.supervisorcode1, this.supervisorcode2, this.headcode, this.status, this.logedInUserID, this.evaluationgroupdetails);


      //if (this.mode != 0) {
      //  this.evaluationgroupdetails[0].edit_Mode = true;
      //}
      this.service.updateData(data).then(
        (response) => {
          this.getGrid();
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
  }
  edit() {
    this.mode = true;
    $("#pnlAdd").show();
    $("#pnlDetail").hide();
    $("#submitAdd").hide();
    $("#submitUpdate").show();
    $("#customer_ID").prop("disabled", true);
    $("#ddlcontact").prop("disabled", true);
    this.scrollToBottom();
    $("#submitAdd").prop("disabled", false);
  }
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
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
  getDropdownListItem(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    ar.push({
      id: 0,
      text: ''
    });
    if (arr != null) {
      arr.forEach(
        function (obj) {
          ar.push({
            id: obj[valuetxt],
            text: obj[valuetxt] + " : " + obj[displaytxt]
          });

        });
    }
    return ar;
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  //scrollToBottom
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  //
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
    this.scrollToBottom();
    //this.stockField();
  }
  // detailOpen
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

