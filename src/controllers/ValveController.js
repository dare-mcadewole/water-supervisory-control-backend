import Valve from '../models/Valve';

export default class ValveController {
    static async getValveState (req, reply, next) {
        var terminalId = req.params.terminal_id;
        try {
            var state = await Valve.getValveState(terminalId);
            reply.send(200, state === 0 ? '0' : '1');
        } catch (ex) {
            reply.send(ex);
        } finally {
            return next();
        }
    }
}
