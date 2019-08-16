
class Tank {
    initialize () {
        return new Promise((resolve, reject) => {
            process.DB.collection('tank').insertOne({
                wmsid: '6srftydgyewu',
                tankLevel: 0,
                pumpState: 0,
                createdDate: new Date()
            }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            });
        });
    }

    /**
     * 
     * @param {*} tankLevel 
     */
    updateTankLevel (tankLevel) {
        // Convert tank level to percentage
        return new Promise((resolve, reject) => {
            process.DB.collection('tank').findOneAndUpdate(
                {
                    wmsid: '6srftydgyewu'
                },
                { $set: { tankLevel } }, { upsert: true },
                (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }

    /**
     * 
     * @param {*} pumpState 
     */
    updatePumpState (pumpState) {
        return new Promise((resolve, reject) => {
            process.DB.collection('tank').findOneAndUpdate(
                {
                    wmsid: '6srftydgyewu'
                }, { $set: { pumpState } },
                { upsert: true },
                (err, doc) => {
                    if (err) reject(err);
                    resolve(doc);
                }
            );
        });
    }
}

export default new Tank();
