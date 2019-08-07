import Datastore from 'nedb';
import path from 'path';

const BASE_PATH = path.resolve(__dirname, '../databases');

var tank = new Datastore({
    filename: `${BASE_PATH}/tank.db`,
    autoload: true
});

class Tank {
    initialize () {
        return new Promise((resolve, reject) => {
            tank.insert({
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
            tank.update(
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
            tank.update(
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
