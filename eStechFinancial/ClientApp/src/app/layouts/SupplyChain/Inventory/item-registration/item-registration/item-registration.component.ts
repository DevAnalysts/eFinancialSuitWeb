import * as $ from 'jquery';
import { UUID } from 'angular2-uuid';
import { Select2OptionData } from 'ng-select2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ItemRegistrationService, Items, priceList, SupplierService, Suppliers, LoginService, SearchFilterService, ItemImageService, PermissionUtility } from '../../../../../shared';
import swal from 'sweetalert';
import { Router } from '@angular/router';
import { Validation } from '@shared/common/validation';

@Component({
  selector: 'item-registration',
  templateUrl: './item-registration.component.html',
  styleUrls: ['./item-registration.component.scss']
})
export class ItemRegistrationComponent implements OnInit {
  ////////////////////////////////////////
  
  logedInUserID: any = 1;
  UserSessionID: any = 0; 
  PermissionSpecial: any = 'none'; 
  PermissionDropdown: any = 'none';
  public permissionUtility:PermissionUtility=new PermissionUtility();
  public valid:Validation=new Validation()
  ////////////////////////////////////////
  p: number = 1;
  modalReference: NgbModalRef;
  modalReference2: NgbModalRef;
  items: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  UoMTypes: any[] = [];
  measurementTypies: any[] = [];
  packingTypies: any[] = [];
  isLoading: boolean;
  closeResult: string;
  alerts: Array<any> = [];
  guid: any;
  mode: any = false;
  btnmode: any = false;
  status: any = true;
  size: any = "";
  item_Code: any=0;
  item_Name: any = "";
  bar_Code: any = "";
  category_Code: any = 0;
  subCategory_Code: any = 0;
  unit_Price: any = 0;
  measurement_Unit_ID: any = 0;
  mTLable: any = "-";
  bUoMLable: any = "123";
  uoMID: any = 0;
  packing_Type_ID: any = 0;
  quantity: any = 0.1;
  reQuantity: any = 1;
  life: any = "";
  remarks: any = "";

  cost: any = 0;
  discount: any = 0;
  itemweight: any = 0.1;
  upp: any = 1;

  taxable: any = 0;
  taxtype: any[] = [];
  taxtypeid: any = 1;
  taxtypename: any = '';

  parentList: any[] = [];
  priceList: any[] = [];
  priceListID: any = 1;
  priceListName: any = '';
  salePrice: any = '';
  brandList: any[] = [];
  modelListByBrand: any[] = [];
  modelList: any[] = [];
  suppliers: Array<Select2OptionData>;
  suppliercode: any = 0;
  suppliername: any = '';

  statuscheckbox: any = true;
  disabletaxtype: any = '';
  ID: any = "";
  guidOrder: boolean;


  imageUrl: string = "../../../../assets/images/image.png";
  checkImage: string = "../../../../assets/images/image.png";
  fileToUpload: File = null;
  userOffice: any;
  userCurrentOffice: any;
  userPrivilegedOffice: any;
  userCurrentWarehouse: any;
  parentitem: any[] = [];
  parent_Item_Code: any = 0;
  abbrivation: any = "";
  color: any = "";
  warranty: any = 0;
  modelId: any = 1;
  brandId: any = 1;
  allowPallletQty: any = false;
  g: any = 1;
  AllowItemRegistrationCode:boolean=false;

  DisableCategory: any =false;
  DisableSubCategory: any =false;
  DisableUOM: any =false;
  DisableMeasuringType: any =false;
  DisablePacking: any =false;

  openingStock: any = 0;
  openingUnitCost: any = 0;
  openingField: any = false;
  enableModel: any = false;
  enableBrand: any = false;

  constructor(
    public router: Router,
    private service: ItemRegistrationService,
    private LoginService: LoginService,
    private SupplierService: SupplierService,
    private searchfilter: SearchFilterService,
    private ImageService: ItemImageService,
    private modalService: NgbModal) {
    this.priceList = new Array<priceList>();

    this.userOffice = this.LoginService.getSession('userOffice');
    this.userCurrentOffice = this.LoginService.getSession('userCurrentOffice');
    this.userPrivilegedOffice = this.LoginService.getSession('userPrivilegedOffice');
    this.userCurrentWarehouse = this.LoginService.getSession('userCurrentWarehouse');



    this.alerts.push(
      {
        id: 4,
        type: 'danger',
        message: 'Record is not updatable since it is being used...',
      });
  }

  ngOnInit() {
    this.getItems(this.ID);
    this.getTaxTypes();
    this.permissionUtility.setPagePermissions(110605);
    this.permissionUtility.setPermissionItem1(809116);
    this.permissionUtility.setPermissionItem2(110088);
    this.permissionUtility.setPermissionItem3(809117);
    this.permissionUtility.setPermissionItem4(140063);
    this.logedInUserID = this.LoginService.getSession('user_ID');
    this.isEnable("EnableModel");
    this.isEnable("EnableBrand");
    this.isEnable("AllowPallletQty");
    if(this.LoginService.getSession('AllowItemRegistrationCode') == '1'){
      this.AllowItemRegistrationCode=true;
    this.item_Code=this.item_Code;
    }
    else
    {
      this.AllowItemRegistrationCode=false;
      this.item_Code=0;
    }
     
 }
 isEnable(value: any)
 {
   this.service.isEnable(value).subscribe(response => {
     
    let e = (response.json());
    if(e !=null)
    {
      if( e.length>0 )
      {
        if(value == 'EnableBrand')
        {
          this.enableBrand = e[0].enable;
        }
        else if (value == 'EnableModel')
        this.enableModel = e[0].enable;

        else
        {
          if(e[0].value > 0)
          {
            this.allowPallletQty  = true;
          }
        }

      }
    }
   
  })
}
  //getItems
  getItems(value: string) {
    this.isLoading = true;
    //alert(this.userCurrentOffice + "," + this.userCurrentWarehouse);
    this.service.getItems(value, this.userCurrentOffice, this.userCurrentWarehouse)
      .subscribe(response => {
        if(response.json() !== null){
          this.items = (response.json());
          this.isLoading = false;
          localStorage.setItem('cat',JSON.stringify(this.items))
          //  console.log(response.json());
        }
        else{
          this.items = [];
          this.isLoading = false;
        }
        
      });
  }
  //getFills
  getFills() {
    this.getCategories();
    this.changeCategories(this.category_Code);
    this.getUoM();
    this.getBrands();
    
    this.enableSupplierDropDown();
    this.getParentItem();
  }
  //getParentItem
  getParentItem() {
    this.service.getParentItem()
      .subscribe(response => {
        let ar: Array<any> = [];
        ar.push({
          parentitemcode: 0,
          parentitemname: 'NA'
        });

        if (this.parent_Item_Code != 0)
          $("#allowParentList").show();
        else
          $("#allowParentList").hide();

        if (response.json() != null) {
          var arr = response.json();
          // console.log(response.json())

          if (arr != null) {
            arr.forEach(
              function (obj) {
                ar.push({
                  parentitemcode: obj['parentitemcode'],
                  parentitemname: obj['parentitemname'],
                });
              });
          }

        }
        this.parentitem = ar;
        //  console.log(ar)
        //this.parentitemcode = this.parentitem[0].parentitemcode;
      });

  }
  //getParentList
  getParentList() {
    if (this.parent_Item_Code != 0) {
      this.parentList = [];
      $("#allowParentList").show();
      this.service.getParentList(this.parent_Item_Code, this.mode)
        .subscribe(response => {
          this.parentList = (response.json());
        });
    }
    else
      $("#allowParentList").hide();
  }
  //changeParents
  changeParents(parentitemcode) {
    if (this.parent_Item_Code != 0) {
      this.parentList = [];
      $("#allowParentList").show();
      this.service.getParentList(parentitemcode, this.mode)
        .subscribe(response => {
          this.parentList = (response.json());
        });
    }
    else
      $("#allowParentList").hide();
  }
  //getCategories
  getCategories() {
    this.isLoading = true;
    this.service.getCategories()
      .subscribe(response => {
        this.subCategories=[];
        let allcategories = (response.json());
        if(allcategories!==null){
        this.categories =allcategories.filter(f=>f.active==true);
        this.category_Code = this.categories[0].category_Code;
        this.changeCategories(this.category_Code);
        this.isLoading = false;
        //console.log(response.json());
      }
      });
  }
  //getSubCategories
  changeCategories(category_Code) {
    this.service.getSubCategories(category_Code)
      .subscribe(response => { 
        let allsubcategories = (response.json());
        if(allsubcategories!==null){
          
        let cat=this.categories.filter(c=>c.category_Code==category_Code);
        if(cat!==null)        
        {
          if(cat[0].active==true)
          {
            this.DisableSubCategory=false;
       
            this.subCategories =allsubcategories.filter(f=>f.active==true);
         
            if (this.subCategories.length>0)
            this.subCategory_Code = this.subCategories[0].subCategory_Code;
          
          }else{
           this.DisableSubCategory=true;
         
          this.subCategories =allsubcategories.filter(f=>f.active==false);
        }
        } 
      
      }
      });
  }
  changeUoM(value) {
    ////////////////////////
    this.getMeasurementType(value);
    this.getpackingTypies(value);

  }
  getBrands() {

    this.service.getBrands()
      .subscribe(response => {
        this.brandList = this.getDropdownList(response.json(), "brandId", "brandName");
       if(this.mode==0)
       {
          this.brandId = this.brandList[0].id;

        this.service.getModals(this.brandId)
          .subscribe(response => {
            this.modelListByBrand = this.getDropdownList(response.json(), "modelId", "modelName");
            this.modelId = this.modelListByBrand[0].id;
          });
        }

      });

  }

  changeBrand(e: any) {
    
    if(e!=this.brandId)
    {
      this.brandId=e;
    
      this.setModel(this.modelId);
    } 
  }
  changeModel(e: any) {
    
    if(e!=this.modelId)
    {
      this.modelId=e;
    }
  }

  ///on load or Update
  setModel(value:any) {

    this.service.getModals(this.brandId)
    .subscribe(response => {
      this.modelListByBrand = this.getDropdownList(response.json(), "modelId", "modelName");

      let idx = this.modelListByBrand.findIndex(i => i.modelId ==value);
    if (idx >-1) {
        this.modelId = this.modelListByBrand[idx].id;
      }
      else {
        this.modelId = this.modelListByBrand[0].id;
      }
    });

    // alert('SetValue '+value);
    // let idx = this.modelListByBrand.findIndex(i => i.modelId == value);

    // if (idx >= 0) {
    //   this.modelId = this.modelListByBrand[idx].id;
    // }
    // else {
    //   this.modelId = this.modelListByBrand[0].id;
    // }

  }

  changePakingType(value) {
    var count = this.packingTypies.findIndex((u => u.packing_Type_ID == value));
    this.mTLable = this.packingTypies[count].packing_Type_Name;
  }

  changeBaseMType(value) {
    var count = this.measurementTypies.findIndex((u => u.measurement_Unit_ID == value));
    this.bUoMLable = this.measurementTypies[count].measurement_Unit;

  }

  //getUoM
  getUoM() {
    this.service.getUoM()
      .subscribe(response => {
      
        this.measurementTypies=[];
        this.packingTypies=[];
        let allUoMTypes = (response.json());
        if(allUoMTypes!==null){
        this.UoMTypes =allUoMTypes.filter(f=>f.active==true);
        this.uoMID = this.UoMTypes[0].uoMID;
        this.getMeasurementType(this.uoMID);
        this.getpackingTypies(this.uoMID);
        this.isLoading = false;
        //console.log(response.json());
      }
      

       
        ////////
       

        
      });
  }

  //getMeasurementType
  getMeasurementType(value) {
    this.service.getMeasurementType(value)
      .subscribe(response => {
     
        let allmeasurementTypies = (response.json());

        let uom=this.UoMTypes.filter(c=>c.uoMID==value);
        if(uom!==null)        
        {
          if(uom[0].active==true)
          {
            this.DisableUOM=false;
       
            this.measurementTypies =allmeasurementTypies.filter(f=>f.active==true);
         
            if (this.measurementTypies !== null){
            this.measurement_Unit_ID = this.measurementTypies[0].measurement_Unit_ID;
            this.bUoMLable = this.measurementTypies[0].measurement_Unit;
          }
          }else{
           this.DisableUOM=true;
         
          this.measurementTypies =allmeasurementTypies.filter(f=>f.active==false);
          if (this.measurementTypies !== null){
            this.measurement_Unit_ID = this.measurementTypies[0].measurement_Unit_ID;
            this.bUoMLable = this.measurementTypies[0].measurement_Unit;
          }
        }
        } 

        //  alert( this.bUoMLable);
      });
  }
  //getpackingTypies
  getpackingTypies(value) {
    this.service.getpackingTypies(value)
      .subscribe(response => {
     
        let allpackingTypies = (response.json());

        this.DisableUOM=false;
       
        let pak=this.UoMTypes.filter(c=>c.uoMID==value);
        if(pak!==null)        
        {
          if(pak[0].active==true)
          {

            this.DisableUOM=false;
       
            this.packingTypies =allpackingTypies.filter(f=>f.active==true);
         
            if (this.packingTypies !== null){
              this.packing_Type_ID = this.packingTypies[0].packing_Type_ID;
              this.mTLable = this.packingTypies[0].packing_Type_Name;
              }
          
          }else{
           this.DisableUOM=true;         
          this.packingTypies =allpackingTypies.filter(f=>f.active==false);
          if (this.packingTypies !== null){
            this.packing_Type_ID = this.packingTypies[0].packing_Type_ID;
            this.mTLable = this.packingTypies[0].packing_Type_Name;
            }
         }

        } 






        this.packingTypies =allpackingTypies.filter(f=>f.active==true);
        if(this.packingTypies!=null){
        if( this.packingTypies.length>0 ){
        this.packing_Type_ID = this.packingTypies[0].packing_Type_ID;

        var count = this.packingTypies.findIndex((u => u.packing_Type_ID == this.packing_Type_ID));
        this.mTLable = this.packingTypies[count].packing_Type_Name;
        }
        }
        //alert( this.mTLable);


      });
  }
  //getTaxTypes
  getTaxTypes() {
    this.service.getTaxTypes()
      .subscribe(response => {
      
        this.taxtype = (response.json());
        if(this.taxtype!=null){
        if( this.taxtype.length>0 ){
        this.taxtypeid = this.taxtype[0].taxtypeid;
        this.taxtypename = this.taxtype[0].taxtypename;
        }
        }
      });
  }
  //getPriceList
  getPriceList() {
    this.service.getPriceList(this.item_Code, this.mode)
      .subscribe(response => {
        this.priceList = (response.json());
        if (this.priceList != null) {
          this.priceListID = this.priceList[0].priceListID;
          this.priceListName = this.priceList[0].priceListName;
          if (this.mode == false) {
            for (let i = 0; i < this.priceList.length; i++) {
              this.priceList[i].sale_Price = this.unit_Price;
            }
          }
          else
            this.salePrice = this.priceList[0].sale_Price;
        }
      });
  }
  //changeUnitPrice
  changeUnitPrice(unit_Price) {
    this.getPriceList();
  }
  //getSupplier
  getSupplier() {
    this.isLoading = true;
    this.service.getSupplier()
      .subscribe(response => {
        if (response.json() != null) {
          this.suppliers = this.getDropdownList(response.json(), "suppliercode", "suppliername");
          this.suppliercode = this.suppliers[0].id;
          this.suppliername = this.suppliers[0].text;
          this.isLoading = false;
        }
      });
  }
  //getSupplierChange
  getSupplierChange(e: any) {
    if (this.sessionEnableTextboxSupplier != 1) {
      this.suppliercode = e;
    }
  }
  //getDropdownList
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
  //clearFields
  clearFields() {
    this.mode = false;
    this.btnmode = false;
    this.guid = UUID.UUID();
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.parent_Item_Code = 0;
    this.item_Code = 0;
    this.item_Name = '';
    this.bar_Code = '';
    this.unit_Price = 0;
    this.quantity = 1;
    this.reQuantity = 1;
    this.remarks = '';
    this.cost = 0;
    this.discount = 0;
    this.itemweight = 0.1;
    this.upp = 1;
    this.taxable = 0;
    this.color = "";
    this.abbrivation = "";
    this.warranty = 0;
    this.DisableCategory=false;
    this.DisableSubCategory =false;
    this.DisableUOM=false;
    this.DisableMeasuringType=false;
    this.DisablePacking=false;
    this.statuscheckbox = true;
    this.openingStock = 0;
    this.openingUnitCost = 0;
    this.size ="";
   
    this.imageUrl = "../../../../assets/images/image.png";
    this.getTaxTypes();
    this.taxFields();
    this.getFills();
    this.multiPriceList();
    //this.mandatoryFields();
  }
  //IfExists
  IfExists(item_Code) {
    this.service.IfExists(item_Code)
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
  //saveItem
  saveItem(item_Code: any, bar_Code: any, item_Name: any, category_Code: any, subCategory_Code: any, unit_Price: any, measurement_Unit_ID: any,
    packing_Type_ID: any, quantity: any, reQuantity: any, life: any, remarks: any, guid: any, cost, discount, taxable, taxtypeid, statuscheckbox, openingUnitCost, openingStock, size) {
      if(cost==null){  cost=0;}
      if(unit_Price==null){  unit_Price=0;}
      if(discount==null){  discount=0;}
    if (this.suppliercode > 0) {
      var item_Name=this.item_Name.trim();
      if (item_Name != '') {
        var item = new Items(this.item_Code, bar_Code, 1, item_Name, item_Name, cost, unit_Price, 0, taxable, this.color, size, life, "", "", remarks, category_Code,
          subCategory_Code, measurement_Unit_ID, packing_Type_ID, quantity, reQuantity, "", "", "", "", "", "", this.suppliercode, guid, 1, 0, this.parent_Item_Code,
          1, 0, null, 1, null, 1, discount, "", this.itemweight, this.upp, taxtypeid, statuscheckbox, this.UserSessionID, '', this.abbrivation, this.warranty, this.uoMID, this.brandId, this.modelId, this.priceList, openingUnitCost, openingStock);

        console.log(item);

        this.service.guidExist(this.guid)
          .subscribe(response => {
            this.guidOrder = (response.json());

            if (this.guidOrder == false) {

              if (this.fileToUpload != null) {

                this.ImageService.postFile('', this.fileToUpload).subscribe(
                  data => { 
                    this.service.saveItem(item).then(
                      (response) => {

                        this.modalReference.close();
                        this.getItems(this.ID);
                        console.log(response);
                      },
                      (error) => console.log(error))

                  }
                );

              }
              else {  
                this.service.saveItem(item).then(
                  (response) => {

                    this.modalReference.close();
                    this.getItems(this.ID);
                    console.log(response);
                  },
                  (error) => console.log(error))
              }


            }
            else { swal("Error: Already exists."); }
          });
      }
      else {
        if(this.item_Name.replace(/\s/g,"").length<=0)
        this.item_Name='';
        swal('Select Item Name!');
      }
    }  
    else {
      swal('Select Supplier!');
    }

  }
  //updateItem
  updateItem(item_Code: any, bar_Code: any, item_Name: any, category_Code: any, subCategory_Code: any, unit_Price: any, measurement_Unit_ID: any,
    packing_Type_ID: any, quantity: any, reQuantity: any, life: any, remarks: any, guid: any, cost, discount, taxable, taxtypeid, statuscheckbox, size) {
    
            if(cost==null){  cost=0;}
            if(unit_Price==null){  unit_Price=0;}
            if(discount==null){  discount=0;}

      if (this.suppliercode > 0) {
      var item_Name=this.item_Name.trim();
      if (item_Name != '') {

        if (this.fileToUpload != null) {
          var goodsReceive = new Items(this.item_Code, bar_Code, 1, item_Name, item_Name, cost, unit_Price, 0, taxable, this.color, size, life, "", "", remarks, category_Code,
            subCategory_Code, measurement_Unit_ID, packing_Type_ID, quantity, reQuantity, "", "", "", "", "", "", this.suppliercode, guid, 1, 0, this.parent_Item_Code, 1,
            0, null, 1, null, 1, discount, "", this.itemweight, this.upp, taxtypeid, statuscheckbox, this.UserSessionID, '', this.abbrivation, this.warranty, this.uoMID, this.brandId, this.modelId, this.priceList, 0,0);
            
          console.log(goodsReceive);
          this.ImageService.postFile('', this.fileToUpload).subscribe(
            data => {
              this.service.updateItem(goodsReceive).then(
                (response) => {
                  this.getItems(this.ID);
                  this.modalReference.close();
                  console.log(response);
                },
                (error) => console.log(error))

            }
          );
        }
        else {

          var goodsReceive = new Items(item_Code, bar_Code, 1, item_Name, item_Name, cost, unit_Price, 0, taxable, this.color, size, life, "", "", remarks, category_Code,
            subCategory_Code, measurement_Unit_ID, packing_Type_ID, quantity, reQuantity, "", "", "", "", "", "", this.suppliercode, guid, 1, 0, this.parent_Item_Code, 1,
            0, null, 1, null, 1, discount, "", this.itemweight, this.upp, taxtypeid, statuscheckbox, this.UserSessionID, this.imageUrl, this.abbrivation, this.warranty, this.uoMID, this.brandId, this.modelId, this.priceList,0,0);

          this.service.updateItem(goodsReceive).then(
            (response) => {
              this.getItems(this.ID);
              this.modalReference.close();
              console.log(response);
            },
            (error) => console.log(error))
        }
      }
      else {
        swal('Select Item Name!');
      }
    }
    else {
      if(this.item_Name.replace(/\s/g,"").length<=0)
        this.item_Name='';
      swal('Select Supplier!');
    }
  }
  //getDetailsByID
  getDetailsByID(item_Code, content) {

    this.mode = true;
    this.btnmode = false;
    this.textboxSupplierID = 0
    this.textboxSupplierName = '';
    this.imageUrl = "../../../../assets/images/image.png";
    this.getFills();
    this.enableSupplierDropDown();
    this.service.getDetailsByID(item_Code)
      .subscribe((o: Items) => {
      console.log(o);
        this.item_Code = o.item_Code;
        this.item_Name = o.item_Name;
        this.bar_Code = o.barcode;
        this.parent_Item_Code = o.parent_Item_Code;
        this.color = o.color;
        this.size = o.size
        this.abbrivation = o.abbrivation;
        this.warranty = o.warranty;
      /////////////////
      if(o.brandId!=null)
      this.brandId = o.brandId;
      if(o.modelId!=null){
      this.modelId=o.modelId; 
       this.setModel(this.modelId);
      }
        ////////////

        this.service.getCategories()
          .subscribe(response => {
            let allcategories = (response.json());
            this.DisableCategory=false;
            let disabledCategory=allcategories.filter(f=>f.category_Code==o.category_Code && f.active==false);
            if(disabledCategory!==null)
            {
              if(disabledCategory.length>0){
                this.DisableCategory=true;
                this.categories=allcategories.filter(f=>f.active==false);
              }
             
            }else{
              this.categories=allcategories.filter(f=>f.active==true);
            }
            this.category_Code = o.category_Code;
            
            this.service.getSubCategories(o.category_Code)
              .subscribe(response => {
                let allsubCategories = (response.json());
                this.subCategories=[];
                this.DisableSubCategory=false;
            if(allsubCategories!==null)
            {
              let disabledSubCategory=allsubCategories.filter(f=>f.subCategory_Code==o.subCategory_Code && f.active==false);
           
             
              if(disabledSubCategory.length>0){
                this.DisableSubCategory=true;
                this.subCategories=allsubCategories.filter(f=>f.active==false);
              }else{
              this.subCategories=allsubCategories.filter(f=>f.active==true);
            }

                this.subCategory_Code = o.subCategory_Code;

              
            }
               
              });
          });
          this.SearchSupplierByID(o.supplier_ID);


  if(o.uoMID!=null){
        this.service.getUoM()
          .subscribe(response => {
          

            this.packingTypies=[];
            this.measurementTypies=[];

            let allUoMTypes = (response.json());
            this.DisableUOM=false;
            let disabledUOM=allUoMTypes.filter(f=>f.uoMID==o.uoMID && f.active==false);
            if(disabledUOM!==null)
            {
              if(disabledUOM.length>0){
                this.DisableUOM=true;
                this.UoMTypes=allUoMTypes.filter(f=>f.active==false);
              }
             
            }else{
              this.UoMTypes=allUoMTypes.filter(f=>f.active==true);
            }
            this.uoMID = o.uoMID;
            

            this.service.getMeasurementType(this.uoMID)
              .subscribe(response => {
                let allmeasurementTypies = (response.json());
                this.measurementTypies = []; 
            this.DisableMeasuringType=false; 
            if(allmeasurementTypies!==null)
            {
              let disabledmeasurementTypies=allmeasurementTypies.filter(f=>f.measurement_Unit_ID==o.measurement_Unit_ID && f.active==false);
              if(disabledmeasurementTypies.length>0){
                this.DisableMeasuringType=true;
                this.measurementTypies=allmeasurementTypies.filter(f=>f.active==false);
              }else{
                this.measurementTypies=allmeasurementTypies.filter(f=>f.active==true);
              } 
                  this.measurement_Unit_ID = o.measurement_Unit_ID; 
                  var count = allmeasurementTypies.findIndex((u => u.measurement_Unit_ID == o.measurement_Unit_ID));
                  this.bUoMLable = this.measurementTypies[count].measurement_Unit; 
                
              
            }});

            this.service.getpackingTypies(this.uoMID)
              .subscribe(response => {
                let allpackingTypies = (response.json());
                this.packingTypies = []; 
                this.DisablePacking=false; 
                if(allpackingTypies!==null)
                {
                  let disabledpackingTypies=allpackingTypies.filter(f=>f.packing_Type_ID==o.packing_Type_ID && f.active==false);
                  if(disabledpackingTypies.length>0){
                    this.DisablePacking=true;
                    this.packingTypies=allpackingTypies.filter(f=>f.active==false);
                  }else{
                    this.packingTypies=allpackingTypies.filter(f=>f.active==true);
                  }
                  this.packing_Type_ID = o.packing_Type_ID; 
                  var count = allpackingTypies.findIndex((u => u.packing_Type_ID == o.packing_Type_ID));
                  this.mTLable = this.packingTypies[count].packing_Type_Name;
                
                  
                }});

          });
        }
        if(o.parent_Item_Code!=null){
        if (this.parent_Item_Code != 0 || this.parent_Item_Code != null) {
          this.service.getParentItem()
            .subscribe(response => {
              let ar: Array<any> = [];
              ar.push({
                parentitemcode: 0,
                parentitemname: 'NA'
              });
              if (response.json() != null) {
                var arr = response.json();

                if (arr != null) {

                  arr.forEach(
                    function (obj) {
                      ar.push({
                        parentitemcode: obj['parentitemcode'],
                        parentitemname: obj['parentitemname'],
                      });
                    });

                }
              }
              this.parentitem = ar;
              this.parent_Item_Code = o.parent_Item_Code;
              this.parentList = [];
              this.service.getParentList(o.parent_Item_Code, this.mode)
                .subscribe(response => {
                  if (response.json() != null) {
                    $("#allowParentList").show();
                    this.parentList = (response.json());
                  }
                  else
                    $("#allowParentList").hide();
                });

            });
        }
        else {
          $("#allowParentList").hide();
        }
      }else {
          $("#allowParentList").hide();
        }



        this.unit_Price = o.unit_Price;
        this.quantity = o.packing_Quantity;
        this.reQuantity = o.reorder_Quantity;
        this.life = o.useful_Life;
        this.remarks = o.remarks;

        this.cost = o.cost;
        this.discount = o.costDiscount;
        this.itemweight = o.itemweight;
        this.upp = o.upp;
        this.taxable = o.taxable;
        if (o.taxable != 0) {
          this.service.getTaxTypes()
            .subscribe(response => {
              this.taxtype = (response.json());
              this.taxtypeid = o.taxtypeid;
            });
        }
        this.service.getImageByID(item_Code)
          .subscribe(response => {
            if (response.json != null) {
              var list = (response.json());
              this.imageUrl = list[0].image;
            }
          });


        this.statuscheckbox = o.status;
        this.disableTaxType(this.taxable);
        this.getPriceList();
      });
    this.openDetail(content);
  }
  //diasbletaxtypedropdown
  disableTaxType(taxable) {

    if (taxable != 0)
      this.taxtypeid = 1;
    else
      this.taxtypeid = 1;
  }
  //taxFields
  taxFields() {
    if (this.LoginService.getSession('isTaxable') != 'true') {
      $("#lblTaxable").hide();
      $("#lblIsTaxable").hide();
    }
    else {
      $("#lblTaxable").show();
      $("#lblIsTaxable").show();
    }
  }
  //multiPriceList
  multiPriceList() {
    if (this.LoginService.getSession('settingAllowPriceList') != '1')
      $("#allowPriceList").hide();
    else {
      $("#allowPriceList").show();
      this.getPriceList();
    }
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
    this.clearFields();
    this.openingField = false;
  }
  //openDetail modal
  openDetail(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
      
    };
    this.clearFields();
    // console.log(ngbModalOptions);
    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    //    this.modalReference = this.modalService.open(content, { size: 'xlg' });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    $("#alertWarning").hide();
    $("#submitAdd").prop("disabled", false);
    this.multiPriceList();
    this.openingField = true;
    this.btnmode = true;
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

  sessionEnableTextboxSupplier = 0;
  textboxSupplierID: any = 0;
  textboxSupplierName: any = '';
  textboxSupplierSearch: any = '';
  searchGridSupplier: any[] = [];
  searchGridSupplierTemp: any[] = [];

  enableSupplierDropDown() {
  //  alert(this.LoginService.getSession('EnableSupplierSearchDropDown'));
    if (this.LoginService.getSession('EnableSupplierSearchDropDown') != '1') {
      $("#DropDownSupplierSearch").hide();
      this.sessionEnableTextboxSupplier = 0;
      this.getSupplier();
    }
    else {
      $("#DropDownSupplierSelect2").hide();
      this.sessionEnableTextboxSupplier = 1;
      this.SearchSupplierDropDown('');
    }
  }
  SearchSupplierByID(Query) {
    this.textboxSupplierSearch = Query;
    this.isLoading = true
    this.searchfilter.SearchSupplierByID(Query)
      .subscribe(response => {
        if (response.json() != null) {
          var List = (response.json());
          this.setSelectedSupplier(List[0].id, List[0].name)
        }
        else {
          //alert('Here');
          this.suppliercode = 0;
          this.textboxSupplierID = 0;
          this.textboxSupplierName = '';
          //this.contacts = [];
          //this.contact_ID = 0;

        }
        this.isLoading = false;
      });

  }
  SearchSupplierDropDown(Query) {

    this.searchGridSupplier = [];
    console.log('Query', Query);
    this.isLoading = true;
    this.searchfilter.SearchSupplierDropDown(Query)
      .subscribe(response => {
        if (this.searchGridSupplier != null) {
          this.searchGridSupplier = (response.json());

          if (this.searchGridSupplierTemp.length <= 0) {
            this.searchGridSupplierTemp = this.searchGridSupplier;
          }
        }
        this.isLoading = false;
      });

  }
  setSupplierSearchFocus() {
    var timer = setTimeout(() => $("#textboxSupplierSearch").focus(), 500);

  }
  setSelectedSupplier(ID, Name) {
    console.log(ID, Name);
    this.textboxSupplierID = ID;
    this.suppliercode = ID;
    this.textboxSupplierName = Name;

    this.textboxSupplierSearch = '';
    this.searchGridSupplier = this.searchGridSupplierTemp;



  }

  addSupplierName: any = '';
  addSupplierCell: any = '';
  addSupplierEmail: any = '';
  addSupplierPhone: any = '';
  addSupplierAddress: any = '';
  addSupplierStatus: any = 1;

  city: any[] = [];
  citycode: any = 0;
  cityname: any = '';


  //getCity
  getCity() {
    this.isLoading = true;
    this.SupplierService.getCity()
      .subscribe(response => {
        this.city = this.getDropdownList(response.json(), "citycode", "cityname");
        this.citycode = this.city[0].id;
        this.cityname = this.city[0].text;
        this.isLoading = false;
      });
  }
  //getCustomerChange
  getCityChange(e: any) {
    this.citycode = e;
  }
  //SupplierAddNew
  SupplierAddNew(content) {
    this.addSupplierName = '';
    this.addSupplierCell = '';
    this.addSupplierPhone = '';
    this.addSupplierAddress = '';
    this.addSupplierEmail = '';
    this.addSupplierStatus = 1;

    this.checkEmail = true;
    this.checkPhone = true;
    this.checkContactCell = true;
    this.checkContactPhone = true;

    this.city = [];
    this.citycode = 0;
    this.cityname = '';

    this.getCity();
    //this.getCategory();
    this.openSupplierAddNew(content);

  }
  //openSupplierAddNew
  openSupplierAddNew(content) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false, size: 'sm', windowClass: 'my-modal'
    };

    this.modalReference2 = this.modalService.open(content, { size: 'sm' });
    this.modalReference2.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    $("#SaveNewSupplier").prop("disabled", true);
    var timer = setTimeout(() => $("#addSupplierName").focus(), 500);

  }
  //saveSupplier
  saveSupplier() {

    if (this.addSupplierName != "") {

      if (this.LoginService.getSession('MandatoryCellNo') == '1' && this.addSupplierCell == '') {
        swal("Cell number must be defined.")
      }
      else {

        var supplier = new Suppliers(0, this.addSupplierName, null , 0, this.addSupplierName, this.addSupplierPhone, this.addSupplierCell, this.addSupplierCell, this.addSupplierPhone, '', '', this.addSupplierEmail, '', 0, 1, 1, 1, 1, 1, 0, 1, '', 0, 0, this.guid, 0, this.addSupplierAddress, '', '', this.citycode, 1, 1, this.addSupplierStatus, this.logedInUserID, this.UserSessionID);
        console.log(supplier);
        this.isLoading = true
        this.SupplierService.saveSupplier(supplier).then(
          (response) => {
            var list = response;
            this.service.getSupplier()
              .subscribe(response => {
                this.suppliers = this.getDropdownList(response.json(), "suppliercode", "suppliername");
                this.setSelectedSupplier(list[0].supplier_ID, list[0].supplier_ID + ' : ' + list[0].supplier_Name);
                this.isLoading = false;
              });

            this.modalReference2.close();
            console.log(response);
          },
          (error) => console.log(error))

      }

    }
    else {
      swal("Supplier name must be define.");
    }

  }
  checkEmail: any = true;
  checkPhone: any = true;
  checkContactCell: any = true;
  checkContactPhone: any = true;
  checkDisableStatus() {

    if (this.addSupplierName != ''
      && this.checkEmail != false
      && this.checkContactCell != false
      && this.checkContactPhone != false) {
      $("#SaveNewSupplier").prop("disabled", false);
    }
    else {
      $("#SaveNewSupplier").prop("disabled", true);
    }

  }
  checkSupplierCell(cell) {
    if (cell != '') {
      this.isLoading = true;
      this.SupplierService.contactCellExists(cell)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactCell = false;
            this.checkDisableStatus();
            swal('Cell Already Exist');
          }
          else {
            this.checkContactCell = true;
            this.checkDisableStatus();
          }


        });
    }
    else {

      if (this.LoginService.getSession('MandatoryCellNo') != '1') {
        this.checkContactCell = true;
        this.checkDisableStatus();
      }
      else {
        this.checkContactCell = false;
        this.checkDisableStatus();
        swal('Enter Cell No');
      }
    }
  }
  checkSupplierPhone(phone) {
    if (phone != '') {
      this.isLoading = true;
      this.SupplierService.contactCellExists(phone)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkContactPhone = false;
            this.checkDisableStatus();
            swal('Phone Already Exist');

          }
          else {
            this.checkContactPhone = true;
            this.checkDisableStatus();
          }

        });
    }
    else {
      this.checkContactPhone = true;
      this.checkDisableStatus();
    }
  }
  checkSupplierEmail(email) {
    if (email != '') {
      this.isLoading = true;
      this.SupplierService.emailExists(email)
        .subscribe(response => {
          var check = (response.json());
          this.isLoading = false;
          if (check) {
            this.checkEmail = false;
            this.checkDisableStatus();
            swal('Email Already Exist');
          }
          else {
            this.checkEmail = true;
            this.checkDisableStatus();
          }
        });
    }
    else {
      this.checkEmail = true;
      this.checkDisableStatus();
    }
  }


  //changeQuantity
  changePackingQty(value) {
    if (value <= 0) {
      this.quantity = 0.1;
    }
  }
  //changeQuantity
  changeReOrderQty(value) {
    if (value <= 0) {
      this.reQuantity = 1;
    }
  }
  //changeQuantity
  changeUPP(value) {
    if (value <= 0) {
      this.upp = 1;
    }
  }
  //changeQuantity
  changeWeight(value) {
    if (value <= 0) {
      this.itemweight = 0.1;
    }
  }
  //
  //routePage
  routePage(value) {
    if (value == 1)
      this.router.navigate(['/item-adjustment']);
    else if (value == 2)
      this.router.navigate(['/item-price']);
    else if (value == 3)
      this.router.navigate(['/item-sort']);
    else if (value == 4)
    this.router.navigate(['/stock-opening-balance']);
  }
/*
  mandatoryBorder: any = 'border-right:5px solid red;';
  validBorder: any = 'border-right:5px solid green;';

   mandatoryFields() {

    $("#item_Name").prop("style", this.validBorder);
    if (this.item_Name == "") { $("#item_Name").prop("style", this.mandatoryBorder); }


  } */


  //ImagePreview
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);

  }
}
