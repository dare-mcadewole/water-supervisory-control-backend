import Datastore from 'nedb';
import path from 'path';

const BASE_PATH = path.resolve(__dirname, '../databases');

class Terminal {
    
    addData ({ terminal, sensor, value }) {
        // const Datastore = require('nedb-multi')(process.env.NEDB_MULTI_PORT);
        // var idealTerminal = new Datastore({
        //     filename: path.resolve(BASE_PATH, `terminal${terminal}.db`),
        //     autoload: true
        // });
        var { DB } = process;
        // idealTerminal.loadDatabase();
        return new Promise((resolve, reject) => {
            // idealTerminal.insert({
            //     sensor, value,
            //     createdDate: new Date()
            // });
            DB.collection(`terminal${terminal}`).insertOne({
                sensor, value,
                createdDate: new Date()
            }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            })
        });
    }

    setState ({ terminal, state }) {
        // const Datastore = require('nedb-multi')(process.env.NEDB_MULTI_PORT);
        var db = new Datastore({
            filename: `${BASE_PATH}/terminal-states.db`,
            autoload: true
        });
        // db.loadDatabase();
        return new Promise((resolve, reject) => {
            DB.collection(`terminal_states`).findOneAndUpdate(
                { terminal }, {
                    $set: { state }
                }, { upsert: true },
                (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }
}

export default new Terminal();
