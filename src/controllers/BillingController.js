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
    static async updateBilling (Socket, {
        params: { terminal_id },
        body: { units }
    }, reply, next) {
        var billData = {
            terminal: terminal_id,
            units
        };
        try {
            await Billing.update(billData);
            Socket.emit(Events.WMS_TERMINAL_BILLING_UPDATED, billData);
            reply.send(billData);
        } catch (e) {
            reply.send(e);
        } finally {
            return next();
        }
    }
}
