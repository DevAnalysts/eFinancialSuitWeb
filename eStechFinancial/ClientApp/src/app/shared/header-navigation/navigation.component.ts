import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
 
import { Router } from '@angular/router';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import swal from 'sweetalert';
import { LoginService, HeaderService, User } from '..';

declare var $: any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
ngOnInit(){
  this.instvalue= "none";
  $("#submitSave").prop('disabled',true);
}
  public config: PerfectScrollbarConfigInterface = {};
  submitSave:any=false;
  offices: any[];
  warehouses: any[];
  userOffice: any;
  userCurrentOffice: any;
  userCurrentOfficeName: any;
  userWarehouse: any;
  logedInUserID: any;
  login: any;
  userCurrentWarehouse: any;
  userCurrentWarehouseName: any;
  userPrivilegedOffice: any;
  officE_CODE: any;
  officE_NAME: any;
  warehouseID: any;
  warehouse: any;
  maxlength = false;
  smallletter=false;
  capitalletter=false;
  specialchar=false;
  num=false;
  char1=new RegExp(/[a-z]/);
  char2=new RegExp(/[A-Z]/);
  char3=new RegExp(/[0-9]/);
  char4=new RegExp(/[~!@#$%^&*()]/);
  char5=new RegExp('^[A-Za-z0-9~!@#$%^&*()]+$'); 
  instvalue: any;
  constructor(public router: Router, private modalService: NgbModal, private loginService: LoginService, private service: HeaderService) {

    if (this.loginService.getSession('userimage') != null)
      this.userimage = this.loginService.getSession('userimage');
    this.employeeName = this.loginService.getSession('employeeName');
    this.designation = this.loginService.getSession('designation');
    this.logedInUserID = this.loginService.getSession('user_ID');
    this.login=this.loginService.getSession('login');
  }
  public modalReference: NgbModalRef;
  public showSearch = false;
  public closeResult: string;
  public oldPassword: any;
  public newPassword: any;
  public confirmPassword: any;
  public password: any;
  public todo: any = '';
  public pendingtask: any[] = [];
  public completedtask: any[] = [];
  public showpending: any = '';
  public showcompleted: any = '';
  public utaskid: any = 0;
  public utask: any = '';
  public utaskDate: any = '';
  public utaskStatus: any = '';
  public utaskSaveButton: any = '';
  public employee = sessionStorage.getItem("login");
  public userimage: any = 'assets/images/image.png';
  public employeeName: any = '';
  public designation: any = '';

  // This is for Notifications
  notifications: Object[] = [
    {
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',
      subject: 'Just see the my new admin!',
      time: '9:30 AM'
    },
    {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    },
    {
      round: 'round-info',
      icon: 'ti-settings',
      title: 'Settings',
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    },
    {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  // This is for Mymessages
  mymessages: Object[] = [
    {
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:30 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    },
    {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',
      subject: 'I am a singer!',
      time: '9:08 AM'
    },
    {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }
  ];
  //defaultImage
  setDefaultPic() {
    this.userimage = "assets/img/logo.png";
  }
  //ngAfterViewInit
  ngAfterViewInit() {
    this.getPendingTask();
    this.getCompletedTask();
  }
  //ngFillOfficesAndWarehouses
  ngFillOfficesAndWarehouses() {
    //------------------------------------------------------------------------------------
    //-------------------Get Session Values  
    //------------------------------------------------------------------------------------
    this.userOffice = this.loginService.getSession('userOffice');
    this.userCurrentOffice = this.loginService.getSession('userCurrentOffice');
    this.userCurrentOfficeName = this.loginService.getSession('userCurrentOfficeName');
    this.userPrivilegedOffice = this.loginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.loginService.getSession('userCurrentWarehouse');
    //------------------------------------------------------------------------------------
    //-------------------Get Current Offices
    //------------------------------------------------------------------------------------
    this.loginService.getCurrentOffices(this.userPrivilegedOffice)
      .subscribe(response => {
        this.offices = (response.json());
        if (this.offices != null) {
          this.userOffice = this.offices[0].officE_NAME;
          for (let i = 0; i < this.offices.length; i++)
            if (this.offices[i].officE_CODE == this.userCurrentOffice) {
              var timer = setTimeout(() => this.officE_CODE = this.offices[i].officE_CODE, 500);
            }
            else { this.officE_CODE = this.offices[0].officE_CODE; }
        }
        else { this.officE_CODE = this.offices[0].officE_CODE; }
        //------------------------------------------------------------------------------------
        //-------------------Get Current Warehouses
        //------------------------------------------------------------------------------------
        this.loginService.getCurrentWareshouse(this.userOffice)
          .subscribe(response => {
            this.warehouses = (response.json());
            if (this.warehouses != null) {
              this.warehouseID = this.warehouses[0].warehouseID;
              this.userWarehouse = this.warehouses[0].warehouseName;
            }
          });
        this.loginService.getCurrentWareshouse(this.userCurrentOffice)
          .subscribe(response => {
            this.warehouses = (response.json());


            if (this.warehouses != null) {            
              for (let i = 0; i < this.warehouses.length; i++)
                if (this.warehouses[i].warehouseID == this.userCurrentWarehouse) {
                  var timer = setTimeout(() => this.warehouseID = this.warehouses[i].warehouseID, 500);
                }
                else { this.warehouseID = this.warehouses[0].warehouseID; }
            }
            else { this.warehouseID = this.warehouses[0].warehouseID; }


          });

      });
  }
     
  onLoggedout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.setItem("isLoggedIn", "False");
    this.router.navigate(['/newlogin']);
  }

  onOldPassword(event: any) {
    this.oldPassword = event.target.value;

  }

  onNewPassword(event: any) {
    this.newPassword = event.target.value;

  }
  instruction(password){ 
  this.instvalue = "";
  if(password.length>6 && password.length<=8)
  {this.maxlength=true;}else 
  this.maxlength=false;
  if(this.char1.test(password)) 
  {this.smallletter=true;}else
  this.smallletter=false;
  if(this.char2.test(password)) 
  {this.capitalletter=true;}else
  this.capitalletter=false;
  if(this.char3.test(password)) 
  {this.num=true;}else
  this.num=false;
  if(this.char4.test(password)) 
  {this.specialchar=true;}else
  this.specialchar=false;
  if(this.specialchar==true && this.capitalletter==true && this.smallletter==true && this.maxlength==true && this.num==true){
  $("#submitSave").prop('disabled',false); 
}
if(this.specialchar==false || this.capitalletter==false || this.smallletter==false || this.maxlength==false || this.num==false){
  $("#submitSave").prop('disabled',true);
}
  }
  
   
  onConfirmPassword(event: any) {
    this.confirmPassword = event.target.value;

  }

  changePassword() { 
    if(this.oldPassword=='' || this.oldPassword==null){
      swal("please enter the old password");
    }else{
    this.loginService.getLoginInfo(this.login, this.oldPassword)
      .subscribe((o: User) => {
        console.log(o); 
        if (o != null) { 
          if (this.newPassword != this.confirmPassword) {
            alert("confirm password does not match.");
          }
          else if(this.char5.test(this.newPassword)) {
            this.loginService.changePassword(this.logedInUserID, this.newPassword, this.oldPassword)
              .subscribe(response => {
                console.log('-------------------'+response);
              });
            this.modalReference.close();
          }
        }else
        swal("Old password is incorrect")  
      });
    }
  }

  changeOffice(officE_CODE) {
    if (this.offices != null) {
      for (let i = 0; i < this.offices.length; i++) {
        if (this.offices[i].officE_CODE == this.officE_CODE) {
          this.officE_NAME = this.offices[i].officE_NAME;
          sessionStorage.setItem('userCurrentOfficeName', this.officE_NAME);
        }
      }
    }

    this.loginService.getCurrentWareshouse(officE_CODE)
      .subscribe(response => {
        this.warehouses = (response.json());
        if (this.warehouses != null) {
          this.warehouseID = this.warehouses[0].warehouseID;
          this.warehouse = this.warehouses[0].warehouseName;
          sessionStorage.setItem('userCurrentWarehouse', this.warehouseID);
        }
      });
  }

  changeWarehouse(warehouseID) {
    if (this.warehouses != null) {
      for (let i = 0; i < this.warehouses.length; i++) {
        if (this.warehouses[i].warehouseID == this.warehouseID) {
          this.warehouseID = this.warehouses[i].warehouseID;
          this.warehouse = this.warehouses[i].warehouseName;
          sessionStorage.setItem('userCurrentWarehouse', this.warehouseID);
        }
      }
    } 
  }

  changeUserOfficeAndWarehouse() {
    //------------------------------------------------------------------------------------
    //-------------------Get Current Open Day
    //------------------------------------------------------------------------------------
    this.loginService.getCurrentDay(this.officE_CODE)
      .subscribe(response => {
        var dayEndDetail = (response.json());
        if (dayEndDetail != null) {
          sessionStorage.setItem('currentOpenDay', dayEndDetail[0].poS_Day);
        }
      });
    sessionStorage.setItem('userCurrentOffice', this.officE_CODE);
    sessionStorage.setItem('userCurrentWarehouse', this.warehouseID);
    this.router.navigate(['/dashboard']);
    this.modalReference.close();
  }

  setTask() {
    if (this.todo != '') {
      //setTask
      this.service.setTask(this.todo, this.logedInUserID)
        .subscribe(response => {
          var list = (response.json());
          this.todo = '';
          this.getPendingTask();
        });
    }
  }

  getPendingTask() {
    this.service.getPendingTask(this.logedInUserID)
      .subscribe(response => {
        if (response != null) {
          this.pendingtask = (response.json());
          this.getCompletedTask();
        }

      });
  }

  getCompletedTask() {
    this.service.getCompletedTask(this.logedInUserID)
      .subscribe(response => {
        if (response != null) {
          this.completedtask = (response.json());
        }
      });
  }

  setTaskCompleted(ID) {
    this.service.setTaskCompleted(ID, 2)
      .subscribe(response => {
        this.getPendingTask();
        this.getCompletedTask();
      });
  }

  deleteTask(ID) {
    this.service.deleteTask(ID, 0)
      .subscribe(response => {
        this.getPendingTask();
      });
  }

  showPending() {
    if (this.showpending != '') {
      this.showpending = '';
    }
    else {
      this.showpending = 'none';
    }
    this.getPendingTask();
  }

  showCompleted() {
    if (this.showcompleted != '') {
      this.showcompleted = '';
    }
    else {
      this.showcompleted = 'none';
    }
    this.getCompletedTask();
  }

  getTaskDetailsByID(ID, Task, Date, Status, Modal) {
    if (Status != 1) {
      this.utaskSaveButton = 'none';
    }
    else {
      this.utaskSaveButton = '';
    }
    this.utaskDate = Date;
    this.utask = Task;
    this.utaskid = ID;
    if (Status != 2) { this.utaskStatus = 'Pending'; }
    else { this.utaskStatus = 'Completed'; }
    this.openTask(Modal);
  }

  updateTask() {
    this.service.updateTask(this.utaskid, this.utask)
      .subscribe(response => {
        this.getPendingTask();
        this.getCompletedTask();
        this.modalReference.close();
      });
  }

  openTask(Modal) {
    const centerStyle = 'display: -webkit-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -ms-flex-align: center; align-items: center; min-height: calc(100% - (.5rem * 2));';
    this.modalReference = this.modalService.open(Modal, { size: 'sm', windowClass: 'my-modal' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, { size: 'lg' });
    $("#submitSave").prop('disabled',true);
    this.instvalue = "none"
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  openToDoList(toDoListContent) {
    this.modalReference = this.modalService.open(toDoListContent, { size: 'lg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
