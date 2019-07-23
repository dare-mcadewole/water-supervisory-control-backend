import Datastore from 'nedb';
import path from 'path';

const BASE_PATH = path.resolve(__dirname, '../databases');

class Terminal {
    
    addData ({ terminal, sensor, value }) {
        var idealTerminal = new Datastore({
            filename: path.resolve(BASE_PATH, `terminal${terminal}.db`),
            autoload: true
        });
        idealTerminal.insert({
            sensor, value,
            createdDate: new Date()
        }, (err, doc) => {
            if (err) console.log('ERROR -> ', err);
        });
    }

    setState ({ terminal, state }) {
        var db = new Datastore({
            filename: `${BASE_PATH}/terminal-states.db`,
            autoload: true
        });
        db.update({ terminal }, {
            $set: { state }
        }, { upsert: true });
    }
}

export default new Terminal();
