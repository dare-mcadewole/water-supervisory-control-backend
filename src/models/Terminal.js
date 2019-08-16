
class Terminal {
    
    addData ({ terminal, sensor, value }) {
        return new Promise((resolve, reject) => {
            process.DB.collection(`terminal${terminal}`).insertOne({
                sensor, value,
                createdDate: new Date()
            }, (err, doc) => {
                if (err) reject(err);
                resolve(doc);
            })
        });
    }

    setState ({ terminal, state }) {
        return new Promise((resolve, reject) => {
            process.DB.collection(`terminal_states`).findOneAndUpdate(
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
