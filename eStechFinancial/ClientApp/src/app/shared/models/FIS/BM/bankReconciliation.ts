import { bankReconciliationDetails } from './bankReconciliationDetails';
export class bankReconciliation {
    constructor(

        public reconciliationID: any,
        public officE_CODE: any,
        public reconciliationDate: any,
        public accounT_CODE: any,
        public ledgerBalance: any,
        public bankBalance: any,
        public deposit: any,
        public outstanding: any,
        public net: any,
        public status: any,
        public created_By: any,
        public userSessionID: any,
        public bankReconciliationDetails: bankReconciliationDetails[]
    ) { }
}
