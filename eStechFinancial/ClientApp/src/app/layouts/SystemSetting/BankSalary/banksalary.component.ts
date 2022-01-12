import { Component, OnInit } from '@angular/core';
import { BankSalaryService, BankAccountService, BankSalary, PermissionUtility, ChequeBookService } from '../../../shared';
import swal from 'sweetalert';
import { AnimationStyleMetadata } from '@angular/animations';

@Component({
  selector: 'banksalary',
  templateUrl: './banksalary.component.html',
  styleUrls: ['./banksalary.component.scss']
})
export class BankSalaryComponent implements OnInit {
  ////Member Variables
     
  public permissionUtility:PermissionUtility=new PermissionUtility();
  UserSessionID: any = 0; 
    
  p: number = 1;
  Itemsname: any = "";
  active: any = 0;
  edit: any[] = [];
  ID: any = '';

  edit1: any[] = [];
  category: any[] = [];
  item: any[] = [];

  // GET BRANCH &  BANK NAME 
  bankcode: any = 0;
  bankname: any = '';
  branchnum: any = 0;
  branchname: any = '';

  /////GET ACCOUNT TITLE
  SalarySignatoryiD: any = 0;
  AccTitle: any[] = [];
  accounttitlE: any = '';
  ///// get ACCOUNT NUMBER
  AccNo: any[] = [];
  Accountno: any = '';
  /// save the info
  signatorycodeL1: any = '';
  signatorycodeR1: any = '';
  signatorycodeL2: any = '';
  signatorycodeR2: any = '';
  sign1: any[] = [];
  sign2: any[] = [];
  sign3: any[] = [];
  sign4: any[] = [];
  s1; any = 0;
  s2: any = 0;
  s3: any = 0;
  s4: any = 0;

  basiC_GROSS_ALLOW: any = '';
  taxablE: any = '';
  typE: any= '';
  activE: any = 0;
  //Gross Details//
  grosscode: any = 0;
  grossname: any = '';
  I_gross: any[] = [];

  /// Type Details ///
  type: any[] = [];
  typecode: any = 0;
  typename: any = '';
  ///////Details Show/Hide All/GRS/FNL////
  albtn: any = '';
  grsbtn: any = 'none';
  fnlbtn: any = 'none';
  a1: any = '';
  a2: any = '';
  a3: any = '';


  card1display: any = '';
  card2display: any = 'none';
  addbutton: any = '';
  card1style: any = 'card col-sm-12'
  card2style: any = 'card col-sm-5'
  ShowEmp1: any = 'none'
  ShowEmp2: any = 'none'
   isLoading: any = false;
  public checked: boolean = true;
  public unchecked: boolean = false;
  logedInUserID: any = 1;


  //End Member Variables
  constructor(private service: BankSalaryService, private bankAccountService:BankAccountService, private chequebookservice: ChequeBookService) { }

  ngOnInit() {
    //this.getPack_Allow();
    this.permissionUtility.setPagePermissions(30007);
    this.permissionUtility.setPermissionItem1(30007);
    this.permissionUtility.setPermissionItem2(30007);
    this.getbankSalary();
    this.getSignL1();
    this.getSignR1();
    this.getSignL2();
    this.getSignR2();
      this.logedInUserID = this.service.getSession('user_ID');
      
  }

  //------------------------------------SIGNATORY DROPDOWN CODE----------------------------//
  /// GET SIGNATTORY LEFT 1 
  getSignL1() {
    this.isLoading =true;
   /// console.log();
    this.service.getSignL1()
      .subscribe(response => {
        this.sign1 = (response.json());
        //this.s1 = this.sign1[0].SalarySignatoryiD;
        //this.signatorycodeL1 = this.sign1[0].signatorycodeL1,
          this.isLoading = false;
      //  console.log(response.json());
      })
  }

  /// GET SIGNATORY RIGHT 1
  getSignR1() {
    this.isLoading =true;
    console.log();
    this.service.getSignR1()
      .subscribe(response => {
        this.sign2 = (response.json());
        //this.s2 = this.sign2[0].salarySignatoryiD;
        //this.signatorycodeR1 = this.sign2[0].signatorycodeR1,
          this.isLoading = false;
       console.log('r1',response.json());
      })
  }

  /// GET SIGNATORY LEFT 2
  getSignL2() {
    this.isLoading =true;
    //console.log();
    this.service.getSignL2() 
      .subscribe(response => {
        this.sign3 = (response.json());
        //this.s3 = this.sign3[0].SalarySignatoryiD;
        //this.signatorycodeL2 = this.sign3[0].signatorycodeL2,
          this.isLoading = false;
       // console.log(response.json());
      })
  }

  /// GET SIGNATORY RIGHT 2
  getSignR2() {
    this.isLoading =true;
    //console.log();
    this.service.getSignR2()
      .subscribe(response => {
        this.sign4 = (response.json());
        //this.s4 = this.sign4[0].SalarySignatoryiD;
        //this.signatorycodeR2 = this.sign4[0].signatorycodeR2,
          this.isLoading = false;
       // console.log(response.json());
      })
  }
  //-------------------------------------END---------------------------------------------//
 

  ////// save the data on db
  saveSubject(bankcode, branchnum, accounttitlE, Accountno, signatorycodeL1, signatorycodeR1,  signatorycodeR2, signatorycodeL2) {
    if (this.a1 == 1) {
      var t = new BankSalary(0, bankcode, branchnum, this.a2, this.a1, signatorycodeL1, signatorycodeR1, signatorycodeL2, signatorycodeR2);

    } else {
      var t = new BankSalary(0, bankcode, branchnum, this.a2, this.a1, signatorycodeL1, signatorycodeR1, signatorycodeL2, signatorycodeR2);
    }
    
    console.log(t);
    if (bankcode!= "") {
      this.service.saveSignatory(t).then(
        (response) => this.ngOnInit(),
        (error) => console.log(error));
      this.bankcode = '';
      this.branchnum = '';
      this.accounttitlE = '';
      this.Accountno = '';
      this.signatorycodeL1 = '';
      this.signatorycodeR1 = '';
      this.signatorycodeR2 = '';
      this.signatorycodeL2 = '';
      this.card1style = 'card col-sm-12'
      this.addbutton = '';
      this.card2display = 'none'; 1
      this.ShowEmp1 = 'none'
      this.ShowEmp2 = 'none'
      this.ngOnInit();
    }
    else
      swal("All Fields name must be define.");
  }
  ///GET BANK SALARY

  /// GET THE BANK 
  getbankSalary() {
    
    this.isLoading =true;
    this.bankAccountService.getBanks()
        .subscribe(response => {
          
            this.edit = (response.json());
            this.bankcode = this.edit[0].banK_CODE;
            this.bankname = this.edit[0].banK_NAME;
            console.log(this.edit);
            this.getBranchName(this.bankcode);

        });
  }
  /// GET BRANCH NAME 
  getBranchName(bankcode) {

      this.isLoading =true;
        this.edit1 =[];
        this.bankAccountService.getBankBranches(bankcode)
            .subscribe(response => {
                this.isLoading = false;
                this.edit1 = (response.json()); 
                if (this.edit1 != null) {
                    this.branchnum = this.edit1[0].brancH_CODE;
                    this.branchname = this.edit1[0].brancH_NAME;
                    this.isLoading =false;
                    this.getAccountTITLE(this.branchnum);
                } 
                //   console.log(response.json());      
            });
  }
  // GET ACCOUNT TITLE
  getAccountTITLE(branchnum) {
    this.AccTitle =[];
    this.isLoading =true;
      this.chequebookservice.getAccounts(branchnum)
          .subscribe(response => {
              this.AccTitle = (response.json());
              if (this.AccTitle != null) {
                  this.accounttitlE = this.AccTitle[0].accounT_TITLE;
                  this.a1 = this.AccTitle[0].accounT_TITLE;
                  this.getAccountNO(this.accounttitlE);
              }
              this.isLoading = false;

          });
}
  // GET ACCOUNT NUMBER 
  getAccountNO(accounttitlEl: any) {
    this.isLoading =true;
    this.AccNo = [];
    console.log(accounttitlEl);
    this.accounttitlE = accounttitlEl;
    this.service.getAccountNO(accounttitlEl)
      .subscribe(response => {
        this.AccNo = (response.json());
        this.a2 = this.AccNo[0].aCCOUNT_NO;
        this.Accountno = this.AccNo[0].aCCOUNT_NO; 
        this.isLoading = false;
        //console.log(response.json());
      })
  }
  
   //----------------------------------- END --------------------------------------//
  Add() {

    this.card1style = 'card col-sm-7'
    this.card2display = '';
      this.addbutton = 'none';
      this.ShowEmp2 = 'none';
      if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    //this.accoutname = '';
  }
  Edit() {
    this.card1style = 'card col-sm-7'
    this.card2display = '';
      this.addbutton = 'none';
      this.ShowEmp1 = 'none';
      if (this.permissionUtility.PermissionEdit)
          this.ShowEmp2 = '';
  }
  Cancel() {

    this.card1style = 'card col-sm-12'
    this.addbutton = '';
    this.card2display = 'none'; 1
    this.ShowEmp1 = 'none'
    this.ShowEmp2 = 'none'
  }
  changeal() {
    this.albtn = '';
    this.grsbtn = 'none';
    this.fnlbtn = 'none';
    this.a1 = 1; this.a2 = 0; this.a3 = 0;
  }
  changegr() {
    this.albtn = 'none';
    this.grsbtn = '';
    this.fnlbtn = 'none';
    this.a1 = 0; this.a2 = 1; this.a3 = 0;
  }
  changefl() {
    this.albtn = 'none';
    this.grsbtn = 'none';
    this.fnlbtn = '';
    this.a1 = 0; this.a2 = 0; this.a3 = 1;
  }

}










