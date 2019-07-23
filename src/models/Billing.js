import Datastore from 'nedb';
import path from 'path';

const BASE_PATH = path.resolve(__dirname, '../databases');

class Billing {
    update ({terminal, units}) {
        var db = new Datastore({
            filename: `${BASE_PATH}/billings.db`,
            autoload: true
        });
        db.update({ terminal }, { $set: { units } }, { upsert: true });
    }
}

export default new Billing();
