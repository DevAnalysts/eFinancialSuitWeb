import { Account } from './../../../shared/models/others/Account';
import { Component, OnInit } from '@angular/core';
import { JournalAccount, PermissionUtility } from '../../../shared';
import { JournalAccountService} from '../../../shared/services/Admin/JournalAccount.service';
import swal from 'sweetalert';
import { Select2OptionData } from 'ng-select2';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'app-journalaccount',
  templateUrl: './journalaccount.component.html',
  styleUrls: ['./journalaccount.component.css']
  ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class JournalAccountComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
  cell: any = '';
  p: number = 1;
  Itemsname: any = "";
  //active: any = 0;
  edit: any[] = [];
  ID: any = '';
  i: any;
  journalaccounts: any[] = [];

  accountcodes: Array<Select2OptionData>;
  pageCodes: any[] = [];

  accountcode:any;
  accountCode:any;
  DelayCheck: any = true;

  pageID:any;
  journalaccountID: any;
      
  item: any[] = [];
  categorycode = 0;
  journalaccount = '';
  active: any = false;
  mode: any = false;
  contact_Name: any;

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
  constructor(private service: JournalAccountService) { }

  ngOnInit() {
        this.getGrid();
        this.logedInUserID = this.service.getSession('user_ID');        
        this.getAccountCode();
  this.getPageCode();
        this.permissionUtility.setPagePermissions(110613);
  }

   ////////////////////////
  

     //getUoM
     getAccountCode() {
      this.service.getAccountCode()
        .subscribe(response => {
  
          this.accountcodes = this.getDropdownList(response.json(), "accountCode", "accountTitle");
          this.accountcode = this.accountcodes[0].id; 
          //this.journalaccount = this.journalaccounts[0].accounttitle;
         
        });
    }
    // convert dropdown lables
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
  //getCustomerChange
  getAccountChange(e: any) {

    this.accountcode = e;
     
  }
    getPageCode() {
      this.service.getPageCode()
        .subscribe(response => {
  
          this.pageCodes = (response.json());
          this.pageID = this.pageCodes[0].pageID;

        
             //accountcode: 3, categoryType
          //console.log(response.json());
        });
    }
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
          this.isLoading = true;
         // console.log();
          this.service.getGrid()
              .subscribe(response => {
                  this.journalaccounts = (response.json());
                  console.log(this.journalaccounts);
                  this.isLoading = false;
                  //console.log(response.json());
              });
      }

      //saveData
    saveData() {

      var Data = new JournalAccount(0, this.journalaccount,this.accountcode,this.pageID, this.active,0);
      //console.log(Data);
      var journalaccount = this.journalaccount.trim();  
      if (journalaccount != "") {
          this.service.saveData(Data).then(
              (response) => {
                  this.journalaccount = '';
                  this.active = true;

                  this.card1style = 'card col-sm-12'
                  this.addbutton = '';
                  this.permissionUtility.PermissionAdd = '';
                  this.permissionUtility.PermissionEdit= '';
                  this.card2display = 'none'; 
                  this.ShowEmp1 = 'none'
                  this.ShowEmp2 = 'none'
                  this.getGrid();
              },
              (error) => console.log(error));

      }
      else{
          if(journalaccount.replace(/\s/g,"").length<=0)
          this.journalaccount='';
          swal("Account title Must Be Defined!");
          
        }
          
  }

  saveDataImport() {
    for (let i = 0; i < 4; i++) {
      var Data = new JournalAccount(0, this.journalaccount,this.accountcode,this.pageID, this.active,0);
        console.log(Data);
        if (this.journalaccount != "") {
            this.service.saveData(Data).then(
                (response) => {
                    this.journalaccount = '';
                    this.active = true;

                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.permissionUtility.PermissionEdit = '';
                    this.card2display = 'none';
                    this.ShowEmp1 = 'none'
                    this.ShowEmp2 = 'none'
                    this.getGrid();
                },
                (error) => console.log(error));

        }
        else
            swal("Category Name Must Be Defined!");
    }
}

   //getDetailByID
   getDetailsByID(ID) {  
    this.isLoading = true;
    this.service.getDetailsByID(ID)
        .subscribe(response => {
            var List = (response.json());
            this.journalaccountID = ID;
            this.journalaccount = List[0].accounttitle;                
            this.accountcode = List[0].accountcode; 
            this.pageID = List[0].pageID;
            this.active = List[0].active;
            this.ShowEmp1 = 'none';
            this.ShowEmp2 = '';
            this.checkValue(this.active);
            this.isLoading = false;
            //console.log(response.json());
        });
 }

 //updateData
 updateData() {

  var Data = new JournalAccount(this.journalaccountID, this.journalaccount,this.accountcode,this.pageID, this.active,1);
  console.log(Data);
  var journalaccount = this.journalaccount.trim();  
  if (journalaccount != "") {
      this.service.updateData(Data).then(
          (response) => {
              this.journalaccountID = 0;
              this.journalaccount = '';
              this.active = true;

              this.card1style = 'card col-sm-12'
              this.addbutton='';
              this.permissionUtility.PermissionAdd = '';
              this.permissionUtility.PermissionEdit = '';
              this.card2display = 'none'; 1
              this.ShowEmp1 = 'none'
              this.ShowEmp2 = 'none'
              this.getGrid();
          },
          (error) => console.log(error));

  }
  else{
      if(journalaccount.replace(/\s/g,"").length<=0)
      this.journalaccount='';
      swal("Account Title Must Be Defined!");
    }
}

Add() {
  
  this.permissionUtility.PermissionAdd = 'none';
  this.mode = false;
  this.card1style = 'card col-sm-7'
  this.card2display = '';
  this.addbutton = 'none';
  if (this.permissionUtility.PermissionAdd)
      this.ShowEmp1 = '';
  this.ShowEmp2 = 'none'; 
  this.journalaccountID = 0;
  this.journalaccount = '';
  this.active = true;
  this.checkValue(this.active);
  this.HandleGrid();

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
  this.mode = false;
  this.permissionUtility.PermissionAdd = 'none';
  this.permissionUtility.PermissionEdit = 'none';       
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
  this.permissionUtility.PermissionEdit = 'none';
  this.card1style = 'card col-sm-12'
  this.addbutton = '';
  this.journalaccount = '';
  this.card2display = 'none'; 1
  this.ShowEmp1 = 'none';
  this.ShowEmp2 = 'none';

  //handles default visibility 
  $('#PageGrid').show();
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
