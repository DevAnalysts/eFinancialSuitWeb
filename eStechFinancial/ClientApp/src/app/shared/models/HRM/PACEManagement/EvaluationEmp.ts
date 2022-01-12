import { EvaluationEmpDetails } from './EvaluationEmpDetails';

export class EvaluationEmp {
  constructor(

    public evaluation_GROUP_EMP_ID: any,
    public quarteR_ID: any,
    public designatioN_ID: any,
    public evaluatioN_GROUP_ID: any,
    public officE_CODE: any,
    public emP_ID: any,
    public suP_A_ID: any,
    public suP_B_ID: any,
    public gH_ID: any,
    public finaL_SCORE: any,
    public createdby: any,
    public evaluationEmpDetails: EvaluationEmpDetails[]
  ) { }
}


