import Events from '../Events';
import Tank from '../models/Tank';

export default class TankController {

    /**
     * 
     * @param {*} req 
     * @param {*} reply 
     * @param {*} next 
     */
    static initialize (req, reply, next) {
        Tank.initialize();
        reply.send({
            status: 201
        });
        return next();
    }

    /**
     * 
     * @param {*} Socket 
     * @param {*} req 
     * @param {*} reply 
     * @param {*} next 
     */
    static async setPumpState (Socket, { body: { state } }, reply, next) {
        try {
            await Tank.updatePumpState(state);
            Socket.emit(Events.WMS_TANK_PUMP_STATE_UPDATED, { state });
            reply.send({ state });
        } catch (e) {
            reply.send(e);
        } finally {
            return next();
        }
    }

    /**
     * 
     * @param {*} Socket 
     * @param {*} req 
     * @param {*} reply 
     * @param {*} next 
     */
    static async setWaterLevel (Socket, { body: { level } }, reply, next) {
        var tankHeight = 100;
        if (level > tankHeight) level = tankHeight;
        level = parseInt(tankHeight - (5 * level / 6));
        try {
            await Tank.updateTankLevel(level);
            Socket.emit(Events.WMS_TANK_WATER_LEVEL_UPDATED, { level });
            reply.send({ level });
        } catch (e) {
            reply.send(e);
        } finally {
            return next();
        }
    }
}
