import Datastore from 'nedb';
import path from 'path';

const BASE_PATH = path.resolve(__dirname, '../databases');

class Valve {

    /**
     * 
     * @param {*} terminalId 
     */
    async getValveState (terminalId) {
        // var db = new Datastore({
        //     filename: `${BASE_PATH}/terminal-states.db`,
        //     autoload: true
        // });
        return new Promise((resolve, reject) => {
            process.DB.collection('terminal_states').find({ terminal: terminalId }).limit(1).next((err, doc) => {
                if (err) reject(err);
                resolve(doc.state);
            });
        });
    }
}

export default new Valve();