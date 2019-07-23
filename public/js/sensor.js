// Sensor Vue Instance
Vue.use(Buefy);

var sensor = new Vue({
    el: '#sensor',

    data: {
        tank: 1,
        sensor: 1,
        sensorValue: 87,
        sendingData: false
    },

    methods: {
        updateSensorValue () {
            this.sendingData = true;
            fetch(
                `http://localhost:5555/api/tanks/${this.tank}?sensor_id=${this.sensor}&value=${this.sensorValue}`,
                {
                    headers: {
                        Authorization: 'Bearer TYl4k8I248n3fiqFxGSIinKFoFIXeUa8'
                    }
                }
            ).then(response => response.json()).then(
                data => {
                    if (data.msg) {
                        return this.toast.open({
                            type: 'is-info',
                            message: data.msg
                        });
                    }
                    this.$toast.open({
                        type: 'is-success',
                        message: `Tank ${this.tank}, Sensor ${this.sensor} flowing at ${this.sensorValue}LPM`
                    });
                    this.sendingData = false;
                }
            ).catch(err => {
                console.log(err);
                this.sendingData = false;
            });
        }
    }
});
