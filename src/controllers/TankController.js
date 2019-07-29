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
    static setPumpState (Socket, { body: { state } }, reply, next) {
        Tank.updatePumpState(state);
        Socket.emit(Events.WMS_TANK_PUMP_STATE_UPDATED, { state });
        reply.send({ state });
        return next();
    }

    /**
     * 
     * @param {*} Socket 
     * @param {*} req 
     * @param {*} reply 
     * @param {*} next 
     */
    static setWaterLevel (Socket, { body: { level } }, reply, next) {
        var tankHeight = 100;
        if (level > tankHeight) level = tankHeight;
        level = parseInt(tankHeight - (5 * level / 6));
        Tank.updateTankLevel(level);
        Socket.emit(Events.WMS_TANK_WATER_LEVEL_UPDATED, { level });
        reply.send({ level });
        return next();
    }
}
