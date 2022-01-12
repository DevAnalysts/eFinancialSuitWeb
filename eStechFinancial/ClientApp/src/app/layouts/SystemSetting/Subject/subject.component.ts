import { Component, OnInit} from '@angular/core';
import { SubjectService, Subject, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'subject',
  templateUrl: './subject.component.html',
    styleUrls: ['./subject.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class SubjectComponent implements OnInit {
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation();
 
  p: number = 1;
  ID: any = '';
  grid: any[] = [];
  subjectcode: any = 0;
  subjectname: any = "";  
  active: any = false;
  mode: any = false;
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

  sortorder1: any = 0;
  sortorder2: any = 0;
  sortorder3: any = 0;
  sortorder4: any = 0;


  //End Member Variables
  constructor(private service: SubjectService) { }

  ngOnInit() {
    this.getGrid();
      this.logedInUserID = this.service.getSession('user_ID');
       this.permissionUtility.setPagePermissions(110606);
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
    //console.log();
    this.service.getGrid()
      .subscribe(response => {
        this.grid = (response.json());
        this.isLoading = false;
        //console.log(response.json());
      });
  }
  //saveData
  saveData() {
    var Data = new Subject(0, this.subjectname, this.active, this.sortorder1, this.sortorder2, this.sortorder3, this.sortorder4);
    //console.log(Data);
    var subjectname=this.subjectname.trim();
    if (subjectname!= "") {
      this.service.saveData(Data).then(
        (response) => {
          this.subjectcode = 0;
          this.subjectname = '';
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));
      
    }
    else{
      if(subjectname.replace(/\s/g,"").length<=0)
      this.subjectname='';
      swal("Subject Name Must Be Defined.");
    }
      
  }
  //updateData
  updateData() {
    var Data = new Subject(this.subjectcode, this.subjectname, this.active, this.sortorder1, this.sortorder2, this.sortorder3, this.sortorder4);
    var subjectname=this.subjectname.trim();
    if (subjectname!= "")  {
      this.service.updateData(Data).then(
        (response) => {
          this.subjectcode = 0;
          this.subjectname = '';
          this.active = true;

          this.card1style = 'card col-sm-12'
          this.addbutton='';
          this.permissionUtility.PermissionAdd = '';
          this.card2display = 'none'; 1
          this.ShowEmp1 = 'none'
          this.ShowEmp2 = 'none'
          this.getGrid();
        },
        (error) => console.log(error));

    }
    else{
      if(subjectname.replace(/\s/g,"").length<=0)
      this.subjectname='';
      swal("Subject Name Must Be Defined.");
    }
  }

  //getDetailsByID
    getDetailsByID(ID) { 
      //alert(1);       
    //console.log(ID, 'id');
    this.isLoading =true;
    this.service.getDetailsByID(ID)
        .subscribe(response => {
        var list = (response.json());
        this.subjectcode = ID;
            this.subjectname = list[0].subjectname;
           //alert(list[0].active);
        this.active = list[0].active;
        this.sortorder1 = list[0].sortorder1;
        this.sortorder2 = list[0].sortorder2;
        this.sortorder3 = list[0].sortorder3;
        this.sortorder4 = list[0].sortorder4;
        this.ShowEmp1 = 'none';
        this.ShowEmp2 = 'none';
        this.checkValue(this.active);
        this.isLoading = false;
      });
  }

   
    Add() {
    this.mode = false;
    this.permissionUtility.PermissionAdd = 'none';
    this.card1style = 'card col-sm-7'
    this.card2display = '';
    this.addbutton = 'none';
    if (this.permissionUtility.PermissionAdd)
    this.ShowEmp1 = '';
    this.ShowEmp2 = 'none';
    this.subjectcode = 0;
    this.subjectname = '';
    this.active = true;
    this.sortorder1 = 0;
    this.sortorder2 = 0;
    this.sortorder3 = 0;
    this.sortorder4 = 0;    
    this.checkValue(this.active);
    this.HandleGrid();
  }
    Edit() {
   // alert(2);
    this.mode = true;
    this.permissionUtility.PermissionAdd = 'none';
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
    // alert(2);
     this.mode = false;
     this.permissionUtility.PermissionAdd = 'none';
     this.permissionUtility.PermissionEdit='none'
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
    this.subjectname = '';
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










