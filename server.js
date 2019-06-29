/*
 * File: 'server.js'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       Restify Server API entry point
 */
import sleep from 'thread-sleep';
// Import Environment Variables
Logger.info('Loading server configurations ... ');
sleep(1500);
require('dotenv').config();

import Restify from 'restify';
import Logger from './src/Logger';
import CORSMiddleware from 'restify-cors-middleware';

var Server = Restify.createServer({
    name: process.env.SERVER_NAME
});
Logger.info('Server is booting up ... ');
sleep(2000);

Logger.info('Registering QueryParser plugin ... ');
Server.use(Restify.plugins.queryParser());
sleep(1000);

Logger.info('Setting up CORS middleware');
const cors = CORSMiddleware({
    origins: [ '*' ],
    allowHeaders: [ 'Authorization' ],
    exposeHeaders: [ 'Authorization' ]
});
Server.pre(cors.preflight);
Server.use(cors.actual);
sleep(1500);

// Initialize routes
require('./src/Router').default.initRoutes(Server);

Server.listen(
    process.env.PORT,
    process.env.HOST,
    () => {
        sleep(3500);
        Logger.info(`Hello from CARL @ ${Server.url}`);
    }
);
