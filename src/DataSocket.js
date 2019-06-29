/*
 * File: 'DataSocket'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       
 */
import SocketIO from 'socket.io';
import EventEmitter from 'eventemitter3';
import Logger from './Logger';
import sleep from 'thread-sleep';

class DataSocket extends EventEmitter {
    
    /**
     * 
     * @param {*} restifyServer 
     */
    initialize (restifyServer) {
        this._clients = [];
        this._sensorValues = {
            temperature: 0,
            heartRate: 0
        };
        Logger.info('Initializing Socket ...');
        var IO = SocketIO.listen(restifyServer.server);
        sleep(1000);

        Logger.info('Setting up Socket Authentication Middleware ... ');
        IO.use((socket, next) => {
            let token = socket.handshake.query.token;
            if (token === process.env.SOCKET_KEY) {
                return next();
            }
            return next(new Error('CARL_SOCKET_AUTH_ERROR'));
        });
        sleep(1500);

        IO.of('/carl').on('connection', (client) => {
            this._clients.push(client);
            Logger.info(`${this._clients.length} connection(s) opened!`);

            this.on('values-updated', ({ temperature, heartRate }) => {
                Logger.info(`[ NEW_DATA_ALERT ] Temperature is ${temperature}DEG and Heart Rate is ${heartRate}BPS`);
                client.emit('carl-data', { temperature, heartRate });
            });

            client.on('disconnect', () => {
                this._clients.splice(this._clients.indexOf(client), 1);
            });
        });
        Logger.info('Socket has been initialized successfully!');
    }

    /**
     * 
     * @param {*} temperature 
     * @param {*} heartRate 
     */
    updateSensorValues (temperature, heartRate) {
        this._sensorValues.temperature = temperature;
        this._sensorValues.heartRate = heartRate;
        this.emit('values-updated', this._sensorValues);
    }
}

export default new DataSocket();
