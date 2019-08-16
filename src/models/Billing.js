import Store from '../Store';

class Billing {
    update ({terminal, units}) {
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
