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
import Store from './Store';
import Billing from './models/Billing';

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
            if (!this._clients.includes(client)) {

                client.on(Events.WMS_CURRENT_BILLS_REQ, () => {
                    client.emit(Events.WMS_CURRENT_BILLS, Store.bills);
                });

                client.on(Events.WMS_TERMINALS_METERING_REQ, () => {
                    client.emit(Events.WMS_TERMINALS_METERING, Store.meterings);
                });

                // client.on(Events.WMS_TERMINALS_METERING_UPDATE, ({ terminal, metering }) => {
                //     Store.meterings[terminal - 1] = metering;
                //     client.emit(Events.WMS_TERMINALS_METERING, Store.meterings);
                // });

                this.on(Events.WMS_TERMINAL_DATA_UPDATED, (data) => {
                    // IO.of(WMS_NAMESPACE).emit(Events.WMS_TERMINAL_DATA, data);
                    client.emit(Events.WMS_TERMINAL_DATA, data);
                    if (data.sensor === 2) {
                        var flowLitre = parseFloat((data.value / 60).toFixed(2));
                        Store.meterings[data.terminal - 1] += flowLitre;
                        client.emit(Events.WMS_TERMINALS_METERING, Store.meterings);
                        // Update bill
                        if (Store.bills[data.terminal - 1] > flowLitre) {
                            Store.bills[data.terminal - 1] -= flowLitre;
                            // Billing.update({
                            //     terminal: data.terminal,
                            //     units: Store.bills[data.terminal - 1]
                            // });
                            client.emit(Events.WMS_CURRENT_BILLS, Store.bills);
                        } else {
                            Store.bills[data.terminal - 1] = 0;
                            client.emit(Events.WMS_CURRENT_BILLS, Store.bills);
                        }
                    }
                    Logger.info(
                        `[TERMINAL_DATA_UP] Terminal ${data.terminal}, sensor ${data.sensor} was updated with ${data.value}LPS`
                    );
                });
    
                this.on(Events.WMS_TERMINAL_STATE_UPDATED, (data) => {
                    client.emit(Events.WMS_TERMINAL_STATE, data);
                    Logger.info(`[TERMINAL_STATE_UP] Terminal ${data.terminal} is now ${data.state}`);
                });
    
                this.on(Events.WMS_TANK_PUMP_STATE_UPDATED, (data) => {
                    client.emit(Events.WMS_TANK_PUMP_STATE, data);
                    Logger.info(`[TANK_PUMP_STATE] Pump is ${data.state}`);
                });
    
                this.on(Events.WMS_TANK_WATER_LEVEL_UPDATED, (data) => {
                    client.emit(Events.WMS_TANK_WATER_LEVEL, data);
                    Logger.info(`[TANK_WATER_LEVEL] Water Level is ${data.level}`);
                });
    
                this.on(Events.WMS_TERMINAL_BILLING_UPDATED, (data) => {
                    client.emit(Events.WMS_TERMINAL_BILLING, data);
                    Logger.info(`[TERMINAL_BILLING_UP] Terminal ${data.terminal} now has ${data.units} units`);
                    Logger.info(`Bills: ${Store.bills}`);
                });
            }

            this._clients.push(client);
            client.emit(Events.WMS_TERMINALS, this._tanks);
            Logger.info(`${this._clients.length} connection(s) opened!`);

            client.on('disconnect', () => {
                this._clients.splice(this._clients.indexOf(client), 1);
                Logger.info(`1 client disconnected, Clients left: ${this._clients.length}`);
            });
        });
        Logger.info('Socket has been initialized successfully!');
    }
}

export default new WMSSocket();
