import * as $ from 'jquery';
import swal from 'sweetalert';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbDateParserFormatter, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SalaryPackageService, LoginService, SalaryPackage, PackageAllowance, cDate, NgbDateFRParserFormatter, PermissionUtility, Employee } from '../../../../shared';

@Component({
  selector: 'salary-package',
  templateUrl: './salary-package.component.html',
  styleUrls: ['./salary-package.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class SalaryPackageComponent implements OnInit {

  logedInUserID: any = 1;
  UserSessionID: any = 0;

  p: number = 1;
  id: any;
  modalReference: NgbModalRef;
  isLoading: any = false;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = false;
  submitAdd: any;
  submitUpdate: any;
  gridlist: any[] = [];
  empdropdown: Array<Select2OptionData>;
  empmodel: any;
  empcode: any = 0;
  empname: any = '';
  emplist: any[] = [];
  emplistR: any[] = [];
  designationname: any = '';
  departmentname: any = '';
  officename: any = '';
  emptypename: any = '';
  emptypecode: any = '';
  joining: any = '';
  currenteffect: any = '';
  currentpkg: any = 0;
  public effectivefromdate = new cDate();
  allowancesList: any[] = [];
  packageallowanceList: any[] = [];
  allowance: any[] = [];
  contribution: any[] = [];
  deduction: any[] = [];

  grosssalary: any = 0;
  packageamount: any = 0;
  allowancetotal: any = 0;
  contributiontotal: any = 0;
  deductiontotal: any = 0;
  remarks: any = '';
  public permissionUtility: PermissionUtility = new PermissionUtility();
  package: any[] = [];
  packagecode: any = 0;
  packageallowancecode: any = 0;

  addbutton: any = '';
  addnewrow: any = 'none';
  grossTitle: any = 'Gross Salary';
  hourlyRate: any = 0;
  specialRate: any = 0;
  holidayRate: any = 0;
  dailyWorkingHours: any = 0;
  ////////////////////////
  userOffice: any;
  userPrivilegedOffice: any;
  userCurrentOffice: any;
  userCurrentWarehouse: any;
  priviledged_Offices: any;
  constructor(private LoginService: LoginService, private service: SalaryPackageService, private modalService: NgbModal) {

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.priviledged_Offices = this.userPrivilegedOffice;
    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getGrid("");
    this.getAllowanceAll();
    this.logedInUserID = this.service.getSession('user_ID');
    this.permissionUtility.setPagePermissions(30010);
  }

  //getFills
  getFills() {
    this.getEmployees();
  }
  //getGrid
  getGrid(value: any) {
    this.isLoading = true;
    this.service.getGrid(value, this.userPrivilegedOffice)
      .subscribe(response => {
        if (response.json() !== null) {
          this.isLoading = false;
          this.gridlist = (response.json());

          // console.log(response.json());
        }
        else {
          this.isLoading = false;
          this.gridlist = [];
        }

      });
  }
  //getEmployees
  getEmployees() {
    this.isLoading = true;
    this.service.getEmployees(this.userPrivilegedOffice)
      .subscribe(response => {
        this.isLoading = false;
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.emplistR = (response.json());
      });
  }
  //getEmployeesChange
  getEmployeesChange(e: any) {
    this.empcode = e;

    for (let i = 0; i < this.emplistR.length; i++)
      if (this.emplistR[i].empcode == this.empcode) {
        this.designationname = this.emplistR[i].designationname;
        this.departmentname = this.emplistR[i].departmentname;
        this.officename = this.emplistR[i].officename;
        this.emptypename = this.emplistR[i].emptypename;
        this.emptypecode = this.emplistR[i].emptypecode;
        this.joining = this.emplistR[i].joining;
        this.getCurrentEffect(this.empcode);
        if (this.emptypecode == 1 || this.emptypecode == 2)
          this.grossTitle = "Gross Salary";
        else if (this.emptypecode == 3)
          this.grossTitle = "Daily Wage";
        else if (this.emptypecode == 4)
          this.grossTitle = "Hourly Salary";
        else if (this.emptypecode == 5)
          this.grossTitle = "Base Salary";
      }
    this.getAllowanceGrids();
  }
  //getCurrentEffect
  getCurrentEffect(empcode) {
    this.isLoading = true;
    this.service.getCurrentEffect(empcode)
      .subscribe(response => {
        this.isLoading = false;
        this.currenteffect = '';
        this.currentpkg = '';
        var List = (response.json());
        if (List != null) {
          this.currenteffect = List[0].currenteffectdate;
          this.currentpkg = List[0].currentpackage;
        }
      });
  }
  //getAllowanceGrids
  getAllowanceGrids() {
    this.getAllowance(this.empcode);
    this.getContribution(this.empcode);
    this.getDeduction(this.empcode);
  }
  //getAllowanceAll
  getAllowanceAll() {
    this.isLoading = true;
    this.service.getAllowanceAll()
      .subscribe(response => {
        this.allowancesList = response.json();
        //console.log(this.allowancesList);
      });
  }
  //getAllowance
  getAllowance(empcode) {
    //console.log('HERE')
    this.isLoading = true;
    this.service.getAllowance(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (this.grosssalary > 0) {
          this.allowance = (response.json());
          this.calculateAllowances(this.allowance, this.grosssalary);
        }
      });
  }
  //getContribution
  getContribution(empcode) {
    //console.log('HERE')
    this.isLoading = true;
    this.service.getContribution(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (this.grosssalary > 0) {
          this.contribution = (response.json());
          if (response.json() != null) {
            this.calculateContributions(this.contribution, this.grosssalary);
            console.log(this.allowance);
          }
        }
      });
  }
  //getDeduction
  getDeduction(empcode) {
    //console.log('HERE')
    this.isLoading = true;
    this.service.getDeduction(empcode)
      .subscribe(response => {
        this.isLoading = false;
        if (this.grosssalary > 0) {
          this.deduction = (response.json());
          if (response.json() != null) {
            this.calculateDeductions(this.deduction, this.grosssalary);
            console.log(this.deduction);
          }
        }
      });
  }
  //getDetailsByID
  getDetailsByID(empselected, packagecode, content) {
    //alert(empselected);
    this.mode = true;
    this.btnmode = false;
    this.allowancetotal = 0;
    this.contributiontotal = 0;
    this.deductiontotal = 0;
    this.packagecode = packagecode;
    this.service.getEmployees(this.userPrivilegedOffice)
      .subscribe(response => {
        this.emplist = this.getDropdownList(response.json(), "empcode", "empname");
        this.empcode = empselected;
        this.empmodel = empselected;
        this.emplistR = (response.json());

        for (let i = 0; i < this.emplistR.length; i++)
          if (this.emplistR[i].empcode == this.empcode) {
            this.designationname = this.emplistR[i].designationname;
            this.departmentname = this.emplistR[i].departmentname;
            this.officename = this.emplistR[i].officename;
            this.emptypename = this.emplistR[i].emptypename;
            this.emptypecode = this.emplistR[i].emptypecode;
            this.joining = this.emplistR[i].joining;
            //this.currentpkg = this.emplistR[i].currentpkg;
            var PRMPACKAGEList = this.emplistR[i].prM_PACKAGE;

            if (this.emptypecode == 1 || this.emptypecode == 2)
              this.grossTitle = "Gross Salary";
            else if (this.emptypecode == 3)
              this.grossTitle = "Daily Wage";
            else if (this.emptypecode == 4)
              this.grossTitle = "Hourly Salary";
            else if (this.emptypecode == 5)
              this.grossTitle = "Base Salary";

          }
        if (this.permissionUtility.PermissionView == '') {
          this.submitAdd = 'none';
          this.submitUpdate = 'none';
        }
        this.getCurrentEffect(empselected);

        this.service.getDetailsByID(packagecode)
          .subscribe(response => {
            var listbyid = response.json();
            this.grosssalary = listbyid[0].grosssalary;
            this.effectivefromdate.setDate(listbyid[0].effectivefromdate);
            this.remarks = listbyid[0].remarks;
            this.hourlyRate = listbyid[0].hourlyRate;
            this.specialRate = listbyid[0].specialRate;
            this.holidayRate = listbyid[0].holidayRate;
            this.dailyWorkingHours = listbyid[0].dailyWorkingHours;
            this.allowance = [];
            this.contribution = [];
            this.deduction = [];

            this.service.getSubDetailsByID(packagecode)
              .subscribe(response => {
                this.packageallowanceList = (response.json());

                this.service.getAllowance(empselected)
                  .subscribe(response => {
                    if (this.grosssalary > 0) {
                      this.allowance = (response.json());
                      this.updatePackageAllowanceList(1);
                      this.calculateAllowances(this.allowance, this.grosssalary);
                    }
                  });

                this.service.getContribution(empselected)
                  .subscribe(response => {
                    if (this.grosssalary > 0) {
                      this.contribution = (response.json());
                      if (response.json() != null) {
                        this.updatePackageAllowanceList(2);
                        this.calculateContributions(this.contribution, this.grosssalary);
                      }
                    }
                  });

                this.service.getDeduction(empselected)
                  .subscribe(response => {
                    if (this.grosssalary > 0) {
                      this.deduction = (response.json());
                      if (response.json() != null) {
                        this.updatePackageAllowanceList(3);
                        this.calculateDeductions(this.deduction, this.grosssalary);
                      }
                    }
                  });
              });
          });
        this.openDetail(content);
      });
  }
  //getSubDetailsByID
  getSubDetailsByID(packagecode) {
    this.isLoading = true;
    this.service.getSubDetailsByID(packagecode)
      .subscribe(response => {
        this.packageallowanceList = (response.json());
        this.updatePackageAllowanceList(1);
        this.updatePackageAllowanceList(2);
        this.updatePackageAllowanceList(3);

      });
  }
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = true;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.empcode = 0;
    //this.empmodel = 0;
    this.emplist = [];
    this.emplistR = [];

    this.designationname = '';
    this.departmentname = '';
    this.officename = '';
    this.emptypename = '';
    this.emptypecode = 0;
    this.joining = '';
    this.currentpkg = '';

    this.currenteffect = '';
    this.currentpkg = '';
    this.effectivefromdate = new cDate();
    this.grosssalary = 0;
    this.packageamount = 0;
    this.hourlyRate = 0;
    this.specialRate = 0;
    this.holidayRate = 0;
    this.allowance = [];
    this.contribution = [];
    this.deduction = [];
    this.packageallowanceList = [];
    this.getFills();
  }
  //IfExists
  IfExists(bookcode) {
    this.service.IfExists(bookcode)
      .subscribe(response => {
        this.status = (response.json());
        if (this.status == true) {
          $("#alertWarning").show();
          $("#submitUpdate").prop("disabled", true);
        }
        else {
          $("#alertWarning").hide();
          $("#submitUpdate").prop("disabled", false);
        }
      });
  }
  //saveData
  saveData() {
    if (this.empcode != 0) {
      if (this.grosssalary > 0) {
        this.createPackageAllowanceList();
        this.isLoading = true;
        var data = new SalaryPackage(0, this.empcode, this.grosssalary, this.packageamount, this.effectivefromdate.getDateFinal(), this.remarks, this.logedInUserID, this.UserSessionID, this.hourlyRate, this.specialRate, this.holidayRate, this.dailyWorkingHours, this.packageallowanceList);
        //console.log(data);
        this.service.saveData(data).then(
          (response) => {
            this.isLoading = false;
            this.getGrid("");
            this.modalReference.close();
          },
          (error) => console.log(error))
      } else
        swal('Enter Gross Salary!');
    }
    else {
      swal("Please Select Employee");
    }
  }
  //updateData
  updateData() {
    if (this.empcode != 0) {
      if (this.grosssalary > 0) {
        this.createPackageAllowanceList();
        this.isLoading = true;
        var data = new SalaryPackage(this.packagecode, this.empcode, this.grosssalary, this.packageamount, this.effectivefromdate.getDateFinal(), this.remarks, this.logedInUserID, this.UserSessionID, this.hourlyRate, this.specialRate, this.holidayRate, this.dailyWorkingHours, this.packageallowanceList);
        //console.log(data);
        this.service.updateData(data).then(
          (response) => {
            this.isLoading = false;
            this.getGrid("");
            this.modalReference.close();
          },
          (error) => console.log(error))
      } else
        swal('Enter Gross Salary!');
    }
    else {
      swal("Please Select Employee");
    }

  }
  //openAddModel
  open(content) {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.clearFields();

  }
  //openDetail modal
  openDetail(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    // this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
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
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
      if (this.btnmode)
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
  add() {
    this.addbutton = 'none';
    this.addnewrow = '';
  }
  cancel() {
    this.addbutton = '';
    this.addnewrow = 'none';

  }
  calculateAllowances(List, gross) {
    console.log(List);
    if (List == null || List == '' || List == 0) {
      swal("Please Select Employee");
      return;
    }
    var fixedamount = 0;
    if (List.length >= 1) {
      for (let i = 0; i < List.length; i++)
        if (List[i].basiC_GROSS_ALLOW == 'G') {
          fixedamount = gross * (List[i].prcent / 100);
          List[i].fixeD_AMOUNT = fixedamount.toFixed(0);
          List[i].fixedamounT_DISABLE = 1;

        }
        else if (List[i].basiC_GROSS_ALLOW == 'F') {
          if (List[i].fixeD_AMOUNT > 0) {
            List[i].fixedamounT_DISABLE = 1;
          }
          if (this.emptypecode > 2)
            List[i].fixeD_AMOUNT = this.grosssalary;
        }
        else if (List[i].basiC_GROSS_ALLOW == 'A') {
          var fixedamount = 0;
          var allowanceid;
          var parentfixedamount = 0;

          //Refered Allowance Code Evaluation for Fixed Amount
          for (let j = 0; j < this.allowancesList.length; j++) {
            if (this.allowancesList[j].allowancE_CODE == List[i].parenT_CODE) {

              if (this.allowancesList[j].basiC_GROSS_ALLOW == 'G') {
                parentfixedamount = gross * (this.allowancesList[j].prcenT / 100);

              }
              else if (this.allowancesList[j].basiC_GROSS_ALLOW == 'F') {
                parentfixedamount = this.allowancesList[j].fixeD_AMOUNT;

              }
            }
          }

          fixedamount = parentfixedamount * (List[i].prcent / 100);
          List[i].fixeD_AMOUNT = fixedamount.toFixed(0);
          List[i].fixedamounT_DISABLE = 1;

        }

      this.allowance = List;
      this.calculateAllowancesTotal();
    }
    else
      swal("plz");

  }
  calculateAllowancesTotal() {
    var List = this.allowance;
    var total = 0;
    for (let i = 0; i < List.length; i++)
      if (List[i].iS_DEFAULT == true) {
        var value = 0;
        if (List[i].fixeD_AMOUNT != null) {
          value = parseInt(List[i].fixeD_AMOUNT)
          //value = List[i].fixeD_AMOUNT
        }
        total = total + value;
      }
    this.allowancetotal = total;//.toFixed(2);
    this.getPackageAmount();
  }
  uncheckAllowance(id, value) {
    for (let i = 0; i < this.allowance.length; i++)
      if (this.allowance[i].allowancE_CODE == id) {
        this.allowance[i].iS_DEFAULT = value;
      }
    this.calculateAllowancesTotal();
    this.getPackageAmount();
  }
  calculateContributions(List, gross) {
    //alert(List.length);
    var fixedamount = 0;
    if (List.length >= 1) {
      for (let i = 0; i < List.length; i++)
        if (List[i].basiC_GROSS_ALLOW == 'G') {
          fixedamount = gross * (List[i].prcent / 100);
          List[i].fixeD_AMOUNT = fixedamount.toFixed(2);
          List[i].fixedamounT_DISABLE = 1;

        }
        else if (List[i].basiC_GROSS_ALLOW == 'F') {
          if (List[i].fixeD_AMOUNT > 0) {
            List[i].fixedamounT_DISABLE = 1;

          }
        }
        else if (List[i].basiC_GROSS_ALLOW == 'A') {
          var fixedamount = 0;
          var allowanceid;
          var parentfixedamount = 0;

          //Refered Allowance Code Evaluation for Fixed Amount
          for (let j = 0; j < this.allowancesList.length; j++) {

            if (this.allowancesList[j].allowancE_CODE == List[i].parenT_CODE) {

              if (this.allowancesList[j].basiC_GROSS_ALLOW == 'G') {
                parentfixedamount = gross * (this.allowancesList[j].prcenT / 100);

              }
              else if (this.allowancesList[j].basiC_GROSS_ALLOW == 'F') {
                parentfixedamount = this.allowancesList[j].fixeD_AMOUNT;

              }
            }
          }
          fixedamount = parentfixedamount * (List[i].prcent / 100);
          List[i].fixeD_AMOUNT = fixedamount.toFixed(2);
          List[i].fixedamounT_DISABLE = 1;

        }

      this.contribution = List;
      this.calculateContributionsTotal();
    }

  }
  calculateContributionsTotal() {
    //alert('here')
    //console.log(this.contribution)
    var List = this.contribution;
    var total = 0;
    for (let i = 0; i < List.length; i++)
      if (List[i].iS_DEFAULT == true) {
        var value = 0;
        if (List[i].fixeD_AMOUNT != null) {
          value = parseFloat(List[i].fixeD_AMOUNT)
        }
        total = total + value;
        // console.log(total)
      }
    this.contributiontotal = total;//.toFixed(2);

  }
  uncheckContribution(id, value) {


    for (let i = 0; i < this.contribution.length; i++)
      if (this.contribution[i].allowancE_CODE == id) {
        this.contribution[i].iS_DEFAULT = value;
      }
    this.calculateContributionsTotal();

  }
  calculateDeductions(List, gross) {
    var fixedamount = 0;
    if (List.length >= 1) {
      for (let i = 0; i < List.length; i++)
        if (List[i].basiC_GROSS_ALLOW == 'G') {
          fixedamount = gross * (List[i].prcent / 100);
          List[i].fixeD_AMOUNT = fixedamount.toFixed(2);
          List[i].fixedamounT_DISABLE = 1;

        }
        else if (List[i].basiC_GROSS_ALLOW == 'F') {
          if (List[i].allowancE_CODE == 3050) {
            List[i].checkboX_DISABLE = 1;
            List[i].iS_DEFAULT = 1;
          }
          if (List[i].fixeD_AMOUNT > 0) {
            List[i].fixedamounT_DISABLE = 1;

          }
        }
        else if (List[i].basiC_GROSS_ALLOW == 'A') {
          var fixedamount = 0;
          var allowanceid;
          var parentfixedamount = 0;

          //Refered Allowance Code Evaluation for Fixed Amount
          for (let j = 0; j < this.allowancesList.length; j++) {

            if (this.allowancesList[j].allowancE_CODE == List[i].parenT_CODE) {

              if (this.allowancesList[j].basiC_GROSS_ALLOW == 'G') {
                parentfixedamount = gross * (this.allowancesList[j].prcenT / 100);

              }
              else if (this.allowancesList[j].basiC_GROSS_ALLOW == 'F') {
                parentfixedamount = this.allowancesList[j].fixeD_AMOUNT;

              }
            }
          }
          fixedamount = parentfixedamount * (List[i].prcent / 100);
          List[i].fixeD_AMOUNT = fixedamount.toFixed(2);
          List[i].fixedamounT_DISABLE = 1;

        }

      this.deduction = List;

      this.calculateDeductionsTotal();
    }

  }
  calculateDeductionsTotal() {
    var List = this.deduction;
    var total = 0;
    for (let i = 0; i < List.length; i++)
      if (List[i].iS_DEFAULT == true) {
        var value = 0;
        if (List[i].fixeD_AMOUNT != null) {
          value = parseFloat(List[i].fixeD_AMOUNT)
        }
        total = total + value;
      }
    this.deductiontotal = total.toFixed(2);
  }
  uncheckDeduction(id, value) {
    for (let i = 0; i < this.deduction.length; i++)
      if (this.deduction[i].allowancE_CODE == id) {
        this.deduction[i].iS_DEFAULT = value;
      }
    this.calculateDeductionsTotal();
  }
  getPackageAmount() {
    //var value = this.allowancetotal - this.deductiontotal;
    this.packageamount = this.allowancetotal;

  }
  createPackageAllowanceList() {
    this.isLoading = true;
    this.packageallowanceList = [];
    if (this.allowance != null) {
      for (let i = 0; i < this.allowance.length; i++) {
        if (this.allowance[i].iS_DEFAULT != 0) {
          this.packageallowanceList.push(new PackageAllowance(this.packageallowancecode, this.allowance[i].allowancE_CODE, parseFloat(this.allowance[i].fixeD_AMOUNT)));
        }
      }
    }
    if (this.contribution != null) {
      for (let i = 0; i < this.contribution.length; i++) {
        if (this.contribution[i].iS_DEFAULT != 0) {
          this.packageallowanceList.push(new PackageAllowance(this.packageallowancecode, this.contribution[i].allowancE_CODE, parseFloat(this.contribution[i].fixeD_AMOUNT)));
        }
      }
    }
    if (this.deduction != null) {
      for (let i = 0; i < this.deduction.length; i++) {
        if (this.deduction[i].iS_DEFAULT != 0) {
          this.packageallowanceList.push(new PackageAllowance(this.packageallowancecode, this.deduction[i].allowancE_CODE, parseFloat(this.deduction[i].fixeD_AMOUNT)));
        }
      }
    }
    this.isLoading = false;

  }
  updatePackageAllowanceList(CASE) {
    if (this.packageallowanceList != null) {

      if (this.allowance != null && CASE == 1) {

        for (let i = 0; i < this.allowance.length; i++) {
          for (let j = 0; j < this.packageallowanceList.length; j++) {
            if (this.allowance[i].allowancE_CODE == this.packageallowanceList[j].allowancecode) {
              this.allowance[i].fixeD_AMOUNT = this.packageallowanceList[j].amount;
              this.allowance[i].iS_DEFAULT = true;
              //this.calculateAllowancesTotal();
            }
          }
        }
      }
      if (this.contribution != null && CASE == 2) {

        for (let i = 0; i < this.contribution.length; i++) {
          for (let j = 0; j < this.packageallowanceList.length; j++) {
            if (this.contribution[i].allowancE_CODE == this.packageallowanceList[j].allowancecode) {
              this.contribution[i].fixeD_AMOUNT = this.packageallowanceList[j].amount;
              this.contribution[i].iS_DEFAULT = true;
              //this.calculateContributionsTotal();
            }
          }
        }
      }
      if (this.deduction != null && CASE == 3) {

        for (let i = 0; i < this.deduction.length; i++) {
          for (let j = 0; j < this.packageallowanceList.length; j++) {
            if (this.deduction[i].allowancE_CODE == this.packageallowanceList[j].allowancecode) {
              this.deduction[i].fixeD_AMOUNT = this.packageallowanceList[j].amount;
              this.deduction[i].iS_DEFAULT = true;
              //this.calculateDeductionsTotal();
            }
          }
        }
      }
    }
  }
}
