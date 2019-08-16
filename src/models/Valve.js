
class Valve {

    /**
     * 
     * @param {*} terminalId 
     */
    async getValveState (terminalId) {
        return new Promise((resolve, reject) => {
            process.DB.collection('terminal_states').find({ terminal: terminalId }).limit(1).next((err, doc) => {
                if (err) reject(err);
                resolve(doc.state);
            });
        });
    }
}

export default new Valve();