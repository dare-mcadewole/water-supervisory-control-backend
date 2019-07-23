/*
 * File: 'WMSSocket.js'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       Socket for Sensor Data
 */
import SocketIO from 'socket.io';
import EventEmitter from 'eventemitter3';
import Logger from './Logger';
import sleep from 'thread-sleep';
import Events from './Events';

const WMS_NAMESPACE = '/wms';

// Day: 10 * 24
// Week: Day * 7
// Week * 52

class WMSSocket extends EventEmitter {
    
    /**
     * 
     * @param {*} restifyServer 
     */
    initialize (restifyServer) {
        this._flowGap = 3;
        this._clients = [];
        this._tanks = [
            { referenceSensor: 0, remoteSensor: 0,  }
        ];

        Logger.info('Initializing WMS Socket ...');
        var IO = SocketIO.listen(restifyServer.server);
        sleep(1000);

        Logger.info('Setting up Socket Authentication Middleware ... ');
        IO.use((socket, next) => {
            let token = socket.handshake.query.token;
            if (token === process.env.SOCKET_KEY) {
                return next();
            }
            return next(new Error('WMS_SOCKET_AUTHENTICATION_ERROR'));
        });
        sleep(1000);

        IO.of(WMS_NAMESPACE).on('connection', (client) => {
            this._clients.push(client);
            client.on('foo', console.log);
            client.emit(Events.WMS_TERMINALS, this._tanks);
            Logger.info(`${this._clients.length} connection(s) opened!`);

            this.on(Events.WMS_TERMINAL_DATA_UPDATED, (data) => {
                IO.of(WMS_NAMESPACE).emit(Events.WMS_TERMINAL_DATA, data);
                Logger.info(`[TERMINAL_DATA_UP] Terminal ${data.terminal}, sensor ${data.sensor} was updated with ${data.value}LPS`);
            });

            this.on(Events.WMS_TERMINAL_STATE_UPDATED, (data) => {
                IO.of(WMS_NAMESPACE).emit(Events.WMS_TERMINAL_STATE, data);
                Logger.info(`[TERMINAL_STATE_UP] Terminal ${data.terminal} is now ${data.state}`);
            });

            this.on(Events.WMS_TANK_PUMP_STATE_UPDATED, (data) => {
                IO.of(WMS_NAMESPACE).emit(Events.WMS_TANK_PUMP_STATE, data);
                Logger.info(`[TANK_PUMP_STATE] Pump is ${data.state}`);
            });

            this.on(Events.WMS_TANK_WATER_LEVEL_UPDATED, (data) => {
                IO.of(WMS_NAMESPACE).emit(Events.WMS_TANK_WATER_LEVEL, data);
                Logger.info(`[TANK_WATER_LEVEL] Water Level is ${data.level}`);
            });

            this.on(Events.WMS_TERMINAL_BILLING_UPDATED, (data) => {
                IO.of(WMS_NAMESPACE).emit(Events.WMS_TERMINAL_BILLING, data);
                Logger.info(`[TERMINAL_BILLING_UP] Terminal ${data.terminal} now has ${data.units} units`);
            });

            client.on('disconnect', () => {
                this._clients.splice(this._clients.indexOf(client), 1);
                Logger.info(`1 client disconnected, Clients left: ${this._clients.length}`);
            });
        });
        Logger.info('Socket has been initialized successfully!');
    }
}

export default new WMSSocket();
