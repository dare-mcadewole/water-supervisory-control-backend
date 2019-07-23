import Events from '../Events';
import Billing from '../models/Billing';

export default class BillingController {

    /**
     * 
     * @param {*} Socket 
     * @param {*} req 
     * @param {*} reply 
     * @param {*} next 
     */
    static updateBilling (Socket, {
        params: { terminal_id },
        body: { units }
    }, reply, next) {
        var billData = {
            terminal: terminal_id,
            units
        }
        Billing.update(billData);
        Socket.emit(Events.WMS_TERMINAL_BILLING_UPDATED, billData);
        reply.send(billData);
        return next();
    }
}
