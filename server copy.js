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
Logger.info('Loading WMS server configurations ... ');
// sleep(500);
require('dotenv').config();

import Restify from 'restify';
import Logger from './src/Logger';
import CORSMiddleware from 'restify-cors-middleware';

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect(err => {
    if (err) {
        console.log(err);
        return
    }
    Logger.info('MongoDB is connected!');
    process.DB = client.db('wsc');
});

var Server = Restify.createServer({
    name: process.env.SERVER_NAME
});
Logger.info('WMS Server is booting up ... ');
// sleep(700);

Logger.info('Registering QueryParser plugin ... ');
Server.use(Restify.plugins.queryParser());
Server.use(Restify.plugins.acceptParser(Server.acceptable));
Server.use(Restify.plugins.fullResponse());
Server.use(Restify.plugins.bodyParser());
// sleep(500);

Logger.info('Setting up CORS middleware');
const cors = CORSMiddleware({
    origins: ['*'],
    allowHeaders: [
        'Authorization',
        'Content-Type',
        'X-Requested-With'
    ],
    exposeHeaders: [
        'Authorization',
        'Content-Type',
        'X-Requested-With'
    ]
});
Server.pre(cors.preflight);
Server.use(cors.actual);
// sleep(500);

// Initialize routes
require('./src/Router').default.initRoutes(Server);

Server.listen(
    process.env.PORT,
    process.env.HOST,
    () => {
        // sleep(500);
        Logger.info(`Say 'Hello' to WMS Server @ ${Server.url}`);
    }
);
