import Datastore from 'nedb';
import path from 'path';
import Store from '../Store';

const BASE_PATH = path.resolve(__dirname, '../databases');

class Billing {
    update ({terminal, units}) {
        // var db = new Datastore({
        //     filename: `${BASE_PATH}/billings.db`,
        //     autoload: true
        // });
        return new Promise((resolve, reject) => {
            Store.bills[terminal - 1] += units;
            process.DB.collection('billings').findOneAndUpdate(
                { terminal }, { $set: { units } },
                { upsert: true },
                (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }
}

export default new Billing();
