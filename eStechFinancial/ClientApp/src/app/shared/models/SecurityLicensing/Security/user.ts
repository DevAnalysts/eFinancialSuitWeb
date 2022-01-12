import { UserRoles } from "./userroles";

export class Users {
  constructor(
    public user_ID : any,
    public login: any,
    public password_Value: any,
    public emp_ID: any,
    public empname: any,
    public office: any,
    public active: any,
    //public role :UserRoles[]
  ) { }
}
