import { Component, OnInit } from '@angular/core';
import { ExpenseTypeService, ExpenseType, PermissionUtility } from '../../../shared';
import swal from 'sweetalert';
import { Validation } from '@shared/common/validation';

@Component({
    selector: 'expensetype',
    templateUrl: './expensetype.component.html',
    styleUrls: ['./expensetype.component.scss']
    ,
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class ExpenseTypeComponent implements OnInit {
    public permissionUtility:PermissionUtility=new PermissionUtility(); 
    public valid:Validation=new Validation();
    cell: any = '';
    p: number = 1;
    Itemsname: any = "";
    //active: any = false;
    edit: any[] = [];

    expense: any[] = [];
    item: any[] = [];
    ID: any = '';
    id=0;
    find: any = '';
    namE: any = '';
    activE: any = false;
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


    //End Member Variables
    constructor(private service: ExpenseTypeService) { }

    ngOnInit() {
        this.getExpenseType();
        this.logedInUserID = this.service.getSession('user_ID');
        this.permissionUtility.setPagePermissions(110075);
    }
     ////////////////////////
  
    //checkValue
    checkValue(event: any) {
        if (this.mode == false) {
            if (event == true && this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp1 = '';
        } else {
            if (event == true && this,this.permissionUtility.PermissionEdit!='none')
                this.ShowEmp2 = '';
        }
    }
    
    ////getUsers
    getExpenseType() {
        this.isLoading = true;

        this.service.getExpense()
            .subscribe(response => {
                console.log(response.json());
                this.expense = (response.json());
                this.isLoading = false;
                console.log(response.json());
            });
    }
    //// save the data on db
    saveSubject(namE, activE) {
        var money = new ExpenseType(0, namE, activE);
        console.log(money);
        var namE=this.namE.trim();
        if (namE != "") {
            this.service.saveAssetSubCategory(money).then(
                (response) => {
                    this.ID = 0;
                    this.namE = '';
                    this.activE = true;

                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.card2display = 'none';
                    this.ShowEmp1 = 'none'
                    this.ShowEmp2 = 'none'
                    this.getExpenseType();
                },
                (error) => console.log(error));

        }
        else{
            if(namE.replace(/\s/g,"").length<=0)
            this.namE='';
            swal("Expense name must be define.");
          }
            
    }
    //////////  ////getDetailByID
    getDetailsByID(ID) {      
        this.isLoading = true;
        this.service.getDetailsByID(ID)
            .subscribe(response => {
                this.edit = (response.json());
                this.id = ID;
                this.namE = this.edit[0].namE;
                this.activE = this.edit[0].activE;
                this.ShowEmp1 = 'none';
                this.ShowEmp2 = 'none';
                this.checkValue(this.activE);
                this.isLoading = false;                
            });
    }
    ////////////Update the row
    UpdateSubject(namE, activE) {
        //console.log(namE, activE);    
        var money = new ExpenseType(this.id, namE, activE);
        var namE=this.namE.trim();
        console.log(namE, activE);   
        if (namE != "") {
            this.service.UpdateAssetSubCategory(money).then(
                (response) => {
                    this.id = this.edit[0].ID;
                    this.namE = this.edit[0].namE;
                    this.activE = this.edit[0].activE;
                 //   alert(this.edit[0].activE);
                    this.card1style = 'card col-sm-12'
                    this.addbutton='';
                    this.permissionUtility.PermissionAdd = '';
                    this.activE = true;
                    this.card2display = 'none';
                    this.ShowEmp1 = 'none';
                    this.ShowEmp2 = '';
                    this.getExpenseType();
                },
                (error) => console.log(error));

        }
        else{
            if(namE.replace(/\s/g,"").length<=0)
            this.namE='';
            swal("Expense name must be define.");
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
        this.ID = '';
        this.namE = '';
        this.activE = true;
        this.checkValue(this.activE);
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
        this.checkValue(this.activE);
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
        //this.checkValue(this.activE);
        this.HandleGrid();
       
    }
    Cancel() {
        this.permissionUtility.PermissionAdd = '';
        if(this.permissionUtility.PermissionView=='')
        this.permissionUtility.PermissionEdit='none';
        this.card1style = 'card col-sm-12'
        this.addbutton = '';
        this.ID = '';
        this.namE = '';
        this.card2display = 'none';
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










