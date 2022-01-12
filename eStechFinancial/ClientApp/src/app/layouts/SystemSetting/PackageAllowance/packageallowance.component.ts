import { Select2OptionData } from 'ng-select2';
import { Component, OnInit} from '@angular/core';
import { PackageAllowanceService, PackageAllowanceSetting, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'packageallowance',
  templateUrl: './packageallowance.component.html',
    styleUrls: ['./packageallowance.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class PackageAllowanceComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  grid: any[] = [];
  ID: any = '';
  allowance: Array<Select2OptionData>;
  allowancecodeM: any = 0;
  allowancecode: any = 0;
  allowancename: any = '';

  packageallowancecode: any = 0;
  packageallowancename: any = '';
  fixedamount: any = 0;
  percent: any = 0;
  basicgrossallow: any = '';
  taxable: any = 0;
  active: any = false;
  mode: any = false;


  ShowAllowanceRow: any = '';
  ShowFixedAmountRow: any = 'none';
  CheckBoxAllowance: any = true;
  CheckBoxFixedAmount: any = false;

  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
 isLoading: any = false;
  logedInUserID: any = 1;


  //End Member Variables
  constructor(private service: PackageAllowanceService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
      this.permissionUtility.setPagePermissions(110028);
  }
 ////////////////////////
  
checkValue(event: any) {
  if (this.mode == false) {
      if (event == true && this.permissionUtility.PermissionEdit!='none')
          this.ShowEmp1 = '';
  } else {
      if (event == true && this.permissionUtility.PermissionEdit!='none')
          this.ShowEmp2 = '';
  }
}
   
  //getGrid
  getGrid() {
    this.isLoading =true;
    //alert();
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        //console.log(response.json());
      });
  }
  //getAllowances
  getAllowances() {
    this.isLoading =true;
    console.log();
    this.service.getAllowances()
      .subscribe(response => {
        this.allowance = this.getDropdownList(response.json(), "allowancecode", "allowancename");
        this.allowancecode = this.allowance[0].id;
        this.allowancename = this.allowance[0].text;
        this.isLoading = false;
        //console.log(response.json());
      })

  }
  //changeAllowance
  changeAllowance(e) {
    this.allowancecode = e;
  }
  //getDropdownList
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    ar.push({
      id: '0',
      text: "Select Allowance..."
    });
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
  //saveData
  saveData() {
    if (this.CheckBoxAllowance) //Check If Basic Gross Allow is 'A' or 'F'
      var Data = new PackageAllowanceSetting(0, this.packageallowancename, 0, this.percent, 'A', this.allowancecode, this.taxable, this.active);
    else
      var Data = new PackageAllowanceSetting(0, this.packageallowancename, this.fixedamount, 0, 'F', '', this.taxable, this.active);

    console.log(Data);
    var packageallowancename=this.packageallowancename.trim();
    if (packageallowancename != "") {
      this.service.saveData(Data).then(
        (response) => {

          this.packageallowancecode = '';
          this.packageallowancename = '';
          this.basicgrossallow = '';
          this.percent = 0;
          this.fixedamount = 0;
          this.allowancecode = 0;
          this.taxable = 0;
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));

    }
    else{
      if(packageallowancename.replace(/\s/g,"").length<=0)
      this.packageallowancename='';
      swal("Package Allowance Name Must Be Defined.");
    }
      
  }
  //updateData
  updateData() {
    if (this.CheckBoxAllowance)
      var Data = new PackageAllowanceSetting(this.packageallowancecode, this.packageallowancename, 0, this.percent, 'A', this.allowancecode, this.taxable, this.active);
    else
      var Data = new PackageAllowanceSetting(this.packageallowancecode, this.packageallowancename, this.fixedamount, 0, 'F', '', this.taxable, this.active);

    console.log(Data);
    var packageallowancename=this.packageallowancename.trim();
    if (packageallowancename != "") {
      this.service.updateData(Data).then(
        (response) => {

          this.packageallowancecode = '';
          this.packageallowancename = '';
          this.basicgrossallow = '';
          this.percent = 0;
          this.fixedamount = 0;
          this.allowancecode = 0;
          this.taxable = 0;
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.ngOnInit();
        },
        (error) => console.log(error));

    }
    else{
      if(packageallowancename.replace(/\s/g,"").length<=0)
      this.packageallowancename='';
      swal("Package Allowance Name Must Be Defined.");
    }
  }
  //getDetailByID
  getDetailsByID(ID) {
    console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
      .subscribe(response => {
        var list = (response.json());
        console.log(list);
        this.packageallowancecode = ID;
        this.packageallowancename = list[0].packageallowancename;

        this.basicgrossallow = list[0].basicgrossallow;
        if (this.basicgrossallow == 'A') {
          this.CheckBoxAllowance = true;
          this.caseShowAllowanceRow()
        }
        else if (this.basicgrossallow == 'F') {
          this.CheckBoxFixedAmount = true;
          this.caseShowFixedAmountRow()
        }

        this.fixedamount = list[0].fixedamount;
        this.percent = list[0].percent;


        this.service.getAllowances()
          .subscribe(response => {
            this.allowance = this.getDropdownList(response.json(), "allowancecode", "allowancename");
            if (list[0].parentallowancecode != "") {
              this.allowancecodeM = list[0].parentallowancecode;
              this.allowancecode = list[0].parentallowancecode;
            }
            else {
              this.allowancecodeM = 0;
              this.allowancecode = 0;
              }
              this.ShowEmp1 = 'none';
              this.ShowEmp2 = 'none';
              this.checkValue(this.active);
            this.isLoading = false;

          })

        this.taxable = list[0].taxable;
        this.active = list[0].active;
        this.isLoading = false;
      });
  }



    Add() {

    this.permissionUtility.PermissionAdd = 'none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2='none'

    this.packageallowancecode = '';
    this.packageallowancename = '';
    this.basicgrossallow = '';
    this.percent = 0;
    this.fixedamount = 0;
    this.allowancecode = 0;
    this.taxable = 0;
    this.active = true;
    this.CheckBoxAllowance = true
    this.CheckBoxFixedAmount = false
    this.checkValue(this.active);

    this.HandleGrid();
    this.getAllowances();
  }
    Edit() {

    this.permissionUtility.PermissionAdd = 'none';
    this.mode = true;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none';
    if (this.permissionUtility.PermissionEdit)
    this.ShowEmp2 = '';
    this.checkValue(this.active);
    this.HandleGrid();
  }
  View() {

    this.permissionUtility.PermissionAdd = 'none';
    this.permissionUtility.PermissionEdit='none';
    this.mode = false;
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    this.ShowEmp1 = 'none'; 
    this.ShowEmp2 = 'none';
    //this.checkValue(this.active);
    this.HandleGrid();
  }
  Cancel() {

    this.permissionUtility.PermissionAdd = '';
    if(this.permissionUtility.PermissionView=='')
    this.permissionUtility.PermissionEdit='none';
    this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.packageallowancecode = '';
      this.packageallowancename = '';
      this.basicgrossallow = '';
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none';
      this.ShowEmp2 = 'none';

      //handles default visibility 
      $('#PageGrid').show();
  }
  caseShowAllowanceRow() {
    this.ShowAllowanceRow = '';
    this.ShowFixedAmountRow = 'none';
    this.CheckBoxAllowance = true;
    this.CheckBoxFixedAmount = false;
  }
  caseShowFixedAmountRow() {
    this.ShowAllowanceRow = 'none';
    this.ShowFixedAmountRow = '';
    this.CheckBoxAllowance = false;
    this.CheckBoxFixedAmount = true;
    }

    //handles visibility onresize window
    onResize(event) {
        if ($('#frm').is(":visible") && $(document).width() <= 767)
            $('#PageGrid').hide();
        else
            $('#PageGrid').show();
    }
    //handles visibility on button add click
    HandleGrid() {
        if ($(document).width() <= 767) {
            $('#PageGrid').hide();
        } else {
            $('#PageGrid').show();
        }
    }

}










