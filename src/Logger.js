/*
 * File: 'Logger.js'
 * Created by Dare McAdewole <dare.dev.adewole@gmail.com>
 * Created on Fri Jun 28 2019
 *
 * Copyright (c) 2019 Echwood Inc.
 *
 * Description:
 *       
 */
class Logger {

    /**
     * 
     * @param {*} message 
     */
    info (message) {
        var date = new Date();
        console.log(`[ ${date.toDateString()}, ${date.toTimeString().split(' ')[0]} ]\t${message}`);
    }
}

export default new Logger();
