import Events from '../Events';
import Terminal from '../models/Terminal';

export default class TerminalController {

    /**
     * 
     * @param {*} Socket
     * @param {*} req 
     * @param {*} reply 
     * @param {*} next 
     */
    static async updateTerminal (Socket, { params: { terminal_id }, body: {
        sensor, value
    }}, reply, next) {
        var terminalData = {
            terminal: parseInt(terminal_id),
            sensor: parseInt(sensor),
            value: parseInt(value)
        };
        try {
            await Terminal.addData(terminalData);
            Socket.emit(Events.WMS_TERMINAL_DATA_UPDATED, terminalData);
            reply.send(terminalData);
        } catch (ex) {
            reply.send(ex);
        } finally {
            return next();
        }
    }

    /**
     * 
     * @param {*} Socket 
     * @param {*} param1 
     */
    static async updateTerminalState (Socket, {params: { terminal_id }, body: {
        state
    }}, reply, next) {
        var data = {
            terminal: terminal_id,
            state
        };
        try {
            await Terminal.setState(data);
            Socket.emit(Events.WMS_TERMINAL_STATE_UPDATED, data);
            reply.send(data);
        } catch (e) {
            reply.send(e);
        } finally {
            return next();
        }
    }
}
