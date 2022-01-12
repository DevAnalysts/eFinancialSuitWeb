import { chequeBookLeafes } from './chequeBookLeafes';
export class chequeBook {
  constructor(
    public chequeBookID: any,
    public chequeBookName: any,
    public chequeFrom: any,
    public lastLeaf: any,
    public accountNo: any,
    public bankId: any,
    public branchId: any,
    public noOfCheques: any,
    public active: any,
    public status: any,
    public created_By: any,
    public userSessionID: any,
    public chequeBookLeafes: chequeBookLeafes[]
  ) { }
}
