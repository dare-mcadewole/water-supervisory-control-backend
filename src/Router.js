/*
 * File: 'Router.js'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       Router for RESTIFY web server
 */
import DataSocket from './DataSocket';
import Logger from './Logger';

export default class Router {

    /**
     * 
     * @param {*} ServerInstance 
     */
    static initRoutes (ServerInstance) {
        Logger.info('Initializing Routes ... ');
        // Initialize and setup DataSocket
        DataSocket.initialize(ServerInstance);
        ServerInstance.get(
            '/api/carl',
            (req, reply, next) => {
                Logger.info('Receiving and Authenticating Client Request ... ');
                if (req.header('Authorization') !== `Bearer ${process.env.AUTH_KEY}`) {
                    return reply.send(403, { msg: 'UNAUTHORIZED' });
                }
                return next();
            },
            ({ query: { temperature, heart_rate } }, reply, next) => {
                // var query = req.query().match(/temperature=([0-9]+)&heart_rate=([0-9]+)/i);
                if (!isNaN(temperature) && !isNaN(heart_rate)) {
                    var heartRate = heart_rate;
                    DataSocket.updateSensorValues(temperature, heartRate);
                    reply.send({
                        msg: {
                            temperature,
                            heartRate
                        }
                    });
                } else {
                    reply.send(null);
                }
                return next();
            }
        );
        Logger.info('All Routes Initialized successfully!');
    }
}
 