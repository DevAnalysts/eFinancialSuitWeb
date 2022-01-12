import { RolesPermissions } from './rolespermissions';
export class Roles {
  constructor(
    //public rolesid : any,
    public rolE_ID: any,
    public rolE_NAME: any,
    public designatioN_CODE: any,
    public active: any, 
    public permissions: RolesPermissions[]
  ) { }
}

