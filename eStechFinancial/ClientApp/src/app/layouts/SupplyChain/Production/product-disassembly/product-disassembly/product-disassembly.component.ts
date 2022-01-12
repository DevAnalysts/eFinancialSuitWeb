import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ProductDisassemblyService, ProductDisassemly, ProductDisassemlyDetails, LoginService, cDate, NgbDateFRParserFormatter, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';

@Component({
  selector: 'product-disassembly',
  templateUrl: './product-disassembly.component.html',
  styleUrls: ['./product-disassembly.component.scss'],
  providers: [{ provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter }]
})
export class ProductDisassemblyComponent implements OnInit {
   
  logedInUserID: any = 1;
  UserSessionID: any = 0;
  public permissomUtility:PermissionUtility=new PermissionUtility(); 
  p: number = 1;
  modalReference: NgbModalRef;
  disassemblies: any[] = [];
  ProductDisassemlyDetails: any[];
  guid: any;
  users: any;
  closeResult: string;
  mode: any = 0;
  btnmode: any = 0;
  date = new Date();
  public disassemly_ID: any;
  public disassemly_NO: any = "";
  public item_ID: any = 1;
  public item_Code: any = 1;
  public order_Envoy: any = 1;
  public item_Name: any;
  public item_Detail: any = '';
  public office_Code: any;
  public remarks: any;
  public disassemly_Cost: any = 0;
  quantity: any = 1;
  unitPrices: any[];
  unit_Price: any = 1;
  stocks: any[];
  stock_Qty: any = "";
 isLoading: any = false;
  item: Array<Select2OptionData>;
  items: Array<Select2OptionData>;
  ID: any = "";
  public disassemly_Date = new cDate();
  EditItemButton: any = '';
  RemoveItemButton: any = '';
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;

  constructor(private service: ProductDisassemblyService, private LoginService: LoginService, private ngbDateParserFormatter: NgbDateParserFormatter,
    private modalService: NgbModal) {
    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');
    this.ProductDisassemlyDetails = new Array<ProductDisassemlyDetails>();
  }

  ngOnInit() {
    this.getDisassemly(this.ID);
    this.logedInUserID = this.LoginService.getSession('user_ID');
    ////////////////////////Set Name From Session Storage///////////////////////////
    this.permissomUtility.setPagePermissions(120009);  
  }
  //getDisassemly
  getDisassemly(value: string) {
    this.isLoading =true;
    this.service.getDisassemly(value)
      .subscribe(response => {
        this.isLoading = false;
        this.disassemblies = (response.json());

      });
  }
  //getItems  
  getItems() {
    this.isLoading =true;
    this.service.getItems()
      .subscribe(response => {
        this.isLoading = false;
        this.items = this.getDropdownList(response.json(), this.item_Code, this.item_Name);
        this.item_Code = this.items[0].id;
        this.item_Name = this.items[0].text;
        // console.log(response.json());
      });
  }
  //changeItems
  changeItems(e: any) {
    this.item_Code = e;

    var list = this.items;
    if (list.length >= 1) {
      for (let i = 0; i < list.length; i++)
        if (list[i].id == this.item_Code) {
          this.item_Name = list[i].text;

        }
    }
    this.isLoading =true;
    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.isLoading = false;
        if (response.json() != null) {
          this.unitPrices = (response.json());
          this.unit_Price = this.unitPrices[0].unit_Price;
          this.item_Name = this.unitPrices[0].item_Name;

          this.isLoading = true;
          this.service.getStocks(this.item_Code, this.userCurrentOffice, this.userCurrentWarehouse)
            .subscribe(response => {
              this.isLoading = false;
              if (response.json() != null) {
                this.stocks = (response.json());
                this.stock_Qty = this.stocks[0].stock_Qty;
              }
            });
        }
      });
    //  console.log(response.json());
  }
  //changeQuantity
  changeQuantity(quantity) {
    if (quantity <= 0) {
      this.quantity = 1;
    }
  }
  //changeQuantityEdit
  changeQuantityEdit(i: ProductDisassemlyDetails, quantity) {
    if (quantity <= 0) {
      i.quantity = 1;
    }
  }
  //getPriviledgedOffices
  getPriviledgedOffices() {
    this.service.getPriviledgedOffices()
      .subscribe(response => {
        this.users = (response.json());
        this.order_Envoy = this.users[0].order_Envoy;
        console.log(this.users);
      });
  }
  //Total Cost
  TotalCost() {
    var total_Cost = 0;
    if (this.ProductDisassemlyDetails.length > 0) {
      for (var count = 0; count < this.ProductDisassemlyDetails.length; count++) {
        total_Cost += this.ProductDisassemlyDetails[count].unit_Price * this.ProductDisassemlyDetails[count].quantity;
        this.disassemly_Cost = total_Cost;
      }
    }
    return total_Cost.toFixed(2);
  }
  //TotalQty
  TotalQty() {
    var sum = 0;
    if (this.ProductDisassemlyDetails.length > 0) {
      for (var count = 0; count < this.ProductDisassemlyDetails.length; count++) {
        sum += this.ProductDisassemlyDetails[count].quantity;
        this.disassemly_Cost = sum;
      }
    }

    return sum.toFixed(2);
  }
  // convert dropdown lables
  getDropdownList(arr: any[], valuetxt: any, displaytxt: any): any {
    let ar: Array<any> = [];
    if (arr != null) {
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
  //clearFields
  clearFields() {
    this.remarks = "";
    this.mode = false;
    this.btnmode = true;
    this.item_Code = 0;
    this.quantity = 1;
    this.unit_Price = 1;

    $("#AddNewItemRow").show();
    this.EditItemButton = '';
    this.RemoveItemButton = '';

    this.guid = UUID.UUID();
    this.ProductDisassemlyDetails = [];
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.getItems();
    this.getPriviledgedOffices();
  }
  //updateItem 
  updateItem(i: ProductDisassemlyDetails, e: any) {
    this.item_Code = e;

    this.service.getUnitPrice(this.item_Code)
      .subscribe(response => {
        this.unitPrices = (response.json());
        console.log(this.unitPrices);
        this.item_Code = this.unitPrices[0].item_Code;
        this.item_Name = this.unitPrices[0].item_Name;
      });

    i.item_Code = this.item_Code;
    i.item_Name = this.item_Name;


  }
  //changeMode
  changeMode(idx: any, i: ProductDisassemlyDetails, Mode: any) {
    var flag = false;
    if (this.item_Code.length > 0) {
      for (var count = 0; count < this.item_Code.length; count++) {
        if (this.item_Code[count].item_Code == i.item_Code && idx != count) {
          flag = true;
          break;
        }
      }
    }

    if (Mode == 0) {
      if (flag == false) {
        if (i.quantity > 0) {
          i.edit_Mode = false;
        } else {
          swal("Quantity should be greater then 0");
          return;
        }
      } else {
        swal("Already Exists");
        return;
      }
    }
    else if (Mode == 2) {
      this.ProductDisassemlyDetails.splice(idx, 1);
      this.TotalQty();
    }
    else {
      for (let j = 0; j <= this.items.length; j++) {
        if (this.items[j].id == i.item_Code) {
          this.item_Code = this.items[j].id;
          break;
        }
      }

      console.log(i);
      i.edit_Mode = true;
    }

    if (Mode == 1) {
      $("#AddNewItemRow").hide();
      this.EditItemButton = 'disabled';
      this.RemoveItemButton = 'disabled';

    }
    else {
      $("#AddNewItemRow").show();
      this.EditItemButton = '';
      this.RemoveItemButton = '';

    }
  }
  //addGrid
  addGrid(item_Code: any, item_Name: any, item_Detail: any, quantity: any) {
    for (let i = 0; i < this.stocks.length; i++) {
      this.stock_Qty = this.stocks[i].stock_Qty;

      if (this.stock_Qty != null && this.stock_Qty >= quantity) {
        $("#submitAdd").prop("disabled", false);
        if (item_Name != null) {
          if (quantity > 0) {

            var flag = false;
            if (this.ProductDisassemlyDetails.length > 0) {
              for (var count = 0; count < this.ProductDisassemlyDetails.length; count++) {
                if (this.ProductDisassemlyDetails[count].item_Code == item_Code) {
                  flag = true;
                  break;
                }
              }
            }
            if (flag == false) {
              this.ProductDisassemlyDetails.push(new ProductDisassemlyDetails(0, 0, item_Code, item_Name, quantity, item_Detail, 0, 0, 0));

              this.TotalQty();
              this.item_Code = 0; this.item_Name = ''; this.quantity = 1; this.item_Detail = '';

              this.mode = false;
              return;
            }
            else {
              //if (this.stocks.length == 1)
              swal("Already Exists");
              return;
            }
          }
          else {
            swal("Qty is required. Qty not be zero and should be numeric");
            return;
          }
        } else {
          swal("Item is Required");
          return;
        }

      } else {
        $("#submitAdd").prop("disabled", true);
        swal("Stock is not available.");
        return;
      }
    }
    $("#txt").focus();
    //  this.scrollToBottom();
  }
  //saveDisassembly
  saveDisassembly() {
    //if (!this.guidExist(this.guid)) {
    //  if (Total_Amount > 0) {
    this.isLoading =true;
    var order = new ProductDisassemly(0, "", this.disassemly_Date.getDateFinal(), 1, this.order_Envoy, this.remarks, this.disassemly_Cost, this.disassemly_Cost, 0,this.logedInUserID, this.UserSessionID, this.ProductDisassemlyDetails);
    if (this.ProductDisassemlyDetails.length > 0) {
      $("#submitAdd").prop("disabled", true);
      this.service.saveDisassemly(order).then(
        (response) => {
          this.isLoading = false;
          this.getDisassemly(this.ID);
          this.modalReference.close();
          console.log(response);
        },
        (error) => console.log(error))
    }
    else
      swal("Please! Insert at least one record.");
      this.isLoading=false;
    //  }
    //  else {
    //    alert("- Order should be greater then 0.");
    //  }
    //}
    //else { alert("- Error: Already exists."); }
  }
  //updateDisassembly
  updateDisassembly() {
    //if (!this.guidExist(this.guid)) {
    //  if (Total_Amount > 0) {
    this.TotalQty();
    this.isLoading =true;
    var order = new ProductDisassemly(this.disassemly_ID, "", this.disassemly_Date.getDateFinal(), 1, this.order_Envoy, this.remarks, this.disassemly_Cost, this.disassemly_Cost, 0, this.logedInUserID, this.UserSessionID,this.ProductDisassemlyDetails);
    this.service.updateDisassemly(order).then(
      (response) => {
        this.isLoading = false;
        this.getDisassemly(this.ID);
        this.modalReference.close();
        console.log(response);
      },
      (error) => console.log(error))
    //  }
    //  else {
    //    alert("- Order should be greater then 0.");
    //  }
    //}
    //else { alert("- Error: Already exists."); }
  }
  //getDetailsByID
  getDetailsByID(disassemly_ID, content) {
    //this.open(content);
    this.isLoading =true;
    this.detailOpen(content);
    this.mode = true;
    this.btnmode = false;
    //this.edit();
    //this.IfExists(sale_Order_ID);

    this.service.getDetailsByID(disassemly_ID)
      .subscribe((o: ProductDisassemly) => {
        this.isLoading = false;
        this.disassemly_ID = o.disassemly_ID;
        this.disassemly_Date.setDate(o.disassemly_Date);
        this.order_Envoy = o.disassemly_By_ID;
        this.remarks = o.remarks;

        this.ProductDisassemlyDetails = o.productDisassemlyDetails;
        this.getPriviledgedOffices();
        this.getItems();

        //this.service.getItems()
        //  .subscribe(response => {
        //    this.isLoading = false;
        //    this.items = this.getDropdownList(response.json(), "item_Code", "item_Name");
        //    this.item_Code = this.items[0].id;
        //    this.item_Name = this.items[0].text;

        //    this.isLoading =true;
        //    this.service.getUnitPrice(this.item_Code)
        //      .subscribe(response => {
        //        this.isLoading = false;
        //        if (response.json() != null) {
        //          this.unitPrices = (response.json());
        //          this.unit_Price = this.unitPrices[0].unit_Price;
        //          this.item_Name = this.unitPrices[0].item_Name;

        //          this.isLoading =true;
        //          this.service.getStocks(this.item_Code)
        //            .subscribe(response => {
        //              this.isLoading = false;
        //              if (response.json() != null)
        //                this.stocks = (response.json());
        //              if (this.stocks != null) {
        //                this.stock_Qty = this.stocks[0].stock_Qty;
        //              }
        //            });
        //        }
        //      });

        //  });

      });

  }
  // open modal
  open(content) {
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

    $("#submitAdd").show();
    $("#submitUpdate").hide();
    $("#cancelBtn").hide();
    $("#submitAdd").prop("disabled", true);
    this.clearFields();
  }
  // detailOpen modal
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
    $("#cancelBtn").show();
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

}
