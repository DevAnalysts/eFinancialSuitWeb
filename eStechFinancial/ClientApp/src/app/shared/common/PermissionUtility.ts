export class PermissionUtility {

  PermissionUtility() {

  }
  public FUNCTIONALITYNAME: any = '';
  public FUNCTIONALITYDETAILNAME: any = '';

  public UserSessionID: any = 0;
  public PermissionAdd: any = 'none';
  public PermissionEdit: any = 'none';
  public PermissionView: any = 'none';
  public PermissionDelete: any = 'none';
  public PermissionSpecial: any = 'none';
  public PermissionDropdown: any = 'none';
  public PermissionItem1: any = 'none';
  public PermissionItem2: any = 'none';
  public PermissionItem3: any = 'none';
  public PermissionItem4: any = 'none';

  setPagePermissions(pageCode: any) {
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));
    var arr = FUNCTIONALITY.filter(p => p.page_Code == pageCode);
    if (arr.length > 0) {
      this.FUNCTIONALITYNAME = arr[0].page_Name;
      this.FUNCTIONALITYDETAILNAME = arr[0].pd;
      //RolePermissions
      if (arr[0].view == 1) { this.PermissionView = " " } else { this.PermissionView = "none" };
      if (arr[0].add == 1) { this.PermissionAdd = " " } else { this.PermissionAdd = "none" };
      if (arr[0].edit == 1) { this.PermissionEdit = " "; this.PermissionView = "none" } else { this.PermissionEdit = "none"; this.PermissionView = "" };
      if (arr[0].delete == 1) { this.PermissionDelete = " " } else { this.PermissionDelete = "none" };
      if (arr[0].special == 1) { this.PermissionSpecial = " " } else { this.PermissionSpecial = "none" };

      //AuditTrail
      this.UserSessionID = arr[0].userSessionID;


    }
  }
  setPermissionItem1(pageCode: any) {
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));

    var arr = FUNCTIONALITY.filter(p => p.page_Code == pageCode);

    if (arr.length > 0) {
      this.PermissionItem1 = " ";
      this.PermissionDropdown = "";
    }
  }
  setPermissionItem2(pageCode: any) {
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));

    var arr = FUNCTIONALITY.filter(p => p.page_Code == pageCode);

    if (arr.length > 0) {
      this.PermissionItem2 = " ";
      this.PermissionDropdown = "";
    }
  }
  setPermissionItem3(pageCode: any) {
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));

    var arr = FUNCTIONALITY.filter(p => p.page_Code == pageCode);

    if (arr.length > 0) {
      this.PermissionItem3 = " ";
      this.PermissionDropdown = "";
    }
  }
  setPermissionItem4(pageCode: any) {
    var FUNCTIONALITY = JSON.parse(localStorage.getItem("PageRegistry"));

    var arr = FUNCTIONALITY.filter(p => p.page_Code == pageCode);

    if (arr.length > 0) {
      this.PermissionItem4 = " ";
      this.PermissionDropdown = "";
    }
  }

}

